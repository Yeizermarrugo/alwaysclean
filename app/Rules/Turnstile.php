<?php

namespace App\Rules;

use App\Support\IpVisitante;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Turnstile implements ValidationRule
{
    public static function activo(): bool
    {
        return filled(config('services.turnstile.secret_key'));
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || $value === '') {
            $fail('Confirme que no es un robot.');

            return;
        }

        try {
            $respuesta = Http::asForm()->timeout(5)->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                'secret' => config('services.turnstile.secret_key'),
                'response' => $value,
                'remoteip' => IpVisitante::de(request()),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Turnstile no respondió', ['error' => $e->getMessage()]);
            $fail('No pudimos verificar el formulario. Inténtelo de nuevo en un momento.');

            return;
        }

        if (! $respuesta->json('success')) {
            $fail('La verificación anti-robot falló. Recargue la página e inténtelo de nuevo.');
        }
    }
}
