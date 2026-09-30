<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Metaetiquetas por página, generadas en el servidor.
 *
 * El sitio usa Inertia sin SSR: lo que pone <Head> de React solo existe
 * después de ejecutar JavaScript, y WhatsApp, Facebook o LinkedIn no lo
 * ejecutan al armar la vista previa de un enlace. Por eso título, descripción
 * y Open Graph salen de aquí hacia app.blade.php.
 *
 * Los textos son los mismos que ya muestra cada página; los títulos deben
 * coincidir con el `title` que la página pasa a SiteLayout.
 */
class Seo
{
    private const PAGINAS = [
        'home' => [
            'titulo' => 'Limpieza, desinfección y saneamiento en Cartagena',
            'descripcion' => 'Limpieza, desinfección, saneamiento básico y obras civiles para empresas de la costa, con personal certificado en trabajo en altura y productos biodegradables.',
        ],
        'servicios.index' => [
            'titulo' => 'Servicios',
            'descripcion' => 'Servicios de limpieza por demanda o con cronograma fijo. Toda cotización incluye alcance, insumos, personal asignado y tiempo estimado en sitio.',
        ],
        'productos.index' => [
            'titulo' => 'Productos',
            'descripcion' => 'Productos especializados: solventes biodegradables formulados para redes sanitarias de alto tráfico. Despacho en Cartagena en 48 horas.',
        ],
        'nosotros.index' => [
            'titulo' => 'Nosotros',
            'descripcion' => 'Servicios de ingeniería sanitaria, obra civil y limpieza especializada, integrando seguridad, calidad y medio ambiente en cada proyecto.',
        ],
        'politicas.index' => [
            'titulo' => 'Política integral',
            'descripcion' => 'Política integral de gestión de Always Clean Colombia. Certificados ISO 9001 · IQNET Certified Management System.',
        ],
        'contacto.create' => [
            'titulo' => 'Solicite su cotización',
            'descripcion' => 'Solicite su cotización de limpieza, desinfección y saneamiento. Entre más detalle, más exacta la propuesta; también puede enviarla por WhatsApp.',
        ],
        'pqrs.create' => [
            'titulo' => 'PQRS',
            'descripcion' => 'Peticiones, quejas, reclamos y sugerencias. Radicamos su caso con número de seguimiento y respondemos en un plazo máximo de 15 días hábiles.',
        ],
    ];

    /**
     * @param  array{props?: array}  $page  Página de Inertia (la variable $page de la vista).
     * @return array{titulo: string, descripcion: string, imagen: string, url: string, indexar: bool}
     */
    public static function para(?string $ruta, array $page): array
    {
        $empresa = config('company.nombre');
        $datos = self::PAGINAS[$ruta] ?? null;

        if ($ruta === 'servicios.show' && ($servicio = $page['props']['servicio'] ?? null)) {
            $datos = [
                'titulo' => $servicio['nombre'],
                'descripcion' => $servicio['resumen'] ?? '',
                'imagen' => $servicio['imagen_url'] ?? null,
            ];
        }

        $imagen = $datos['imagen'] ?? null;

        return [
            'titulo' => $datos ? "{$datos['titulo']} - {$empresa}" : $empresa,
            'descripcion' => Str::limit($datos['descripcion'] ?? '', 160, '…'),
            'imagen' => $imagen ? url($imagen) : asset('images/og-default.jpg'),
            'imagen_propia' => (bool) $imagen,
            // URL canónica sin parámetros de búsqueda (filtros, utm…).
            'url' => url()->current(),
            // Solo se indexan las páginas públicas conocidas.
            'indexar' => $datos !== null && self::dominioIndexable(),
        ];
    }

    /**
     * Solo se indexa en producción y en el dominio propio: los de prueba
     * (*.laravel.cloud, revision.alwaysclean.com.co) no deben aparecer en
     * Google como copia.
     */
    public static function dominioIndexable(): bool
    {
        return app()->isProduction()
            && in_array(request()->getHost(), config('app.dominios_indexables'), true);
    }

    /** Datos estructurados schema.org para Google (ficha de negocio local). */
    public static function negocioLocal(): array
    {
        $empresa = config('company');
        $telefono = preg_replace('/\D/', '', $empresa['telefonos'][0] ?? '');

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'LocalBusiness',
            'name' => $empresa['nombre'],
            'legalName' => $empresa['razon_social'],
            'taxID' => $empresa['nit'],
            'url' => url('/'),
            'logo' => asset('images/logo-color.png'),
            'image' => asset('images/og-default.jpg'),
            'telephone' => $telefono ? "+57{$telefono}" : null,
            'email' => $empresa['correos'][0] ?? null,
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $empresa['direccion'],
                'addressLocality' => 'Cartagena de Indias',
                'addressRegion' => 'Bolívar',
                'addressCountry' => 'CO',
            ],
            'geo' => ['@type' => 'GeoCoordinates', 'latitude' => $empresa['mapa']['lat'], 'longitude' => $empresa['mapa']['lng']],
            'hasMap' => $empresa['mapa']['url'],
            'areaServed' => 'Cartagena de Indias',
            'openingHours' => 'Mo-Sa 07:00-18:00',
        ]);
    }
}
