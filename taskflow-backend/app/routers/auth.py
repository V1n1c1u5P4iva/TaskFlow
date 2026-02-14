from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserUpdate
from app.schemas.auth import AuthResponse
from app.core.security import verify_password, get_password_hash, create_access_token
from app.routers.tasks import get_current_user
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_model=AuthResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
    print(f"[DEBUG] Tentativa de registro para email: {user.email}")
    
    # Verificar se email já existe
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        print(f"[DEBUG] Erro: Email {user.email} já cadastrado")
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Criar novo usuário
    hashed_password = get_password_hash(user.senha)
    new_user = User(
        nome=user.nome,
        idade=user.idade,
        email=user.email,
        senha_hash=hashed_password,
        genero=user.genero,
        ocupacao=user.ocupacao
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"[DEBUG] Usuário criado com sucesso: ID {new_user.id}")
    except Exception as e:
        print(f"[DEBUG] Erro ao salvar usuário no banco: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro interno do servidor")
    
    # Gerar token
    access_token = create_access_token(data={"sub": new_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=AuthResponse)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    print(f"[DEBUG] Tentativa de login para: {user_credentials.email}")
    
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user:
        print(f"[DEBUG] Falha login: Usuário não encontrado")
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    if not verify_password(user_credentials.senha, user.senha_hash):
        print(f"[DEBUG] Falha login: Senha incorreta para {user_credentials.email}")
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    print(f"[DEBUG] Login bem-sucedido para: {user.nome}")
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.put("/me", response_model=AuthResponse)
def update_profile(
    user_update: UserUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    print(f"[DEBUG] Atualizando perfil do usuário: {current_user.email}")
    
    # Se estiver tentando alterar email, verificar se já existe
    if user_update.email and user_update.email != current_user.email:
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email já está em uso")
    
    # Atualizar campos
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    try:
        db.commit()
        db.refresh(current_user)
        print(f"[DEBUG] Perfil atualizado com sucesso")
    except Exception as e:
        print(f"[DEBUG] Erro ao atualizar perfil: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao atualizar perfil")
        
    # Gerar novo token (opcional, mas bom se mudar email/dados críticos)
    access_token = create_access_token(data={"sub": current_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": current_user
    }
