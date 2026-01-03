"""Calendar event model."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from app.models.user import PyObjectId

class CalendarEventBase(BaseModel):
    """Base calendar event model."""
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    event_type: str  # class, study, personal, exam, etc.
    location: Optional[str] = None
    source: str = "manual"  # manual, course_sync, agent_suggestion

class CalendarEventCreate(CalendarEventBase):
    """Calendar event creation model."""
    user_id: str

class CalendarEventUpdate(BaseModel):
    """Calendar event update model."""
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    event_type: Optional[str] = None
    location: Optional[str] = None

class CalendarEvent(CalendarEventBase):
    """Calendar event model."""
    id: PyObjectId = Field(alias="_id")
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    external_id: Optional[str] = None  # For Google Calendar sync

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }

