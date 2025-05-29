from fastapi import APIRouter, Path, HTTPException, Body, Query

from src.services.EvaluationPlanService import delete_activity_from_plan, get_All, get_by_student_id, create_evaluation_plan, add_activities_to_plan, delete_evaluation_plan, get_by_subject_code, update_activity_in_plan, add_comment_to_plan, get_plan, estimate_required_grade

from src.models.student_data import EvaluationPlan, EvaluationActivity, CommentIn

from typing import List

router = APIRouter(
    prefix="/plans",
    tags=["plans"],
)

@router.get("/", response_model=List[EvaluationPlan])
def get_endpoint():
    return get_All()

@router.get("/{semester}/{subject_code}/{student_id}", response_model=EvaluationPlan)
def get_plan_endpoint(
    student_id: str = Path(..., description="ID del estudiante"),
    subject_code: str = Path(..., description="Código de la asignatura"),
    semester: str = Path(..., description="Semestre")
):
    return get_plan(student_id, subject_code, semester)

@router.get("/student/{student_id}", response_model=List[EvaluationPlan])
def get_by_student_endpoint(student_id: str):
    return get_by_student_id(student_id)

@router.get("/subject/{subject_code}", response_model=EvaluationPlan)
def get_by_subject_endpoint(subject_code: str):
    return get_by_subject_code(subject_code) 

@router.post("/", response_model=EvaluationPlan)
def post_endpoint(plan: EvaluationPlan):
    return create_evaluation_plan(plan)

@router.post("/{plan_id}/comments")
def add_comment_endpoint(
    plan_id: str = Path(..., description="ID del plan de evaluación"),
    comment: CommentIn = ...
):
    success = add_comment_to_plan(plan_id, comment)
    if not success:
        raise HTTPException(status_code=404, detail="Plan de evaluación no encontrado o error agregando comentario")
    return {"message": "Comentario agregado exitosamente"}

@router.put("/{semester}/{subject_code}/{student_id}/activities", response_model=EvaluationPlan)
def put_activities_endpoint(
    subject_code: str,
    semester: str,
    student_id: str,
    activities: List[EvaluationActivity] = Body(...)
):
    try:
        updated_plan = add_activities_to_plan(subject_code, semester, student_id, activities)
        return updated_plan
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{semester}/{subject_code}/{student_id}", response_model=str)
def delete_endpoint(subject_code: str, semester: str, student_id: str):
    return delete_evaluation_plan(subject_code, semester, student_id) 

@router.patch("/{semester}/{subject_code}/{student_id}/activities")
def patch_activity(
    semester: str, 
    subject_code: str, 
    student_id: str, 
    name: str = Body(..., embed=True), 
    new_data: dict = Body(..., embed=True)
):
    if new_data.get("_delete"):
        # Handle deletion case
        return delete_activity_from_plan(semester, student_id, subject_code, name)
    else:
        # Handle normal update case
        return update_activity_in_plan(semester, student_id, subject_code, name, new_data)

@router.get("/estimate-grade", response_model=float)
def estimate_grade_endpoint(
    student_id: str = Query(..., description="ID del estudiante"),
    subject_code: str = Query(..., description="Código de la asignatura"),
    semester: str = Query(..., description="Semestre")
):
    return estimate_required_grade(student_id, subject_code, semester)
