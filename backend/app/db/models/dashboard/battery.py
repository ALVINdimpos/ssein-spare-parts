from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.db import Base
import datetime


class Battery(Base):
    __tablename__ = "batteries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cells_count = Column(Integer, nullable=False)
    sold_fully = Column(Boolean, nullable=False, default=True)
    is_sold = Column(Boolean, nullable=False, default=False)
    purchase_price = Column(Numeric, nullable=False, default=0)
    selling_price = Column(Numeric, nullable=False, default=0)
    other_expenses = Column(Numeric, default=0)
    tax = Column(Numeric, default=0)
    discount = Column(Numeric, default=0)
    context = Column(String)
    sold_date = Column(DateTime, default=datetime.datetime.now(datetime.UTC))
    cells = relationship("Cell", back_populates="battery")
    actions = relationship("Action", back_populates="battery")

class Cell(Base):
    __tablename__ = "cells"

    id = Column(Integer, primary_key=True, autoincrement=True)
    battery_id = Column(Integer, ForeignKey("batteries.id"), nullable=False)
    image_url = Column(String, unique=False, nullable=True)
    cell_no = Column(String, unique=False, nullable=False)
    selling_price = Column(Numeric, nullable=False, default=0)
    purchase_price = Column(Numeric, nullable=False, default=0)
    is_sold = Column(Boolean, nullable=False, default=False)
    other_expenses = Column(Numeric, default=0)
    tax = Column(Numeric, default=0)
    sold_date = Column(DateTime, default=datetime.datetime.now(datetime.UTC))
    discount = Column(Numeric, default=0)
    context = Column(String)
    battery = relationship("Battery", back_populates="cells")
    actions = relationship("Action", back_populates="cell")
