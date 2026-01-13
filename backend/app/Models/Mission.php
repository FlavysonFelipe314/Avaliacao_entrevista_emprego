<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mission extends Model
{
    protected $fillable = [
        'driver_id',
        'vehicle_id',
        'status',
        'started_at',
        'completed_at',
        'observations',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Relacionamento com motorista
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    /**
     * Relacionamento com veículo
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}
