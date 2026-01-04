"""Chat API routes."""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.config import settings
import httpx

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatMessage(BaseModel):
    """Chat message model."""
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    """Chat request model."""
    messages: List[ChatMessage]
    user_id: str = None

class ChatResponse(BaseModel):
    """Chat response model."""
    message: str
    model: str

async def call_huggingface_api_direct(prompt: str) -> str:
    """Call Hugging Face Inference API directly."""
    url = f"https://api-inference.huggingface.co/models/{settings.HUGGINGFACE_MODEL}"
    headers = {
        "Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.7,
            "return_full_text": False,
            "do_sample": True
        }
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
            
            # Handle 410 Gone error - model endpoint no longer available
            if response.status_code == 410:
                raise HTTPException(
                    status_code=503,
                    detail=f"The model '{settings.HUGGINGFACE_MODEL}' is no longer available at this endpoint. Please update HUGGINGFACE_MODEL in your environment variables to use a different model (e.g., 'mistralai/Mistral-7B-Instruct-v0.2' or 'google/flan-t5-large')."
                )
            
            response.raise_for_status()
            result = response.json()
            
            # Handle different response formats from Hugging Face API
            if isinstance(result, list) and len(result) > 0:
                # Response format: [{"generated_text": "..."}]
                if isinstance(result[0], dict):
                    if "generated_text" in result[0]:
                        generated_text = result[0]["generated_text"]
                        # Remove the prompt from the beginning if it's included
                        if generated_text.startswith(prompt):
                            generated_text = generated_text[len(prompt):].strip()
                        return generated_text
            elif isinstance(result, dict):
                # Response format: {"generated_text": "..."}
                if "generated_text" in result:
                    generated_text = result["generated_text"]
                    if generated_text.startswith(prompt):
                        generated_text = generated_text[len(prompt):].strip()
                    return generated_text
                # Try to get text from other possible keys
                for key in ["text", "output", "response"]:
                    if key in result:
                        return str(result[key])
            
            # Fallback: convert result to string
            return str(result)
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 503:
                # Model is loading, wait and retry once
                import asyncio
                await asyncio.sleep(5)
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                result = response.json()
                if isinstance(result, list) and len(result) > 0 and isinstance(result[0], dict):
                    if "generated_text" in result[0]:
                        return result[0]["generated_text"]
            elif e.response.status_code == 410:
                raise HTTPException(
                    status_code=503,
                    detail=f"The model '{settings.HUGGINGFACE_MODEL}' is no longer available. Please update HUGGINGFACE_MODEL to use a different model."
                )
            raise

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a chat message and get a response."""
    if not settings.HUGGINGFACE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Chat service is not available. Please configure HUGGINGFACE_API_KEY in your environment variables."
        )
    
    try:
        # Format messages into a prompt
        # Convert conversation history to a prompt format
        prompt_parts = []
        
        # Add system message context
        prompt_parts.append("You are a helpful study planning assistant for students. You help with time management, study tips, and academic planning.")
        
        # Add conversation history (last 5 messages for context)
        for msg in request.messages[-5:]:
            if msg.role == "user":
                prompt_parts.append(f"User: {msg.content}")
            elif msg.role == "assistant":
                prompt_parts.append(f"Assistant: {msg.content}")
        
        # Ensure the prompt ends with "Assistant:" for the model to generate a response
        prompt = "\n\n".join(prompt_parts)
        if not prompt.endswith("Assistant:"):
            prompt += "\n\nAssistant:"
        
        # Always use direct API for chat (more reliable)
        response_text = await call_huggingface_api_direct(prompt)
        
        # Clean up the response
        if "Assistant:" in response_text:
            response_text = response_text.split("Assistant:")[-1].strip()
        # Remove any remaining prompt parts
        response_text = response_text.split("User:")[0].strip()
        # Remove any leading/trailing whitespace
        response_text = response_text.strip()
        
        return ChatResponse(
            message=response_text,
            model=settings.HUGGINGFACE_MODEL
        )
        
    except HTTPException:
        # Re-raise HTTPExceptions directly (they're already properly formatted)
        raise
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error generating chat response: {str(e)}"
        )

@router.get("/health")
async def chat_health():
    """Check chat service health."""
    return {
        "status": "healthy" if settings.HUGGINGFACE_API_KEY else "unavailable",
        "llm_available": bool(settings.HUGGINGFACE_API_KEY),
        "model": settings.HUGGINGFACE_MODEL if settings.HUGGINGFACE_API_KEY else None,
        "api_key_set": bool(settings.HUGGINGFACE_API_KEY),
        "using_direct_api": True
    }
