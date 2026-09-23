<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\UniqueConstraintViolationException;

class PqrsCaso extends Model
{
    protected $table = 'pqrs_casos';

    protected $fillable = [
        'caso', 'tipo', 'nombre', 'documento', 'email', 'telefono',
        'servicio_relacionado', 'numero_orden', 'descripcion', 'consentimiento_at', 'estado', 'leido_at',
    ];

    protected $casts = [
        'leido_at' => 'datetime',
        'consentimiento_at' => 'datetime',
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
            $caso->caso ??= self::nuevoNumeroCaso();
        });
    }

    /**
     * Conexión para el formulario público: usuario MySQL que solo puede hacer
     * INSERT en esta tabla. Sin DB_PQRS_USERNAME (local, tests) usa la conexión normal.
     */
    public static function conexionPublica(): ?string
    {
        return filled(config('database.connections.pqrs_publico.username')) ? 'pqrs_publico' : null;
    }

    /**
     * Guarda un caso desde el formulario público usando solo INSERT: no lee la
     * tabla. Si el número aleatorio choca con uno existente (índice unique),
     * genera otro y reintenta.
     */
    public static function radicar(array $datos): self
    {
        for ($intento = 1; ; $intento++) {
            $caso = (new self)->setConnection(self::conexionPublica());
            $caso->fill($datos)->forceFill(['caso' => self::nuevoNumeroCaso()]);

            try {
                $caso->save();

                return $caso;
            } catch (UniqueConstraintViolationException $e) {
                if ($intento >= 3) {
                    throw $e;
                }
            }
        }
    }

    /**
     * Número de seguimiento aleatorio (ej. PQRS-7K3F9Q): 32^6 ≈ mil millones de
     * combinaciones. No depende del último id, así que no choca con envíos
     * simultáneos ni revela cuántos casos hay. Sin 0/O ni 1/I para dictarlo por teléfono.
     */
    public static function nuevoNumeroCaso(): string
    {
        $alfabeto = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        $codigo = '';

        for ($i = 0; $i < 6; $i++) {
            $codigo .= $alfabeto[random_int(0, strlen($alfabeto) - 1)];
        }

        return "PQRS-{$codigo}";
    }
}
