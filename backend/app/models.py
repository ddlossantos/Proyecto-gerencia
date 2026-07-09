from sqlalchemy import (
    Boolean,
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .database import Base


class Department(Base):
    __tablename__ = "departamentos"

    id_departamento = Column(Integer, primary_key=True, index=True)
    nombre_departamento = Column(String(100), nullable=False, unique=True)
    descripcion = Column(String(255))

    personal = relationship("Personnel", back_populates="departamento")


class Employee(Base):
    __tablename__ = "empleados"

    id_empleado = Column(Integer, primary_key=True, index=True)
    codigo_empresa = Column(String(5), nullable=False, unique=True, index=True)
    numero_cedula = Column(String(20), nullable=False, unique=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    nacionalidad = Column(String(60), nullable=False)
    direccion = Column(String(255), nullable=False)
    telefono_principal = Column(String(20), nullable=False)
    telefono_secundario = Column(String(20))
    estado = Column(String(20), nullable=False, default="activo")
    pct_desempeno = Column(Float)

    personal = relationship("Personnel", back_populates="empleado", uselist=False)
    asistencias = relationship("Attendance", back_populates="empleado")
    ausencias = relationship("Absence", back_populates="empleado")
    vacaciones = relationship("Vacation", back_populates="empleado")
    capacitaciones = relationship("Training", back_populates="empleado")
    evaluaciones = relationship("PerformanceEvaluation", back_populates="empleado")
    salida = relationship("Termination", back_populates="empleado", uselist=False)
    movimientos = relationship("Movement", back_populates="empleado")


class Personnel(Base):
    __tablename__ = "personal"

    id_personal = Column(Integer, primary_key=True, index=True)
    codigo_empresa = Column(String(5), ForeignKey("empleados.codigo_empresa"), nullable=False, unique=True)
    fecha_ingreso = Column(Date, nullable=False)
    puesto = Column(String(100), nullable=False)
    observaciones = Column(Text)
    id_departamento = Column(Integer, ForeignKey("departamentos.id_departamento"), nullable=False)

    empleado = relationship("Employee", back_populates="personal")
    departamento = relationship("Department", back_populates="personal")


class Attendance(Base):
    __tablename__ = "asistencias"
    __table_args__ = (UniqueConstraint("codigo_empresa", "fecha", name="uq_asistencia_dia"),)

    id_asistencia = Column(Integer, primary_key=True, index=True)
    codigo_empresa = Column(String(5), ForeignKey("empleados.codigo_empresa"), nullable=False)
    fecha = Column(Date, nullable=False)
    presente = Column(Boolean, nullable=False, default=True)

    empleado = relationship("Employee", back_populates="asistencias")


class Absence(Base):
    __tablename__ = "ausencias"
    __table_args__ = (UniqueConstraint("codigo_empresa", "fecha", name="uq_ausencia_dia"),)

    id_ausencia = Column(Integer, primary_key=True, index=True)
    codigo_empresa = Column(String(5), ForeignKey("empleados.codigo_empresa"), nullable=False)
    fecha = Column(Date, nullable=False)
    motivo = Column(String(255))

    empleado = relationship("Employee", back_populates="ausencias")


class Vacation(Base):
    __tablename__ = "vacaciones"

    id_vacacion = Column(Integer, primary_key=True, index=True)
    codigo_empresa = Column(String(5), ForeignKey("empleados.codigo_empresa"), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    dias_tomados = Column(Integer, nullable=False, default=1)
    observaciones = Column(String(255))

    empleado = relationship("Employee", back_populates="vacaciones")


class Training(Base):
    __tablename__ = "capacitaciones"

    id_capacitacion = Column(Integer, primary_key=True, index=True)
    codigo_empresa = Column(String(5), ForeignKey("empleados.codigo_empresa"), nullable=False)
    nombre_capacitacion = Column(String(150), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date)

    empleado = relationship("Employee", back_populates="capacitaciones")


class PerformanceEvaluation(Base):
    __tablename__ = "evaluaciones_desempeno"

    id_evaluacion = Column(Integer, primary_key=True, index=True)
    codigo_empresa = Column(String(5), ForeignKey("empleados.codigo_empresa"), nullable=False)
    fecha_evaluacion = Column(Date, nullable=False)
    pct_bruto = Column(Float, nullable=False)
    pct_neto = Column(Float, nullable=False)

    empleado = relationship("Employee", back_populates="evaluaciones")


class Termination(Base):
    __tablename__ = "salida_personal"

    id_salida = Column(Integer, primary_key=True, index=True)
    codigo_empresa = Column(String(5), ForeignKey("empleados.codigo_empresa"), nullable=False, unique=True)
    fecha_salida = Column(Date, nullable=False)
    motivo_salida = Column(String(255), nullable=False)
    observaciones = Column(Text)

    empleado = relationship("Employee", back_populates="salida")


class Movement(Base):
    __tablename__ = "historial_movimientos"

    id_movimiento = Column(Integer, primary_key=True, index=True)
    codigo_empresa = Column(String(5), ForeignKey("empleados.codigo_empresa"), nullable=False)
    fecha_movimiento = Column(Date, nullable=False)
    puesto_anterior = Column(String(100), nullable=False)
    puesto_nuevo = Column(String(100), nullable=False)
    depto_anterior = Column(Integer, ForeignKey("departamentos.id_departamento"), nullable=False)
    depto_nuevo = Column(Integer, ForeignKey("departamentos.id_departamento"), nullable=False)
    motivo = Column(String(255))

    empleado = relationship("Employee", back_populates="movimientos")
