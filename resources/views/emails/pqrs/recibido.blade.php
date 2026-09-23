<x-mail::message>
{{-- No incluir aquí nombre, descripción ni ningún texto escrito por quien llena el formulario:
     el correo sale a la dirección que esa persona escribe, y Markdown convertiría
     [texto](url) en un enlace real con nuestra marca. --}}
# Recibimos su {{ $tipo }}

Registramos su caso con número **{{ $caso }}**.

Nuestro equipo lo revisará y le responderá en un plazo máximo de 15 días hábiles al correo o teléfono registrados. Si necesita agregar información, responda a este correo indicando el número de caso.

Si usted no radicó este caso, puede ignorar este mensaje.

Saludos,<br>
{{ config('app.name') }}
</x-mail::message>
