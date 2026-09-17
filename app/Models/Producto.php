<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Producto extends Model
{
    protected $fillable = [
        'codigo', 'slug', 'nombre', 'descripcion', 'aplicacion', 'presentacion', 'imagen', 'orden',
    ];

    protected $appends = ['imagen_url'];

    public function getImagenUrlAttribute(): ?string
    {
        if (!$this->imagen) {
            return null;
        }

        return Str::startsWith($this->imagen, ['http://', 'https://'])
            ? $this->imagen
            : '/storage/'.$this->imagen;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
