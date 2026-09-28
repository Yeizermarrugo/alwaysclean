<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/** Enlace para crear una contraseña nueva ("¿Olvidó su contraseña?"). */
class RestablecerContrasena extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $token)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $minutos = config('auth.passwords.users.expire');
        $url = route('interno.password.reset', ['token' => $this->token, 'email' => $notifiable->email]);

        return (new MailMessage)
            ->subject('Restablecer contraseña del panel')
            ->greeting("Hola, {$notifiable->name}")
            ->line('Recibimos una solicitud para restablecer la contraseña de su cuenta en el panel interno de '.config('company.nombre').'.')
            ->action('Crear contraseña nueva', $url)
            ->line("El enlace vence en {$minutos} minutos y solo se puede usar una vez.")
            ->line('Si usted no lo solicitó, ignore este correo: su contraseña actual sigue funcionando.')
            ->salutation('Saludos, '.config('company.nombre'));
    }
}
