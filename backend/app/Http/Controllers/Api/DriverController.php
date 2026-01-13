<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDriverRequest;
use App\Http\Requests\UpdateDriverRequest;
use App\Http\Resources\DriverResource;
use App\Services\DriverService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DriverController extends Controller
{
    public function __construct(
        private readonly DriverService $driverService
    ) {}

    /**
     * Lista todos os motoristas
     */
    public function index(): AnonymousResourceCollection
    {
        $drivers = $this->driverService->getAllDrivers();
        return DriverResource::collection($drivers);
    }

    /**
     * Busca motorista por ID
     */
    public function show(int $id): DriverResource
    {
        $driver = $this->driverService->getDriverById($id);
        return new DriverResource($driver);
    }

    /**
     * Cria novo motorista
     */
    public function store(StoreDriverRequest $request): JsonResponse
    {
        $driver = $this->driverService->createDriver($request->validated());

        return response()->json([
            'message' => 'Motorista criado com sucesso',
            'data' => new DriverResource($driver),
        ], 201);
    }

    /**
     * Atualiza motorista
     */
    public function update(UpdateDriverRequest $request, int $id): JsonResponse
    {
        $driver = $this->driverService->updateDriver($id, $request->validated());

        return response()->json([
            'message' => 'Motorista atualizado com sucesso',
            'data' => new DriverResource($driver),
        ], 200);
    }

    /**
     * Deleta motorista
     */
    public function destroy(int $id): JsonResponse
    {
        $this->driverService->deleteDriver($id);

        return response()->json([
            'message' => 'Motorista excluído com sucesso',
        ], 200);
    }
}
