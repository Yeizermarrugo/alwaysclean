<?php

namespace App\Models;

use App\Support\Uploads;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'codigo', 'slug', 'nombre', 'descripcion', 'aplicacion', 'presentacion', 'imagen', 'orden',
    ];

    protected $appends = ['imagen_url'];

    public function getImagenUrlAttribute(): ?string
    {
        return Uploads::url($this->imagen);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
