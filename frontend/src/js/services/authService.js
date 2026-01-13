import apiClient from '../api/apiClient.js';

/**
 * Service para autenticação
 */
class AuthService {
  /**
   * Autentica com email e senha
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/login', { email, password });
      
      // Armazenar token no localStorage
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return !!token;
  }

  /**
   * Faz logout
   */
  logout() {
    localStorage.removeItem('auth_token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

export default new AuthService();

