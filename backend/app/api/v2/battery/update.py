from datetime import datetime
from app.api.v2 import Res, make_battery, make_cell, ActionTypes
from fastapi import Depends, APIRouter, status, Body, Path, HTTPException
from app.api.v2.middlewares import get_internal_user
from app.db.models import Battery, Cell, Action, User
from app.db import get_db
from pydantic import BaseModel, model_validator
from typing import Annotated, List
from sqlalchemy.orm import Session

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Battery not found!"
)


class DismantleBattery(BaseModel):
    image_url : str
    cell_nos : List[str]

@router.post("/dismantle/{battery_id}", response_model=Res)
async def dismantle_battery(
        user: Annotated[User, Depends(get_internal_user)],
        cells_info: DismantleBattery = Body(),
        battery_id: int = Path(title="Battery ID", description="The id of the battery to be updated"),
        db: Session = Depends(get_db)) -> Res:
    battery = db.query(Battery).filter_by(id=battery_id).first()
    if not battery:
        raise not_found
    elif battery.is_sold:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Battery is already Sold!"
        )
    elif not battery.sold_fully:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Battery is already dismantled!"
        )
    elif cells_info.image_url is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide an image path"
        )
    elif len(cells_info.cell_nos) != battery.cells_count:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The number of cells provided must match the number of cells the battery has!"
        )
    else:
        pass

    action = Action(
        battery_id=battery.id,
        user_id=user.id,
        action_type=ActionTypes.UPDATE.value
    )

    battery.actions.append(action)
    battery.sold_fully = False
    for i in range(battery.cells_count):
        cell = Cell(
            battery_id=battery.id,
            image_url=cells_info.image_url,
            cell_no=cells_info.cell_nos[i]
        )

        action2 = Action(
            cell_id=cell.id,
            user_id=user.id,
            action_type=ActionTypes.CREATE.value
        )
        cell.actions.append(action2)
        battery.cells.append(cell)

    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Battery dismantled successfully!",
        data={
            "battery": make_battery(battery),
            "cells": [make_cell(cell_saved) for cell_saved in battery.cells]
        }
    )
    return res

class UpdateCell(BaseModel):
    image_url: str | None = None
    cell_no: int | None = None
    is_sold: bool | None = None
    selling_price: float | None = None
    other_expenses: float | None = None
    tax: float | None = None
    discount: float | None = None
    context: str | None = None

    @model_validator(mode='before')
    def not_none_validator(cls, values: dict) -> dict:
        keys = set(values.keys())
        attributes = (
            'image_url',
            'cell_no',
            'selling_price',
            'is_sold',
            'other_expenses',
            'tax',
            'discount',
            'context',
        )
        intersection = keys.intersection(attributes)
        if not len(intersection):
            raise ValueError('All fields can not be empty')
        return values


@router.patch("/cell/{cell_id}", response_model=Res)
async def update_cell(
        user: Annotated[User, Depends(get_internal_user)],
        update: UpdateCell = Body(),
        cell_id: int = Path(title="Cell ID", description="The id of the cell to be updated"),
        db: Session = Depends(get_db)) -> Res:
    cell = db.query(Cell).filter_by(id=cell_id).first()
    if not cell:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cell not found!"
        )
    if update.image_url:
        cell.image_url = update.image_url
    if update.cell_no:
        cell.cell_no = update.cell_no
    if update.is_sold is not None:
        cell.is_sold = update.is_sold
    if update.selling_price:
        cell.selling_price = update.selling_price
    if update.other_expenses:
        cell.other_expenses = update.other_expenses
    if update.tax:
        cell.tax = update.tax
    if update.discount:
        cell.discount = update.discount
    if update.context:
        cell.context = update.context


    if cell.is_sold:
        cell.sold_date = datetime.now()

    action = Action(
        cell_id=cell.id,
        user_id=user.id,
        action_type=ActionTypes.UPDATE.value
    )
    cell.actions.append(action)

    db.commit()
    res = Res(
        status=status.HTTP_200_OK,
        message="Cell updated successfully!",
        data={
            "cell": make_cell(cell)
        }
    )
    return res

class UpdateBattery(BaseModel):
    cells_count: int | None = None
    sold_fully: bool | None = None
    is_sold: bool | None = None
    purchase_price: float | None = None
    selling_price: float | None = None
    other_expenses: float | None = None
    tax: float | None = None
    discount: float | None = None
    context: str | None = None

    @model_validator(mode='before')
    def not_none_validator(cls, values: dict) -> dict:
        keys = set(values.keys())
        attributes = (
            'cells_count',
            'is_sold',
            'purchase_price',
            'selling_price',
            'other_expenses',
            'tax',
            'discount',
            'context',
        )
        intersection = keys.intersection(attributes)
        if not len(intersection):
            raise ValueError('All fields can not be empty')
        return values


@router.patch("/full/{battery_id}", response_model=Res)
async def update_battery(
        user: Annotated[User, Depends(get_internal_user)],
        update: UpdateBattery = Body(),
        battery_id: int = Path(title="Battery ID", description="The id of the battery to be updated"),
        db: Session = Depends(get_db)) -> Res:
    battery = db.query(Battery).filter_by(id=battery_id).first()
    if not battery:
        raise not_found
    if not battery.sold_fully:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Battery has been dismantled!"
        )
    if update.cells_count:
        battery.cells_count = update.cells_count
    if update.is_sold is not None:
        battery.is_sold = update.is_sold
    if update.purchase_price:
        battery.purchase_price = update.purchase_price
    if update.selling_price:
        battery.selling_price = update.selling_price
    if update.other_expenses:
        battery.other_expenses = update.other_expenses
    if update.tax:
        battery.tax = update.tax
    if update.discount:
        battery.discount = update.discount
    if update.context:
        battery.context = update.context

    if battery.is_sold:
        battery.sold_date = datetime.now()

    action = Action(
        battery_id=battery.id,
        user_id=user.id,
        action_type=ActionTypes.UPDATE.value
    )
    battery.actions.append(action)

    db.commit()
    res = Res(
        status=status.HTTP_200_OK,
        message="Battery updated successfully!",
        data={
            "battery": make_battery(battery)
        }
    )
    return res