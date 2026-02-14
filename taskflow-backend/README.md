# TaskFlow AI - Backend API

API backend para o sistema TaskFlow AI, desenvolvida com FastAPI e MySQL.

## 🚀 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **MySQL** - Banco de dados relacional
- **SQLAlchemy** - ORM Python
- **Pydantic** - Validação de dados
- **JWT** - Autenticação via tokens
- **Bcrypt** - Hash de senhas

## 📁 Estrutura do Projeto

```
backend/
├── main.py              # Aplicação principal FastAPI
├── models.py           # Modelos Pydantic (validação)
├── database.py         # Configuração do MySQL e modelos SQLAlchemy
├── requirements.txt    # Dependências Python
├── .env               # Variáveis de ambiente (NÃO commitar)
├── .env.example       # Exemplo de configuração
└── routes/
    ├── __init__.py    # Pacote Python
    ├── auth.py        # Rotas de autenticação
    └── tasks.py       # Rotas CRUD de tarefas
```

## ⚙️ Configuração

### 1. Criar banco de dados MySQL

```sql
CREATE DATABASE taskflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
SECRET_KEY=sua-chave-secreta-aqui
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha_mysql
MYSQL_DATABASE=taskflow_db
FRONTEND_URL=http://localhost:3000
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Criar ambiente virtual

```bash
python -m venv venv
```

### 4. Ativar ambiente virtual

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 5. Instalar dependências

```bash
pip install -r requirements.txt
```

### 6. Executar servidor

```bash
python main.py
```

O servidor estará disponível em:
- **API**: http://localhost:8000
- **Documentação Swagger**: http://localhost:8000/docs
- **Documentação ReDoc**: http://localhost:8000/redoc

## 📡 Endpoints Principais

### Autenticação

- `POST /api/auth/register` - Cadastrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile?token={token}` - Obter perfil do usuário

### Tarefas (CRUD)

- `POST /api/tasks?token={token}` - Criar tarefa
- `GET /api/tasks?token={token}` - Listar tarefas
- `GET /api/tasks/{id}?token={token}` - Obter tarefa específica
- `PUT /api/tasks/{id}?token={token}` - Atualizar tarefa
- `DELETE /api/tasks/{id}?token={token}` - Deletar tarefa

## 🔒 Segurança

- ✅ Hash de senhas com Bcrypt
- ✅ Autenticação JWT
- ✅ Validação de dados com Pydantic
- ✅ CORS configurado
- ✅ Isolamento de dados por usuário
- ✅ Cascade delete para integridade

## 📊 Modelos de Dados

### Usuário

```python
{
  "nome": "João Silva",
  "idade": 25,
  "email": "joao@example.com",
  "senha": "senha123",
  "genero": "masculino",
  "ocupacao": "estudante"
}
```

### Tarefa

```python
{
  "titulo": "Estudar FastAPI",
  "descricao": "Aprender sobre rotas e autenticação",
  "status": "pendente",  # pendente, em_progresso, concluida
  "prioridade": "alta",  # baixa, media, alta
  "data_vencimento": "2025-12-31"
}
```

## 🧪 Testando a API

Acesse http://localhost:8000/docs para testar os endpoints interativamente através do Swagger UI.

## 📝 Notas

- As tabelas são criadas automaticamente na primeira execução
- O token JWT expira em 30 minutos (configurável)
- Usuários só podem acessar suas próprias tarefas
- Ao deletar um usuário, todas as suas tarefas são deletadas (CASCADE)
