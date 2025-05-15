from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Definicion de los objetos NoSQl.
class EvaluationActivity(BaseModel):
    name: str                  
    percentage: float           
    grade: Optional[float] = None 
    due_date: Optional[datetime] = None

class EvaluationPlan(BaseModel):
    student_id: str             
    subject_code: str           
    semester: str               
    activities: List[EvaluationActivity]
    average: Optional[float] = None 
    created_at: datetime = datetime.now()
    
class Comment(BaseModel):
    author_id: str
    content: str
    created_at: datetime = datetime.now()