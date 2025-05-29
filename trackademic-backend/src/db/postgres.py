from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
load_dotenv()
import os

# DATABASE_URL = os.getenv("SUPABASE_DB_URL")

# if not DATABASE_URL:
#     raise ValueError("SUPABASE_DB_URL no está definido en las variables de entorno")

# engine = create_engine(DATABASE_URL)

# DATABASE_URL = "postgresql://postgres:qJrTT5JzXjab259P@db.njxhlrmoinbjadcgtyut.supabase.co:5432/postgres"
DATABASE_URL = "postgresql://postgres.njxhlrmoinbjadcgtyut:qJrTT5JzXjab259P@aws-0-us-east-2.pooler.supabase.com:6543/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
