from datetime import datetime, UTC
from app.api.v2 import Res, ActionTypes, make_reminder, ReminderStatus, RecurrenceTypes
from fastapi import Depends, APIRouter, status, Body, Path, HTTPException
from app.api.v2.middlewares import get_internal_user
from .add import all_users_legit
from app.db.models import Reminder, Action, User, Acknowledgement
from app.db import get_db
from pydantic import BaseModel, model_validator, Field
from typing import Annotated, List, Optional
from sqlalchemy.orm import Session

router = APIRouter()

bad_request = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="All/Some of the users were not found!"
)

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Reminder not found!"
)

no_permission = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You do not have permission to perform this action."
)


class UpdateReminder(BaseModel):
    assignees: Optional[List[int]] = Field(None, description="List of assignee IDs. Note: Submitted ids will replace the existing ones.")
    title: Optional[str] = Field(None, description="Title of the reminder")
    description: Optional[str] = Field(None, description="Detailed description of the reminder")
    start_date: Optional[datetime] = Field(None, description="Start date of the reminder")
    due_date: Optional[datetime] = Field(None, description="Due date of the reminder")
    priority: Optional[int] = Field(None, description="Priority level of the reminder")
    recurring: Optional[bool] = Field(None, description="Whether the reminder is recurring")
    recurrence_type: Optional[RecurrenceTypes] = Field(None, description="Type of recurrence (e.g., daily, weekly, monthly, or annually)")
    recurrence_end: Optional[datetime] = Field(None, description="End date for the recurrence")
    status: Optional[ReminderStatus] = Field(None, description="Current status of the reminder (active or inactive)")

    @model_validator(mode='before')
    def not_none_validator(cls, values: dict) -> dict:
        keys = set(values.keys())
        attributes = (
            'assignees',
            'title',
            'description',
            'start_date',
            'due_date',
            'priority',
            'recurring',
            'recurrence_type',
            'recurrence_end',
            'status',
        )
        intersection = keys.intersection(attributes)
        if not intersection:
            raise ValueError('At least one field must be provided for an update.')
        return values

@router.patch("/{reminder_id}", response_model=Res)
async def update_reminder(
        user: Annotated[User, Depends(get_internal_user)],
        update: UpdateReminder = Body(),
        reminder_id: int = Path(title="Reminder ID", description="The id of the reminder to be updated"),
        db: Session = Depends(get_db)) -> Res:


    reminder = db.query(Reminder).filter_by(id=reminder_id).first()
    if not reminder:
        raise not_found

    if reminder not in user.created_reminders:
        raise no_permission

    if update.assignees:
        validation = all_users_legit(update.assignees, db)
        if not validation[0]:
            raise bad_request

        for usr in validation[1]:
            reminder.assignees = []
            reminder.assignees.append(usr)

    if update.title:
        reminder.title = update.title
    if update.description:
        reminder.description = update.description
    if update.start_date:
        reminder.start_date = update.start_date
    if update.due_date:
        reminder.due_date = update.due_date
    if update.priority:
        reminder.priority = update.priority
    if update.recurrence_type:
        reminder.recurrence_type = update.recurrence_type.value
    if update.recurrence_end:
        reminder.recurrence_end = update.recurrence_end
    if update.status:
        reminder.status = update.status.value

    action = Action(
        reminder_id=reminder.id,
        user_id=user.id,
        action_type=ActionTypes.UPDATE.value
    )
    reminder.actions.append(action)
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Reminder updated successfully!",
        data={
            "reminder": make_reminder(reminder)
        }
    )
    return res


already_acknowledged = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Already acknowledged!"
)

@router.patch("/acknowledge/{reminder_id}", response_model=Res)
async def acknowledge_reminder(
        user: Annotated[User, Depends(get_internal_user)],
        reminder_id: int = Path(title="Reminder ID", description="The id of the reminder to be acknowledged"),
        db: Session = Depends(get_db)) -> Res:
    reminder = db.query(Reminder).filter_by(id=reminder_id).first()
    if not reminder:
        raise not_found

    user_acknowledgement = db.query(Acknowledgement).filter_by(reminder_id=reminder.id, assignee_id=user.id).first()
    if user_acknowledgement:
        raise already_acknowledged

    if reminder not in user.assigned_reminders:
        raise no_permission

    acknowledgement = Acknowledgement()
    acknowledgement.reminder = reminder
    acknowledgement.acknowledged_at = datetime.now(UTC)
    acknowledgement.assignee = user

    db.add(acknowledgement)
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Reminder acknowledged successfully!",
        data={"reminder": make_reminder(reminder)}
    )

    return res