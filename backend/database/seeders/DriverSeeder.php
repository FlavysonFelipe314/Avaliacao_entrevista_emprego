<?php

namespace Database\Seeders;

use App\Models\Driver;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DriverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $drivers = [
            [
                'codigo' => 'OP-001',
                'nome' => 'Carlos Silva',
                'cpf' => '123.456.789-00',
                'telefone' => '(11) 98765-4321',
                'email' => 'carlos.silva@tatico.com',
                'password' => Hash::make('password123'),
                'especialidade' => 'Transporte de Valores',
                'status' => 'active',
            ],
            [
                'codigo' => 'OP-002',
                'nome' => 'Roberto Santos',
                'cpf' => '234.567.890-11',
                'telefone' => '(11) 98765-4322',
                'email' => 'roberto.santos@tatico.com',
                'password' => Hash::make('password123'),
                'especialidade' => 'Escolta Armada',
                'status' => 'active',
            ],
            [
                'codigo' => 'OP-003',
                'nome' => 'Fernando Oliveira',
                'cpf' => '345.678.901-22',
                'telefone' => '(11) 98765-4323',
                'email' => 'fernando.oliveira@tatico.com',
                'password' => Hash::make('password123'),
                'especialidade' => 'Transporte Executivo',
                'status' => 'inactive',
            ],
            [
                'codigo' => 'OP-004',
                'nome' => 'Marcos Pereira',
                'cpf' => '456.789.012-33',
                'telefone' => '(11) 98765-4324',
                'email' => 'marcos.pereira@tatico.com',
                'password' => Hash::make('password123'),
                'especialidade' => 'Transporte de Valores',
                'status' => 'available',
            ],
            [
                'codigo' => 'OP-005',
                'nome' => 'João Costa',
                'cpf' => '567.890.123-44',
                'telefone' => '(11) 98765-4325',
                'email' => 'joao.costa@tatico.com',
                'password' => Hash::make('password123'),
                'especialidade' => 'Escolta Armada',
                'status' => 'inactive',
            ],
        ];

        foreach ($drivers as $driver) {
            Driver::create($driver);
        }
    }
}
