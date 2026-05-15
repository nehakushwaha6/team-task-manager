from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    member = "member"

class TaskStatusEnum(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(Enum(RoleEnum), default=RoleEnum.member)

    projects = relationship("Project", back_populates="owner", foreign_keys="Project.owner_id")
    tasks = relationship("Task", back_populates="assignee", foreign_keys="Task.assignee_id")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="projects", foreign_keys=[owner_id])
    tasks = relationship("Task", back_populates="project")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True)
    description = Column(String(255), nullable=True)
    status = Column(Enum(TaskStatusEnum), default=TaskStatusEnum.todo)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project_id = Column(Integer, ForeignKey("projects.id"))
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks", foreign_keys=[assignee_id])
