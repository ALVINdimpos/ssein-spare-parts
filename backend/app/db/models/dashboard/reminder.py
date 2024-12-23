from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Table
from sqlalchemy.orm import relationship
from app.db import Base


user_reminders = Table(
    "user_reminders",
    Base.metadata,
    Column("reminder_id", Integer, ForeignKey("reminders.id")),
    Column("assignee_id", Integer, ForeignKey("users.id"))
)

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    assignees = relationship('User', secondary='user_reminders', back_populates="assigned_reminders")
    assignor_id = Column(Integer, ForeignKey('users.id'))
    assignor = relationship('User', back_populates="created_reminders")
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    actions = relationship("Action", back_populates="reminder")
    acknowledgements = relationship("Acknowledgement", back_populates="reminder")
    start_date = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=False)
    priority = Column(Integer, nullable=True)
    recurring = Column(Boolean, default=False)
    recurrence_type = Column(String(50), nullable=True)
    recurrence_end = Column(DateTime, nullable=True)
    status = Column(String(50), default="Pending")


class Acknowledgement(Base):
    __tablename__ = "acknowledgements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    reminder_id = Column(Integer, ForeignKey("reminders.id"))
    reminder = relationship("Reminder", back_populates="acknowledgements")
    assignee_id = Column(Integer, ForeignKey("users.id"))
