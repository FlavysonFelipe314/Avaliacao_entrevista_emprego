import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Limpar token inválido
        localStorage.removeItem('auth_token');
        delete apiClient.defaults.headers.common['Authorization'];
        // Redirecionar apenas se não estiver na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      if (status === 403) {
        console.error('Acesso negado:', data.message || 'Você não tem permissão para esta ação');
      }
      
      if (status === 404) {
        console.error('Recurso não encontrado:', data.message || 'O recurso solicitado não existe');
      }
      
      if (status >= 500) {
        console.error('Erro no servidor:', data.message || 'Erro interno do servidor');
      }
    } else if (error.request) {
      console.error('Erro de rede: Não foi possível conectar ao servidor');
    } else {
      console.error('Erro:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

