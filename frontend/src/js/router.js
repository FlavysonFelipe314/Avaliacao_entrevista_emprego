import Navigo from 'navigo';
import { loadAndInjectView } from './shared/loadView.js';
import { authGuard, publicGuard } from './shared/authGuard.js';
import { initAuth } from './modules/auth.js';
import { initUI } from './modules/ui.js';
import { initDriverModule } from './modules/driverModule.js';
import { initVehicleModule } from './modules/vehicleModule.js';
import { initDashboardModule } from './modules/dashboardModule.js';
import { initFinanceModule } from './modules/financeModule.js';
import { initTrackingModule } from './modules/trackingModule.js';
import { initUserModule } from './modules/userModule.js';
import { initProfileModule } from './modules/profileModule.js';
import { initDriverForm } from './services/driverService.js';
import { initVehicleForm } from './services/vehicleService.js';

let router = null;

export function initRouter() {
  const root = '/';
  const useHash = false;
  const hash = '#';
  
  router = new Navigo(root, useHash, hash);
  
  router.hooks({
    before(done, match) {
      done();
    },
    after(match) {
      window.scrollTo(0, 0);
    }
  });
  
  router.on('/', async () => {
    await authGuard(null, async () => {
      await loadAndInjectView('dashboard', 'app', { pageTitle: 'DASHBOARD', activeRoute: '/dashboard' });
      initUI();
      await initDashboardModule();
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.on('/dashboard', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('dashboard', 'app', { pageTitle: 'DASHBOARD', activeRoute: '/dashboard' });
      initUI();
      await initDashboardModule();
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.on('/login', async (match) => {
    await publicGuard(match, async () => {
      await loadAndInjectView('login');
      initAuth();
    }, () => {
      router.navigate('/dashboard');
    });
  });
  
  router.on('/motoristas', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('drivers', 'app', { pageTitle: 'MOTORISTAS', activeRoute: '/motoristas' });
      initUI();
      await initDriverModule();
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.on('/motoristas/novo', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('driver-form');
      initUI();
      initDriverForm();
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.on('/motoristas/:id/editar', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('driver-form');
      initUI();
      const driverId = match.data.id;
      await initDriverForm(driverId);
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.on('/veiculos', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('vehicles', 'app', { pageTitle: 'VEHICLES', activeRoute: '/veiculos' });
      initUI();
      await initVehicleModule();
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.on('/veiculos/novo', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('vehicle-form');
      initUI();
      initVehicleForm();
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.on('/veiculos/:id/editar', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('vehicle-form');
      initUI();
      const vehicleId = match.data.id;
      await initVehicleForm(vehicleId);
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.on('/tracking', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('tracking', 'app', { pageTitle: 'RASTREIO REAL', activeRoute: '/tracking' });
      initUI();
      await initTrackingModule();
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.on('/finance', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('finance', 'app', { pageTitle: 'FINANCEIRO', activeRoute: '/finance' });
      initUI();
      await initFinanceModule();
    }, () => {
      router.navigate('/login');
    });
  });

  router.on('/usuarios', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('users', 'app', { pageTitle: 'USUÁRIOS', activeRoute: '/usuarios' });
      initUI();
      await initUserModule();
    }, () => {
      router.navigate('/login');
    });
  });

  router.on('/perfil', async (match) => {
    await authGuard(match, async () => {
      await loadAndInjectView('profile', 'app', { pageTitle: 'MEU PERFIL', activeRoute: '/perfil' });
      initUI();
      await initProfileModule();
    }, () => {
      router.navigate('/login');
    });
  });
  
  router.notFound(() => {
    loadAndInjectView('404');
  });
  
  router.resolve();
  return router;
}

export function navigateTo(path) {
  if (router) {
    router.navigate(path);
  }
}

export default router;

