# Guia Completo - Backend TaskFlow AI com FastAPI

## 📊 Estrutura Completa do Banco de Dados

### Tabela: `users`

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | ID único do usuário |
| `nome` | VARCHAR(100) | NOT NULL | Nome completo do usuário |
| `idade` | INTEGER | NOT NULL, CHECK (idade >= 13 AND idade <= 120) | Idade do usuário |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | Email (usado para login) |
| `senha_hash` | VARCHAR(255) | NOT NULL | Senha hasheada com bcrypt |
| `genero` | VARCHAR(50) | NOT NULL | Valores: masculino, feminino, outro, prefiro-nao-dizer |
| `ocupacao` | VARCHAR(50) | NOT NULL | Valores: estudante, trabalhador, ambos, outro |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Data de atualização |

### Tabela: `tasks`

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | ID único da tarefa |
| `user_id` | INTEGER | FOREIGN KEY (users.id), NOT NULL, INDEX | ID do usuário dono da tarefa |
| `titulo` | VARCHAR(200) | NOT NULL | Título da tarefa |
| `descricao` | TEXT | NULL | Descrição detalhada |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'pendente' | Valores: pendente, em_progresso, concluida |
| `prioridade` | VARCHAR(20) | NOT NULL, DEFAULT 'media' | Valores: baixa, media, alta |
| `data_vencimento` | DATE | NULL | Data de vencimento |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Data de atualização |

### Relacionamentos

- **users → tasks**: Um usuário pode ter várias tarefas (1:N)
- **Chave estrangeira**: `tasks.user_id` → `users.id`
- **Cascade**: Quando um usuário é deletado, suas tarefas também são deletadas

### SQL para criar as tabelas:

```sql
-- Tabela de usuários
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    idade INTEGER NOT NULL CHECK (idade >= 13 AND idade <= 120),
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    genero VARCHAR(50) NOT NULL CHECK (genero IN ('masculino', 'feminino', 'outro', 'prefiro-nao-dizer')),
    ocupacao VARCHAR(50) NOT NULL CHECK (ocupacao IN ('estudante', 'trabalhador', 'ambos', 'outro')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Tabela de tarefas
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_progresso', 'concluida')),
    prioridade VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
    data_vencimento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

## 🏗️ Estrutura de Arquivos

```
backend/
├── main.py
├── models.py
├── database.py
├── requirements.txt
└── routes/
    ├── __init__.py
    ├── auth.py
    └── tasks.py
```

## 📝 Código dos Arquivos

Ver guia completo em: `C:\Users\paiva\.gemini\antigravity\brain\b3cd44e0-acaa-447d-98e1-90eafa3de5f2\backend_guide.md`

## 🚀 Como Executar

```bash
# 1. Criar ambiente virtual
python -m venv venv

# 2. Ativar (Windows)
venv\Scripts\activate

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Executar
python main.py
```

Servidor: `http://localhost:8000`
Docs: `http://localhost:8000/docs`

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Cadastrar
- `POST /api/auth/login` - Login
- `GET /api/auth/profile?token={token}` - Perfil

### Tasks (CRUD)
- `POST /api/tasks?token={token}` - Criar tarefa
- `GET /api/tasks?token={token}` - Listar tarefas
- `GET /api/tasks/{id}?token={token}` - Obter tarefa
- `PUT /api/tasks/{id}?token={token}` - Atualizar tarefa
- `DELETE /api/tasks/{id}?token={token}` - Deletar tarefa

## 🔒 Segurança

- Hash de senhas com Bcrypt
- Autenticação JWT
- Validação Pydantic
- CORS configurado
- Usuário só acessa suas próprias tarefas
