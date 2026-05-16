# Team Task Manager

**Live Application:** [https://team-task-manager-front-production.up.railway.app/](https://team-task-manager-front-production.up.railway.app/)
**GitHub Repository:** [https://github.com/anisha90-svg/team-task-manager](https://github.com/anisha90-svg/team-task-manager)

A full-stack web application for team task management with role-based access control (Admin/Member).

## Tech Stack
*   **Frontend**: React (Vite), React Router, Axios, Vanilla CSS
*   **Backend**: Python, FastAPI, SQLAlchemy, PyJWT
*   **Database**: MySQL (Defaulting to SQLite locally for easy setup)

## Local Development

### 1. Backend Setup
1.  Navigate to the `backend` directory.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4.  Install dependencies: `pip install -r requirements.txt`
5.  Run the API: `uvicorn main:app --reload`
6.  The API will be available at `http://localhost:8000`, and interactive docs at `http://localhost:8000/docs`

*Note: By default, the backend uses SQLite. To use MySQL locally, create a `.env` file in the `backend` folder with `DATABASE_URL=mysql+pymysql://user:password@localhost/dbname`.*

### 2. Frontend Setup
1.  Install Node.js from [nodejs.org](https://nodejs.org/).
2.  Navigate to the `frontend` directory.
3.  Install dependencies: `npm install`
4.  Run the development server: `npm run dev`

## Deployment to Railway

This project is structured to be deployed easily on Railway. You can deploy the Frontend, Backend, and a MySQL Database as separate services within a single Railway project.

1.  **Database**: In your Railway project, click "New" -> "Database" -> "Add MySQL".
2.  **Backend**: 
    *   Click "New" -> "GitHub Repo" -> Select your repository.
    *   In the service settings, change the "Root Directory" to `/backend`.
    *   Railway will automatically detect `requirements.txt` and `main.py` (FastAPI).
    *   Add the `DATABASE_URL` environment variable from the MySQL service you just created.
    *   Add a `SECRET_KEY` environment variable.
    *   Set the Custom Start Command if necessary: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3.  **Frontend**:
    *   Click "New" -> "GitHub Repo" -> Select your repository.
    *   In the service settings, change the "Root Directory" to `/frontend`.
    *   Railway will detect Vite and build the static site.
    *   *Important*: You will need to update the API base URL in `frontend/src/context/AuthContext.jsx` to point to your new Railway backend URL instead of `http://localhost:8000`. You can also do this via an environment variable (e.g. `VITE_API_URL`).

## Features implemented
*   Signup & Login with JWT Authentication.
*   Role-Based Access Control (Admin vs Member).
*   Projects CRUD (Admin).
*   Task Assignment & Tracking.
*   Responsive Dashboard UI with glassmorphism design.
