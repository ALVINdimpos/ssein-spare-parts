from app.api.v2 import Res, make_cell, make_cell_client, make_battery, make_battery_client
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, status, Path, HTTPException
from app.api.v2.middlewares.authentication import get_internal_user
from app.db import get_db
from app.db.models import Battery, Cell

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Battery not found!"
)


@router.get("/full", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_batteries(db: Session = Depends(get_db)) -> Res:
    batteries = db.query(Battery).all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Batteries retrieved successfully!",
        data={
            "batteries": [make_battery(battery) for battery in batteries]
        }
    )

    return res


@router.get("/full/{battery_id}", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_battery(battery_id: int = Path(),
                      db: Session = Depends(get_db)) -> Res:
    battery = db.query(Battery).filter_by(id=battery_id).first()
    if not battery:
        raise not_found

    res = Res(
        status=status.HTTP_200_OK,
        message="Battery retrieved successfully!",
        data={
            "battery": make_battery(battery)
        }
    )

    return res


@router.get("/cell", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_cells(db: Session = Depends(get_db)) -> Res:
    cells = db.query(Cell).all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Cells retrieved successfully!",
        data={
            "batteries": [make_cell(cell) for cell in cells]
        }
    )

    return res


@router.get("/cell/{cell_id}", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_cell(cell_id: int = Path(),
                      db: Session = Depends(get_db)) -> Res:
    cell = db.query(Cell).filter_by(id=cell_id).first()
    if not cell:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cell not found!"
        )

    res = Res(
        status=status.HTTP_200_OK,
        message="Cell retrieved successfully!",
        data={
            "cell": make_cell(cell)
        }
    )

    return res

########################### CLIENT #################################


@router.get("/client/full", response_model=Res, tags=['Clients'])
async def get_batteries_as_client(db: Session = Depends(get_db)) -> Res:
    batteries = db.query(Battery).filter_by(is_sold=False).all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Batteries retrieved successfully!",
        data={
            "batteries": [make_battery_client(battery) for battery in batteries]
        }
    )

    return res


@router.get("/client/full/{battery_id}", response_model=Res, tags=['Clients'])
async def get_battery_as_client(battery_id: int = Path(),
                      db: Session = Depends(get_db)) -> Res:
    battery = db.query(Battery).filter_by(id=battery_id, is_sold=False).first()
    if not battery:
        raise not_found

    res = Res(
        status=status.HTTP_200_OK,
        message="Battery retrieved successfully!",
        data={
            "product": make_battery_client(battery)
        }
    )

    return res


@router.get("/client/cell", response_model=Res, tags=['Clients'])
async def get_cells_as_client(db: Session = Depends(get_db)) -> Res:
    cells = db.query(Cell).filter_by(is_sold=False).all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Cells retrieved successfully!",
        data={
            "batteries": [make_cell_client(cell) for cell in cells]
        }
    )

    return res


@router.get("/client/cell/{cell_id}", response_model=Res, tags=['Clients'])
async def get_cell_as_client(cell_id: int = Path(),
                      db: Session = Depends(get_db)) -> Res:
    cell = db.query(Cell).filter_by(id=cell_id, is_sold=False).first()
    if not cell:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cell not found!"
        )

    res = Res(
        status=status.HTTP_200_OK,
        message="Cell retrieved successfully!",
        data={
            "cell": make_cell_client(cell)
        }
    )

    return res
