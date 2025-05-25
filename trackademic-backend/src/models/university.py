from sqlalchemy import Column, ForeignKey, Integer, String
from src.db.postgres import Base
from sqlalchemy.orm import relationship

# Definición de las tablas de la universidad que se van a usar. Corresponde a la base de datos PostgreSQL de supabase.
class Subject(Base):
    __tablename__ = 'subjects'
    code = Column(String(10), primary_key=True)
    name = Column(String(30))
    program_code = Column(Integer, ForeignKey('programs.code'))
    program = relationship("Program", back_populates="subjects")

class Program(Base):
    __tablename__ = 'programs'
    code = Column(Integer, primary_key=True)
    name = Column(String(40))
    area_code = Column(Integer, ForeignKey('areas.code'))
    area = relationship("Area", back_populates="programs")
    subjects = relationship("Subject", back_populates="program")

class Area(Base):
    __tablename__ = 'areas'
    code = Column(Integer, primary_key=True)
    name = Column(String(20))
    faculty_code = Column(Integer, ForeignKey('faculties.code'))
    faculty = relationship("Faculty", back_populates="areas")
    programs = relationship("Program", back_populates="area")

class Faculty(Base):
    __tablename__ = 'faculties'
    code = Column(Integer, primary_key=True)
    name = Column(String(20))
    areas = relationship("Area", back_populates="faculty")