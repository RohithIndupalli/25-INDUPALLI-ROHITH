"""Assignment model."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from bson import ObjectId
from app.models.user import PyObjectId

class AssignmentBase(BaseModel):
    """Base assignment model."""
    title: str
    description: Optional[str] = None
    course_id: str
    due_date: datetime
    priority: int = Field(default=3, ge=1, le=5)  # 1-5 scale
    estimated_hours: float = Field(default=2.0, ge=0)
    status: str = Field(default="pending")  # pending, in_progress, completed
    category: Optional[str] = None  # homework, exam, project, etc.

class AssignmentCreate(AssignmentBase):
    """Assignment creation model."""
    user_id: str

class AssignmentUpdate(BaseModel):
    """Assignment update model."""
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[int] = Field(None, ge=1, le=5)
    estimated_hours: Optional[float] = Field(None, ge=0)
    status: Optional[str] = None
    category: Optional[str] = None

class Assignment(AssignmentBase):
    """Assignment model."""
    id: PyObjectId = Field(alias="_id")
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    suggested_study_times: List[datetime] = Field(default_factory=list)
    reminders_sent: List[datetime] = Field(default_factory=list)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }

