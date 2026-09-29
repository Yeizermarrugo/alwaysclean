<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

/**
 * Crea (o reinicia) un usuario del panel sin dejar contraseñas en el código.
 * Por defecto le envía por correo el enlace para crear su contraseña; con
 * --mostrar genera una aleatoria y la imprime una sola vez.
 *
 *   php artisan panel:usuario comercial@alwaysclean.com.co --nombre="Marcela C."
 */
class CrearUsuarioPanel extends Command
{
    protected $signature = 'panel:usuario
        {email : Correo con el que ingresará}
        {--nombre= : Nombre visible en el panel}
        {--mostrar : Generar contraseña aleatoria e imprimirla en vez de enviar el enlace por correo}';

    protected $description = 'Crea o reinicia un usuario del panel interno';

    public function handle(): int
    {
        $email = Str::lower(trim($this->argument('email')));

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Correo no válido.');

            return self::FAILURE;
        }

        $usuario = User::firstOrNew(['email' => $email]);
        $nuevo = ! $usuario->exists;
        $usuario->name = $this->option('nombre') ?: ($usuario->name ?: Str::before($email, '@'));

        $clave = Str::password(16, symbols: false);
        $usuario->forceFill(['password' => Hash::make($clave), 'remember_token' => Str::random(60)])->save();

        $this->info(($nuevo ? 'Usuario creado: ' : 'Usuario reiniciado: ').$usuario->name.' <'.$email.'>');

        if ($this->option('mostrar')) {
            $this->warn("Contraseña temporal (se muestra una sola vez): {$clave}");
            $this->line('Pídale que la cambie en el panel → su nombre → Mi cuenta.');

            return self::SUCCESS;
        }

        $estado = Password::sendResetLink(['email' => $email]);

        if ($estado !== Password::RESET_LINK_SENT) {
            $this->error('No se pudo enviar el enlace ('.$estado.'). Use --mostrar para ver una contraseña temporal.');

            return self::FAILURE;
        }

        $this->line('Le enviamos por correo el enlace para crear su contraseña (vence en '.config('auth.passwords.users.expire').' minutos).');

        return self::SUCCESS;
    }
}
