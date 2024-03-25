import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Numeric
from app.db import Base


class DebtManagement(Base):
    __tablename__ = "debt_management"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    contact_info = Column(String)
    amount = Column(Numeric, default=0)
    due_date = Column(DateTime, default=datetime.datetime.utcnow())
    status = Column(String)
    context = Column(String)
    scope = Column(String)