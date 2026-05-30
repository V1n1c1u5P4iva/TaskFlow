from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, tasks, ai
from app.core.config import settings
import uvicorn

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para gerenciamento de tarefas com IA - PostgreSQL Backend (Modular)",
    version=settings.PROJECT_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração CORS
allowed_origins = [settings.FRONTEND_URL] if settings.FRONTEND_URL else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rotas
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Inicializar banco de dados ao iniciar a aplicação"""
    print("🚀 Iniciando TaskFlow AI API (Modular)...")
    try:
        from app.models import user, task
        from app.core.database import engine, Base
        from sqlalchemy import text
        
        # Garante que o schema taskflow existe
        with engine.connect() as conn:
            conn.execute(text("CREATE SCHEMA IF NOT EXISTS taskflow"))
            conn.commit()
        
        Base.metadata.create_all(bind=engine)
        print("✅ Banco de dados PostgreSQL iniciado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao iniciar banco de dados: {e}")
        print("⚠️  Verifique se o PostgreSQL está rodando e as credenciais em .env estão corretas")
    yield

@app.get("/")
def read_root():
    return {
        "message": "TaskFlow AI API - Running with PostgreSQL (Modular Structure)",
        "version": settings.PROJECT_VERSION,
        "docs": "/docs",
        "database": "PostgreSQL"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "PostgreSQL"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
