<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Cotizacion extends Model
{
    protected $table = 'cotizaciones';

    protected $fillable = [
        'caso', 'servicios', 'empresa', 'nit', 'ciudad', 'direccion', 'area_m2',
        'fecha_deseada', 'detalle', 'frecuencia', 'whatsapp', 'canal', 'cuadrilla',
        'estado', 'motivo_perdida',
    ];

    protected $casts = [
        'servicios' => 'array',
        'fecha_deseada' => 'date',
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
