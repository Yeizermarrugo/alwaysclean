<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    /** Páginas públicas fijas del sitemap. */
    private const PAGINAS = ['home', 'servicios.index', 'productos.index', 'nosotros.index', 'politicas.index', 'contacto.create', 'pqrs.create'];

    public function sitemap(): Response
    {
        $urls = collect(self::PAGINAS)->map(fn (string $ruta) => ['loc' => route($ruta), 'lastmod' => null]);

        Servicio::activos()->orderBy('orden')->get(['slug', 'updated_at'])
            ->each(fn (Servicio $s) => $urls->push([
                'loc' => route('servicios.show', $s->slug),
                'lastmod' => $s->updated_at?->toDateString(),
            ]));

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n"
            .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n"
            .$urls->map(fn ($u) => '  <url><loc>'.e($u['loc']).'</loc>'
                .($u['lastmod'] ? "<lastmod>{$u['lastmod']}</lastmod>" : '').'</url>')->implode("\n")
            ."\n</urlset>\n";

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function robots(): Response
    {
        // Fuera de producción (Laravel Cloud *.laravel.cloud, pruebas) no se indexa nada.
        $texto = app()->isProduction()
            ? "User-agent: *\nDisallow:\n\nSitemap: ".route('seo.sitemap')."\n"
            : "User-agent: *\nDisallow: /\n";

        return response($texto, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
