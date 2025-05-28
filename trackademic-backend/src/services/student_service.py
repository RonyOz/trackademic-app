from src.models.student_data import EvaluationPlan, EvaluationActivity
from src.db.mongo import db
from typing import List

def createStudent(student):
    """
    Create a new student in the database with basic validations.
    """
    # Basic validation: check required fields
    required_fields = ["full_name", "email", "id"]
    for field in required_fields:
        if not hasattr(student, field) or getattr(student, field) is None:
            raise ValueError(f"Missing required field: {field}")

    # Check for duplicate student_id or email
    if db.students.find_one({"id": student.id}):
        raise ValueError("Student with this student_id already exists.")
    if db.students.find_one({"email": student.email}):
        raise ValueError("Student with this email already exists.")

    db.students.insert_one(student.dict())
    return student

def getStudentByEmail(email: str):
    """
    Get a student by their ID.
    """
    student = db.students.find_one({"email": email})

    return student