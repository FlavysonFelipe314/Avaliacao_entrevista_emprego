<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Operador Tático',
            'email' => 'operador@tatico.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'name' => 'Coordenador Central',
            'email' => 'coordenador@tatico.com',
            'password' => Hash::make('password123'),
        ]);
    }
}
