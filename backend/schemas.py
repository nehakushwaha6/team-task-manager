from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, TaskStatusEnum

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: RoleEnum = RoleEnum.member

class User(UserBase):
    id: int
    role: RoleEnum

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Project Schemas ---
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Task Schemas ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatusEnum = TaskStatusEnum.todo
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    project_id: int
    assignee_id: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatusEnum] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None

class Task(TaskBase):
    id: int
    project_id: int
    assignee_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Extended Schemas ---
class ProjectWithTasks(Project):
    tasks: List[Task] = []

class UserWithDetails(User):
    projects: List[Project] = []
    tasks: List[Task] = []
