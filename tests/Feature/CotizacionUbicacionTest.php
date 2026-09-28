<?php

namespace Tests\Feature;

use App\Models\Cotizacion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Concerns\DatosCotizacion;
use Tests\TestCase;

class CotizacionUbicacionTest extends TestCase
{
    use DatosCotizacion, RefreshDatabase;

    public function test_guarda_la_ubicacion_marcada_en_el_mapa(): void
    {
        $this->post('/contacto', $this->datos([
            'referencia' => 'Torre B',
            'latitud' => 10.3997123,
            'longitud' => -75.5544321,
            'place_id' => 'ChIJabc',
        ]))->assertRedirect();

        $c = Cotizacion::sole();
        $this->assertSame('Torre B', $c->referencia);
        $this->assertEqualsWithDelta(10.3997123, $c->latitud, 1e-7);
        $this->assertEqualsWithDelta(-75.5544321, $c->longitud, 1e-7);
        $this->assertTrue($c->tieneCoordenadas());
        $this->assertStringContainsString('query=10.3997123,-75.5544321', $c->mapsUrl());
    }

    public function test_la_direccion_es_obligatoria(): void
    {
        $this->post('/contacto', $this->datos(['direccion' => '']))->assertSessionHasErrors('direccion');
        $this->assertSame(0, Cotizacion::count());
    }

    public function test_sin_pin_se_guarda_solo_el_texto(): void
    {
        $this->post('/contacto', $this->datos())->assertRedirect();

        $c = Cotizacion::sole();
        $this->assertFalse($c->tieneCoordenadas());
        $this->assertStringContainsString('query=Cra.+1', $c->mapsUrl());
    }

    public function test_rechaza_coordenadas_fuera_de_colombia_o_incompletas(): void
    {
        $this->post('/contacto', $this->datos(['latitud' => 40.4, 'longitud' => -3.7]))
            ->assertSessionHasErrors(['latitud', 'longitud']);
        $this->post('/contacto', $this->datos(['latitud' => 10.4]))
            ->assertSessionHasErrors('longitud');
        $this->assertSame(0, Cotizacion::count());
    }

    public function test_el_panel_recibe_la_ubicacion(): void
    {
        $this->post('/contacto', $this->datos(['latitud' => 10.4, 'longitud' => -75.55]));

        $this->actingAs(User::factory()->create())
            ->get('/interno/cotizaciones')
            ->assertInertia(fn ($page) => $page
                ->where('seleccionada.direccion', 'Cra. 1 # 2-87, Bocagrande')
                ->where('seleccionada.latitud', 10.4)
                ->has('seleccionada.maps_url')
                ->where('inbox.0.ubicada', true));
    }
}
