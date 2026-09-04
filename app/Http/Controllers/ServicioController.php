<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServicioController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'destacados' => Servicio::orderBy('orden')->where('destacado', true)->limit(8)->get(),
            'todos' => Servicio::orderBy('orden')->get(['id', 'codigo', 'slug', 'nombre', 'meta']),
            'conteos' => $this->conteosPorCategoria(),
            'productos' => Producto::orderBy('orden')->get(),
        ]);
    }

    public function index(Request $request): Response
    {
        $categoria = $request->query('categoria');

        $servicios = Servicio::orderBy('orden')
            ->when($categoria, fn ($query) => $query->where('categoria', $categoria))
            ->get();

        return Inertia::render('Servicios/Index', [
            'servicios' => $servicios,
            'conteos' => $this->conteosPorCategoria(),
            'categoriaActiva' => $categoria,
            'categorias' => Servicio::CATEGORIAS,
        ]);
    }

    public function show(Servicio $servicio): Response
    {
        $servicio->load('imagenes');

        return Inertia::render('Servicios/Show', [
            'servicio' => $servicio,
        ]);
    }

    private function conteosPorCategoria(): array
    {
        return Servicio::selectRaw('categoria, count(*) as total')
            ->groupBy('categoria')
            ->pluck('total', 'categoria')
            ->toArray();
    }
}
