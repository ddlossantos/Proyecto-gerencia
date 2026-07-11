import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Database,
  FileSearch,
  Handshake,
  Home,
  LayoutDashboard,
  LogOut,
  PieChart as PieChartIcon,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "./api";
import {
  DataTable,
  Field,
  FormGrid,
  LastUpdated,
  MetricCard,
  Notice,
  PageHeader,
  Panel,
  SearchBar,
  StatusBadge,
} from "./components.jsx";

const today = new Date().toISOString().slice(0, 10);

const departmentPalette = {
  Calidad: "#0f766e",
  Compras: "#2563eb",
  "Direccion General": "#7c3aed",
  Finanzas: "#f59e0b",
  Legal: "#dc2626",
  Logistica: "#0891b2",
  Marketing: "#65a30d",
  Operaciones: "#be185d",
  "Recursos Humanos": "#0d9488",
  "Servicio al Cliente": "#9333ea",
  Tecnologia: "#ea580c",
  Ventas: "#16a34a",
};

const fallbackColors = [
  "#0f766e",
  "#2563eb",
  "#7c3aed",
  "#f59e0b",
  "#dc2626",
  "#0891b2",
  "#65a30d",
  "#be185d",
  "#0d9488",
  "#9333ea",
  "#ea580c",
  "#16a34a",
];

const navItems = [
  { id: "home", label: "Portada", icon: Home },
  { id: "solution", label: "Solucion", icon: Handshake },
  { id: "team", label: "Quienes somos", icon: UserCheck },
  { id: "manual", label: "Manual", icon: BookOpenCheck },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "recruitment", label: "Reclutamiento", icon: FileSearch },
  { id: "employees", label: "Personal", icon: UsersRound },
  { id: "daily", label: "Control diario", icon: CalendarCheck },
  { id: "development", label: "Desarrollo", icon: Brain },
  { id: "exit", label: "Salida", icon: LogOut },
  { id: "reports", label: "Reportes", icon: BarChart3 },
];

function colorForDepartment(name, index = 0) {
  return departmentPalette[name] || fallbackColors[index % fallbackColors.length];
}

function useAsync(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    loader()
      .then((payload) => alive && setData(payload))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, deps);

  return { data, loading, error, setData };
}

function App() {
  const [activePage, setActivePage] = useState("home");
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((value) => value + 1);

  const page = useMemo(() => {
    const props = { refreshKey, refresh, setActivePage };
    return {
      home: <HomePage {...props} />,
      solution: <SolutionPage {...props} />,
      team: <TeamPage />,
      manual: <ManualPage {...props} />,
      dashboard: <DashboardPage {...props} />,
      recruitment: <RecruitmentPage {...props} />,
      employees: <EmployeesPage {...props} />,
      daily: <DailyPage {...props} />,
      development: <DevelopmentPage {...props} />,
      exit: <ExitPage {...props} />,
      reports: <ReportsPage {...props} />,
    }[activePage];
  }, [activePage, refreshKey]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">RH</div>
          <div>
            <strong>Tao's Team</strong>
            <span>Grupo 6</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activePage === item.id ? "active" : ""}
                key={item.id}
                onClick={() => setActivePage(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                <ChevronRight size={15} />
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <Database size={18} />
          <span>Software demo con 300 colaboradores</span>
        </div>
      </aside>
      <main className="content">{page}</main>
    </div>
  );
}

function HomePage({ setActivePage }) {
  return (
    <>
      <section className="hero-product">
        <div>
          <span className="eyebrow">Producto de software RRHH</span>
          <h1>Talento 360</h1>
          <p>
            Plataforma integral para vender a gerencia una forma moderna de administrar
            reclutamiento, expediente laboral, asistencia, desarrollo, salida y reportes.
          </p>
          <div className="hero-actions">
            <button className="primary-button standalone" onClick={() => setActivePage("solution")}>
              <Handshake size={17} />
              Ver solucion
            </button>
            <button className="ghost-button" onClick={() => setActivePage("dashboard")}>
              <LayoutDashboard size={17} />
              Abrir dashboard
            </button>
          </div>
        </div>
        <div className="hero-card">
          <strong>Propuesta comercial</strong>
          <span>Menos registros dispersos, menos errores y mas decisiones con datos.</span>
          <div className="hero-stats">
            <div><b>300</b><small>colaboradores</small></div>
            <div><b>6</b><small>modulos</small></div>
            <div><b>1</b><small>dashboard</small></div>
          </div>
        </div>
      </section>
      <section className="info-grid">
        <Panel title="Introduccion" subtitle="Problema que resuelve">
          <p className="soft-text">
            Muchas empresas gestionan RRHH con hojas separadas, correos y registros manuales.
            Talento 360 centraliza el ciclo completo del colaborador y convierte la operacion
            diaria en indicadores para gerencia.
          </p>
        </Panel>
        <Panel title="Cliente objetivo" subtitle="Empresa mediana">
          <p className="soft-text">
            La demo representa una empresa de 300 colaboradores que necesita controlar procesos
            de talento humano sin duplicidad de informacion.
          </p>
        </Panel>
        <Panel title="Resultado esperado" subtitle="Software en ejecucion">
          <p className="soft-text">
            El producto se muestra como una aplicacion web con frontend, API, datos demo,
            formularios, reportes y flujo completo por modulo.
          </p>
        </Panel>
      </section>
    </>
  );
}

function SolutionPage({ setActivePage }) {
  const modules = [
    ["Reclutamiento", "Vacantes, recepcion de CVs, filtros por palabras clave y reporte de candidatos."],
    ["Personal", "Expediente unico del colaborador, ingreso, puesto, departamento y estado."],
    ["Control diario", "Marcado web de asistencia por colaborador, fecha y estado. Puede evolucionar a QR, biometria o geolocalizacion."],
    ["Desarrollo", "Capacitaciones y evaluaciones de desempeno por colaborador con porcentaje neto."],
    ["Salida", "Movimientos internos, promociones, traslados y salida definitiva documentada."],
    ["Reportes", "KPIs para gerencia: plantilla, asistencia, rotacion, desempeno y departamentos."],
  ];
  return (
    <>
      <PageHeader
        eyebrow="Producto / solucion"
        title="Que ofrece Talento 360"
        description="Una solucion modular para digitalizar procesos de Recursos Humanos y defenderla como producto viable."
        actions={<button className="ghost-button" onClick={() => setActivePage("manual")}><BookOpenCheck size={16} />Ver manual</button>}
      />
      <section className="metric-grid three">
        <MetricCard label="Automatizacion" value="6 modulos" detail="Procesos conectados" icon={Building2} />
        <MetricCard label="Decisiones" value="KPIs" detail="Dashboard gerencial" icon={BarChart3} tone="cyan" />
        <MetricCard label="Trazabilidad" value="360" detail="Ciclo completo" icon={ShieldCheck} tone="green" />
      </section>
      <section className="module-guide">
        {modules.map(([title, text]) => (
          <article key={title} className="module-card">
            <span>{title}</span>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </>
  );
}

function TeamPage() {
  const roles = [
    ["Lider del proyecto", "Coordina avances, alcance, integracion y presentacion final."],
    ["Analista de RRHH", "Define procesos, indicadores y reglas de negocio."],
    ["Disenador", "Organiza pantallas, experiencia visual y claridad de la demo."],
    ["Encargado de datos", "Estructura la base, valida datos demo y reportes."],
    ["Presentador", "Vende la solucion, explica beneficios y conduce la defensa."],
  ];
  return (
    <>
      <PageHeader
        eyebrow="Quienes somos"
        title="Equipo, roles y organigrama"
        description="El proyecto se presenta como una propuesta de software desarrollada por un equipo con funciones claras."
      />
      <section className="org-chart">
        <div className="org-node main">Cliente / Gerencia</div>
        <div className="org-line" />
        <div className="org-children">
          <div className="org-node">Talento 360</div>
          <div className="org-node">Grupo 6</div>
        </div>
      </section>
      <section className="info-grid">
        {roles.map(([role, description]) => (
          <Panel key={role} title={role}>
            <p className="soft-text">{description}</p>
          </Panel>
        ))}
      </section>
    </>
  );
}

function ManualPage({ setActivePage }) {
  const steps = [
    ["Reclutamiento", "Revisar vacantes abiertas, cargar CVs, aplicar filtro por palabras clave y consultar candidatos."],
    ["Personal", "Registrar colaborador, asignar departamento y consultar plantilla filtrando por estado o area."],
    ["Control diario", "Marcar asistencia desde formulario web. Registra fecha, colaborador y presente/ausente; ausencias incluyen motivo."],
    ["Desarrollo", "Seleccionar colaborador, registrar capacitacion o evaluacion y ver su porcentaje de desempeno."],
    ["Salida", "Registrar movimiento interno o salida definitiva con fecha, motivo y observaciones."],
    ["Reportes", "Consultar KPIs, graficas y datos consolidados para tomar decisiones."],
  ];
  return (
    <>
      <PageHeader
        eyebrow="Manual de usuario"
        title="Uso por modulo"
        description="Guia breve para explicar el recorrido durante la demostracion del producto."
        actions={<button className="ghost-button" onClick={() => setActivePage("dashboard")}><LayoutDashboard size={16} />Ir al dashboard</button>}
      />
      <section className="manual-list">
        {steps.map(([title, text], index) => (
          <article key={title} className="manual-step">
            <strong>{index + 1}</strong>
            <div>
              <span>{title}</span>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function DashboardPage({ refreshKey, refresh }) {
  const { data, loading, error } = useAsync(api.getDashboard, [refreshKey]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const summary = data.summary;
  const departmentData = data.by_department.map((item, index) => ({
    ...item,
    color: colorForDepartment(item.name, index),
  }));
  const performanceData = data.performance_by_department.map((item, index) => ({
    ...item,
    color: colorForDepartment(item.departamento, index),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Vista gerencial"
        title="Dashboard de Recursos Humanos"
        description="Indicadores clave para una empresa de 300 colaboradores, con colores separados por departamento."
        actions={<button className="ghost-button" onClick={refresh}><RefreshCw size={16} />Actualizar</button>}
      />
      <section className="metric-grid">
        <MetricCard label="Colaboradores" value={summary.total_colaboradores} detail={`${summary.activos} activos`} icon={UsersRound} />
        <MetricCard label="Asistencia" value={`${summary.tasa_asistencia}%`} detail={`${summary.ausencias} ausencias`} icon={Activity} tone="green" />
        <MetricCard label="Desempeno" value={`${summary.desempeno_promedio}%`} detail="Promedio neto" icon={BookOpenCheck} tone="cyan" />
        <MetricCard label="Rotacion" value={`${summary.rotacion}%`} detail={`${summary.terminados} salidas`} icon={LogOut} tone="lime" />
      </section>
      <section className="dashboard-grid">
        <Panel title="Distribucion por departamento" subtitle="Plantilla actual por area">
          <ResponsiveContainer width="100%" height={310}>
            <PieChart>
              <Pie data={departmentData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={105} paddingAngle={2}>
                {departmentData.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <DepartmentLegend items={departmentData} />
        </Panel>
        <Panel title="Desempeno por departamento" subtitle="Promedio neto de evaluacion">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="departamento" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="promedio" radius={[8, 8, 0, 0]}>
                {performanceData.map((item) => <Cell key={item.departamento} fill={item.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Asistencia por departamento" subtitle="Porcentaje de presencia registrada" className="wide-panel">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.attendance_by_department}>
              <defs>
                <linearGradient id="attendance" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="departamento" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={70} />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="asistencia" stroke="#059669" fill="url(#attendance)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </section>
    </>
  );
}

function RecruitmentPage({ refreshKey }) {
  const recruitment = useAsync(api.getRecruitment, [refreshKey]);
  const vacancies = useAsync(api.getVacancies, [refreshKey]);

  if (recruitment.loading || vacancies.loading) return <LoadingScreen />;
  if (recruitment.error) return <ErrorScreen error={recruitment.error} />;
  if (vacancies.error) return <ErrorScreen error={vacancies.error} />;

  const data = recruitment.data;
  const vacancyRows = vacancies.data || [];
  const vacancyTotal = vacancyRows.reduce((total, item) => total + item.cantidad, 0);
  const records = data.records || [];
  const columns = Object.keys(records[0] || {}).slice(0, 6).map((key) => ({ key, label: key }));

  return (
    <>
      <PageHeader
        eyebrow="Modulo 1"
        title="Reclutamiento"
        description="Vacantes, hojas de vida, filtro de candidatos y reporte del pipeline."
      />
      <section className="metric-grid three">
        <MetricCard label="CVs procesados" value={data.summary.total} icon={FileSearch} />
        <MetricCard label="Alta coincidencia" value={data.summary.alto} icon={BookOpenCheck} tone="green" />
        <MetricCard label="Vacantes abiertas" value={vacancyTotal} detail={`${vacancyRows.length} puestos`} icon={BriefcaseBusiness} tone="cyan" />
      </section>
      <Panel title="Vacantes disponibles" subtitle="Cantidad y puesto solicitado por la empresa">
        <div className="vacancy-grid">
          {vacancyRows.map((vacancy) => (
            <article className="vacancy-card" key={vacancy.id}>
              <div>
                <strong>{vacancy.puesto}</strong>
                <span>{vacancy.departamento}</span>
              </div>
              <b>{vacancy.cantidad}</b>
              <p>{vacancy.descripcion}</p>
              <small>{vacancy.estado} - Prioridad {vacancy.prioridad}</small>
            </article>
          ))}
        </div>
      </Panel>
      <Panel title="Reporte de candidatos" subtitle="Datos provenientes del modulo de reclutamiento existente">
        <DataTable columns={columns} rows={records} emptyText="Aun no hay reporte CSV de reclutamiento." />
      </Panel>
    </>
  );
}

function EmployeesPage({ refreshKey, refresh }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const departments = useAsync(api.getDepartments, [refreshKey]);
  const employees = useAsync(() => api.getEmployees({ q: query, status, department_id: department, limit: 150 }), [query, status, department, refreshKey]);
  const [form, setForm] = useState({
    numero_cedula: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "1995-01-01",
    nacionalidad: "Panamena",
    direccion: "Ciudad de Panama",
    telefono_principal: "6000-0000",
    fecha_ingreso: today,
    puesto: "Analista",
    id_departamento: "",
    observaciones: "Registro creado desde frontend.",
  });

  useEffect(() => {
    const first = departments.data?.[0]?.id_departamento;
    if (first && !form.id_departamento) setForm((current) => ({ ...current, id_departamento: first }));
  }, [departments.data]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMessage("");
    try {
      await api.createEmployee({ ...form, id_departamento: Number(form.id_departamento) });
      setMessage("Colaborador registrado correctamente.");
      setForm((current) => ({ ...current, numero_cedula: "", nombre: "", apellido: "" }));
      refresh();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Modulo 2"
        title="Personal"
        description="Registro maestro de colaboradores, ingreso laboral, estructura organizacional y consulta de plantilla."
      />
      <section className="split-grid">
        <Panel title="Nuevo colaborador" subtitle="Formulario conectado al backend">
          <Notice>{message}</Notice>
          <Notice type="error">{errorMessage}</Notice>
          <FormGrid onSubmit={submit} busy={saving} buttonLabel="Registrar colaborador">
            <Field label="Cedula"><input required value={form.numero_cedula} onChange={(e) => setForm({ ...form, numero_cedula: e.target.value })} /></Field>
            <Field label="Nombre"><input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Field>
            <Field label="Apellido"><input required value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} /></Field>
            <Field label="Nacimiento"><input type="date" required value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} /></Field>
            <Field label="Telefono"><input required value={form.telefono_principal} onChange={(e) => setForm({ ...form, telefono_principal: e.target.value })} /></Field>
            <Field label="Puesto"><input required value={form.puesto} onChange={(e) => setForm({ ...form, puesto: e.target.value })} /></Field>
            <Field label="Departamento">
              <select required value={form.id_departamento} onChange={(e) => setForm({ ...form, id_departamento: e.target.value })}>
                {(departments.data || []).map((dep) => <option key={dep.id_departamento} value={dep.id_departamento}>{dep.nombre_departamento}</option>)}
              </select>
            </Field>
            <Field label="Ingreso"><input type="date" required value={form.fecha_ingreso} onChange={(e) => setForm({ ...form, fecha_ingreso: e.target.value })} /></Field>
            <Field label="Direccion"><input required value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} /></Field>
          </FormGrid>
        </Panel>
        <Panel title="Departamentos" subtitle="Estructura organizacional">
          <DataTable
            columns={[
              { key: "nombre_departamento", label: "Departamento" },
              { key: "colaboradores", label: "Colaboradores" },
              { key: "descripcion", label: "Descripcion" },
            ]}
            rows={departments.data || []}
          />
        </Panel>
      </section>
      <Panel title="Plantilla de colaboradores" subtitle={<LastUpdated label={`${employees.data?.length || 0} registros visibles`} />}>
        <div className="toolbar">
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar por nombre, codigo o cedula" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="activo">Activos</option>
            <option value="terminado">Terminados</option>
          </select>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Todos los departamentos</option>
            {(departments.data || []).map((dep) => <option key={dep.id_departamento} value={dep.id_departamento}>{dep.nombre_departamento}</option>)}
          </select>
        </div>
        <DataTable
          columns={[
            { key: "codigo_empresa", label: "Codigo" },
            { key: "nombre_completo", label: "Nombre" },
            { key: "departamento", label: "Departamento" },
            { key: "puesto", label: "Puesto" },
            { key: "estado", label: "Estado", render: (value) => <StatusBadge value={value} /> },
            { key: "pct_desempeno", label: "Desempeno", render: (value) => value ? `${value}%` : "-" },
          ]}
          rows={employees.data || []}
        />
      </Panel>
    </>
  );
}

function DailyPage({ refreshKey, refresh }) {
  const options = useAsync(api.getEmployeeOptions, [refreshKey]);
  const recent = useAsync(api.getRecentRecords, [refreshKey]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [attendance, setAttendance] = useState({ codigo_empresa: "", fecha: today, presente: true });
  const [absence, setAbsence] = useState({ codigo_empresa: "", fecha: today, motivo: "Cita medica" });
  const [vacation, setVacation] = useState({ codigo_empresa: "", fecha_inicio: today, fecha_fin: today, observaciones: "Vacaciones aprobadas" });

  useEffect(() => {
    const first = options.data?.[0]?.codigo_empresa;
    if (first) {
      setAttendance((current) => current.codigo_empresa ? current : { ...current, codigo_empresa: first });
      setAbsence((current) => current.codigo_empresa ? current : { ...current, codigo_empresa: first });
      setVacation((current) => current.codigo_empresa ? current : { ...current, codigo_empresa: first });
    }
  }, [options.data]);

  async function handleSubmit(event, action, payload, label) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await action(payload);
      setMessage(`${label} guardado correctamente.`);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Modulo 3"
        title="Control diario"
        description="Marcado digital de asistencia y registro de ausencias/vacaciones."
      />
      <Panel title="Tipo de marcado de asistencia" subtitle="Propuesta para el cliente">
        <p className="soft-text">
          La demo utiliza marcado web por formulario: se selecciona colaborador, fecha y estado.
          En una version productiva puede integrarse con codigo QR, reloj biometrico, geolocalizacion
          o validacion desde dispositivo autorizado.
        </p>
      </Panel>
      <Notice>{message}</Notice>
      <Notice type="error">{error}</Notice>
      <section className="triple-grid">
        <Panel title="Asistencia">
          <FormGrid onSubmit={(e) => handleSubmit(e, api.recordAttendance, attendance, "Asistencia")} buttonLabel="Guardar asistencia">
            <EmployeeSelect value={attendance.codigo_empresa} options={options.data} onChange={(value) => setAttendance({ ...attendance, codigo_empresa: value })} />
            <Field label="Fecha"><input type="date" value={attendance.fecha} onChange={(e) => setAttendance({ ...attendance, fecha: e.target.value })} /></Field>
            <Field label="Estado">
              <select value={String(attendance.presente)} onChange={(e) => setAttendance({ ...attendance, presente: e.target.value === "true" })}>
                <option value="true">Presente</option>
                <option value="false">Ausente</option>
              </select>
            </Field>
          </FormGrid>
        </Panel>
        <Panel title="Ausencia">
          <FormGrid onSubmit={(e) => handleSubmit(e, api.recordAbsence, absence, "Ausencia")} buttonLabel="Registrar ausencia">
            <EmployeeSelect value={absence.codigo_empresa} options={options.data} onChange={(value) => setAbsence({ ...absence, codigo_empresa: value })} />
            <Field label="Fecha"><input type="date" value={absence.fecha} onChange={(e) => setAbsence({ ...absence, fecha: e.target.value })} /></Field>
            <Field label="Motivo"><input value={absence.motivo} onChange={(e) => setAbsence({ ...absence, motivo: e.target.value })} /></Field>
          </FormGrid>
        </Panel>
        <Panel title="Vacaciones">
          <FormGrid onSubmit={(e) => handleSubmit(e, api.recordVacation, vacation, "Vacaciones")} buttonLabel="Registrar vacaciones">
            <EmployeeSelect value={vacation.codigo_empresa} options={options.data} onChange={(value) => setVacation({ ...vacation, codigo_empresa: value })} />
            <Field label="Inicio"><input type="date" value={vacation.fecha_inicio} onChange={(e) => setVacation({ ...vacation, fecha_inicio: e.target.value })} /></Field>
            <Field label="Fin"><input type="date" value={vacation.fecha_fin} onChange={(e) => setVacation({ ...vacation, fecha_fin: e.target.value })} /></Field>
            <Field label="Observacion"><input value={vacation.observaciones} onChange={(e) => setVacation({ ...vacation, observaciones: e.target.value })} /></Field>
          </FormGrid>
        </Panel>
      </section>
      <Panel title="Registros recientes" subtitle="Ultimos movimientos de control diario">
        <DataTable
          columns={[
            { key: "codigo_empresa", label: "Codigo" },
            { key: "empleado", label: "Empleado" },
            { key: "fecha", label: "Fecha" },
            { key: "presente", label: "Estado", render: (value) => <StatusBadge value={value ? "Presente" : "Ausente"} /> },
          ]}
          rows={recent.data?.asistencias || []}
        />
      </Panel>
    </>
  );
}

function DevelopmentPage({ refreshKey, refresh }) {
  const options = useAsync(api.getEmployeeOptions, [refreshKey]);
  const recent = useAsync(api.getRecentRecords, [refreshKey]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const evaluations = useAsync(() => api.getEvaluations({ codigo_empresa: selectedEmployee, limit: 50 }), [selectedEmployee, refreshKey]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [training, setTraining] = useState({ codigo_empresa: "", nombre_capacitacion: "Liderazgo efectivo", fecha_inicio: today, fecha_fin: today });
  const [evaluation, setEvaluation] = useState({ codigo_empresa: "", fecha_evaluacion: today, pct_bruto: 86 });

  useEffect(() => {
    const first = options.data?.[0]?.codigo_empresa;
    if (first) {
      setSelectedEmployee((current) => current || first);
      setTraining((current) => current.codigo_empresa ? current : { ...current, codigo_empresa: first });
      setEvaluation((current) => current.codigo_empresa ? current : { ...current, codigo_empresa: first });
    }
  }, [options.data]);

  async function submit(event, action, payload, label) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await action(payload);
      setMessage(`${label} registrado correctamente.`);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  const latestEvaluation = evaluations.data?.[0];

  return (
    <>
      <PageHeader
        eyebrow="Modulo 4"
        title="Desarrollo"
        description="Capacitaciones y evaluacion de desempeno por colaborador, con filtro individual."
      />
      <Notice>{message}</Notice>
      <Notice type="error">{error}</Notice>
      <section className="split-grid">
        <Panel title="Evaluacion por usuario" subtitle="Filtra un colaborador y consulta su porcentaje">
          <div className="toolbar">
            <EmployeeSelect value={selectedEmployee} options={options.data} onChange={setSelectedEmployee} />
          </div>
          <div className="score-card">
            <span>Desempeno neto actual</span>
            <strong>{latestEvaluation ? `${latestEvaluation.pct_neto}%` : "Sin evaluacion"}</strong>
            <small>{latestEvaluation ? `Ultima evaluacion: ${latestEvaluation.fecha_evaluacion}` : "Registra una evaluacion para ver el resultado."}</small>
          </div>
          <DataTable
            columns={[
              { key: "fecha_evaluacion", label: "Fecha" },
              { key: "pct_bruto", label: "Bruto", render: (value) => `${value}%` },
              { key: "pct_neto", label: "Neto", render: (value) => `${value}%` },
            ]}
            rows={evaluations.data || []}
          />
        </Panel>
        <Panel title="Nueva capacitacion">
          <FormGrid onSubmit={(e) => submit(e, api.recordTraining, training, "Capacitacion")} buttonLabel="Guardar capacitacion">
            <EmployeeSelect value={training.codigo_empresa} options={options.data} onChange={(value) => setTraining({ ...training, codigo_empresa: value })} />
            <Field label="Capacitacion"><input value={training.nombre_capacitacion} onChange={(e) => setTraining({ ...training, nombre_capacitacion: e.target.value })} /></Field>
            <Field label="Inicio"><input type="date" value={training.fecha_inicio} onChange={(e) => setTraining({ ...training, fecha_inicio: e.target.value })} /></Field>
            <Field label="Fin"><input type="date" value={training.fecha_fin} onChange={(e) => setTraining({ ...training, fecha_fin: e.target.value })} /></Field>
          </FormGrid>
        </Panel>
      </section>
      <Panel title="Registrar evaluacion de desempeno">
        <FormGrid onSubmit={(e) => submit(e, api.recordEvaluation, { ...evaluation, pct_bruto: Number(evaluation.pct_bruto) }, "Evaluacion")} buttonLabel="Guardar evaluacion">
          <EmployeeSelect value={evaluation.codigo_empresa} options={options.data} onChange={(value) => setEvaluation({ ...evaluation, codigo_empresa: value })} />
          <Field label="Fecha"><input type="date" value={evaluation.fecha_evaluacion} onChange={(e) => setEvaluation({ ...evaluation, fecha_evaluacion: e.target.value })} /></Field>
          <Field label="Puntuacion bruta"><input type="number" min="0" max="100" value={evaluation.pct_bruto} onChange={(e) => setEvaluation({ ...evaluation, pct_bruto: e.target.value })} /></Field>
        </FormGrid>
      </Panel>
      <section className="split-grid">
        <Panel title="Capacitaciones recientes">
          <DataTable
            columns={[
              { key: "empleado", label: "Empleado" },
              { key: "nombre_capacitacion", label: "Capacitacion" },
              { key: "fecha_inicio", label: "Inicio" },
              { key: "fecha_fin", label: "Fin" },
            ]}
            rows={recent.data?.capacitaciones || []}
          />
        </Panel>
        <Panel title="Evaluaciones recientes">
          <DataTable
            columns={[
              { key: "empleado", label: "Empleado" },
              { key: "fecha_evaluacion", label: "Fecha" },
              { key: "pct_bruto", label: "Bruto", render: (value) => `${value}%` },
              { key: "pct_neto", label: "Neto", render: (value) => `${value}%` },
            ]}
            rows={recent.data?.evaluaciones || []}
          />
        </Panel>
      </section>
    </>
  );
}

function ExitPage({ refreshKey, refresh }) {
  const options = useAsync(api.getEmployeeOptions, [refreshKey]);
  const departments = useAsync(api.getDepartments, [refreshKey]);
  const recent = useAsync(api.getRecentRecords, [refreshKey]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [movement, setMovement] = useState({ codigo_empresa: "", fecha_movimiento: today, puesto_nuevo: "Coordinador", depto_nuevo: "", motivo: "Promocion interna" });
  const [termination, setTermination] = useState({ codigo_empresa: "", fecha_salida: today, motivo_salida: "Renuncia voluntaria", observaciones: "Cierre administrativo completado." });

  useEffect(() => {
    const first = options.data?.[0]?.codigo_empresa;
    const dep = departments.data?.[0]?.id_departamento;
    if (first) {
      setMovement((current) => current.codigo_empresa ? current : { ...current, codigo_empresa: first });
      setTermination((current) => current.codigo_empresa ? current : { ...current, codigo_empresa: first });
    }
    if (dep) setMovement((current) => current.depto_nuevo ? current : { ...current, depto_nuevo: dep });
  }, [options.data, departments.data]);

  async function submit(event, action, payload, label) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await action(payload);
      setMessage(`${label} registrado correctamente.`);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader eyebrow="Modulo 5" title="Salida y movimientos" description="Registro de promociones, traslados y salida definitiva." />
      <Notice>{message}</Notice>
      <Notice type="error">{error}</Notice>
      <section className="split-grid">
        <Panel title="Movimiento interno">
          <FormGrid onSubmit={(e) => submit(e, api.recordMovement, { ...movement, depto_nuevo: Number(movement.depto_nuevo) }, "Movimiento")} buttonLabel="Guardar movimiento">
            <EmployeeSelect value={movement.codigo_empresa} options={options.data} onChange={(value) => setMovement({ ...movement, codigo_empresa: value })} />
            <Field label="Fecha"><input type="date" value={movement.fecha_movimiento} onChange={(e) => setMovement({ ...movement, fecha_movimiento: e.target.value })} /></Field>
            <Field label="Nuevo puesto"><input value={movement.puesto_nuevo} onChange={(e) => setMovement({ ...movement, puesto_nuevo: e.target.value })} /></Field>
            <Field label="Nuevo departamento">
              <select value={movement.depto_nuevo} onChange={(e) => setMovement({ ...movement, depto_nuevo: e.target.value })}>
                {(departments.data || []).map((dep) => <option key={dep.id_departamento} value={dep.id_departamento}>{dep.nombre_departamento}</option>)}
              </select>
            </Field>
            <Field label="Motivo"><input value={movement.motivo} onChange={(e) => setMovement({ ...movement, motivo: e.target.value })} /></Field>
          </FormGrid>
        </Panel>
        <Panel title="Salida definitiva">
          <FormGrid onSubmit={(e) => submit(e, api.recordTermination, termination, "Salida")} buttonLabel="Registrar salida">
            <EmployeeSelect value={termination.codigo_empresa} options={options.data} onChange={(value) => setTermination({ ...termination, codigo_empresa: value })} />
            <Field label="Fecha"><input type="date" value={termination.fecha_salida} onChange={(e) => setTermination({ ...termination, fecha_salida: e.target.value })} /></Field>
            <Field label="Motivo"><input value={termination.motivo_salida} onChange={(e) => setTermination({ ...termination, motivo_salida: e.target.value })} /></Field>
            <Field label="Observacion"><input value={termination.observaciones} onChange={(e) => setTermination({ ...termination, observaciones: e.target.value })} /></Field>
          </FormGrid>
        </Panel>
      </section>
      <section className="split-grid">
        <Panel title="Movimientos recientes">
          <DataTable
            columns={[
              { key: "empleado", label: "Empleado" },
              { key: "fecha_movimiento", label: "Fecha" },
              { key: "puesto_anterior", label: "Anterior" },
              { key: "puesto_nuevo", label: "Nuevo" },
            ]}
            rows={recent.data?.movimientos || []}
          />
        </Panel>
        <Panel title="Salidas recientes">
          <DataTable
            columns={[
              { key: "empleado", label: "Empleado" },
              { key: "fecha_salida", label: "Fecha" },
              { key: "motivo_salida", label: "Motivo" },
            ]}
            rows={recent.data?.salidas || []}
          />
        </Panel>
      </section>
    </>
  );
}

function ReportsPage({ refreshKey, refresh }) {
  const { data, loading, error } = useAsync(api.getDashboard, [refreshKey]);
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const departmentData = data.by_department.map((item, index) => ({
    ...item,
    color: colorForDepartment(item.name, index),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Modulo 6"
        title="Reportes gerenciales"
        description="Panel consolidado para analizar plantilla, rotacion, asistencia y desempeno."
        actions={<button className="ghost-button" onClick={refresh}><RefreshCw size={16} />Actualizar</button>}
      />
      <section className="metric-grid four">
        <MetricCard label="Plantilla activa" value={data.summary.activos} icon={UsersRound} />
        <MetricCard label="Rotacion" value={`${data.summary.rotacion}%`} icon={LogOut} tone="lime" />
        <MetricCard label="Capacitaciones" value={data.summary.capacitaciones} icon={Brain} tone="green" />
        <MetricCard label="Ausencias" value={data.summary.ausencias} icon={ClipboardList} tone="cyan" />
      </section>
      <section className="dashboard-grid">
        <Panel title="Salidas por mes">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthly_exits}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="salidas" fill="#0f766e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Plantilla por departamento">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} layout="vertical" margin={{ left: 35 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {departmentData.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </section>
    </>
  );
}

function DepartmentLegend({ items }) {
  return (
    <div className="department-legend">
      {items.map((item) => (
        <span key={item.name}>
          <i style={{ background: item.color }} />
          {item.name}
        </span>
      ))}
    </div>
  );
}

function EmployeeSelect({ value, onChange, options = [] }) {
  const safeOptions = options || [];
  return (
    <Field label="Empleado">
      <select required value={value} onChange={(event) => onChange(event.target.value)}>
        {safeOptions.map((employee) => (
          <option key={employee.codigo_empresa} value={employee.codigo_empresa}>
            {employee.codigo_empresa} - {employee.nombre_completo}
          </option>
        ))}
      </select>
    </Field>
  );
}

function LoadingScreen() {
  return (
    <div className="screen-state">
      <RefreshCw className="spin" size={28} />
      <strong>Cargando sistema de RRHH...</strong>
    </div>
  );
}

function ErrorScreen({ error }) {
  return (
    <div className="screen-state error-state">
      <PieChartIcon size={30} />
      <strong>No se pudo cargar la informacion</strong>
      <span>{error}</span>
    </div>
  );
}

export default App;
