from app.api.v2 import Res, make_car_product, make_car_product_client
from sqlalchemy.orm import Session
from app.api.v2.middlewares.authentication import get_internal_user
from fastapi import Depends, APIRouter, status, Path, HTTPException
from app.db import get_db
from app.db.models import CarProduct

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Car product not found!"
)


@router.get("/", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_products(db: Session = Depends(get_db)) -> Res:
    car_products = db.query(CarProduct).all()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Car product retrieved successfully!",
        data={
            "car_products": [make_car_product(car_product) for car_product in car_products]
        }
    )

    return res


@router.get("/client", response_model=Res, tags=['Clients'])
async def get_products(db: Session = Depends(get_db)) -> Res:
    car_products = db.query(CarProduct).all()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Car product retrieved successfully!",
        data={
            "car_products": [make_car_product_client(car_product) for car_product in car_products]
        }
    )

    return res


@router.get("/{product_id}", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_product(product_id: int = Path(),
                      db: Session = Depends(get_db)) -> Res:
    car_product = db.query(CarProduct).filter_by(id=product_id).first()
    if not car_product:
        raise not_found

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Car product retrieved successfully!",
        data={
            "car_product": make_car_product(car_product)
        }
    )

    return res


@router.get("/client/{product_id}", response_model=Res, tags=['Clients'])
async def get_product(product_id: int = Path(),
                      db: Session = Depends(get_db)) -> Res:
    car_product = db.query(CarProduct).filter_by(id=product_id).first()
    if not car_product:
        raise not_found

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Car product retrieved successfully!",
        data={
            "car_product": make_car_product_client(car_product)
        }
    )

    return res