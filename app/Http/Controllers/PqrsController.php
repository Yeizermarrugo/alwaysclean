<?php

namespace App\Http\Controllers;

use App\Mail\PqrsCasoRecibido;
use App\Models\PqrsCaso;
use App\Rules\Turnstile;
use App\Support\IpVisitante;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PqrsController extends Controller
{
    /** Segundos mínimos entre abrir el formulario y enviarlo (menos = bot). */
    public const TIEMPO_MINIMO = 3;

    /** Casos creados permitidos por IP por hora y por email por día. */
    public const MAX_POR_IP_HORA = 5;

    public const MAX_POR_EMAIL_DIA = 3;

    public function create(): Response
    {
        return Inertia::render('Pqrs', [
            'tipos' => PqrsCaso::TIPOS,
            'inicio' => Crypt::encryptString((string) now()->timestamp),
            'turnstileSiteKey' => Turnstile::activo() ? config('services.turnstile.site_key') : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Honeypot: campo invisible para personas. Si viene lleno, fingimos éxito
        // para que el bot no aprenda a esquivarlo, pero no guardamos nada.
        if (filled($request->input('sitio_web'))) {
            return redirect()->route('pqrs.create')->with('caso', PqrsCaso::nuevoNumeroCaso());
        }

        $this->validarTiempoDeLlenado($request->input('inicio'));

        $data = $request->validate([
            'tipo' => ['required', 'in:'.implode(',', array_keys(PqrsCaso::TIPOS))],
            'nombre' => ['required', 'string', 'max:150'],
            'documento' => ['required', 'string', 'max:30'],
            // En tests no hay red para consultar DNS.
            'email' => ['required', app()->runningUnitTests() ? 'email:rfc' : 'email:rfc,dns', 'max:150'],
            'telefono' => ['required', 'string', 'max:30'],
            'servicio_relacionado' => ['nullable', 'string', 'max:150'],
            'numero_orden' => ['nullable', 'string', 'max:50'],
            'descripcion' => ['required', 'string', 'max:2000'],
            'acepta_datos' => ['accepted'],
            'cf-turnstile-response' => Turnstile::activo() ? [new Turnstile] : [],
        ], [
            'acepta_datos.accepted' => 'Debe aceptar el tratamiento de datos personales para radicar el caso.',
        ]);

        $email = mb_strtolower(trim($data['email']));

        // Mismo email + misma descripción en 24 h: es un reenvío (doble clic, recarga).
        // Devolvemos el caso existente sin crear otro ni mandar otro correo.
        // Va en caché y no en una consulta porque la conexión pública no puede leer la tabla.
        $claveDuplicado = 'pqrs-dup:'.sha1($email."\n".$data['descripcion']);

        if ($casoPrevio = Cache::get($claveDuplicado)) {
            return redirect()->route('pqrs.create')->with('caso', $casoPrevio);
        }

        $claveIp = 'pqrs-caso-ip:'.IpVisitante::de($request);
        $claveEmail = 'pqrs-caso-email:'.sha1($email);

        if (RateLimiter::tooManyAttempts($claveIp, self::MAX_POR_IP_HORA)
            || RateLimiter::tooManyAttempts($claveEmail, self::MAX_POR_EMAIL_DIA)) {
            throw ValidationException::withMessages([
                'form' => 'Ya recibimos varios casos recientes con estos datos. Si necesita agregar información, responda al correo de confirmación.',
            ]);
        }

        $caso = PqrsCaso::radicar([
            ...collect($data)->except(['acepta_datos', 'cf-turnstile-response'])->all(),
            'email' => $email,
            'consentimiento_at' => now(),
        ]);

        Cache::put($claveDuplicado, $caso->caso, now()->addDay());
        RateLimiter::hit($claveIp, 3600);
        RateLimiter::hit($claveEmail, 86400);

        Mail::to($caso->email)->queue(new PqrsCasoRecibido($caso->caso, $caso->tipo));

        return redirect()->route('pqrs.create')->with('caso', $caso->caso);
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
