from app.api.v2 import Res, ActionTypes
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, status, HTTPException, Path
from app.db import get_db
from app.api.v2.middlewares.authentication import get_current_user
from app.db.models import Product, CarProduct, User, Action
from typing import Annotated
from enum import Enum

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Product not found"
)


class Scopes(Enum):
    PRODUCT = "product"
    CAR_PRODUCT = "car_product"


@router.post("/{product_id}", response_model=Res)
async def declare_intent(user: Annotated[User, Depends(get_current_user)],
                         scope: Scopes,
                         product_id: int = Path(description='Product ID of interest'),
                         db: Session = Depends(get_db)) -> Res:
    entity = db.query(Product if scope == Scopes.PRODUCT.value else CarProduct).filter_by(id=product_id).first()

    if not entity:
        raise not_found

    if scope == Scopes.PRODUCT:
        action = Action(
            product_id=entity.id,
            user_id=user.id,
            action_type=ActionTypes.INTENT.value
        )
    else:
        action = Action(
            car_id=entity.id,
            user_id=user.id,
            action_type=ActionTypes.INTENT.value
        )

    entity.actions.append(action)
    db.commit()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Intent declared successfully!",
        data={}
    )

    return res
