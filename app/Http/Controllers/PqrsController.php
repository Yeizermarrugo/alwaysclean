<?php

namespace App\Http\Controllers;

use App\Models\PqrsCaso;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PqrsController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Pqrs', [
            'tipos' => PqrsCaso::TIPOS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'tipo' => ['required', 'in:peticion,queja,reclamo,sugerencia,felicitacion'],
            'nombre' => ['required', 'string', 'max:150'],
            'documento' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:150'],
            'telefono' => ['required', 'string', 'max:30'],
            'servicio_relacionado' => ['nullable', 'string', 'max:150'],
            'numero_orden' => ['nullable', 'string', 'max:50'],
            'descripcion' => ['required', 'string', 'max:2000'],
        ]);

        $caso = PqrsCaso::create($data);

        return redirect()->route('pqrs.create')->with('caso', $caso->caso);
    }
}
