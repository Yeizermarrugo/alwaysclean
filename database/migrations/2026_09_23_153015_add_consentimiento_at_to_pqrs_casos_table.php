<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pqrs_casos', function (Blueprint $table) {
            $table->timestamp('consentimiento_at')->nullable()->after('descripcion');
            $table->index(['email', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pqrs_casos', function (Blueprint $table) {
            $table->dropIndex(['email', 'created_at']);
            $table->dropColumn('consentimiento_at');
        });
    }
};
