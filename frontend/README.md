# Frontend - Sistema de Gestão de Frotas

SPA (Single Page Application) desenvolvido com JavaScript vanilla, jQuery, Vite e tecnologias modernas para gestão de frotas com interface tática/militar.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando](#executando)
- [Arquitetura](#arquitetura)
- [Rotas](#rotas)
- [Autenticação](#autenticação)
- [Padrões de Código](#padrões-de-código)
- [Desenvolvimento](#desenvolvimento)
- [Build para Produção](#build-para-produção)
- [Troubleshooting](#troubleshooting)

## Visão Geral

Frontend SPA que se comunica com a API Laravel através de requisições REST. Utiliza roteamento client-side, componentes reutilizáveis e módulos independentes para cada feature.

### Características

- SPA sem recarregamento de página
- Roteamento client-side com Navigo
- Componentes reutilizáveis (Header, Sidebar)
- Módulos independentes por feature
- Tema escuro tático/militar
- Responsivo (mobile e desktop)
- Cache inteligente de views
- Autenticação com Laravel Sanctum

## Tecnologias

### Core

- **JavaScript ES6+**: Vanilla JS com módulos ES6
- **jQuery 3.7+**: Manipulação DOM e eventos
- **Vite 7.3+**: Build tool e dev server com HMR
- **Navigo 8.11+**: Router client-side
- **Axios 1.13+**: Cliente HTTP para API

### UI/UX

- **Tailwind CSS 4.1+**: Framework CSS utility-first
- **SweetAlert2 11.26+**: Modais e notificações
- **Leaflet 1.9+**: Mapas interativos para rastreamento

### Build Tools

- **PostCSS**: Processamento de CSS
- **Autoprefixer**: Compatibilidade de navegadores

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── js/
│   │   ├── api/
│   │   │   └── apiClient.js          # Cliente Axios configurado
│   │   ├── components/
│   │   │   ├── Header.js              # Componente Header reutilizável
│   │   │   └── Sidebar.js             # Componente Sidebar reutilizável
│   │   ├── modules/
│   │   │   ├── auth.js                # Módulo de autenticação
│   │   │   ├── dashboardModule.js     # Dashboard e estatísticas
│   │   │   ├── driverModule.js        # CRUD motoristas
│   │   │   ├── vehicleModule.js       # CRUD veículos
│   │   │   ├── financeModule.js       # Gestão financeira
│   │   │   ├── trackingModule.js      # Rastreamento com mapa
│   │   │   ├── userModule.js          # Gestão de usuários
│   │   │   ├── profileModule.js       # Perfil do usuário
│   │   │   ├── ui.js                  # UI comum (relógio, sidebar)
│   │   │   └── matrixRain.js          # Efeito Matrix no login
│   │   ├── services/
│   │   │   ├── authService.js         # Service de autenticação
│   │   │   ├── dashboardService.js    # Service de dashboard
│   │   │   ├── driverService.js        # Service de motoristas
│   │   │   ├── vehicleService.js      # Service de veículos
│   │   │   ├── missionService.js      # Service de missões
│   │   │   ├── financeService.js      # Service financeiro
│   │   │   └── userService.js         # Service de usuários
│   │   ├── shared/
│   │   │   ├── loadView.js            # Carregamento de views HTML
│   │   │   └── authGuard.js           # Guards de autenticação
│   │   ├── utils/
│   │   │   └── modalUtils.js          # Utilitários para modais
│   │   ├── router.js                  # Configuração de rotas
│   │   └── main.js                    # Entry point da aplicação
│   ├── views/                         # Views HTML dinâmicas
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── drivers.html
│   │   ├── vehicles.html
│   │   ├── tracking.html
│   │   ├── finance.html
│   │   ├── users.html
│   │   └── profile.html
│   └── css/                           # Estilos
│       ├── main.css                   # Estilos globais
│       ├── spacing.css                # Espaçamentos
│       └── mobile.css                 # Media queries mobile
├── index.html                         # HTML principal
├── vite.config.js                     # Configuração Vite
├── tailwind.config.js                 # Configuração Tailwind
├── postcss.config.js                  # Configuração PostCSS
└── package.json                       # Dependências
```

## Instalação

### Pré-requisitos

- Node.js 18+ e npm
- Backend Laravel rodando (ver README do backend)

### Passos

1. Instalar dependências:

```bash
npm install
```

2. Configurar variáveis de ambiente:

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost/api
```

## Configuração

### Vite

O arquivo `vite.config.js` está configurado para:
- Servir arquivos estáticos de `src/`
- Hot Module Replacement (HMR)
- Build otimizado para produção

### API Client

O `apiClient.js` está configurado para:
- Usar `VITE_API_URL` do `.env`
- Enviar token de autenticação no header `Authorization`
- Interceptar erros HTTP (401, 422, 500)
- Tratamento global de erros

### Tailwind CSS

Configurado com tema customizado:
- Cores: zinc (cinza escuro), emerald (verde)
- Fontes: monospace para tema tático
- Breakpoints responsivos

## Executando

### Desenvolvimento

```bash
npm run dev
```

O servidor será iniciado em `http://localhost:5173` (porta padrão do Vite).

### Preview (Build Local)

```bash
npm run build
npm run preview
```

## Arquitetura

### Padrão Module

Cada feature é um módulo independente:

```javascript
class DriverModule {
  constructor() {
    this.drivers = [];
  }
  
  async init() {
    await this.loadDrivers();
    this.setupEventListeners();
  }
  
  destroy() {
    // Limpeza ao sair da rota
  }
}
```

### Padrão Singleton

Cada módulo usa singleton para garantir uma instância por página:

```javascript
let moduleInstance = null;

export async function initDriverModule() {
  if (moduleInstance) {
    moduleInstance.destroy();
  }
  moduleInstance = new DriverModule();
  await moduleInstance.init();
  return moduleInstance;
}
```

### Padrão Service

Services abstraem chamadas à API:

```javascript
class DriverService {
  async getAllDrivers() {
    const response = await apiClient.get('/motoristas');
    return response.data;
  }
}

export default new DriverService();
```

### Padrão Component

Componentes reutilizáveis (Header, Sidebar):

```javascript
export function renderHeader(pageTitle) {
  return `<header>...</header>`;
}
```

## Rotas

### Rotas Públicas

- `/login` - Página de login

### Rotas Protegidas

Todas as rotas abaixo requerem autenticação:

- `/` ou `/dashboard` - Dashboard principal
- `/motoristas` - Lista de motoristas
- `/veiculos` - Lista de veículos
- `/tracking` - Rastreamento em tempo real
- `/finance` - Gestão financeira
- `/usuarios` - Gestão de usuários
- `/perfil` - Perfil do usuário autenticado

### Guards

Rotas protegidas usam `authGuard`:

```javascript
router.on('/dashboard', async () => {
  await authGuard(null, async () => {
    await loadAndInjectView('dashboard', 'app', { 
      pageTitle: 'DASHBOARD', 
      activeRoute: '/dashboard' 
    });
    initUI();
    await initDashboardModule();
  }, () => {
    router.navigate('/login');
  });
});
```

## Autenticação

### Fluxo

1. Usuário faz login com email e senha
2. Backend retorna token Sanctum
3. Token é salvo em `localStorage`
4. Token é enviado em todas as requisições via header `Authorization: Bearer {token}`
5. `authGuard` verifica token antes de permitir acesso a rotas protegidas

### Armazenamento

Token armazenado em `localStorage` com chave `auth_token`.

### Interceptor Axios

O `apiClient.js` intercepta todas as requisições e adiciona o token automaticamente:

```javascript
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Padrões de Código

### Módulos ES6

Todos os arquivos usam `import/export` - sem variáveis globais.

### Event Delegation

Para elementos carregados dinamicamente:

```javascript
$(document).off('click', '.btn-delete').on('click', '.btn-delete', (e) => {
  const id = $(e.currentTarget).data('id');
  // handler
});
```

### Services

Cada feature possui um service que encapsula:
- Chamadas à API
- Transformação de dados
- Tratamento de erros

### Views

Views são arquivos HTML estáticos carregados dinamicamente pelo router via `loadView.js`.

### Componentes

Componentes retornam HTML como string e são injetados dinamicamente.

## Desenvolvimento

### Adicionando uma Nova Rota

1. Criar view HTML em `src/views/`:

```html
<main class="main-content">
  <h1>Nova Página</h1>
</main>
```

2. Criar módulo em `src/js/modules/`:

```javascript
class NewModule {
  async init() {
    // Inicialização
  }
  
  destroy() {
    // Limpeza
  }
}

let moduleInstance = null;

export async function initNewModule() {
  if (moduleInstance) {
    moduleInstance.destroy();
  }
  moduleInstance = new NewModule();
  await moduleInstance.init();
  return moduleInstance;
}
```

3. Adicionar rota em `router.js`:

```javascript
router.on('/nova-rota', async () => {
  await authGuard(null, async () => {
    await loadAndInjectView('new-view', 'app', { 
      pageTitle: 'NOVA PÁGINA', 
      activeRoute: '/nova-rota' 
    });
    initUI();
    await initNewModule();
  }, () => {
    router.navigate('/login');
  });
});
```

4. Adicionar ao Sidebar em `components/Sidebar.js`:

```javascript
{ path: '/nova-rota', label: 'NOVA PÁGINA', icon: '...' }
```

### Criando um Novo Service

```javascript
// src/js/services/newService.js
import apiClient from '../api/apiClient.js';

class NewService {
  async getAll() {
    try {
      const response = await apiClient.get('/endpoint');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  }
  
  async create(data) {
    const response = await apiClient.post('/endpoint', data);
    return response.data;
  }
}

export default new NewService();
```

### Hot Module Replacement (HMR)

O Vite suporta HMR nativo. Alterações em arquivos JavaScript são refletidas automaticamente sem recarregar a página.

## Build para Produção

### Build

```bash
npm run build
```

Isso gera arquivos otimizados em `dist/`:
- JavaScript minificado e bundlado
- CSS processado e minificado
- Assets otimizados

### Deploy

1. Build do projeto:

```bash
npm run build
```

2. Servir arquivos de `dist/` com servidor web (Nginx, Apache, etc.)

3. Configurar proxy reverso para API:

```nginx
location /api {
    proxy_pass http://backend:80;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Troubleshooting

### Views não carregam

- Verifique se o Vite está servindo arquivos de `src/views/`
- Confirme que o caminho no `loadView.js` está correto
- Verifique console do navegador (F12) para erros

### Erro de CORS

- Confirme que `VITE_API_URL` está correto no `.env`
- Verifique se backend está configurado para aceitar origem do frontend
- Confirme que `Access-Control-Allow-Credentials: true` está no backend

### Token não funciona

- Verifique se token está em `localStorage` (DevTools > Application > Local Storage)
- Confirme que header `Authorization` está sendo enviado (DevTools > Network)
- Verifique se token não expirou

### Módulos não inicializam

- Verifique se módulo está sendo importado corretamente
- Confirme que função `init` está sendo chamada na rota
- Verifique console para erros JavaScript

### CSS não aplica

- Confirme que Tailwind está configurado corretamente
- Verifique se classes estão sendo usadas corretamente
- Execute `npm run build` para processar CSS

### Build falha

- Limpe cache: `rm -rf node_modules package-lock.json && npm install`
- Verifique erros no terminal
- Confirme que todas as dependências estão instaladas

## Dependências Principais

### Produção

- `axios`: Cliente HTTP
- `jquery`: Manipulação DOM
- `navigo`: Roteamento
- `sweetalert2`: Modais e notificações
- `leaflet`: Mapas interativos

### Desenvolvimento

- `vite`: Build tool
- `tailwindcss`: Framework CSS
- `postcss`: Processamento CSS
- `autoprefixer`: Compatibilidade navegadores

## Licença

Este projeto é privado e proprietário.
