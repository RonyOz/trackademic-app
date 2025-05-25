from fastapi import APIRouter
from src.services.EvaluationPlanService import (get_All, get_by_student_id, create_evaluation_plan, add_activities_to_plan, delete_evaluation_plan)
from src.models.student_data import EvaluationPlan, EvaluationActivity
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

#CREATE EVALUATION PLAN (WITHOUT ACTIVITIES)
@router.post("/", response_model=EvaluationPlan)
def post_endpoint(plan: EvaluationPlan):
    return create_evaluation_plan(plan)

#ADD ACTIVITIES TO EVALUATION PLAN
@router.put("/activities/{subject_code}", response_model=EvaluationPlan)
def put_endpoint(subject_code: str, activities: List[EvaluationActivity]):
    return add_activities_to_plan(subject_code, activities)

@router.delete("/{subject_code}")
def delete_endpoint(subject_code: str):
    return delete_evaluation_plan(subject_code) 