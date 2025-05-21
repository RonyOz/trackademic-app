from src.models.student_data import EvaluationPlan, EvaluationActivity
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

def create_evaluation_plan(evaluation_plan: EvaluationPlan) -> EvaluationPlan:
    """
    Create a new evaluation plan in the database.
    """
    db.evaluation_plans.insert_one(evaluation_plan.dict())
    return evaluation_plan

def add_activities_to_plan(subject_code: str, activities: List[EvaluationActivity]) -> EvaluationPlan:
    """
    Add activities to an existing evaluation plan.
    """
    evaluation_plan = db.evaluation_plans.find_one({"subject_code": subject_code})
    if not evaluation_plan:
        raise ValueError("Evaluation plan not found")
    
    #Check 100% in activities
    total_percentage = sum(activity.percentage for activity in activities)
    if total_percentage != 100:
        raise ValueError("Total percentage of activities must be 100%")

    # Update the evaluation plan with new activities
    db.evaluation_plans.update_one(
        {"subject_code": subject_code},
        {"$addToSet": {"activities": {"$each": activities}}}
    )
    
    return EvaluationPlan(**evaluation_plan)  # Return the updated evaluation plan

def delete_evaluation_plan(subject_code: str) -> str:
    """
    Delete an evaluation plan by subject code.
    """
    result = db.evaluation_plans.delete_one({"subject_code": subject_code})
    if result.deleted_count == 0:
        raise ValueError("Evaluation plan not found")
    return f"Evaluation plan with subject code {subject_code} deleted successfully"

