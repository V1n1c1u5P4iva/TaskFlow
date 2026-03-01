from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from google import genai
from app.core.config import settings

router = APIRouter()

client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

class AIRequest(BaseModel):
    prompt: str

@router.post("/generate")
async def generate_content(request: AIRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Serviço de IA não configurado")
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=request.prompt
        )
        return {"response": response.text}
    except Exception as e:
        print(f"Erro ao gerar conteúdo com IA: {e}")
        raise HTTPException(status_code=500, detail=str(e))
