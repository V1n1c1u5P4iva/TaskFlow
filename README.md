# TaskFlow AI - Projeto Completo

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Execução-orange)

**TaskFlow AI** é uma solução completa de gerenciamento de tarefas impulsionada por inteligência artificial. Este projeto integra uma interface moderna e responsiva com uma API robusta para oferecer a melhor experiência de produtividade.

> 🚧 **Atenção:** Este projeto ainda está **em execução** e desenvolvimento contínuo. Algumas funcionalidades podem estar incompletas ou sujeitas a alterações.

## 📂 Estrutura do Projeto

O sistema é composto por dois módulos principais:

- **[Frontend (taskflow-ai)](./taskflow-ai)**: A interface do usuário, construída com **Next.js 16**, **React 19** e **Tailwind CSS 4**. Oferece dashboards interativos, autenticação de usuários e gerenciamento visual de tarefas.
- **[Backend (taskflow-backend)](./taskflow-backend)**: A API do sistema, desenvolvida em **Python** com **FastAPI**. Gerencia a lógica de negócios, banco de dados **MySQL**, autenticação **JWT** e integração com IA.

## 🚀 Tecnologias

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** Tailwind CSS 4, Lucide React
- **Estado:** Jotai
- **Visualização:** Recharts

### Backend
- **Framework:** FastAPI
- **Banco de Dados:** MySQL
- **ORM:** SQLAlchemy
- **Segurança:** Pydantic, OAuth2/JWT

## 🛠️ Guia de Instalação Rápida

Para rodar o sistema completo localmente, você precisará de dois terminais: um para o backend e outro para o frontend.

### Pré-requisitos
- Node.js (v18+)
- Python (v3.8+)
- MySQL Server rodando

### 1. Iniciando o Backend

```bash
# Entre na pasta do backend
cd taskflow-backend

# Crie e ative o ambiente virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure o banco de dados e .env (consulte taskflow-backend/README.md)

# Execute o servidor
python main.py
```
O servidor API iniciará em `http://localhost:8000`.

### 2. Iniciando o Frontend

```bash
# Entre na pasta do frontend
cd taskflow-ai

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
Acesse a aplicação em `http://localhost:3000`.

## 🤝 Contribuição

Contribuições são bem-vindas! Consulte os READMEs individuais de cada módulo para mais detalhes técnicos.

## 📄 Licença

BSD 3-Clause License
