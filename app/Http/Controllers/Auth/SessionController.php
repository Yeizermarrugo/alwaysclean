<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Support\IpVisitante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SessionController extends Controller
{
    /** Intentos fallidos permitidos por correo + IP antes de bloquear, y minutos de bloqueo. */
    public const MAX_INTENTOS = 5;

    public const MINUTOS_BLOQUEO = 15;

    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Por correo + IP: frena adivinar la contraseña de una cuenta sin que un
        // tercero pueda bloquearle el acceso al dueño desde otra conexión.
        $clave = 'login:'.Str::lower($credentials['email']).'|'.IpVisitante::de($request);

        if (RateLimiter::tooManyAttempts($clave, self::MAX_INTENTOS)) {
            $minutos = (int) ceil(RateLimiter::availableIn($clave) / 60);

            throw ValidationException::withMessages([
                'email' => "Demasiados intentos fallidos. Inténtelo de nuevo en {$minutos} minuto".($minutos === 1 ? '' : 's').'.',
            ]);
        }

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            RateLimiter::hit($clave, self::MINUTOS_BLOQUEO * 60);

            throw ValidationException::withMessages([
                'email' => 'Credenciales incorrectas.',
            ]);
        }

        RateLimiter::clear($clave);
        $request->session()->regenerate();

        // Recarga completa (no visita Inertia) para que @routes entregue las rutas del panel.
        return Inertia::location(route('interno.bandeja'));
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Recarga completa: descarta del navegador las rutas del panel.
        return Inertia::location(route('login'));
    }
}
