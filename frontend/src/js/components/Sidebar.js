/**
 * Componente de Sidebar reutilizável
 * Segue o princípio Single Responsibility do SOLID
 */
export function renderSidebar(activeRoute = '') {
  const routes = [
    { path: '/dashboard', label: 'DASHBOARD', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { path: '/veiculos', label: 'VEÍCULOS', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { path: '/motoristas', label: 'MOTORISTAS', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/tracking', label: 'RASTREIO REAL', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { path: '/finance', label: 'FINANCEIRO', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/usuarios', label: 'USUÁRIOS', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { path: '/perfil', label: 'MEU PERFIL', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const menuItems = routes.map(route => {
    const isActive = activeRoute === route.path;
    const activeClasses = isActive 
      ? 'bg-emerald-500/20 border border-emerald-500/50 rounded text-emerald-500'
      : 'bg-zinc-800/50 border border-zinc-700 rounded text-white hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-500';
    
    return `
      <a href="${route.path}" class="flex items-center gap-3 px-4 py-3 ${activeClasses} transition-colors font-mono text-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${route.icon}"></path>
        </svg>
        ${route.label}
      </a>
    `;
  }).join('');

  return `
    <aside id="tactical-sidebar" class="fixed left-0 top-0 w-64 bg-zinc-900 border-r border-zinc-800 transform -translate-x-full transition-transform duration-300" style="height: 100vh; z-index: 10000;">
      <div class="p-6 border-b border-zinc-800">
        <div class="flex items-center justify-between text-white">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span class="font-mono text-sm font-bold">TF_OPERATIONS</span>
          </div>
          <button id="sidebar-close" class="text-white hover:text-emerald-500 transition-colors hidden bg-zinc-800 hover:bg-zinc-700 rounded p-1" style="min-width: 36px; min-height: 36px; display: flex; align-items: center; justify-content: center; border: 1px solid #3f3f46;">
            <h1>X</h1>
          </button>
        </div>
      </div>
      <nav class="p-4 space-y-1">
        ${menuItems}
        <a href="/login" class="flex items-center gap-3 px-4 py-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 hover:bg-red-900/30 transition-colors font-mono text-sm mt-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          LOGOUT_SESSION
        </a>
      </nav>
    </aside>
    <div class="overlay-sidebar fixed inset-0 bg-black/50 z-9998 hidden"></div>
  `;
}

