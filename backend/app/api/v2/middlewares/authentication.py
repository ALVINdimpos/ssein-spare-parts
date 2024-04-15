from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.db import get_db
from app.db.models import User
from typing import Annotated
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='users/login')

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

unauthorized_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Forbidden to access this resource"
)


class TokenData(BaseModel):
    email: EmailStr | None = None


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter_by(email=token_data.email).first()
    if user is None:
        raise credentials_exception

    return user


async def get_internal_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter_by(email=token_data.email).first()
    if user is None:
        raise credentials_exception

    if user.role not in ['admin', 'superadmin', 'agent', 'client']:
        raise unauthorized_exception

    return user
