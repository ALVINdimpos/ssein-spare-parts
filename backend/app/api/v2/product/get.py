from app.api.v2 import Res, make_product
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_current_user
from fastapi import Depends, APIRouter, HTTPException, status
from app.db import get_db
from app.db.models import Product

router = APIRouter()


@router.get("/", response_model=Res)
async def get_products(db: Session = Depends(get_db)) -> Res:
    products = db.query(Product).all()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Product created successfully!",
        data={
            "products": [make_product(product).dict() for product in products]
        }
    )

    return res
