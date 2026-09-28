<?php

namespace Tests\Feature;

use App\Http\Controllers\ContactoController;
use App\Models\Cotizacion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Tests\Feature\Concerns\DatosCotizacion;
use Tests\TestCase;

class CotizacionProteccionTest extends TestCase
{
    use DatosCotizacion, RefreshDatabase;

    public function test_cotizacion_valida_se_guarda_y_va_a_whatsapp(): void
    {
        $this->post('/contacto', $this->datos(['whatsapp' => '+57 (300) 123-4567']))
            ->assertRedirectContains('wa.me');

        $c = Cotizacion::sole();
        $this->assertMatchesRegularExpression('/^COT-[2-9A-HJ-NP-Z]{6}$/', $c->caso);
        $this->assertSame('300 123 4567', $c->whatsapp);
        $this->assertSame('web', $c->canal);
    }

    public function test_honeypot_finge_exito_sin_guardar(): void
    {
        $this->post('/contacto', $this->datos(['sitio_web' => 'http://spam.test']))
            ->assertRedirectContains('wa.me');

        $this->assertSame(0, Cotizacion::count());
    }

    public function test_envio_demasiado_rapido_o_sin_token_se_rechaza(): void
    {
        $this->post('/contacto', $this->datos(['inicio' => Crypt::encryptString((string) now()->timestamp)]))
            ->assertSessionHasErrors('form');
        $this->post('/contacto', $this->datos(['inicio' => 'inventado']))
            ->assertSessionHasErrors('form');

        $this->assertSame(0, Cotizacion::count());
    }

    public function test_solo_acepta_servicios_del_catalogo(): void
    {
        $this->post('/contacto', $this->datos(['servicios' => ['Visite http://spam.test']]))
            ->assertSessionHasErrors('servicios.0');

        $this->assertSame(0, Cotizacion::count());
    }

    public function test_whatsapp_debe_ser_numero_colombiano(): void
    {
        foreach (['123', 'hola', '2001234567', '+1 415 555 0100'] as $numero) {
            $this->post('/contacto', $this->datos(['whatsapp' => $numero]))
                ->assertSessionHasErrors('whatsapp_normalizado');
        }
        $this->assertSame(0, Cotizacion::count());

        $this->post('/contacto', $this->datos(['whatsapp' => '605 600 1234']))->assertRedirectContains('wa.me');
        $this->assertSame('605 600 1234', Cotizacion::sole()->whatsapp);
    }

    public function test_reenvio_igual_devuelve_la_misma_cotizacion(): void
    {
        $this->post('/contacto', $this->datos());
        $this->post('/contacto', $this->datos(['whatsapp' => '3000000000']))
            ->assertRedirectContains(urlencode(Cotizacion::sole()->caso));

        $this->assertSame(1, Cotizacion::count());
    }

    public function test_limite_por_whatsapp_al_dia(): void
    {
        foreach (range(1, ContactoController::MAX_POR_WHATSAPP_DIA) as $i) {
            $this->post('/contacto', $this->datos(['empresa' => "Empresa {$i}"]));
            // Mismos servicios = duplicado; se borra solo esa marca para contar envíos distintos.
            cache()->forget('cotizacion-dup:'.sha1("3000000000\nLavado de tanques"));
        }

        $this->post('/contacto', $this->datos(['empresa' => 'Otra más']))->assertSessionHasErrors('form');
        $this->assertSame(ContactoController::MAX_POR_WHATSAPP_DIA, Cotizacion::count());
    }

    public function test_limite_por_ip_por_hora(): void
    {
        foreach (range(1, ContactoController::MAX_POR_IP_HORA) as $i) {
            $this->post('/contacto', $this->datos(['whatsapp' => '30000000'.str_pad((string) $i, 2, '0', STR_PAD_LEFT)]));
        }

        $this->post('/contacto', $this->datos(['whatsapp' => '3119999999']))->assertSessionHasErrors('form');
        $this->assertSame(ContactoController::MAX_POR_IP_HORA, Cotizacion::count());
    }

    public function test_turnstile_activo_exige_token(): void
    {
        config(['services.turnstile.secret_key' => 'secreto', 'services.turnstile.site_key' => 'sitio']);
        Http::fake(['challenges.cloudflare.com/*' => Http::response(['success' => false])]);

        $this->post('/contacto', $this->datos(['cf-turnstile-response' => 'malo']))
            ->assertSessionHasErrors('cf-turnstile-response');
        $this->assertSame(0, Cotizacion::count());
    }
}
