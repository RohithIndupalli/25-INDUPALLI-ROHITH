"""Course management service."""
from datetime import datetime
from typing import List, Optional
from app.database.connection import get_database
from app.models.course import Course, CourseCreate, CourseUpdate
from bson import ObjectId

class CourseService:
    """Service for course operations."""
    
    @staticmethod
    async def create_course(course_data: CourseCreate) -> Course:
        """Create a new course."""
        db = get_database()
        course_dict = course_data.model_dump()
        course_dict["_id"] = ObjectId()
        
        result = await db.courses.insert_one(course_dict)
        course_dict["_id"] = result.inserted_id
        return Course(**course_dict)
    
    @staticmethod
    async def get_user_courses(user_id: str) -> List[Course]:
        """Get all courses for a user."""
        db = get_database()
        cursor = db.courses.find({"user_id": user_id})
        courses = await cursor.to_list(length=100)
        return [Course(**course) for course in courses]
    
    @staticmethod
    async def get_course(course_id: str) -> Optional[Course]:
        """Get a course by ID."""
        db = get_database()
        course = await db.courses.find_one({"_id": ObjectId(course_id)})
        return Course(**course) if course else None
    
    @staticmethod
    async def update_course(course_id: str, course_data: CourseUpdate) -> Optional[Course]:
        """Update a course."""
        db = get_database()
        update_data = {k: v for k, v in course_data.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.courses.find_one_and_update(
            {"_id": ObjectId(course_id)},
            {"$set": update_data},
            return_document=True
        )
        return Course(**result) if result else None
    
    @staticmethod
    async def delete_course(course_id: str) -> bool:
        """Delete a course."""
        db = get_database()
        result = await db.courses.delete_one({"_id": ObjectId(course_id)})
        return result.deleted_count > 0

