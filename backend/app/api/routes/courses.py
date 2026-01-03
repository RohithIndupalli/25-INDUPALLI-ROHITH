"""Course API routes."""
from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from app.models.course import Course, CourseCreate, CourseUpdate
from app.services.course_service import CourseService
from bson import ObjectId

router = APIRouter(prefix="/courses", tags=["courses"])

@router.post("/", response_model=Course)
async def create_course(course: CourseCreate):
    """Create a new course."""
    return await CourseService.create_course(course)

@router.get("/user/{user_id}", response_model=List[Course])
async def get_user_courses(user_id: str):
    """Get all courses for a user."""
    return await CourseService.get_user_courses(user_id)

@router.get("/{course_id}", response_model=Course)
async def get_course(course_id: str):
    """Get a course by ID."""
    course = await CourseService.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.put("/{course_id}", response_model=Course)
async def update_course(course_id: str, course: CourseUpdate):
    """Update a course."""
    updated_course = await CourseService.update_course(course_id, course)
    if not updated_course:
        raise HTTPException(status_code=404, detail="Course not found")
    return updated_course

@router.delete("/{course_id}")
async def delete_course(course_id: str):
    """Delete a course."""
    success = await CourseService.delete_course(course_id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}

