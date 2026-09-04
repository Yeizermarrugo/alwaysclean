<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CotizacionEvento extends Model
{
    protected $fillable = [
        'cotizacion_id', 'usuario', 'estado_anterior', 'estado_nuevo', 'cuadrilla', 'nota',
    ];

    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class);
    }
}
