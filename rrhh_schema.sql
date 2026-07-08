-- ============================================================
--  SISTEMA DE GESTIÓN DE RECURSOS HUMANOS
--  Módulos 2 al 6 — Esqueleto de Base de Datos (MySQL)
-- ============================================================

CREATE DATABASE IF NOT EXISTS rrhh_sistema
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_spanish_ci;

USE rrhh_sistema;

-- ------------------------------------------------------------
-- TABLA 0: Departamentos
-- (catálogo de la estructura organizacional)
-- ------------------------------------------------------------
CREATE TABLE departamentos (
    id_departamento     INT             AUTO_INCREMENT PRIMARY KEY,
    nombre_departamento VARCHAR(100)    NOT NULL,
    descripcion         VARCHAR(255)    NULL
);

-- ------------------------------------------------------------
-- TABLA 1: Empleados
-- (registro maestro de cada persona)
-- ------------------------------------------------------------
CREATE TABLE empleados (
    -- Identificación
    id_empleado         INT             AUTO_INCREMENT PRIMARY KEY,
    codigo_empresa      CHAR(5)         NOT NULL UNIQUE,   -- ej. "A1B2C" autogenerado
    numero_cedula       VARCHAR(20)     NOT NULL UNIQUE,

    -- Datos personales
    nombre              VARCHAR(100)    NOT NULL,
    apellido            VARCHAR(100)    NOT NULL,
    fecha_nacimiento    DATE            NOT NULL,
    nacionalidad        VARCHAR(60)     NOT NULL,
    direccion           VARCHAR(255)    NOT NULL,
    telefono_principal  VARCHAR(20)     NOT NULL,
    telefono_secundario VARCHAR(20)     NULL,

    -- Estado y métricas (calculado/actualizado desde otras tablas)
    estado              ENUM('activo','terminado') NOT NULL DEFAULT 'activo',
    pct_desempeno       DECIMAL(5,2)    NULL        -- promedio de desempeño neto
);

-- ------------------------------------------------------------
-- TABLA 2: Personal
-- (información laboral del empleado dentro de la empresa)
-- ------------------------------------------------------------
CREATE TABLE personal (
    id_personal         INT             AUTO_INCREMENT PRIMARY KEY,
    codigo_empresa      CHAR(5)         NOT NULL UNIQUE,
    fecha_ingreso       DATE            NOT NULL,
    puesto              VARCHAR(100)    NOT NULL,
    observaciones       TEXT            NULL,       -- historial / notas del empleado

    -- Relaciones
    id_departamento     INT             NOT NULL,

    FOREIGN KEY (codigo_empresa)   REFERENCES empleados(codigo_empresa)  ON UPDATE CASCADE,
    FOREIGN KEY (id_departamento)  REFERENCES departamentos(id_departamento)
);

-- ------------------------------------------------------------
-- TABLA 3: Asistencias
-- (un registro por día por empleado)
-- ------------------------------------------------------------
CREATE TABLE asistencias (
    id_asistencia       INT             AUTO_INCREMENT PRIMARY KEY,
    codigo_empresa      CHAR(5)         NOT NULL,
    fecha               DATE            NOT NULL,
    presente            TINYINT(1)      NOT NULL DEFAULT 1,  -- 1 = asistió, 0 = no asistió

    UNIQUE KEY uq_asistencia_dia (codigo_empresa, fecha),    -- evita duplicados por día
    FOREIGN KEY (codigo_empresa) REFERENCES empleados(codigo_empresa) ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- TABLA 4: Ausencias
-- (un registro por día de ausencia justificada)
-- ------------------------------------------------------------
CREATE TABLE ausencias (
    id_ausencia         INT             AUTO_INCREMENT PRIMARY KEY,
    codigo_empresa      CHAR(5)         NOT NULL,
    fecha               DATE            NOT NULL,
    motivo              VARCHAR(255)    NULL,

    UNIQUE KEY uq_ausencia_dia (codigo_empresa, fecha),
    FOREIGN KEY (codigo_empresa) REFERENCES empleados(codigo_empresa) ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- TABLA 5: Vacaciones
-- (por período de vacaciones tomado)
-- ------------------------------------------------------------
CREATE TABLE vacaciones (
    id_vacacion         INT             AUTO_INCREMENT PRIMARY KEY,
    codigo_empresa      CHAR(5)         NOT NULL,
    fecha_inicio        DATE            NOT NULL,
    fecha_fin           DATE            NOT NULL,
    dias_tomados        INT             AS (DATEDIFF(fecha_fin, fecha_inicio) + 1) STORED,
    observaciones       VARCHAR(255)    NULL,

    FOREIGN KEY (codigo_empresa) REFERENCES empleados(codigo_empresa) ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- TABLA 6: Capacitaciones
-- ------------------------------------------------------------
CREATE TABLE capacitaciones (
    id_capacitacion     INT             AUTO_INCREMENT PRIMARY KEY,
    codigo_empresa      CHAR(5)         NOT NULL,
    nombre_capacitacion VARCHAR(150)    NOT NULL,
    fecha_inicio        DATE            NOT NULL,
    fecha_fin           DATE            NULL,       -- NULL si aún no ha terminado

    FOREIGN KEY (codigo_empresa) REFERENCES empleados(codigo_empresa) ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- TABLA 7: Evaluaciones de Desempeño
-- ------------------------------------------------------------
CREATE TABLE evaluaciones_desempeno (
    id_evaluacion       INT             AUTO_INCREMENT PRIMARY KEY,
    codigo_empresa      CHAR(5)         NOT NULL,
    fecha_evaluacion    DATE            NOT NULL,
    pct_bruto           DECIMAL(5,2)    NOT NULL,  -- 0 a 100, puntuación pura
    pct_neto            DECIMAL(5,2)    NOT NULL,  -- pct_bruto menos penalización por ausencias

    FOREIGN KEY (codigo_empresa) REFERENCES empleados(codigo_empresa) ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- TABLA 8: Salida de Personal
-- ------------------------------------------------------------
CREATE TABLE salida_personal (
    id_salida           INT             AUTO_INCREMENT PRIMARY KEY,
    codigo_empresa      CHAR(5)         NOT NULL UNIQUE,   -- un empleado solo tiene una salida
    fecha_salida        DATE            NOT NULL,
    motivo_salida       VARCHAR(255)    NOT NULL,
    observaciones       TEXT            NULL,

    FOREIGN KEY (codigo_empresa) REFERENCES empleados(codigo_empresa) ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- TABLA 9: Movimiento de Personal
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS historial_movimientos (
    id_movimiento       INT             AUTO_INCREMENT PRIMARY KEY,
    codigo_empresa      CHAR(5)         NOT NULL,
    fecha_movimiento    DATE            NOT NULL,
    puesto_anterior     VARCHAR(100)    NOT NULL,
    puesto_nuevo        VARCHAR(100)    NOT NULL,
    depto_anterior      INT             NOT NULL,
    depto_nuevo         INT             NOT NULL,
    motivo              VARCHAR(255)    NULL,
    FOREIGN KEY (codigo_empresa)  REFERENCES empleados(codigo_empresa)  ON UPDATE CASCADE,
    FOREIGN KEY (depto_anterior)  REFERENCES departamentos(id_departamento),
    FOREIGN KEY (depto_nuevo)     REFERENCES departamentos(id_departamento)
);

-- ============================================================
-- VISTAS ÚTILES (contadores sin columnas redundantes)
-- ============================================================

-- Total de asistencias por empleado
CREATE VIEW v_total_asistencias AS
    SELECT codigo_empresa,
           COUNT(*) AS total_asistencias
    FROM asistencias
    WHERE presente = 1
    GROUP BY codigo_empresa;

-- Total de ausencias por empleado
CREATE VIEW v_total_ausencias AS
    SELECT codigo_empresa,
           COUNT(*) AS total_ausencias
    FROM ausencias
    GROUP BY codigo_empresa;

-- Total de días de vacaciones por empleado
CREATE VIEW v_total_vacaciones AS
    SELECT codigo_empresa,
           SUM(dias_tomados) AS total_dias_vacaciones
    FROM vacaciones
    GROUP BY codigo_empresa;

-- Promedio de desempeño neto por empleado
CREATE VIEW v_promedio_desempeno AS
    SELECT codigo_empresa,
           ROUND(AVG(pct_neto), 2) AS promedio_desempeno_neto
    FROM evaluaciones_desempeno
    GROUP BY codigo_empresa;
