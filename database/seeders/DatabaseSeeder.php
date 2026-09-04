<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Marcela C.',
            'email' => 'marcela@alwaysclean.com.co',
            'password' => bcrypt('AlwaysClean2026'),
        ]);

        $this->call([
            ServicioSeeder::class,
            ProductoSeeder::class,
            CotizacionSeeder::class,
        ]);
    }
}
