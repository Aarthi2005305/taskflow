from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserResponse, Login, Token
from passlib.context import CryptContext
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=4)
SECRET_KEY = "abc123def456ghi789jkl012"
ALGORITHM = "HS256"

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user: Login, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = jwt.encode(
        {"sub": db_user.email},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": token, "token_type": "bearer"}