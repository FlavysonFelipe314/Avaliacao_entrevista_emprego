<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vehicles = [
            [
                'codigo' => 'VH-001',
                'placa' => 'ABC-1234',
                'modelo' => 'Blindado Tipo A',
                'tipo' => 'Blindado',
                'status' => 'active',
                'operador_atual' => 'Carlos Silva',
            ],
            [
                'codigo' => 'VH-002',
                'placa' => 'DEF-5678',
                'modelo' => 'Blindado Tipo B',
                'tipo' => 'Blindado',
                'status' => 'active',
                'operador_atual' => 'Roberto Santos',
            ],
            [
                'codigo' => 'VH-003',
                'placa' => 'GHI-9012',
                'modelo' => 'Blindado Tipo A',
                'tipo' => 'Blindado',
                'status' => 'available',
            ],
            [
                'codigo' => 'VH-004',
                'placa' => 'JKL-3456',
                'modelo' => 'Blindado Tipo C',
                'tipo' => 'Blindado',
                'status' => 'available',
            ],
            [
                'codigo' => 'VH-005',
                'placa' => 'MNO-7890',
                'modelo' => 'Blindado Tipo B',
                'tipo' => 'Blindado',
                'status' => 'maintenance',
            ],
            [
                'codigo' => 'VH-006',
                'placa' => 'PQR-1357',
                'modelo' => 'Blindado Tipo A',
                'tipo' => 'Blindado',
                'status' => 'available',
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::create($vehicle);
        }
    }
}
