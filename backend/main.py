from fastapi import FastAPI, Depends, HTTPException

import traceback
from sqlalchemy.orm import Session
from database import get_db, engine
import models, schemas, crud
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Response
from fastapi.responses import StreamingResponse
from typing import List
import crud
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Project-People Registry")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
# People endpoints
@app.get("/people", response_model=list[schemas.Person])
def read_people(db: Session = Depends(get_db)): return crud.get_people(db)
@app.post("/people", response_model=schemas.Person)
def create_person(p: schemas.PersonCreate, db: Session = Depends(get_db)): return crud.create_person(db, p)
@app.put("/people/{pid}", response_model=schemas.Person)
def update_person(pid: int, p: schemas.PersonCreate, db: Session = Depends(get_db)): return crud.update_person(db, pid, p)
@app.delete("/people/{pid}")
def delete_person(pid: int, db: Session = Depends(get_db)): crud.delete_person(db, pid)
# Project endpoints
@app.get("/projects", response_model=list[schemas.ProjectWithPeople])
def read_projects(db: Session = Depends(get_db)): return crud.get_projects(db)
@app.post("/projects", response_model=schemas.Project)
def create_project(pr: schemas.ProjectCreate, db: Session = Depends(get_db)): return crud.create_project(db, pr)
@app.put("/projects/{prid}", response_model=schemas.Project)
def update_project(prid: int, pr: schemas.ProjectCreate, db: Session = Depends(get_db)): return crud.update_project(db, prid, pr)
@app.delete("/projects/{prid}")
def delete_project(prid: int, db: Session = Depends(get_db)): crud.delete_project(db, prid)
# Assignment endpoints
@app.post("/projects/{prid}/people/{pid}")
def assign(prid: int, pid: int, db: Session = Depends(get_db)): crud.assign_person(db, prid, pid)
@app.delete("/projects/{prid}/people/{pid}")
def unassign(prid: int, pid: int, db: Session = Depends(get_db)): crud.unassign_person(db, prid, pid)

@app.get("/export/projects")
def export_projects(db: Session = Depends(get_db)):
    return StreamingResponse(
        crud.iter_projects_csv(db),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=projects.csv"}
    )

@app.get("/export/people")
def export_people(db: Session = Depends(get_db)):
    return StreamingResponse(
        crud.iter_people_csv(db),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=people.csv"}
    )

# @app.post("/projects/{pid}/people/bulk")
# def bulk_assign(pid: int, person_ids: List[int], db: Session = Depends(get_db)):
#     for pid_ins in person_ids:
#         # skip if already assigned
#         exists = db.query(models.project_person).filter_by(project_id=pid, person_id=pid_ins).first()
#         if not exists:
#             crud.assign_person(db, pid, pid_ins)
#     return {"ok": True}


@app.post("/projects/{pid}/bulk/people")
def bulk_assign(pid: int, person_ids: List[int], db: Session = Depends(get_db)):
    try:
        for pid_ins in person_ids:
            exists = db.query(models.project_person).filter_by(project_id=pid, person_id=pid_ins).first()
            if not exists:
                crud.assign_person(db, pid, pid_ins)
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e) + "  " + traceback.format_exc())