import random
from datetime import date, timedelta

from sqlalchemy.orm import Session

from . import models

FIRST_NAMES = [
    "Ana", "Luis", "Maria", "Carlos", "Sofia", "Miguel", "Andrea", "Roberto",
    "Valeria", "Jorge", "Lucia", "Ricardo", "Elena", "Daniel", "Paola",
    "Gabriel", "Camila", "Fernando", "Isabel", "Mateo", "Natalia", "Diego",
    "Laura", "Andres", "Rosa", "Julio", "Patricia", "Samuel", "Adriana", "Victor",
]

LAST_NAMES = [
    "Gonzalez", "Rodriguez", "Martinez", "Perez", "Sanchez", "Ramirez", "Torres",
    "Castillo", "Herrera", "Vargas", "Morales", "Jimenez", "Mendoza", "Rojas",
    "Navarro", "Pimentel", "Villarreal", "Cortes", "Diaz", "Aguilar",
]

DEPARTMENTS = [
    ("Recursos Humanos", "Gestion de talento, bienestar y procesos laborales"),
    ("Finanzas", "Presupuesto, contabilidad, pagos y control financiero"),
    ("Tecnologia", "Infraestructura, desarrollo y soporte tecnico"),
    ("Operaciones", "Ejecucion operativa y mejora continua"),
    ("Ventas", "Gestion comercial y relacion con clientes"),
    ("Marketing", "Comunicacion, marca y campanas"),
    ("Logistica", "Distribucion, inventario y coordinacion"),
    ("Legal", "Contratos, cumplimiento y asesoria legal"),
    ("Servicio al Cliente", "Atencion, casos y satisfaccion del cliente"),
    ("Compras", "Proveedores, negociacion y abastecimiento"),
    ("Calidad", "Auditorias, control de procesos y mejora"),
    ("Direccion General", "Planificacion estrategica y toma de decisiones"),
]

POSITIONS = {
    "Recursos Humanos": ["Analista de RRHH", "Coordinador de Talento", "Especialista de Nomina"],
    "Finanzas": ["Analista Financiero", "Contador", "Asistente de Tesoreria"],
    "Tecnologia": ["Desarrollador", "Soporte Tecnico", "Administrador de Sistemas"],
    "Operaciones": ["Supervisor Operativo", "Analista de Procesos", "Coordinador Operativo"],
    "Ventas": ["Ejecutivo de Ventas", "Supervisor Comercial", "Asesor Comercial"],
    "Marketing": ["Analista de Marketing", "Community Manager", "Disenador Grafico"],
    "Logistica": ["Coordinador Logistico", "Analista de Inventario", "Supervisor de Bodega"],
    "Legal": ["Asistente Legal", "Analista de Cumplimiento", "Abogado Corporativo"],
    "Servicio al Cliente": ["Agente de Servicio", "Supervisor de Atencion", "Analista de Experiencia"],
    "Compras": ["Analista de Compras", "Coordinador de Proveedores", "Asistente de Compras"],
    "Calidad": ["Auditor de Calidad", "Analista de Calidad", "Inspector de Procesos"],
    "Direccion General": ["Asistente Ejecutivo", "Analista Estrategico", "Coordinador Administrativo"],
}

TRAININGS = [
    "Induccion corporativa", "Excel para analisis", "Liderazgo efectivo",
    "Atencion al cliente", "Ciberseguridad basica", "Gestion de conflictos",
    "Seguridad ocupacional", "Power BI inicial", "Comunicacion asertiva",
    "Normas internas de cumplimiento",
]

ABSENCE_REASONS = [
    "Cita medica", "Incapacidad", "Tramite personal", "Emergencia familiar",
    "Permiso autorizado", "Duelo", "Ausencia justificada",
]

EXIT_REASONS = [
    "Renuncia voluntaria", "Finalizacion de contrato", "Bajo desempeno",
    "Reestructuracion", "Mejor oportunidad laboral",
]


def _random_date(start: date, end: date) -> date:
    days = (end - start).days
    return start + timedelta(days=random.randint(0, max(days, 0)))


def _code(index: int) -> str:
    return f"E{index:04d}"[-5:]


def reset_demo_data(db: Session, employee_count: int = 300) -> None:
    for model in [
        models.Movement,
        models.Termination,
        models.PerformanceEvaluation,
        models.Training,
        models.Vacation,
        models.Absence,
        models.Attendance,
        models.Personnel,
        models.Employee,
        models.Department,
    ]:
        db.query(model).delete()
    db.commit()
    seed_demo_data(db, employee_count=employee_count, force=True)


def seed_demo_data(db: Session, employee_count: int = 300, force: bool = False) -> None:
    if not force and db.query(models.Employee).count() >= employee_count:
        return

    random.seed(252)
    departments = []
    for name, desc in DEPARTMENTS:
        dep = models.Department(nombre_departamento=name, descripcion=desc)
        db.add(dep)
        departments.append(dep)
    db.flush()

    today = date.today()
    employees = []
    for i in range(1, employee_count + 1):
        dep = departments[(i - 1) % len(departments)]
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        second_last = random.choice([x for x in LAST_NAMES if x != last])
        birth = _random_date(date(1975, 1, 1), date(2003, 12, 31))
        hire = _random_date(date(2017, 1, 1), today - timedelta(days=90))
        codigo = _code(i)
        puesto = random.choice(POSITIONS[dep.nombre_departamento])
        employee = models.Employee(
            codigo_empresa=codigo,
            numero_cedula=f"8-{random.randint(100, 999)}-{1000 + i}",
            nombre=first,
            apellido=f"{last} {second_last}",
            fecha_nacimiento=birth,
            nacionalidad=random.choice(["Panameña", "Colombiana", "Costarricense", "Dominicana", "Venezolana"]),
            direccion=f"Calle {random.randint(1, 80)}, Ciudad de Panama",
            telefono_principal=f"6{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            telefono_secundario=f"2{random.randint(100, 999)}-{random.randint(1000, 9999)}" if random.random() < 0.35 else None,
            estado="activo",
            pct_desempeno=None,
        )
        db.add(employee)
        db.add(
            models.Personnel(
                codigo_empresa=codigo,
                fecha_ingreso=hire,
                puesto=puesto,
                observaciones=random.choice([
                    "Ingreso completado con documentacion validada.",
                    "Colaborador asignado a plan de seguimiento.",
                    "Perfil operativo estable.",
                    "Potencial de crecimiento interno.",
                ]),
                id_departamento=dep.id_departamento,
            )
        )
        employees.append((employee, dep, puesto, hire))
    db.flush()

    start_window = today - timedelta(days=90)
    workdays = [
        start_window + timedelta(days=n)
        for n in range((today - start_window).days + 1)
        if (start_window + timedelta(days=n)).weekday() < 5
    ][-55:]

    for employee, _dep, _puesto, _hire in employees:
        absence_dates = set(random.sample(workdays, k=random.randint(0, 4)))
        for day in workdays:
            if random.random() < 0.92 or day in absence_dates:
                present = day not in absence_dates and random.random() > 0.015
                db.add(models.Attendance(codigo_empresa=employee.codigo_empresa, fecha=day, presente=present))
        for day in absence_dates:
            db.add(
                models.Absence(
                    codigo_empresa=employee.codigo_empresa,
                    fecha=day,
                    motivo=random.choice(ABSENCE_REASONS),
                )
            )

        if random.random() < 0.45:
            start = _random_date(today - timedelta(days=210), today - timedelta(days=20))
            days = random.randint(3, 12)
            db.add(
                models.Vacation(
                    codigo_empresa=employee.codigo_empresa,
                    fecha_inicio=start,
                    fecha_fin=start + timedelta(days=days - 1),
                    dias_tomados=days,
                    observaciones=random.choice(["Vacaciones regulares", "Saldo anual", "Periodo aprobado"]),
                )
            )

        for _ in range(random.randint(1, 3)):
            start = _random_date(today - timedelta(days=300), today - timedelta(days=5))
            db.add(
                models.Training(
                    codigo_empresa=employee.codigo_empresa,
                    nombre_capacitacion=random.choice(TRAININGS),
                    fecha_inicio=start,
                    fecha_fin=start + timedelta(days=random.randint(0, 3)),
                )
            )

        bruto = round(random.uniform(68, 98), 2)
        penalty = min(len(absence_dates) * 1.7, 12)
        neto = round(max(bruto - penalty, 45), 2)
        employee.pct_desempeno = neto
        db.add(
            models.PerformanceEvaluation(
                codigo_empresa=employee.codigo_empresa,
                fecha_evaluacion=_random_date(today - timedelta(days=120), today),
                pct_bruto=bruto,
                pct_neto=neto,
            )
        )

    move_candidates = random.sample(employees, k=max(20, employee_count // 5))
    for employee, dep, puesto, hire in move_candidates:
        new_dep = random.choice([d for d in departments if d.id_departamento != dep.id_departamento])
        new_position = random.choice(POSITIONS[new_dep.nombre_departamento])
        db.add(
            models.Movement(
                codigo_empresa=employee.codigo_empresa,
                fecha_movimiento=_random_date(hire + timedelta(days=60), today),
                puesto_anterior=puesto,
                puesto_nuevo=new_position,
                depto_anterior=dep.id_departamento,
                depto_nuevo=new_dep.id_departamento,
                motivo=random.choice(["Promocion interna", "Necesidad operativa", "Reorganizacion", "Desarrollo profesional"]),
            )
        )

    termination_count = max(24, round(employee_count * 0.1))
    for employee, _dep, _puesto, _hire in random.sample(employees, k=termination_count):
        employee.estado = "terminado"
        db.add(
            models.Termination(
                codigo_empresa=employee.codigo_empresa,
                fecha_salida=_random_date(today - timedelta(days=180), today - timedelta(days=1)),
                motivo_salida=random.choice(EXIT_REASONS),
                observaciones=random.choice([
                    "Proceso completado con entrega de activos.",
                    "Salida documentada y validada por RRHH.",
                    "Cierre administrativo sin pendientes criticos.",
                ]),
            )
        )

    db.commit()
