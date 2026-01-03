"""Agent API routes."""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.agents.langgraph_agent import agent

router = APIRouter(prefix="/agent", tags=["agent"])

@router.post("/plan/{user_id}")
async def run_study_planning(user_id: str) -> Dict[str, Any]:
    """Run the study planning agent for a user."""
    try:
        result = await agent.run(user_id)
        return result
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Agent error: {error_details}")  # Log full error
        raise HTTPException(
            status_code=500, 
            detail=f"Error running agent: {str(e)}. Check backend logs for details."
        )

@router.get("/health")
async def health_check():
    """Check agent health."""
    from app.config import settings
    return {
        "status": "healthy",
        "agent_type": "StudyPlannerAgent",
        "llm_available": agent.llm is not None,
        "huggingface_api_key_set": bool(settings.HUGGINGFACE_API_KEY),
        "huggingface_model": settings.HUGGINGFACE_MODEL,
        "note": "Agent works without Hugging Face API key but with limited AI features"
    }

