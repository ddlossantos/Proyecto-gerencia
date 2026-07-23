from datetime import date

import pytest
from pydantic import ValidationError

from backend.app.schemas import (
    EmployeeCreate,
    TrainingCreate,
    VacationCreate,
)


def test_vacation_rejects_inverted_dates():
    with pytest.raises(ValidationError, match="fecha final"):
        VacationCreate(
            codigo_empresa="E0001",
            fecha_inicio=date(2026, 7, 20),
            fecha_fin=date(2026, 7, 19),
        )


def test_training_rejects_inverted_dates():
    with pytest.raises(ValidationError, match="fecha final"):
        TrainingCreate(
            codigo_empresa="E0001",
            nombre_capacitacion="Liderazgo",
            fecha_inicio=date(2026, 7, 20),
            fecha_fin=date(2026, 7, 19),
        )


def test_employee_rejects_birth_date_after_hire_date():
    with pytest.raises(ValidationError, match="fecha de nacimiento"):
        EmployeeCreate(
            numero_cedula="8-123-456",
            nombre="Ana",
            apellido="Pérez",
            fecha_nacimiento=date(2026, 1, 1),
            nacionalidad="Panameña",
            direccion="Ciudad de Panamá",
            telefono_principal="6000-0000",
            fecha_ingreso=date(2025, 1, 1),
            puesto="Analista",
            id_departamento=1,
        )


def test_request_strings_are_trimmed():
    vacation = VacationCreate(
        codigo_empresa="E0001",
        fecha_inicio=date(2026, 7, 20),
        fecha_fin=date(2026, 7, 21),
        observaciones="  Aprobadas por gerencia  ",
    )

    assert vacation.observaciones == "Aprobadas por gerencia"
