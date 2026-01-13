import $ from 'jquery';
import Swal from 'sweetalert2';
import vehicleService from '../services/vehicleService.js';
import { navigateTo } from '../router.js';
import { removeCheckboxesFromModal } from '../utils/modalUtils.js';

/**
 * Módulo de gerenciamento de veículos/frota
 * Gerencia listagem e visualização de câmeras
 */
class VehicleModule {
  constructor() {
    this.vehicles = [];
  }
  
  /**
   * Inicializa o módulo
   */
  async init() {
    this.setupEventListeners();
    await this.loadVehicles();
  }
  
  /**
   * Carrega lista de veículos
   */
  async loadVehicles() {
    const $container = $('#vehiclesContainer');
    const $loading = $('#vehiclesLoading');
    const $error = $('#vehiclesError');
    
    $loading.show();
    $container.hide();
    $error.hide();
    
    try {
      const response = await vehicleService.getAllVehicles();
      this.vehicles = Array.isArray(response) ? response : response.data || [];
      
      $loading.hide();
      
      if (this.vehicles.length === 0) {
        $container.html(`
          <div class="text-center py-12 text-zinc-400">
            <p>Nenhum veículo encontrado</p>
          </div>
        `);
        $container.show();
        return;
      }
      
      // Renderizar cards de veículos
      const cards = this.vehicles.map(vehicle => {
        const vehicleData = vehicle.data || vehicle;
        const operadorAtual = vehicleData.operadorAtual || vehicleData.operador_atual;
        const status = vehicleData.status || 'inactive';
        const statusFinal = (status === 'active' && !operadorAtual) ? 'available' : status;
        
        return `
        <div class="vehicle-card bg-zinc-900 border border-zinc-800 rounded-lg hover:border-emerald-500/50 transition-all" data-id="${vehicleData.id}" style="padding: 2rem;">
          <div class="flex justify-between items-start" style="margin-bottom: 1.5rem;">
            <div class="flex items-center" style="gap: 1rem;">
              <div class="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                <svg class="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
            </div>
            <span class="status-badge status-${statusFinal}">
              ${this.getStatusLabel(statusFinal)}
            </span>
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h3 class="text-2xl font-bold text-white font-mono" style="margin-bottom: 0.5rem;">${vehicleData.modelo || vehicleData.tipo || 'Veículo'}</h3>
            <p class="text-emerald-500 font-mono text-sm">PLACA: ${vehicleData.placa || vehicleData.codigo || 'N/A'}</p>
            ${operadorAtual ? `<p class="text-zinc-400 text-xs mt-1">Operador: ${operadorAtual}</p>` : ''}
          </div>
          
          <div class="flex flex-wrap" style="gap: 0.5rem;">
            <button class="btn-edit-vehicle flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded border border-zinc-600 font-mono text-xs transition-colors" data-id="${vehicleData.id}" style="gap: 0.5rem; padding: 0.5rem 0.75rem; min-height: 36px; flex: 1 1 auto;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span class="hidden sm:inline">Editar</span>
            </button>
            <button class="btn-delete-vehicle flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded border border-red-500 font-mono text-xs transition-colors" data-id="${vehicleData.id}" style="gap: 0.5rem; padding: 0.5rem 0.75rem; min-height: 36px; flex: 1 1 auto;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span class="hidden sm:inline">Excluir</span>
            </button>
          </div>
        </div>
      `;
      }).join('');
      
      $container.html(cards);
      $container.show();
      
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      $loading.hide();
      $error.show();
      $error.text('Erro ao carregar frota');
      
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.response?.data?.message || 'Não foi possível carregar a lista de veículos',
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
  
  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Botão adicionar veículo - usar delegação de eventos para garantir que funcione
    $(document).off('click', '#btnAddVehicle').on('click', '#btnAddVehicle', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showAddVehicleModal();
    });
    
    // Também tentar anexar diretamente ao elemento se já existir
    const $btn = $('#btnAddVehicle');
    if ($btn.length) {
      $btn.off('click').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showAddVehicleModal();
      });
    }
    
    // Botões de editar e deletar veículo
    $(document).off('click', '.btn-edit-vehicle').on('click', '.btn-edit-vehicle', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const vehicleId = $(e.currentTarget).data('id');
      this.showEditVehicleModal(vehicleId);
    });
    
    $(document).off('click', '.btn-delete-vehicle').on('click', '.btn-delete-vehicle', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const vehicleId = $(e.currentTarget).data('id');
      await this.deleteVehicle(vehicleId);
    });
  }
  
  async showAddVehicleModal() {
    const { value: formData } = await Swal.fire({
      title: 'NOVO VEÍCULO',
      html: `
        <div class="text-left space-y-4" style="max-width: 600px;">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">CÓDIGO *</label>
              <input id="swal-codigo" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="VH-001" required />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">PLACA *</label>
              <input id="swal-placa" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm uppercase" placeholder="ABC-1234" maxlength="10" required />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">MODELO</label>
              <input id="swal-modelo" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="Sprinter 515 CDI" />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">TIPO</label>
              <select id="swal-tipo" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm">
                <option value="">Selecione</option>
                <option value="Blindado">Blindado</option>
                <option value="Escolta">Escolta</option>
                <option value="Logística">Logística</option>
                <option value="Suporte">Suporte</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">STATUS</label>
            <select id="swal-status" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm">
              <option value="available">DISPONÍVEL</option>
              <option value="active">EM TRÂNSITO</option>
              <option value="maintenance">MANUTENÇÃO</option>
              <option value="inactive">INATIVO</option>
            </select>
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
        $('#swal-placa').on('input', function() {
          let value = $(this).val().toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 7) {
            if (value.length <= 3) {
              $(this).val(value);
            } else if (value.length <= 4) {
              $(this).val(value.substring(0, 3) + '-' + value.substring(3));
            } else {
              $(this).val(value.substring(0, 3) + '-' + value.substring(3, 7));
            }
          }
        });
      },
      preConfirm: () => {
        return {
          codigo: $('#swal-codigo').val(),
          placa: $('#swal-placa').val().replace(/-/g, '').toUpperCase(),
          modelo: $('#swal-modelo').val() || null,
          tipo: $('#swal-tipo').val() || null,
          status: $('#swal-status').val() || 'available',
        };
      }
    });
    
    if (formData && formData.codigo && formData.placa) {
      try {
        await vehicleService.createVehicle(formData);
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Veículo cadastrado com sucesso',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
        await this.loadVehicles();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível cadastrar o veículo',
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
  
  getStatusLabel(status) {
    const labels = {
      active: 'EM TRÂNSITO',
      available: 'DISPONÍVEL',
      maintenance: 'MANUTENÇÃO',
      inactive: 'INATIVO'
    };
    return labels[status] || 'DESCONHECIDO';
  }
  
  
  async showEditVehicleModal(vehicleId) {
    const vehicle = this.vehicles.find(v => {
      const vData = v.data || v;
      return vData.id === vehicleId;
    });
    
    if (!vehicle) return;
    
    const vehicleData = vehicle.data || vehicle;
    
    const { value: formData } = await Swal.fire({
      title: 'EDITAR VEÍCULO',
      html: `
        <div class="text-left space-y-4" style="max-width: 600px;">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">CÓDIGO *</label>
              <input id="swal-codigo" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="VH-001" value="${vehicleData.codigo || ''}" required />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">PLACA *</label>
              <input id="swal-placa" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm uppercase" placeholder="ABC-1234" maxlength="10" value="${vehicleData.placa || ''}" required />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">MODELO</label>
              <input id="swal-modelo" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="Sprinter 515 CDI" value="${vehicleData.modelo || ''}" />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">TIPO</label>
              <select id="swal-tipo" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm">
                <option value="">Selecione</option>
                <option value="Blindado" ${vehicleData.tipo === 'Blindado' ? 'selected' : ''}>Blindado</option>
                <option value="Escolta" ${vehicleData.tipo === 'Escolta' ? 'selected' : ''}>Escolta</option>
                <option value="Logística" ${vehicleData.tipo === 'Logística' ? 'selected' : ''}>Logística</option>
                <option value="Suporte" ${vehicleData.tipo === 'Suporte' ? 'selected' : ''}>Suporte</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">STATUS</label>
            <select id="swal-status" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm">
              <option value="available" ${vehicleData.status === 'available' ? 'selected' : ''}>DISPONÍVEL</option>
              <option value="active" ${vehicleData.status === 'active' ? 'selected' : ''}>EM TRÂNSITO</option>
              <option value="maintenance" ${vehicleData.status === 'maintenance' ? 'selected' : ''}>MANUTENÇÃO</option>
              <option value="inactive" ${vehicleData.status === 'inactive' ? 'selected' : ''}>INATIVO</option>
            </select>
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
        $('#swal-placa').on('input', function() {
          let value = $(this).val().toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 7) {
            if (value.length <= 3) {
              $(this).val(value);
            } else if (value.length <= 4) {
              $(this).val(value.substring(0, 3) + '-' + value.substring(3));
            } else {
              $(this).val(value.substring(0, 3) + '-' + value.substring(3, 7));
            }
          }
        });
      },
      preConfirm: () => {
        return {
          codigo: $('#swal-codigo').val(),
          placa: $('#swal-placa').val().replace(/-/g, '').toUpperCase(),
          modelo: $('#swal-modelo').val() || null,
          tipo: $('#swal-tipo').val() || null,
          status: $('#swal-status').val() || 'available',
        };
      }
    });
    
    if (formData && formData.codigo && formData.placa) {
      try {
        await vehicleService.updateVehicle(vehicleId, formData);
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Veículo atualizado com sucesso',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
        await this.loadVehicles();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível atualizar o veículo',
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
  
  async deleteVehicle(vehicleId) {
    const result = await Swal.fire({
      title: 'Excluir Veículo?',
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
      try {
        await vehicleService.deleteVehicle(vehicleId);
        await Swal.fire({
          icon: 'success',
          title: 'Excluído!',
          text: 'Veículo removido',
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
        await this.loadVehicles();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível excluir o veículo',
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
}

// Instância singleton
let vehicleModuleInstance = null;

/**
 * Inicializa o módulo de veículos
 */
export async function initVehicleModule() {
  if (vehicleModuleInstance) {
    vehicleModuleInstance = null;
  }
  vehicleModuleInstance = new VehicleModule();
  await vehicleModuleInstance.init();
  return vehicleModuleInstance;
}

export default VehicleModule;
