@php($md = fn ($v) => \App\Support\Markdown::texto($v))
<x-mail::message>
{{-- Todo lo que escribió el cliente pasa por $md(): {{ }} no escapa Markdown y un
     "[texto](url)" se volvería un enlace real dentro del correo. --}}
# Nueva cotización {{ $c->caso }}

Entró una solicitud desde el sitio web. El cliente fue redirigido a WhatsApp con su número de caso.

<x-mail::table>
| | |
|:--|:--|
| **Cliente** | {{ $md($c->empresa) }}@if($c->nit) · NIT {{ $md($c->nit) }}@endif |
| **Servicios** | {{ $md(implode(', ', $c->servicios)) }} |
| **WhatsApp** | {{ $md($c->whatsapp) }} |
| **Ciudad** | {{ $md($c->ciudad) }} |
@if($c->direccion)
| **Dirección** | {{ $md($c->direccion) }}@if($c->tieneCoordenadas()) (ubicación marcada en el mapa)@endif |
@endif
@if($c->referencia)
| **Referencia** | {{ $md($c->referencia) }} |
@endif
| **Frecuencia** | {{ ucfirst(str_replace('_', ' ', $c->frecuencia)) }} |
@if($c->area_m2)
| **Área** | {{ number_format($c->area_m2, 0, ',', '.') }} m² |
@endif
@if($c->fecha_deseada)
| **Fecha deseada** | {{ $c->fecha_deseada->format('d/m/Y') }} |
@endif
</x-mail::table>

@if($c->detalle)
**Detalle del cliente:**

{{ $md(\Illuminate\Support\Str::limit($c->detalle, 600)) }}
@endif

<x-mail::button :url="$urlPanel" color="success">
Abrir en el panel
</x-mail::button>

Recibe este aviso porque su correo está en la lista de notificaciones de cotizaciones del sitio.
</x-mail::message>
