<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    /**
     * Autentica com email e senha
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->input('email'),
                $request->input('password')
            );

            return response()->json([
                'message' => 'Autenticação bem-sucedida',
                'user' => [
                    'id' => $result['user']->id,
                    'name' => $result['user']->name,
                    'email' => $result['user']->email,
                    'type' => $result['userType'] ?? 'admin',
                ],
                'token' => $result['token'],
            ], 200);
        } catch (\Exception $e) {
            $statusCode = is_numeric($e->getCode()) && $e->getCode() > 0 ? (int) $e->getCode() : 401;
            return response()->json([
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }
}
