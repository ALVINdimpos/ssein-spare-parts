from datetime import datetime
from app.api.v2 import Res, make_car_product, ActionTypes, FileScope
from fastapi import Depends, APIRouter, status, Body, Path, HTTPException, UploadFile
from app.api.v2.middlewares import get_internal_user
from app.api.v2.file.upload import upload_files
from app.db.models import CarProduct, Action, User
from app.db import get_db
from pydantic import BaseModel, model_validator
from typing import Annotated
from sqlalchemy.orm import Session

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Product not found!"
)


class UpdateCarProduct(BaseModel):
    vin_number: str | None = None
    description: str | None = None
    make: str | None = None
    model: str | None = None
    year: str | None = None
    engine: str | None = None
    image: UploadFile | None = None
    dmc: UploadFile | None = None
    assessment_doc: UploadFile | None = None
    tax_doc: UploadFile | None = None
    selling_price: float | None = None
    transport_fees: float | None = None
    purchase_price: float | None = None
    is_sold: bool | None = None
    sold_date: datetime | None = None
    tax: float | None = None
    other_expenses: float | None = None
    proof_of_payment: UploadFile | None = None
    ebm_receipt: UploadFile | None = None
    context: str | None = None

    @model_validator(mode='before')
    def not_none_validator(cls, values: dict) -> dict:
        keys = set(values.keys())
        attributes = (
            'vin_number', 'description', 'make', 'model', 'year', 'engine',
            'image', 'dmc', 'assessment_doc', 'tax_doc', 'selling_price',
            'transport_fees', 'purchase_price', 'is_sold', 'sold_date', 'tax',
            'other_expenses', 'proof_of_payment', 'ebm_receipt', 'context'
        )
        intersection = keys.intersection(attributes)
        if not len(intersection):
            raise ValueError('All fields cannot be empty')
        return values


@router.post("/{product_id}", response_model=Res)
async def update_product(
        user: Annotated[User, Depends(get_internal_user)],
        update: UpdateCarProduct = Body(),
        product_id: int = Path(title="Product ID", description="The id of the product to be updated"),
        db: Session = Depends(get_db)) -> Res:
    if update.image:
        _image = await upload_files(files=[update.image], db=db, scope=FileScope.IMAGE.value)
        update.image = _image.data.files

    if update.dmc:
        _dmc = await upload_files(files=[update.dmc], db=db, scope=FileScope.DMC.value)
        update.dmc = _dmc.data.files[0]

    if update.assessment_doc:
        _assessment_doc = await upload_files(files=[update.assessment_doc], db=db, scope=FileScope.ASSESSMENT.value)
        update.assessment_doc = _assessment_doc.data.files[0]

    if update.tax_doc:
        _tax_doc = await upload_files(files=[update.tax_doc], db=db, scope=FileScope.TAX.value)
        update.tax_doc = _tax_doc.data.files[0]

    if update.ebm_receipt:
        _ebm_receipt = await upload_files(files=[update.ebm_receipt], db=db, scope=FileScope.EBM.value)
        update.ebm_receipt = _ebm_receipt.data.files[0]

    if update.proof_of_payment:
        _proof_of_payment = await upload_files(files=[update.proof_of_payment], db=db, scope=FileScope.PROOF.value)
        update.proof_of_payment = _proof_of_payment.data.files[0]

    car_product = db.query(CarProduct).filter_by(id=product_id).first()

    update_data = update.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(car_product, field, value)

    action = Action(
        product_id=car_product.id,
        user_id=user.id,
        action_type=ActionTypes.UPDATE.value
    )
    car_product.actions.append(action)

    db.commit()
    res = Res(
        status=status.HTTP_200_OK,
        message="Profile retrieved successfully!",
        data={
            "product": make_car_product(car_product)
        }
    )
    return res
