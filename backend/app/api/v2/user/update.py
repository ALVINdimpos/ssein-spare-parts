from app.api.v2 import Res, Roles
from fastapi import Depends, APIRouter, status, Body, Path, HTTPException
from app.api.v2.middlewares import get_current_user
from app.db.models import User
from app.db import get_db
from app.core.hash import get_hash_password
from pydantic import BaseModel, EmailStr, model_validator
from typing import Annotated, Optional
from sqlalchemy.orm import Session

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="User not found"
)

unauthorized = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Unauthorized to perform this action!"
)


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
async def update_profile(user: Annotated[User, Depends(get_current_user)], update: UpdateUser = Body(),
                         db: Session = Depends(get_db)) -> Res:
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


@router.patch("/{_id}", response_model=Res)
async def update_user(user: Annotated[User, Depends(get_current_user)],
                      _id: int = Path(..., description="Id of the user"),
                      name: str = Body(None, description="Updated name of the user"),
                      email: EmailStr = Body(None, description="updated email address"),
                      role: Roles = Body(None, description="Updated role of the user"),
                      password: str = Body(None, description="Updated password of the user"),
                      db: Session = Depends(get_db)) -> Res:
    if user.role not in ["superadmin", "admin"]:
        raise unauthorized

    updated_user = db.query(User).filter_by(id=_id).first()

    if not update_user:
        raise not_found

    if updated_user.role == 'superadmin':
        raise unauthorized

    if password is not None:
        updated_user.password = get_hash_password(password)
    if email is not None:
        updated_user.email = email
    if role is not None:
        updated_user.role = role.value
    if name is not None:
        updated_user.name = name

    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Profile updated successfully!",
        data={
            "user": {
                "name": updated_user.name,
                "email": updated_user.email,
                "role": updated_user.role
            }
        }
    )
    return res


@router.delete("/{_id}", response_model=Res)
def delete_user(user: Annotated[User, Depends(get_current_user)],
                _id: int = Path(description="Id of the user to delete"),
                db: Session = Depends(get_db)) -> Res:
    if user.role not in ["superadmin", "admin"]:
        raise unauthorized

    deleted_user = db.query(User).filter_by(id=_id).first()
    if not deleted_user:
        raise not_found
    if deleted_user.role == 'superadmin':
        raise unauthorized

    db.delete(deleted_user)
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="User deleted successfully!",
        data={
            "name": deleted_user.name,
            "email": deleted_user.email,
            "role": deleted_user.role
        }
    )

    return res
