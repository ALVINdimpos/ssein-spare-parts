from app.api.v2 import Res
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, Path, status, HTTPException
from app.db import get_db
from app.api.v2.middlewares import get_current_user
from typing import Annotated
from app.db.models import Inquiry, User

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Inquiry not found"
)


@router.delete("/{inquiry_id}", response_model=Res, dependencies=[Depends(get_current_user)])
async def delete_inquiry(db: Session = Depends(get_db),
                         inquiry_id: int = Path()) -> Res:
    inquiry = db.query(Inquiry).filter_by(id=inquiry_id).first()
    if not inquiry:
        raise not_found
    db.delete(inquiry)
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Inquiry was deleted successfully!",
        data={}
    )

    return res
