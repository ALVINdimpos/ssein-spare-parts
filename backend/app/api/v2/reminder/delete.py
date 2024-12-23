from app.api.v2 import Res, make_reminder
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_internal_user
from fastapi import Depends, APIRouter, Path, HTTPException, status
from app.db.models import User, Reminder
from typing import Annotated
from app.db import get_db

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Reminder not found!"
)

@router.delete("/{reminder_id}", response_model=Res)
async def delete_reminder(
        user: Annotated[User, Depends(get_internal_user)],
        reminder_id: int = Path(title="Reminder ID", description="The id of the reminder to be deleted"),
        db: Session = Depends(get_db)) -> Res:
    reminder = db.query(Reminder).filter_by(id=reminder_id).first()

    if not reminder:
        raise not_found
    if reminder.assignor_id != user.id and user.role not in ['admin, superadmin']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You do not have permission to perform this action."
        )

    db.delete(reminder)
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Reminder deleted successfully!",
        data={
            "reminder": make_reminder(reminder)
        }
    )

    return res
