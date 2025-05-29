from src.models.student_data import EvaluationPlan, EvaluationActivity, CommentIn
from fastapi import HTTPException
from src.db.mongo import db
from datetime import datetime
from bson import ObjectId
from typing import List, Tuple, Optional

def get_All() -> List[EvaluationPlan]:
    """
    Get all evaluation plans from the database.
    """
    evaluation_plans = db.evaluation_plans.find()
    result = []
    for plan in evaluation_plans:
        plan['_id'] = str(plan['_id'])  # Convert ObjectId to string
        result.append(EvaluationPlan(**plan))
    return result

def get_plan(student_id: str, subject_code: str, semester: str) -> EvaluationPlan:
    evaluation_plan = db.evaluation_plans.find_one({
        "student_id": student_id,
        "subject_code": subject_code,
        "semester": semester
    })
    if not evaluation_plan:
        raise HTTPException(status_code=404, detail="Evaluation plan not found")
    
    # Convert ObjectId to string explicitly
    evaluation_plan['_id'] = str(evaluation_plan['_id'])
    return EvaluationPlan(**evaluation_plan)

def get_by_student_id(student_id: str) -> List[EvaluationPlan]:
    """
    Get evaluation plans by student ID.
    """
    evaluation_plans = db.evaluation_plans.find({"student_id": student_id})
    return [EvaluationPlan(**{**plan, '_id': str(plan['_id'])}) for plan in evaluation_plans]

def get_by_subject_code(subject_code: str) -> List[EvaluationPlan]:
    """
    Get evaluation plans by subject code.
    """
    evaluation_plans = list(db.evaluation_plans.find({"subject_code": subject_code}))
    if not evaluation_plans:
        return []
    return [EvaluationPlan(**{**plan, '_id': str(plan['_id'])}) for plan in evaluation_plans]

def create_evaluation_plan(evaluation_plan: EvaluationPlan) -> EvaluationPlan:
    """
    Create a new evaluation plan in the database.
    """
    semester = evaluation_plan.semester
    subject = evaluation_plan.subject_code
    result = db.evaluation_plans.find_one({
        "subject_code": subject,
        "semester": semester,
        "student_id": evaluation_plan.student_id
    })

    if result:
        raise HTTPException(status_code=400, detail=f"Evaluation plan for subject {subject} in semester {semester} already exists")

    evaluation_plan.average = calculate_average(evaluation_plan)
    db.evaluation_plans.insert_one(evaluation_plan.model_dump())

    inserted_id = db.evaluation_plans.insert_one(evaluation_plan.model_dump()).inserted_id
    created_plan = db.evaluation_plans.find_one({"_id": inserted_id})
    created_plan['_id'] = str(created_plan['_id'])
    return created_plan

def add_activities_to_plan(subject_code: str, semester: str, student_id: str,  activities: List[EvaluationActivity]) -> EvaluationPlan:
    """
    Add activities to an existing evaluation plan filtered by subject_code and semester.
    Validates that the sum of activity percentages is exactly 100%.
    """
    evaluation_plan = db.evaluation_plans.find_one({
        "subject_code": subject_code,
        "semester": semester,
        "student_id": student_id
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
    updated_plan['_id'] = str(updated_plan['_id'])
    return EvaluationPlan(**updated_plan)

def delete_evaluation_plan(subject_code: str, semester: str, student_id: str) -> str:
    """
    Delete an evaluation plan by subject code.
    """
    result = db.evaluation_plans.delete_one({
        "subject_code": subject_code,
        "semester": semester,
        "student_id": student_id
        })
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

def update_activity_in_plan(semester:str ,student_id: str, subject_code: str, activity_name: str, new_data: dict) -> dict:
    """
    Update an activity in an existing evaluation plan.
    """
    plan = db.evaluation_plans.find_one({
        "student_id": student_id,
        "subject_code": subject_code,
        "semester": semester
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

def delete_activity_from_plan(semester: str, student_id: str, subject_code: str, activity_name: str) -> dict:
    """
    Delete an activity from an evaluation plan.
    """
    plan = db.evaluation_plans.find_one({
        "student_id": student_id,
        "subject_code": subject_code,
        "semester": semester
    })

    if not plan:
        raise HTTPException(status_code=404, detail="Evaluation plan not found")

    activities = plan.get("activities", [])
    updated_activities = [a for a in activities if a.get("name") != activity_name]

    if len(updated_activities) == len(activities):
        raise HTTPException(status_code=404, detail="Activity not found")

    db.evaluation_plans.update_one(
        {"_id": plan["_id"]},
        {"$set": {"activities": updated_activities}}
    )

    return {"message": "Activity deleted successfully"}

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
    
    has_recorded_grades = any(activity.get("grade") is not None for activity in activities)
    
    if not has_recorded_grades:
        return -2.0  # Special code for "no grades recorded yet"

    return required_grade_pending

def comments_mean(student_id: str):
    plans = db.evaluation_plans.find({"student_id": student_id})
    total_comments = 0
    for plan in plans:
        total_comments += len(plan.get("Comments", []))
    return total_comments

def comments_by_plan(plan: EvaluationPlan):
    """
    Returns the number of comments in a specific evaluation plan.
    """
    return len(plan.Comments) if plan and plan.Comments else 0

def get_plan_and_commentNumber(student_id: str) -> List[dict]:
    """
    Get evaluation plans and the number of comments for each plan.
    """
    plans = get_by_student_id(student_id)
    result = []
    for plan in plans:
        comment_count = comments_by_plan(plan)
        result.append({
            "plan": plan,
            "comment_count": comment_count
        })
    return result

def get_highest_percentage_activity(plan: EvaluationPlan) -> Optional[EvaluationActivity]:
    if not plan.activities:
        return None
    return max(plan.activities, key=lambda activity: activity.percentage)


def ordered_plans(semester: str) -> List[EvaluationPlan]:

    plans = db.evaluation_plans.find({
        "semester": semester
    }).sort("subject_code")

    result = [EvaluationPlan(**{**plan, '_id': str(plan['_id'])}) for plan in plans]

    result.sort(
        key=lambda x: max((a.percentage for a in x.activities), default=0),
        reverse=True
    )

    return result



def ordered_plans_with_top_activity(semester: str) -> List[Tuple[EvaluationPlan, Optional[EvaluationActivity]]]:
    plans = ordered_plans(semester)
    result = []

    for plan in plans:
        top_activity = get_highest_percentage_activity(plan)
        result.append((plan, top_activity))

    return result