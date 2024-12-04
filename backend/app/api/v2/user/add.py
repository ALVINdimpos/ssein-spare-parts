from app.api.v2 import Roles, Res, User as UserModel, send_email
from sqlalchemy.orm import Session
from app.core.hash import get_hash_password
from app.api.v2.middlewares import get_current_user
from fastapi import Depends, APIRouter, Body, HTTPException, status
from typing import Annotated
from app.db import get_db
from app.db.models import User

router = APIRouter()

user_exists = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="User with email already exists"
)

unauthorized_user = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Unauthorized to perfom this action"
)


@router.post("/", response_model=Res)
async def create_user(r_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db),
                      user: UserModel = Body()) -> Res:
    if r_user.role not in (Roles.ADMIN.value, 'superadmin'):
        raise unauthorized_user
    check = db.query(User).filter_by(email=user.email).first()
    if check:
        raise user_exists
    new_user = User(
        email=user.email,
        password=get_hash_password(user.password),
        name=user.name,
        role=user.role.value,
    )
    db.add(new_user)
    db.commit()
    text = f'''Dear {user.name},

Your account on sseinspareparts.com has been created!

To login into sseinspareparts.com, use the following credentials:
- email: {user.email}
- password: {user.password}

You are advised to change your password after the first login.

Regards,

Ssein Group
'''
    to = [user.email]
    subject = 'Your account has been created!'

    send_email(subject, text, to)

    res = Res(
        status=status.HTTP_201_CREATED,
        message="User created successfully!",
        data={
            "user": {
                "email": user.email,
                "name": user.name,
                "role": user.role.value,
            }
        }
    )

    return res
