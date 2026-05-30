from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from sqlalchemy import text
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "taskflow"}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    idade = Column(Integer, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    genero = Column(String(50), nullable=False)
    ocupacao = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relacionamento com tarefas
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
