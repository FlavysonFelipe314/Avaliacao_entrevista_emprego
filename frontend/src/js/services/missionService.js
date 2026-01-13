import apiClient from '../api/apiClient.js';

/**
 * Service para gerenciar missões
 */
class MissionService {
  /**
   * Busca todas as missões
   */
  async getAllMissions() {
    try {
      const response = await apiClient.get('/missions');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar missões:', error);
      throw error;
    }
  }

  /**
   * Inicia uma nova missão
   */
  async startMission(driverId, vehicleId, observations = null) {
    try {
      const response = await apiClient.post('/missions/start', {
        driverId,
        vehicleId,
        observations
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar missão:', error);
      throw error;
    }
  }

  /**
   * Finaliza uma missão
   */
  async stopMission(missionId) {
    try {
      const response = await apiClient.post(`/missions/${missionId}/stop`);
      return response.data;
    } catch (error) {
      console.error('Erro ao finalizar missão:', error);
      throw error;
    }
  }

  /**
   * Busca missão ativa por motorista
   */
  async getActiveMissionByDriver(driverId) {
    try {
      const response = await this.getAllMissions();
      // Processar resposta (pode vir como array ou objeto com data)
      const missions = Array.isArray(response) ? response : (response.data || []);
      
      // Garantir que é um array
      if (!Array.isArray(missions)) {
        return null;
      }
      
      return missions.find(m => {
        const missionData = m.data || m;
        return (missionData.driverId === driverId || missionData.driver_id === driverId) && missionData.status === 'active';
      });
    } catch (error) {
      console.error('Erro ao buscar missão ativa:', error);
      throw error;
    }
  }
}

export default new MissionService();

