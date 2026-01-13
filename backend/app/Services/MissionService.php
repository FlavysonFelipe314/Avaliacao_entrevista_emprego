<?php

namespace App\Services;

use App\Models\Mission;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Collection;

class MissionService
{
    /**
     * Lista todas as missões
     */
    public function getAllMissions(): Collection
    {
        return Mission::with(['driver', 'vehicle'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Busca missão por ID
     */
    public function getMissionById(int $id): Mission
    {
        return Mission::with(['driver', 'vehicle'])->findOrFail($id);
    }

    /**
     * Inicia uma nova missão
     */
    public function startMission(int $driverId, int $vehicleId, ?string $observations = null): Mission
    {
        return DB::transaction(function () use ($driverId, $vehicleId, $observations) {
            // Verificar se motorista está disponível
            $driver = Driver::findOrFail($driverId);
            if ($driver->status === 'active') {
                throw new \Exception('Motorista já está em missão ativa', 422);
            }

            // Verificar se veículo está disponível
            $vehicle = Vehicle::findOrFail($vehicleId);
            if ($vehicle->status !== 'available') {
                throw new \Exception('Veículo não está disponível', 422);
            }

            // Criar missão
            $mission = Mission::create([
                'driver_id' => $driverId,
                'vehicle_id' => $vehicleId,
                'status' => 'active',
                'started_at' => now(),
                'observations' => $observations,
            ]);

            // Atualizar status do motorista
            $driver->update([
                'status' => 'active',
                'veiculo_atual' => $vehicle->placa,
            ]);

            // Atualizar status do veículo
            $vehicle->update([
                'status' => 'active',
                'operador_atual' => $driver->nome,
            ]);
            
            // Limpar cache de veículos
            Cache::forget('vehicles.all');
            Cache::forget('vehicles.available');
            Cache::forget("vehicles.{$vehicleId}");
            Cache::forget('drivers.all');
            Cache::forget('dashboard.stats');

            return $mission->load(['driver', 'vehicle']);
        });
    }

    /**
     * Finaliza uma missão
     */
    public function stopMission(int $missionId): Mission
    {
        return DB::transaction(function () use ($missionId) {
            $mission = Mission::with(['driver', 'vehicle'])->findOrFail($missionId);

            if ($mission->status !== 'active') {
                throw new \Exception('Missão não está ativa', 422);
            }

            // Atualizar missão
            $mission->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Atualizar status do motorista
            if ($mission->driver) {
                $mission->driver->update([
                    'status' => 'inactive',
                    'veiculo_atual' => null,
                ]);
            }

            if ($mission->vehicle) {
                $vehicle = $mission->vehicle;
                $vehicle->update([
                    'status' => 'available',
                    'operador_atual' => null,
                ]);
                
                Cache::forget('vehicles.all');
                Cache::forget('vehicles.available');
                Cache::forget("vehicles.{$vehicle->id}");
                Cache::forget('drivers.all');
                Cache::forget('dashboard.stats');
            }

            return $mission->fresh(['driver', 'vehicle']);
        });
    }

    public function getActiveMissionByDriver(int $driverId): ?Mission
    {
        return Mission::where('driver_id', $driverId)
            ->where('status', 'active')
            ->with(['driver', 'vehicle'])
            ->first();
    }
}

