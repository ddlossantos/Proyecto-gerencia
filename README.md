# Proyecto Gerencia de Recursos Humanos

Sistema digital de gestion de Recursos Humanos para centralizar procesos de reclutamiento, personal, control diario, desarrollo, salida y reportes gerenciales.

## Estructura

- `modulo_departamentos.ipynb`: modulo 0 para CRUD de departamentos.
- `Modulo_1_Reclutamiento/`: gestion de palabras clave, carga de CVs, extraccion de texto y filtrado de candidatos.
- `Modulo_2_Personal/`: ingreso de colaboradores, datos personales y datos laborales.
- `Modulo_3_Control_Diario/`: asistencias, ausencias y vacaciones.
- `Modulo_4_Desarrollo/`: capacitaciones y evaluaciones de desempeno.
- `Modulo_5_Salida/`: movimientos internos y salida definitiva de personal.
- `Modulo_6_Reportes/`: KPIs, dashboard gerencial y exportacion CSV.
- `rrhh_schema.sql`: esquema MySQL de la base de datos `rrhh_sistema`.
- `docs/`: indicaciones del proyecto y resumen de avance.

## Arranque local en PowerShell

Desde la raiz del repositorio:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m ipykernel install --user --name proyecto-gerencia --display-name "Python (Proyecto Gerencia)"
```

Configura la conexion a MySQL:

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

Si PowerShell indica que `mysql` no se reconoce, instala MySQL Server/Client o agrega la carpeta `bin` de MySQL al `PATH` de Windows. Una ruta comun es `C:\Program Files\MySQL\MySQL Server 8.0\bin`.

Abre los notebooks:

```powershell
jupyter notebook
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
git commit -m "Descripcion corta del avance"
git push
```
