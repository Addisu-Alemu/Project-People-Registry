from pydantic import BaseModel, ConfigDict
class PersonBase(BaseModel):
    name: str
    email: str
    role: str | None = None
class PersonCreate(PersonBase): pass
class Person(PersonBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
class ProjectBase(BaseModel):
    title: str
    description: str | None = None
    owner_id: int
class ProjectCreate(ProjectBase): pass
class Project(ProjectBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
class ProjectWithPeople(Project):
    people: list[Person]