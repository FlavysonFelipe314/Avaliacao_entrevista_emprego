<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = is_array($this->resource) ? $this->resource : $this->resource->toArray();
        
        return [
            'totalOperators' => $data['totalOperators'] ?? 0,
            'activeOperators' => $data['activeOperators'] ?? 0,
            'availableOperators' => $data['availableOperators'] ?? 0,
            'totalVehicles' => $data['totalVehicles'] ?? 0,
            'availableVehicles' => $data['availableVehicles'] ?? 0,
            'activeVehicles' => $data['activeVehicles'] ?? 0,
            'balance' => $data['balance'] ?? 0,
            'totalIncome' => $data['totalIncome'] ?? 0,
            'totalExpenses' => $data['totalExpenses'] ?? 0,
            'recentDrivers' => $data['recentDrivers'] ?? [],
            'availableVehiclesList' => $data['availableVehiclesList'] ?? [],
            'activeVehiclesList' => $data['activeVehiclesList'] ?? [],
        ];
    }
}
