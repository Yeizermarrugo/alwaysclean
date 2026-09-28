<?php

namespace App\Providers;

use App\Support\IpVisitante;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Tope grueso a cualquier POST /pqrs (válido o no) para frenar inundaciones.
        // Los límites por caso creado viven en PqrsController.
        RateLimiter::for('pqrs', fn (Request $request) => Limit::perHour(20)->by(IpVisitante::de($request))
            ->response(fn () => back()->withErrors([
                'form' => 'Demasiados intentos desde su conexión. Inténtelo de nuevo más tarde.',
            ])));

        // Tope grueso por IP al login del panel (probar muchas cuentas desde una
        // conexión). El límite por cuenta vive en SessionController.
        RateLimiter::for('login', fn (Request $request) => Limit::perMinute(20)->by(IpVisitante::de($request))
            ->response(fn () => back()->withErrors([
                'email' => 'Demasiados intentos desde su conexión. Espere un minuto e inténtelo de nuevo.',
            ])));

        // "¿Olvidó su contraseña?": pocas solicitudes por IP (cada una envía un correo).
        RateLimiter::for('olvide', fn (Request $request) => Limit::perMinutes(15, 5)->by(IpVisitante::de($request))
            ->response(fn () => back()->withErrors([
                'email' => 'Demasiadas solicitudes desde su conexión. Inténtelo de nuevo en unos minutos.',
            ])));

        // Contraseñas del panel: mínimo 10 caracteres con letras y números; en
        // producción además se rechazan las que aparecen en filtraciones conocidas.
        Password::defaults(fn () => app()->isProduction()
            ? Password::min(10)->letters()->numbers()->uncompromised()
            : Password::min(10)->letters()->numbers());

        // Igual para POST /contacto; los límites por cotización creada viven en ContactoController.
        RateLimiter::for('contacto', fn (Request $request) => Limit::perHour(20)->by(IpVisitante::de($request))
            ->response(fn () => back()->withErrors([
                'form' => 'Demasiados intentos desde su conexión. Inténtelo de nuevo más tarde.',
            ])));
    }
}
