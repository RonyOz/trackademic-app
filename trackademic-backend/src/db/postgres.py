import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Conexión Supabase
def get_engine():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise ValueError("error using .env")
    
    return create_engine(db_url)

# Configuración
engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()