<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\NoCacheHtml::class,
            \App\Http\Middleware\EncabezadosSeguridad::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Páginas de error con la marca (Inertia) en vez de las de Laravel.
        // 500/503 solo sin APP_DEBUG: en local se sigue viendo el detalle del error.
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $e, \Illuminate\Http\Request $request) {
            $status = $response->getStatusCode();

            if ($status === 419) {
                return back()->withErrors([
                    'form' => 'La página estuvo abierta mucho tiempo y la sesión expiró. Inténtelo de nuevo.',
                ]);
            }

            if (in_array($status, [403, 404]) || (! config('app.debug') && in_array($status, [500, 503]))) {
                // Un 404 de ruta inexistente no pasa por el middleware web
                // (HandleInertiaRequests): se comparte a mano lo que usa el layout.
                return \Inertia\Inertia::render('Error', [
                    'status' => $status,
                    'empresa' => config('company'),
                    'auth' => ['user' => $request->hasSession() ? $request->user()?->only('id', 'name') : null],
                    'flash' => ['caso' => null],
                    'errors' => (object) [],
                ])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            return $response;
        });
    })->create();
