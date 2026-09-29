<?php

namespace App\Models;

use App\Support\Uploads;
use Illuminate\Database\Eloquent\Model;

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

    /** Tiene los textos mínimos para mostrarse en el sitio público. */
    public function estaCompleto(): bool
    {
        return filled($this->resumen) && filled($this->descripcion) && filled($this->meta)
            && ! empty($this->incluye) && ! empty($this->sectores);
    }

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
        return Uploads::url($this->imagen);
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
