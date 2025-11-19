
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
project_person = Table(
    "project_person",
    Base.metadata,
    Column("project_id", ForeignKey("projects.id"), primary_key=True),
    Column("person_id", ForeignKey("people.id"), primary_key=True),
)
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    
    title = Column(String, nullable=False)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("people.id"))
    people = relationship("Person", secondary=project_person, back_populates="projects")
class Person(Base):
    __tablename__ = "people"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String)
    projects = relationship("Project", secondary=project_person, back_populates="people")