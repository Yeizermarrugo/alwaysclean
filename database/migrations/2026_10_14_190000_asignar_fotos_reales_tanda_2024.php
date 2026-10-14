<?php

use App\Models\Servicio;
use Database\Seeders\ServicioSeeder;
use Illuminate\Database\Migrations\Migration;

/**
 * Asigna las fotos nuevas (tanda 11062022 - 9122024) a los servicios que ya
 * existen en producción, donde ServicioSeeder no se puede volver a correr.
 * Respeta las portadas subidas desde el panel; en galería solo agrega.
 */
return new class extends Migration
{
    public function up(): void
    {
        Servicio::query()->each(fn (Servicio $servicio) => ServicioSeeder::fotosReales($servicio, respetarSubida: true));
    }

    public function down(): void
    {
        // Sin reversa: las fotos de referencia anteriores no se conservan en la BD.
    }
};
