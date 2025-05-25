from fastapi import APIRouter
from src.services.EvaluationPlanService import (get_All, get_by_student_id, create_evaluation_plan, add_activities_to_plan, delete_evaluation_plan, get_by_subject_code)
from src.models.student_data import EvaluationPlan, EvaluationActivity
from typing import List

router = APIRouter(
    prefix="/plans",
    tags=["plans"],
)

@router.get("/", response_model=List[EvaluationPlan])
def get_endpoint():
    return get_All()

@router.get("/student/{student_id}", response_model=List[EvaluationPlan])
def get_by_student_endpoint(student_id: str):
    return get_by_student_id(student_id)

@router.get("/subject/{subject_code}", response_model=EvaluationPlan)
def get_by_subject_endpoint(subject_code: str):
    return get_by_subject_code(subject_code) 

@router.post("/", response_model=EvaluationPlan)
def post_endpoint(plan: EvaluationPlan):
    return create_evaluation_plan(plan)

# Pueden haber varios planes por materia, por lo que se puede agregar actividades a un plan equivocado
@router.put("/activities/{subject_code}", response_model=EvaluationPlan)
def put_endpoint(subject_code: str, activities: List[EvaluationActivity]):
    return add_activities_to_plan(subject_code, activities)

# Puede haber varios planes por materia, por lo que se puede eliminar un plan equivocado
@router.delete("/{subject_code}")
def delete_endpoint(subject_code: str):
    return delete_evaluation_plan(subject_code) 