from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db.postgres import get_db

from src.services.report_service import generate_grades_consolidation

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