from app.api.v2 import Res, make_car_product
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_internal_user
from fastapi import Depends, APIRouter, Path, HTTPException, status
from app.db.models import CarProduct
from app.db import get_db

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Car product not found!"
)


@router.delete("/{product_id}", response_model=Res, dependencies=[Depends(get_internal_user)])
async def delete_car_product(
        car_product_id: int = Path(title="Product ID", description="The id of the product to be deleted"),
        db: Session = Depends(get_db)) -> Res:
    car_product = db.query(CarProduct).filter_by(id=car_product_id).first()
    if not car_product:
        raise not_found
    db.delete(car_product)
    db.commit()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Product deleted successfully!",
        data={
            "product": make_car_product(car_product)
        }
    )

    return res
