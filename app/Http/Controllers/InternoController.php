<?php

namespace App\Http\Controllers;

use App\Models\Cotizacion;
use App\Models\CotizacionEvento;
use App\Models\Servicio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InternoController extends Controller
{
    /** Los timestamps se guardan en UTC; los días del filtro y de "hoy" son los de Colombia. */
    private const ZONA_NEGOCIO = 'America/Bogota';

    public function bandeja(Request $request): Response
    {
        $todas = Cotizacion::orderByDesc('created_at')->get();

        $canal = $request->query('canal');
        [$desde, $hasta] = $this->rangoFechas($request);

        $listado = $todas
            ->when($canal, fn ($c) => $c->where('canal', $canal))
            ->when($desde, fn ($c) => $c->where('created_at', '>=', $desde->copy()->startOfDay()->utc()))
            ->when($hasta, fn ($c) => $c->where('created_at', '<=', $hasta->copy()->endOfDay()->utc()));

        $casoSeleccionado = $request->query('caso');
        $seleccionadaModelo = $casoSeleccionado
            ? Cotizacion::with('eventos')->firstWhere('caso', $casoSeleccionado)
            : Cotizacion::with('eventos')->find($listado->first()?->id);

        $seleccionada = $seleccionadaModelo ? array_merge($seleccionadaModelo->toArray(), [
            'canal_label' => Cotizacion::CANALES[$seleccionadaModelo->canal] ?? $seleccionadaModelo->canal,
            'maps_url' => $seleccionadaModelo->mapsUrl(),
            'eventos' => $seleccionadaModelo->eventos->map(fn (CotizacionEvento $ev) => [
                'id' => $ev->id,
                'usuario' => $ev->usuario,
                'estado_anterior' => $ev->estado_anterior,
                'estado_nuevo' => $ev->estado_nuevo,
                'cuadrilla' => $ev->cuadrilla,
                'nota' => $ev->nota,
                'created_at_human' => $ev->created_at->diffForHumans(['short' => true]),
            ]),
        ]) : null;

        return Inertia::render('Interno/Bandeja', [
            'inbox' => $listado->values()->map(fn (Cotizacion $c) => [
                'caso' => $c->caso,
                'cliente' => $c->empresa,
                'servicio' => $c->servicios[0] ?? '',
                'sede' => $c->ciudad,
                'ubicada' => $c->tieneCoordenadas(),
                'canal' => Cotizacion::CANALES[$c->canal] ?? $c->canal,
                'estado' => $c->estado,
                'estadoLabel' => Cotizacion::ESTADOS[$c->estado] ?? $c->estado,
                'recibida' => $c->created_at->diffForHumans(['short' => true]),
            ]),
            'stats' => [
                'nuevasHoy' => $todas->where('created_at', '>=', Carbon::today(self::ZONA_NEGOCIO)->utc())->count(),
                'sinResponder' => $todas->where('estado', 'nueva')->where('created_at', '<', Carbon::now()->subHours(24))->count(),
                'enviadasSemana' => $todas->whereIn('estado', ['cotizada', 'agendada', 'en_ejecucion'])->where('created_at', '>=', Carbon::now()->subWeek())->count(),
                'tasaCierre' => $todas->count() ? round($todas->where('estado', 'cerrada_ganada')->count() / $todas->count() * 100) : 0,
            ],
            'canalActivo' => $canal,
            'rango' => ['desde' => $desde?->toDateString(), 'hasta' => $hasta?->toDateString()],
            'totalCotizaciones' => $todas->count(),
            'estados' => Cotizacion::ESTADOS,
            'seleccionada' => $seleccionada,
            'mapsKey' => config('services.google_maps.browser_key'),
            'mapId' => config('services.google_maps.map_id'),
            'serviciosCatalogo' => Servicio::orderBy('orden')->pluck('nombre'),
        ]);
    }

    /**
     * Cotización registrada a mano desde el panel (llamada, WhatsApp directo,
     * visita). Sin límites antiabuso: solo usuarios autenticados llegan aquí.
     */
    public function crear(Request $request): RedirectResponse
    {
        $request->merge(['telefono_normalizado' => Cotizacion::normalizarTelefono($request->input('whatsapp'))]);

        $data = $request->validate([
            'canal' => ['required', 'in:whatsapp,telefono,web'],
            'servicios' => ['required', 'array', 'min:1', 'max:10'],
            'servicios.*' => ['string', 'distinct', Rule::in(Servicio::pluck('nombre')->all())],
            'empresa' => ['required', 'string', 'max:150'],
            'nit' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['required', 'string', 'max:30'],
            'telefono_normalizado' => ['required'],
            'ciudad' => ['required', 'string', 'max:100'],
            // Por teléfono a veces aún no se tiene la dirección; el panel avisa que falta.
            'direccion' => ['nullable', 'string', 'max:200'],
            'referencia' => ['nullable', 'string', 'max:200'],
            'latitud' => ['nullable', 'required_with:longitud', 'numeric', 'between:-5,14'],
            'longitud' => ['nullable', 'required_with:latitud', 'numeric', 'between:-82,-66'],
            'place_id' => ['nullable', 'string', 'max:255'],
            'area_m2' => ['nullable', 'integer', 'min:1', 'max:10000000'],
            'fecha_deseada' => ['nullable', 'date'],
            'detalle' => ['nullable', 'string', 'max:2000'],
            'frecuencia' => ['required', 'in:una_vez,mensual,trimestral,anual'],
            'estado' => ['required', Rule::in(array_keys(Cotizacion::ESTADOS))],
            'cuadrilla' => ['nullable', 'string', 'max:100'],
            'nota' => ['nullable', 'string', 'max:500'],
        ], [
            'required' => 'Este campo es obligatorio.',
            'max' => 'Máximo :max caracteres.',
            'integer' => 'Debe ser un número entero.',
            'date' => 'Fecha no válida.',
            'servicios.required' => 'Agregue al menos un servicio.',
            'servicios.*.in' => 'Seleccione los servicios de la lista.',
            'telefono_normalizado.required' => 'Escriba un celular de 10 dígitos (3xx) o un fijo que empiece por 60.',
            'area_m2.min' => 'Debe ser mayor que cero.',
            'area_m2.max' => 'Área demasiado grande.',
            'latitud.*' => 'La ubicación del mapa no es válida.',
            'longitud.*' => 'La ubicación del mapa no es válida.',
        ]);

        $cotizacion = Cotizacion::registrar([
            ...collect($data)->except(['telefono_normalizado', 'nota'])->all(),
            'whatsapp' => Cotizacion::formatearTelefono($data['telefono_normalizado']),
        ]);

        CotizacionEvento::create([
            'cotizacion_id' => $cotizacion->id,
            'usuario' => $request->user()->name,
            'estado_anterior' => null,
            'estado_nuevo' => $cotizacion->estado,
            'cuadrilla' => $cotizacion->cuadrilla,
            'nota' => trim('Registrada desde el panel. '.($data['nota'] ?? '')),
        ]);

        return redirect()->route('interno.bandeja', ['caso' => $cotizacion->caso])
            ->with('caso', $cotizacion->caso);
    }

    /**
     * Rango de fechas del filtro (?desde=AAAA-MM-DD&hasta=AAAA-MM-DD). Fechas
     * inválidas se ignoran; si vienen invertidas se intercambian.
     *
     * @return array{0: ?Carbon, 1: ?Carbon}
     */
    private function rangoFechas(Request $request): array
    {
        $leer = function (?string $valor): ?Carbon {
            if (! $valor || ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $valor)) {
                return null;
            }
            $fecha = Carbon::createFromFormat('!Y-m-d', $valor, self::ZONA_NEGOCIO);

            return $fecha && $fecha->format('Y-m-d') === $valor ? $fecha : null;
        };

        $desde = $leer($request->query('desde'));
        $hasta = $leer($request->query('hasta'));

        if ($desde && $hasta && $desde->gt($hasta)) {
            [$desde, $hasta] = [$hasta, $desde];
        }

        return [$desde, $hasta];
    }

    public function actualizar(Request $request, Cotizacion $cotizacion)
    {
        $data = $request->validate([
            'estado' => ['required', 'in:'.implode(',', array_keys(Cotizacion::ESTADOS))],
            'cuadrilla' => ['nullable', 'string', 'max:100'],
            'motivo_perdida' => ['nullable', 'string', 'max:200'],
            'nota' => ['nullable', 'string', 'max:500'],
        ]);

        $cambioEstado = $data['estado'] !== $cotizacion->estado;
        $cambioCuadrilla = ($data['cuadrilla'] ?? null) !== $cotizacion->cuadrilla;

        if ($cambioEstado || $cambioCuadrilla || filled($data['nota'] ?? null)) {
            CotizacionEvento::create([
                'cotizacion_id' => $cotizacion->id,
                'usuario' => $request->user()->name,
                'estado_anterior' => $cambioEstado ? $cotizacion->estado : null,
                'estado_nuevo' => $cambioEstado ? $data['estado'] : null,
                'cuadrilla' => $data['cuadrilla'] ?? $cotizacion->cuadrilla,
                'nota' => $data['nota'] ?? null,
            ]);
        }

        $cotizacion->update([
            'estado' => $data['estado'],
            'cuadrilla' => $data['cuadrilla'] ?? $cotizacion->cuadrilla,
            'motivo_perdida' => $data['estado'] === 'cerrada_perdida' ? ($data['motivo_perdida'] ?? $cotizacion->motivo_perdida) : null,
        ]);

        return back();
    }
}
