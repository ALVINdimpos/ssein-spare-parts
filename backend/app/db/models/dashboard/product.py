from sqlalchemy import Column, Integer, String, Boolean, DateTime, Numeric
from app.db import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    num = Column(String)
    name = Column(String)
    description = Column(String)
    selling_price = Column(Numeric, default=0)
    purchase_price = Column(Numeric, default=0)
    other_expenses = Column(Numeric, default=0)
    tax = Column(Numeric, default=0)
    is_sold = Column(Boolean, default=False)
    sold_date = Column(DateTime)
    discount = Column(Numeric, default=0)
    context = Column(String)
