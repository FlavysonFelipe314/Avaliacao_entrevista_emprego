import $ from 'jquery';
import Swal from 'sweetalert2';
import financeService from '../services/financeService.js';
import { removeCheckboxesFromModal } from '../utils/modalUtils.js';

class FinanceModule {
  constructor() {
    this.budget = {
      total: 0,
      spent: 0,
      available: 0,
      categories: {
        fuel: { budget: 0, used: 0 },
        maintenance: { budget: 0, used: 0 },
        salaries: { budget: 0, used: 0 },
        others: { budget: 0, used: 0 }
      }
    };
    this.transactions = [];
  }
  
  async init() {
    this.setupEventListeners();
    await this.loadBudget();
    await this.loadTransactions();
  }
  
  setupEventListeners() {
    $(document).off('click', '#btnAddTransaction').on('click', '#btnAddTransaction', () => {
      this.showAddTransactionModal();
    });
    
    $(document).off('click', '#btnAddBudget').on('click', '#btnAddBudget', () => {
      this.showAddBudgetModal();
    });
    
    $(document).off('click', '.btn-edit-transaction').on('click', '.btn-edit-transaction', (e) => {
      const transactionId = $(e.currentTarget).data('id');
      this.showEditTransactionModal(transactionId);
    });
    
    $(document).off('click', '.btn-delete-transaction').on('click', '.btn-delete-transaction', async (e) => {
      const transactionId = $(e.currentTarget).data('id');
      await this.deleteTransaction(transactionId);
    });
  }
  
  async loadBudget() {
    try {
      const summary = await financeService.getSummary();
      console.log('Summary recebido:', summary);
      
      this.budget = {
        total: summary.totalBudget || 0,
        spent: summary.totalSpent || 0,
        available: summary.available || 0,
        hasActiveBudget: summary.hasActiveBudget !== false,
        categories: summary.categories || {
          fuel: { budget: 0, used: 0 },
          maintenance: { budget: 0, used: 0 },
          salaries: { budget: 0, used: 0 },
          others: { budget: 0, used: 0 }
        }
      };
      
      console.log('Budget processado:', this.budget);
      this.updateBudgetUI();
    } catch (error) {
      console.error('Erro ao carregar orçamento:', error);
      this.budget = {
        total: 0,
        spent: 0,
        available: 0,
        hasActiveBudget: false,
        categories: {
          fuel: { budget: 0, used: 0 },
          maintenance: { budget: 0, used: 0 },
          salaries: { budget: 0, used: 0 },
          others: { budget: 0, used: 0 }
        }
      };
    this.updateBudgetUI();
    }
  }
  
  updateBudgetUI() {
    const total = this.budget.total || 0;
    const spent = this.budget.spent || 0;
    const available = this.budget.available || 0;
    const hasActiveBudget = this.budget.hasActiveBudget !== false;
    
    $('#total-budget').text(this.formatCurrency(total));
    $('#current-spent').text(this.formatCurrency(spent));
    
    const $availableBudget = $('#available-budget');
    $availableBudget.text(this.formatCurrency(available));
    if (available < 0) {
      $availableBudget.removeClass('text-emerald-500').addClass('text-red-500');
    } else {
      $availableBudget.removeClass('text-red-500').addClass('text-emerald-500');
    }
    
    if (!hasActiveBudget) {
      $('#budget-label').text('Saldo Total');
      $('#available-label').text('Saldo Disponível');
      $('#budget-warning').show();
    } else {
      $('#budget-label').text('Orçamento Total');
      $('#available-label').text('Disponível');
      $('#budget-warning').hide();
    }
    
    const categories = this.budget.categories || {
      fuel: { budget: 0, used: 0 },
      maintenance: { budget: 0, used: 0 },
      salaries: { budget: 0, used: 0 },
      others: { budget: 0, used: 0 }
    };
    
    this.updateCategoryProgress('fuel', categories.fuel || { budget: 0, used: 0 });
    this.updateCategoryProgress('maintenance', categories.maintenance || { budget: 0, used: 0 });
    this.updateCategoryProgress('salaries', categories.salaries || { budget: 0, used: 0 });
    this.updateCategoryProgress('others', categories.others || { budget: 0, used: 0 });
  }
  
  updateCategoryProgress(category, data) {
    const budget = data.budget || 0;
    const used = data.used || 0;
    const percent = budget > 0 ? Math.round((used / budget) * 100) : 0;
    
    $(`#${category}-percent`).text(`${percent}%`);
    $(`#${category}-progress`).css('width', `${Math.min(percent, 100)}%`);
    $(`#${category}-used`).text(this.formatCurrency(used));
    $(`#${category}-budget`).text(this.formatCurrency(budget));
    
    const $progress = $(`#${category}-progress`);
    $progress.removeClass('bg-emerald-500 bg-yellow-500 bg-blue-500 bg-zinc-500 bg-red-500');
    
    if (budget > 0) {
    if (percent >= 100) {
        $progress.addClass('bg-red-500');
    } else if (percent >= 80) {
        $progress.addClass('bg-yellow-500');
      } else {
        if (category === 'fuel') {
          $progress.addClass('bg-emerald-500');
        } else if (category === 'maintenance') {
          $progress.addClass('bg-yellow-500');
        } else if (category === 'salaries') {
          $progress.addClass('bg-blue-500');
        } else {
          $progress.addClass('bg-zinc-500');
        }
      }
    } else {
      $progress.addClass('bg-zinc-500');
      $progress.css('width', '0%');
    }
  }
  
  async loadTransactions() {
    try {
      const transactions = await financeService.getTransactions();
      this.transactions = Array.isArray(transactions) ? transactions : transactions.data || [];
    
    const $container = $('#transactions-list');
    
      if (!this.transactions || this.transactions.length === 0) {
      $container.html(`
        <div class="px-6 py-4 text-zinc-500 font-mono text-sm text-center">
          Nenhuma transação encontrada
        </div>
      `);
      return;
    }
    
      const items = this.transactions.map(transaction => {
        const transactionData = transaction.data || transaction;
        const amount = parseFloat(transactionData.amount || 0);
        const isIncome = transactionData.type === 'income';
        const date = transactionData.transactionDate || transactionData.createdAt;
        
        return `
      <div class="px-8 py-6 hover:bg-zinc-800/50 transition-colors">
        <div class="flex justify-between items-center">
              <div class="flex-1">
                <div class="text-zinc-200 font-mono text-sm mb-1">${transactionData.description || 'Transação'}</div>
                <div class="text-zinc-500 font-mono text-xs">${this.formatDate(date)}</div>
                ${transactionData.category ? `<div class="text-zinc-500 font-mono text-xs mt-1">${this.getCategoryLabel(transactionData.category)}</div>` : ''}
              </div>
              <div class="text-right mr-4">
                <div class="font-mono font-bold text-lg ${isIncome ? 'text-emerald-500' : 'text-red-500'} mb-1">
                  ${isIncome ? '+' : '-'}${this.formatCurrency(Math.abs(amount))}
                </div>
              </div>
              <div class="flex" style="gap: 0.5rem;">
                <button class="btn-edit-transaction flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded border border-zinc-600 font-mono text-xs transition-colors" data-id="${transactionData.id}" style="padding: 0.5rem 0.75rem;">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button class="btn-delete-transaction flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded border border-red-500 font-mono text-xs transition-colors" data-id="${transactionData.id}" style="padding: 0.5rem 0.75rem;">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      $container.html(items);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      const $container = $('#transactions-list');
      $container.html(`
        <div class="px-6 py-4 text-red-400 font-mono text-sm text-center">
          Erro ao carregar transações
        </div>
      `);
    }
  }
  
  async showAddTransactionModal() {
    const { value: formData } = await Swal.fire({
      title: 'NOVA TRANSAÇÃO',
      html: `
        <div class="text-left space-y-4" style="max-width: 600px;">
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">DESCRIÇÃO *</label>
            <input id="swal-description" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="Descrição da transação" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">VALOR *</label>
              <input id="swal-amount" type="number" step="0.01" min="0.01" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="0.00" required />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">TIPO *</label>
              <select id="swal-type" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" required>
                <option value="">Selecione</option>
                <option value="income">RECEITA</option>
                <option value="expense">DESPESA</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">CATEGORIA *</label>
            <select id="swal-category" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" required>
              <option value="">Selecione</option>
              <option value="fuel">COMBUSTÍVEL</option>
              <option value="maintenance">MANUTENÇÃO</option>
              <option value="salaries">SALÁRIOS</option>
              <option value="others">OUTROS</option>
            </select>
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">DATA *</label>
            <input id="swal-transaction-date" type="datetime-local" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" required />
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
      allowOutsideClick: false,
      allowEscapeKey: true,
      didOpen: () => {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        $('#swal-transaction-date').val(localDateTime);
        
        removeCheckboxesFromModal();
      },
      preConfirm: () => {
        return {
          description: $('#swal-description').val(),
          amount: parseFloat($('#swal-amount').val()),
          type: $('#swal-type').val(),
          category: $('#swal-category').val(),
          transaction_date: $('#swal-transaction-date').val(),
        };
      }
    });
    
    if (formData && formData.description && formData.amount && formData.type && formData.category) {
      try {
        await financeService.createTransaction(formData);
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Transação cadastrada com sucesso',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)'
        });
        await this.loadBudget();
        await this.loadTransactions();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível cadastrar a transação',
          confirmButtonColor: '#10b981',
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)'
        });
      }
    }
  }
  
  async showEditTransactionModal(transactionId) {
    const transaction = this.transactions.find(t => {
      const data = t.data || t;
      return data.id === transactionId;
    });
    
    if (!transaction) return;
    
    const transactionData = transaction.data || transaction;
    let localDateTime = '';
    if (transactionData.transactionDate) {
      const date = new Date(transactionData.transactionDate);
      if (!isNaN(date.getTime())) {
        localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      }
    }
    if (!localDateTime) {
      const now = new Date();
      localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    
    const { value: formData } = await Swal.fire({
      title: 'EDITAR TRANSAÇÃO',
      html: `
        <div class="text-left space-y-4" style="max-width: 600px;">
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">DESCRIÇÃO *</label>
            <input id="swal-description" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" value="${transactionData.description || ''}" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">VALOR *</label>
              <input id="swal-amount" type="number" step="0.01" min="0.01" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" value="${transactionData.amount || ''}" required />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">TIPO *</label>
              <select id="swal-type" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" required>
                <option value="">Selecione</option>
                <option value="income" ${transactionData.type === 'income' ? 'selected' : ''}>RECEITA</option>
                <option value="expense" ${transactionData.type === 'expense' ? 'selected' : ''}>DESPESA</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">CATEGORIA *</label>
            <select id="swal-category" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" required>
              <option value="">Selecione</option>
              <option value="fuel" ${transactionData.category === 'fuel' ? 'selected' : ''}>COMBUSTÍVEL</option>
              <option value="maintenance" ${transactionData.category === 'maintenance' ? 'selected' : ''}>MANUTENÇÃO</option>
              <option value="salaries" ${transactionData.category === 'salaries' ? 'selected' : ''}>SALÁRIOS</option>
              <option value="others" ${transactionData.category === 'others' ? 'selected' : ''}>OUTROS</option>
            </select>
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">DATA *</label>
            <input id="swal-transaction-date" type="datetime-local" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" value="${localDateTime}" required />
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
      allowOutsideClick: false,
      allowEscapeKey: true,
      didOpen: () => {
        let localDateTime = '';
        if (transactionData.transactionDate) {
          const date = new Date(transactionData.transactionDate);
          if (!isNaN(date.getTime())) {
            localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          }
        }
        if (!localDateTime) {
          const now = new Date();
          localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        }
        $('#swal-transaction-date').val(localDateTime);
        
        setTimeout(() => {
          const modal = document.querySelector('.swal2-popup');
          if (modal) {
            const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
              const parent = cb.parentElement;
              if (parent && parent.tagName !== 'LABEL') {
                parent.remove();
              } else if (parent && parent.tagName === 'LABEL') {
                parent.remove();
              } else {
                cb.remove();
              }
            });
          }
        }, 100);
      },
      preConfirm: () => {
        return {
          description: $('#swal-description').val(),
          amount: parseFloat($('#swal-amount').val()),
          type: $('#swal-type').val(),
          category: $('#swal-category').val(),
          transaction_date: $('#swal-transaction-date').val(),
        };
      }
    });
    
    if (formData && formData.description && formData.amount && formData.type && formData.category) {
      try {
        await financeService.updateTransaction(transactionId, formData);
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Transação atualizada com sucesso',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)'
        });
        await this.loadBudget();
        await this.loadTransactions();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível atualizar a transação',
          confirmButtonColor: '#10b981',
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)'
        });
      }
    }
  }
  
  async deleteTransaction(transactionId) {
    const result = await Swal.fire({
      title: 'Excluir Transação?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: '#1f2937',
      color: '#ffffff',
      backdrop: 'rgba(0, 0, 0, 0.8)'
    });
    
    if (result.isConfirmed) {
      try {
        await financeService.deleteTransaction(transactionId);
        await Swal.fire({
          icon: 'success',
          title: 'Excluído!',
          text: 'Transação removida',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)'
        });
        await this.loadBudget();
        await this.loadTransactions();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível excluir a transação',
          confirmButtonColor: '#10b981',
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)'
        });
      }
    }
  }
  
  async showAddBudgetModal() {
    const { value: formData } = await Swal.fire({
      title: 'NOVO ORÇAMENTO',
      html: `
        <div class="text-left space-y-4" style="max-width: 600px;">
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">NOME *</label>
            <input id="swal-name" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="Ex: Orçamento 2026" required />
          </div>
          <div>
            <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">ORÇAMENTO TOTAL *</label>
            <input id="swal-total-budget" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="0.00" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">COMBUSTÍVEL</label>
              <input id="swal-fuel-budget" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="0.00" />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">MANUTENÇÃO</label>
              <input id="swal-maintenance-budget" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="0.00" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">SALÁRIOS</label>
              <input id="swal-salaries-budget" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="0.00" />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">OUTROS</label>
              <input id="swal-others-budget" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" placeholder="0.00" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">DATA INÍCIO *</label>
              <input id="swal-start-date" type="date" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" required />
            </div>
            <div>
              <label class="block text-emerald-500 font-mono text-xs uppercase mb-1">DATA FIM *</label>
              <input id="swal-end-date" type="date" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white font-mono text-sm" required />
          </div>
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
      allowOutsideClick: false,
      allowEscapeKey: true,
      didOpen: () => {
        setTimeout(() => {
          const modal = document.querySelector('.swal2-popup');
          if (modal) {
            const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
              const parent = cb.parentElement;
              if (parent && parent.tagName !== 'LABEL') {
                parent.remove();
              } else if (parent && parent.tagName === 'LABEL') {
                parent.remove();
              } else {
                cb.remove();
              }
            });
          }
        }, 100);
      },
      preConfirm: () => {
        return {
          name: $('#swal-name').val(),
          total_budget: parseFloat($('#swal-total-budget').val()) || 0,
          fuel_budget: parseFloat($('#swal-fuel-budget').val()) || 0,
          maintenance_budget: parseFloat($('#swal-maintenance-budget').val()) || 0,
          salaries_budget: parseFloat($('#swal-salaries-budget').val()) || 0,
          others_budget: parseFloat($('#swal-others-budget').val()) || 0,
          start_date: $('#swal-start-date').val(),
          end_date: $('#swal-end-date').val(),
          is_active: true,
        };
      }
    });
    
    if (formData && formData.name && formData.total_budget && formData.start_date && formData.end_date) {
      try {
        await financeService.createBudget(formData);
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Orçamento cadastrado com sucesso',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)'
        });
        await this.loadBudget();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível cadastrar o orçamento',
          confirmButtonColor: '#10b981',
          background: '#1f2937',
          color: '#ffffff',
          backdrop: 'rgba(0, 0, 0, 0.8)'
        });
      }
    }
  }
  
  getCategoryLabel(category) {
    const labels = {
      fuel: 'Combustível',
      maintenance: 'Manutenção',
      salaries: 'Salários',
      others: 'Outros'
    };
    return labels[category] || category;
  }
  
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }
  
  formatDate(dateString) {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  destroy() {
    $(document).off('click', '#btnAddTransaction');
    $(document).off('click', '#btnAddBudget');
    $(document).off('click', '.btn-edit-transaction');
    $(document).off('click', '.btn-delete-transaction');
  }
}

let financeModuleInstance = null;

export async function initFinanceModule() {
  if (financeModuleInstance) {
    financeModuleInstance.destroy();
  }
  financeModuleInstance = new FinanceModule();
  await financeModuleInstance.init();
  return financeModuleInstance;
}

export default FinanceModule;

