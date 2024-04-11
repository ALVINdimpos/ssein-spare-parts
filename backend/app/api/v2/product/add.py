from app.api.v2 import Res, ProductModel, make_product, ActionTypes
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_internal_user
from fastapi import Depends, APIRouter, Body, status
from typing import Annotated
from app.db.models import Product, User, Action
from app.db import get_db
from app.api.v2 import generate_short_unique_id

router = APIRouter()


@router.post("/", response_model=Res)
async def create_product(
        user: Annotated[User, Depends(get_internal_user)],
        product: Annotated[ProductModel, Body()],
        db: Session = Depends(get_db)) -> Res:
    product.num = generate_short_unique_id()
    product = Product(**product.dict())
    action = Action(
        product_id=product.id,
        user_id=user.id,
        action_type=ActionTypes.CREATE.value
    )
    product.actions.append(action)
    db.add(product)
    db.commit()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Product created successfully!",
        data={
            "product": make_product(product).dict()
        }
    )

    return res
