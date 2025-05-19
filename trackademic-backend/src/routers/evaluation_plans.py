from fastapi import APIRouter
from src.services.EvaluationPlanService import (get_All, get_by_student_id)
from src.models.student_data import EvaluationPlan
from typing import List

router = APIRouter(
    prefix="/plans",
    tags=["plans"],
)

#GET ALL
@router.get("/", response_model=List[EvaluationPlan])
def get_endpoint():
    return get_All() #AGREGAR EXEPCIONES???

#GET BY STUDENT ID
@router.get("/student/{student_id}", response_model=List[EvaluationPlan])
def get_byStudent_endpoint(student_id: str):
    return get_by_student_id(student_id) #AGREGAR EXEPCIONES???

@router.post("/")
def post_endpoint():
    return {"message": "POST request to /plans endpoint"}

@router.put("/")
def put_endpoint():
    return {"message": "PUT request to /plans endpoint"}

@router.delete("/")
def delete_endpoint():
    return {"message": "DELETE request to /plans endpoint"} 