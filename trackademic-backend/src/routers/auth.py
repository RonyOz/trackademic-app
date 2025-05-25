from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm

from ..models.student_data import Student

from ..services.student_service import (createStudent, getStudentByEmail)

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRegister(BaseModel):
    id: str
    email: EmailStr
    password: str
    full_name: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str

@router.post("/register", response_model=UserOut)
def register(user: UserRegister):
    existing_user = getStudentByEmail(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)

    new_student = Student(
        id=user.id,
        email=user.email,
        password=hashed_password,
        full_name=user.full_name
    )
    
    user_out = createStudent(new_student)
    
    return UserOut(
        id=user_out.id,
        email=user_out.email,
        full_name=user_out.full_name
    )

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    student_data = getStudentByEmail(form_data.username)

    if not student_data:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    student = Student(**student_data)

    if not student or not pwd_context.verify(form_data.password, student.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": student.email, "token_type": "bearer"}