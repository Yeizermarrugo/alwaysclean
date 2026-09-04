<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cotizaciones', function (Blueprint $table) {
            $table->id();
            $table->string('caso')->unique();
            $table->json('servicios');
            $table->string('empresa');
            $table->string('nit')->nullable();
            $table->string('ciudad');
            $table->string('direccion')->nullable();
            $table->unsignedInteger('area_m2')->nullable();
            $table->date('fecha_deseada')->nullable();
            $table->text('detalle')->nullable();
            $table->enum('frecuencia', ['una_vez', 'mensual', 'trimestral', 'anual']);
            $table->string('whatsapp');
            $table->enum('canal', ['web', 'whatsapp', 'telefono'])->default('web');
            $table->string('cuadrilla')->nullable();
            $table->enum('estado', [
                'nueva', 'contactada', 'cotizada', 'agendada',
                'en_ejecucion', 'cerrada_ganada', 'cerrada_perdida',
            ])->default('nueva');
            $table->string('motivo_perdida')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cotizaciones');
    }
};
