import $ from 'jquery';

class UIModule {
  constructor() {
    this.clockInterval = null;
    this.sidebarOpen = false;
  }
  
  init() {
    this.initClock();
    this.initOptimalStatus();
    this.initSidebar();
  }
  
  initClock() {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('pt-BR', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const date = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      $('#tactical-clock-time').text(time);
      $('#tactical-clock-date').text(date);
    };
    
    updateClock();
    this.clockInterval = setInterval(updateClock, 1000);
  }
  
  initOptimalStatus() {
    setInterval(() => {
      $('#optimal-status').fadeOut(200).fadeIn(200);
    }, 2000);
  }
  
  initSidebar() {
    $('.overlay-sidebar').each(function() {
      const $overlay = $(this);
      if ($overlay.hasClass('hidden') || !$overlay.is(':visible')) {
        $overlay.css({
          'display': 'none',
          'visibility': 'hidden',
          'opacity': '0',
          'pointer-events': 'none',
          'z-index': '-1'
        });
      }
    });
    
    $(document).off('click', '#sidebar-toggle').on('click', '#sidebar-toggle', (e) => {
      e.stopPropagation();
      this.toggleSidebar();
    });
    
    $(document).off('click', '#sidebar-close').on('click', '#sidebar-close', (e) => {
      e.stopPropagation();
      if (this.sidebarOpen) {
        this.toggleSidebar();
      }
    });
    
    $(document).off('click', '.overlay-sidebar').on('click', '.overlay-sidebar', (e) => {
      e.stopPropagation();
      if (this.sidebarOpen) {
        this.toggleSidebar();
      }
    });
    
    $(document).off('touchstart', '.overlay-sidebar:not(.hidden)').on('touchstart', '.overlay-sidebar:not(.hidden)', (e) => {
      e.stopPropagation();
    });
  }
  
  toggleSidebar() {
    const $sidebar = $('#tactical-sidebar');
    const $overlay = $('.overlay-sidebar');
    const $mainContent = $('.main-content');
    const $closeBtn = $('#sidebar-close');
    
    this.sidebarOpen = !this.sidebarOpen;
    
    if (this.sidebarOpen) {
      $sidebar.addClass('translate-x-0').removeClass('-translate-x-full');
      $sidebar.css('z-index', '10000');
      $overlay.removeClass('hidden').css({
        'z-index': '9999',
        'display': 'block',
        'pointer-events': 'auto'
      }).fadeIn(300);
      $closeBtn.removeClass('hidden').css('display', 'flex');
      
      if ($(window).width() > 768) {
        $mainContent.addClass('ml-64');
      }
      
      this.forceLeafletLowZIndex();
    } else {
      $sidebar.addClass('-translate-x-full').removeClass('translate-x-0');
      $closeBtn.addClass('hidden').css('display', 'none');
      $overlay.fadeOut(300, function() {
        const $this = $(this);
        $this.addClass('hidden').css({
          'display': 'none',
          'visibility': 'hidden',
          'opacity': '0',
          'pointer-events': 'none',
          'z-index': '-1'
        });
      });
      $mainContent.removeClass('ml-64');
    }
  }
  
  forceLeafletLowZIndex() {
    setTimeout(() => {
      const allLeafletElements = document.querySelectorAll('[class*="leaflet"]');
      allLeafletElements.forEach(el => {
        const className = el.className || '';
        
        if (className.includes('leaflet-container') || 
            className.includes('leaflet-pane') ||
            className.includes('leaflet-map-pane') ||
            className.includes('leaflet-tile-pane') ||
            className.includes('leaflet-overlay-pane')) {
          el.style.zIndex = '1';
        } else if (className.includes('leaflet-control') ||
                   className.includes('leaflet-top') ||
                   className.includes('leaflet-bottom')) {
          el.style.zIndex = '2';
        } else if (className.includes('leaflet-popup')) {
          el.style.zIndex = '3';
        } else {
          el.style.zIndex = '1';
        }
      });
    }, 50);
  }
  
  updateSystemStatus(status, message) {
    const $statusEl = $('#system-status');
    const statusClasses = {
      optimal: 'bg-emerald-500 text-zinc-950',
      warning: 'bg-yellow-500 text-zinc-950',
      critical: 'bg-red-500 text-white'
    };
    
    $statusEl.removeClass('bg-emerald-500 bg-yellow-500 bg-red-500 text-zinc-950 text-white');
    $statusEl.addClass(statusClasses[status] || statusClasses.optimal);
    $statusEl.text(message || 'Optimal');
  }
  
  addOperationLog(message, type = 'info') {
    const $logContainer = $('#operations-log');
    if (!$logContainer.length) return;
    
    const typeColors = {
      info: 'text-zinc-400',
      success: 'text-emerald-500',
      warning: 'text-yellow-500',
      error: 'text-red-500'
    };
    
    const now = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    const logEntry = `
      <div class="operation-log-entry ${typeColors[type] || typeColors.info} border-b border-zinc-800 py-2 px-3 font-mono text-sm">
        <span class="text-zinc-500">[${now}]</span> ${message}
      </div>
    `;
    
    $logContainer.prepend(logEntry);
    
    const $entries = $logContainer.find('.operation-log-entry');
    if ($entries.length > 50) {
      $entries.slice(50).remove();
    }
  }
  
  destroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
    $(document).off('click', '#sidebar-toggle');
    $(document).off('click', '.overlay-sidebar');
  }
}

let uiModuleInstance = null;

export function initUI() {
  if (uiModuleInstance) {
    uiModuleInstance.destroy();
  }
  uiModuleInstance = new UIModule();
  uiModuleInstance.init();
  return uiModuleInstance;
}

export default UIModule;

