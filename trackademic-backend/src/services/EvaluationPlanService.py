from src.models.student_data import EvaluationPlan
from src.db.mongo import db
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


