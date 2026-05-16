from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import jwt

import models, schemas, crud, auth
from database import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Team Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Team Task Manager API is running!"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Dependency ---
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except jwt.PyJWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

# --- Auth Endpoints ---
@app.post("/api/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/api/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"email": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me", response_model=schemas.UserWithDetails)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/api/users", response_model=list[schemas.User])
def read_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    return crud.get_users(db)

# --- Projects Endpoints ---
@app.post("/api/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    return crud.create_project(db=db, project=project, owner_id=current_user.id)

@app.get("/api/projects", response_model=list[schemas.ProjectWithTasks])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.get("/api/projects/{project_id}", response_model=schemas.ProjectWithTasks)
def read_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = crud.get_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# --- Tasks Endpoints ---
@app.post("/api/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    return crud.create_task(db=db, task=task)

@app.get("/api/tasks", response_model=list[schemas.Task])
def read_tasks(project_id: int = None, assignee_id: int = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # If standard user, they might only see tasks assigned to them.
    # But let's allow anyone to see any tasks if they have access to the platform for simplicity,
    # or enforce seeing only their own tasks if they are a member and no project filter is passed.
    if current_user.role == models.RoleEnum.member and assignee_id is None and project_id is None:
        assignee_id = current_user.id
    
    return crud.get_tasks(db, project_id=project_id, assignee_id=assignee_id)

@app.put("/api/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Members can only update their own tasks, Admins can update any
    if current_user.role != models.RoleEnum.admin and task.assignee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
        
    # Prevent member from changing fields other than status (simple RBAC)
    if current_user.role != models.RoleEnum.admin:
        # A member shouldn't reassign or change the title, just the status
        task_update = schemas.TaskUpdate(status=task_update.status)

    return crud.update_task(db=db, task_id=task_id, task_update=task_update)

# --- Dashboard Endpoints ---
@app.get("/api/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    assignee_id = current_user.id if current_user.role == models.RoleEnum.member else None
    tasks = crud.get_tasks(db, assignee_id=assignee_id)
    
    summary = {
        "total": len(tasks),
        "todo": sum(1 for t in tasks if t.status == models.TaskStatusEnum.todo),
        "in_progress": sum(1 for t in tasks if t.status == models.TaskStatusEnum.in_progress),
        "done": sum(1 for t in tasks if t.status == models.TaskStatusEnum.done),
    }
    return summary
