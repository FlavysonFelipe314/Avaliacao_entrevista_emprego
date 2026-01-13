<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardStatsResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService
    ) {}

    /**
     * Retorna estatísticas do dashboard
     */
    public function stats(): JsonResponse
    {
        $stats = $this->dashboardService->getStats();
        return response()->json(new DashboardStatsResource($stats), 200);
    }
}
