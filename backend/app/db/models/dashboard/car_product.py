import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Numeric, ARRAY
from sqlalchemy.orm import relationship
from app.db import Base


class CarProduct(Base):
    __tablename__ = "car_products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    vin_number = Column(String)
    description = Column(String)
    make = Column(String)
    model = Column(String)
    year = Column(String)
    engine = Column(String)
    image = Column(ARRAY(String))
    dmc = Column(String)
    assessment_doc = Column(String)
    tax_doc = Column(String)
    selling_price = Column(Numeric, default=0)
    transport_fees = Column(Numeric, default=0)
    purchase_price = Column(Numeric, default=0)
    discount = Column(Numeric, default=0)
    is_sold = Column(Boolean, default=False)
    sold_date = Column(DateTime, default=datetime.datetime.utcnow())
    tax = Column(Numeric, default=0)
    other_expenses = Column(Numeric, default=0)
    proof_of_payment = Column(String)
    ebm_receipt = Column(String)
    context = Column(String)
    actions = relationship('Action', back_populates='car')