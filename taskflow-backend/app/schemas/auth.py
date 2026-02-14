from pydantic import BaseModel
from .user import UserResponse

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
