"""Course model."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from bson import ObjectId
from app.models.user import PyObjectId

class CourseBase(BaseModel):
    """Base course model."""
    name: str
    code: str
    credits: int
    instructor: Optional[str] = None
    schedule: dict = Field(default_factory=dict)  # days, times, location
    semester: str

class CourseCreate(CourseBase):
    """Course creation model."""
    user_id: str

class CourseUpdate(BaseModel):
    """Course update model."""
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None
    instructor: Optional[str] = None
    schedule: Optional[dict] = None
    semester: Optional[str] = None

class Course(CourseBase):
    """Course model."""
    id: PyObjectId = Field(alias="_id")
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }

