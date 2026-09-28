<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cotizaciones', function (Blueprint $table) {
            $table->string('referencia', 200)->nullable()->after('direccion');
            $table->decimal('latitud', 10, 7)->nullable()->after('referencia');
            $table->decimal('longitud', 10, 7)->nullable()->after('latitud');
            $table->string('place_id')->nullable()->after('longitud');
        });
    }

    public function down(): void
    {
        Schema::table('cotizaciones', function (Blueprint $table) {
            $table->dropColumn(['referencia', 'latitud', 'longitud', 'place_id']);
        });
    }
};
