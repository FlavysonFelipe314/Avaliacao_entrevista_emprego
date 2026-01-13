import $ from 'jquery';
import apiClient from '../api/apiClient.js';
import Swal from 'sweetalert2';
import { navigateTo } from '../router.js';

/**
 * Service para gerenciar motoristas
 * Contém toda a lógica de negócio e comunicação com a API
 */
class DriverService {
  /**
   * Busca todos os motoristas
   * @returns {Promise<Array>}
   */
  async getAllDrivers() {
    try {
      const response = await apiClient.get('/motoristas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      throw error;
    }
  }
  
  /**
   * Busca um motorista por ID
   * @param {number} id - ID do motorista
   * @returns {Promise<Object>}
   */
  async getDriverById(id) {
    try {
      const response = await apiClient.get(`/motoristas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar motorista:', error);
      throw error;
    }
  }
  
  /**
   * Cria um novo motorista
   * @param {Object} driverData - Dados do motorista
   * @returns {Promise<Object>}
   */
  async createDriver(driverData) {
    try {
      const response = await apiClient.post('/motoristas', driverData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar motorista:', error);
      throw error;
    }
  }
  
  /**
   * Atualiza um motorista
   * @param {number} id - ID do motorista
   * @param {Object} driverData - Dados atualizados
   * @returns {Promise<Object>}
   */
  async updateDriver(id, driverData) {
    try {
      const response = await apiClient.put(`/motoristas/${id}`, driverData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar motorista:', error);
      throw error;
    }
  }
  
  /**
   * Deleta um motorista
   * @param {number} id - ID do motorista
   * @returns {Promise<void>}
   */
  async deleteDriver(id) {
    try {
      await apiClient.delete(`/motoristas/${id}`);
    } catch (error) {
      console.error('Erro ao deletar motorista:', error);
      throw error;
    }
  }
}

// Instância singleton do service
const driverService = new DriverService();

/**
 * Inicializa a lista de motoristas
 * Carrega dados e renderiza na tabela
 */
export async function initDriverList() {
  const $tableBody = $('#driversTableBody');
  const $loading = $('#driversLoading');
  const $error = $('#driversError');
  
  // Mostrar loading
  $loading.show();
  $tableBody.hide();
  $error.hide();
  
  try {
    const drivers = await driverService.getAllDrivers();
    
    // Esconder loading
    $loading.hide();
    
    if (drivers.length === 0) {
      $tableBody.html(`
        <tr>
          <td colspan="5" class="text-center">Nenhum motorista encontrado</td>
        </tr>
      `);
      $tableBody.show();
      return;
    }
    
    // Renderizar tabela
    const rows = drivers.map(driver => `
      <tr data-id="${driver.id}">
        <td>${driver.nome || '-'}</td>
        <td>${driver.cpf || '-'}</td>
        <td>${driver.telefone || '-'}</td>
        <td>${driver.email || '-'}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-driver" data-id="${driver.id}">
            Editar
          </button>
          <button class="btn btn-sm btn-danger delete-driver" data-id="${driver.id}">
            Excluir
          </button>
        </td>
      </tr>
    `).join('');
    
    $tableBody.html(rows);
    $tableBody.show();
    
    // Configurar event listeners usando event delegation
    setupDriverListEvents();
    
  } catch (error) {
    $loading.hide();
    $error.show();
    $error.text('Erro ao carregar motoristas. Tente novamente.');
    
    await Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Não foi possível carregar a lista de motoristas'
    });
  }
}

/**
 * Configura event listeners para a lista de motoristas
 * Usa event delegation para elementos dinamicamente carregados
 */
function setupDriverListEvents() {
  // Event delegation para botão de editar
  $(document).off('click', '.edit-driver').on('click', '.edit-driver', function(e) {
    e.preventDefault();
    const driverId = $(this).data('id');
    navigateTo(`/motoristas/${driverId}/editar`);
  });
  
  // Event delegation para botão de excluir
  $(document).off('click', '.delete-driver').on('click', '.delete-driver', async function(e) {
    e.preventDefault();
    const driverId = $(this).data('id');
    
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
      try {
        await driverService.deleteDriver(driverId);
        
        await Swal.fire({
          icon: 'success',
          title: 'Excluído!',
          text: 'Motorista excluído com sucesso',
          timer: 1500
        });
        
        // Recarregar lista
        await initDriverList();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível excluir o motorista'
        });
      }
    }
  });
}

/**
 * Inicializa o formulário de motorista (novo ou edição)
 * @param {number|null} driverId - ID do motorista para edição (opcional)
 */
export async function initDriverForm(driverId = null) {
  const $form = $('#driverForm');
  
  if ($form.length === 0) return;
  
  // Se for edição, carregar dados do motorista
  if (driverId) {
    try {
      const driver = await driverService.getDriverById(driverId);
      
      // Preencher formulário
      $('#codigo').val(driver.codigo || '');
      $('#nome').val(driver.nome || '');
      $('#cpf').val(driver.cpf || '');
      $('#telefone').val(driver.telefone || '');
      $('#email').val(driver.email || '');
      $('#cnh').val(driver.cnh || '');
      $('#especialidade').val(driver.especialidade || '');
      
      // Atualizar título
      $('#formTitle').text('EDITAR OPERADOR');
      
      // Armazenar ID no form
      $form.data('driver-id', driverId);
      
      // Atualizar título da página
      const $pageHeader = $('.page-header h1');
      if ($pageHeader.length) {
        $pageHeader.text('Editar Motorista');
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível carregar os dados do motorista'
      });
      navigateTo('/motoristas');
      return;
    }
  }
  
  // Máscaras de input
  $('#cpf').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      $(this).val(value);
    }
  });
  
  $('#telefone').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      $(this).val(value);
    }
  });
  
  $('#cnh').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length <= 11) {
      $(this).val(value);
    }
  });
  
  // Event listener para submit do formulário
  $form.off('submit').on('submit', async function(e) {
    e.preventDefault();
    
    // Remover máscaras antes de enviar
    const cpfValue = $('#cpf').val().replace(/\D/g, '');
    const telefoneValue = $('#telefone').val().replace(/\D/g, '');
    
    const formData = {
      codigo: $('#codigo').val() || `OP-${Date.now()}`,
      nome: $('#nome').val(),
      cpf: cpfValue.length === 11 ? `${cpfValue.substring(0, 3)}.${cpfValue.substring(3, 6)}.${cpfValue.substring(6, 9)}-${cpfValue.substring(9, 11)}` : cpfValue,
      telefone: telefoneValue,
      email: $('#email').val() || null,
      password: $('#password').val() || null,
      cnh: $('#cnh').val() || null,
      especialidade: $('#especialidade').val() || null
    };
    
    const $submitBtn = $form.find('button[type="submit"]');
    const originalText = $submitBtn.text();
    
    try {
      // Desabilitar botão e mostrar loading
      $submitBtn.prop('disabled', true).text('Salvando...');
      
      // Verificar se é edição ou criação
      const id = $form.data('driver-id') || driverId;
      
      if (id) {
        await driverService.updateDriver(id, formData);
      } else {
        await driverService.createDriver(formData);
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: id ? 'Motorista atualizado com sucesso' : 'Motorista criado com sucesso',
        timer: 1500
      });
      
      // Redirecionar para lista
      navigateTo('/motoristas');
      
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível salvar o motorista'
      });
    } finally {
      // Reabilitar botão
      $submitBtn.prop('disabled', false).text(originalText);
    }
  });
}

export default driverService;

