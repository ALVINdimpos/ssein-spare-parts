from app.api.v2 import Roles, Res
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_current_user
from fastapi import Depends, APIRouter, HTTPException, status
from typing import Annotated
from app.db import get_db
from app.db.models import User

router = APIRouter()

unauthorized_user = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Unauthorized to perfom this action"
)


def make_user(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
    }


@router.get("/", response_model=Res)
async def get_all_users(user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)) -> Res:
    if user.role not in (Roles.ADMIN.value, 'superadmin'):
        raise unauthorized_user

    users = db.query(User).filter_by().all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Users retrieved successfully!",
        data={
            "users": [make_user(u) for u in users]
        }
    )

    return res
