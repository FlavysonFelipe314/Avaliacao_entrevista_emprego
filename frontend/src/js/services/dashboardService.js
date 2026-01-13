import apiClient from '../api/apiClient.js';

/**
 * Service para dashboard
 */
class DashboardService {
  /**
   * Busca estatísticas do dashboard
   */
  async getStats() {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}

export default new DashboardService();

