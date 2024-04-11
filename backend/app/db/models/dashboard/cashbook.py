import datetime
from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base


class CashBook(Base):
    __tablename__ = "cash_book"

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow())
    description = Column(String)
    proof = Column(String)
    amount = Column(Numeric, default=0)
    where_to = Column(String)  # either bank or cash
    type = Column(String)  # original entry or contra-entry
    context = Column(String)
    contra_id = Column(Integer, ForeignKey('cash_book.id'))
    contra = relationship('CashBook', remote_side=[id], back_populates='contras')
    contras = relationship('CashBook', back_populates='contra')
    actions = relationship('Action', back_populates='cashbook')
