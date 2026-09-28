<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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
            if (! $cotizacion->caso) {
                $cotizacion->caso = 'COT-'.Str::padLeft((string) (self::max('id') + 2401), 4, '0');
            }
        });
    }
}
