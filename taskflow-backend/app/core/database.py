from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings
from typing import cast

database_url = settings.DATABASE_URL
if not database_url:
    raise ValueError("DATABASE_URL precisa estar definido antes de criar o engine.")

engine = create_engine(
    cast(str, database_url),
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
    connect_args={"options": "-csearch_path=taskflow"},
)

print(f"Conectando ao banco de dados em: {settings.DATABASE_URL}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
