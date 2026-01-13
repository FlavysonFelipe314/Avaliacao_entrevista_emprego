<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AuthService
{
    /**
     * Autentica usuário com email e senha
     * Verifica tanto em Users quanto em Drivers
     */
    public function login(string $email, string $password): array
    {
        $userType = 'admin';
        
        // Primeiro tenta buscar em Users
        $user = User::where('email', $email)->first();
        
        // Se não encontrar, busca em Drivers
        if (!$user) {
            $driver = \App\Models\Driver::where('email', $email)->first();
            
            if (!$driver || !$driver->password) {
                throw new \Exception('Credenciais inválidas', 401);
            }
            
            // Verificar senha do driver
            if (!Hash::check($password, $driver->password)) {
                throw new \Exception('Credenciais inválidas', 401);
            }
            
            // Criar um User a partir do Driver para autenticação com Sanctum
            $user = User::firstOrCreate(
                ['email' => $driver->email],
                [
                    'name' => $driver->nome,
                    'password' => $driver->password,
                ]
            );
            
            $userType = 'driver';
        } else {
            // Verificar senha do usuário
            if (!Hash::check($password, $user->password)) {
                throw new \Exception('Credenciais inválidas', 401);
            }
        }

        // Gerar token de sessão (usando Sanctum)
        try {
            $token = $user->createToken('auth-token')->plainTextToken;
        } catch (\Exception $e) {
            Log::error('Erro ao criar token Sanctum: ' . $e->getMessage());
            throw new \Exception('Erro ao gerar token de autenticação', 500);
        }

        return [
            'user' => $user,
            'token' => $token,
            'userType' => $userType,
        ];
    }
}

