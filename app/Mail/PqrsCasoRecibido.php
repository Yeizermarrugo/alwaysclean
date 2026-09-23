<?php

namespace App\Mail;

use App\Models\PqrsCaso;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PqrsCasoRecibido extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Recibe solo número y tipo, no el modelo: así el job en cola no necesita
     * volver a leer el caso de la BD (la conexión pública no tiene SELECT) ni
     * guarda datos personales en la tabla jobs.
     */
    public function __construct(public string $caso, public string $tipo)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Recibimos su {$this->tipoLegible()} — caso {$this->caso}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.pqrs.recibido',
            with: ['caso' => $this->caso, 'tipo' => $this->tipoLegible()],
        );
    }

    private function tipoLegible(): string
    {
        return mb_strtolower(PqrsCaso::TIPOS[$this->tipo] ?? $this->tipo);
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
