<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicioImagen extends Model
{
    protected $table = 'servicio_imagenes';

    protected $fillable = ['servicio_id', 'imagen', 'orden'];

    protected $appends = ['imagen_url'];

    public function getImagenUrlAttribute(): string
    {
        return '/storage/'.$this->imagen;
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class);
    }
}
