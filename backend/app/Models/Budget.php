<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = [
        'name',
        'total_budget',
        'fuel_budget',
        'maintenance_budget',
        'salaries_budget',
        'others_budget',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'total_budget' => 'decimal:2',
            'fuel_budget' => 'decimal:2',
            'maintenance_budget' => 'decimal:2',
            'salaries_budget' => 'decimal:2',
            'others_budget' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }
}
