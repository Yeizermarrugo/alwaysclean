<?php

namespace App\Http\Controllers;

use App\Models\Cotizacion;
use App\Models\CotizacionEvento;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class InternoController extends Controller
{
    public function bandeja(Request $request): Response
    {
        $todas = Cotizacion::orderByDesc('created_at')->get();

        $canal = $request->query('canal');
        $listado = $canal ? $todas->where('canal', $canal) : $todas;

        $casoSeleccionado = $request->query('caso');
        $seleccionadaModelo = $casoSeleccionado
            ? Cotizacion::with('eventos')->firstWhere('caso', $casoSeleccionado)
            : Cotizacion::with('eventos')->find($listado->first()?->id);

        $seleccionada = $seleccionadaModelo ? array_merge($seleccionadaModelo->toArray(), [
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
                'canal' => ucfirst($c->canal),
                'estado' => $c->estado,
                'estadoLabel' => Cotizacion::ESTADOS[$c->estado] ?? $c->estado,
                'recibida' => $c->created_at->diffForHumans(['short' => true]),
            ]),
            'stats' => [
                'nuevasHoy' => $todas->where('created_at', '>=', Carbon::today())->count(),
                'sinResponder' => $todas->where('estado', 'nueva')->where('created_at', '<', Carbon::now()->subHours(24))->count(),
                'enviadasSemana' => $todas->whereIn('estado', ['cotizada', 'agendada', 'en_ejecucion'])->where('created_at', '>=', Carbon::now()->subWeek())->count(),
                'tasaCierre' => $todas->count() ? round($todas->where('estado', 'cerrada_ganada')->count() / $todas->count() * 100) : 0,
            ],
            'canalActivo' => $canal,
            'estados' => Cotizacion::ESTADOS,
            'seleccionada' => $seleccionada,
        ]);
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
