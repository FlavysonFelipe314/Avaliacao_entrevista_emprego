<?php

namespace App\Services;

use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Mission;
use App\Models\FinancialTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    public function getStats(): array
    {
        return Cache::remember('dashboard.stats', 30, function () {
            $totalOperators = Driver::count();
            $activeOperators = Driver::where('status', 'active')->count();
            $availableOperators = Driver::where('status', 'available')->count();
            
            $totalVehicles = Vehicle::count();
            $availableVehicles = Vehicle::where('status', 'available')->count();
            $activeVehicles = Vehicle::where('status', 'active')
                ->whereNotNull('operador_atual')
                ->count();
            
            $totalIncome = FinancialTransaction::where('type', 'income')->sum('amount');
            $totalExpenses = FinancialTransaction::where('type', 'expense')->sum('amount');
            $balance = $totalIncome - $totalExpenses;
            
            $recentDrivers = Driver::orderBy('created_at', 'desc')->limit(5)->get();
            $availableVehiclesList = Vehicle::where('status', 'available')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
            $activeVehiclesList = Vehicle::where('status', 'active')
                ->whereNotNull('operador_atual')
                ->orderBy('updated_at', 'desc')
                ->limit(5)
                ->get();

            return [
                'totalOperators' => $totalOperators,
                'activeOperators' => $activeOperators,
                'availableOperators' => $availableOperators,
                'totalVehicles' => $totalVehicles,
                'availableVehicles' => $availableVehicles,
                'activeVehicles' => $activeVehicles,
                'balance' => (float) $balance,
                'totalIncome' => (float) $totalIncome,
                'totalExpenses' => (float) $totalExpenses,
                'recentDrivers' => $recentDrivers->map(function ($driver) {
                    return [
                        'id' => $driver->id,
                        'nome' => $driver->nome,
                        'codigo' => $driver->codigo,
                        'status' => $driver->status,
                        'created_at' => $driver->created_at->toIso8601String(),
                    ];
                }),
                'availableVehiclesList' => $availableVehiclesList->map(function ($vehicle) {
                    return [
                        'id' => $vehicle->id,
                        'placa' => $vehicle->placa,
                        'codigo' => $vehicle->codigo,
                        'modelo' => $vehicle->modelo,
                        'tipo' => $vehicle->tipo,
                    ];
                }),
                'activeVehiclesList' => $activeVehiclesList->map(function ($vehicle) {
                    return [
                        'id' => $vehicle->id,
                        'placa' => $vehicle->placa,
                        'codigo' => $vehicle->codigo,
                        'modelo' => $vehicle->modelo,
                        'tipo' => $vehicle->tipo,
                        'operador_atual' => $vehicle->operador_atual,
                    ];
                }),
            ];
        });
    }
}

