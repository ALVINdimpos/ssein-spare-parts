from datetime import datetime
from enum import Enum
import requests
from pydantic import BaseModel, EmailStr
from app.db.models import Product, CarProduct, CashBook
from typing import Union, List
import uuid
from dotenv import load_dotenv
import os

load_dotenv()


def generate_short_unique_id():
    # Generate a UUID
    generated_uuid = uuid.uuid4()

    # Convert the UUID to string and take the first part
    short_id = str(generated_uuid).split('-')[0]

    return short_id.upper()


class ActionTypes(Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    INTENT = "intent"


class WhereTo(Enum):
    BANK = "bank"
    CASH = "cash"


class ProductScopes(Enum):
    PRODUCT = "product"
    CARPRODUCT = "carproduct"


class DebitStatus(Enum):
    GOOD = "good"
    BAD = "bad"
    PAID = "paid"


class Res(BaseModel):
    status: int
    message: str
    data: dict


class Roles(Enum):
    ADMIN = 'admin'
    AGENT = 'agent'
    CLIENT = 'client'


class InquiryTypes(Enum):
    CONTACT = 'contact'
    PRODUCT = 'product'


class FileScope(Enum):
    TAX = 'tax'
    IMAGE = 'image'
    DMC = 'dmc'
    PROOF = 'proof'
    EBM = 'ebm'
    ASSESSMENT = 'assessment'
    OTHER = 'other'


class FileModel(BaseModel):
    name: str
    size: float
    etag: str
    type: str
    path: str
    scope: str


class User(BaseModel):
    name: Union[str, None]
    role: Roles = Roles.AGENT
    email: Union[EmailStr, None]
    password: Union[str, None]


class UserRes(User):
    id: int


class ProductDocument(BaseModel):
    num: str
    description: str
    selling_price: float
    discount: float
    is_sold: bool
    sold_date: datetime | None


class CarDocument(BaseModel):
    vinnumber: str
    description: str
    model: str
    year: str
    make: str
    engine: str


class ProductModel(BaseModel):
    num: str
    description: str
    selling_price: float
    purchase_price: float
    tax: float
    other_expenses: float
    discount: float = 0
    is_sold: bool = False
    sold_date: datetime = None
    context: str = ""


class ProductResModel(ProductModel):
    id: int
    actions: Union[List, None]


def make_product(product: Product) -> ProductResModel:
    return ProductResModel(
        id=product.id,
        description=product.description,
        selling_price=product.selling_price,
        purchase_price=product.purchase_price,
        num=product.num,
        tax=product.tax,
        other_expenses=product.other_expenses,
        discount=product.discount,
        is_sold=product.is_sold,
        sold_date=product.sold_date,
        context=product.context,
        actions=[{
            'id': action.id,
            'user_name': action.user.name,
            'user_id': action.user_id,
            'action_type': action.action_type,
            'creates_at': action.created_at,
        } for action in product.actions]
    )


def make_product_client(product: Product) -> ProductResModel:
    return ProductResModel(
        id=product.id,
        description=product.description,
        selling_price=product.selling_price,
        purchase_price=product.purchase_price,
        num=product.num,
        tax=product.tax,
        other_expenses=product.other_expenses,
        discount=product.discount,
        is_sold=product.is_sold,
        sold_date=product.sold_date,
        context=product.context,
        actions=[]
    )


def send_email(subject: str, text: str, to: List[EmailStr]):
    response = requests.post(f"https://api.mailgun.net/v3/{os.getenv('MAILGUN_SANDBOX')}/messages",
                             auth=('api', os.getenv('MAILGUN_API_KEY')),
                             data={'from': f'Ssein Group <noreply@{os.getenv("MAILGUN_SANDBOX")}>',
                                   'to': to,
                                   'subject': subject,
                                   'text': text})

    print(response.__dict__)


def make_car_product(car_product: CarProduct):
    return {
        'id': car_product.id,
        'vin_number': car_product.vin_number,
        'description': car_product.description,
        'make': car_product.make,
        'model': car_product.model,
        'year': car_product.year,
        'engine': car_product.engine,
        'image': car_product.image,
        'dmc': car_product.dmc,
        'assessment_doc': car_product.assessment_doc,
        'tax_doc': car_product.tax_doc,
        'selling_price': car_product.selling_price,
        'sold_date': car_product.sold_date,
        'transport_fees': car_product.transport_fees,
        'purchase_price': car_product.purchase_price,
        'is_sold': car_product.is_sold,
        'tax': car_product.tax,
        'proof_of_payment': car_product.proof_of_payment,
        'ebm_receipt': car_product.ebm_receipt,
        'context': car_product.context,
        'actions': [{
            'id': action.id,
            'user_name': action.user.name,
            'user_id': action.user_id,
            'action_type': action.action_type,
            'creates_at': action.created_at,
        } for action in car_product.actions]
    }


def make_car_product_client(car_product: CarProduct):
    return {
        'id': car_product.id,
        'vin_number': car_product.vin_number,
        'description': car_product.description,
        'make': car_product.make,
        'model': car_product.model,
        'year': car_product.year,
        'engine': car_product.engine,
        'image': car_product.image,
        'dmc': car_product.dmc,
        'assessment_doc': car_product.assessment_doc,
        'tax_doc': car_product.tax_doc,
        'selling_price': car_product.selling_price,
        'sold_date': car_product.sold_date,
        'transport_fees': car_product.transport_fees,
        'purchase_price': car_product.purchase_price,
        'is_sold': car_product.is_sold,
        'tax': car_product.tax,
        'proof_of_payment': car_product.proof_of_payment,
        'ebm_receipt': car_product.ebm_receipt,
        'context': car_product.context,
        'actions': []
    }


def make_cashbook(cashbook: CashBook):
    return {
        'id': cashbook.id,
        'created_at': cashbook.created_at,
        'description': cashbook.description,
        'proof': cashbook.proof,
        'amount': cashbook.amount,
        'where_to': cashbook.where_to,
        'type': cashbook.type,
        'context': cashbook.context,
        'contra': [{'id': contra.id,
                    'type': contra.type} for contra in cashbook.contra],
        'actions': [{
            'id': action.id,
            'user_name': action.user.name,
            'user_id': action.user_id,
            'action_type': action.action_type,
            'creates_at': action.created_at,
        } for action in cashbook.actions]
    }
