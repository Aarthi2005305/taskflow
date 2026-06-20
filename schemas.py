from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

# ── User Schemas ──

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    model_config = {"from_attributes": True}

# ── Login Schema ──

class Login(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# ── Task Schemas ──

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"
    due_date: Optional[date] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    due_date: Optional[date]
    user_id: int

    model_config = {"from_attributes": True}