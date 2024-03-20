from app.api.v2 import Res
from fastapi import Depends, APIRouter, status, Body
from app.api.v2.middlewares import get_current_user
from app.db.models import User
from app.db import get_db
from app.core.hash import get_hash_password
from pydantic import BaseModel, EmailStr, model_validator
from typing import Annotated, Optional
from sqlalchemy.orm import Session

router = APIRouter()


class UpdateUser(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    @model_validator(mode='before')
    def not_none_validator(cls, values: dict) -> dict:
        keys = set(values.keys())
        attributes = ('name', 'email', 'password')
        intersection = keys.intersection(attributes)
        if not len(intersection):
            raise ValueError('All fields can not be empty')
        return values


@router.get("/me", response_model=Res)
async def get_profile(user: Annotated[User, Depends(get_current_user)]) -> Res:
    res = Res(
        status=status.HTTP_200_OK,
        message="Profile retrieved successfully!",
        data={
            "user": {
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }
    )

    return res


@router.post("/me", response_model=Res)
async def update_profile(user: Annotated[User, Depends(get_current_user)], update: UpdateUser = Body(), db: Session = Depends(get_db)) -> Res:
    if update.name:
        user.name = update.name
    if update.email:
        user.email = update.email
    if update.password:
        user.password = get_hash_password(update.password)
    db.commit()
    res = Res(
        status=status.HTTP_200_OK,
        message="Profile updated successfully!",
        data={
            "user": {
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }
    )
    return res
