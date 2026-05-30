# TaskFlow AI 🚀

Gerenciador de tarefas inteligente com IA integrada (Google Gemini), autenticação JWT, dashboard interativo e análise de produtividade.

---

## Estrutura do Projeto

```
TaskFlow/
├── taskflow-ai/          # Frontend — Next.js 16 + TypeScript + Tailwind
└── taskflow-backend/     # Backend  — FastAPI + PostgreSQL + SQLAlchemy
```

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 18+ |
| Python | 3.10+ |
| PostgreSQL | 14+ |
| npm / yarn | qualquer recente |

---

## Configuração rápida

### 1. Clone o repositório

```bash
git clone <url-do-repo>
cd TaskFlow
```

---

### 2. Backend (FastAPI)

#### 2.1 Instalar dependências

```bash
cd taskflow-backend

# Criar e ativar virtualenv
python3 -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

#### 2.2 Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
SECRET_KEY=gere-com-openssl-rand-hex-32
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DATABASE=taskflow_db
FRONTEND_URL=http://localhost:3000
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=sua_chave_gemini   # obtenha em aistudio.google.com
```

> **Gerar SECRET_KEY segura:**
> ```bash
> openssl rand -hex 32
> ```

#### 2.3 Criar banco de dados PostgreSQL

```bash
# Conecte ao PostgreSQL
psql -U postgres

# Crie o banco
CREATE DATABASE taskflow_db;
\q
```

> O schema `taskflow` e as tabelas são criados automaticamente na primeira inicialização da API.
>
> Opcionalmente, você pode executar manualmente:
> ```bash
> psql -U postgres -d taskflow_db -f create_database.sql
> ```

#### 2.4 Iniciar o backend

```bash
cd taskflow-backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API disponível em: `http://localhost:8000`
Documentação Swagger: `http://localhost:8000/docs`

---

### 3. Frontend (Next.js)

#### 3.1 Instalar dependências

```bash
cd taskflow-ai
npm install
```

#### 3.2 Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Conteúdo do `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 3.3 Iniciar o frontend

```bash
npm run dev
```

App disponível em: `http://localhost:3000`

---

## Endpoints da API

### Autenticação (`/api/auth`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Cadastrar novo usuário |
| `POST` | `/api/auth/login` | Fazer login, retorna JWT |
| `GET` | `/api/auth/me` | Retorna perfil do usuário logado |
| `PUT` | `/api/auth/me` | Atualiza perfil do usuário logado |

### Tarefas (`/api/tasks`) — requer token Bearer

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/tasks/` | Listar todas as tarefas do usuário |
| `POST` | `/api/tasks/` | Criar nova tarefa |
| `PUT` | `/api/tasks/{id}` | Atualizar tarefa |
| `DELETE` | `/api/tasks/{id}` | Excluir tarefa |
| `GET` | `/api/tasks/stats/overview` | Estatísticas das tarefas |

### IA (`/api/ai`) — requer token Bearer

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/ai/generate` | Gerar conteúdo com Google Gemini |

---

## Funcionalidades

- **Autenticação completa** — cadastro, login, logout, JWT com expiração
- **Gerenciamento de tarefas** — criar, editar, excluir, filtrar por status e prioridade
- **Dashboard inteligente** — visão geral com sugestão de IA sobre qual tarefa priorizar
- **Fluxo IA** — a IA organiza automaticamente a ordem de execução das suas tarefas
- **Insights IA** — análise de produtividade com gráficos (pizza e barras)
- **Calendário** — visualização de tarefas por data de vencimento
- **Configurações** — editar perfil, preferências de idioma (PT/ES/EN), tema
- **Tema claro/escuro** — persistido via localStorage
- **Internacionalização** — PT, ES e EN

---

## Validações importantes

### Campos do cadastro

| Campo | Valores aceitos |
|---|---|
| `genero` | `masculino`, `feminino`, `outro`, `prefiro-nao-dizer` |
| `ocupacao` | `estudante`, `trabalhador`, `ambos`, `outro` |
| `status` da tarefa | `pendente`, `em_progresso`, `concluida` |
| `prioridade` da tarefa | `baixa`, `media`, `alta` |

---

## Estrutura do banco de dados

```sql
-- Schema: taskflow
-- Tabela: taskflow.users
-- Tabela: taskflow.tasks (FK -> users.id)
```

O banco usa o schema `taskflow` para isolar os dados da aplicação. As tabelas e o schema são criados automaticamente ao iniciar a API.

---

## Stack tecnológica

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Recharts (gráficos)
- Lucide React (ícones)

**Backend**
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL + psycopg2
- Pydantic v2
- python-jose (JWT)
- passlib + bcrypt (senhas)
- Google Generative AI (Gemini 2.0 Flash)

---

## Variáveis de ambiente resumidas

### Backend (`taskflow-backend/.env`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `SECRET_KEY` | ✅ | Chave JWT — use `openssl rand -hex 32` |
| `POSTGRES_HOST` | ✅ | Host do PostgreSQL |
| `POSTGRES_PORT` | ✅ | Porta (padrão: 5432) |
| `POSTGRES_USER` | ✅ | Usuário do banco |
| `POSTGRES_PASSWORD` | ✅ | Senha do banco |
| `POSTGRES_DATABASE` | ✅ | Nome do banco |
| `FRONTEND_URL` | ✅ | URL do frontend (CORS) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ | Padrão: 30 |
| `GEMINI_API_KEY` | ❌ | Necessário para funcionalidades de IA |

### Frontend (`taskflow-ai/.env.local`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | URL base da API (ex: `http://localhost:8000`) |

---

## Troubleshooting

**Backend não conecta ao PostgreSQL**
- Verifique se o PostgreSQL está rodando: `pg_isready`
- Confirme as credenciais no `.env`
- O banco `taskflow_db` precisa existir antes de iniciar a API

**Funcionalidades de IA não funcionam**
- Certifique-se de ter configurado `GEMINI_API_KEY` no `.env` do backend
- Obtenha uma chave gratuita em: https://aistudio.google.com/app/apikey

**CORS error no frontend**
- Confirme que `FRONTEND_URL=http://localhost:3000` está no `.env` do backend
- Reinicie o backend após alterar o `.env`

**Token expirado / redirecionamento para login**
- Aumente `ACCESS_TOKEN_EXPIRE_MINUTES` no `.env` do backend
