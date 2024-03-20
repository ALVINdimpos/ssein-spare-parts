from datetime import datetime
from enum import Enum
from pydantic import BaseModel, EmailStr
from app.db.models import Product
from typing import Optional, Union


class Res(BaseModel):
    status: int
    message: str
    data: dict


class Roles(Enum):
    ADMIN = 'admin'
    AGENT = 'agent'


class FileScope(Enum):
    TAX = 'tax'
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


class ProductDocument(BaseModel):
    num: str
    name: str
    description: str
    selling_price: float
    discount: float
    is_sold: bool
    sold_date: datetime | None


class ProductModel(BaseModel):
    num: str
    name: str
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


def make_product(product: Product) -> ProductResModel:
    return ProductResModel(
        id=product.id,
        name=product.name,
        description=product.description,
        selling_price=product.selling_price,
        purchase_price=product.purchase_price,
        num=product.num,
        tax=product.tax,
        other_expenses=product.other_expenses,
        discount=product.discount,
        is_sold=product.is_sold,
        sold_date=product.sold_date,
        context=product.context
    )
