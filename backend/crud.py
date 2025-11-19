from sqlalchemy.orm import Session, joinedload
import models, schemas
# People
def get_people(db: Session): return db.query(models.Person).all()
def get_person(db: Session, pid: int): return db.get(models.Person, pid)
def create_person(db: Session, p: schemas.PersonCreate):
    db_p = models.Person(**p.model_dump()); db.add(db_p); db.commit(); db.refresh(db_p); return db_p
def update_person(db: Session, pid: int, p: schemas.PersonCreate):
    db_p = get_person(db, pid); db_p.name=p.name; db_p.email=p.email; db_p.role=p.role; db.commit(); return db_p
def delete_person(db: Session, pid: int):
    db_p = get_person(db, pid); db.delete(db_p); db.commit()
# Projects
def get_projects(db: Session): return db.query(models.Project).options(joinedload(models.Project.people)).all()
def get_project(db: Session, prid: int): return db.get(models.Project, prid)
def create_project(db: Session, pr: schemas.ProjectCreate):
    db_pr = models.Project(**pr.model_dump()); db.add(db_pr); db.commit(); db.refresh(db_pr); return db_pr
def update_project(db: Session, prid: int, pr: schemas.ProjectCreate):
    db_pr = get_project(db, prid); db_pr.title=pr.title; db_pr.description=pr.description; db_pr.owner_id=pr.owner_id; db.commit(); return db_pr
def delete_project(db: Session, prid: int):
    db_pr = get_project(db, prid); db.delete(db_pr); db.commit()
# Assignments
def assign_person(db: Session, prid: int, pid: int):
    db_pr = get_project(db, prid); db_p = get_person(db, pid); db_pr.people.append(db_p); db.commit()
def unassign_person(db: Session, prid: int, pid: int):
    db_pr = get_project(db, prid); db_p = get_person(db, pid); db_pr.people.remove(db_p); db.commit()