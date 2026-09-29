<?php

namespace Tests\Feature;

use App\Http\Controllers\Auth\SessionController;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeguridadTest extends TestCase
{
    use RefreshDatabase;

    // Contraseñas generadas en cada test (no literales en el código: los
    // escáneres de secretos como GitGuardian las marcan aunque sean de prueba).
    private string $clave;
    private string $claveErrada;

    protected function setUp(): void
    {
        parent::setUp();
        $this->clave = self::claveDePrueba();
        $this->claveErrada = self::claveDePrueba();
    }

    private static function claveDePrueba(): string
    {
        return 'T'.\Illuminate\Support\Str::random(14).'7';
    }

    private function intentar(string $email, string $password, string $ip = '203.0.113.10')
    {
        return $this->withServerVariables(['REMOTE_ADDR' => $ip])
            ->post('/interno/login', ['email' => $email, 'password' => $password]);
    }

    public function test_login_correcto_entra_al_panel(): void
    {
        User::factory()->create(['email' => 'ana@alwaysclean.test', 'password' => bcrypt($this->clave)]);

        $this->intentar('ana@alwaysclean.test', $this->clave)->assertRedirect(route('interno.bandeja'));
        $this->assertAuthenticated();
    }

    public function test_bloquea_la_cuenta_tras_varios_fallos_aun_con_la_clave_correcta(): void
    {
        User::factory()->create(['email' => 'ana@alwaysclean.test', 'password' => bcrypt($this->clave)]);

        foreach (range(1, SessionController::MAX_INTENTOS) as $i) {
            $this->intentar('ana@alwaysclean.test', "mala-{$i}")->assertSessionHasErrors('email');
        }

        $this->intentar('ana@alwaysclean.test', $this->clave)
            ->assertSessionHasErrors(['email' => 'Demasiados intentos fallidos. Inténtelo de nuevo en 15 minutos.']);
        $this->assertGuest();
    }

    public function test_el_bloqueo_no_afecta_al_dueno_desde_otra_conexion(): void
    {
        User::factory()->create(['email' => 'ana@alwaysclean.test', 'password' => bcrypt($this->clave)]);

        foreach (range(1, SessionController::MAX_INTENTOS) as $i) {
            $this->intentar('ana@alwaysclean.test', "mala-{$i}", '198.51.100.7');
        }

        $this->intentar('ana@alwaysclean.test', $this->clave, '203.0.113.99')->assertRedirect(route('interno.bandeja'));
        $this->assertAuthenticated();
    }

    public function test_mayusculas_en_el_correo_no_saltan_el_limite(): void
    {
        foreach (range(1, SessionController::MAX_INTENTOS) as $i) {
            $this->intentar($i % 2 ? 'ANA@alwaysclean.test' : 'ana@alwaysclean.test', $this->claveErrada);
        }

        $this->intentar('Ana@AlwaysClean.test', $this->claveErrada)
            ->assertSessionHasErrors(['email' => 'Demasiados intentos fallidos. Inténtelo de nuevo en 15 minutos.']);
    }

    public function test_visitante_no_recibe_las_rutas_del_panel(): void
    {
        $html = $this->get('/')->assertOk()->getContent();

        $this->assertStringContainsString('"contacto.create"', $html);
        $this->assertStringNotContainsString('interno.bandeja', $html);
        $this->assertStringNotContainsString('interno.diagnostico-ip', $html);
    }

    public function test_usuario_con_sesion_si_recibe_las_rutas_del_panel(): void
    {
        $html = $this->actingAs(User::factory()->create())->get('/')->getContent();

        $this->assertStringContainsString('interno.bandeja', $html);
    }

    public function test_encabezados_de_seguridad(): void
    {
        $this->get('/')
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeaderMissing('X-Robots-Tag')
            ->assertHeaderMissing('Strict-Transport-Security');

        $this->get('/interno/login')->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    }
}
