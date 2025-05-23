from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..services.university_service import get_all
from ..db.postgres import get_db

router = APIRouter(
    prefix="/university",
    tags=["university"],
)

@router.get("/")
def get_university_data(db: Session = Depends(get_db)):
    return get_all(db)
