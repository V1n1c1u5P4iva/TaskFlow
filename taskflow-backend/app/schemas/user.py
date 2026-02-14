from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    idade: int = Field(..., ge=13, le=120)
    email: EmailStr
    senha: str = Field(..., min_length=8)
    genero: str = Field(..., pattern="^(masculino|feminino|outro|prefiro-nao-dizer)$")
    ocupacao: str = Field(..., pattern="^(estudante|trabalhador|ambos|outro)$")

class UserLogin(BaseModel):
    email: EmailStr
    senha: str

class UserResponse(BaseModel):
    id: int
    nome: str
    email: str
    idade: int
    genero: str
    ocupacao: str

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    nome: str | None = Field(None, min_length=2, max_length=100)
    idade: int | None = Field(None, ge=13, le=120)
    email: EmailStr | None = None
    genero: str | None = Field(None, pattern="^(masculino|feminino|outro|prefiro-nao-dizer)$")
    ocupacao: str | None = Field(None, pattern="^(estudante|trabalhador|ambos|outro)$")

