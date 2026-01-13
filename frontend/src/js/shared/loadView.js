import { renderHeader } from '../components/Header.js';
import { renderSidebar } from '../components/Sidebar.js';

export async function loadView(viewPath, options = {}) {
  try {
    const response = await fetch(`/src/views/${viewPath}.html`);
    
    if (!response.ok) {
      throw new Error(`View não encontrada: ${viewPath}`);
    }
    
    let html = await response.text();
    
    if (viewPath !== 'login' && options.injectLayout !== false) {
      const pageTitle = options.pageTitle || getPageTitle(viewPath);
      const activeRoute = options.activeRoute || getActiveRoute(viewPath);
      
      let mainContent = '';
      const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
      if (mainMatch) {
        mainContent = mainMatch[0];
      } else {
        mainContent = `<main class="main-content flex-1 transition-all duration-300" style="padding: 1rem;">${html.trim()}</main>`;
      }
      
      html = `
        <div class="${viewPath}-view bg-black min-h-screen text-white" style="padding: 0; margin: 0;">
          ${renderHeader(pageTitle)}
          <div class="flex">
            ${renderSidebar(activeRoute)}
            ${mainContent}
          </div>
        </div>
      `;
    }
    
    return html;
  } catch (error) {
    console.error('Erro ao carregar view:', error);
    return `
      <div class="error-container">
        <h2>Erro ao carregar página</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}

function getPageTitle(viewPath) {
  const titles = {
    'dashboard': 'DASHBOARD',
    'drivers': 'MOTORISTAS',
    'vehicles': 'VEHICLES',
    'tracking': 'RASTREIO',
    'finance': 'FINANCEIRO',
    'users': 'USUÁRIOS',
    'profile': 'MEU PERFIL',
  };
  return titles[viewPath] || viewPath.toUpperCase();
}

function getActiveRoute(viewPath) {
  const routes = {
    'dashboard': '/dashboard',
    'drivers': '/motoristas',
    'vehicles': '/veiculos',
    'tracking': '/tracking',
    'finance': '/finance',
    'users': '/usuarios',
    'profile': '/perfil',
  };
  return routes[viewPath] || `/${viewPath}`;
}

export function injectView(html, containerId = 'app') {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = html;
  } else {
    console.error(`Container com ID "${containerId}" não encontrado`);
  }
}

export async function loadAndInjectView(viewPath, containerId = 'app', options = {}) {
  const container = document.getElementById(containerId);
  
  if (container) {
    container.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Carregando...</p>
      </div>
    `;
  }
  
  try {
    const html = await loadView(viewPath, options);
    injectView(html, containerId);
  } catch (error) {
    console.error('Erro ao carregar view:', error);
    if (container) {
      container.innerHTML = `
        <div class="error-container">
          <h2>Erro ao carregar página</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
}

