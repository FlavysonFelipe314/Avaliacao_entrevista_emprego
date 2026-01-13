# Backend - Sistema de Gestão de Frotas

API REST desenvolvida com Laravel 11 seguindo princípios SOLID, Service Pattern e Clean Architecture.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando](#executando)
- [Arquitetura](#arquitetura)
- [API Endpoints](#api-endpoints)
- [Autenticação](#autenticação)
- [Banco de Dados](#banco-de-dados)
- [Cache](#cache)
- [Desenvolvimento](#desenvolvimento)
- [Testes](#testes)
- [Troubleshooting](#troubleshooting)

## Visão Geral

API RESTful completa para gestão de frotas, incluindo motoristas, veículos, missões, financeiro e usuários. Desenvolvida seguindo princípios SOLID e padrões de arquitetura limpa.

### Características

- API RESTful completa
- Autenticação com Laravel Sanctum
- Service Pattern para lógica de negócio
- API Resources para transformação de dados
- FormRequests para validação
- Cache inteligente com Redis
- CORS configurado
- Migrations e Seeders
- Docker com Laravel Sail

## Tecnologias

### Core

- **Laravel 11**: Framework PHP
- **PHP 8.2+**: Linguagem de programação
- **MySQL 8.4**: Banco de dados relacional
- **Redis**: Cache e sessões
- **Laravel Sanctum**: Autenticação API

### Ferramentas

- **Laravel Sail**: Ambiente Docker
- **Composer**: Gerenciador de dependências PHP
- **Laravel Pint**: Code style fixer
- **Pest**: Framework de testes

## Estrutura do Projeto

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── DashboardController.php
│   │   │       ├── DriverController.php
│   │   │       ├── VehicleController.php
│   │   │       ├── MissionController.php
│   │   │       ├── FinanceController.php
│   │   │       └── UserController.php
│   │   ├── Middleware/
│   │   │   └── Cors.php
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php
│   │   │   ├── StoreDriverRequest.php
│   │   │   ├── UpdateDriverRequest.php
│   │   │   ├── StoreVehicleRequest.php
│   │   │   ├── UpdateVehicleRequest.php
│   │   │   ├── StartMissionRequest.php
│   │   │   ├── StoreTransactionRequest.php
│   │   │   ├── StoreBudgetRequest.php
│   │   │   ├── StoreUserRequest.php
│   │   │   └── UpdateUserRequest.php
│   │   └── Resources/
│   │       ├── DriverResource.php
│   │       ├── VehicleResource.php
│   │       ├── MissionResource.php
│   │       ├── TransactionResource.php
│   │       ├── BudgetResource.php
│   │       └── UserResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Driver.php
│   │   ├── Vehicle.php
│   │   ├── Mission.php
│   │   ├── FinancialTransaction.php
│   │   └── Budget.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── DriverService.php
│   │   ├── VehicleService.php
│   │   ├── MissionService.php
│   │   ├── DashboardService.php
│   │   ├── FinanceService.php
│   │   └── UserService.php
│   └── Providers/
│       └── AppServiceProvider.php
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2024_01_01_000003_create_drivers_table.php
│   │   ├── 2024_01_01_000004_create_vehicles_table.php
│   │   ├── 2024_01_01_000005_create_missions_table.php
│   │   ├── 2024_01_01_000006_create_personal_access_tokens_table.php
│   │   ├── 2026_01_13_105608_create_financial_transactions_table.php
│   │   └── 2026_01_13_105627_create_budgets_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php
│       ├── DriverSeeder.php
│       ├── VehicleSeeder.php
│       └── MissionSeeder.php
├── routes/
│   └── api.php
├── config/
│   ├── cors.php
│   ├── auth.php
│   └── cache.php
├── compose.yaml
├── composer.json
└── .env.example
```

## Requisitos

- PHP 8.2 ou superior
- Composer
- Docker Desktop (para Laravel Sail) ou MySQL local
- Redis (via Docker ou local)

## Instalação

### Opção 1: Laravel Sail (Recomendado)

1. Clonar repositório e entrar no diretório:

```bash
cd backend
```

2. Instalar dependências:

```bash
composer install
```

3. Copiar arquivo de ambiente:

```bash
cp .env.example .env
```

4. Gerar chave da aplicação:

```bash
php artisan key:generate
```

5. Iniciar containers Docker:

```bash
./vendor/bin/sail up -d
```

6. Executar migrations:

```bash
./vendor/bin/sail artisan migrate
```

7. Popular banco de dados:

```bash
./vendor/bin/sail artisan db:seed
```

### Opção 2: Ambiente Local

1. Instalar dependências:

```bash
composer install
```

2. Configurar `.env` com credenciais do MySQL local

3. Executar migrations:

```bash
php artisan migrate
php artisan db:seed
```

## Configuração

### Arquivo .env

Principais configurações:

```env
APP_NAME="Sistema de Gestão de Frotas"
APP_ENV=local
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

### CORS

Configurado em `config/cors.php` e `app/Http/Middleware/Cors.php` para permitir requisições do frontend.

### Sanctum

Configurado para autenticação via tokens. Domínios permitidos em `SANCTUM_STATEFUL_DOMAINS`.

## Executando

### Com Laravel Sail

```bash
./vendor/bin/sail up -d
```

API estará disponível em `http://localhost/api`

### Sem Docker

```bash
php artisan serve
```

API estará disponível em `http://localhost:8000/api`

### Comandos Úteis

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

## Arquitetura

### Service Pattern

Lógica de negócio isolada em Services:

```php
class DriverService
{
    public function getAllDrivers(): Collection
    {
        return Cache::remember('drivers.all', 60, function () {
            return Driver::orderBy('created_at', 'desc')->get();
        });
    }
    
    public function createDriver(array $data): Driver
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        $driver = Driver::create($data);
        Cache::forget('drivers.all');
        return $driver;
    }
}
```

### Controllers

Controllers apenas orquestram chamadas:

```php
class DriverController extends Controller
{
    public function __construct(
        private readonly DriverService $driverService
    ) {}
    
    public function index(): AnonymousResourceCollection
    {
        $drivers = $this->driverService->getAllDrivers();
        return DriverResource::collection($drivers);
    }
}
```

### FormRequests

Validação centralizada:

```php
class StoreDriverRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:50', 'unique:drivers,codigo'],
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:drivers,email'],
            'password' => ['nullable', 'string', 'min:6'],
        ];
    }
}
```

### API Resources

Transformação de dados (snake_case → camelCase):

```php
class DriverResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'codigo' => $this->codigo,
            'nome' => $this->nome,
            'email' => $this->email,
            'status' => $this->status,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
```

## API Endpoints

### Autenticação

```
POST   /api/login
```

### Dashboard

```
GET    /api/dashboard/stats
```

### Motoristas

```
GET    /api/motoristas
GET    /api/motoristas/{id}
POST   /api/motoristas
PUT    /api/motoristas/{id}
DELETE /api/motoristas/{id}
```

### Veículos

```
GET    /api/vehicles
GET    /api/vehicles/available
GET    /api/vehicles/{id}
POST   /api/vehicles
PUT    /api/vehicles/{id}
DELETE /api/vehicles/{id}
```

### Missões

```
GET    /api/missions
GET    /api/missions/{id}
POST   /api/missions/start
POST   /api/missions/{id}/stop
```

### Financeiro

```
GET    /api/finance/summary
GET    /api/finance/transactions
POST   /api/finance/transactions
PUT    /api/finance/transactions/{id}
DELETE /api/finance/transactions/{id}
GET    /api/finance/budgets
GET    /api/finance/budgets/active
POST   /api/finance/budgets
PUT    /api/finance/budgets/{id}
DELETE /api/finance/budgets/{id}
```

### Usuários

```
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
GET    /api/users/me
PUT    /api/users/me
```

Todas as rotas (exceto `/api/login`) requerem autenticação via `auth:sanctum`.

## Autenticação

### Laravel Sanctum

Sistema usa tokens de API via Sanctum:

1. Usuário faz login com email e senha
2. Backend valida credenciais (User ou Driver)
3. Token Sanctum é gerado
4. Token é retornado ao frontend
5. Frontend envia token em requisições via header `Authorization: Bearer {token}`

### Tipos de Usuário

- **admin**: Usuário administrativo (tabela `users`)
- **driver**: Motorista (tabela `drivers` com email/senha)

### Middleware

Rotas protegidas usam `auth:sanctum`:

```php
Route::middleware('auth:sanctum')->group(function () {
    // Rotas protegidas
});
```

## Banco de Dados

### Migrations

Estrutura do banco:

- `users`: Usuários administrativos
- `drivers`: Motoristas
- `vehicles`: Veículos
- `missions`: Missões
- `financial_transactions`: Transações financeiras
- `budgets`: Orçamentos
- `personal_access_tokens`: Tokens Sanctum
- `cache`: Cache
- `jobs`: Filas

### Seeders

Seeders populam banco com dados de teste:

```bash
./vendor/bin/sail artisan db:seed
```

### Relacionamentos

- `Mission` belongsTo `Driver` e `Vehicle`
- `Driver` hasMany `Mission`
- `Vehicle` hasMany `Mission`

## Cache

Sistema usa Redis para cache:

- **Listagens**: 60 segundos
- **Detalhes**: 300 segundos
- **Dashboard**: 30 segundos
- **Orçamentos**: 300 segundos

Cache é invalidado automaticamente em operações Create, Update e Delete.

## Desenvolvimento

### Criando um Novo Controller

1. Criar controller em `app/Http/Controllers/Api/`:

```php
class NewController extends Controller
{
    public function __construct(
        private readonly NewService $newService
    ) {}
    
    public function index(): AnonymousResourceCollection
    {
        $items = $this->newService->getAll();
        return NewResource::collection($items);
    }
}
```

2. Criar Service em `app/Services/`:

```php
class NewService
{
    public function getAll(): Collection
    {
        return Cache::remember('new.all', 60, function () {
            return NewModel::all();
        });
    }
}
```

3. Criar FormRequest em `app/Http/Requests/`:

```php
class StoreNewRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
```

4. Criar Resource em `app/Http/Resources/`:

```php
class NewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
```

5. Adicionar rotas em `routes/api.php`:

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/new', [NewController::class, 'index']);
    Route::post('/new', [NewController::class, 'store']);
});
```

### Code Style

Projeto usa Laravel Pint:

```bash
./vendor/bin/sail pint
```

## Testes

Framework de testes: Pest

```bash
./vendor/bin/sail test
```

## Troubleshooting

### Erro de conexão com banco

- Verifique credenciais no `.env`
- Confirme que MySQL está rodando
- Teste conexão: `./vendor/bin/sail artisan tinker` e `DB::connection()->getPdo()`

### Erro de CORS

- Verifique `config/cors.php`
- Confirme `SANCTUM_STATEFUL_DOMAINS` no `.env`
- Verifique middleware `Cors` em `bootstrap/app.php`

### Cache não funciona

- Verifique conexão Redis: `./vendor/bin/sail redis-cli ping`
- Limpe cache: `./vendor/bin/sail artisan cache:clear`
- Confirme `CACHE_DRIVER=redis` no `.env`

### Migrations falham

- Verifique se banco existe
- Confirme credenciais
- Execute `migrate:fresh` se necessário (cuidado: apaga dados)

### Token não funciona

- Verifique se Sanctum está instalado
- Confirme `SANCTUM_STATEFUL_DOMAINS`
- Verifique se token está sendo enviado corretamente

### Logs

Ver logs em tempo real:

```bash
./vendor/bin/sail artisan tail
```

Ou arquivo:

```bash
tail -f storage/logs/laravel.log
```

## Dependências Principais

### Produção

- `laravel/framework`: Framework Laravel
- `laravel/sanctum`: Autenticação API

### Desenvolvimento

- `laravel/sail`: Ambiente Docker
- `laravel/pint`: Code style
- `pestphp/pest`: Framework de testes

## Licença

Este projeto é privado e proprietário.
