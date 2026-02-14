from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class TaskCreate(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=200)
    descricao: Optional[str] = None
    status: str = Field(default="pendente", pattern="^(pendente|em_progresso|concluida)$")
    prioridade: str = Field(default="media", pattern="^(baixa|media|alta)$")
    data_vencimento: Optional[date] = None

class TaskUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=1, max_length=200)
    descricao: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(pendente|em_progresso|concluida)$")
    prioridade: Optional[str] = Field(None, pattern="^(baixa|media|alta)$")
    data_vencimento: Optional[date] = None

class TaskResponse(BaseModel):
    id: int
    user_id: int
    titulo: str
    descricao: Optional[str]
    status: str
    prioridade: str
    data_vencimento: Optional[date]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
