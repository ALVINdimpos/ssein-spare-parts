from app.api.v2 import Res
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, status
from app.db import get_db
from typing import Annotated
from app.api.v2.middlewares import get_current_user
from app.db.models import Inquiry, User

router = APIRouter()


def make_inquiry(inquiry: Inquiry):
    return {
        "id": inquiry.id,
        "name": inquiry.name,
        "email": inquiry.email,
        "phone": inquiry.phone,
        "message": inquiry.message,
        "created_at": inquiry.created_at,
        "context": inquiry.context,
        "read": inquiry.read,
        "product_id": inquiry.product_id,
    }


@router.get("/", response_model=Res, dependencies=[Depends(get_current_user)])
async def get_inquiries(db: Session = Depends(get_db)) -> Res:
    inquiries = db.query(Inquiry).all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Inquiry marked as read successfully!",
        data={
            "inquiries": [make_inquiry(i) for i in inquiries],
        }
    )

    return res
