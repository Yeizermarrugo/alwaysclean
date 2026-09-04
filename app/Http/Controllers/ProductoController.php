<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Productos/Index', [
            'productos' => Producto::orderBy('orden')->get(),
        ]);
    }
}
