from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


engine = create_engine("postgresql://rocco:Rocco%40365@127.0.0.1:5432/parts")
Session = sessionmaker(bind=engine)
Base = declarative_base()
