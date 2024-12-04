from app.api.v2 import Res, BatteryModel, make_battery, ActionTypes
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_internal_user
from fastapi import Depends, APIRouter, Body, status
from typing import Annotated
from app.db.models import Battery, User, Action
from app.db import get_db

router = APIRouter()


@router.post("/", response_model=Res)
async def create_battery(
        user: Annotated[User, Depends(get_internal_user)],
        battery: Annotated[BatteryModel, Body()],
        db: Session = Depends(get_db)) -> Res:

    battery = Battery(**battery.model_dump())
    battery.sold_fully = True
    action = Action(
        battery_id=battery.id,
        user_id=user.id,
        action_type=ActionTypes.CREATE.value
    )
    battery.actions.append(action)
    db.add(battery)
    db.commit()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Battery created successfully!",
        data={
            "battery": make_battery(battery)
        }
    )

    return res
