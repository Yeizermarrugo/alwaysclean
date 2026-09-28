<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

/** Aviso de seguridad: la contraseña de la cuenta cambió. */
class ContrasenaCambiada extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Carbon $cuando, public string $ip)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $fecha = $this->cuando->copy()->setTimezone('America/Bogota')->translatedFormat('j \d\e F \d\e Y, g:i a');

        return (new MailMessage)
            ->subject('Su contraseña del panel cambió')
            ->greeting("Hola, {$notifiable->name}")
            ->line("La contraseña de su cuenta en el panel interno se cambió el {$fecha} (hora de Colombia), desde la dirección IP {$this->ip}.")
            ->line('Las demás sesiones abiertas con su cuenta se cerraron.')
            ->line('Si usted no hizo este cambio, restablezca su contraseña de inmediato y avise al administrador.')
            ->action('Restablecer contraseña', route('interno.password.request'))
            ->salutation('Saludos, '.config('company.nombre'));
    }
}
