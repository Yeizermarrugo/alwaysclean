<?php

namespace Tests\Feature;

use App\Models\Servicio;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitioPublicoTest extends TestCase
{
    use RefreshDatabase;

    private function servicio(array $extra = []): Servicio
    {
        return Servicio::create([
            'codigo' => 'S01', 'slug' => 'lavado-de-tanques', 'categoria' => 'sanitarios',
            'nombre' => 'Lavado de tanques', 'resumen' => 'Lavado y desinfección de tanques de agua potable.',
            'descripcion' => '-', 'meta' => '-', 'imagen_hint' => '-', 'incluye' => [], 'sectores' => [],
            ...$extra,
        ]);
    }

    public function test_metaetiquetas_salen_del_servidor(): void
    {
        $html = $this->get('/')->assertOk()->getContent();

        $this->assertStringContainsString('<title inertia>Limpieza, desinfección y saneamiento en Cartagena - Always Clean Colombia</title>', $html);
        $this->assertStringContainsString('<meta name="description" content="Limpieza, desinfección', $html);
        $this->assertStringContainsString('<meta property="og:image" content="'.asset('images/og-default.jpg').'">', $html);
        $this->assertStringContainsString('"@type":"LocalBusiness"', $html);
        $this->assertStringNotContainsString('name="robots" content="noindex"', $html);
    }

    public function test_ficha_de_servicio_usa_su_nombre_resumen_e_imagen(): void
    {
        $this->servicio(['imagen' => 'https://images.example.com/tanque.jpg']);

        $html = $this->get('/servicios/lavado-de-tanques')->assertOk()->getContent();

        $this->assertStringContainsString('<meta property="og:title" content="Lavado de tanques - Always Clean Colombia">', $html);
        $this->assertStringContainsString('content="Lavado y desinfección de tanques de agua potable."', $html);
        $this->assertStringContainsString('<meta property="og:image" content="https://images.example.com/tanque.jpg">', $html);
    }

    public function test_sitemap_lista_paginas_y_solo_servicios_activos(): void
    {
        $this->servicio();
        $this->servicio(['codigo' => 'S02', 'slug' => 'oculto', 'nombre' => 'Oculto', 'activo' => false]);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('<loc>'.route('contacto.create').'</loc>', false)
            ->assertSee('<loc>'.route('servicios.show', 'lavado-de-tanques').'</loc>', false)
            ->assertDontSee('/servicios/oculto', false)
            ->assertDontSee('/interno', false);
    }

    public function test_robots_bloquea_todo_fuera_de_produccion(): void
    {
        $this->get('/robots.txt')->assertOk()->assertSee("Disallow: /\n", false)->assertDontSee('Sitemap');

        $this->app['env'] = 'production';
        $this->get('/robots.txt')->assertSee('Sitemap: '.route('seo.sitemap'), false)->assertDontSee("Disallow: /\n", false);
    }

    public function test_pagina_404_con_la_marca_y_sin_indexar(): void
    {
        $respuesta = $this->get('/no-existe')->assertNotFound();

        $respuesta->assertInertia(fn ($page) => $page->component('Error')->where('status', 404));
        $this->assertStringContainsString('name="robots" content="noindex"', $respuesta->getContent());
    }

    public function test_error_500_con_la_marca_sin_debug(): void
    {
        config(['app.debug' => false]);
        \Illuminate\Support\Facades\Route::get('/_falla', fn () => throw new \RuntimeException('boom'));

        $this->get('/_falla')->assertStatus(500)->assertInertia(fn ($page) => $page->component('Error')->where('status', 500));
    }

    public function test_inicio_trae_preguntas_frecuentes_y_su_faqpage(): void
    {
        $respuesta = $this->get('/')->assertOk();

        $respuesta->assertInertia(fn ($page) => $page->has('preguntas', count(\App\Support\PreguntasFrecuentes::LISTA)));
        $this->assertStringContainsString('"@type":"FAQPage"', $respuesta->getContent());
    }

    public function test_fotos_estaticas_del_repositorio_no_pasan_por_storage(): void
    {
        $this->assertSame('/images/servicios/x.jpg', \App\Support\Uploads::url('/images/servicios/x.jpg'));
        $this->assertSame('/storage/servicios/y.jpg', \App\Support\Uploads::url('servicios/y.jpg'));
    }
}
