from fastapi import FastAPI
from .routers import auth, evaluation_plans, university
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Trackademic API")

app.include_router(auth.router)
app.include_router(university.router)
app.include_router(evaluation_plans.router)
