<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\ContrasenaCambiada;
use App\Support\IpVisitante;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as ReglaPassword;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/** "¿Olvidó su contraseña?": enlace por correo y formulario para crear una nueva. */
class ContrasenaController extends Controller
{
    public function solicitar(): Response
    {
        return Inertia::render('Auth/OlvideContrasena');
    }

    public function enviarEnlace(Request $request): RedirectResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        Password::sendResetLink(['email' => Str::lower($request->input('email'))]);

        // Misma respuesta exista o no la cuenta: no revela qué correos tienen acceso al panel.
        return back()->with('status', 'Si el correo pertenece a una cuenta del panel, le enviamos un enlace para crear una contraseña nueva. Revise también la carpeta de spam.');
    }

    public function formulario(Request $request, string $token): Response
    {
        return Inertia::render('Auth/RestablecerContrasena', [
            'token' => $token,
            'email' => (string) $request->query('email', ''),
        ]);
    }

    public function restablecer(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', ReglaPassword::defaults()],
        ]);

        $estado = Password::reset(
            [...$datos, 'email' => Str::lower($datos['email'])],
            function (User $user, string $password) use ($request) {
                // remember_token nuevo: invalida el "mantener sesión" de otros equipos.
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
                $user->notify(new ContrasenaCambiada(now(), IpVisitante::de($request)));
            },
        );

        if ($estado !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => 'El enlace no es válido o ya venció. Solicite uno nuevo.',
            ]);
        }

        return redirect()->route('login')->with('status', 'Su contraseña fue actualizada. Ya puede ingresar.');
    }
}
