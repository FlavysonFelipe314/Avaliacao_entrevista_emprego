<?php

namespace App\Services;

use App\Models\FinancialTransaction;
use App\Models\Budget;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class FinanceService
{
    /**
     * Lista todas as transações
     */
    public function getAllTransactions(): Collection
    {
        return Cache::remember('transactions.all', 60, function () {
            return FinancialTransaction::orderBy('transaction_date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();
        });
    }

    /**
     * Busca transação por ID
     */
    public function getTransactionById(int $id): FinancialTransaction
    {
        return Cache::remember("transactions.{$id}", 300, function () use ($id) {
            return FinancialTransaction::findOrFail($id);
        });
    }

    /**
     * Cria nova transação
     */
    public function createTransaction(array $data): FinancialTransaction
    {
        $transaction = FinancialTransaction::create($data);
        Cache::forget('transactions.all');
        Cache::forget('budgets.summary');
        Cache::forget('dashboard.stats');
        return $transaction;
    }

    /**
     * Atualiza transação
     */
    public function updateTransaction(int $id, array $data): FinancialTransaction
    {
        $transaction = $this->getTransactionById($id);
        $transaction->update($data);
        Cache::forget('transactions.all');
        Cache::forget("transactions.{$id}");
        Cache::forget('budgets.summary');
        Cache::forget('dashboard.stats');
        return $transaction->fresh();
    }

    /**
     * Deleta transação
     */
    public function deleteTransaction(int $id): bool
    {
        $transaction = $this->getTransactionById($id);
        $result = $transaction->delete();
        Cache::forget('transactions.all');
        Cache::forget("transactions.{$id}");
        Cache::forget('budgets.summary');
        Cache::forget('dashboard.stats');
        return $result;
    }

    /**
     * Lista todos os orçamentos
     */
    public function getAllBudgets(): Collection
    {
        return Cache::remember('budgets.all', 300, function () {
            return Budget::orderBy('start_date', 'desc')->get();
        });
    }

    /**
     * Busca orçamento ativo
     */
    public function getActiveBudget(): ?Budget
    {
        return Cache::remember('budgets.active', 300, function () {
            return Budget::where('is_active', true)
                ->where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->first();
        });
    }

    /**
     * Busca orçamento por ID
     */
    public function getBudgetById(int $id): Budget
    {
        return Cache::remember("budgets.{$id}", 300, function () use ($id) {
            return Budget::findOrFail($id);
        });
    }

    /**
     * Cria novo orçamento
     */
    public function createBudget(array $data): Budget
    {
        // Se marcar como ativo, desativar outros
        if (isset($data['is_active']) && $data['is_active']) {
            Budget::where('is_active', true)->update(['is_active' => false]);
        }

        $budget = Budget::create($data);
        Cache::forget('budgets.all');
        Cache::forget('budgets.active');
        Cache::forget('budgets.summary');
        Cache::forget('dashboard.stats');
        return $budget;
    }

    /**
     * Atualiza orçamento
     */
    public function updateBudget(int $id, array $data): Budget
    {
        // Se marcar como ativo, desativar outros
        if (isset($data['is_active']) && $data['is_active']) {
            Budget::where('is_active', true)
                ->where('id', '!=', $id)
                ->update(['is_active' => false]);
        }

        $budget = $this->getBudgetById($id);
        $budget->update($data);
        Cache::forget('budgets.all');
        Cache::forget('budgets.active');
        Cache::forget("budgets.{$id}");
        Cache::forget('budgets.summary');
        Cache::forget('dashboard.stats');
        return $budget->fresh();
    }

    /**
     * Deleta orçamento
     */
    public function deleteBudget(int $id): bool
    {
        $budget = $this->getBudgetById($id);
        $result = $budget->delete();
        Cache::forget('budgets.all');
        Cache::forget('budgets.active');
        Cache::forget("budgets.{$id}");
        Cache::forget('budgets.summary');
        Cache::forget('dashboard.stats');
        return $result;
    }

    /**
     * Retorna resumo financeiro (orçamento + gastos)
     */
    public function getFinancialSummary(): array
    {
        return Cache::remember('budgets.summary', 30, function () {
            $budget = $this->getActiveBudget();
            
            // Calcular totais gerais (sem filtro de período se não houver orçamento)
            $allExpenses = FinancialTransaction::where('type', 'expense')->get();
            $allIncome = FinancialTransaction::where('type', 'income')->get();
            
            $totalSpentAll = $allExpenses->sum('amount');
            $totalIncomeAll = $allIncome->sum('amount');
            
            if (!$budget) {
                // Se não há orçamento ativo, mostrar totais gerais
                $fuelUsed = $allExpenses->where('category', 'fuel')->sum('amount');
                $maintenanceUsed = $allExpenses->where('category', 'maintenance')->sum('amount');
                $salariesUsed = $allExpenses->where('category', 'salaries')->sum('amount');
                $othersUsed = $allExpenses->where('category', 'others')->sum('amount');
                
                return [
                    'totalBudget' => 0,
                    'totalSpent' => (float) $totalSpentAll,
                    'totalIncome' => (float) $totalIncomeAll,
                    'available' => (float) ($totalIncomeAll - $totalSpentAll),
                    'hasActiveBudget' => false,
                    'categories' => [
                        'fuel' => [
                            'budget' => 0,
                            'used' => (float) $fuelUsed,
                        ],
                        'maintenance' => [
                            'budget' => 0,
                            'used' => (float) $maintenanceUsed,
                        ],
                        'salaries' => [
                            'budget' => 0,
                            'used' => (float) $salariesUsed,
                        ],
                        'others' => [
                            'budget' => 0,
                            'used' => (float) $othersUsed,
                        ],
                    ],
                ];
            }

            // Calcular gastos por categoria dentro do período do orçamento
            $expenses = FinancialTransaction::where('type', 'expense')
                ->whereBetween('transaction_date', [$budget->start_date, $budget->end_date])
                ->get();

            $fuelUsed = $expenses->where('category', 'fuel')->sum('amount');
            $maintenanceUsed = $expenses->where('category', 'maintenance')->sum('amount');
            $salariesUsed = $expenses->where('category', 'salaries')->sum('amount');
            $othersUsed = $expenses->where('category', 'others')->sum('amount');

            $totalSpent = $expenses->sum('amount');
            $totalIncome = FinancialTransaction::where('type', 'income')
                ->whereBetween('transaction_date', [$budget->start_date, $budget->end_date])
                ->sum('amount');

            return [
                'totalBudget' => (float) $budget->total_budget,
                'totalSpent' => (float) $totalSpent,
                'totalIncome' => (float) $totalIncome,
                'available' => (float) ($budget->total_budget - $totalSpent + $totalIncome),
                'hasActiveBudget' => true,
                'categories' => [
                    'fuel' => [
                        'budget' => (float) $budget->fuel_budget,
                        'used' => (float) $fuelUsed,
                    ],
                    'maintenance' => [
                        'budget' => (float) $budget->maintenance_budget,
                        'used' => (float) $maintenanceUsed,
                    ],
                    'salaries' => [
                        'budget' => (float) $budget->salaries_budget,
                        'used' => (float) $salariesUsed,
                    ],
                    'others' => [
                        'budget' => (float) $budget->others_budget,
                        'used' => (float) $othersUsed,
                    ],
                ],
            ];
        });
    }
}

