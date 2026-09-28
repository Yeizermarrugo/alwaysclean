<?php

namespace Tests\Feature;

use App\Models\Cotizacion;
use App\Models\Servicio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CotizacionPanelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Servicio::create([
            'codigo' => 'S01', 'slug' => 'lavado-de-tanques', 'categoria' => 'sanitarios',
            'nombre' => 'Lavado de tanques', 'resumen' => '-', 'descripcion' => '-', 'meta' => '-',
            'imagen_hint' => '-', 'incluye' => [], 'sectores' => [],
        ]);
    }

    private function datos(array $extra = []): array
    {
        return [
            'canal' => 'telefono',
            'servicios' => ['Lavado de tanques'],
            'empresa' => 'Conjunto Los Almendros',
            'whatsapp' => '605 600 1234',
            'ciudad' => 'Cartagena de Indias',
            'frecuencia' => 'trimestral',
            'estado' => 'contactada',
            'cuadrilla' => 'Cuadrilla 1',
            'nota' => 'Llamó la administradora.',
            ...$extra,
        ];
    }

    public function test_requiere_sesion(): void
    {
        $this->post('/interno/cotizaciones', $this->datos())->assertRedirect(route('login'));
        $this->assertSame(0, Cotizacion::count());
    }

    public function test_crea_cotizacion_con_bitacora_y_la_selecciona(): void
    {
        $user = User::factory()->create(['name' => 'Marcela']);

        $respuesta = $this->actingAs($user)->post('/interno/cotizaciones', $this->datos());

        $c = Cotizacion::sole();
        $respuesta->assertRedirect(route('interno.bandeja', ['caso' => $c->caso]));
        $this->assertSame('telefono', $c->canal);
        $this->assertSame('contactada', $c->estado);
        $this->assertSame('605 600 1234', $c->whatsapp);
        $this->assertNull($c->direccion);

        $evento = $c->eventos()->sole();
        $this->assertSame('Marcela', $evento->usuario);
        $this->assertSame('contactada', $evento->estado_nuevo);
        $this->assertStringContainsString('Llamó la administradora.', $evento->nota);
    }

    public function test_valida_servicios_telefono_y_estado(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/interno/cotizaciones', $this->datos([
                'servicios' => ['Inventado'],
                'whatsapp' => '123',
                'estado' => 'borrado',
            ]))
            ->assertSessionHasErrors(['servicios.0', 'telefono_normalizado', 'estado']);

        $this->assertSame(0, Cotizacion::count());
    }
}
