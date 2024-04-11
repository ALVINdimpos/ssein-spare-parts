from app.api.v2 import Res, make_car_product, ActionTypes, FileScope
from sqlalchemy.orm import Session
from app.api.v2.middlewares import get_internal_user
from app.api.v2.file.upload import upload_files
from fastapi import Depends, APIRouter, Body, status, UploadFile
from typing import Annotated
from app.db.models import User, Action, CarProduct
from app.db import get_db
from datetime import datetime

router = APIRouter()


@router.post("/", response_model=Res)
async def create_car_product(
        user: Annotated[User, Depends(get_internal_user)],
        image: UploadFile = None,
        dmc: UploadFile = None,
        assessment_doc: UploadFile = None,
        tax_doc: UploadFile = None,
        ebm_receipt: UploadFile = None,
        proof_of_payment: UploadFile = None,
        vin_number: str = Body(None, description="Vin Number"),
        description: str = Body(None, description="Description"),
        make: ActionTypes = Body(None, description="Car Make"),
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
        db: Session = Depends(get_db)) -> Res:
    if image:
        _image = await upload_files(files=[image], db=db, scope=FileScope.IMAGE.value)
        image = _image.data.files

    if dmc:
        _dmc = await upload_files(files=[dmc], db=db, scope=FileScope.DMC.value)
        dmc = _dmc.data.files[0]

    if assessment_doc:
        _assessment_doc = await upload_files(files=[assessment_doc], db=db, scope=FileScope.ASSESSMENT.value)
        assessment_doc = _assessment_doc.data.files[0]

    if tax_doc:
        _tax_doc = await upload_files(files=[tax_doc], db=db, scope=FileScope.TAX.value)
        tax_doc = _tax_doc.data.files[0]

    if ebm_receipt:
        _ebm_receipt = await upload_files(files=[ebm_receipt], db=db, scope=FileScope.EBM.value)
        ebm_receipt = _ebm_receipt.data.files[0]

    if proof_of_payment:
        _proof_of_payment = await upload_files(files=[proof_of_payment], db=db, scope=FileScope.PROOF.value)
        proof_of_payment = _proof_of_payment.data.files[0]

    car_product = CarProduct(
        image=image,
        dmc=dmc,
        assessment_doc=assessment_doc,
        tax_doc=tax_doc,
        ebm_receipt=ebm_receipt,
        proof_of_payment=proof_of_payment,
        vin_number=vin_number,
        description=description,
        make=make,
        year=year,
        engine=engine,
        selling_price=selling_price,
        transport_fees=transport_fees,
        purchase_price=purchase_price,
        is_sold=is_sold,
        sold_date=sold_date,
        tax=tax,
        other_expenses=other_expenses,
        context=context
    )

    action = Action(
        product_id=car_product.id,
        user_id=user.id,
        action_type=ActionTypes.CREATE.value
    )
    car_product.actions.append(action)
    db.add(car_product)
    db.commit()

    res = Res(
        status=status.HTTP_201_CREATED,
        message="Car Product created successfully!",
        data={
            "car_product": make_car_product(car_product)
        }
    )

    return res
