import $ from 'jquery';
import Swal from 'sweetalert2';
import userService from '../services/userService.js';
import { removeCheckboxesFromModal } from '../utils/modalUtils.js';

class UserModule {
  constructor() {
    this.users = [];
  }

  async init() {
    this.setupEventListeners();
    await this.loadUsers();
  }

  async loadUsers() {
    const $tableBody = $('#usersTableBody');
    const $loading = $('#usersLoading');
    const $error = $('#usersError');

    $loading.show();
    $tableBody.hide();
    $error.hide();

    try {
      const response = await userService.getAllUsers();
      this.users = Array.isArray(response) ? response : response.data || [];

      $loading.hide();

      if (this.users.length === 0) {
        $tableBody.html(`
          <tr>
            <td colspan="4" class="text-center py-8 text-zinc-400">
              Nenhum usuário encontrado
            </td>
          </tr>
        `);
        $tableBody.show();
        return;
      }

      const rows = this.users.map(user => {
        const userData = user.data || user;
        const createdAt = userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('pt-BR') : '-';
        
        return `
          <tr class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors" data-id="${userData.id}">
            <td class="text-zinc-200" style="padding: 1rem 1.5rem;">${userData.name || '-'}</td>
            <td class="text-zinc-400 font-mono text-sm" style="padding: 1rem 1.5rem;">${userData.email || '-'}</td>
            <td class="text-zinc-400 font-mono text-xs" style="padding: 1rem 1.5rem;">${createdAt}</td>
            <td style="padding: 1rem 1.5rem;">
              <div class="flex flex-wrap" style="gap: 0.5rem;">
                <button class="btn-edit-user flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded border border-zinc-600 font-mono text-xs transition-colors" data-id="${userData.id}" style="gap: 0.5rem; padding: 0.5rem 0.75rem; min-height: 36px;">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span class="hidden sm:inline">Editar</span>
                </button>
                <button class="btn-delete-user flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded border border-red-500 font-mono text-xs transition-colors" data-id="${userData.id}" style="gap: 0.5rem; padding: 0.5rem 0.75rem; min-height: 36px;">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span class="hidden sm:inline">Excluir</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      $tableBody.html(rows);
      $tableBody.show();

    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      $loading.hide();
      $error.show();
      $error.text('Erro ao carregar usuários');

      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.response?.data?.message || 'Não foi possível carregar a lista de usuários',
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
    $(document).off('click', '#btnAddUser').on('click', '#btnAddUser', () => {
      this.showAddUserModal();
    });

    $(document).off('click', '.btn-edit-user').on('click', '.btn-edit-user', (e) => {
      const userId = $(e.currentTarget).data('id');
      this.showEditUserModal(userId);
    });

    $(document).off('click', '.btn-delete-user').on('click', '.btn-delete-user', async (e) => {
      const userId = $(e.currentTarget).data('id');
      await this.deleteUser(userId);
    });
  }

  async showAddUserModal() {
    const { value: formData } = await Swal.fire({
      title: 'NOVO USUÁRIO',
      html: `
        <div class="text-left space-y-4" style="max-width: 600px;">
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">NOME *</label>
            <input id="swal-name" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="Nome completo" required />
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">E-MAIL *</label>
            <input id="swal-email" type="email" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="email@exemplo.com" required />
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">SENHA *</label>
            <input id="swal-password" type="password" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="Mínimo 6 caracteres" required />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'SALVAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      width: '700px',
      background: '#1f2937',
      color: '#ffffff',
      backdrop: 'rgba(0, 0, 0, 0.8)',
      didOpen: () => {
        removeCheckboxesFromModal();
      },
      preConfirm: () => {
        return {
          name: $('#swal-name').val(),
          email: $('#swal-email').val(),
          password: $('#swal-password').val(),
        };
      }
    });

    if (formData && formData.name && formData.email && formData.password) {
      try {
        await userService.createUser(formData);
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Usuário cadastrado com sucesso',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
        await this.loadUsers();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível cadastrar o usuário',
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
  }

  async showEditUserModal(userId) {
    const user = await userService.getUserById(userId);
    const userData = user.data || user;

    const { value: formData } = await Swal.fire({
      title: 'EDITAR USUÁRIO',
      html: `
        <div class="text-left space-y-4" style="max-width: 600px;">
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">NOME *</label>
            <input id="swal-name" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" value="${userData.name || ''}" required />
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">E-MAIL *</label>
            <input id="swal-email" type="email" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" value="${userData.email || ''}" required />
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">NOVA SENHA (opcional)</label>
            <input id="swal-password" type="password" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="Deixe em branco para manter a atual" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'SALVAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      width: '700px',
      background: '#1f2937',
      color: '#ffffff',
      backdrop: 'rgba(0, 0, 0, 0.8)',
      didOpen: () => {
        removeCheckboxesFromModal();
      },
      preConfirm: () => {
        return {
          name: $('#swal-name').val(),
          email: $('#swal-email').val(),
          password: $('#swal-password').val() || null,
        };
      }
    });

    if (formData && formData.name && formData.email) {
      try {
        await userService.updateUser(userId, formData);
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Usuário atualizado com sucesso',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
        await this.loadUsers();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível atualizar o usuário',
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
  }

  async deleteUser(userId) {
    const result = await Swal.fire({
      title: 'Excluir Usuário?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: '#1f2937',
      color: '#ffffff',
      backdrop: 'rgba(0, 0, 0, 0.8)',
      didOpen: () => {
        removeCheckboxesFromModal();
      }
    });

    if (result.isConfirmed) {
      const $row = $(`tr[data-id="${userId}"]`);
      $row.fadeOut(300, () => {
        $row.remove();

        const $tableBody = $('#usersTableBody');
        if ($tableBody.find('tr').length === 0) {
          $tableBody.html(`
            <tr>
              <td colspan="4" class="text-center py-8 text-zinc-400">
                Nenhum usuário encontrado
              </td>
            </tr>
          `);
        }
      });

      try {
        await userService.deleteUser(userId);
        await Swal.fire({
          icon: 'success',
          title: 'Excluído!',
          text: 'Usuário removido',
          timer: 1000,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
      } catch (error) {
        await this.loadUsers();
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível excluir o usuário',
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
  }

  destroy() {
    $(document).off('click', '#btnAddUser');
    $(document).off('click', '.btn-edit-user');
    $(document).off('click', '.btn-delete-user');
  }
}

let userModuleInstance = null;

export async function initUserModule() {
  if (userModuleInstance) {
    userModuleInstance.destroy();
  }
  userModuleInstance = new UserModule();
  await userModuleInstance.init();
  return userModuleInstance;
}

export default UserModule;

