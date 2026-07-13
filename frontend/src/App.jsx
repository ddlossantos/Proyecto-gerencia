import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ChevronRight,
  CheckCircle2,
  ClipboardList,
  Database,
  FileSearch,
  Handshake,
  HelpCircle,
  Home,
  Layers3,
  LayoutDashboard,
  LogOut,
  MonitorCheck,
  Moon,
  PieChart as PieChartIcon,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sun,
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

const mainTabs = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "solution", label: "Solucion", icon: Handshake },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const moduleTabs = [
  { id: "overview", label: "Resumen", icon: PieChartIcon },
  { id: "recruitment", label: "Reclutamiento", icon: FileSearch },
  { id: "employees", label: "Personal", icon: UsersRound },
  { id: "daily", label: "Control diario", icon: CalendarCheck },
  { id: "development", label: "Desarrollo", icon: Brain },
  { id: "exit", label: "Salida", icon: LogOut },
  { id: "reports", label: "Reportes", icon: BarChart3 },
];

const productModules = [
  {
    title: "Reclutamiento",
    text: "Vacantes abiertas, recepcion de CVs, filtro por palabras clave y reporte de candidatos.",
    icon: FileSearch,
  },
  {
    title: "Personal",
    text: "Expediente unico del colaborador con ingreso, puesto, departamento, estado y desempeno.",
    icon: UsersRound,
  },
  {
    title: "Control diario",
    text: "Marcado web de asistencia por colaborador, con fecha, presente/ausente, ausencias y vacaciones.",
    icon: CalendarCheck,
  },
  {
    title: "Desarrollo",
    text: "Capacitaciones y evaluaciones por usuario con porcentaje bruto y porcentaje neto.",
    icon: Brain,
  },
  {
    title: "Salida",
    text: "Movimientos internos, promociones, traslados y salida definitiva documentada.",
    icon: LogOut,
  },
  {
    title: "Reportes",
    text: "Indicadores para gerencia sobre plantilla, asistencia, rotacion, desempeno y departamentos.",
    icon: BarChart3,
  },
];

const chartTooltipProps = {
  contentStyle: {
    border: "1px solid var(--line)",
    borderRadius: 8,
    color: "var(--ink)",
    background: "var(--card)",
    boxShadow: "var(--shadow-sm)",
  },
  labelStyle: {
    color: "var(--ink)",
    fontWeight: 800,
  },
  itemStyle: {
    color: "var(--ink)",
  },
};

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
  const [activeModule, setActiveModule] = useState("overview");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    return window.localStorage.getItem("talento-theme") || "light";
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((value) => value + 1);
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("talento-theme", theme);
  }, [theme]);

  const page = useMemo(() => {
    const props = { refreshKey, refresh, setActivePage, activeModule, setActiveModule };
    return {
      home: <HomePage {...props} />,
      solution: <SolutionPage {...props} />,
      dashboard: <DashboardWorkspace {...props} />,
    }[activePage];
  }, [activePage, activeModule, refreshKey]);

  return (
    <div className="product-shell">
      <header className="topbar">
        <button className="brand-button" onClick={() => setActivePage("home")}>
          <div className="brand-mark">T360</div>
          <div>
            <strong>Talento 360</strong>
            <span>Grupo 6 | RRHH</span>
          </div>
        </button>
        <nav className="main-nav" aria-label="Navegacion principal">
          {mainTabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activePage === item.id ? "active" : ""}
                key={item.id}
                onClick={() => setActivePage(item.id)}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="topbar-actions">
          <div className="topbar-badge">
            <Database size={16} />
            Demo con 300 colaboradores
          </div>
          <button
            className="theme-toggle"
            type="button"
            aria-label={isDarkTheme ? "Activar modo claro" : "Activar modo nocturno"}
            title={isDarkTheme ? "Modo claro" : "Modo nocturno"}
            onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDarkTheme ? "Claro" : "Nocturno"}</span>
          </button>
        </div>
      </header>
      <main className="content">{page}</main>
    </div>
  );
}

function HomePage({ setActivePage }) {
  const roles = [
    ["Direccion del proyecto", "Coordina alcance, avances, integracion y defensa del producto."],
    ["Analisis de RRHH", "Define procesos, reglas de negocio e indicadores por modulo."],
    ["Diseno y experiencia", "Convierte el sistema en una presentacion clara, vendible y usable."],
    ["Datos y backend", "Organiza la API, la base demo y los reportes para gerencia."],
    ["Presentacion comercial", "Explica el valor de Talento 360 frente a la necesidad del cliente."],
  ];

  return (
    <>
      <section className="hero-product">
        <div className="hero-copy">
          <span className="eyebrow">Software de Recursos Humanos</span>
          <h1>Talento 360</h1>
          <p>
            Una plataforma modular para vender a gerencia una forma moderna de administrar
            talento humano: reclutamiento, expediente laboral, asistencia, desarrollo,
            salida y reportes en una sola experiencia.
          </p>
          <div className="hero-actions">
            <button className="primary-button standalone" onClick={() => setActivePage("solution")}>
              <Handshake size={17} />
              Ver solucion
              <ArrowRight size={16} />
            </button>
            <button className="ghost-button" onClick={() => setActivePage("dashboard")}>
              <LayoutDashboard size={17} />
              Abrir dashboard
            </button>
          </div>
          <div className="hero-proof">
            <span><CheckCircle2 size={16} /> 6 modulos conectados</span>
            <span><CheckCircle2 size={16} /> Data demo con 300 colaboradores</span>
            <span><CheckCircle2 size={16} /> API FastAPI en ejecucion</span>
          </div>
        </div>
        <div className="product-visual" aria-label="Vista conceptual del software">
          <div className="visual-topline">
            <span>Panel gerencial</span>
            <b>Talento 360</b>
          </div>
          <div className="visual-kpis">
            <div><strong>300</strong><span>Colaboradores</span></div>
            <div><strong>94.6%</strong><span>Asistencia</span></div>
            <div><strong>79.1%</strong><span>Desempeno</span></div>
          </div>
          <div className="visual-dashboard">
            <div className="visual-chart">
              <i style={{ height: "72%" }} />
              <i style={{ height: "46%" }} />
              <i style={{ height: "88%" }} />
              <i style={{ height: "58%" }} />
              <i style={{ height: "78%" }} />
            </div>
            <div className="visual-list">
              <span><i /> Reclutamiento <b>10 vacantes</b></span>
              <span><i /> Desarrollo <b>Por usuario</b></span>
              <span><i /> Control diario <b>Marcado web</b></span>
            </div>
          </div>
          <div className="visual-footer">
            <span>Vacantes abiertas</span>
            <strong>10 puestos</strong>
          </div>
        </div>
      </section>
      <section className="logo-strip" aria-label="Beneficios clave">
        {["Centralizacion", "Automatizacion", "Indicadores", "Trazabilidad"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>
      <section className="story-section">
        <div>
          <span className="eyebrow">Introduccion</span>
          <h2>De registros dispersos a una solucion integral</h2>
        </div>
        <p>
          El proyecto parte de procesos tradicionales de Recursos Humanos que suelen vivir en
          hojas, correos y archivos separados. Talento 360 une esos procesos en un producto
          demostrable, con datos de ejemplo y una interfaz pensada para explicar valor, no solo
          para capturar informacion.
        </p>
      </section>
      <section className="feature-section">
        <div className="section-heading centered">
          <span className="eyebrow">Valor del producto</span>
          <h2>Una propuesta lista para presentarse como software</h2>
          <p>
            La interfaz deja de sentirse como una entrega tecnica aislada y se presenta como
            una solucion que un area de Recursos Humanos podria evaluar, comprar y usar.
          </p>
        </div>
        <div className="feature-grid">
          {[
            ["Menos datos dispersos", "Une colaboradores, asistencia, desarrollo y reportes en un flujo claro.", Database],
            ["Gestion por modulo", "Cada pantalla explica su proposito y ofrece acciones concretas para operar.", Layers3],
            ["Lectura gerencial", "El dashboard resume plantilla, departamentos, rotacion y desempeno.", MonitorCheck],
          ].map(([title, text, Icon]) => (
            <article className="feature-card" key={title}>
              <div className="feature-icon"><Icon size={22} /></div>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="story-section">
        <div>
          <span className="eyebrow">Organigrama</span>
          <h2>Como se presenta el producto ante gerencia</h2>
        </div>
        <div className="org-chart">
          <div className="org-node main">Gerencia / Cliente</div>
          <div className="org-line" />
          <div className="org-children">
            <div className="org-node">Talento 360</div>
            <div className="org-node">Equipo Grupo 6</div>
            <div className="org-node">Usuarios RRHH</div>
          </div>
        </div>
      </section>
      <section className="process-section">
        <div className="section-heading">
          <span className="eyebrow">Recorrido comercial</span>
          <h2>Como se vende la solucion</h2>
        </div>
        <div className="process-grid">
          {[
            ["01", "Problema", "Procesos manuales, registros duplicados y poca visibilidad para gerencia."],
            ["02", "Producto", "Talento 360 centraliza el ciclo de vida del colaborador."],
            ["03", "Evidencia", "La demo muestra datos, formularios, graficas y modulos funcionando."],
            ["04", "Decision", "Gerencia puede ver beneficios operativos y KPIs desde el dashboard."],
          ].map(([number, title, text]) => (
            <article className="process-card" key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="roles-section">
        <div className="section-heading">
          <span className="eyebrow">Quienes somos</span>
          <h2>Funciones de integrantes</h2>
          <p>Estos cargos son de ejemplo y quedan listos para reemplazar por nombres reales.</p>
        </div>
        <div className="role-grid">
          {roles.map(([role, description]) => (
            <article className="role-card" key={role}>
              <strong>{role}</strong>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="cta-panel">
        <div>
          <span className="eyebrow">Demo ejecutable</span>
          <h2>Del discurso al sistema funcionando</h2>
          <p>
            Abre el dashboard para mostrar los modulos operativos, filtros, vacantes,
            evaluaciones por usuario y reportes conectados al backend.
          </p>
        </div>
        <button className="primary-button standalone" onClick={() => setActivePage("dashboard")}>
          <LayoutDashboard size={18} />
          Ir al dashboard
        </button>
      </section>
    </>
  );
}

function SolutionPage({ setActivePage }) {
  const faqs = [
    ["Que tipo de asistencia utiliza?", "La demo usa marcado web por formulario: colaborador, fecha y estado. En produccion puede ampliarse a QR, biometria o geolocalizacion."],
    ["Los datos son reales?", "Son datos demo generados para presentar el sistema con volumen suficiente sin exponer informacion sensible."],
    ["Que vende Talento 360?", "Vende orden, trazabilidad y reportes ejecutivos para mejorar la gestion de Recursos Humanos."],
    ["El dashboard es general o por usuario?", "Incluye KPIs generales y evaluacion individual por colaborador en el modulo de Desarrollo."],
  ];

  return (
    <>
      <section className="solution-hero">
        <div>
          <span className="eyebrow">Producto / solucion</span>
          <h1>Un sistema modular para gestionar talento humano</h1>
          <p>
            Talento 360 combina manual de uso, propuesta comercial y modulos operativos
            para que la defensa se sienta como la presentacion de un producto real.
          </p>
          <div className="hero-actions">
            <button className="primary-button standalone" onClick={() => setActivePage("dashboard")}>
              <LayoutDashboard size={17} />
              Ver dashboard
            </button>
            <button className="ghost-button" onClick={() => setActivePage("home")}>
              <Home size={17} />
              Volver al inicio
            </button>
          </div>
        </div>
        <div className="solution-summary">
          <div><strong>6</strong><span>modulos funcionales</span></div>
          <div><strong>300</strong><span>colaboradores demo</span></div>
          <div><strong>1</strong><span>dashboard gerencial</span></div>
        </div>
      </section>
      <section className="module-guide">
        {productModules.map(({ title, text, icon: Icon }) => (
          <article key={title} className="module-card">
            <div className="module-icon"><Icon size={20} /></div>
            <span>{title}</span>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="manual-section">
        <div className="section-heading">
          <span className="eyebrow">Manual de usuario</span>
          <h2>Recorrido por modulo</h2>
          <p>Guia breve para presentar como se usa el sistema durante la defensa.</p>
        </div>
        <ManualSteps />
      </section>
      <section className="faq-section">
        <div className="section-heading centered">
          <span className="eyebrow">Preguntas de defensa</span>
          <h2>Respuestas rapidas para explicar el producto</h2>
        </div>
        <div className="faq-grid">
          {faqs.map(([title, text]) => (
            <article className="faq-card" key={title}>
              <div className="faq-icon"><HelpCircle size={20} /></div>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="cta-panel">
        <div>
          <span className="eyebrow">Producto listo para demo</span>
          <h2>Ahora toca mostrarlo como software, no como tareas sueltas</h2>
          <p>
            Usa el dashboard para demostrar vacantes, desempeno por usuario,
            asistencia y reportes con datos conectados.
          </p>
        </div>
        <button className="primary-button standalone" onClick={() => setActivePage("dashboard")}>
          <MonitorCheck size={18} />
          Abrir demo
        </button>
      </section>
    </>
  );
}

function ManualSteps() {
  const steps = [
    ["Reclutamiento", "Revisar vacantes abiertas, cargar CVs, aplicar filtro por palabras clave y consultar candidatos."],
    ["Personal", "Registrar colaborador, asignar departamento y consultar plantilla filtrando por estado o area."],
    ["Control diario", "Marcar asistencia desde formulario web. Registra fecha, colaborador y presente/ausente; ausencias incluyen motivo."],
    ["Desarrollo", "Seleccionar colaborador, registrar capacitacion o evaluacion y ver su porcentaje de desempeno."],
    ["Salida", "Registrar movimiento interno o salida definitiva con fecha, motivo y observaciones."],
    ["Reportes", "Consultar KPIs, graficas y datos consolidados para tomar decisiones."],
  ];

  return (
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
  );
}

function DashboardWorkspace({ refreshKey, refresh, activeModule, setActiveModule }) {
  const modulePages = {
    overview: <DashboardPage refreshKey={refreshKey} refresh={refresh} />,
    recruitment: <RecruitmentPage refreshKey={refreshKey} refresh={refresh} />,
    employees: <EmployeesPage refreshKey={refreshKey} refresh={refresh} />,
    daily: <DailyPage refreshKey={refreshKey} refresh={refresh} />,
    development: <DevelopmentPage refreshKey={refreshKey} refresh={refresh} />,
    exit: <ExitPage refreshKey={refreshKey} refresh={refresh} />,
    reports: <ReportsPage refreshKey={refreshKey} refresh={refresh} />,
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-mark">T360</div>
          <div>
            <strong>Talento 360</strong>
            <span>Admin workspace</span>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Modulos del dashboard">
          {moduleTabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeModule === item.id ? "active" : ""}
                key={item.id}
                onClick={() => setActiveModule(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                <ChevronRight size={15} />
              </button>
            );
          })}
        </nav>
        <div className="admin-sidebar-card">
          <Settings2 size={18} />
          <strong>Demo operativa</strong>
          <span>FastAPI + React con datos generados para presentacion.</span>
        </div>
      </aside>
      <section className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="eyebrow">Panel administrativo</span>
            <strong>{moduleTabs.find((item) => item.id === activeModule)?.label || "Dashboard"}</strong>
          </div>
          <div className="admin-actions">
            <span><Database size={16} /> 300 colaboradores</span>
            <button className="ghost-button" onClick={refresh}><RefreshCw size={16} />Actualizar</button>
          </div>
        </div>
        <div className="admin-content">
          {modulePages[activeModule]}
        </div>
      </section>
    </div>
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
              <Tooltip {...chartTooltipProps} />
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
              <Tooltip {...chartTooltipProps} />
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
              <Tooltip {...chartTooltipProps} />
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
              <Tooltip {...chartTooltipProps} />
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
              <Tooltip {...chartTooltipProps} />
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
