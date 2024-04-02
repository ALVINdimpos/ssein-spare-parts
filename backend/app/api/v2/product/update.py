from datetime import datetime
from app.api.v2 import Res, make_product, ActionTypes
from fastapi import Depends, APIRouter, status, Body, Path, HTTPException
from app.api.v2.middlewares import get_current_user
from app.db.models import Product, Action, User
from app.db import get_db
from pydantic import BaseModel, model_validator
from typing import Annotated
from sqlalchemy.orm import Session

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Product not found!"
)


class UpdateProduct(BaseModel):
    num: str | None = None
    description: str | None = None
    selling_price: float | None = None
    purchase_price: float | None = None
    tax: float | None = None
    other_expenses: float | None = None
    discount: float | None = 0
    is_sold: bool | None = None
    sold_date: datetime | None = None
    context: str | None = None

    @model_validator(mode='before')
    def not_none_validator(cls, values: dict) -> dict:
        keys = set(values.keys())
        attributes = (
            'num',
            'description',
            'selling_price',
            'purchase_price',
            'tax',
            'other_expenses',
            'discount',
            'is_sold',
            'sold_date',
            'context'
        )
        intersection = keys.intersection(attributes)
        if not len(intersection):
            raise ValueError('All fields can not be empty')
        return values


@router.post("/{product_id}", response_model=Res)
async def update_product(
        user: Annotated[User, Depends(get_current_user)],
        update: UpdateProduct = Body(),
        product_id: int = Path(title="Product ID", description="The id of the product to be updated"),
        db: Session = Depends(get_db)) -> Res:
    product = db.query(Product).filter_by(id=product_id).first()
    if not product:
        raise not_found
    if update.num:
        product.num = update.num
    if update.description:
        product.description = update.description
    if update.selling_price:
        product.selling_price = update.selling_price
    if update.purchase_price:
        product.purchase_price = update.purchase_price
    if update.tax:
        product.tax = update.tax
    if update.other_expenses:
        product.other_expenses = update.other_expenses
    if update.discount:
        product.discount = update.discount
    if update.sold_date:
        product.sold_date = update.sold_date
    if update.context:
        product.context = update.context
    if product.is_sold is not None:
        product.is_sold = update.is_sold

    action = Action(
        product_id=product.id,
        user_id=user.id,
        action_type=ActionTypes.UPDATE.value
    )
    product.actions.append(action)

    db.commit()
    res = Res(
        status=status.HTTP_200_OK,
        message="Profile retrieved successfully!",
        data={
            "product": make_product(product).dict()
        }
    )
    return res
