from app.api.v2 import Res, make_product
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, status, Path, HTTPException
from app.db import get_db
from app.db.models import Product

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Product not found!"
)


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


@router.get("/{product_id}", response_model=Res)
async def get_product(product_id: int = Path(),
                      db: Session = Depends(get_db)) -> Res:
    product = db.query(Product).filter_by(id=product_id).first()
    if not product:
        raise not_found

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Product created successfully!",
        data={
            "product": make_product(product)
        }
    )

    return res
