<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * IP del visitante para los límites de envío.
 *
 * Detrás de proxies, request()->ip() puede terminar leyendo la parte de
 * X-Forwarded-For que escribe el propio visitante (en Laravel Cloud, Laravel
 * confía en todos los proxies), y un bot la cambiaría en cada envío.
 * Cloudflare sobrescribe siempre CF-Connecting-IP con la IP real, así que
 * cuando todo el tráfico pasa por Cloudflare ese encabezado es confiable.
 *
 * Activar IP_DESDE_CLOUDFLARE=true solo tras confirmar en /interno/diagnostico-ip
 * que el encabezado llega con la IP real. Sin Cloudflare delante, cualquiera
 * podría inventarlo.
 */
class IpVisitante
{
    public static function de(Request $request): string
    {
        if (config('app.ip_desde_cloudflare')) {
            $ip = $request->header('CF-Connecting-IP');

            if (is_string($ip) && filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }

        return (string) $request->ip();
    }
}
