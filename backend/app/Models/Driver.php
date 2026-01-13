<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Driver extends Model
{
    protected $fillable = [
        'codigo',
        'nome',
        'cpf',
        'telefone',
        'email',
        'password',
        'cnh',
        'especialidade',
        'status',
        'veiculo_atual',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
            'password' => 'hashed',
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
