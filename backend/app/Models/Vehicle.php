<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    protected $fillable = [
        'codigo',
        'placa',
        'modelo',
        'tipo',
        'status',
        'operador_atual',
    ];

    protected $attributes = [
        'status' => 'available',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }

    /**
     * Relacionamento com missões
     */
    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class);
    }
}
