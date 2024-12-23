from app.api.v2 import Res, make_reminder
from fastapi import Depends, APIRouter, status, HTTPException
from app.api.v2.middlewares.authentication import get_internal_user
from app.db.models import User
from typing import Annotated

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Reminder not found!"
)


@router.get("/assigned", response_model=Res)
async def get_assigned_reminders(user: Annotated[User, Depends(get_internal_user)]) -> Res:
    res = Res(
        status=status.HTTP_200_OK,
        message="Reminders retrieved successfully!",
        data={
            "reminders": [make_reminder(reminder) for reminder in user.assigned_reminders]
        }
    )

    return res


@router.get("/created", response_model=Res)
async def get_created_reminders(user: Annotated[User, Depends(get_internal_user)]) -> Res:
    res = Res(
        status=status.HTTP_200_OK,
        message="Reminders retrieved successfully!",
        data={
            "reminders": [make_reminder(reminder) for reminder in user.created_reminders]
        }
    )

    return res
