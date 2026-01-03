"""Automated task execution scripts."""
import asyncio
from datetime import datetime, timedelta
from app.database.connection import connect_to_mongo, close_mongo_connection, get_database
from app.services.notification_service import NotificationService
from app.agents.langgraph_agent import agent

async def check_all_users_deadlines():
    """Check deadlines for all users and send reminders."""
    await connect_to_mongo()
    db = get_database()
    
    # Get all active users
    users_cursor = db.users.find({})
    users = await users_cursor.to_list(length=1000)
    
    for user in users:
        user_id = str(user["_id"])
        try:
            reminders = await NotificationService.check_and_send_upcoming_deadlines(
                user_id, hours_ahead=24
            )
            print(f"Sent {len(reminders)} reminders to user {user_id}")
        except Exception as e:
            print(f"Error processing user {user_id}: {e}")
    
    await close_mongo_connection()

async def run_daily_planning():
    """Run daily study planning for all users."""
    await connect_to_mongo()
    db = get_database()
    
    users_cursor = db.users.find({})
    users = await users_cursor.to_list(length=1000)
    
    for user in users:
        user_id = str(user["_id"])
        try:
            result = await agent.run(user_id)
            print(f"Generated study plan for user {user_id}: {len(result.get('suggestions', []))} suggestions")
        except Exception as e:
            print(f"Error generating plan for user {user_id}: {e}")
    
    await close_mongo_connection()

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        task = sys.argv[1]
        if task == "deadlines":
            asyncio.run(check_all_users_deadlines())
        elif task == "planning":
            asyncio.run(run_daily_planning())
        else:
            print("Usage: python task_executor.py [deadlines|planning]")
    else:
        print("Usage: python task_executor.py [deadlines|planning]")

