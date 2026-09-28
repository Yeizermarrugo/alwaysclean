<?php

namespace Tests\Feature;

use App\Models\Servicio;
use App\Models\User;
use Database\Seeders\ServicioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiciosPortafolioTest extends TestCase
{
    use RefreshDatabase;

    public function test_crea_los_servicios_del_portafolio_ocultos_y_sin_duplicar(): void
    {
        ServicioSeeder::crearPendientesDelPortafolio();
        ServicioSeeder::crearPendientesDelPortafolio();

        $this->assertSame(count(ServicioSeeder::PENDIENTES_DEL_PORTAFOLIO), Servicio::count());
        $this->assertSame(0, Servicio::activos()->count());

        $pozos = Servicio::firstWhere('slug', 'limpieza-de-pozos-septicos');
        $this->assertSame('/images/servicios/limpieza-de-pozos-septicos.jpg', $pozos->imagen);
        $this->assertFalse($pozos->estaCompleto());
    }

    public function test_oculto_no_se_ve_en_el_sitio(): void
    {
        ServicioSeeder::crearPendientesDelPortafolio();

        $this->get('/servicios/limpieza-de-pozos-septicos')->assertNotFound();
        $this->get('/sitemap.xml')->assertDontSee('pozos-septicos', false);
    }

    public function test_no_se_puede_activar_sin_textos(): void
    {
        ServicioSeeder::crearPendientesDelPortafolio();
        $pozos = Servicio::firstWhere('slug', 'limpieza-de-pozos-septicos');

        $this->actingAs(User::factory()->create())
            ->patch(route('interno.servicios.toggle-activo', $pozos->id))
            ->assertSessionHasErrors('activo');
        $this->assertFalse($pozos->fresh()->activo);

        $pozos->update([
            'resumen' => 'r', 'descripcion' => 'd', 'meta' => 'm',
            'incluye' => ['a'], 'sectores' => ['b'],
        ]);

        $this->actingAs(User::factory()->create())
            ->patch(route('interno.servicios.toggle-activo', $pozos->id))
            ->assertSessionHasNoErrors();
        $this->assertTrue($pozos->fresh()->activo);
    }
}
