from fastapi import FastAPI
from .routers import students, grades, evaluation_plans

app = FastAPI(title="Trackademic API")

app.include_router(students.router)
app.include_router(grades.router)
app.include_router(evaluation_plans.router)
