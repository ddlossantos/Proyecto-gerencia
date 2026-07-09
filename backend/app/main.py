import os

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, repository, schemas
from .database import Base, SessionLocal, engine, get_db
from .seed import reset_demo_data, seed_demo_data

app = FastAPI(
    title="Sistema de Gestion de Recursos Humanos",
    description="Backend del proyecto semestral de Gerencia de Recursos Humanos.",
    version="1.0.0",
)

origins = [
    item.strip()
    for item in os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if item.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_demo_data(db, employee_count=300)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/seed")
def seed(reset: bool = False, employees: int = Query(default=300, ge=300, le=1000), db: Session = Depends(get_db)):
    if reset:
        reset_demo_data(db, employee_count=employees)
    else:
        seed_demo_data(db, employee_count=employees)
    return {"status": "ok", "employees": db.query(models.Employee).count()}


@app.get("/api/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    return repository.dashboard(db)


@app.get("/api/departments")
def get_departments(db: Session = Depends(get_db)):
    return repository.list_departments(db)


@app.post("/api/departments")
def post_department(payload: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    return repository.create_department(db, payload)


@app.get("/api/employees")
def get_employees(
    q: str | None = None,
    department_id: int | None = None,
    status: str | None = "todos",
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return repository.list_employees(db, q=q, department_id=department_id, status=status, limit=limit)


@app.get("/api/employees/options")
def get_employee_options(db: Session = Depends(get_db)):
    return repository.get_active_employee_options(db)


@app.post("/api/employees")
def post_employee(payload: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    try:
        return repository.create_employee(db, payload)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/records/recent")
def get_recent_records(db: Session = Depends(get_db)):
    return repository.recent_records(db)


@app.post("/api/attendance")
def post_attendance(payload: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    return repository.record_attendance(db, payload)


@app.post("/api/absences")
def post_absence(payload: schemas.AbsenceCreate, db: Session = Depends(get_db)):
    return repository.record_absence(db, payload)


@app.post("/api/vacations")
def post_vacation(payload: schemas.VacationCreate, db: Session = Depends(get_db)):
    return repository.record_vacation(db, payload)


@app.post("/api/trainings")
def post_training(payload: schemas.TrainingCreate, db: Session = Depends(get_db)):
    return repository.record_training(db, payload)


@app.post("/api/evaluations")
def post_evaluation(payload: schemas.EvaluationCreate, db: Session = Depends(get_db)):
    return repository.record_evaluation(db, payload)


@app.post("/api/movements")
def post_movement(payload: schemas.MovementCreate, db: Session = Depends(get_db)):
    try:
        return repository.record_movement(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/api/terminations")
def post_termination(payload: schemas.TerminationCreate, db: Session = Depends(get_db)):
    try:
        return repository.record_termination(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/recruitment")
def get_recruitment():
    return repository.recruitment_report()
