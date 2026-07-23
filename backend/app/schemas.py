from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator


class RequestModel(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)


class DepartmentCreate(RequestModel):
    nombre_departamento: str = Field(min_length=2, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=255)


class EmployeeCreate(RequestModel):
    numero_cedula: str = Field(min_length=3, max_length=20)
    nombre: str = Field(min_length=2, max_length=100)
    apellido: str = Field(min_length=2, max_length=100)
    fecha_nacimiento: date
    nacionalidad: str = "Panameña"
    direccion: str = Field(min_length=5, max_length=255)
    telefono_principal: str = Field(min_length=7, max_length=20)
    telefono_secundario: Optional[str] = Field(default=None, max_length=20)
    fecha_ingreso: date
    puesto: str = Field(min_length=2, max_length=100)
    id_departamento: int = Field(gt=0)
    observaciones: Optional[str] = Field(default=None, max_length=1000)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.fecha_nacimiento >= self.fecha_ingreso:
            raise ValueError("La fecha de nacimiento debe ser anterior a la fecha de ingreso.")
        return self


class AttendanceCreate(RequestModel):
    codigo_empresa: str = Field(pattern=r"^E\d{4}$")
    fecha: date
    presente: bool = True


class AbsenceCreate(RequestModel):
    codigo_empresa: str = Field(pattern=r"^E\d{4}$")
    fecha: date
    motivo: str = Field(min_length=2, max_length=255)


class VacationCreate(RequestModel):
    codigo_empresa: str = Field(pattern=r"^E\d{4}$")
    fecha_inicio: date
    fecha_fin: date
    observaciones: Optional[str] = Field(default=None, max_length=255)

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.fecha_fin < self.fecha_inicio:
            raise ValueError("La fecha final de las vacaciones no puede ser anterior a la fecha inicial.")
        return self


class TrainingCreate(RequestModel):
    codigo_empresa: str = Field(pattern=r"^E\d{4}$")
    nombre_capacitacion: str = Field(min_length=2, max_length=150)
    fecha_inicio: date
    fecha_fin: Optional[date] = None

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.fecha_fin and self.fecha_fin < self.fecha_inicio:
            raise ValueError("La fecha final de la capacitación no puede ser anterior a la fecha inicial.")
        return self


class EvaluationCreate(RequestModel):
    codigo_empresa: str = Field(pattern=r"^E\d{4}$")
    fecha_evaluacion: date
    pct_bruto: float = Field(ge=0, le=100)


class TerminationCreate(RequestModel):
    codigo_empresa: str = Field(pattern=r"^E\d{4}$")
    fecha_salida: date
    motivo_salida: str = Field(min_length=2, max_length=255)
    observaciones: Optional[str] = Field(default=None, max_length=1000)


class MovementCreate(RequestModel):
    codigo_empresa: str = Field(pattern=r"^E\d{4}$")
    fecha_movimiento: date
    puesto_nuevo: str = Field(min_length=2, max_length=100)
    depto_nuevo: int = Field(gt=0)
    motivo: Optional[str] = Field(default=None, max_length=255)
