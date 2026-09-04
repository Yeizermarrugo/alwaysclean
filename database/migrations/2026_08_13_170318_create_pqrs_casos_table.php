<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pqrs_casos', function (Blueprint $table) {
            $table->id();
            $table->string('caso')->unique();
            $table->enum('tipo', ['peticion', 'queja', 'reclamo', 'sugerencia', 'felicitacion']);
            $table->string('nombre');
            $table->string('documento');
            $table->string('email');
            $table->string('telefono');
            $table->string('servicio_relacionado')->nullable();
            $table->string('numero_orden')->nullable();
            $table->text('descripcion');
            $table->enum('estado', ['radicado', 'en_proceso', 'cerrado'])->default('radicado');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pqrs_casos');
    }
};
