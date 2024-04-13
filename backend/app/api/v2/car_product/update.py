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
    image: str | None = None
    dmc: str | None = None
    assessment_doc: str | None = None
    proof_of_payment: str | None = None
    ebm_receipt: str | None = None
    tax_doc: str | None = None
    vin_number: str | None = None
    description: str | None = None
    make: str | None = None
    model: str | None = None
    year: str | None = None
    engine: str | None = None
    selling_price: float | None = None
    transport_fees: float | None = None
    purchase_price: float | None = None
    is_sold: bool | None = None
    sold_date: datetime | None = None
    tax: float | None = None
    other_expenses: float | None = None
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


@router.patch("/{product_id}", response_model=Res)
async def update_product(
        user: Annotated[User, Depends(get_internal_user)],
        image: UploadFile = None,
        dmc: UploadFile = None,
        assessment_doc: UploadFile = None,
        proof_of_payment: UploadFile = None,
        ebm_receipt: UploadFile = None,
        tax_doc: UploadFile = None,
        vin_number: str = Body(None, description="Vin Number"),
        description: str = Body(None, description="Description"),
        make: str = Body(None, description="Car Make"),
        model: str = Body(None, description="Car Model"),
        year: str = Body(None, description="Car Year"),
        engine: str = Body(None, description="Car Engine"),
        selling_price: int = Body(None, description="Car's Selling price"),
        transport_fees: int = Body(None, description="Transport fees"),
        purchase_price: int = Body(None, description="Purchase price"),
        is_sold: bool = Body(None, description="Is the product sold"),
        sold_date: datetime = Body(None, description="When did you sell the product?"),
        tax: int = Body(None, description="Tax"),
        other_expenses: int = Body(None, description="Purchase price"),
        context: str = Body(None, description="Context"),
        product_id: int = Path(title="Product ID", description="The id of the product to be updated"),
        db: Session = Depends(get_db)) -> Res:
    if image:
        _image = await upload_files(files=[image], db=db, scope=FileScope.IMAGE)
        image = [_image.data['files'][0]['path']]

    if dmc:
        _dmc = await upload_files(files=[dmc], db=db, scope=FileScope.DMC)
        dmc = _dmc.data['files'][0]['path']

    if assessment_doc:
        _assessment_doc = await upload_files(files=[assessment_doc], db=db, scope=FileScope.ASSESSMENT)
        assessment_doc = _assessment_doc.data['files'][0]['path']

    if tax_doc:
        _tax_doc = await upload_files(files=[tax_doc], db=db, scope=FileScope.TAX)
        tax_doc = _tax_doc.data['files'][0]['path']

    if ebm_receipt:
        _ebm_receipt = await upload_files(files=[ebm_receipt], db=db, scope=FileScope.EBM)
        ebm_receipt = _ebm_receipt.data['files'][0]['path']

    if proof_of_payment:
        _proof_of_payment = await upload_files(files=[proof_of_payment], db=db, scope=FileScope.PROOF)
        proof_of_payment = _proof_of_payment.data['files'][0]['path']

    car_product = db.query(CarProduct).filter_by(id=product_id).first()

    update = UpdateCarProduct(
        product_id=product_id,
        vin_number=vin_number,
        description=description,
        make=make,
        model=model,
        year=year,
        engine=engine,
        selling_price=selling_price,
        transport_fees=transport_fees,
        purchase_price=purchase_price,
        is_sold=is_sold,
        sold_date=sold_date,
        tax=tax,
        other_expenses=other_expenses,
        context=context,
        image=image,
        dmc=dmc,
        assessment_doc=assessment_doc,
        proof_of_payment=proof_of_payment,
        ebm_receipt=ebm_receipt,
        tax_doc=tax_doc,
    )

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
        message="Car product updated successfully!",
        data={
            "product": make_car_product(car_product)
        }
    )
    return res
