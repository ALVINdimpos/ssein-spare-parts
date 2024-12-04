import datetime
from sqlalchemy import Column, Integer, String, DateTime, Numeric
from app.db import Base


class DebtManagement(Base):
    __tablename__ = "debt_management"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    contact_info = Column(String)
    amount = Column(Numeric, default=0)
    due_date = Column(DateTime, default=datetime.datetime.utcnow())
    status = Column(String, default='good')  # this status can be paid, good, or bad
    context = Column(String)
    product_id = Column(Integer)  # this is to tie a debit with a product
    product_scope = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    scope = Column(String)
