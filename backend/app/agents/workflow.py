from langgraph.graph import StateGraph, END

from app.agents.intent_agent import intent_agent
from app.agents.structure_agent import structure_agent
from app.agents.optimization_agent import optimization_agent
from app.agents.evaluation_agent import evaluation_agent
from app.database.database import SessionLocal
from app.database.models import PromptHistory

workflow = StateGraph(dict)

workflow.add_node("intent", intent_agent)
workflow.add_node("structure", structure_agent)
workflow.add_node("optimize", optimization_agent)
workflow.add_node("evaluate", evaluation_agent)

workflow.set_entry_point("intent")

workflow.add_edge("intent", "structure")
workflow.add_edge("structure", "optimize")
workflow.add_edge("optimize", "evaluate")
workflow.add_edge("evaluate", END)

app_workflow = workflow.compile()

def save_prompt_history(result):

    db = SessionLocal()

    history = PromptHistory(
        original_task=result.get("task"),
        generated_prompt=result.get("structured_prompt"),
        optimized_prompt=result.get("optimized_prompt"),
        evaluation=result.get("evaluation")
    )

    db.add(history)

    db.commit()

    db.close()