from src.models.student_data import EvaluationPlan, EvaluationActivity, CommentIn
from fastapi import HTTPException
from src.db.mongo import db
from datetime import datetime
from bson import ObjectId
from typing import List

def get_All() -> List[EvaluationPlan]:
    """
    Get all evaluation plans from the database.
    """
    evaluation_plans = db.evaluation_plans.find()
    return [EvaluationPlan(**plan) for plan in evaluation_plans]

def get_by_student_id(student_id: str) -> List[EvaluationPlan]:
    """
    Get evaluation plans by student ID.
    """
    evaluation_plans = db.evaluation_plans.find({"student_id": student_id})
    return [EvaluationPlan(**plan) for plan in evaluation_plans]

def get_by_subject_code(subject_code: str) -> List[EvaluationPlan]:
    """
    Get evaluation plans by subject code.
    """
    evaluation_plans = list(db.evaluation_plans.find({"subject_code": subject_code}))
    if not evaluation_plans:
        return []
    return [EvaluationPlan(**plan) for plan in evaluation_plans]

def create_evaluation_plan(evaluation_plan: EvaluationPlan) -> EvaluationPlan:
    """
    Create a new evaluation plan in the database.
    """
    evaluation_plan.average = calculate_average(evaluation_plan)
    db.evaluation_plans.insert_one(evaluation_plan.model_dump())
    return evaluation_plan

def add_activities_to_plan(subject_code: str, semester: str, activities: List[EvaluationActivity]) -> EvaluationPlan:
    """
    Add activities to an existing evaluation plan filtered by subject_code and semester.
    Validates that the sum of activity percentages is exactly 100%.
    """
    evaluation_plan = db.evaluation_plans.find_one({
        "subject_code": subject_code,
        "semester": semester
    })
    if not evaluation_plan:
        raise HTTPException(status_code=404, detail="Evaluation plan not found for given subject and semester")
    
    total_percentage = sum(activity.percentage for activity in activities)
    if abs(total_percentage - 100) > 0.01:
        raise HTTPException(status_code=400, detail=f"Total percentage of activities must be 100%, but got {total_percentage}%")

    # Update the evaluation plan with new activities
    evaluation_plan.average = calculate_average(evaluation_plan)
    # Actualiza el plan reemplazando actividades completas
    db.evaluation_plans.update_one(
        {"subject_code": subject_code, "semester": semester},
        {"$set": {"activities": [activity.dict() for activity in activities]}}
    )
    
    updated_plan = db.evaluation_plans.find_one({"subject_code": subject_code, "semester": semester})
    return EvaluationPlan(**updated_plan)

def delete_evaluation_plan(subject_code: str) -> str:
    """
    Delete an evaluation plan by subject code.
    """
    result = db.evaluation_plans.delete_one({"subject_code": subject_code})
    if result.deleted_count == 0:
        raise ValueError("Evaluation plan not found")
    return f"Evaluation plan with subject code {subject_code} deleted successfully"

def calculate_average(plan) -> float:
    if isinstance(plan, dict):
        activities = plan.get("activities", [])
        total = 0.0
        accumulated_percentage = 0.0

        for activity in activities:
            grade = activity.get("grade")
            percentage = activity.get("percentage", 0.0)

            if grade is not None:
                total += grade * (percentage / 100.0)
                accumulated_percentage += percentage

        return total if accumulated_percentage > 0 else None
    elif isinstance(plan, EvaluationPlan):
        activities = plan.activities
        total = 0.0
        accumulated_percentage = 0.0

        for activity in activities:
            grade = activity.grade
            percentage = activity.percentage

            if grade is not None:
                total += grade * (percentage / 100.0)
                accumulated_percentage += percentage

        return total if accumulated_percentage > 0 else None

def calculate_minimum_grade(plan: dict, target_average: float = 3.0) -> float:
    """
    Calculate the minimum grade needed in the last activity to achieve the target average.
    """
    activities = plan.get("activities", [])
    total_percentage = 0.0
    total_weighted_grades = 0.0

    for activity in activities[:-1]:  # Exclude the last activity
        grade = activity.get("grade")
        percentage = activity.get("percentage", 0.0)

        if grade is not None:
            total_weighted_grades += grade * (percentage / 100.0)
            total_percentage += percentage

    last_activity_percentage = activities[-1].get("percentage", 0.0)
    if last_activity_percentage == 0:
        raise ValueError("Last activity percentage cannot be zero")

    # Calculate the minimum grade needed in the last activity
    required_grade = (target_average - total_weighted_grades) / (last_activity_percentage / 100.0)
    
    return required_grade

def update_activity_in_plan(student_id: str, subject_code: str, activity_name: str, new_data: dict) -> dict:
    """
    Update an activity in an existing evaluation plan.
    """
    plan = db.evaluation_plans.find_one({
        "student_id": student_id,
        "subject_code": subject_code
    })

    if not plan:
        raise HTTPException(status_code=404, detail="Evaluation plan not found")

    activities = plan.get("activities", [])
    updated = False

    for i, activity in enumerate(activities):
        if activity.get("name") == activity_name:
            activities[i].update(new_data)
            updated = True
            break

    if not updated:
        raise HTTPException(status_code=404, detail="Activity not found")

    db.evaluation_plans.update_one(
        {"_id": plan["_id"]},
        {"$set": {"activities": activities}}
    )

    return {"message": "Activity updated successfully"}

def add_comment_to_plan(plan_id: str, comment: CommentIn) -> bool:
    """
    Add a comment to an existing evaluation plan by its ID.
    """
    plan = db.evaluation_plans.find_one({"_id": ObjectId(plan_id)})
    if not plan:
        return False

    comment_doc = {
        "author_id": comment.author_id,
        "content": comment.content,
        "created_at": datetime.utcnow()
    }

    result = db.evaluation_plans.update_one(
        {"_id": ObjectId(plan_id)},
        {"$push": {"Comments": comment_doc}}
    )

    return result.modified_count == 1

def estimate_required_grade(student_id: str, subject_code: str, semester: str, passing_grade: float = 3.0) -> float:
    """
    Estima la nota mínima promedio que el estudiante debe obtener en actividades pendientes para aprobar la asignatura.
    Retorna:
      - Nota mínima requerida en pendientes si es posible.
      - 0 si ya ha aprobado con notas actuales.
      - -1 si es imposible alcanzar la nota mínima.
    """
    plan = db.evaluation_plans.find_one({
        "student_id": student_id,
        "subject_code": subject_code,
        "semester": semester
    })

    if not plan:
        raise HTTPException(status_code=404, detail="Plan de evaluación no encontrado para ese estudiante, curso y semestre")

    activities = plan.get("activities", [])

    total_weighted_score = 0.0
    total_weight_completed = 0.0
    total_weight_pending = 0.0

    for activity in activities:
        percentage = activity.get("percentage", 0)
        grade = activity.get("grade")
        if grade is not None:
            total_weighted_score += grade * (percentage / 100)
            total_weight_completed += (percentage / 100)
        else:
            total_weight_pending += (percentage / 100)

    # Si ya todas las notas están ingresadas
    if total_weight_completed == 1.0:
        return 0.0 if total_weighted_score >= passing_grade else -1.0

    # Nota que falta para aprobar
    remaining_needed = passing_grade - total_weighted_score

    if remaining_needed <= 0:
        return 0.0  # Ya aprobó

    if total_weight_pending == 0:
        return -1.0  # No hay pendientes, no puede aprobar

    required_grade_pending = remaining_needed / total_weight_pending

    if required_grade_pending > 5.0:  # Asumiendo escala 0-5
        return -1.0

    if required_grade_pending < 0:
        return 0.0

    return required_grade_pending