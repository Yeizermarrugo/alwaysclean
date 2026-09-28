<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\UniqueConstraintViolationException;

class Cotizacion extends Model
{
    protected $table = 'cotizaciones';

    protected $fillable = [
        'caso', 'servicios', 'empresa', 'nit', 'ciudad', 'direccion', 'referencia',
        'latitud', 'longitud', 'place_id', 'area_m2',
        'fecha_deseada', 'detalle', 'frecuencia', 'whatsapp', 'canal', 'cuadrilla',
        'estado', 'motivo_perdida',
    ];

    protected $casts = [
        'servicios' => 'array',
        'fecha_deseada' => 'date',
        'latitud' => 'float',
        'longitud' => 'float',
    ];

    public const ESTADOS = [
        'nueva' => 'Nueva',
        'contactada' => 'Contactada',
        'cotizada' => 'Cotizada',
        'agendada' => 'Agendada',
        'en_ejecucion' => 'En ejecución',
        'cerrada_ganada' => 'Cerrada · ganada',
        'cerrada_perdida' => 'Cerrada · perdida',
    ];

    public function tieneCoordenadas(): bool
    {
        return $this->latitud !== null && $this->longitud !== null;
    }

    /** Enlace de Google Maps (no requiere API key): pin exacto si hay coordenadas, si no búsqueda por texto. */
    public function mapsUrl(): ?string
    {
        if ($this->tieneCoordenadas()) {
            return 'https://www.google.com/maps/search/?api=1&query='.$this->latitud.','.$this->longitud
                .($this->place_id ? '&query_place_id='.urlencode($this->place_id) : '');
        }

        return $this->direccion
            ? 'https://www.google.com/maps/search/?api=1&query='.urlencode($this->direccion.', '.$this->ciudad)
            : null;
    }

    public function eventos()
    {
        return $this->hasMany(CotizacionEvento::class)->latest();
    }

    protected static function booted(): void
    {
        static::creating(function (self $cotizacion) {
            $cotizacion->caso ??= self::nuevoNumeroCaso();
        });
    }

    /**
     * Crea la cotización con número aleatorio; si choca con uno existente
     * (índice unique), genera otro y reintenta.
     */
    public static function registrar(array $datos): self
    {
        for ($intento = 1; ; $intento++) {
            try {
                return self::create([...$datos, 'caso' => self::nuevoNumeroCaso()]);
            } catch (UniqueConstraintViolationException $e) {
                if ($intento >= 3) {
                    throw $e;
                }
            }
        }
    }

    /**
     * Número aleatorio (ej. COT-7K3F9Q), mismo esquema que PqrsCaso: no depende
     * del último id, así que no choca con envíos simultáneos ni revela el volumen.
     */
    public static function nuevoNumeroCaso(): string
    {
        $alfabeto = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        $codigo = '';

        for ($i = 0; $i < 6; $i++) {
            $codigo .= $alfabeto[random_int(0, strlen($alfabeto) - 1)];
        }

        return "COT-{$codigo}";
    }

    /**
     * Deja solo los 10 dígitos de un celular (3xx) o fijo (60x) colombiano,
     * aceptando espacios, guiones, paréntesis y el prefijo +57. Null si no es válido.
     */
    public static function normalizarTelefono(?string $telefono): ?string
    {
        $digitos = preg_replace('/\D/', '', (string) $telefono);

        if (strlen($digitos) === 12 && str_starts_with($digitos, '57')) {
            $digitos = substr($digitos, 2);
        }

        return preg_match('/^(3\d{9}|60\d{8})$/', $digitos) ? $digitos : null;
    }
}
