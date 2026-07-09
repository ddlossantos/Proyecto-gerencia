# Backend FastAPI

Arranque local:

```powershell
.\.venv\Scripts\Activate.ps1
uvicorn backend.app.main:app --reload
```

La API queda en `http://127.0.0.1:8000`.

Por defecto usa SQLite en `backend/data/rrhh_demo.db` y crea 300 colaboradores de demostracion si la base esta vacia. Para usar MySQL, define `DATABASE_URL` en `.env`, por ejemplo:

```env
DATABASE_URL=mysql+pymysql://root:CLAVE@localhost:1989/rrhh_sistema
```
