import $ from 'jquery';
import L from 'leaflet';
import vehicleService from '../services/vehicleService.js';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Módulo de Rastreamento Tático
 * Implementa mapa Leaflet com tema escuro
 */
class TrackingModule {
  constructor() {
    this.map = null;
    this.markers = [];
    this.observer = null;
  }
  
  /**
   * Inicializa o módulo
   */
  async init() {
    await this.initMap();
    await this.loadVehiclesOnMap();
    this.setupEventListeners();
  }
  
  /**
   * Inicializa o mapa Leaflet com tema escuro
   */
  async initMap() {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const mapContainer = document.getElementById('tactical-map');
    if (!mapContainer) {
      console.error('Container do mapa não encontrado');
      return;
    }
    
    this.map = L.map('tactical-map', {
      center: [-23.5505, -46.6333],
      zoom: 11,
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true,
      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false
    });
    
    const mapElement = this.map.getContainer();
    if (mapElement) {
      mapElement.style.zIndex = '1';
      mapElement.style.position = 'relative';
    }
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 16,
      minZoom: 3,
      tileSize: 256,
      zoomOffset: 0,
      updateWhenZooming: false,
      keepBuffer: 2
    }).addTo(this.map);
    
    this.styleMapControls();
    
    setTimeout(() => {
      this.forceLowZIndex();
    }, 200);
    
    this.setupZIndexObserver();
  }
  
  /**
   * Estiliza os controles do mapa
   */
  styleMapControls() {
    const zoomControls = document.querySelector('.leaflet-control-zoom');
    if (zoomControls) {
      zoomControls.style.border = '1px solid #3f3f46';
      zoomControls.style.backgroundColor = '#18181b';
      zoomControls.style.borderRadius = '4px';
      zoomControls.style.zIndex = '2';
      
      const buttons = zoomControls.querySelectorAll('a');
      buttons.forEach(btn => {
        btn.style.backgroundColor = '#27272a';
        btn.style.color = '#10b981';
        btn.style.borderColor = '#3f3f46';
      });
    }
  }
  
  /**
   * Força z-index baixo em todos os elementos do Leaflet
   */
  forceLowZIndex() {
    if (!this.map) return;
    
    const mapContainer = this.map.getContainer();
    if (mapContainer) {
      mapContainer.style.zIndex = '1';
      mapContainer.style.position = 'relative';
    }
    
    const allLeafletElements = document.querySelectorAll('[class*="leaflet"]');
    allLeafletElements.forEach(el => {
      const className = el.className || '';
      
      if (className.includes('leaflet-container') || 
          className.includes('leaflet-pane') ||
          className.includes('leaflet-map-pane') ||
          className.includes('leaflet-tile-pane') ||
          className.includes('leaflet-overlay-pane') ||
          className.includes('leaflet-shadow-pane') ||
          className.includes('leaflet-marker-pane')) {
        el.style.zIndex = '1';
        el.style.position = 'relative';
      }
      else if (className.includes('leaflet-control') ||
               className.includes('leaflet-top') ||
               className.includes('leaflet-bottom')) {
        el.style.zIndex = '2';
      }
      else if (className.includes('leaflet-popup')) {
        el.style.zIndex = '3';
      }
      else {
        el.style.zIndex = '1';
      }
    });
    
    const controls = document.querySelectorAll('.leaflet-control');
    controls.forEach(control => {
      control.style.zIndex = '2';
    });
    
    const popups = document.querySelectorAll('.leaflet-popup');
    popups.forEach(popup => {
      popup.style.zIndex = '3';
    });
  }
  
  /**
   * Carrega veículos no mapa
   */
  async loadVehiclesOnMap() {
    if (!this.map) return;
    
    try {
      this.markers.forEach(marker => this.map.removeLayer(marker));
      this.markers = [];
      
      const vehicles = await vehicleService.getAllVehicles();
      const allVehicles = Array.isArray(vehicles) ? vehicles : (vehicles.data || []);
      
      const filterStatus = $('#filterStatus').val() || 'all';
      
      let filteredVehicles = allVehicles;
      if (filterStatus !== 'all') {
        filteredVehicles = allVehicles.filter(v => {
          const vehicleData = v.data || v;
          const status = vehicleData.status || 'inactive';
          return status === filterStatus;
        });
      }
      
      filteredVehicles.forEach((vehicle, index) => {
        const vehicleData = vehicle.data || vehicle;
        const status = vehicleData.status || 'inactive';
        
        const lat = -23.5505 + (Math.random() - 0.5) * 0.1;
        const lng = -46.6333 + (Math.random() - 0.5) * 0.1;
        
        let markerColor = 'bg-zinc-600';
        if (status === 'active') {
          markerColor = 'bg-emerald-500';
        } else if (status === 'maintenance') {
          markerColor = 'bg-yellow-500';
        } else if (status === 'available') {
          markerColor = 'bg-blue-500';
        }
        
        const icon = L.divIcon({
          className: 'custom-vehicle-marker',
          html: `
            <div class="vehicle-marker ${markerColor} border-2 border-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        
        const marker = L.marker([lat, lng], { icon })
          .addTo(this.map)
          .bindPopup(`
            <div class="popup-content text-white font-mono text-sm">
              <div class="font-bold text-emerald-500 mb-2">${vehicleData.placa || vehicleData.codigo || 'N/A'}</div>
              <div class="text-zinc-400 text-xs">${vehicleData.tipo || vehicleData.modelo || 'Veículo'}</div>
              <div class="text-zinc-400 text-xs mt-1">Status: ${this.getStatusLabel(status)}</div>
              ${vehicleData.operadorAtual || vehicleData.operador_atual ? `<div class="text-zinc-400 text-xs mt-1">Operador: ${vehicleData.operadorAtual || vehicleData.operador_atual}</div>` : ''}
            </div>
          `, {
            className: 'custom-popup'
          });
        
          this.markers.push(marker);
      });
      
      if (this.markers.length > 0) {
        const group = new L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds().pad(0.1));
      }
    } catch (error) {
      console.error('Erro ao carregar veículos no mapa:', error);
    }
  }
  
  /**
   * Configura event listeners
   */
  setupEventListeners() {
    $(document).off('change', '#filterStatus').on('change', '#filterStatus', () => {
      this.loadVehiclesOnMap();
    });
    
    $(document).off('click', '#refreshMap').on('click', '#refreshMap', () => {
      this.loadVehiclesOnMap();
    });
  }

  /**
   * Retorna label do status
   */
  getStatusLabel(status) {
    const labels = {
      active: 'Em Missão',
      inactive: 'Inativo',
      available: 'Disponível',
      maintenance: 'Manutenção'
    };
    return labels[status] || 'Desconhecido';
  }
  
  /**
   * Observa mudanças no DOM para manter z-index baixo
   */
  setupZIndexObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.observer = new MutationObserver(() => {
      this.forceLowZIndex();
    });
    
    const mapContainer = this.map?.getContainer();
    if (mapContainer) {
      this.observer.observe(mapContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers = [];
  }
}

let trackingModuleInstance = null;

export async function initTrackingModule() {
  if (trackingModuleInstance) {
    trackingModuleInstance.destroy();
  }
  trackingModuleInstance = new TrackingModule();
  await trackingModuleInstance.init();
  return trackingModuleInstance;
}

export default TrackingModule;
