<?php

namespace Tests\Feature\Concerns;

use App\Models\Servicio;
use Illuminate\Support\Facades\Crypt;

trait DatosCotizacion
{
    /** Laravel lo llama solo en setUp() por llamarse setUp + nombre del trait. */
    protected function setUpDatosCotizacion(): void
    {
        config(['services.turnstile.secret_key' => null, 'services.turnstile.site_key' => null]);

        Servicio::create([
            'codigo' => 'S01', 'slug' => 'lavado-de-tanques', 'categoria' => 'sanitarios',
            'nombre' => 'Lavado de tanques', 'resumen' => '-', 'descripcion' => '-', 'meta' => '-',
            'imagen_hint' => '-', 'incluye' => [], 'sectores' => [],
        ]);
    }

    private function datos(array $extra = []): array
    {
        return [
            'servicios' => ['Lavado de tanques'],
            'empresa' => 'Hotel Caribe S.A.S.',
            'ciudad' => 'Cartagena de Indias',
            'direccion' => 'Cra. 1 # 2-87, Bocagrande',
            'frecuencia' => 'una_vez',
            'whatsapp' => '300 000 0000',
            'sitio_web' => '',
            'inicio' => Crypt::encryptString((string) now()->subMinute()->timestamp),
            ...$extra,
        ];
    }
}
