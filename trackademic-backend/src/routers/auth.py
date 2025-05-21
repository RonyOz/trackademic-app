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
    email: EmailStr
    password: str
    full_name: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str

@router.post("/register", response_model=UserOut)
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(Student).filter(Student.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)

    new_student = Student(
        id=user.id,
        email=user.email,
        password=hashed_password,
        full_name=user.full_name
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return UserOut(
        id=new_student.id,
        email=new_student.email,
        full_name=new_student.full_name
    )


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == form_data.username).first()
    if not student or not pwd_context.verify(form_data.password, student.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": student.email, "token_type": "bearer"}