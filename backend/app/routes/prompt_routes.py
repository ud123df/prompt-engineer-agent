from fastapi import APIRouter
from pydantic import BaseModel
from app.services.prompt_service import generate_prompt
from app.services.optimizer_service import optimizer_prompt
from app.services.evaluator_service import evaluate_prompt
from app.agents.workflow import app_workflow
from app.agents.workflow import app_workflow, save_prompt_history
from app.database.database import SessionLocal
from app.database.models import PromptHistory

router = APIRouter()

class PromptRequest(BaseModel):
    task: str

@router.post("/generate")
async def generate(data: PromptRequest):
    result = generate_prompt(data.task)
    return {"result": result}

@router.post("/optimize")
async def optimize(data: PromptRequest):

    result = optimizer_prompt(data.task)

    return {
        "optimized_prompt": result
    }
@router.post("/evaluate")
async def evaluate(data: PromptRequest):

    result = evaluate_prompt(data.task)

    return {
        "evaluation": result
    }

@router.post("/agent-workflow")
async def run_workflow(data: PromptRequest):

    result = app_workflow.invoke({
        "task": data.task
    })
    save_prompt_history(result)

    return result

@router.get("/history")
async def get_history():

    db = SessionLocal()

    history = db.query(PromptHistory).all()

    db.close()

    return history