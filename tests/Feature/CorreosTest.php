<?php

namespace Tests\Feature;

use App\Mail\CotizacionRecibida;
use App\Models\Cotizacion;
use App\Models\User;
use App\Notifications\ContrasenaCambiada;
use App\Notifications\RestablecerContrasena;
use App\Support\Markdown;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\Feature\Concerns\DatosCotizacion;
use Tests\TestCase;

class CorreosTest extends TestCase
{
    use DatosCotizacion, RefreshDatabase;

    // --- Aviso de cotización nueva ---------------------------------------

    public function test_cotizacion_nueva_avisa_al_equipo(): void
    {
        Mail::fake();
        config(['notificaciones.cotizaciones' => ['comercial@alwaysclean.test', 'gerencia@alwaysclean.test']]);

        $this->post('/contacto', $this->datos());

        Mail::assertQueued(CotizacionRecibida::class, fn ($m) => $m->hasTo('comercial@alwaysclean.test')
            && $m->hasTo('gerencia@alwaysclean.test')
            && $m->cotizacion->is(Cotizacion::sole()));
    }

    public function test_sin_destinatarios_no_envia_nada(): void
    {
        Mail::fake();
        config(['notificaciones.cotizaciones' => []]);

        $this->post('/contacto', $this->datos());

        Mail::assertNothingQueued();
        $this->assertSame(1, Cotizacion::count());
    }

    public function test_el_correo_no_convierte_texto_del_cliente_en_enlaces(): void
    {
        $this->post('/contacto', $this->datos(['empresa' => '[Pague aquí](https://phishing.test)']));

        $html = (new CotizacionRecibida(Cotizacion::sole()))->render();

        $this->assertStringNotContainsString('href="https://phishing.test"', $html);
        $this->assertStringContainsString('Abrir en el panel', $html);
        $this->assertStringContainsString(route('interno.bandeja', ['caso' => Cotizacion::sole()->caso]), $html);
    }

    public function test_markdown_escapa_caracteres_especiales(): void
    {
        $this->assertSame('\[a\]\(b\)', Markdown::texto('[a](b)'));
    }

    // --- ¿Olvidó su contraseña? -------------------------------------------

    public function test_envia_enlace_y_no_revela_si_la_cuenta_existe(): void
    {
        Notification::fake();
        $ana = User::factory()->create(['email' => 'ana@alwaysclean.test']);

        $existe = $this->post('/interno/olvide', ['email' => 'ANA@alwaysclean.test']);
        $noExiste = $this->post('/interno/olvide', ['email' => 'nadie@alwaysclean.test']);

        $this->assertSame(session('status'), $noExiste->getSession()->get('status'));
        $existe->assertSessionHas('status');
        Notification::assertSentTo($ana, RestablecerContrasena::class);
        Notification::assertCount(1);
    }

    public function test_restablece_con_token_valido_y_avisa(): void
    {
        Notification::fake();
        $ana = User::factory()->create(['email' => 'ana@alwaysclean.test']);
        $token = Password::createToken($ana);

        $this->post('/interno/restablecer', [
            'token' => $token, 'email' => 'ana@alwaysclean.test',
            'password' => 'nueva-clave-2026', 'password_confirmation' => 'nueva-clave-2026',
        ])->assertRedirect(route('login'))->assertSessionHas('status');

        $this->assertTrue(Hash::check('nueva-clave-2026', $ana->fresh()->password));
        Notification::assertSentTo($ana, ContrasenaCambiada::class);

        // El token es de un solo uso.
        $this->post('/interno/restablecer', [
            'token' => $token, 'email' => 'ana@alwaysclean.test',
            'password' => 'otra-clave-2026', 'password_confirmation' => 'otra-clave-2026',
        ])->assertSessionHasErrors(['email' => 'El enlace no es válido o ya venció. Solicite uno nuevo.']);
    }

    public function test_contrasena_debil_se_rechaza(): void
    {
        $ana = User::factory()->create();

        $this->post('/interno/restablecer', [
            'token' => Password::createToken($ana), 'email' => $ana->email,
            'password' => 'corta', 'password_confirmation' => 'corta',
        ])->assertSessionHasErrors('password');
    }

    public function test_enlace_del_correo_apunta_al_formulario(): void
    {
        $ana = User::factory()->create(['name' => 'Ana']);
        $correo = (new RestablecerContrasena('tok123'))->toMail($ana);

        $this->assertSame(route('interno.password.reset', ['token' => 'tok123', 'email' => $ana->email]), $correo->actionUrl);
        $this->get($correo->actionUrl)->assertOk()->assertInertia(fn ($p) => $p->component('Auth/RestablecerContrasena')->where('token', 'tok123'));
    }

    // --- Cambio de contraseña con sesión ---------------------------------

    public function test_cambia_contrasena_desde_mi_cuenta(): void
    {
        Notification::fake();
        $ana = User::factory()->create(['password' => bcrypt('clave-actual-1')]);
        $tokenRecordar = $ana->remember_token;

        $this->actingAs($ana)->put('/interno/cuenta/contrasena', [
            'contrasena_actual' => 'clave-actual-1',
            'password' => 'clave-nueva-2026', 'password_confirmation' => 'clave-nueva-2026',
        ])->assertSessionHasNoErrors()->assertSessionHas('status');

        $this->assertTrue(Hash::check('clave-nueva-2026', $ana->fresh()->password));
        $this->assertNotSame($tokenRecordar, $ana->fresh()->remember_token);
        Notification::assertSentTo($ana, ContrasenaCambiada::class);
    }

    public function test_exige_la_contrasena_actual_correcta(): void
    {
        $ana = User::factory()->create(['password' => bcrypt('clave-actual-1')]);

        $this->actingAs($ana)->put('/interno/cuenta/contrasena', [
            'contrasena_actual' => 'equivocada',
            'password' => 'clave-nueva-2026', 'password_confirmation' => 'clave-nueva-2026',
        ])->assertSessionHasErrors(['contrasena_actual' => 'La contraseña actual no es correcta.']);

        $this->assertTrue(Hash::check('clave-actual-1', $ana->fresh()->password));
    }
}
