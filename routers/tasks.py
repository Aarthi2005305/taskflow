from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Task, User
from schemas import TaskCreate, TaskResponse
from typing import List
import jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
SECRET_KEY = "abc123def456ghi789jkl012"
ALGORITHM = "HS256"
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        due_date=task.due_date,
        user_id=user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    tasks = db.query(Task).filter(Task.user_id == user.id).all()
    return tasks

@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db_task.title = task.title
    db_task.description = task.description
    db_task.status = task.status
    db_task.due_date = task.due_date
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}