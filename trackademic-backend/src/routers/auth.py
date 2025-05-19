from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..models.university import Student
from ..db.postgres import get_db 

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRegister(BaseModel):
    id: str
    password: str

class UserOut(BaseModel):
    id: str

# @router.post("/register", response_model=UserOut)
# def register(user: UserRegister, db: Session = Depends(get_db)):
#     existing_user = db.query(Student).filter(Student.email == user.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Student ID already registered")
#     hashed_password = pwd_context.hash(user.password)
#     new_student = Student(email=user.email, hashed_password=hashed_password)
#     # db.add(new_student)
#     # db.commit()
#     # db.refresh(new_student)
#     return {"email": new_student.email}

# @router.post("/login")
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     student = db.query(Student).filter(Student.email == form_data.username).first()
#     if not student or not pwd_context.verify(form_data.password, student.hashed_password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#     return {"access_token": student.email, "token_type": "bearer"}