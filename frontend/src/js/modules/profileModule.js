import $ from 'jquery';
import Swal from 'sweetalert2';
import userService from '../services/userService.js';
import { removeCheckboxesFromModal } from '../utils/modalUtils.js';

class ProfileModule {
  constructor() {
    this.user = null;
  }

  async init() {
    this.setupEventListeners();
    await this.loadProfile();
  }

  async loadProfile() {
    const $loading = $('#profileLoading');
    const $error = $('#profileError');
    const $form = $('#profileForm');

    $loading.show();
    $form.hide();
    $error.hide();

    try {
      const response = await userService.getMe();
      this.user = response.data || response;

      $('#profile-name').val(this.user.name || '');
      $('#profile-email').val(this.user.email || '');

      $loading.hide();
      $form.show();
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      $loading.hide();
      $error.show();
      $error.text('Erro ao carregar perfil');

      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.response?.data?.message || 'Não foi possível carregar o perfil',
        confirmButtonColor: '#10b981',
        background: '#1f2937',
        color: '#ffffff',
        backdrop: 'rgba(0, 0, 0, 0.8)',
        didOpen: () => {
          removeCheckboxesFromModal();
        }
      });
    }
  }

  setupEventListeners() {
    $(document).off('submit', '#profileFormElement').on('submit', '#profileFormElement', async (e) => {
      e.preventDefault();
      await this.updateProfile();
    });
  }

  async updateProfile() {
    const name = $('#profile-name').val().trim();
    const email = $('#profile-email').val().trim();
    const password = $('#profile-password').val().trim();

    if (!name || !email) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Nome e e-mail são obrigatórios',
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

    if (password && password.length < 6) {
      await Swal.fire({
        icon: 'warning',
        title: 'Senha inválida',
        text: 'A senha deve ter no mínimo 6 caracteres',
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

    const $submitBtn = $('#profileFormElement button[type="submit"]');
    $submitBtn.prop('disabled', true).text('Salvando...');

    try {
      const data = {
        name,
        email,
      };

      if (password) {
        data.password = password;
      }

      await userService.updateProfile(data);
      
      $('#profile-password').val('');

      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Perfil atualizado com sucesso',
        timer: 1500,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#ffffff',
        backdrop: 'rgba(0, 0, 0, 0.8)',
        didOpen: () => {
          removeCheckboxesFromModal();
        }
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.response?.data?.message || 'Não foi possível atualizar o perfil',
        confirmButtonColor: '#10b981',
        background: '#1f2937',
        color: '#ffffff',
        backdrop: 'rgba(0, 0, 0, 0.8)',
        didOpen: () => {
          removeCheckboxesFromModal();
        }
      });
    } finally {
      $submitBtn.prop('disabled', false).text('SALVAR ALTERAÇÕES');
    }
  }

  destroy() {
    $(document).off('submit', '#profileFormElement');
  }
}

let profileModuleInstance = null;

export async function initProfileModule() {
  if (profileModuleInstance) {
    profileModuleInstance.destroy();
  }
  profileModuleInstance = new ProfileModule();
  await profileModuleInstance.init();
  return profileModuleInstance;
}

export default ProfileModule;

