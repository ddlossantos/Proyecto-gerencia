# Estado de avance de la carpeta fuente

La carpeta `Proyecto Final Gerencia de Recursos Humanos 1IL252 Grupo 6` ya contiene una version funcional por modulos en notebooks de Jupyter, con base de datos MySQL y datos de ejemplo para reclutamiento.

## Lo que ya esta avanzado

- Base de datos: `rrhh_schema.sql` crea `rrhh_sistema`, tablas principales y vistas para totales/promedios.
- Modulo 0: `modulo_departamentos.ipynb` permite crear, listar, modificar y eliminar departamentos.
- Modulo 1: `Modulo_1_Reclutamiento/modulo1.ipynb` cubre keywords, carga de CVs, extraccion de texto, analisis y filtrado.
- Gestor de keywords: `Modulo_1_Reclutamiento/KeywordsBinderManager.ipynb` administra archivos `.keyb`.
- Modulo 2: `Modulo_2_Personal/modulo2.ipynb` registra empleados y datos laborales.
- Modulo 3: `Modulo_3_Control_Diario/modulo3.ipynb` registra asistencia, ausencias y vacaciones.
- Modulo 4: `Modulo_4_Desarrollo/modulo4.ipynb` registra capacitaciones y evaluaciones.
- Modulo 5: `Modulo_5_Salida/modulo5.ipynb` gestiona movimientos internos y salida definitiva.
- Modulo 6: `Modulo_6_Reportes/modulo6.ipynb` genera KPIs, dashboard, graficas y exportacion CSV.

## Datos incluidos

- 8 notebooks `.ipynb`.
- 1 script SQL.
- 1 archivo `.keyb` de palabras clave.
- 1 CSV de reporte de reclutamiento.
- CVs de ejemplo en PDF y TXT para probar el modulo de reclutamiento.

## Ajustes hechos para continuar con git

- Se limpiaron salidas ejecutadas de notebooks para evitar ruido en commits.
- Se reemplazo la clave de MySQL escrita directamente por variables de entorno.
- Se agrego `.env.example` para documentar la configuracion local sin subir credenciales reales.
- Se agrego `requirements.txt` para instalar dependencias en un entorno virtual.

## Nueva app unificada

- Se agrego backend FastAPI en `backend/`.
- Se agrego frontend React + Vite en `frontend/`.
- El backend crea datos demo de 300 colaboradores si la base esta vacia.
- La interfaz incluye dashboard gerencial, reclutamiento, personal, control diario, desarrollo, salida y reportes.
- La base demo por defecto es SQLite para que la presentacion pueda correr aunque MySQL no este instalado; MySQL queda disponible configurando `DATABASE_URL`.
