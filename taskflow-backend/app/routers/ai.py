from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from app.core.config import settings

router = APIRouter()

# Configuração do Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    print("[WARNING] GEMINI_API_KEY não encontrada no .env")

class AIRequest(BaseModel):
    prompt: str

@router.post("/generate")
async def generate_content(request: AIRequest):
    print(f"[DEBUG] Recebendo requisição AI: {request.prompt[:50]}...")
    
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Serviço de IA não configurado")
    
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(request.prompt)
        print("[DEBUG] Resposta da IA gerada com sucesso")
        return {"response": response.text}
    except Exception as e:
        print(f"[DEBUG] Erro na geração de IA: {e}")
        raise HTTPException(status_code=500, detail=str(e))
