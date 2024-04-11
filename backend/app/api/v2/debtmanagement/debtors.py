from app.api.v2 import Res, DebitStatus, ProductScopes
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, Body, HTTPException, status, Path
from app.db import get_db
from enum import Enum
from app.db.models import DebtManagement

router = APIRouter()

unauthorized = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Unauthorized to perform this action"
)

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Record not found!"
)


class ManagementScope(Enum):
    CREDITORS = "creditors"
    DEBTORS = "debtors"


def make_record(record: DebtManagement) -> dict:
    return {
        "id": record.id,
        "name": record.name,
        "contact_info": record.contact_info,
        "amount": record.amount,
        "due_date": record.due_date,
        "scope": record.scope,
        "payment_status": record.status,
        "context": record.context,
    }


@router.post("/", response_model=Res)
async def add_record(name: str = Body(None, description="Name of the debtor or creditor"),
                     contact_info: str = Body(None, description="Contact information of the debtor or creditor"),
                     amount: float = Body(0,
                                          description="Amount you owe the creditor or the amount the debtor owes you"),
                     due_date: datetime = Body(None, description="The due date of the amount specified"),
                     context: str = Body(None, description="Any additional comments"),
                     payment_status: DebitStatus = Body(None, description="The status of the record"),
                     product_id: int = Body(None, description="A product on which you are giving a debt"),
                     product_scope: ProductScopes = Body(None, description="Which scope does this product belongs to?"),
                     scope: ManagementScope = Body(None,
                                                   description="The scope of the amount, whether debtor or creditor"),
                     db: Session = Depends(get_db)) -> Res:
    new_rec = DebtManagement(
        name=name,
        contact_info=contact_info,
        amount=amount,
        due_date=due_date,
        status=payment_status.value,
        scope=scope.value,
        context=context,
        product_id=product_id,
        product_scope=product_scope.value
    )

    db.add(new_rec)
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Successfully added a new record in the management!",
        data={
            "record": make_record(new_rec)
        }
    )

    return res


@router.get("/", response_model=Res)
def get_all_records(scope: ManagementScope,
                    db: Session = Depends(get_db)) -> Res:
    records = db.query(DebtManagement).filter_by(scope=scope.value).all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Retrieved all records in the management!",
        data={
            "records": [make_record(i) for i in records],
        }
    )

    return res


@router.patch('/{_id}', response_model=Res)
def update_record(_id: int = Path(..., description="The id of the record to be updated"),
                  name: str = Body(None, description="Name of the debtor or creditor"),
                  contact_info: str = Body(None, description="Contact information of the debtor or creditor"),
                  amount: float = Body(0,
                                       description="Amount you owe the creditor or the amount the debtor owes you"),
                  due_date: datetime = Body(None, description="The due date of the amount specified"),
                  payment_status: str = Body(None, description="The updated status of the payment"),
                  context: str = Body(None, description="Any additional comments"),
                  scope: ManagementScope = Body(None,
                                                description="The scope of the amount, whether debtor or creditor"),
                  db: Session = Depends(get_db)) -> Res:
    record = db.query(DebtManagement).filter_by(id=_id).first()
    if not record:
        raise not_found

    if name is not None:
        record.name = name
    if contact_info is not None:
        record.contact_info = contact_info
    if amount is not None:
        record.amount = amount
    if due_date is not None:
        record.due_date = due_date
    if payment_status is not None:
        record.status = payment_status
    if context is not None:
        record.context = context
    if scope is not None:
        record.scope = scope.value

    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Successfully updated a record!",
        data={
            "record": make_record(record)
        }
    )
    return res


@router.delete("/{_id}", response_model=Res)
async def delete_record(_id: int = Path(..., description="id of the record to be deleted"),
                        db: Session = Depends(get_db)) -> Res:
    record = db.query(DebtManagement).filter_by(id=_id).first()
    if not record:
        raise not_found
    db.delete(record)
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Record deleted successfully!",
        data={
            "record": make_record(record)
        }
    )

    return res
