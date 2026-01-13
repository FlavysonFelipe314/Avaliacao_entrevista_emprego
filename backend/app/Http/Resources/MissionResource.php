<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'driverId' => $this->driver_id,
            'vehicleId' => $this->vehicle_id,
            'status' => $this->status,
            'startedAt' => $this->started_at?->toIso8601String(),
            'completedAt' => $this->completed_at?->toIso8601String(),
            'observations' => $this->observations,
            'driver' => $this->whenLoaded('driver', function () {
                return new DriverResource($this->driver);
            }),
            'vehicle' => $this->whenLoaded('vehicle', function () {
                return new VehicleResource($this->vehicle);
            }),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
