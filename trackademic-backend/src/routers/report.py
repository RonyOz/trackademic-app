from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db.postgres import get_db

from src.services.report_service import generate_grades_consolidation
from src.services.EvaluationPlanService import get_plan_and_commentNumber, comments_mean, ordered_plans_with_top_activity


router = APIRouter(
    prefix="/reports",
    tags=["reports"],
)

@router.get("/grades-consolidation/{student_id}/{semester}")
def get_consolidation(student_id: str, semester: str, db: Session = Depends(get_db)):
    try:
        return generate_grades_consolidation(db, student_id, semester)
    except Exception as e:
        return {"error": str(e)}, 500

@router.get("/comments/{student_id}")
def get_comments_report(student_id: str):
    try:
        comments_per_plan = get_plan_and_commentNumber(student_id=student_id),  #eso es una LISTA DE DICCIONARIOS: {plan, commentCount}. El plan es lit el objeto EvaluationPlan
        comments_mean = comments_mean(student_id=student_id)  #este es el promedio de comentarios en todos los planes del estudiante
        return comments_per_plan, comments_mean #devuelve el diccionario con c/plan y su # de comments + promedio de comentarios
    except Exception as e:
        return {"error": str(e)}, 500

#Reporte SEMESTRAL de los planes ordenados por actividad con mayor porcentaje junto con la actividad
@router.get("/percentages/{semester}")
def get_percentages_report(semester: str, db: Session = Depends(get_db)):
    try:
        ordered_plans = ordered_plans_with_top_activity(semester=semester)
        return ordered_plans  #devuelve una lista de tuplas de planes ordenados con su actividad con mayor porcentaje
    except Exception as e:
        return {"error": str(e)}, 500