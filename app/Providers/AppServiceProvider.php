<?php

namespace App\Providers;

use App\Support\IpVisitante;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

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

        // Igual para POST /contacto; los límites por cotización creada viven en ContactoController.
        RateLimiter::for('contacto', fn (Request $request) => Limit::perHour(20)->by(IpVisitante::de($request))
            ->response(fn () => back()->withErrors([
                'form' => 'Demasiados intentos desde su conexión. Inténtelo de nuevo más tarde.',
            ])));
    }
}
