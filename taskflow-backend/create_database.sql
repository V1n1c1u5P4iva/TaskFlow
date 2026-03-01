-- 1. CRIAR O ESQUEMA (Pense nisso como uma pasta privada para o seu app)
CREATE SCHEMA IF NOT EXISTS taskflow;

-- 2. DEFINIR O CAMINHO DE BUSCA
-- Isso diz ao Postgres: "Primeiro procure as tabelas dentro de 'taskflow'"
SET search_path TO taskflow, public;

-- 3. CRIAR TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade INT NOT NULL CHECK (idade >= 13 AND idade <= 120),
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    genero VARCHAR(50) NOT NULL CHECK (genero IN ('masculino', 'feminino', 'outro', 'prefiro-nao-dizer')),
    ocupacao VARCHAR(50) NOT NULL CHECK (ocupacao IN ('estudante', 'trabalhador', 'ambos', 'outro')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CRIAR TABELA DE TAREFAS
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_progresso', 'concluida')),
    prioridade VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
    data_vencimento DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- 6. AUTOMAÇÃO DO 'updated_at' (O toque de mestre do Postgres)
-- Criamos uma função reutilizável
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicamos a trigger nas duas tabelas
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_tasks
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 7. VERIFICAÇÃO FINAL
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'taskflow';