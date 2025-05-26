from src.db.postgres import get_db
from src.models.university import Faculty, Area, Program, Subject
from sqlalchemy.orm import joinedload, Session
from typing import List

def get_all(session: Session) -> List[Faculty]:
    """
    Get all faculties with areas, programs, and subjects.
    """
    faculties = session.query(Faculty).options(
        joinedload(Faculty.areas)
            .joinedload(Area.programs)
            .joinedload(Program.subjects)
    ).all()
    return faculties

def get_subject_name_by_code(session: Session, code: str) -> str:
    """
    Get the subject name by its code.
    """
    subject = session.query(Subject).filter(Subject.code == code).first()
    if subject:
        return subject.name
    else:
        raise ValueError(f"Subject with code {code} not found.")