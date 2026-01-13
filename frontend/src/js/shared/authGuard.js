import authService from '../services/authService.js';

/**
 * Verifica se o usuário está autenticado
 * @returns {Promise<boolean>}
 */
export async function checkAuth() {
  return authService.isAuthenticated();
}

/**
 * Guard para proteger rotas que requerem autenticação
 * @param {Function} match - Função match do Navigo
 * @param {Function} resolve - Função resolve do Navigo
 * @param {Function} reject - Função reject do Navigo
 */
export async function authGuard(match, resolve, reject) {
  const isAuthenticated = await checkAuth();
  
  if (isAuthenticated) {
    resolve();
  } else {
    reject();
  }
}

/**
 * Guard para rotas públicas
 * @param {Function} match - Função match do Navigo
 * @param {Function} resolve - Função resolve do Navigo
 * @param {Function} reject - Função reject do Navigo
 */
export async function publicGuard(match, resolve, reject) {
  const isAuthenticated = await checkAuth();
  
  if (isAuthenticated && match?.url === '/login') {
    reject();
  } else {
    resolve();
  }
}
