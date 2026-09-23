<?php

namespace Tests\Feature;

use App\Http\Controllers\PqrsController;
use App\Mail\PqrsCasoRecibido;
use App\Models\PqrsCaso;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PqrsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        config(['services.turnstile.secret_key' => null, 'services.turnstile.site_key' => null]);
    }

    private function datos(array $extra = []): array
    {
        return [
            'tipo' => 'queja',
            'nombre' => 'Ana Pérez',
            'documento' => '1234567',
            'email' => 'Ana@Ejemplo.com',
            'telefono' => '3000000000',
            'descripcion' => 'El servicio del martes llegó tarde.',
            'acepta_datos' => true,
            'sitio_web' => '',
            'inicio' => Crypt::encryptString((string) now()->subMinute()->timestamp),
            ...$extra,
        ];
    }

    public function test_radica_caso_y_envia_correo(): void
    {
        $this->post('/pqrs', $this->datos())
            ->assertRedirect('/pqrs')
            ->assertSessionHas('caso');

        $caso = PqrsCaso::sole();
        $this->assertMatchesRegularExpression('/^PQRS-[2-9A-HJ-NP-Z]{6}$/', $caso->caso);
        $this->assertSame('ana@ejemplo.com', $caso->email);
        $this->assertNotNull($caso->consentimiento_at);
        Mail::assertQueued(PqrsCasoRecibido::class, fn ($m) => $m->hasTo('ana@ejemplo.com'));
    }

    public function test_exige_consentimiento(): void
    {
        $this->post('/pqrs', $this->datos(['acepta_datos' => false]))
            ->assertSessionHasErrors('acepta_datos');

        $this->assertDatabaseCount('pqrs_casos', 0);
    }

    public function test_valida_campos_requeridos_y_email(): void
    {
        $this->post('/pqrs', $this->datos(['nombre' => '', 'email' => 'no-es-email', 'tipo' => 'otro']))
            ->assertSessionHasErrors(['nombre', 'email', 'tipo']);
    }

    public function test_honeypot_finge_exito_sin_guardar_ni_enviar(): void
    {
        $this->post('/pqrs', $this->datos(['sitio_web' => 'http://spam.test']))
            ->assertRedirect('/pqrs')
            ->assertSessionHas('caso');

        $this->assertDatabaseCount('pqrs_casos', 0);
        Mail::assertNothingQueued();
    }

    public function test_rechaza_envio_demasiado_rapido(): void
    {
        $this->post('/pqrs', $this->datos(['inicio' => Crypt::encryptString((string) now()->timestamp)]))
            ->assertSessionHasErrors('form');

        $this->assertDatabaseCount('pqrs_casos', 0);
    }

    public function test_rechaza_token_de_inicio_falso(): void
    {
        $this->post('/pqrs', $this->datos(['inicio' => '1700000000']))
            ->assertSessionHasErrors('form');

        $this->assertDatabaseCount('pqrs_casos', 0);
    }

    public function test_duplicado_en_24h_devuelve_mismo_caso_sin_otro_correo(): void
    {
        $this->post('/pqrs', $this->datos());
        $primero = PqrsCaso::sole()->caso;

        $this->post('/pqrs', $this->datos())->assertSessionHas('caso', $primero);

        $this->assertDatabaseCount('pqrs_casos', 1);
        Mail::assertQueuedCount(1);
    }

    public function test_limite_de_casos_por_email_al_dia(): void
    {
        for ($i = 0; $i < PqrsController::MAX_POR_EMAIL_DIA; $i++) {
            $this->post('/pqrs', $this->datos(['descripcion' => "Caso {$i}"]))->assertSessionHasNoErrors();
        }

        $this->post('/pqrs', $this->datos(['descripcion' => 'Uno más']))
            ->assertSessionHasErrors('form');

        $this->assertDatabaseCount('pqrs_casos', PqrsController::MAX_POR_EMAIL_DIA);
    }

    public function test_limite_de_casos_por_ip_por_hora(): void
    {
        for ($i = 0; $i < PqrsController::MAX_POR_IP_HORA; $i++) {
            $this->post('/pqrs', $this->datos(['email' => "persona{$i}@ejemplo.com"]))->assertSessionHasNoErrors();
        }

        $this->post('/pqrs', $this->datos(['email' => 'otra@ejemplo.com']))
            ->assertSessionHasErrors('form');

        $this->assertDatabaseCount('pqrs_casos', PqrsController::MAX_POR_IP_HORA);
    }

    public function test_tope_general_de_intentos_por_ip(): void
    {
        // 20 intentos inválidos pasan por el middleware; el 21 lo corta el throttle.
        for ($i = 0; $i < 20; $i++) {
            $this->post('/pqrs', $this->datos(['nombre' => '']))->assertSessionHasErrors('nombre');
        }

        $this->post('/pqrs', $this->datos())
            ->assertSessionHasErrors('form')
            ->assertSessionDoesntHaveErrors('nombre');

        $this->assertDatabaseCount('pqrs_casos', 0);
    }

    public function test_turnstile_se_exige_cuando_hay_llaves(): void
    {
        config(['services.turnstile.secret_key' => 'secreto', 'services.turnstile.site_key' => 'publica']);
        Http::fake(['challenges.cloudflare.com/*' => Http::response(['success' => false])]);

        $this->post('/pqrs', $this->datos(['cf-turnstile-response' => 'token-malo']))
            ->assertSessionHasErrors('cf-turnstile-response');

        $this->assertDatabaseCount('pqrs_casos', 0);
    }

    public function test_turnstile_valido_deja_pasar(): void
    {
        config(['services.turnstile.secret_key' => 'secreto', 'services.turnstile.site_key' => 'publica']);
        Http::fake(['challenges.cloudflare.com/*' => Http::response(['success' => true])]);

        $this->post('/pqrs', $this->datos(['cf-turnstile-response' => 'token-bueno']))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseCount('pqrs_casos', 1);
    }

    public function test_radicar_reintenta_si_el_numero_de_caso_ya_existe(): void
    {
        PqrsCaso::create($this->filaMinima(['caso' => 'PQRS-AAAAAA']));

        // Fuerza que el primer intento use un número ya ocupado.
        $intentos = 0;

        PqrsCaso::creating(function (PqrsCaso $c) use (&$intentos) {
            if (++$intentos === 1) {
                $c->caso = 'PQRS-AAAAAA';
            }
        });

        $caso = PqrsCaso::radicar($this->filaMinima());

        $this->assertSame(2, $intentos);
        $this->assertNotSame('PQRS-AAAAAA', $caso->caso);
        $this->assertDatabaseCount('pqrs_casos', 2);
    }

    public function test_correo_en_cola_no_guarda_datos_personales(): void
    {
        $this->post('/pqrs', $this->datos());

        Mail::assertQueued(PqrsCasoRecibido::class, function (PqrsCasoRecibido $m) {
            $payload = serialize($m);

            return ! str_contains($payload, 'Ana Pérez')
                && ! str_contains($payload, '1234567')
                && ! str_contains($payload, 'llegó tarde');
        });
    }

    private function filaMinima(array $extra = []): array
    {
        return [
            'tipo' => 'queja',
            'nombre' => 'X',
            'documento' => '1',
            'email' => 'x@ejemplo.com',
            'telefono' => '1',
            'descripcion' => 'x',
            ...$extra,
        ];
    }

    public function test_correo_no_incluye_texto_del_usuario(): void
    {
        $caso = PqrsCaso::create([
            'tipo' => 'reclamo',
            'nombre' => 'Nombre [Pague aquí](https://phishing.test)',
            'documento' => '1',
            'email' => 'a@ejemplo.com',
            'telefono' => '1',
            'descripcion' => 'Visite [este enlace](https://phishing.test) urgente',
        ]);

        $html = (new PqrsCasoRecibido($caso->caso, $caso->tipo))->render();

        $this->assertStringNotContainsString('phishing.test', $html);
        $this->assertStringContainsString($caso->caso, $html);
    }
}
