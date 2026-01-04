"""Agent API routes."""
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Union
from bson import ObjectId
from app.agents.langgraph_agent import agent
from app.database.connection import get_database
from fastapi.encoders import jsonable_encoder

router = APIRouter(prefix="/agent", tags=["agent"])

async def get_user(user_id: str):
    """Verify user exists and return user data."""
    db = await get_database()
    try:
        # Try to find user by ID
        user = await db.users.find_one({"$or": [
            {"_id": ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id},
            {"user_id": user_id}
        ]})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid user ID: {str(e)}")

@router.post("/plan/{user_id}")
async def run_study_planning(user_id: str) -> Dict[str, Any]:
    """Run the study planning agent for a user."""
    try:
        # Verify user exists
        user = await get_user(user_id)
        
        # Run the agent with the user's ID from the database
        result = await agent.run(str(user["_id"]))
        
        # Ensure all ObjectIds are converted to strings
        def convert_objectids(obj):
            if isinstance(obj, dict):
                return {k: str(v) if isinstance(v, ObjectId) else convert_objectids(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [str(i) if isinstance(i, ObjectId) else convert_objectids(i) for i in obj]
            return obj
            
        return jsonable_encoder(convert_objectids(result))
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Agent error: {error_details}")
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

