from app.api.v2 import Res, make_battery
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_internal_user
from fastapi import Depends, APIRouter, Path, HTTPException, status
from app.db.models import Battery
from app.db import get_db

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Battery not found!"
)


@router.delete("/full/{battery_id}", response_model=Res, dependencies=[Depends(get_internal_user)])
async def delete_battery(
        battery_id: int = Path(title="Battery ID", description="The id of the battery to be deleted"),
        db: Session = Depends(get_db)) -> Res:
    battery = db.query(Battery).filter_by(id=battery_id).first()
    if not battery:
        raise not_found
    if not battery.sold_fully:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Battery has been dismantled!"
        )
    db.delete(battery)
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Battery deleted successfully!",
        data={
            "battery": make_battery(battery)
        }
    )

    return res
