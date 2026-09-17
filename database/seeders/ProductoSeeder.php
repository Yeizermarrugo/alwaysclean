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
                'imagen' => 'https://images.unsplash.com/photo-1532634766-c2761df5daba?auto=format&fit=crop&w=900&q=75',
            ],
            [
                'codigo' => 'DX',
                'nombre' => 'Drenex Bio',
                'descripcion' => 'Desatascador enzimático biodegradable para redes de drenaje, bajantes y sifones de alto tráfico.',
                'aplicacion' => 'Drenajes y bajantes',
                'presentacion' => 'Bidón 20 L · Galón 4 L',
                'imagen' => 'https://images.unsplash.com/photo-1589523321840-7ef183c12511?auto=format&fit=crop&w=900&q=75',
            ],
            [
                'codigo' => 'SR',
                'nombre' => 'Sanitred',
                'descripcion' => 'Desincrustante y desodorizante biodegradable para orinales y sanitarios de alto tráfico.',
                'aplicacion' => 'Orinales y sanitarios',
                'presentacion' => 'Galón 4 L',
                'imagen' => 'https://images.unsplash.com/photo-1639112389900-a858bf671be1?auto=format&fit=crop&w=900&q=75',
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
