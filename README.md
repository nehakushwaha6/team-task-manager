# Team Task Manager

A full-stack Task Management System where users can create projects, assign tasks, and track progress with role-based access.(Admin/Member).
## 📌 Features

✅ User Authentication (Signup/Login)  
✅ Role-based Access (Admin / Member)  
✅ Project Management  
✅ Task Creation & Assignment  
✅ Task Status Tracking (Pending / In Progress / Completed)  
✅ Dashboard with Task Overview  
✅ Overdue Task Tracking  
✅ Responsive UI 

## 🛠️ Tech Stack

### 🔹 Frontend
- React.js (Vite)
- Context API
- Axios
- CSS / Tailwind

### 🔹 Backend
- FastAPI (Python)
- REST APIs
- JWT Authentication

### 🔹 Database
- MySQL (Railway)

---
## 📂 Project Structure


team-task-manager/
│
├── backend/ # FastAPI Backend
│ ├── main.py
│ ├── models/
│ ├── routes/
│ ├── database/
│ └── requirements.txt
│
├── frontend/ # React Frontend
│ ├── src/
│ ├── components/
│ ├── context/
│ └── package.json
│
└── README.md


---
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

  **Live Application:** [https://team-task-manager-front-production.up.railway.app/](https://team-task-manager-front-production.up.railway.app/)
**GitHub Repository:** [https://github.com/nehakushwaha6/team-task-manager](https://github.com/nehakushwaha6/team-task-manager))
*   Projects CRUD (Admin).
*   Task Assignment & Tracking.
*   Responsive Dashboard UI with glassmorphism design.
