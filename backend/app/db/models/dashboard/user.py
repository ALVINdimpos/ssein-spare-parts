from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base, Session
from app.core.hash import get_hash_password
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv(override=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    role = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    actions = relationship('Action', back_populates='user')
    assigned_reminders = relationship('Reminder', secondary='user_reminders', back_populates='assignees')
    created_reminders = relationship('Reminder', back_populates='assignor')

def create_super_admin():
    # Retrieve environment variables
    super_admin_name = os.getenv("SUPER_ADMIN_NAME")
    super_admin_email = os.getenv("SUPER_ADMIN_EMAIL")
    super_admin_password = os.getenv("SUPER_ADMIN_PASSWORD")
    super_admin_role = os.getenv("SUPER_ADMIN_ROLE", "superadmin")

    # Ensure environment variables are set
    if not (super_admin_name and super_admin_email and super_admin_password):
        raise ValueError("SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, and SUPER_ADMIN_PASSWORD must be set in the environment.")

    # Create a session
    db = Session()

    try:
        # Check if super admin already exists
        existing_admin = db.query(User).filter_by(email=super_admin_email).first()
        if existing_admin:
            print(f"Super admin with email {super_admin_email} already exists.")
            return

        # Create a new super admin user
        super_admin = User(
            name=super_admin_name,
            email=super_admin_email,
            password=get_hash_password(super_admin_password),
            role=super_admin_role
        )
        db.add(super_admin)
        db.commit()
        print(f"Super admin with email {super_admin_email} created successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error creating super admin: {e}")
    finally:
        db.close()
