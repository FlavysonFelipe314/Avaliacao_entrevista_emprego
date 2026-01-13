<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Services\VehicleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VehicleController extends Controller
{
    public function __construct(
        private readonly VehicleService $vehicleService
    ) {}

    /**
     * Lista todos os veículos
     */
    public function index(): AnonymousResourceCollection
    {
        $vehicles = $this->vehicleService->getAllVehicles();
        return VehicleResource::collection($vehicles);
    }

    /**
     * Busca veículo por ID
     */
    public function show(int $id): VehicleResource
    {
        $vehicle = $this->vehicleService->getVehicleById($id);
        return new VehicleResource($vehicle);
    }

    /**
     * Lista veículos disponíveis
     */
    public function available(): AnonymousResourceCollection
    {
        $vehicles = $this->vehicleService->getAvailableVehicles();
        return VehicleResource::collection($vehicles);
    }

    /**
     * Cria novo veículo
     */
    public function store(StoreVehicleRequest $request): JsonResponse
    {
        $vehicle = $this->vehicleService->createVehicle($request->validated());

        return response()->json([
            'message' => 'Veículo criado com sucesso',
            'data' => new VehicleResource($vehicle),
        ], 201);
    }

    /**
     * Atualiza veículo
     */
    public function update(UpdateVehicleRequest $request, int $id): JsonResponse
    {
        $vehicle = $this->vehicleService->updateVehicle($id, $request->validated());

        return response()->json([
            'message' => 'Veículo atualizado com sucesso',
            'data' => new VehicleResource($vehicle),
        ], 200);
    }

    /**
     * Deleta veículo
     */
    public function destroy(int $id): JsonResponse
    {
        $this->vehicleService->deleteVehicle($id);

        return response()->json([
            'message' => 'Veículo excluído com sucesso',
        ], 200);
    }
}
