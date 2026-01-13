<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $users = $this->userService->getAllUsers();
        return UserResource::collection($users);
    }

    public function show(int $id): UserResource
    {
        $user = $this->userService->getUserById($id);
        return new UserResource($user);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());

        return response()->json([
            'message' => 'Usuário criado com sucesso',
            'data' => new UserResource($user),
        ], 201);
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->updateUser($id, $request->validated());

        return response()->json([
            'message' => 'Usuário atualizado com sucesso',
            'data' => new UserResource($user),
        ], 200);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->userService->deleteUser($id);

        return response()->json([
            'message' => 'Usuário excluído com sucesso',
        ], 200);
    }

    public function me(): UserResource
    {
        $user = auth()->user();
        return new UserResource($user);
    }

    public function updateProfile(UpdateUserRequest $request): JsonResponse
    {
        $user = auth()->user();
        $updatedUser = $this->userService->updateUser($user->id, $request->validated());

        return response()->json([
            'message' => 'Perfil atualizado com sucesso',
            'data' => new UserResource($updatedUser),
        ], 200);
    }
}

