"""Calendar integration service."""
from datetime import datetime, timedelta
from typing import List, Optional
from app.database.connection import get_database
from app.models.calendar import CalendarEvent, CalendarEventCreate
from bson import ObjectId

class CalendarService:
    """Service for calendar operations."""
    
    @staticmethod
    async def create_event(event_data: CalendarEventCreate) -> CalendarEvent:
        """Create a new calendar event."""
        db = get_database()
        event_dict = event_data.model_dump()
        event_dict["_id"] = ObjectId()
        event_dict["created_at"] = datetime.utcnow()
        event_dict["updated_at"] = datetime.utcnow()
        
        result = await db.calendar_events.insert_one(event_dict)
        event_dict["_id"] = result.inserted_id
        return CalendarEvent(**event_dict)
    
    @staticmethod
    async def get_user_events(user_id: str, start_date: Optional[datetime] = None, 
                              end_date: Optional[datetime] = None) -> List[CalendarEvent]:
        """Get events for a user within a date range."""
        db = get_database()
        query = {"user_id": user_id}
        
        if start_date or end_date:
            query["start_time"] = {}
            if start_date:
                query["start_time"]["$gte"] = start_date
            if end_date:
                query["start_time"]["$lte"] = end_date
        
        cursor = db.calendar_events.find(query).sort("start_time", 1)
        events = await cursor.to_list(length=1000)
        return [CalendarEvent(**event) for event in events]
    
    @staticmethod
    async def get_free_time_slots(user_id: str, start_date: datetime, 
                                  end_date: datetime, duration_hours: float) -> List[dict]:
        """Find free time slots for study sessions."""
        events = await CalendarService.get_user_events(user_id, start_date, end_date)
        
        # Sort events by start time
        events.sort(key=lambda x: x.start_time)
        
        free_slots = []
        current = start_date
        
        for event in events:
            if current < event.start_time:
                slot_duration = (event.start_time - current).total_seconds() / 3600
                if slot_duration >= duration_hours:
                    free_slots.append({
                        "start": current,
                        "end": event.start_time,
                        "duration_hours": slot_duration
                    })
            current = max(current, event.end_time)
        
        # Check for free time after last event
        if current < end_date:
            slot_duration = (end_date - current).total_seconds() / 3600
            if slot_duration >= duration_hours:
                free_slots.append({
                    "start": current,
                    "end": end_date,
                    "duration_hours": slot_duration
                })
        
        return free_slots
    
    @staticmethod
    async def sync_google_calendar(user_id: str, access_token: str) -> List[CalendarEvent]:
        """Sync events from Google Calendar."""
        # Placeholder for Google Calendar API integration
        # In production, use google-auth and google-api-python-client
        print(f"Syncing Google Calendar for user {user_id}")
        return []

