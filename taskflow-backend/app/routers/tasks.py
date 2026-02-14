from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print(f"[DEBUG] get_current_user chamado com token: {token[:20] if token else 'NENHUM'}...")
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        print(f"[DEBUG] Token decodificado. Email: {email}")
        if email is None:
            print("[DEBUG] Email não encontrado no token")
            raise credentials_exception
    except JWTError as e:
        print(f"[DEBUG] Erro ao decodificar token: {e}")
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        print(f"[DEBUG] Usuário não encontrado no banco: {email}")
        raise credentials_exception
    
    print(f"[DEBUG] Autenticação bem-sucedida para: {user.nome}")
    return user

@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"[DEBUG] Criando tarefa para usuário {current_user.id}: {task.titulo}")
    
    new_task = Task(
        user_id=current_user.id,
        titulo=task.titulo,
        descricao=task.descricao,
        status=task.status,
        prioridade=task.prioridade,
        data_vencimento=task.data_vencimento
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    print(f"[DEBUG] Tarefa criada com ID: {new_task.id}")
    return new_task

@router.get("/", response_model=List[TaskResponse])
def read_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"[DEBUG] Buscando tarefas do usuário {current_user.id}")
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    print(f"[DEBUG] Encontradas {len(tasks)} tarefas")
    return tasks

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"[DEBUG] Atualizando tarefa {task_id}")
    
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not db_task:
        print(f"[DEBUG] Tarefa {task_id} não encontrada ou não pertence ao usuário")
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    update_data = task_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    print(f"[DEBUG] Tarefa {task_id} atualizada com sucesso")
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"[DEBUG] Deletando tarefa {task_id}")
    
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    db.delete(db_task)
    db.commit()
    print(f"[DEBUG] Tarefa {task_id} removida")
    return {"message": "Tarefa removida com sucesso"}

@router.get("/stats/overview")
def get_task_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"[DEBUG] Gerando estatísticas para usuário {current_user.id}")
    
    # Total de tarefas
    total_tasks = db.query(Task).filter(Task.user_id == current_user.id).count()
    
    # Tarefas por status
    status_counts = db.query(Task.status, func.count(Task.id)).filter(
        Task.user_id == current_user.id
    ).group_by(Task.status).all()
    
    # Tarefas por prioridade
    priority_counts = db.query(Task.prioridade, func.count(Task.id)).filter(
        Task.user_id == current_user.id
    ).group_by(Task.prioridade).all()
    
    return {
        "total": total_tasks,
        "by_status": {status: count for status, count in status_counts},
        "by_priority": {priority: count for priority, count in priority_counts}
    }
