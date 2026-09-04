<?php

namespace Database\Seeders;

use App\Models\Producto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $productos = [
            [
                'codigo' => 'BG',
                'nombre' => 'Biograsa Plus',
                'descripcion' => 'Solvente biodegradable de alta concentración para el control de grasa en trampas de cocinas industriales.',
                'aplicacion' => 'Trampas de grasa',
                'presentacion' => 'Bidón 20 L',
            ],
            [
                'codigo' => 'DX',
                'nombre' => 'Drenex Bio',
                'descripcion' => 'Desatascador enzimático biodegradable para redes de drenaje, bajantes y sifones de alto tráfico.',
                'aplicacion' => 'Drenajes y bajantes',
                'presentacion' => 'Bidón 20 L · Galón 4 L',
            ],
            [
                'codigo' => 'SR',
                'nombre' => 'Sanitred',
                'descripcion' => 'Desincrustante y desodorizante biodegradable para orinales y sanitarios de alto tráfico.',
                'aplicacion' => 'Orinales y sanitarios',
                'presentacion' => 'Galón 4 L',
            ],
        ];

        foreach ($productos as $i => $producto) {
            Producto::create(array_merge($producto, [
                'slug' => Str::slug($producto['nombre']),
                'orden' => $i + 1,
            ]));
        }
    }
}
