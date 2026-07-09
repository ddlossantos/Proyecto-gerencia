@echo off
setlocal
cd /d "%~dp0\.."

if exist ".venv\Scripts\python.exe" (
  echo [1/4] Entorno virtual existente detectado.
) else (
  echo [1/4] Creando entorno virtual de Python...
  python -m venv .venv
  if errorlevel 1 goto error
)

echo [2/4] Actualizando pip...
".venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 goto error

echo [3/4] Instalando dependencias de Python...
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto error

echo [4/4] Instalando dependencias de React...
cd frontend
pnpm.cmd install
if errorlevel 1 goto error

echo.
echo Setup completado.
echo Para iniciar backend: scripts\run_backend.cmd
echo Para iniciar frontend: scripts\run_frontend.cmd
exit /b 0

:error
echo.
echo Ocurrio un error durante la instalacion.
exit /b 1
