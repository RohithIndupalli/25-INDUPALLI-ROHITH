"""User model."""
from datetime import datetime
from typing import Optional, List, Annotated, Union
from pydantic import BaseModel, EmailStr, Field, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema
from bson import ObjectId

def validate_object_id(v: Union[str, ObjectId]) -> ObjectId:
    """Validate and convert to ObjectId."""
    if isinstance(v, ObjectId):
        return v
    if isinstance(v, str):
        if ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId string")
    raise ValueError("Must be a string or ObjectId")

def get_object_id_schema(
    _source_type: type[ObjectId], handler: GetJsonSchemaHandler
) -> JsonSchemaValue:
    """Generate JSON schema for ObjectId."""
    return {"type": "string", "format": "objectid"}

PyObjectId = Annotated[
    ObjectId,
    core_schema.no_info_plain_validator_function(validate_object_id),
    core_schema.json_schema(get_object_id_schema),
]

class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    name: str
    timezone: str = "UTC"
    study_preferences: dict = Field(default_factory=dict)  # preferred study times, etc.

class UserCreate(UserBase):
    """User creation model."""
    password: str

class UserUpdate(BaseModel):
    """User update model."""
    name: Optional[str] = None
    timezone: Optional[str] = None
    study_preferences: Optional[dict] = None

class User(UserBase):
    """User model."""
    id: PyObjectId = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }

