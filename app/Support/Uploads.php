<?php

namespace App\Support;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Uploads
{
    public static function diskName(): string
    {
        return config('filesystems.uploads_disk');
    }

    public static function disk(): Filesystem
    {
        return Storage::disk(self::diskName());
    }

    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        // URL externa o archivo estático del repositorio (public/images/...).
        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        return self::diskName() === 'public'
            ? '/storage/'.$path
            : self::disk()->url($path);
    }

    /**
     * Borra un archivo subido; ignora URLs externas (ej. Unsplash).
     */
    public static function delete(?string $path): void
    {
        // Nunca borra URLs externas ni archivos estáticos del repositorio.
        if ($path && ! Str::startsWith($path, ['http://', 'https://', '/'])) {
            self::disk()->delete($path);
        }
    }
}
