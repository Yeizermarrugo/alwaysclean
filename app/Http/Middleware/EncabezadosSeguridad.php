<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Encabezados HTTP de seguridad para todas las respuestas web.
 *
 * Sin Content-Security-Policy por ahora: el sitio carga Google Maps, Turnstile,
 * Google Fonts, fotos de Unsplash y estilos en línea; una CSP mal ajustada rompe
 * esas integraciones. Conviene agregarla primero en modo Report-Only.
 */
class EncabezadosSeguridad
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $h = $response->headers;

        // Nadie puede mostrar el sitio dentro de un iframe (clickjacking).
        $h->set('X-Frame-Options', 'DENY');
        // El navegador no adivina tipos de archivo (p. ej. un "jpg" que en realidad es HTML).
        $h->set('X-Content-Type-Options', 'nosniff');
        // A otros sitios solo se envía el dominio, nunca la ruta completa (URLs del panel, casos).
        $h->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        // Solo la geolocalización, y solo para nuestro dominio ("Estoy en la sede").
        $h->set('Permissions-Policy', 'geolocation=(self), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()');
        $h->set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

        // HSTS solo en producción y bajo HTTPS: en local rompería http://127.0.0.1.
        if ($request->isSecure() && app()->isProduction()) {
            $h->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // El panel no debe aparecer en buscadores.
        if ($request->is('interno', 'interno/*')) {
            $h->set('X-Robots-Tag', 'noindex, nofollow');
        }

        return $response;
    }
}
