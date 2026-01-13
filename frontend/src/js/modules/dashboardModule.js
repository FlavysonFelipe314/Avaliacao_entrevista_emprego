import $ from 'jquery';
import dashboardService from '../services/dashboardService.js';

class DashboardModule {
  constructor() {
    this.stats = {};
    this.refreshInterval = null;
  }
  
  async init() {
    await this.loadStats();
    this.startAutoRefresh();
  }
  
  async loadStats() {
    try {
      const stats = await dashboardService.getStats();
      this.stats = stats;
      
      $('#stat-total-operators').text(stats.totalOperators || 0);
      $('#stat-total-vehicles').text(stats.totalVehicles || 0);
      $('#stat-active-vehicles').text(stats.activeVehicles || 0);
      
      const balance = stats.balance || 0;
      const $balance = $('#stat-balance');
      $balance.text(this.formatCurrency(balance));
      $balance.css('color', balance >= 0 ? '#10b981' : '#ef4444');
      
      this.renderRecentDrivers(stats.recentDrivers || []);
      this.renderAvailableVehicles(stats.availableVehiclesList || []);
      this.renderActiveVehicles(stats.activeVehiclesList || []);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }
  
  renderRecentDrivers(drivers) {
    const $container = $('#recent-drivers-list');
    
    if (drivers.length === 0) {
      $container.html('<div class="text-center py-8 text-zinc-400 font-mono text-sm">Nenhum motorista cadastrado</div>');
      return;
    }
    
    const html = drivers.map(driver => `
      <div class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors" style="padding: 1rem 1.5rem;">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white font-mono text-sm font-bold">${driver.nome || '-'}</p>
            <p class="text-zinc-400 font-mono text-xs">${driver.codigo || driver.id}</p>
          </div>
          <span class="status-badge status-${driver.status || 'inactive'} text-xs">
            ${this.getStatusLabel(driver.status)}
          </span>
        </div>
      </div>
    `).join('');
    
    $container.html(html);
  }
  
  renderAvailableVehicles(vehicles) {
    const $container = $('#available-vehicles-list');
    
    if (vehicles.length === 0) {
      $container.html('<div class="text-center py-8 text-zinc-400 font-mono text-sm">Nenhum veículo disponível</div>');
      return;
    }
    
    const html = vehicles.map(vehicle => `
      <div class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors" style="padding: 1rem 1.5rem;">
        <div>
          <p class="text-emerald-500 font-mono text-sm font-bold">${vehicle.placa || vehicle.codigo || '-'}</p>
          <p class="text-zinc-400 font-mono text-xs">${vehicle.modelo || vehicle.tipo || 'N/A'}</p>
        </div>
      </div>
    `).join('');
    
    $container.html(html);
  }
  
  renderActiveVehicles(vehicles) {
    const $container = $('#active-vehicles-list');
    
    if (vehicles.length === 0) {
      $container.html('<div class="text-center py-8 text-zinc-400 font-mono text-sm">Nenhum veículo em viagem</div>');
      return;
    }
    
    const html = vehicles.map(vehicle => `
      <div class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors" style="padding: 1rem 1.5rem;">
        <div>
          <p class="text-yellow-500 font-mono text-sm font-bold">${vehicle.placa || vehicle.codigo || '-'}</p>
          <p class="text-zinc-400 font-mono text-xs">${vehicle.modelo || vehicle.tipo || 'N/A'}</p>
          ${vehicle.operador_atual ? `<p class="text-zinc-500 font-mono text-xs mt-1">Operador: ${vehicle.operador_atual}</p>` : ''}
        </div>
      </div>
    `).join('');
    
    $container.html(html);
  }
  
  getStatusLabel(status) {
    const labels = {
      active: 'Em Missão',
      inactive: 'Inativo',
      available: 'Disponível'
    };
    return labels[status] || 'Inativo';
  }
  
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }
  
  startAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    this.refreshInterval = setInterval(() => {
      this.loadStats();
    }, 30000);
  }
  
  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}

let dashboardModuleInstance = null;

export async function initDashboardModule() {
  if (dashboardModuleInstance) {
    dashboardModuleInstance.destroy();
  }
  dashboardModuleInstance = new DashboardModule();
  await dashboardModuleInstance.init();
  return dashboardModuleInstance;
}

export default DashboardModule;
