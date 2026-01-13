# Sistema de Gestão de Frotas Tático

Sistema completo de gestão de frotas com interface tática/militar, desenvolvido com Laravel 11 (backend) e JavaScript vanilla com jQuery (frontend).

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Princípios SOLID](#princípios-solid)
- [API Endpoints](#api-endpoints)
- [Autenticação](#autenticação)
- [Funcionalidades](#funcionalidades)
- [Desenvolvimento](#desenvolvimento)
- [Troubleshooting](#troubleshooting)

## Visão Geral

Sistema SPA (Single Page Application) para gestão completa de frotas, incluindo:

- **Gestão de Motoristas**: CRUD completo com autenticação
- **Gestão de Veículos**: Controle de frota com status em tempo real
- **Missões**: Início e finalização de missões táticas
- **Rastreamento**: Mapa interativo com localização de veículos
- **Financeiro**: Controle de orçamentos e transações
- **Usuários**: Gerenciamento de contas de acesso
- **Dashboard**: Estatísticas e visão geral do sistema

### Características Principais

- Arquitetura baseada em SOLID
- Service Pattern (Backend)
- API Resources (camelCase)
- CORS configurado
- Cache inteligente (Redis)
- Autenticação com Laravel Sanctum
- Interface responsiva e tema escuro
- Validação server-side com FormRequests

## Tecnologias

### Backend

- **Laravel 11**: Framework PHP
- **PHP 8.2+**: Linguagem
- **MySQL 8.4**: Banco de dados
- **Redis**: Cache e sessões
- **Laravel Sanctum**: Autenticação API
- **Laravel Sail**: Ambiente Docker

### Frontend

- **JavaScript ES6+**: Vanilla JS com módulos
- **jQuery 3.7+**: Manipulação DOM
- **Vite 7.3+**: Build tool e dev server
- **Navigo 8.11+**: Router client-side
- **Axios 1.13+**: Cliente HTTP
- **Tailwind CSS 4.1+**: Framework CSS
- **SweetAlert2 11.26+**: Modais e alertas
- **Leaflet 1.9+**: Mapas interativos

## Arquitetura

### Backend (Laravel)

```
app/
├── Http/
│   ├── Controllers/Api/    # Controllers RESTful
│   ├── Middleware/          # CORS, autenticação
│   ├── Requests/            # FormRequests (validação)
│   └── Resources/           # API Resources (transformação)
├── Models/                   # Eloquent Models
├── Services/                 # Service Pattern (lógica de negócio)
└── Providers/               # Service Providers
```

**Padrões Utilizados:**
- **Service Pattern**: Lógica de negócio isolada em Services
- **Repository Pattern**: Implícito via Eloquent
- **API Resources**: Transformação de dados (snake_case → camelCase)
- **FormRequests**: Validação centralizada

### Frontend (SPA)

```
src/js/
├── api/                     # Cliente HTTP (Axios)
├── components/              # Componentes reutilizáveis
├── modules/                 # Módulos por feature
├── services/                # Services (chamadas API)
├── shared/                  # Utilitários compartilhados
└── utils/                   # Funções auxiliares
```

**Padrões Utilizados:**
- **Module Pattern**: Cada feature é um módulo independente
- **Singleton Pattern**: Uma instância por módulo
- **Service Pattern**: Abstração de chamadas API
- **Component Pattern**: Header e Sidebar componentizados

## Requisitos

- **Docker Desktop** (Windows/Mac) ou **Docker + Docker Compose** (Linux)
- **Node.js 18+** e **npm**
- **Git**

## Instalação

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd emprego
```

### 2. Configurar Backend

```bash
cd backend

# Copiar arquivo de ambiente
cp .env.example .env

# Instalar dependências PHP
composer install

# Gerar chave da aplicação
php artisan key:generate
```

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependências Node
npm install
```

### 4. Configurar Docker (Laravel Sail)

```bash
cd ../backend

# Configurar variáveis de ambiente no .env
# DB_DATABASE=emprego
# DB_USERNAME=sail
# DB_PASSWORD=password
```

## Configuração

### Backend (.env)

```env
APP_NAME="Sistema de Gestão de Frotas"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=emprego
DB_USERNAME=sail
DB_PASSWORD=password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:5174,127.0.0.1:5173,127.0.0.1:5174
```

### Frontend

O frontend usa variáveis de ambiente do Vite. Configure em `frontend/.env`:

```env
VITE_API_URL=http://localhost/api
```

## Executando o Projeto

### Opção 1: Laravel Sail (Recomendado)

```bash
cd backend

# Iniciar containers Docker
./vendor/bin/sail up -d

# Executar migrations
./vendor/bin/sail artisan migrate

# Popular banco de dados
./vendor/bin/sail artisan db:seed

# Em outro terminal, iniciar frontend
cd ../frontend
npm run dev
```

**Acessos:**
- Frontend: http://localhost:5173
- Backend API: http://localhost/api
- Mailpit: http://localhost:8025

### Opção 2: Ambiente Local

**Backend:**
```bash
cd backend
php artisan serve
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Banco de Dados:**
Configure MySQL localmente e atualize `.env` com credenciais.

## Estrutura do Projeto

```
emprego/
├── backend/                 # Laravel 11
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── compose.yaml         # Docker Compose
│
└── frontend/                # SPA JavaScript
    ├── src/
    │   ├── js/
    │   │   ├── api/
    │   │   ├── components/
    │   │   ├── modules/
    │   │   ├── services/
    │   │   └── shared/
    │   ├── views/
    │   └── css/
    ├── index.html
    └── vite.config.js
```

## Princípios SOLID

### Single Responsibility Principle (SRP)

- **Services**: Cada service tem uma responsabilidade única (ex: `DriverService` gerencia apenas drivers)
- **Controllers**: Apenas orquestram chamadas, não contêm lógica de negócio
- **Resources**: Apenas transformam dados para API
- **Modules (Frontend)**: Cada módulo gerencia uma feature específica

### Open/Closed Principle (OCP)

- **FormRequests**: Extensíveis via herança para validações customizadas
- **Services**: Fácil adicionar novos métodos sem modificar existentes
- **API Resources**: Extensíveis para novos formatos de resposta

### Liskov Substitution Principle (LSP)

- **Models**: Todos seguem contrato do Eloquent
- **FormRequests**: Todos implementam `authorize()` e `rules()`

### Interface Segregation Principle (ISP)

- **Services**: Métodos específicos por operação (não interfaces genéricas)
- **API Resources**: Transformação específica por modelo

### Dependency Inversion Principle (DIP)

- **Controllers**: Dependem de abstrações (Services) via injeção de dependência
- **Services**: Dependem de Models (abstrações Eloquent), não de implementações concretas

## API Endpoints

### Autenticação

```
POST   /api/login              # Login (email + senha)
```

### Dashboard

```
GET    /api/dashboard/stats    # Estatísticas gerais
```

### Motoristas

```
GET    /api/motoristas         # Listar todos
GET    /api/motoristas/{id}   # Buscar por ID
POST   /api/motoristas         # Criar
PUT    /api/motoristas/{id}   # Atualizar
DELETE /api/motoristas/{id}   # Deletar
```

### Veículos

```
GET    /api/vehicles           # Listar todos
GET    /api/vehicles/available # Listar disponíveis
GET    /api/vehicles/{id}     # Buscar por ID
POST   /api/vehicles          # Criar
PUT    /api/vehicles/{id}     # Atualizar
DELETE /api/vehicles/{id}     # Deletar
```

### Missões

```
GET    /api/missions           # Listar todas
GET    /api/missions/{id}     # Buscar por ID
POST   /api/missions/start    # Iniciar missão
POST   /api/missions/{id}/stop # Finalizar missão
```

### Financeiro

```
GET    /api/finance/summary              # Resumo financeiro
GET    /api/finance/transactions         # Listar transações
POST   /api/finance/transactions         # Criar transação
PUT    /api/finance/transactions/{id}    # Atualizar transação
DELETE /api/finance/transactions/{id}    # Deletar transação
GET    /api/finance/budgets              # Listar orçamentos
GET    /api/finance/budgets/active       # Orçamento ativo
POST   /api/finance/budgets              # Criar orçamento
PUT    /api/finance/budgets/{id}         # Atualizar orçamento
DELETE /api/finance/budgets/{id}         # Deletar orçamento
```

### Usuários

```
GET    /api/users              # Listar todos
GET    /api/users/{id}        # Buscar por ID
POST   /api/users             # Criar
PUT    /api/users/{id}        # Atualizar
DELETE /api/users/{id}        # Deletar
GET    /api/users/me          # Perfil do usuário autenticado
PUT    /api/users/me          # Atualizar perfil
```

**Todas as rotas (exceto `/api/login`) requerem autenticação via `auth:sanctum`.**

## Autenticação

### Fluxo de Autenticação

1. **Login**: Usuário envia `email` e `password`
2. **Validação**: Backend valida credenciais (User ou Driver)
3. **Token**: Laravel Sanctum gera token de acesso
4. **Armazenamento**: Token salvo em `localStorage` (frontend)
5. **Requisições**: Token enviado no header `Authorization: Bearer {token}`

### Tipos de Usuário

- **admin**: Usuário administrativo (tabela `users`)
- **driver**: Motorista (tabela `drivers` com email/senha)

### Proteção de Rotas

**Backend:**
```php
Route::middleware('auth:sanctum')->group(function () {
    // Rotas protegidas
});
```

**Frontend:**
```javascript
await authGuard(match, onSuccess, onFail);
```

## Funcionalidades

### Dashboard

- Estatísticas em tempo real
- Últimos motoristas cadastrados
- Veículos disponíveis
- Veículos em missão
- Saldo financeiro

### Gestão de Motoristas

- CRUD completo
- Autenticação (email + senha)
- Status (active, inactive, available)
- Iniciar/Finalizar missões
- CNH e especialidades

### Gestão de Veículos

- CRUD completo
- Status (available, active, maintenance, inactive)
- Associação com motoristas
- Filtros e busca

### Missões

- Iniciar missão (motorista + veículo)
- Finalizar missão
- Histórico completo
- Status em tempo real

### Rastreamento

- Mapa interativo (Leaflet)
- Marcadores por status
- Filtros dinâmicos
- Popups informativos

### Financeiro

- Transações (receitas/despesas)
- Orçamentos por categoria
- Resumo financeiro
- Gráficos de distribuição

### Usuários

- CRUD de contas
- Perfil do usuário
- Tipos (admin, driver)

## Desenvolvimento

### Comandos Úteis

**Backend:**
```bash
# Migrations
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan migrate:fresh --seed

# Cache
./vendor/bin/sail artisan cache:clear
./vendor/bin/sail artisan config:clear

# Tinker
./vendor/bin/sail artisan tinker

# Logs
./vendor/bin/sail artisan tail
```

**Frontend:**
```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build
npm run preview
```

### Estrutura de Código

**Backend:**
- Services: Lógica de negócio
- Controllers: Orquestração
- FormRequests: Validação
- Resources: Transformação de dados
- Models: Eloquent ORM

**Frontend:**
- Modules: Features específicas
- Services: Chamadas API
- Components: UI reutilizável
- Shared: Utilitários

### Cache

O sistema usa cache Redis para:
- Listagens (60s)
- Detalhes (300s)
- Dashboard (30s)
- Orçamentos (300s)

Cache é invalidado automaticamente em operações CUD.

## Troubleshooting

### Problemas Comuns

**1. CORS Error**
- Verifique `CORS` middleware
- Confirme `SANCTUM_STATEFUL_DOMAINS` no `.env`
- Verifique origem no header `Origin`

**2. Token não funciona**
- Verifique se token está em `localStorage`
- Confirme header `Authorization: Bearer {token}`
- Verifique expiração do token

**3. Cache não atualiza**
- Execute `php artisan cache:clear`
- Verifique conexão Redis
- Limpe cache do navegador

**4. Migrations falham**
- Verifique credenciais do banco
- Confirme MySQL está rodando
- Execute `migrate:fresh` se necessário

**5. Frontend não conecta**
- Verifique `VITE_API_URL` no `.env`
- Confirme backend está rodando
- Verifique console do navegador (F12)

### Logs

**Backend:**
```bash
./vendor/bin/sail artisan tail
# ou
tail -f storage/logs/laravel.log
```

**Frontend:**
Abra DevTools (F12) e verifique Console e Network.

## Licença

Este projeto é privado e proprietário.

## Contribuindo

Este é um projeto privado. Para contribuições, entre em contato com os mantenedores.

---

**Desenvolvido usando Laravel e JavaScript**

#   A v a l i a c a o _ e n t r e v i s t a _ e m p r e g o  
 