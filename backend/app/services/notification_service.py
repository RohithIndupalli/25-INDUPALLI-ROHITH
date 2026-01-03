"""Notification service."""
from datetime import datetime, timedelta
from typing import List
from app.database.connection import get_database
from app.models.assignment import Assignment

class NotificationService:
    """Service for sending notifications and reminders."""
    
    @staticmethod
    async def send_reminder(user_id: str, assignment_id: str, message: str) -> bool:
        """Send a reminder notification."""
        # In production, integrate with email, SMS, or push notification services
        print(f"Sending reminder to user {user_id} for assignment {assignment_id}: {message}")
        return True
    
    @staticmethod
    async def check_and_send_upcoming_deadlines(user_id: str, hours_ahead: int = 24) -> List[dict]:
        """Check for upcoming deadlines and send reminders."""
        db = get_database()
        cutoff_time = datetime.utcnow() + timedelta(hours=hours_ahead)
        
        assignments = await db.assignments.find({
            "user_id": user_id,
            "due_date": {"$lte": cutoff_time, "$gte": datetime.utcnow()},
            "status": {"$ne": "completed"}
        }).to_list(length=100)
        
        reminders_sent = []
        for assignment in assignments:
            assignment_obj = Assignment(**assignment)
            # Check if reminder already sent
            recent_reminders = [
                r for r in assignment_obj.reminders_sent 
                if (datetime.utcnow() - r).total_seconds() < 3600 * hours_ahead
            ]
            
            if not recent_reminders:
                message = f"Reminder: {assignment_obj.title} is due on {assignment_obj.due_date}"
                await NotificationService.send_reminder(user_id, str(assignment_obj.id), message)
                
                # Mark reminder as sent
                await db.assignments.update_one(
                    {"_id": assignment_obj.id},
                    {"$push": {"reminders_sent": datetime.utcnow()}}
                )
                
                reminders_sent.append({
                    "assignment_id": str(assignment_obj.id),
                    "title": assignment_obj.title,
                    "due_date": assignment_obj.due_date
                })
        
        return reminders_sent

