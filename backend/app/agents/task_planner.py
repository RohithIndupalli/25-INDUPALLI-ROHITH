"""Task planning logic for the agent."""
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models.assignment import Assignment
from app.models.calendar import CalendarEvent
from app.services.calendar_service import CalendarService

class TaskPlanner:
    """Planner for optimizing study schedules."""
    
    @staticmethod
    def calculate_priority_score(assignment: Assignment, current_time: datetime) -> float:
        """Calculate priority score for an assignment (higher = more urgent)."""
        days_until_due = (assignment.due_date - current_time).days
        
        # Base score from priority (1-5)
        priority_score = assignment.priority
        
        # Urgency factor (increases as deadline approaches)
        if days_until_due <= 0:
            urgency = 10.0  # Overdue
        elif days_until_due <= 1:
            urgency = 8.0  # Due tomorrow
        elif days_until_due <= 3:
            urgency = 5.0  # Due in 3 days
        elif days_until_due <= 7:
            urgency = 3.0  # Due in a week
        else:
            urgency = 1.0  # More than a week away
        
        # Estimated hours factor (longer assignments need more planning)
        hours_factor = min(assignment.estimated_hours / 10.0, 2.0)
        
        total_score = priority_score * urgency * (1 + hours_factor)
        return total_score
    
    @staticmethod
    async def prioritize_assignments(user_id: str, assignments: List[Assignment]) -> List[Assignment]:
        """Sort assignments by priority score."""
        current_time = datetime.utcnow()
        
        # Calculate scores and sort
        assignments_with_scores = [
            (assignment, TaskPlanner.calculate_priority_score(assignment, current_time))
            for assignment in assignments
        ]
        assignments_with_scores.sort(key=lambda x: x[1], reverse=True)
        
        return [assignment for assignment, score in assignments_with_scores]
    
    @staticmethod
    async def suggest_study_times(user_id: str, assignment: Assignment, 
                                  preferred_hours: List[int] = None) -> List[datetime]:
        """Suggest optimal study times for an assignment."""
        if preferred_hours is None:
            preferred_hours = [9, 10, 14, 15, 16, 17]  # Default preferred hours
        
        current_time = datetime.utcnow()
        due_date = assignment.due_date
        
        # Get free time slots
        free_slots = await CalendarService.get_free_time_slots(
            user_id, current_time, due_date, assignment.estimated_hours
        )
        
        suggested_times = []
        remaining_hours = assignment.estimated_hours
        
        for slot in free_slots:
            if remaining_hours <= 0:
                break
            
            # Prefer slots that align with preferred hours
            slot_hour = slot["start"].hour
            if slot_hour in preferred_hours or slot["duration_hours"] >= assignment.estimated_hours:
                # Suggest using this slot
                study_time = slot["start"]
                suggested_times.append(study_time)
                
                # Calculate how much time we've allocated
                allocated_hours = min(slot["duration_hours"], remaining_hours)
                remaining_hours -= allocated_hours
        
        return suggested_times[:5]  # Return top 5 suggestions
    
    @staticmethod
    def generate_study_plan(user_id: str, assignments: List[Assignment]) -> Dict[str, Any]:
        """Generate a comprehensive study plan."""
        current_time = datetime.utcnow()
        
        # Categorize assignments
        overdue = [a for a in assignments if a.due_date < current_time and a.status != "completed"]
        urgent = [a for a in assignments if 0 <= (a.due_date - current_time).days <= 3]
        upcoming = [a for a in assignments if 3 < (a.due_date - current_time).days <= 7]
        future = [a for a in assignments if (a.due_date - current_time).days > 7]
        
        total_hours_needed = sum(a.estimated_hours for a in assignments if a.status != "completed")
        
        recommendations = [
            "Focus on overdue assignments first" if overdue else None,
            "Break down large assignments into smaller tasks" if any(a.estimated_hours > 5 for a in assignments) else None,
            "Schedule study sessions during your preferred hours"
        ]
        
        return {
            "overdue_count": len(overdue),
            "urgent_count": len(urgent),
            "upcoming_count": len(upcoming),
            "future_count": len(future),
            "total_hours_needed": total_hours_needed,
            "recommendations": [r for r in recommendations if r is not None]
        }

