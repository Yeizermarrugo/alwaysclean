<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'codigo', 'slug', 'nombre', 'descripcion', 'aplicacion', 'presentacion', 'imagen', 'orden',
    ];

    protected $appends = ['imagen_url'];

    public function getImagenUrlAttribute(): ?string
    {
        return $this->imagen ? '/storage/'.$this->imagen : null;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
