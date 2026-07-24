# Proyecto Gerencia de Recursos Humanos

Sistema digital de gestión de Recursos Humanos para centralizar procesos de reclutamiento, personal, control diario, desarrollo, salida y reportes gerenciales.

## Estructura

- `backend/`: API en FastAPI con modelos, endpoints y datos de demostración de 300 colaboradores.
- `frontend/`: aplicación React + Vite con presentación de producto, dashboard, formularios, tablas y gráficas, con inspiración visual en Play Astro y TailAdmin adaptada al proyecto.
- `modulo_departamentos.ipynb`: módulo 0 para el CRUD de departamentos.
- `Modulo_1_Reclutamiento/`: gestión de palabras clave, carga de CV, extracción de texto y filtrado de candidatos.
- `Modulo_2_Personal/`: ingreso de colaboradores, datos personales y datos laborales.
- `Modulo_3_Control_Diario/`: asistencias, ausencias y vacaciones.
- `Modulo_4_Desarrollo/`: capacitaciones y evaluaciones de desempeño.
- `Modulo_5_Salida/`: movimientos internos y salida definitiva de personal.
- `Modulo_6_Reportes/`: KPI, dashboard gerencial y exportación a CSV.
- `rrhh_schema.sql`: esquema MySQL de la base de datos `rrhh_sistema`.
- `docs/`: indicaciones del proyecto y resumen de avance.

## App web unificada

La entrega principal ahora es una aplicación web con:

- Frontend en React.
- Backend en FastAPI.
- Base local SQLite automática para la demostración.
- Semilla automática de mínimo 300 colaboradores.
- Soporte opcional para MySQL por `DATABASE_URL`.
- Presentación de producto con cuatro pestañas principales: Inicio, Solución, Planes y Dashboard.
- Inicio une portada, introducción, organigrama y quiénes somos en una experiencia de desplazamiento.
- Solución une la propuesta de producto y el manual de usuario por módulo.
- Planes presenta paquetes Básico, Personal y Empresarial para vender el software.
- Dashboard agrupa el resumen gerencial y los módulos operativos en subpestañas.
- Vista de administrador y vista de empleado desde el mismo dashboard.
- Filtros por fecha, departamento y condición de colaborador en el resumen gerencial.
- Conteos visibles de colaboradores activos e inactivos.
- Gráficas reemplazadas por lecturas ejecutivas con cantidades y porcentajes visibles sin depender del hover.
- Reporte gerencial imprimible desde el navegador para guardarlo como PDF.
- Modo nocturno persistente desde la barra superior.
- Carga y análisis de hojas de vida en PDF o TXT desde el módulo de Reclutamiento.
- Administración de departamentos desde el módulo de Personal.

### 1. Backend

Desde la raíz del repositorio:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

API:

- `http://127.0.0.1:8000/api/health`
- `http://127.0.0.1:8000/docs`

### 2. Frontend

En otra terminal:

```powershell
cd frontend
pnpm.cmd install
pnpm.cmd dev
```

Si PowerShell bloquea `npm.ps1` o `pnpm.ps1`, usa siempre `npm.cmd` o `pnpm.cmd`.

Abre:

```text
http://127.0.0.1:5173
```

### Datos de demostración

Al iniciar el backend, si la base local está vacía, se crean automáticamente 300 colaboradores con departamentos, asistencia, ausencias, vacaciones, capacitaciones, evaluaciones, movimientos y salidas.

Para regenerar los datos de demostración, define `DEMO_RESET_KEY` en `.env` y envía la misma clave en la cabecera `X-Demo-Reset-Key`:

```powershell
$headers = @{ "X-Demo-Reset-Key" = "tu-clave-local" }
Invoke-RestMethod -Method Post -Headers $headers "http://127.0.0.1:8000/api/seed?reset=true&employees=300"
```

## Arranque local en PowerShell

Desde la raíz del repositorio:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m ipykernel install --user --name proyecto-gerencia --display-name "Python (Proyecto Gerencia)"
```

En Windows puede ocurrir que `py` no exista o que PowerShell bloquee `Activate.ps1`. Por eso, los comandos anteriores usan `python` y la ruta directa `.\.venv\Scripts\python.exe`.

También puedes usar los scripts `.cmd` incluidos:

```powershell
.\scripts\setup_windows.cmd
```

Configura la conexión a MySQL:

```powershell
Copy-Item .env.example .env
notepad .env
```

Llena `DB_PASSWORD` con tu clave local. Los notebooks leen estas variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Inicializa la base de datos:

```powershell
mysql -h localhost -P 1989 -u root -p < rrhh_schema.sql
```

Si PowerShell indica que `mysql` no se reconoce, instala MySQL Server/Client o agrega la carpeta `bin` de MySQL al `PATH` de Windows. Una ruta común es `C:\Program Files\MySQL\MySQL Server 8.0\bin`.

Los notebooks originales siguen disponibles como respaldo y evidencia del avance previo:

```powershell
jupyter notebook
```

## Pruebas

Las validaciones principales del backend cuentan con pruebas automatizadas:

```powershell
.\.venv\Scripts\python.exe -m pytest -q
```

## Flujo sugerido de trabajo

1. Ejecutar `rrhh_schema.sql` en MySQL.
2. Abrir `modulo_departamentos.ipynb` y crear departamentos base.
3. Ejecutar `Modulo_2_Personal/modulo2.ipynb` para registrar colaboradores.
4. Continuar con control diario, desarrollo, salida y reportes.
5. Usar git por cada avance:

```powershell
git status
git add .
git commit -m "Descripción corta del avance"
git push
```
