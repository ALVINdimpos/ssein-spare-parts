from datetime import datetime
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
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship('User', back_populates='actions')
    action_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
