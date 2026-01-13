import $ from 'jquery';
import Swal from 'sweetalert2';
import apiClient from '../api/apiClient.js';
import { navigateTo } from '../router.js';

/**
 * Service para gerenciar veículos
 */
class VehicleService {
  /**
   * Busca todos os veículos
   */
  async getAllVehicles() {
    try {
      const response = await apiClient.get('/vehicles');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  }

  /**
   * Busca veículos disponíveis
   */
  async getAvailableVehicles() {
    try {
      const response = await apiClient.get('/vehicles/available');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos disponíveis:', error);
      throw error;
    }
  }

  /**
   * Busca veículo por ID
   */
  async getVehicleById(id) {
    try {
      const response = await apiClient.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      throw error;
    }
  }

  /**
   * Cria novo veículo
   */
  async createVehicle(data) {
    try {
      const response = await apiClient.post('/vehicles', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  }

  /**
   * Atualiza veículo
   */
  async updateVehicle(id, data) {
    try {
      const response = await apiClient.put(`/vehicles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  }

  /**
   * Deleta veículo
   */
  async deleteVehicle(id) {
    try {
      const response = await apiClient.delete(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      throw error;
    }
  }
}

const vehicleService = new VehicleService();

/**
 * Inicializa formulário de veículo
 */
export async function initVehicleForm(vehicleId = null) {
  const $form = $('#vehicleForm');
  
  if (!$form.length) {
    console.error('Formulário de veículo não encontrado');
    return;
  }
  
  // Se for edição, carregar dados
  if (vehicleId) {
    try {
      const vehicle = await vehicleService.getVehicleById(vehicleId);
      const data = vehicle.data || vehicle;
      
      // Preencher formulário
      $('#codigo').val(data.codigo || '');
      $('#placa').val(data.placa || '');
      $('#modelo').val(data.modelo || '');
      $('#tipo').val(data.tipo || '');
      $('#status').val(data.status || 'available');
      
      // Atualizar título
      $('#formTitle').text('EDITAR VEÍCULO');
      
      // Armazenar ID para edição
      $form.data('vehicle-id', vehicleId);
    } catch (error) {
      console.error('Erro ao carregar veículo:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível carregar os dados do veículo',
        confirmButtonColor: '#10b981'
      });
      
      navigateTo('/veiculos');
      return;
    }
  }
  
  // Máscara de placa (formato brasileiro: ABC-1234 ou ABC1D23)
  $('#placa').on('input', function() {
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
  
  // Event listener para submit do formulário
  $form.off('submit').on('submit', async function(e) {
    e.preventDefault();
    
    // Remover máscara da placa antes de enviar
    const placaValue = $('#placa').val().replace(/-/g, '').toUpperCase();
    
    const formData = {
      codigo: $('#codigo').val(),
      placa: placaValue,
      modelo: $('#modelo').val() || null,
      tipo: $('#tipo').val() || null,
      status: $('#status').val() || 'available' // Sempre garantir status available por padrão
    };
    
    const $submitBtn = $form.find('button[type="submit"]');
    const originalText = $submitBtn.text();
    
    try {
      // Desabilitar botão e mostrar loading
      $submitBtn.prop('disabled', true).text('Salvando...');
      
      // Verificar se é edição ou criação
      const id = $form.data('vehicle-id') || vehicleId;
      
      if (id) {
        await vehicleService.updateVehicle(id, formData);
      } else {
        await vehicleService.createVehicle(formData);
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: id ? 'Veículo atualizado com sucesso' : 'Veículo criado com sucesso',
        timer: 1500
      });
      
      // Redirecionar para lista
      navigateTo('/veiculos');
      
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.response?.data?.message || 'Não foi possível salvar o veículo',
        confirmButtonColor: '#10b981'
      });
    } finally {
      // Reabilitar botão
      $submitBtn.prop('disabled', false).text(originalText);
    }
  });
}

export default vehicleService;

