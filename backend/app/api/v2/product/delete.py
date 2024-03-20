from app.api.v2 import Res, make_product
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_current_user
from fastapi import Depends, APIRouter, Path, HTTPException, status
from app.db.models import Product
from app.db import get_db

router = APIRouter()


@router.delete("/{product_id}", response_model=Res, dependencies=[Depends(get_current_user)])
async def delete_product(
        product_id: int = Path(title="Product ID", description="The id of the product to be deleted"),
        db: Session = Depends(get_db)) -> Res:
    product = db.query(Product).filter_by(id=product_id).first()
    db.delete(product)
    db.commit()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Product deleted successfully!",
        data={
            "product": make_product(product).dict()
        }
    )

    return res
