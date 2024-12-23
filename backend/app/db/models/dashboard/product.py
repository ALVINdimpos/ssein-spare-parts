from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    num = Column(String)
    description = Column(String)
    selling_price = Column(Numeric, default=0)
    purchase_price = Column(Numeric, default=0)
    other_expenses = Column(Numeric, default=0)
    tax = Column(Numeric, default=0)
    is_sold = Column(Boolean, default=False)
    sold_date = Column(DateTime)
    discount = Column(Numeric, default=0)
    context = Column(String)
    actions = relationship('Action', back_populates='product')


class Action(Base):
    __tablename__ = "actions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete='CASCADE'))
    product = relationship('Product', back_populates='actions')
    car_id = Column(Integer, ForeignKey("car_products.id"))
    car = relationship('CarProduct', back_populates='actions')
    entry_id = Column(Integer, ForeignKey("cash_book.id"))
    cashbook = relationship('CashBook', back_populates='actions')
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship('User', back_populates='actions')
    battery_id = Column(Integer, ForeignKey("batteries.id"))
    action_type = Column(String)
    battery = relationship('Battery', back_populates='actions')
    reminder_id = Column(Integer, ForeignKey("reminders.id"))
    reminder = relationship('Reminder', back_populates='actions')
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    cell_id = Column(Integer, ForeignKey("cells.id"))
    cell = relationship('Cell', back_populates='actions')
