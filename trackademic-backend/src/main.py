from fastapi import FastAPI
from .routers import auth, evaluation_plans, university
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI


load_dotenv()

app = FastAPI(title="Trackademic API")

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],                # Métodos HTTP permitidos (GET, POST, etc.)
    allow_headers=["*"],                # Headers permitidos (como Authorization)
)



app.include_router(auth.router)
app.include_router(university.router)
app.include_router(evaluation_plans.router)


