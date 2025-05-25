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