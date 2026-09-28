<?php

namespace App\Http\Controllers;

use App\Mail\CotizacionRecibida;
use App\Models\Cotizacion;
use App\Models\Servicio;
use App\Rules\Turnstile;
use App\Support\IpVisitante;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class ContactoController extends Controller
{
    /** Segundos mínimos entre abrir el formulario y enviarlo (son 3 pasos; menos = bot). */
    public const TIEMPO_MINIMO = 5;

    /** Cotizaciones creadas permitidas por IP por hora y por WhatsApp por día. */
    public const MAX_POR_IP_HORA = 5;

    public const MAX_POR_WHATSAPP_DIA = 3;

    public function create(): Response
    {
        return Inertia::render('Contacto', [
            'servicios' => Servicio::activos()->orderBy('orden')->get(['id', 'nombre', 'categoria']),
            'maps' => [
                'key' => config('services.google_maps.browser_key'),
                'mapId' => config('services.google_maps.map_id'),
            ],
            'inicio' => Crypt::encryptString((string) now()->timestamp),
            'turnstileSiteKey' => Turnstile::activo() ? config('services.turnstile.site_key') : null,
        ]);
    }

    public function store(Request $request): SymfonyResponse
    {
        // Honeypot: si viene lleno, fingimos éxito (mismo destino que un envío real)
        // para que el bot no aprenda a esquivarlo, pero no guardamos nada.
        if (filled($request->input('sitio_web'))) {
            return Inertia::location('https://wa.me/'.config('company.whatsapp'));
        }

        $this->validarTiempoDeLlenado($request->input('inicio'));

        $request->merge(['whatsapp_normalizado' => Cotizacion::normalizarTelefono($request->input('whatsapp'))]);

        $data = $request->validate([
            'servicios' => ['required', 'array', 'min:1', 'max:10'],
            // Solo servicios visibles: uno oculto desde el panel ya no se puede cotizar.
            'servicios.*' => ['string', 'distinct', Rule::in(Servicio::activos()->pluck('nombre')->all())],
            'empresa' => ['required', 'string', 'max:150'],
            'nit' => ['nullable', 'string', 'max:30'],
            'ciudad' => ['required', 'string', 'max:100'],
            'direccion' => ['required', 'string', 'max:200'],
            'referencia' => ['nullable', 'string', 'max:200'],
            // Solo con el pin del mapa; ambas o ninguna. Rango aproximado de Colombia.
            'latitud' => ['nullable', 'required_with:longitud', 'numeric', 'between:-5,14'],
            'longitud' => ['nullable', 'required_with:latitud', 'numeric', 'between:-82,-66'],
            'place_id' => ['nullable', 'string', 'max:255'],
            'area_m2' => ['nullable', 'integer', 'min:1', 'max:10000000'],
            'fecha_deseada' => ['nullable', 'date', 'after_or_equal:today'],
            'detalle' => ['nullable', 'string', 'max:2000'],
            'frecuencia' => ['required', 'in:una_vez,mensual,trimestral,anual'],
            'whatsapp' => ['required', 'string', 'max:30'],
            'whatsapp_normalizado' => ['required'],
            'cf-turnstile-response' => Turnstile::activo() ? [new Turnstile] : [],
        ], [
            'servicios.*.in' => 'Seleccione los servicios de la lista.',
            'whatsapp_normalizado.required' => 'Escriba un celular colombiano de 10 dígitos (ej. 300 123 4567) o un fijo que empiece por 60.',
            'fecha_deseada.after_or_equal' => 'La fecha deseada no puede ser anterior a hoy.',
        ]);

        $telefono = $data['whatsapp_normalizado'];

        // Mismo WhatsApp + mismos servicios en 24 h: es un reenvío (doble clic, volver
        // atrás). Se devuelve la cotización existente sin crear otra.
        $servicios = collect($data['servicios'])->sort()->values()->all();
        $claveDuplicado = 'cotizacion-dup:'.sha1($telefono."\n".implode("\n", $servicios));

        if ($casoPrevio = Cache::get($claveDuplicado)) {
            if ($previa = Cotizacion::firstWhere('caso', $casoPrevio)) {
                return $this->irAWhatsApp($previa);
            }
        }

        $claveIp = 'cotizacion-ip:'.IpVisitante::de($request);
        $claveTelefono = 'cotizacion-tel:'.sha1($telefono);

        if (RateLimiter::tooManyAttempts($claveIp, self::MAX_POR_IP_HORA)
            || RateLimiter::tooManyAttempts($claveTelefono, self::MAX_POR_WHATSAPP_DIA)) {
            throw ValidationException::withMessages([
                'form' => 'Ya recibimos varias solicitudes recientes con estos datos. Si necesita agregar algo, escríbanos por WhatsApp.',
            ]);
        }

        $cotizacion = Cotizacion::registrar([
            ...collect($data)->except(['whatsapp_normalizado', 'cf-turnstile-response'])->all(),
            'whatsapp' => Cotizacion::formatearTelefono($telefono),
            'canal' => 'web',
        ]);

        Cache::put($claveDuplicado, $cotizacion->caso, now()->addDay());
        RateLimiter::hit($claveIp, 3600);
        RateLimiter::hit($claveTelefono, 86400);

        // Aviso al equipo (en cola: si el correo falla, el cliente igual sigue a WhatsApp).
        if ($destinatarios = config('notificaciones.cotizaciones')) {
            Mail::to($destinatarios)->queue(new CotizacionRecibida($cotizacion));
        }

        return $this->irAWhatsApp($cotizacion);
    }

    private function irAWhatsApp(Cotizacion $cotizacion): SymfonyResponse
    {
        $mensaje = "Hola, quiero cotizar: {$cotizacion->servicios[0]}"
            .(count($cotizacion->servicios) > 1 ? ' y '.(count($cotizacion->servicios) - 1).' servicio(s) más' : '')
            .". Empresa: {$cotizacion->empresa}, {$cotizacion->ciudad}. Frecuencia: ".str_replace('_', ' ', $cotizacion->frecuencia)
            .". Sede: {$cotizacion->direccion}"
            .($cotizacion->tieneCoordenadas() ? " ({$cotizacion->mapsUrl()})" : '')
            .". Caso {$cotizacion->caso}.";

        return Inertia::location('https://wa.me/'.config('company.whatsapp').'?text='.urlencode($mensaje));
    }

    private function validarTiempoDeLlenado(mixed $inicio): void
    {
        try {
            $abierto = (int) Crypt::decryptString((string) $inicio);
        } catch (DecryptException) {
            $abierto = null;
        }

        if (! $abierto || now()->timestamp - $abierto < self::TIEMPO_MINIMO) {
            throw ValidationException::withMessages([
                'form' => 'No pudimos procesar el formulario. Recargue la página e inténtelo de nuevo.',
            ]);
        }
    }
}
