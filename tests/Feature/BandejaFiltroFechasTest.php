<?php

namespace Tests\Feature;

use App\Models\Cotizacion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class BandejaFiltroFechasTest extends TestCase
{
    use RefreshDatabase;

    private function cotizacion(string $empresa, string $creadaUtc): void
    {
        $c = Cotizacion::create([
            'servicios' => ['Lavado de tanques'], 'empresa' => $empresa, 'ciudad' => 'Cartagena',
            'direccion' => 'Calle 1', 'frecuencia' => 'una_vez', 'whatsapp' => '300 000 0000',
        ]);
        $c->forceFill(['created_at' => Carbon::parse($creadaUtc, 'UTC')])->save();
    }

    private function bandeja(array $query)
    {
        return $this->actingAs(User::factory()->create())->get(route('interno.bandeja', $query));
    }

    public function test_filtra_por_rango_en_hora_de_colombia(): void
    {
        // 27-sep 23:30 en Bogotá = 28-sep 04:30 UTC: pertenece al 27 para el negocio.
        $this->cotizacion('Noche del 27', '2026-09-28 04:30:00');
        $this->cotizacion('Mañana del 28', '2026-09-28 14:00:00');
        // 28-sep 22:00 en Bogotá = 29-sep 03:00 UTC: sigue siendo el 28.
        $this->cotizacion('Noche del 28', '2026-09-29 03:00:00');
        $this->cotizacion('Día 30', '2026-09-30 15:00:00');

        $this->bandeja(['desde' => '2026-09-28', 'hasta' => '2026-09-28'])
            ->assertInertia(fn ($page) => $page
                ->has('inbox', 2)
                ->where('inbox.0.cliente', 'Noche del 28')
                ->where('inbox.1.cliente', 'Mañana del 28')
                ->where('rango', ['desde' => '2026-09-28', 'hasta' => '2026-09-28'])
                ->where('totalCotizaciones', 4));
    }

    public function test_solo_desde_o_rango_invertido_o_fechas_invalidas(): void
    {
        $this->cotizacion('Vieja', '2026-09-01 15:00:00');
        $this->cotizacion('Nueva', '2026-09-20 15:00:00');

        $this->bandeja(['desde' => '2026-09-10'])
            ->assertInertia(fn ($page) => $page->has('inbox', 1)->where('inbox.0.cliente', 'Nueva'));

        $this->bandeja(['desde' => '2026-09-30', 'hasta' => '2026-09-15'])
            ->assertInertia(fn ($page) => $page->has('inbox', 1)
                ->where('rango', ['desde' => '2026-09-15', 'hasta' => '2026-09-30']));

        $this->bandeja(['desde' => '2026-02-31', 'hasta' => 'ayer'])
            ->assertInertia(fn ($page) => $page->has('inbox', 2)->where('rango', ['desde' => null, 'hasta' => null]));
    }
}
