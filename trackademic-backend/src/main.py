from fastapi import FastAPI
from .routers import auth, evaluation_plans, university, report
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI


load_dotenv()

app = FastAPI(title="Trackademic API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(auth.router)
app.include_router(university.router)
app.include_router(evaluation_plans.router)
app.include_router(report.router)
