<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\MissionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Support\Facades\Route;

// Rotas públicas de autenticação
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas (requerem autenticação)
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Motoristas
    Route::prefix('motoristas')->group(function () {
        Route::get('/', [DriverController::class, 'index']);
        Route::get('/{id}', [DriverController::class, 'show']);
        Route::post('/', [DriverController::class, 'store']);
        Route::put('/{id}', [DriverController::class, 'update']);
        Route::delete('/{id}', [DriverController::class, 'destroy']);
    });

    // Veículos
    Route::prefix('vehicles')->group(function () {
        Route::get('/', [VehicleController::class, 'index']);
        Route::get('/available', [VehicleController::class, 'available']);
        Route::get('/{id}', [VehicleController::class, 'show']);
        Route::post('/', [VehicleController::class, 'store']);
        Route::put('/{id}', [VehicleController::class, 'update']);
        Route::delete('/{id}', [VehicleController::class, 'destroy']);
    });

    // Missões
    Route::prefix('missions')->group(function () {
        Route::get('/', [MissionController::class, 'index']);
        Route::get('/{id}', [MissionController::class, 'show']);
        Route::post('/start', [MissionController::class, 'start']);
        Route::post('/{id}/stop', [MissionController::class, 'stop']);
    });

    // Financeiro
    Route::prefix('finance')->group(function () {
        Route::get('/summary', [FinanceController::class, 'summary']);
        Route::get('/transactions', [FinanceController::class, 'transactions']);
        Route::post('/transactions', [FinanceController::class, 'storeTransaction']);
        Route::put('/transactions/{id}', [FinanceController::class, 'updateTransaction']);
        Route::delete('/transactions/{id}', [FinanceController::class, 'deleteTransaction']);
        Route::get('/budgets', [FinanceController::class, 'budgets']);
        Route::get('/budgets/active', [FinanceController::class, 'activeBudget']);
        Route::post('/budgets', [FinanceController::class, 'storeBudget']);
        Route::put('/budgets/{id}', [FinanceController::class, 'updateBudget']);
        Route::delete('/budgets/{id}', [FinanceController::class, 'deleteBudget']);
    });

    // Usuários
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/me', [UserController::class, 'me']);
        Route::put('/me', [UserController::class, 'updateProfile']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
});

// Rotas temporárias sem autenticação para desenvolvimento
// TODO: Remover após implementar autenticação completa
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
Route::prefix('motoristas')->group(function () {
    Route::get('/', [DriverController::class, 'index']);
    Route::get('/{id}', [DriverController::class, 'show']);
    Route::post('/', [DriverController::class, 'store']);
    Route::put('/{id}', [DriverController::class, 'update']);
    Route::delete('/{id}', [DriverController::class, 'destroy']);
});
Route::prefix('vehicles')->group(function () {
    Route::get('/', [VehicleController::class, 'index']);
    Route::get('/available', [VehicleController::class, 'available']);
    Route::get('/{id}', [VehicleController::class, 'show']);
});
Route::prefix('missions')->group(function () {
    Route::get('/', [MissionController::class, 'index']);
    Route::get('/{id}', [MissionController::class, 'show']);
    Route::post('/start', [MissionController::class, 'start']);
    Route::post('/{id}/stop', [MissionController::class, 'stop']);
});
Route::prefix('finance')->group(function () {
    Route::get('/summary', [FinanceController::class, 'summary']);
    Route::get('/transactions', [FinanceController::class, 'transactions']);
    Route::post('/transactions', [FinanceController::class, 'storeTransaction']);
    Route::put('/transactions/{id}', [FinanceController::class, 'updateTransaction']);
    Route::delete('/transactions/{id}', [FinanceController::class, 'deleteTransaction']);
    Route::get('/budgets', [FinanceController::class, 'budgets']);
    Route::get('/budgets/active', [FinanceController::class, 'activeBudget']);
    Route::post('/budgets', [FinanceController::class, 'storeBudget']);
    Route::put('/budgets/{id}', [FinanceController::class, 'updateBudget']);
    Route::delete('/budgets/{id}', [FinanceController::class, 'deleteBudget']);
});
