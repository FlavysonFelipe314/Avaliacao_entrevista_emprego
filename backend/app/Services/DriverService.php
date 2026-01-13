<?php

namespace App\Services;

use App\Models\Driver;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DriverService
{
    public function getAllDrivers(): Collection
    {
        return Cache::remember('drivers.all', 60, function () {
            return Driver::orderBy('created_at', 'desc')->get();
        });
    }

    public function getDriverById(int $id): Driver
    {
        return Cache::remember("drivers.{$id}", 300, function () use ($id) {
            return Driver::findOrFail($id);
        });
    }

    public function createDriver(array $data): Driver
    {
        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        }
        
        $driver = Driver::create($data);
        Cache::forget('drivers.all');
        Cache::forget('dashboard.stats');
        return $driver;
    }

    public function updateDriver(int $id, array $data): Driver
    {
        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        
        $driver = Driver::findOrFail($id);
        $driver->update($data);
        Cache::forget('drivers.all');
        Cache::forget("drivers.{$id}");
        Cache::forget('dashboard.stats');
        return $driver->fresh();
    }

    public function deleteDriver(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $driver = Driver::findOrFail($id);
            
            if ($driver->status === 'active' && $driver->veiculo_atual) {
                $vehicle = \App\Models\Vehicle::where('operador_atual', $driver->nome)->first();
                if ($vehicle) {
                    $vehicle->update([
                        'status' => 'available',
                        'operador_atual' => null,
                    ]);
                    Cache::forget('vehicles.all');
                    Cache::forget('vehicles.available');
                }
            }
            
            $result = $driver->delete();
            Cache::forget('drivers.all');
            Cache::forget("drivers.{$id}");
            Cache::forget('dashboard.stats');
            return $result;
        });
    }
}

