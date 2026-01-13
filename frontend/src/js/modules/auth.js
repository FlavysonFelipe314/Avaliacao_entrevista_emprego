import $ from 'jquery';
import Swal from 'sweetalert2';
import { initMatrixRain, destroyMatrixRain } from './matrixRain.js';
import { navigateTo } from '../router.js';
import authService from '../services/authService.js';
import { removeCheckboxesFromModal } from '../utils/modalUtils.js';

class AuthModule {
  constructor() {
    this.currentStep = 'login';
    this.loginId = null;
    this.userId = null;
  }
  
  init() {
    this.initMatrixCanvas();
    this.setupLoginForm();
  }
  
  initMatrixCanvas() {
    setTimeout(() => {
      initMatrixRain('matrix-canvas');
    }, 100);
  }
  
  setupLoginForm() {
    $(document).off('submit', '#loginForm').on('submit', '#loginForm', async (e) => {
      e.preventDefault();
      
      const email = $('#email').val().trim();
      const password = $('#password').val();
      
      if (!email || !password) {
        await Swal.fire({
          icon: 'warning',
          title: 'Campos obrigatórios',
          text: 'Por favor, informe email e senha',
          confirmButtonColor: '#10b981',
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
        return;
      }
      
      const $submitBtn = $('#loginForm button[type="submit"]');
      $submitBtn.prop('disabled', true).text('Autenticando...');
      
      try {
        const response = await authService.login(email, password);
        
        await Swal.fire({
          icon: 'success',
          title: 'Autenticação bem-sucedida',
          text: 'Redirecionando...',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#10b981',
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
        
        destroyMatrixRain();
        navigateTo('/dashboard');
      } catch (error) {
        const message = error.response?.data?.message || 'Credenciais inválidas';
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: message,
          confirmButtonColor: '#10b981',
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
      } finally {
        $submitBtn.prop('disabled', false).text('ENTRAR');
      }
    });
  }
  
  destroy() {
    destroyMatrixRain();
    $(document).off('submit', '#loginForm');
  }
}

let authModuleInstance = null;

export function initAuth() {
  if (authModuleInstance) {
    authModuleInstance.destroy();
  }
  authModuleInstance = new AuthModule();
  authModuleInstance.init();
  return authModuleInstance;
}

export default AuthModule;
