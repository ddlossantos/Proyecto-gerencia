# Estado de avance de la carpeta fuente

La carpeta `Proyecto Final Gerencia de Recursos Humanos 1IL252 Grupo 6` ya contiene una versión funcional por módulos en notebooks de Jupyter, con base de datos MySQL y datos de ejemplo para reclutamiento.

## Lo que ya está avanzado

- Base de datos: `rrhh_schema.sql` crea `rrhh_sistema`, tablas principales y vistas para totales/promedios.
- Módulo 0: `modulo_departamentos.ipynb` permite crear, listar, modificar y eliminar departamentos.
- Módulo 1: `Modulo_1_Reclutamiento/modulo1.ipynb` cubre palabras clave, carga de CV, extracción de texto, análisis y filtrado.
- Gestor de keywords: `Modulo_1_Reclutamiento/KeywordsBinderManager.ipynb` administra archivos `.keyb`.
- Módulo 2: `Modulo_2_Personal/modulo2.ipynb` registra colaboradores y datos laborales.
- Módulo 3: `Modulo_3_Control_Diario/modulo3.ipynb` registra asistencia, ausencias y vacaciones.
- Módulo 4: `Modulo_4_Desarrollo/modulo4.ipynb` registra capacitaciones y evaluaciones.
- Módulo 5: `Modulo_5_Salida/modulo5.ipynb` gestiona movimientos internos y salidas definitivas.
- Módulo 6: `Modulo_6_Reportes/modulo6.ipynb` genera KPI, dashboard, gráficas y exportación a CSV.

## Datos incluidos

- 8 notebooks `.ipynb`.
- 1 script SQL.
- 1 archivo `.keyb` de palabras clave.
- 1 CSV de reporte de reclutamiento.
- CV de ejemplo en PDF y TXT para probar el módulo de reclutamiento.

## Ajustes hechos para continuar con git

- Se limpiaron salidas ejecutadas de notebooks para evitar ruido en commits.
- Se reemplazo la clave de MySQL escrita directamente por variables de entorno.
- Se agrego `.env.example` para documentar la configuracion local sin subir credenciales reales.
- Se agrego `requirements.txt` para instalar dependencias en un entorno virtual.

## Nueva app unificada

- Se agrego backend FastAPI en `backend/`.
- Se agrego frontend React + Vite en `frontend/`.
- El backend crea datos de demostración de 300 colaboradores si la base está vacía.
- La interfaz incluye dashboard gerencial, reclutamiento, personal, control diario, desarrollo, salida y reportes.
- La base de demostración predeterminada es SQLite para que la presentación pueda ejecutarse aunque MySQL no esté instalado; MySQL queda disponible mediante la configuración de `DATABASE_URL`.

## Enfoque de producto y venta

- Se reorganizó el frontend en tres pestañas principales: Inicio, Solución y Dashboard.
- Se reforzo el lenguaje visual con una landing estilo producto SaaS inspirada en Play Astro y un dashboard administrativo inspirado en TailAdmin.
- Se agregó un modo nocturno persistente para mejorar la presentación visual en clase o durante la demostración.
- Inicio presenta Talento 360 como producto de software para vender a gerencia e integra portada, introducción, organigrama y funciones del equipo.
- Solución explica qué ofrece cada módulo e incluye el manual de usuario correspondiente.
- Dashboard agrupa el resumen gerencial y los modulos operativos en subpestanas.
- El manual resume el uso de cada módulo y el tipo de marcado de asistencia.
- Reclutamiento muestra vacantes abiertas, cantidades y puestos.
- Desarrollo permite filtrar evaluaciones por colaborador y ver su porcentaje neto.
- El dashboard utiliza colores diferenciados por departamento y agrega una leyenda para facilitar la lectura.
- Reclutamiento permite cargar y analizar hojas de vida en PDF o TXT.
- Personal permite crear, editar y eliminar departamentos sin colaboradores asignados.
- Las operaciones sensibles de regeneración de datos requieren una clave local.
