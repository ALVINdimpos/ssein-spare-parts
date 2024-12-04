from sqlalchemy import Column, Integer, String, Float
from app.db import Base


class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    size = Column(Float)
    etag = Column(String)
    type = Column(String)
    path = Column(String)
    scope = Column(String)
