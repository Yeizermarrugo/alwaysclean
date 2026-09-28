<x-mail::layout>
{{-- Header --}}
<x-slot:header>
<x-mail::header :url="config('app.url')">
{{ config('company.nombre') }}
</x-mail::header>
</x-slot:header>

{{-- Body --}}
{!! $slot !!}

{{-- Subcopy --}}
@isset($subcopy)
<x-slot:subcopy>
<x-mail::subcopy>
{!! $subcopy !!}
</x-mail::subcopy>
</x-slot:subcopy>
@endisset

{{-- Footer --}}
<x-slot:footer>
<x-mail::footer>
{{ config('company.razon_social') }} · NIT {{ config('company.nit') }}<br>
{{ config('company.ciudad') }} · {{ config('company.telefonos')[0] ?? '' }}
</x-mail::footer>
</x-slot:footer>
</x-mail::layout>
