from datetime import datetime
from app.api.v2 import Res, ActionTypes, make_cashbook, FileScope, WhereTo
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_internal_user
from app.api.v2.file.upload import upload_files
from fastapi import Depends, APIRouter, Body, status, UploadFile, HTTPException, Path
from typing import Annotated
from app.db.models import CashBook, User, Action
from app.db import get_db
from enum import Enum

router = APIRouter()


class WhereFrom(Enum):
    BANK = "bank"
    CASH = "cash"
    OUTSIDE = "outside"


@router.post("/", response_model=Res)
async def add_entry(
        user: Annotated[User, Depends(get_internal_user)],
        proof: UploadFile = None,
        description: str = Body(None, description="Description of the cash flow"),
        amount: float = Body(0, description="Amount of the cashflow"),
        where_to: WhereTo = Body(None, description="Where is the cash going? bank or cash"),
        where_from: WhereFrom = Body(None, description="Where is the cash coming from? bank or cash or outside"),
        context: str = Body(None, description="Any additional context?"),
        db: Session = Depends(get_db)) -> Res:
    _proof = ''
    if proof:
        _proof = await upload_files(
            db=db, files=[proof], scope=FileScope.PROOF.value
        )

    if where_to == 'outside':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can not send money out of business")

    entry = CashBook(
        description=description,
        amount=amount,
        where_to=where_to,
        proof=_proof.data.files[0],
        context=context,
        type='original',
        created_at=datetime.utcnow()
    )

    if where_from == where_to:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Can not transfer a cash flow in the same scope")

    if where_to in ['bank', 'cash'] and where_from in ['cash', 'bank']:
        contra = CashBook(
            description=description,
            amount=-1 * amount,
            where_to=where_from,
            context=context,
            type='contra',
            created_at=datetime.utcnow()
        )
        entry.contra.append(contra)

    action = Action(
        product_id=entry.id,
        user_id=user.id,
        action_type=ActionTypes.CREATE.value
    )
    entry.actions.append(action)
    db.add(entry)
    db.commit()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Entry added successfully!",
        data={
            "entry": make_cashbook(entry)
        }
    )

    return res


@router.patch("/{entry_id}", response_model=Res)
async def upload_proof(
        user: Annotated[User, Depends(get_internal_user)],
        proof: UploadFile,
        entry_id: int = Path(description="Entry ID"),
        db: Session = Depends(get_db)) -> Res:
    entry = db.query(CashBook).filter_by(id=entry_id).first()

    if not entry:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Entry not found')

    _proof = ''
    if proof:
        _proof = await upload_files(
            db=db, files=[proof], scope=FileScope.PROOF
        )

    action = Action(
        product_id=entry.id,
        user_id=user.id,
        action_type=ActionTypes.UPDATE.value
    )
    entry.actions.append(action)

    entry.proof = _proof
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Proof submitted successfully!",
        data={
            "entry": make_cashbook(entry)
        }
    )

    return res
