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
    evaluation_plan.average = calculate_average(evaluation_plan)
    db.evaluation_plans.insert_one(evaluation_plan.model_dump())
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
    evaluation_plan.average = calculate_average(evaluation_plan)
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