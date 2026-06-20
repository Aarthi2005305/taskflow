from sqlalchemy import Column, Integer, String, Text, Enum, Date, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    tasks = relationship("Task", back_populates="owner")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(Enum("pending", "in_progress", "done"), default="pending")
    due_date = Column(Date)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="tasks")