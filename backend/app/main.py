from contextlib import asynccontextmanager
import os
import secrets

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, Query, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import models, repository, schemas
from .database import Base, SessionLocal, engine, get_db
from .seed import reset_demo_data, seed_demo_data


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_demo_data(db, employee_count=300)
    yield


app = FastAPI(
    title="Sistema de Gestión de Recursos Humanos",
    description="Backend del proyecto semestral de Gerencia de Recursos Humanos.",
    version="1.0.0",
    lifespan=lifespan,
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


@app.exception_handler(ValueError)
async def value_error_handler(_request: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


@app.exception_handler(IntegrityError)
async def integrity_error_handler(_request: Request, _exc: IntegrityError):
    return JSONResponse(
        status_code=409,
        content={"detail": "El registro está duplicado o hace referencia a datos no válidos."},
    )


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/seed")
def seed(
    reset: bool = False,
    employees: int = Query(default=300, ge=300, le=1000),
    reset_key: str | None = Header(default=None, alias="X-Demo-Reset-Key"),
    db: Session = Depends(get_db),
):
    if reset:
        expected_key = os.getenv("DEMO_RESET_KEY")
        if not expected_key or not reset_key or not secrets.compare_digest(reset_key, expected_key):
            raise HTTPException(
                status_code=403,
                detail="La regeneración de datos requiere la clave de demostración.",
            )
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


@app.put("/api/departments/{department_id}")
def put_department(
    department_id: int,
    payload: schemas.DepartmentCreate,
    db: Session = Depends(get_db),
):
    return repository.update_department(db, department_id, payload)


@app.delete("/api/departments/{department_id}")
def delete_department(department_id: int, db: Session = Depends(get_db)):
    return repository.delete_department(db, department_id)


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


@app.get("/api/vacancies")
def get_vacancies():
    return repository.list_vacancies()


@app.get("/api/evaluations")
def get_evaluations(
    codigo_empresa: str | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return repository.list_evaluations(db, codigo_empresa=codigo_empresa, limit=limit)


@app.post("/api/employees")
def post_employee(payload: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return repository.create_employee(db, payload)


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
    return repository.record_movement(db, payload)


@app.post("/api/terminations")
def post_termination(payload: schemas.TerminationCreate, db: Session = Depends(get_db)):
    return repository.record_termination(db, payload)


@app.get("/api/recruitment")
def get_recruitment():
    return repository.recruitment_report()


@app.post("/api/recruitment/analyze")
async def post_recruitment_analysis(
    file: UploadFile = File(...),
    keywords: str | None = Form(default=None),
):
    content = await file.read()
    return repository.analyze_cv(file.filename or "hoja_de_vida.txt", content, keywords)
