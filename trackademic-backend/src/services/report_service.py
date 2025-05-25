from typing import Dict
from src.db.mongo import db
from src.services.university_service import get_subject_name_by_code

def generate_grades_consolidation(postgres_db ,student_id: str, semester: str) -> Dict[str, float]:
    """
    Retorna las notas finales por curso (subject_code) para un estudiante en un semestre específico.
    """
    evaluation_plans = db.evaluation_plans.find({
        "student_id": student_id,
        "semester": semester
    })
    final_grades = {}

    for plan in evaluation_plans:
        subject_code = plan.get("subject_code")

        subject_name = get_subject_name_by_code(postgres_db, subject_code)
        
        average = plan.get("average")

        final_grades[subject_name] = round(average, 2) if average is not None else None

    return final_grades
