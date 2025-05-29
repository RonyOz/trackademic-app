from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field, ConfigDict
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
    id: Optional[str] = Field(None, alias="_id")  # Use 'id' as field name but map to '_id' in MongoDB
    student_id: str             
    subject_code: str           
    semester: str               
    activities: List[EvaluationActivity]
    average: Optional[float] = None 
    created_at: datetime = datetime.now()
    Comments: List[Comment] = []

    model_config = ConfigDict(
        populate_by_name=True,  # Replaces allow_population_by_field_name
        json_encoders={
            ObjectId: str  # Convert ObjectId to string when serializing to JSON
        },
        arbitrary_types_allowed=True
    )
    
class Student(BaseModel):
    id: str
    email: EmailStr
    password: str
    full_name: str

class CommentIn(BaseModel):
    author_id: str
    content: str