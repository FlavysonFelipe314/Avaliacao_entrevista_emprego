import apiClient from '../api/apiClient.js';

class UserService {
  async getAllUsers() {
    try {
      const response = await apiClient.get('/users');
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  async getMe() {
    try {
      const response = await apiClient.get('/users/me');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  }

  async createUser(data) {
    try {
      const response = await apiClient.post('/users', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async updateUser(id, data) {
    try {
      const response = await apiClient.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  async updateProfile(data) {
    try {
      const response = await apiClient.put('/users/me', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}

export default new UserService();

