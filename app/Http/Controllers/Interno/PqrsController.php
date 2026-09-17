<?php

namespace App\Http\Controllers\Interno;

use App\Http\Controllers\Controller;
use App\Models\PqrsCaso;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PqrsController extends Controller
{
    public function index(Request $request): Response
    {
        $todos = PqrsCaso::orderByDesc('created_at')->get();

        $casoSeleccionado = $request->query('caso');
        $seleccionada = $casoSeleccionado
            ? PqrsCaso::firstWhere('caso', $casoSeleccionado)
            : $todos->first();

        if ($seleccionada && ! $seleccionada->leido_at) {
            $seleccionada->update(['leido_at' => now()]);
        }

        return Inertia::render('Interno/Pqrs/Index', [
            'inbox' => $todos->map(fn (PqrsCaso $c) => [
                'caso' => $c->caso,
                'tipo' => $c->tipo,
                'tipoLabel' => PqrsCaso::TIPOS[$c->tipo] ?? $c->tipo,
                'nombre' => $c->nombre,
                'estado' => $c->estado,
                'estadoLabel' => PqrsCaso::ESTADOS[$c->estado] ?? $c->estado,
                'noLeido' => is_null($c->leido_at),
                'recibida' => $c->created_at->diffForHumans(['short' => true]),
            ]),
            'tipos' => PqrsCaso::TIPOS,
            'estados' => PqrsCaso::ESTADOS,
            'seleccionada' => $seleccionada,
        ]);
    }

    public function update(Request $request, PqrsCaso $pqrsCaso): RedirectResponse
    {
        $data = $request->validate([
            'estado' => ['required', 'in:'.implode(',', array_keys(PqrsCaso::ESTADOS))],
        ]);

        $pqrsCaso->update($data);

        return back();
    }
}
