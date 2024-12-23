from datetime import datetime
from enum import Enum
import requests
from pydantic import BaseModel, EmailStr
from app.db.models import Product, CarProduct, CashBook, Battery, Cell, Reminder
from typing import Union, List, Optional
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
    EDITOR = 'editor'


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
    purchase_price: float = 0
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
            'created_at': action.created_at,
        } for action in product.actions]
    )


def make_product_client(product: Product) -> ProductResModel:
    return ProductResModel(
        id=product.id,
        description=product.description,
        selling_price=product.selling_price,
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
        'other_expenses': car_product.other_expenses,
        'discount': car_product.discount,
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
            'created_at': action.created_at,
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
        'other_expenses': car_product.other_expenses,
        'discount': car_product.discount,
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
        'contras': [{'id': contra.id,
                     'created_at': contra.created_at,
                     'description': contra.description,
                     'proof': contra.proof,
                     'amount': contra.amount,
                     'where_to': contra.where_to,
                     'context': contra.context,
                    'type': contra.type} for contra in cashbook.contras],
        'actions': [{
            'id': action.id,
            'user_name': action.user.name,
            'user_id': action.user_id,
            'action_type': action.action_type,
            'created_at': action.created_at,
        } for action in cashbook.actions]
    }


class CellModel(BaseModel):
    battery_id: int
    image_url: Union[str, None]  # Image URL can be nullable
    cell_no: str
    selling_price: float
    is_sold: bool
    other_expenses: float
    tax: float
    discount: float
    context: str

    model_config = {
        "from_attributes": True  # Enables reading attributes from ORM objects
    }

class ActionModel(BaseModel):
    id: int
    user_id: int
    action_type: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class BatteryModel(BaseModel):
    cells_count: int
    is_sold: bool
    purchase_price: float
    selling_price: float
    other_expenses: float
    tax: float
    discount: float
    context: str


    model_config = {
        "from_attributes": True
    }

BatteryModel.model_rebuild()

def make_battery(battery: Battery) -> dict:
    return {
        'id': battery.id,
        'cells_count': battery.cells_count,
        'sold_fully': battery.sold_fully,
        'is_sold': battery.is_sold,
        'purchase_price': battery.purchase_price,
        'selling_price': battery.selling_price,
        'sold_date': battery.sold_date,
        'other_expenses': battery.other_expenses,
        'tax': battery.tax,
        'discount': battery.discount,
        'context': battery.context,
        'actions': [{
            'id': action.id,
            'user_name': action.user.name,
            'user_id': action.user_id,
            'action_type': action.action_type,
            'created_at': action.created_at,
        } for action in battery.actions]
    }


def make_battery_client(battery: Battery) -> dict:
    return {
        'id': battery.id,
        'cells_count': battery.cells_count,
        'is_sold': battery.is_sold,
        'selling_price': battery.selling_price,
    }


def make_cell(cell: Cell) -> dict:
    return {
        'id': cell.id,
        'battery_id': cell.battery_id,
        'image_url': cell.image_url,
        'is_sold': cell.is_sold,
        'cell_no': cell.cell_no,
        'selling_price': cell.selling_price,
        'purchase_price': cell.purchase_price,
        'other_expenses': cell.other_expenses,
        'tax': cell.tax,
        'discount': cell.discount,
        'context': cell.context,
        'actions': [{
            'id': action.id,
            'user_name': action.user.name,
            'user_id': action.user_id,
            'action_type': action.action_type,
            'created_at': action.created_at,
        } for action in cell.actions]
    }

def make_cell_client(cell: Cell) -> dict:
    return {
        'id': cell.id,
        'battery_id': cell.battery_id,
        'image_url': cell.image_url,
        'is_sold': cell.is_sold,
        'cell_no': cell.cell_no,
        'selling_price': cell.selling_price
    }


class RecurrenceTypes(Enum):
    DAILY = 'daily'
    WEEKLY = 'weekly'
    MONTHLY = 'monthly'
    ANNUALLY = 'annually'

class ReminderStatus(Enum):
    ACTIVE = 'active'
    INACTIVE = 'inactive'

class ReminderModel(BaseModel):
    assignees: List[int]
    title: str
    description: Optional[str] = None
    start_date: datetime
    due_date: datetime
    priority: Optional[int] = None
    recurring: bool = False
    recurrence_type: Optional[RecurrenceTypes] = None
    recurrence_end: Optional[datetime] = None
    status: ReminderStatus = "active"

    model_config = {
        "from_attributes": True
    }

ReminderModel.model_rebuild()

def make_reminder(reminder: Reminder) -> dict:
    return {
        'id': reminder.id,
        'title': reminder.title,
        'description': reminder.description,
        'assignor': {'id': reminder.assignor.id, 'name': reminder.assignor.name},
        'assignees': [{'id': user.id, 'name': user.name} for user in reminder.assignees],
        'start_date': reminder.start_date,
        'due_date': reminder.due_date,
        'priority': reminder.priority,
        'recurring': reminder.recurring,
        'recurrence_type': reminder.recurrence_type,
        'recurrence_end': reminder.recurrence_end,
        'status': reminder.status,
        'actions': [{
            'id': action.id,
            'user_name': action.user.name,
            'user_id': action.user_id,
            'action_type': action.action_type,
            'created_at': action.created_at,
        } for action in reminder.actions],
        'acknowledgements': [{
            'id': ack.id,
            'user_name': ack.assignee.name,
            'user_id': ack.assignee_id,
            'acknowledged_at': ack.acknowledged_at,
        } for ack in reminder.acknowledgements]
    }

def generate_reminder_message(reminder):
    assignees = ', '.join([assignee.name for assignee in reminder.assignees])
    message = f"""
    Reminder Notification

    Title: {reminder.title}
    Description: {reminder.description or "No description provided."}
    Assigned by: {reminder.assignor.name}
    Assigned to: {assignees}
    Start Date: {reminder.start_date.strftime('%Y-%m-%d %H:%M:%S')}
    Due Date: {reminder.due_date.strftime('%Y-%m-%d %H:%M:%S')}
    Priority: {get_priority_label(reminder.priority).capitalize()}

    Please make sure to complete the assigned actions by the due date.

    This is an automated notification. Please do not reply to this email.
    """
    return message

def get_priority_label(priority):
    if priority == 1:
        return 'high'
    elif priority == 2:
        return 'medium'
    elif priority == 3:
        return 'low'
    return 'low'