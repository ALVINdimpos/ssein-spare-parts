from app.api.v2 import Res, ActionTypes, ReminderModel, make_reminder, send_email, get_priority_label
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_internal_user
from fastapi import Depends, APIRouter, Body, status, HTTPException
from typing import Annotated
from app.db.models import Reminder, User, Action
from app.db import get_db

router = APIRouter()


bad_request = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="All/Some of the users were not found!"
)


def generate_new_assignment_message(reminder):
    message = f"""
    New Reminder Assigned

    Title: {reminder.title}
    Description: {reminder.description or "No description provided."}
    Assigned by: {reminder.assignor.name}
    Start Date: {reminder.start_date.strftime('%Y-%m-%d %H:%M:%S')}
    Due Date: {reminder.due_date.strftime('%Y-%m-%d %H:%M:%S')}
    Priority: {get_priority_label(reminder.priority).capitalize()}

    You have been assigned a new reminder. Please review the details and ensure timely completion.

    This is an automated notification. Please do not reply to this email.
    """
    return message

def all_users_legit(user_ids: [int],db: Session = Depends(get_db))->list:
    if not user_ids:
        return [False, []]

    users = db.query(User).filter(User.id.in_(user_ids)).all()
    return [True, users] if len(users) == len(user_ids) else [False, []]

@router.post("/", response_model=Res)
async def create_reminder(
        user: Annotated[User, Depends(get_internal_user)],
        reminder: Annotated[ReminderModel, Body()],
        db: Session = Depends(get_db)) -> Res:
    validation = all_users_legit(reminder.assignees, db)
    if not validation[0]:
        raise bad_request

    if user.role not in ['admin', 'superadmin'] and len(validation[1]) != 1 and validation[1][0] != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action."
        )

    reminder = Reminder(
        title=reminder.title,
        description=reminder.description,
        start_date=reminder.start_date,
        due_date=reminder.due_date,
        priority=reminder.priority,
        recurring=reminder.recurring,
        recurrence_type=reminder.recurrence_type.value,
        recurrence_end=reminder.recurrence_end,
        status=reminder.status.value,
    )

    action = Action(
        reminder_id=reminder.id,
        user_id=user.id,
        action_type=ActionTypes.CREATE.value
    )
    reminder.actions.append(action)
    emails = []
    for usr in validation[1]:
        reminder.assignees.append(usr)
        emails.append(usr.email)

    reminder.assignor = user
    db.add(reminder)
    db.commit()

    _ = send_email(
        subject=f"New Reminder Assigned: {reminder.title}",
        text=generate_new_assignment_message(reminder),
        to=emails,
    )

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Reminder created successfully!",
        data={
            "reminder": make_reminder(reminder)
        }
    )

    return res
