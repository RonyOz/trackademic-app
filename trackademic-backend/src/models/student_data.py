from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# Definicion de los objetos NoSQl.
class EvaluationActivity(BaseModel):
    name: str                  
    percentage: float           
    grade: Optional[float] = None
    due_date: Optional[datetime] = None 

class Comment(BaseModel):
    author_id: str
    content: str
    created_at: datetime = datetime.now()

class EvaluationPlan(BaseModel):
    student_id: str             
    subject_code: str           
    semester: str               
    activities: List[EvaluationActivity]
    average: Optional[float] = None 
    created_at: datetime = datetime.now()
    Comments: List[Comment] = []
    
class Student(BaseModel):
    id: str
    email: EmailStr
    password: str
    full_name: str

class CommentIn(BaseModel):
    author_id: str
    content: str