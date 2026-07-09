from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class DepartmentCreate(BaseModel):
    nombre_departamento: str = Field(min_length=2, max_length=100)
    descripcion: Optional[str] = None


class EmployeeCreate(BaseModel):
    numero_cedula: str
    nombre: str
    apellido: str
    fecha_nacimiento: date
    nacionalidad: str = "Panameña"
    direccion: str
    telefono_principal: str
    telefono_secundario: Optional[str] = None
    fecha_ingreso: date
    puesto: str
    id_departamento: int
    observaciones: Optional[str] = None


class AttendanceCreate(BaseModel):
    codigo_empresa: str
    fecha: date
    presente: bool = True


class AbsenceCreate(BaseModel):
    codigo_empresa: str
    fecha: date
    motivo: str


class VacationCreate(BaseModel):
    codigo_empresa: str
    fecha_inicio: date
    fecha_fin: date
    observaciones: Optional[str] = None


class TrainingCreate(BaseModel):
    codigo_empresa: str
    nombre_capacitacion: str
    fecha_inicio: date
    fecha_fin: Optional[date] = None


class EvaluationCreate(BaseModel):
    codigo_empresa: str
    fecha_evaluacion: date
    pct_bruto: float = Field(ge=0, le=100)


class TerminationCreate(BaseModel):
    codigo_empresa: str
    fecha_salida: date
    motivo_salida: str
    observaciones: Optional[str] = None


class MovementCreate(BaseModel):
    codigo_empresa: str
    fecha_movimiento: date
    puesto_nuevo: str
    depto_nuevo: int
    motivo: Optional[str] = None
