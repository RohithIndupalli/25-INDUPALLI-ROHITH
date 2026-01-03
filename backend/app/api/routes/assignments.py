"""Assignment API routes."""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from app.models.assignment import Assignment, AssignmentCreate, AssignmentUpdate
from app.database.connection import get_database
from bson import ObjectId

router = APIRouter(prefix="/assignments", tags=["assignments"])

@router.post("/", response_model=Assignment)
async def create_assignment(assignment: AssignmentCreate):
    """Create a new assignment."""
    db = get_database()
    assignment_dict = assignment.model_dump()
    assignment_dict["_id"] = ObjectId()
    assignment_dict["created_at"] = datetime.utcnow()
    assignment_dict["updated_at"] = datetime.utcnow()
    assignment_dict["suggested_study_times"] = []
    assignment_dict["reminders_sent"] = []
    
    result = await db.assignments.insert_one(assignment_dict)
    assignment_dict["_id"] = result.inserted_id
    return Assignment(**assignment_dict)

@router.get("/user/{user_id}", response_model=List[Assignment])
async def get_user_assignments(user_id: str, status: str = None):
    """Get all assignments for a user."""
    db = get_database()
    query = {"user_id": user_id}
    if status:
        query["status"] = status
    
    cursor = db.assignments.find(query).sort("due_date", 1)
    assignments = await cursor.to_list(length=100)
    return [Assignment(**a) for a in assignments]

@router.get("/{assignment_id}", response_model=Assignment)
async def get_assignment(assignment_id: str):
    """Get an assignment by ID."""
    db = get_database()
    assignment = await db.assignments.find_one({"_id": ObjectId(assignment_id)})
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return Assignment(**assignment)

@router.put("/{assignment_id}", response_model=Assignment)
async def update_assignment(assignment_id: str, assignment: AssignmentUpdate):
    """Update an assignment."""
    db = get_database()
    update_data = {k: v for k, v in assignment.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.assignments.find_one_and_update(
        {"_id": ObjectId(assignment_id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return Assignment(**result)

@router.delete("/{assignment_id}")
async def delete_assignment(assignment_id: str):
    """Delete an assignment."""
    db = get_database()
    result = await db.assignments.delete_one({"_id": ObjectId(assignment_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"message": "Assignment deleted successfully"}

