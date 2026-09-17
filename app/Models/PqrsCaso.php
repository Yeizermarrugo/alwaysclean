<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PqrsCaso extends Model
{
    protected $table = 'pqrs_casos';

    protected $fillable = [
        'caso', 'tipo', 'nombre', 'documento', 'email', 'telefono',
        'servicio_relacionado', 'numero_orden', 'descripcion', 'estado', 'leido_at',
    ];

    protected $casts = [
        'leido_at' => 'datetime',
    ];

    public const TIPOS = [
        'peticion' => 'Petición',
        'queja' => 'Queja',
        'reclamo' => 'Reclamo',
        'sugerencia' => 'Sugerencia',
        'felicitacion' => 'Felicitación',
    ];

    public const ESTADOS = [
        'radicado' => 'Radicado',
        'en_proceso' => 'En proceso',
        'cerrado' => 'Cerrado',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $caso) {
            if (! $caso->caso) {
                $caso->caso = 'PQRS-'.Str::padLeft((string) (self::max('id') + 3101), 4, '0');
            }
        });
    }
}
