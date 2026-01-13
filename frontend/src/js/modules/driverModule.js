import $ from 'jquery';
import Swal from 'sweetalert2';
import { navigateTo } from '../router.js';
import driverService from '../services/driverService.js';
import vehicleService from '../services/vehicleService.js';
import missionService from '../services/missionService.js';
import { removeCheckboxesFromModal } from '../utils/modalUtils.js';

class DriverModule {
  constructor() {
    this.drivers = [];
    this.vehicles = [];
  }
  
  async init() {
    await this.loadVehicles();
    this.setupEventListeners();
    await this.loadDrivers();
  }
  
  async loadDrivers() {
    const $tableBody = $('#driversTableBody');
    const $loading = $('#driversLoading');
    const $error = $('#driversError');
    
    $loading.show();
    $tableBody.hide();
    $error.hide();
    
    try {
      const response = await driverService.getAllDrivers();
      this.drivers = Array.isArray(response) ? response : response.data || [];
      
      $loading.hide();
      
      if (this.drivers.length === 0) {
        $tableBody.html(`
          <tr>
            <td colspan="6" class="text-center py-8 text-zinc-400">
              Nenhum operador encontrado
            </td>
          </tr>
        `);
        $tableBody.show();
        return;
      }
      
      const rows = this.drivers.map(driver => `
        <tr class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors" data-id="${driver.id}">
          <td class="font-mono text-sm text-zinc-300" style="padding: 1rem 1.5rem;">${driver.codigo || driver.id}</td>
          <td class="text-zinc-200" style="padding: 1rem 1.5rem;">${driver.nome || '-'}</td>
          <td class="text-zinc-400" style="padding: 1rem 1.5rem;">${driver.especialidade || '-'}</td>
          <td style="padding: 1rem 1.5rem;">
            <span class="status-badge status-${driver.status || 'inactive'}">
              ${this.getStatusLabel(driver.status)}
            </span>
          </td>
          <td class="text-zinc-400 font-mono text-xs" style="padding: 1rem 1.5rem;">${driver.veiculoAtual || driver.veiculo_atual || '-'}</td>
          <td style="padding: 1rem 1.5rem;">
            <div class="flex flex-wrap" style="gap: 0.5rem;">
              ${driver.status === 'active' 
                ? `<button class="btn-stop-mission flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded border border-red-500 font-mono text-xs transition-colors" data-id="${driver.id}" style="gap: 0.5rem; padding: 0.5rem 0.75rem; min-height: 36px; flex: 1 1 auto;">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z"></path>
                    </svg>
                    <span class="hidden sm:inline">Parar</span>
                  </button>`
                : `<button class="btn-start-mission flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded border border-emerald-500 font-mono text-xs transition-colors" data-id="${driver.id}" style="gap: 0.5rem; padding: 0.5rem 0.75rem; min-height: 36px; flex: 1 1 auto;">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="hidden sm:inline">Iniciar</span>
                  </button>`
              }
              <button class="btn-edit-driver flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded border border-zinc-600 font-mono text-xs transition-colors" data-id="${driver.id}" style="gap: 0.5rem; padding: 0.5rem 0.75rem; min-height: 36px; flex: 1 1 auto;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span class="hidden sm:inline">Editar</span>
              </button>
              <button class="btn-delete-driver flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded border border-red-500 font-mono text-xs transition-colors" data-id="${driver.id}" style="gap: 0.5rem; padding: 0.5rem 0.75rem; min-height: 36px; flex: 1 1 auto;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span class="hidden sm:inline">Excluir</span>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
      
      $tableBody.html(rows);
      $tableBody.show();
      
    } catch (error) {
      console.error('Erro ao carregar motoristas:', error);
      $loading.hide();
      $error.show();
      $error.text('Erro ao carregar operadores');
      
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.response?.data?.message || 'Não foi possível carregar a lista de operadores',
        confirmButtonColor: '#10b981'
      });
    }
  }
  
  async loadVehicles() {
    try {
      const response = await vehicleService.getAllVehicles();
      const vehicles = Array.isArray(response) ? response : response.data || [];
      
      this.vehicles = vehicles.map(v => {
        const vehicleData = v.data || v;
        return vehicleData;
      });
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      this.vehicles = [];
    }
  }
  
  setupEventListeners() {
    $(document).off('click', '#btnAddDriver').on('click', '#btnAddDriver', () => {
      this.showAddDriverModal();
    });
    
    $(document).off('click', '.btn-start-mission').on('click', '.btn-start-mission', (e) => {
      const driverId = $(e.currentTarget).data('id');
      this.showStartMissionModal(driverId);
    });
    
    $(document).off('click', '.btn-stop-mission').on('click', '.btn-stop-mission', async (e) => {
      const driverId = $(e.currentTarget).data('id');
      await this.stopMission(driverId);
    });
    
    $(document).off('click', '.btn-edit-driver').on('click', '.btn-edit-driver', (e) => {
      const driverId = $(e.currentTarget).data('id');
      navigateTo(`/motoristas/${driverId}/editar`);
    });
    
    $(document).off('click', '.btn-delete-driver').on('click', '.btn-delete-driver', async (e) => {
      const driverId = $(e.currentTarget).data('id');
      await this.deleteDriver(driverId);
    });
  }
  
  async showStartMissionModal(driverId) {
    // Recarregar veículos disponíveis sempre que abrir o modal (garante dados atualizados)
    await this.loadVehicles();
    
    const driver = this.drivers.find(d => d.id === driverId);
    if (!driver) return;
    
    // Processar veículos (pode vir como array ou objeto com data)
    const vehiclesList = this.vehicles.map(v => {
      const vehicleData = v.data || v;
      return vehicleData;
    });
    
    // Filtrar apenas veículos disponíveis
    const availableVehicles = vehiclesList.filter(v => {
      const status = v.status || (v.data && v.data.status);
      return status === 'available';
    });
    
      if (availableVehicles.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Nenhum veículo disponível',
        text: 'Todos os veículos estão em uso ou não há veículos cadastrados',
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
    
    const vehicleOptions = availableVehicles
      .map(v => {
        const placa = v.placa || v.codigo || 'N/A';
        const tipo = v.tipo || v.modelo || 'N/A';
        const id = v.id || v.data?.id;
        return `<option value="${id}">${placa} - ${tipo}</option>`;
      })
      .join('');
    
    const { value: vehicleId } = await Swal.fire({
      title: 'Iniciar Missão',
      html: `
        <p class="text-zinc-300 mb-4">Operador: <strong class="text-emerald-500">${driver.nome}</strong></p>
        <label class="block text-zinc-300 mb-2 text-sm">Selecione o veículo:</label>
        <select id="vehicleSelect" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:border-emerald-500">
          ${vehicleOptions}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Iniciar Missão',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      background: '#1f2937',
      color: '#ffffff',
      backdrop: 'rgba(0, 0, 0, 0.8)',
      didOpen: () => {
        removeCheckboxesFromModal();
        const select = document.getElementById('vehicleSelect');
        if (select) {
          select.focus();
        }
      },
      preConfirm: () => {
        const select = document.getElementById('vehicleSelect');
        return select ? select.value : null;
      }
    });
    
    if (vehicleId) {
      await this.startMission(driverId, parseInt(vehicleId));
    }
  }
  
  async startMission(driverId, vehicleId) {
    try {
      const result = await missionService.startMission(driverId, vehicleId);
      
      await this.loadDrivers();
      await this.loadVehicles();
      
      await Swal.fire({
        icon: 'success',
        title: 'Missão Iniciada',
        text: 'Operador em missão ativa',
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
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.response?.data?.message || 'Não foi possível iniciar a missão',
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
  
  async stopMission(driverId) {
    const result = await Swal.fire({
      title: 'Parar Missão?',
      text: 'Esta ação irá finalizar a missão atual do operador',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, parar',
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
        const activeMission = await missionService.getActiveMissionByDriver(driverId);
        
        if (!activeMission) {
          await Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Nenhuma missão ativa encontrada para este operador',
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
        
        const missionId = activeMission.id || activeMission.data?.id;
        
        if (!missionId) {
          await Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível identificar a missão ativa',
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
        
        await missionService.stopMission(missionId);
        
        await this.loadDrivers();
        await this.loadVehicles();
        
        await Swal.fire({
          icon: 'success',
          title: 'Missão Finalizada',
          text: 'Operador retornou ao status inativo',
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
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível finalizar a missão',
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
  
  async deleteDriver(driverId) {
    const result = await Swal.fire({
      title: 'Excluir Operador?',
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
      const $row = $(`tr[data-id="${driverId}"]`);
      $row.fadeOut(300, () => {
        $row.remove();
        
        const $tableBody = $('#driversTableBody');
        if ($tableBody.find('tr').length === 0) {
          $tableBody.html(`
            <tr>
              <td colspan="6" class="text-center py-8 text-zinc-400">
                Nenhum operador encontrado
              </td>
            </tr>
          `);
        }
      });
      
      try {
        driverService.deleteDriver(driverId).catch(error => {
          console.error('Erro ao excluir:', error);
          this.loadDrivers();
          
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.response?.data?.message || 'Não foi possível excluir o operador',
            confirmButtonColor: '#10b981',
            background: '#1f2937',
            color: '#ffffff',
            backdrop: 'rgba(0, 0, 0, 0.8)',
            didOpen: () => {
              removeCheckboxesFromModal();
            }
          });
        });
        
        // Mostrar feedback rápido
        Swal.fire({
          icon: 'success',
          title: 'Excluído!',
          text: 'Operador removido',
          timer: 1000,
          showConfirmButton: false,
          confirmButtonColor: '#10b981',
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
      } catch (error) {
        // Recarregar em caso de erro
        await this.loadDrivers();
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível excluir o operador',
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
      active: 'Em Missão',
      inactive: 'Inativo',
      available: 'Disponível',
      on_mission: 'Em Missão'
    };
    return labels[status] || 'Inativo';
  }
  
  async showAddDriverModal() {
    const { value: formData } = await Swal.fire({
      title: 'NOVO OPERADOR',
      html: `
        <div class="text-left space-y-4" style="max-width: 600px;">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">CÓDIGO</label>
              <input id="swal-codigo" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="OP-001" />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">NOME *</label>
              <input id="swal-nome" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="Nome completo" required />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">CPF *</label>
              <input id="swal-cpf" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="000.000.000-00" maxlength="14" required />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">CNH</label>
              <input id="swal-cnh" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="00000000000" maxlength="11" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">TELEFONE *</label>
              <input id="swal-telefone" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="(00) 00000-0000" required />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">E-MAIL *</label>
              <input id="swal-email" type="email" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="email@exemplo.com" required />
            </div>
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">SENHA (opcional)</label>
            <input id="swal-password" type="password" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">ESPECIALIDADE</label>
            <select id="swal-especialidade" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm">
              <option value="">Selecione</option>
              <option value="Transporte de Valores">Transporte de Valores</option>
              <option value="Escolta Armada">Escolta Armada</option>
              <option value="Transporte Executivo">Transporte Executivo</option>
              <option value="Logística">Logística</option>
              <option value="Suporte">Suporte</option>
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
        $('#swal-cpf').on('input', function() {
          let value = $(this).val().replace(/\D/g, '');
          if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            $(this).val(value);
          }
        });
        $('#swal-telefone').on('input', function() {
          let value = $(this).val().replace(/\D/g, '');
          if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            $(this).val(value);
          }
        });
      },
      preConfirm: () => {
        return {
          codigo: $('#swal-codigo').val(),
          nome: $('#swal-nome').val(),
          cpf: $('#swal-cpf').val().replace(/\D/g, ''),
          cnh: $('#swal-cnh').val(),
          telefone: $('#swal-telefone').val().replace(/\D/g, ''),
          email: $('#swal-email').val(),
          password: $('#swal-password').val() || null,
          especialidade: $('#swal-especialidade').val() || null,
        };
      }
    });
    
    if (formData && formData.nome && formData.cpf && formData.email) {
      try {
        await driverService.createDriver(formData);
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Operador cadastrado com sucesso',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          didOpen: () => {
            removeCheckboxesFromModal();
          }
        });
        await this.loadDrivers();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível cadastrar o operador',
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

let driverModuleInstance = null;

export async function initDriverModule() {
  if (driverModuleInstance) {
    driverModuleInstance = null;
  }
  driverModuleInstance = new DriverModule();
  await driverModuleInstance.init();
  return driverModuleInstance;
}

export default DriverModule;
