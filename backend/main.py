from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.llm_service import get_llm_service
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Business Analyst AI Agent", version="0.1.0")

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 512
    temperature: float = 0.7

class RequirementsRequest(BaseModel):
    user_input: str

class ProcessRequest(BaseModel):
    process_description: str

@app.get("/")
async def root():
    return {"message": "Business Analyst AI Agent API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/generate")
async def generate_text(request: GenerateRequest):
    try:
        service = get_llm_service()
        response = service.generate_response(
            prompt=request.prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/requirements")
async def generate_requirements(request: RequirementsRequest):
    try:
        service = get_llm_service()
        prompt = f"""Ты - бизнес-аналитик в ForteBank. Заинтересованная сторона описала запрос на функционал. 
Твоя задача - формализовать это в хорошо структурированные User Stories в формате:
"Как [role], я хочу [goal], чтобы [benefit]."

Также включи:
- Критерии приемки (3-5 пунктов)
- Приоритет (Высокий/Средний/Низкий)
- Оценка сложности (Простой/Средний/Сложный)

Запрос на функционал: {request.user_input}

Ответ должен быть на русском языке. Предоставь 2-3 user stories на основе этого запроса."""
        
        response = service.generate_response(
            prompt=prompt,
            max_tokens=1024,
            temperature=0.4
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process")
async def generate_process_analysis(request: ProcessRequest):
    try:
        service = get_llm_service()
        prompt = f"""Ты - старший аналитик бизнес-процессов в ForteBank. 
Проанализируй следующий банковский процесс и предоставь:

1. **Краткое описание процесса**: Краткий обзор
2. **Ключевые этапы**: Перечисли основные этапы (5-7 этапов)
3. **Проблемные места**: Определи 3-4 потенциальных узких места или проблем
4. **Рекомендации по лучшим практикам**: Предложи 3-4 отраслевые лучшие практики для улучшения этого процесса
5. **Описание BPMN**: Опиши, как это будет выглядеть в диаграмме BPMN (событие начала, задачи, шлюзы, событие завершения)

Описание процесса: {request.process_description}

Ответ должен быть на русском языке. Форматируй ответ в markdown с четкими заголовками."""
        
        response = service.generate_response(
            prompt=prompt,
            max_tokens=1536,
            temperature=0.5
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
