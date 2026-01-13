/**
 * Componente de Header reutilizável
 * Segue o princípio Single Responsibility do SOLID
 */
export function renderHeader(pageTitle) {
  return `
    <header class="bg-zinc-900 border-b border-zinc-800" style="padding: 1.5rem 2rem;">
      <div class="flex justify-between items-center flex-wrap" style="gap: 1rem;">
        <div class="flex items-center" style="gap: 1rem;">
          <button id="sidebar-toggle" class="text-zinc-400 hover:text-emerald-500 transition-colors" style="min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white font-mono">${pageTitle}</h1>
            <p class="text-emerald-500 font-mono text-xs uppercase tracking-wider hidden sm:block" id="system-status-text">SISTEMA_ATIVO</p>
          </div>
        </div>
        <div class="flex items-center" style="gap: 0.75rem;">
          <div id="tactical-clock" class="text-right hidden lg:block">
            <div id="tactical-clock-time" class="text-lg font-mono text-white">00:00:00</div>
            <div id="tactical-clock-date" class="text-xs font-mono text-zinc-400">00/00/0000</div>
          </div>
        </div>
      </div>
    </header>
  `;
}

