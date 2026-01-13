<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Resources\BudgetResource;
use App\Http\Resources\TransactionResource;
use App\Services\FinanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FinanceController extends Controller
{
    public function __construct(
        private readonly FinanceService $financeService
    ) {}

    /**
     * Retorna resumo financeiro
     */
    public function summary(): JsonResponse
    {
        $summary = $this->financeService->getFinancialSummary();
        return response()->json($summary, 200);
    }

    /**
     * Lista todas as transações
     */
    public function transactions(): AnonymousResourceCollection
    {
        $transactions = $this->financeService->getAllTransactions();
        return TransactionResource::collection($transactions);
    }

    /**
     * Cria nova transação
     */
    public function storeTransaction(StoreTransactionRequest $request): JsonResponse
    {
        $transaction = $this->financeService->createTransaction($request->validated());

        return response()->json([
            'message' => 'Transação criada com sucesso',
            'data' => new TransactionResource($transaction),
        ], 201);
    }

    /**
     * Atualiza transação
     */
    public function updateTransaction(StoreTransactionRequest $request, int $id): JsonResponse
    {
        $transaction = $this->financeService->updateTransaction($id, $request->validated());

        return response()->json([
            'message' => 'Transação atualizada com sucesso',
            'data' => new TransactionResource($transaction),
        ], 200);
    }

    /**
     * Deleta transação
     */
    public function deleteTransaction(int $id): JsonResponse
    {
        $this->financeService->deleteTransaction($id);

        return response()->json([
            'message' => 'Transação excluída com sucesso',
        ], 200);
    }

    /**
     * Lista todos os orçamentos
     */
    public function budgets(): AnonymousResourceCollection
    {
        $budgets = $this->financeService->getAllBudgets();
        return BudgetResource::collection($budgets);
    }

    /**
     * Busca orçamento ativo
     */
    public function activeBudget(): JsonResponse
    {
        $budget = $this->financeService->getActiveBudget();
        
        if (!$budget) {
            return response()->json([
                'message' => 'Nenhum orçamento ativo encontrado',
            ], 404);
        }

        return response()->json(new BudgetResource($budget), 200);
    }

    /**
     * Cria novo orçamento
     */
    public function storeBudget(StoreBudgetRequest $request): JsonResponse
    {
        $budget = $this->financeService->createBudget($request->validated());

        return response()->json([
            'message' => 'Orçamento criado com sucesso',
            'data' => new BudgetResource($budget),
        ], 201);
    }

    /**
     * Atualiza orçamento
     */
    public function updateBudget(StoreBudgetRequest $request, int $id): JsonResponse
    {
        $budget = $this->financeService->updateBudget($id, $request->validated());

        return response()->json([
            'message' => 'Orçamento atualizado com sucesso',
            'data' => new BudgetResource($budget),
        ], 200);
    }

    /**
     * Deleta orçamento
     */
    public function deleteBudget(int $id): JsonResponse
    {
        $this->financeService->deleteBudget($id);

        return response()->json([
            'message' => 'Orçamento excluído com sucesso',
        ], 200);
    }
}
