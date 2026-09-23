<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProxyIpTest extends TestCase
{
    use RefreshDatabase;

    private function ipParaLimites(array $headers, bool $cloudflare): string
    {
        config(['app.ip_desde_cloudflare' => $cloudflare]);

        return $this->actingAs(User::factory()->create())
            ->withServerVariables(['REMOTE_ADDR' => '198.51.100.20'])
            ->withHeaders($headers)
            ->getJson('/interno/diagnostico-ip')
            ->assertOk()
            ->json('ip_para_limites');
    }

    public function test_con_cloudflare_usa_cf_connecting_ip_aunque_falseen_x_forwarded_for(): void
    {
        $ip = $this->ipParaLimites([
            'X-Forwarded-For' => '1.1.1.1, 172.64.0.1',
            'CF-Connecting-IP' => '203.0.113.7',
        ], cloudflare: true);

        $this->assertSame('203.0.113.7', $ip);
    }

    public function test_con_cloudflare_ignora_encabezado_invalido(): void
    {
        $this->assertSame('198.51.100.20', $this->ipParaLimites(['CF-Connecting-IP' => 'no-es-ip'], cloudflare: true));
    }

    public function test_sin_cloudflare_ignora_cf_connecting_ip_inventado(): void
    {
        $this->assertSame('198.51.100.20', $this->ipParaLimites(['CF-Connecting-IP' => '203.0.113.7'], cloudflare: false));
    }

    public function test_limite_por_ip_no_se_salta_cambiando_x_forwarded_for(): void
    {
        config(['app.ip_desde_cloudflare' => true]);

        for ($i = 0; $i < 20; $i++) {
            $this->withHeaders(['CF-Connecting-IP' => '203.0.113.7', 'X-Forwarded-For' => "10.9.{$i}.1"])
                ->post('/pqrs', ['nombre' => '']);
        }

        $this->withHeaders(['CF-Connecting-IP' => '203.0.113.7', 'X-Forwarded-For' => '10.9.99.1'])
            ->post('/pqrs', ['nombre' => ''])
            ->assertSessionHasErrors('form');
    }

    public function test_diagnostico_requiere_login(): void
    {
        $this->getJson('/interno/diagnostico-ip')->assertUnauthorized();
    }
}
