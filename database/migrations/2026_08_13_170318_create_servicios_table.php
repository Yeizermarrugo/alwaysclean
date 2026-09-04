<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicios', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 4);
            $table->string('slug')->unique();
            $table->enum('categoria', ['limpieza', 'sanitarios', 'obras']);
            $table->string('nombre');
            $table->string('resumen');
            $table->text('descripcion');
            $table->string('meta');
            $table->string('imagen_hint');
            $table->string('imagen')->nullable();
            $table->json('incluye');
            $table->json('sectores');
            $table->boolean('destacado')->default(false);
            $table->unsignedSmallInteger('orden')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};
