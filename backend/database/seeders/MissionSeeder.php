<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\Mission;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class MissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buscar motoristas e veículos
        $driver1 = Driver::where('codigo', 'OP-001')->first();
        $driver2 = Driver::where('codigo', 'OP-002')->first();
        $vehicle1 = Vehicle::where('codigo', 'VH-001')->first();
        $vehicle2 = Vehicle::where('codigo', 'VH-002')->first();

        if ($driver1 && $vehicle1) {
            Mission::create([
                'driver_id' => $driver1->id,
                'vehicle_id' => $vehicle1->id,
                'status' => 'active',
                'started_at' => now()->subHours(2),
                'observations' => 'Missão de transporte de valores - Rota Centro-Sul',
            ]);
        }

        if ($driver2 && $vehicle2) {
            Mission::create([
                'driver_id' => $driver2->id,
                'vehicle_id' => $vehicle2->id,
                'status' => 'active',
                'started_at' => now()->subHours(1),
                'observations' => 'Escolta armada - Cliente VIP',
            ]);
        }

        // Criar algumas missões completadas hoje
        $driver3 = Driver::where('codigo', 'OP-003')->first();
        $driver4 = Driver::where('codigo', 'OP-004')->first();
        $vehicle3 = Vehicle::where('codigo', 'VH-003')->first();
        $vehicle4 = Vehicle::where('codigo', 'VH-004')->first();

        if ($driver3 && $vehicle3) {
            Mission::create([
                'driver_id' => $driver3->id,
                'vehicle_id' => $vehicle3->id,
                'status' => 'completed',
                'started_at' => today()->subHours(6),
                'completed_at' => today()->subHours(4),
                'observations' => 'Transporte executivo - Missão concluída com sucesso',
            ]);
        }

        if ($driver4 && $vehicle4) {
            Mission::create([
                'driver_id' => $driver4->id,
                'vehicle_id' => $vehicle4->id,
                'status' => 'completed',
                'started_at' => today()->subHours(3),
                'completed_at' => today()->subHours(1),
                'observations' => 'Transporte de valores - Rota Norte',
            ]);
        }
    }
}
