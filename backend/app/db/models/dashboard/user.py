from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    role = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    actions = relationship('Action', back_populates='user')
