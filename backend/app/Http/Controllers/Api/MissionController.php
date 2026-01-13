<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StartMissionRequest;
use App\Http\Resources\MissionResource;
use App\Services\MissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MissionController extends Controller
{
    public function __construct(
        private readonly MissionService $missionService
    ) {}

    /**
     * Lista todas as missões
     */
    public function index(): AnonymousResourceCollection
    {
        $missions = $this->missionService->getAllMissions();
        return MissionResource::collection($missions);
    }

    /**
     * Busca missão por ID
     */
    public function show(int $id): MissionResource
    {
        $mission = $this->missionService->getMissionById($id);
        return new MissionResource($mission);
    }

    /**
     * Inicia uma nova missão
     */
    public function start(StartMissionRequest $request): JsonResponse
    {
        try {
            $mission = $this->missionService->startMission(
                $request->input('driverId'),
                $request->input('vehicleId'),
                $request->input('observations')
            );

            return response()->json([
                'message' => 'Missão iniciada com sucesso',
                'data' => new MissionResource($mission),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 422);
        }
    }

    /**
     * Finaliza uma missão
     */
    public function stop(int $id): JsonResponse
    {
        try {
            $mission = $this->missionService->stopMission($id);

            return response()->json([
                'message' => 'Missão finalizada com sucesso',
                'data' => new MissionResource($mission),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 422);
        }
    }
}
