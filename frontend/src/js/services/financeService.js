import apiClient from '../api/apiClient.js';

/**
 * Service para gerenciar finanças
 */
class FinanceService {
  /**
   * Busca resumo financeiro
   */
  async getSummary() {
    try {
      const response = await apiClient.get('/finance/summary');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar resumo financeiro:', error);
      throw error;
    }
  }

  /**
   * Busca todas as transações
   */
  async getTransactions() {
    try {
      const response = await apiClient.get('/finance/transactions');
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  }

  /**
   * Cria nova transação
   */
  async createTransaction(data) {
    try {
      const response = await apiClient.post('/finance/transactions', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  }

  /**
   * Atualiza transação
   */
  async updateTransaction(id, data) {
    try {
      const response = await apiClient.put(`/finance/transactions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  }

  /**
   * Deleta transação
   */
  async deleteTransaction(id) {
    try {
      const response = await apiClient.delete(`/finance/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  }

  /**
   * Busca todos os orçamentos
   */
  async getBudgets() {
    try {
      const response = await apiClient.get('/finance/budgets');
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      throw error;
    }
  }

  /**
   * Busca orçamento ativo
   */
  async getActiveBudget() {
    try {
      const response = await apiClient.get('/finance/budgets/active');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar orçamento ativo:', error);
      throw error;
    }
  }

  /**
   * Cria novo orçamento
   */
  async createBudget(data) {
    try {
      const response = await apiClient.post('/finance/budgets', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      throw error;
    }
  }

  /**
   * Atualiza orçamento
   */
  async updateBudget(id, data) {
    try {
      const response = await apiClient.put(`/finance/budgets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      throw error;
    }
  }

  /**
   * Deleta orçamento
   */
  async deleteBudget(id) {
    try {
      const response = await apiClient.delete(`/finance/budgets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      throw error;
    }
  }
}

export default new FinanceService();

