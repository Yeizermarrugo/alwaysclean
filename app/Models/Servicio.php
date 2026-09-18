<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Servicio extends Model
{
    protected $fillable = [
        'codigo', 'slug', 'categoria', 'nombre', 'resumen', 'descripcion',
        'meta', 'imagen_hint', 'imagen', 'incluye', 'sectores', 'destacado', 'activo', 'orden',
    ];

    protected $appends = ['imagen_url'];

    protected $casts = [
        'incluye' => 'array',
        'sectores' => 'array',
        'destacado' => 'boolean',
        'activo' => 'boolean',
    ];

    public const CATEGORIAS = [
        'limpieza' => 'Limpieza',
        'sanitarios' => 'Sanitarios y ambientales',
        'obras' => 'Obras civiles y mantenimiento',
    ];

    public function getCategoriaLabelAttribute(): string
    {
        return self::CATEGORIAS[$this->categoria] ?? $this->categoria;
    }

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

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function imagenes()
    {
        return $this->hasMany(ServicioImagen::class)->orderBy('orden');
    }
}
