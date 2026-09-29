<?php

namespace App\Http\Controllers\Interno;

use App\Http\Controllers\Controller;
use App\Notifications\ContrasenaCambiada;
use App\Support\IpVisitante;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class CuentaController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('Interno/Cuenta', [
            'usuario' => $request->user()->only('name', 'email'),
        ]);
    }

    public function actualizarContrasena(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'contrasena_actual' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'different:contrasena_actual', Password::defaults()],
        ], [
            'contrasena_actual.current_password' => 'La contraseña actual no es correcta.',
            'password.different' => 'La contraseña nueva debe ser distinta de la actual.',
        ], [
            'contrasena_actual' => 'contraseña actual',
            'password' => 'contraseña nueva',
        ]);

        $user = $request->user();
        $user->forceFill([
            'password' => Hash::make($datos['password']),
            'remember_token' => Str::random(60),
        ])->save();

        // Cierra las otras sesiones (middleware auth.session) y mantiene esta.
        Auth::logoutOtherDevices($datos['password']);

        $user->notify(new ContrasenaCambiada(now(), IpVisitante::de($request)));

        return back()->with('status', 'Contraseña actualizada. Se cerraron las demás sesiones y le enviamos un aviso por correo.');
    }
}
