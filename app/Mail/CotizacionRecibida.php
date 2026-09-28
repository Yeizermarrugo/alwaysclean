<?php

namespace App\Mail;

use App\Models\Cotizacion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** Aviso interno al equipo comercial: entró una cotización por el sitio. */
class CotizacionRecibida extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Cotizacion $cotizacion)
    {
        //
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nueva cotización {$this->cotizacion->caso} · {$this->cotizacion->empresa}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.cotizaciones.recibida',
            with: [
                'c' => $this->cotizacion,
                'urlPanel' => route('interno.bandeja', ['caso' => $this->cotizacion->caso]),
            ],
        );
    }
}
