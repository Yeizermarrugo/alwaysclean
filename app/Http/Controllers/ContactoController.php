<?php

namespace App\Http\Controllers;

use App\Models\Cotizacion;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class ContactoController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Contacto', [
            'servicios' => Servicio::orderBy('orden')->get(['id', 'nombre', 'categoria']),
        ]);
    }

    public function store(Request $request): SymfonyResponse
    {
        $data = $request->validate([
            'servicios' => ['required', 'array', 'min:1'],
            'servicios.*' => ['string'],
            'empresa' => ['required', 'string', 'max:150'],
            'nit' => ['nullable', 'string', 'max:30'],
            'ciudad' => ['required', 'string', 'max:100'],
            'direccion' => ['nullable', 'string', 'max:200'],
            'area_m2' => ['nullable', 'integer', 'min:1'],
            'fecha_deseada' => ['nullable', 'date'],
            'detalle' => ['nullable', 'string', 'max:2000'],
            'frecuencia' => ['required', 'in:una_vez,mensual,trimestral,anual'],
            'whatsapp' => ['required', 'string', 'max:30'],
        ]);

        $cotizacion = Cotizacion::create($data + ['canal' => 'web']);

        $mensaje = "Hola, quiero cotizar: {$cotizacion->servicios[0]}"
            .(count($cotizacion->servicios) > 1 ? ' y '.(count($cotizacion->servicios) - 1).' servicio(s) más' : '')
            .". Empresa: {$cotizacion->empresa}, {$cotizacion->ciudad}. Frecuencia: ".str_replace('_', ' ', $cotizacion->frecuencia)
            .". Caso {$cotizacion->caso}.";

        return Inertia::location('https://wa.me/'.config('company.whatsapp').'?text='.urlencode($mensaje));
    }
}
