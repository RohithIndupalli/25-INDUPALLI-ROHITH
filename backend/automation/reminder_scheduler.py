"""Scheduler for automated reminders using APScheduler."""
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from automation.task_executor import check_all_users_deadlines, run_daily_planning

def setup_scheduler():
    """Setup and start the reminder scheduler."""
    scheduler = AsyncIOScheduler()
    
    # Check deadlines every hour
    scheduler.add_job(
        check_all_users_deadlines,
        trigger=CronTrigger(minute=0),  # Run at the start of each hour
        id="check_deadlines",
        name="Check deadlines and send reminders",
        replace_existing=True
    )
    
    # Run daily planning every morning at 8 AM
    scheduler.add_job(
        run_daily_planning,
        trigger=CronTrigger(hour=8, minute=0),
        id="daily_planning",
        name="Run daily study planning",
        replace_existing=True
    )
    
    return scheduler

async def main():
    """Main function to run the scheduler."""
    scheduler = setup_scheduler()
    scheduler.start()
    
    print("Reminder scheduler started")
    print("- Checking deadlines every hour")
    print("- Running daily planning at 8:00 AM")
    
    try:
        # Keep the scheduler running
        while True:
            await asyncio.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        print("Scheduler stopped")

if __name__ == "__main__":
    asyncio.run(main())

