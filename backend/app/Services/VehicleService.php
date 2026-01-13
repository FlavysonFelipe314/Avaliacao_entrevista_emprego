<?php

namespace App\Services;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class VehicleService
{
    public function getAllVehicles(): Collection
    {
        return Cache::remember('vehicles.all', 60, function () {
            return Vehicle::orderBy('created_at', 'desc')->get();
        });
    }

    public function getVehicleById(int $id): Vehicle
    {
        return Cache::remember("vehicles.{$id}", 300, function () use ($id) {
            return Vehicle::findOrFail($id);
        });
    }

    public function getAvailableVehicles(): Collection
    {
        return Cache::remember('vehicles.available', 30, function () {
            return Vehicle::where('status', 'available')->get();
        });
    }

    public function createVehicle(array $data): Vehicle
    {
        if (!isset($data['status']) || empty($data['status'])) {
            $data['status'] = 'available';
        }
        
        $vehicle = Vehicle::create($data);
        
        Cache::forget('vehicles.all');
        Cache::forget('vehicles.available');
        Cache::forget('dashboard.stats');
        
        return $vehicle;
    }

    public function updateVehicle(int $id, array $data): Vehicle
    {
        $vehicle = $this->getVehicleById($id);
        $vehicle->update($data);
        Cache::forget('vehicles.all');
        Cache::forget('vehicles.available');
        Cache::forget("vehicles.{$id}");
        Cache::forget('dashboard.stats');
        return $vehicle->fresh();
    }

    public function deleteVehicle(int $id): bool
    {
        $vehicle = $this->getVehicleById($id);
        $result = $vehicle->delete();
        Cache::forget('vehicles.all');
        Cache::forget('vehicles.available');
        Cache::forget("vehicles.{$id}");
        Cache::forget('dashboard.stats');
        return $result;
    }
}

