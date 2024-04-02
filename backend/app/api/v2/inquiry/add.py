from app.api.v2 import Res, InquiryTypes
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, Body, status, HTTPException
from app.db import get_db
from app.db.models import Inquiry, Part
from pydantic import EmailStr

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Part not found"
)


@router.post("/", response_model=Res)
async def send_inquiry(db: Session = Depends(get_db),
                       email: EmailStr = Body(None),
                       name: str = Body(None),
                       phone: str = Body(None),
                       message: str = Body(None),
                       context: InquiryTypes = Body(None),
                       product_id: int = Body(None)) -> Res:
    if product_id is not None or context == InquiryTypes.PRODUCT:
        product = db.query(Part).filter_by(id=product_id).first()
        if not product:
            raise not_found
    new_inquiry = Inquiry(
        email=email,
        name=name,
        phone=phone,
        message=message,
        context=context.value,
        product_id=product_id
    )

    db.add(new_inquiry)
    db.commit()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Inquiry was sent successfully!",
        data={}
    )

    return res
