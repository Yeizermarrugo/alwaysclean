<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php($seo = \App\Support\Seo::para(request()->route()?->getName(), $page))
        <title inertia>{{ $seo['titulo'] }}</title>
        @if ($seo['descripcion'])
            <meta name="description" content="{{ $seo['descripcion'] }}">
        @endif
        @unless ($seo['indexar'])
            <meta name="robots" content="noindex">
        @endunless
        <link rel="canonical" href="{{ $seo['url'] }}">

        {{-- Vista previa al compartir (WhatsApp, Facebook, LinkedIn, X) --}}
        <meta property="og:type" content="website">
        <meta property="og:locale" content="es_CO">
        <meta property="og:site_name" content="{{ config('company.nombre') }}">
        <meta property="og:title" content="{{ $seo['titulo'] }}">
        <meta property="og:description" content="{{ $seo['descripcion'] }}">
        <meta property="og:url" content="{{ $seo['url'] }}">
        <meta property="og:image" content="{{ $seo['imagen'] }}">
        @unless ($seo['imagen_propia'])
            <meta property="og:image:width" content="1200">
            <meta property="og:image:height" content="630">
        @endunless
        <meta name="twitter:card" content="summary_large_image">

        @if (request()->routeIs('home'))
            <script type="application/ld+json">@json(\App\Support\Seo::negocioLocal(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG)</script>
        @endif

        <meta name="theme-color" content="#0D0D5B">

        {{-- Medición: solo en el sitio público y si hay proveedor configurado --}}
        @unless (request()->is('interno', 'interno/*'))
            @if ($dominio = config('services.analitica.plausible_dominio'))
                <script defer data-domain="{{ $dominio }}" src="https://plausible.io/js/script.js"></script>
                <script>window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
            @elseif ($ga4 = config('services.analitica.ga4_id'))
                <script async src="https://www.googletagmanager.com/gtag/js?id={{ $ga4 }}"></script>
                <script>window.dataLayer = window.dataLayer || []; function gtag(){ dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', @json($ga4));</script>
            @endif
        @endunless
        <link rel="icon" href="/favicon.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes(auth()->check() ? null : 'publico')
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
