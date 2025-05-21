from fastapi import FastAPI
from .routers import auth, students, grades, evaluation_plans
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Trackademic API")

app.include_router(auth.router)

app.include_router(students.router)
app.include_router(grades.router)
app.include_router(evaluation_plans.router)
