from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import api_router
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, UTC
from sqlalchemy.orm import Session
from sqlalchemy import cast, Date
from fastapi import Depends
from app.db import get_db
from app.db.models.dashboard import User, Reminder
from app.api.v2 import send_email, generate_reminder_message

origins = [
    "http://localhost",
    "http://localhost:8080",
    "*"
]


scheduler = BackgroundScheduler()


def notify_users_routine(db: Session = Depends(get_db)):
    now = datetime.now(UTC).date()
    tomorrow = now + timedelta(days=1)
    reminders = db.query(Reminder).filter(
        cast(Reminder.due_date, Date).between(now, tomorrow)
    ).all()

    for reminder in reminders:
        emails = []
        for user in reminder.assignees:
            emails.append(user.email)
        email_content = generate_reminder_message(reminder)
        _ = send_email(
            subject=f"Reminder Due Tomorrow: {reminder.title}",
            text=email_content,
            to=emails,
        )


def start_scheduler():
    scheduler.add_job(notify_users_routine, 'cron', hour=8)  # Runs every day at 8 AM
    scheduler.start()

def stop_scheduler():
    scheduler.shutdown()

@asynccontextmanager
async def lifespan(application: FastAPI):
    start_scheduler()
    yield
    stop_scheduler()

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PATCH", "PUT"],
    allow_headers=["*"],
)
app.include_router(api_router)
