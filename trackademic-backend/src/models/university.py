from sqlalchemy import Column, Integer, String
from src.db.postgres import Base

# Definición de las tablas de la universidad que se van a usar. Corresponde a la base de datos PostgreSQL de supabase.
class Subject(Base):
    __tablename__ = 'subjects'
    code = Column(String(10), primary_key=True)
    name = Column(String(30))

class Program(Base):
    __tablename__ = 'programs'
    code = Column(Integer, primary_key=True)
    name = Column(String(40))

class Faculty(Base):
    __tablename__ = 'faculties'
    code = Column(Integer, primary_key=True)
    name = Column(String(20))

class Area(Base):
    __tablename__ = 'areas'
    code = Column(Integer, primary_key=True)
    name = Column(String(20))

# Tabla adicional para vincular estudiantes
class Student(Base):
    __tablename__ = 'students'
    id = Column(String(15), primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)
    full_name = Column(String)