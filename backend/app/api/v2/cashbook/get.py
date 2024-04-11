from app.api.v2 import Res, make_cashbook
import datetime
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, status, HTTPException
from app.api.v2.middlewares.authentication import get_internal_user
from app.db import get_db
from app.db.models import CashBook, User
from typing import Annotated
from sqlalchemy import func

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Entry not found!"
)


@router.get("/cashflow", response_model=Res)
async def get_cashflow(user: Annotated[User, Depends(get_internal_user)],
                       db: Session = Depends(get_db)) -> Res:
    if user.role not in ['admin', 'superadmin']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='You do not have permission to access this resource')

    cashflow = db.query(CashBook).all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Cashflow data retrieved successfully!",
        data={
            "cashflow": [make_cashbook(entry) for entry in cashflow]
        }
    )

    return res


@router.get("/agent/cashflow", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_cashflow(db: Session = Depends(get_db)) -> Res:
    cashflow = db.query(CashBook).filter(
        func.DATE(CashBook.created_at) == datetime.date.today()
    ).all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Cashflow data retrieved successfully!",
        data={
            "cashflow": [make_cashbook(entry) for entry in cashflow]
        }
    )

    return res