import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ChevronRight,
  CheckCircle2,
  CircleUserRound,
  ClipboardList,
  Database,
  FileDown,
  FileSearch,
  Filter,
  Handshake,
  HelpCircle,
  Home,
  Layers3,
  LayoutDashboard,
  LogOut,
  MonitorCheck,
  Moon,
  PieChart as PieChartIcon,
  Printer,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sun,
  UserCheck,
  UserRoundCog,
  UsersRound,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "./api";
import {
  DataTable,
  EmptyState,
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
const defaultStartDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)
  .toISOString()
  .slice(0, 10);

const departmentPalette = {
  Calidad: "#0e7490",
  Compras: "#2563eb",
  "Dirección General": "#475569",
  Finanzas: "#d97706",
  Legal: "#dc2626",
  Logística: "#0891b2",
  Marketing: "#65a30d",
  Operaciones: "#db2777",
  "Recursos Humanos": "#0f766e",
  "Servicio al Cliente": "#4f46e5",
  Tecnología: "#ea580c",
  Ventas: "#16a34a",
};

const fallbackColors = [
  "#0e7490",
  "#2563eb",
  "#475569",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#65a30d",
  "#db2777",
  "#0f766e",
  "#4f46e5",
  "#ea580c",
  "#16a34a",
];

const mainTabs = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "solution", label: "Solución", icon: Handshake },
  { id: "pricing", label: "Planes", icon: BadgeDollarSign },
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
    text: "Vacantes abiertas, recepción de CV, filtro por palabras clave y reporte de candidatos.",
    icon: FileSearch,
  },
  {
    title: "Personal",
    text: "Expediente único del colaborador con ingreso, puesto, departamento, estado y desempeño.",
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
    text: "Indicadores para gerencia sobre plantilla, asistencia, rotación, desempeño y departamentos.",
    icon: BarChart3,
  },
];

const pricingTiers = [
  {
    name: "Básico",
    price: "B/. 49",
    cadence: "mensual",
    description: "Para equipos pequeños que necesitan ordenar expedientes y asistencia.",
    features: [
      "Hasta 75 colaboradores",
      "Personal y control diario",
      "Dashboard básico",
      "Reporte imprimible mensual",
    ],
  },
  {
    name: "Personal",
    price: "B/. 129",
    cadence: "mensual",
    description: "Para empresas en crecimiento que necesitan operar todo el ciclo de RR. HH.",
    featured: true,
    features: [
      "Hasta 300 colaboradores",
      "Reclutamiento, desarrollo y salida",
      "Vista de administrador y empleado",
      "Filtros por fecha, estado y departamento",
    ],
  },
  {
    name: "Empresarial",
    price: "Cotización personalizada",
    cadence: "según el caso",
    description: "Para organizaciones que requieren integración, soporte y reglas particulares.",
    features: [
      "Colaboradores ilimitados según alcance",
      "Integración con MySQL y sistemas internos",
      "Marcado QR, biometría o geolocalización",
      "Soporte y reportes a medida",
    ],
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

const integerFormatter = new Intl.NumberFormat("es-PA", { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat("es-PA", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatPercentage(value) {
  return `${decimalFormatter.format(Number(value) || 0)}%`;
}

function formatInteger(value) {
  return integerFormatter.format(Number(value) || 0);
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
      pricing: <PricingPage {...props} />,
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
        <nav className="main-nav" aria-label="Navegación principal">
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
    ["Dirección del proyecto", "Coordina alcance, avances, integración y defensa del producto."],
    ["Análisis de RR. HH.", "Define procesos, reglas de negocio e indicadores por módulo."],
    ["Diseño y experiencia", "Convierte el sistema en una presentación clara, vendible y fácil de usar."],
    ["Datos y backend", "Organiza la API, la base demo y los reportes para gerencia."],
    ["Presentación comercial", "Explica el valor de Talento 360 frente a la necesidad del cliente."],
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
              Ver solución
              <ArrowRight size={16} />
            </button>
            <button className="ghost-button" onClick={() => setActivePage("dashboard")}>
              <LayoutDashboard size={17} />
              Abrir dashboard
            </button>
          </div>
          <div className="hero-proof">
            <span><CheckCircle2 size={16} /> 6 módulos conectados</span>
            <span><CheckCircle2 size={16} /> Data demo con 300 colaboradores</span>
            <span><CheckCircle2 size={16} /> API FastAPI en ejecución</span>
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
            <div><strong>79.1%</strong><span>Desempeño</span></div>
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
          {["Centralización", "Automatización", "Indicadores", "Trazabilidad"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>
      <section className="story-section">
        <div>
          <span className="eyebrow">Introducción</span>
          <h2>De registros dispersos a una solución integral</h2>
        </div>
        <p>
          El proyecto parte de procesos tradicionales de Recursos Humanos que suelen vivir en
          hojas, correos y archivos separados. Talento 360 une esos procesos en un producto
          demostrable, con datos de ejemplo y una interfaz pensada para explicar valor, no solo
          para capturar información.
        </p>
      </section>
      <section className="feature-section">
        <div className="section-heading centered">
          <span className="eyebrow">Valor del producto</span>
          <h2>Una propuesta lista para presentarse como software</h2>
          <p>
            La interfaz deja de sentirse como una entrega técnica aislada y se presenta como
            una solución que un área de Recursos Humanos podría evaluar, comprar y usar.
          </p>
        </div>
        <div className="feature-grid">
          {[
            ["Menos datos dispersos", "Une colaboradores, asistencia, desarrollo y reportes en un flujo claro.", Database],
            ["Gestión por módulo", "Cada pantalla explica su propósito y ofrece acciones concretas para operar.", Layers3],
            ["Lectura gerencial", "El dashboard resume plantilla, departamentos, rotación y desempeño.", MonitorCheck],
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
          <h2>Cómo se presenta el producto ante gerencia</h2>
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
          <h2>Cómo se vende la solución</h2>
        </div>
        <div className="process-grid">
          {[
            ["01", "Problema", "Procesos manuales, registros duplicados y poca visibilidad para gerencia."],
            ["02", "Producto", "Talento 360 centraliza el ciclo de vida del colaborador."],
            ["03", "Evidencia", "La demostración muestra datos, formularios, gráficas y módulos funcionando."],
            ["04", "Decisión", "Gerencia puede ver beneficios operativos y KPI desde el dashboard."],
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
          <span className="eyebrow">Quiénes somos</span>
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
            Abre el dashboard para mostrar los módulos operativos, filtros, vacantes,
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
    ["¿Qué tipo de asistencia utiliza?", "La demostración usa marcado web por formulario: colaborador, fecha y estado. En producción puede ampliarse a QR, biometría o geolocalización."],
    ["¿Los datos son reales?", "Son datos de demostración generados para presentar el sistema con volumen suficiente sin exponer información sensible."],
    ["¿Qué vende Talento 360?", "Vende orden, trazabilidad y reportes ejecutivos para mejorar la gestión de Recursos Humanos."],
    ["¿El dashboard es general o por usuario?", "Incluye KPI generales y evaluación individual por colaborador en el módulo de Desarrollo."],
  ];

  return (
    <>
      <section className="solution-hero">
        <div>
          <span className="eyebrow">Producto / solución</span>
          <h1>Un sistema modular para gestionar talento humano</h1>
          <p>
            Talento 360 combina manual de uso, propuesta comercial y módulos operativos
            para que la defensa se sienta como la presentación de un producto real.
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
          <div><strong>6</strong><span>módulos funcionales</span></div>
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
          <h2>Recorrido por módulo</h2>
          <p>Guía breve para presentar cómo se usa el sistema durante la defensa.</p>
        </div>
        <ManualSteps />
      </section>
      <section className="faq-section">
        <div className="section-heading centered">
          <span className="eyebrow">Preguntas de defensa</span>
          <h2>Respuestas rápidas para explicar el producto</h2>
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
            Usa el dashboard para demostrar vacantes, desempeño por usuario,
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

function PricingPage({ setActivePage }) {
  return (
    <>
      <section className="pricing-hero">
        <div>
          <span className="eyebrow">Planes comerciales</span>
          <h1>Paquetes para vender Talento 360</h1>
          <p>
            Tres niveles para presentar la solución como software: entrada accesible,
            operación completa y propuesta empresarial adaptable al cliente.
          </p>
        </div>
        <button className="primary-button standalone" onClick={() => setActivePage("dashboard")}>
          <MonitorCheck size={17} />
          Ver demo funcional
        </button>
      </section>
      <section className="pricing-grid">
        {pricingTiers.map((tier) => (
          <article className={`pricing-card ${tier.featured ? "featured" : ""}`} key={tier.name}>
            {tier.featured && <span className="pricing-badge">Recomendado para la demo</span>}
            <div className="pricing-icon">
              <BadgeDollarSign size={22} />
            </div>
            <h2>{tier.name}</h2>
            <p>{tier.description}</p>
            <div className="price-value">
              <strong>{tier.price}</strong>
              <span>{tier.cadence}</span>
            </div>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 size={16} />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="cta-panel">
        <div>
          <span className="eyebrow">Argumento de venta</span>
          <h2>El precio se defiende con ahorro operativo y trazabilidad</h2>
          <p>
            La propuesta no solo cobra por pantallas: cobra por centralizar datos,
            reducir tareas manuales y entregar indicadores para decisiones de gerencia.
          </p>
        </div>
        <button className="primary-button standalone" onClick={() => setActivePage("solution")}>
          <Handshake size={18} />
          Revisar solución
        </button>
      </section>
    </>
  );
}

function ManualSteps() {
  const steps = [
    ["Reclutamiento", "Revisar vacantes abiertas, cargar CVs, aplicar filtro por palabras clave y consultar candidatos."],
    ["Personal", "Registrar un colaborador, asignar un departamento y consultar la plantilla por estado o área."],
    ["Control diario", "Marcar asistencia desde formulario web. Registra fecha, colaborador y presente/ausente; ausencias incluyen motivo."],
    ["Desarrollo", "Seleccionar un colaborador, registrar una capacitación o evaluación y ver su porcentaje de desempeño."],
    ["Salida", "Registrar movimiento interno o salida definitiva con fecha, motivo y observaciones."],
    ["Reportes", "Consultar KPI, gráficas y datos consolidados para tomar decisiones."],
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
  const [workspaceMode, setWorkspaceMode] = useState("admin");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const options = useAsync(api.getEmployeeOptions, [refreshKey]);
  const modulePages = {
    overview: <DashboardPage refreshKey={refreshKey} refresh={refresh} />,
    recruitment: <RecruitmentPage refreshKey={refreshKey} refresh={refresh} />,
    employees: <EmployeesPage refreshKey={refreshKey} refresh={refresh} />,
    daily: <DailyPage refreshKey={refreshKey} refresh={refresh} />,
    development: <DevelopmentPage refreshKey={refreshKey} refresh={refresh} />,
    exit: <ExitPage refreshKey={refreshKey} refresh={refresh} />,
    reports: <ReportsPage refreshKey={refreshKey} refresh={refresh} />,
  };
  const isEmployeeMode = workspaceMode === "employee";

  useEffect(() => {
    const first = options.data?.[0]?.codigo_empresa;
    if (first) {
      setSelectedEmployee((current) => current || first);
    }
  }, [options.data]);

  return (
    <div className={`admin-shell ${isEmployeeMode ? "employee-mode" : ""}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-mark">T360</div>
          <div>
            <strong>Talento 360</strong>
            <span>{isEmployeeMode ? "Portal del empleado" : "Admin workspace"}</span>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Módulos del dashboard">
          {isEmployeeMode ? (
            <button className="active" type="button">
              <CircleUserRound size={18} />
              <span>Mi portal</span>
              <ChevronRight size={15} />
            </button>
          ) : (
            moduleTabs.map((item) => {
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
            })
          )}
        </nav>
        <div className="admin-sidebar-card">
          {isEmployeeMode ? <UserCheck size={18} /> : <Settings2 size={18} />}
          <strong>{isEmployeeMode ? "Vista limitada" : "Demo operativa"}</strong>
          <span>
            {isEmployeeMode
              ? "El colaborador consulta su información sin administrar datos globales."
              : "FastAPI + React con datos generados para la presentación."}
          </span>
        </div>
      </aside>
      <section className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="eyebrow">{isEmployeeMode ? "Panel del empleado" : "Panel administrativo"}</span>
            <strong>{isEmployeeMode ? "Mi información laboral" : moduleTabs.find((item) => item.id === activeModule)?.label || "Dashboard"}</strong>
          </div>
          <div className="admin-actions">
            <div className="view-switch" role="group" aria-label="Cambiar vista">
              <button
                className={workspaceMode === "admin" ? "active" : ""}
                type="button"
                onClick={() => setWorkspaceMode("admin")}
              >
                <UserRoundCog size={16} />
                Admin
              </button>
              <button
                className={workspaceMode === "employee" ? "active" : ""}
                type="button"
                onClick={() => setWorkspaceMode("employee")}
              >
                <CircleUserRound size={16} />
                Empleado
              </button>
            </div>
            {isEmployeeMode ? (
              <select
                className="employee-picker"
                value={selectedEmployee}
                onChange={(event) => setSelectedEmployee(event.target.value)}
                aria-label="Seleccionar empleado demo"
              >
                {(options.data || []).map((employee) => (
                  <option key={employee.codigo_empresa} value={employee.codigo_empresa}>
                    {employee.codigo_empresa} - {employee.nombre_completo}
                  </option>
                ))}
              </select>
            ) : (
              <span><Database size={16} /> 300 colaboradores</span>
            )}
            <button className="ghost-button" onClick={refresh}><RefreshCw size={16} />Actualizar</button>
          </div>
        </div>
        <div className="admin-content">
          {isEmployeeMode ? (
            <EmployeeWorkspace codigoEmpresa={selectedEmployee} refreshKey={refreshKey} />
          ) : (
            modulePages[activeModule]
          )}
        </div>
      </section>
    </div>
  );
}

function EmployeeWorkspace({ codigoEmpresa, refreshKey }) {
  const { data, loading, error } = useAsync(
    () => codigoEmpresa ? api.getEmployeeWorkspace(codigoEmpresa) : Promise.resolve(null),
    [codigoEmpresa, refreshKey],
  );

  if (!codigoEmpresa) {
    return <EmptyState title="Selecciona un empleado" text="Usa el selector superior para abrir una vista de empleado." />;
  }
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (!data) return null;

  const profile = data.profile;
  const latestEvaluation = data.evaluaciones?.[0];
  const attendanceCount = data.asistencias?.filter((item) => item.presente).length || 0;
  const absenceCount = data.ausencias?.length || 0;

  return (
    <>
      <PageHeader
        eyebrow="Vista de empleado"
        title={profile.nombre_completo}
        description="Portal de consulta personal con perfil laboral, asistencia, capacitaciones y evaluación individual."
      />
      <section className="metric-grid four">
        <MetricCard label="Estado" value={profile.estado} detail={profile.departamento} icon={UserCheck} />
        <MetricCard label="Puesto" value={profile.puesto || "-"} detail={`Código ${profile.codigo_empresa}`} icon={BriefcaseBusiness} tone="cyan" />
        <MetricCard label="Asistencias recientes" value={attendanceCount} detail="Últimos registros presentes" icon={CalendarCheck} tone="green" />
        <MetricCard label="Desempeño actual" value={latestEvaluation ? `${latestEvaluation.pct_neto}%` : "Sin dato"} detail="Evaluación neta" icon={BookOpenCheck} tone="lime" />
      </section>
      <section className="split-grid">
        <Panel title="Mi perfil laboral" subtitle="Datos visibles para el colaborador">
          <div className="profile-list">
            <span><b>Cédula</b>{profile.numero_cedula}</span>
            <span><b>Fecha de ingreso</b>{profile.fecha_ingreso}</span>
            <span><b>Departamento</b>{profile.departamento}</span>
            <span><b>Teléfono</b>{profile.telefono_principal}</span>
            <span><b>Dirección</b>{profile.direccion}</span>
            <span><b>Observaciones</b>{profile.observaciones || "Sin observaciones"}</span>
          </div>
        </Panel>
        <Panel title="Mi desempeño" subtitle="Historial de evaluaciones">
          <div className="score-card">
            <span>Última evaluación neta</span>
            <strong>{latestEvaluation ? `${latestEvaluation.pct_neto}%` : "Sin evaluación"}</strong>
            <small>{latestEvaluation ? `Fecha: ${latestEvaluation.fecha_evaluacion}` : "Aún no hay evaluaciones registradas."}</small>
          </div>
          <DataTable
            columns={[
              { key: "fecha_evaluacion", label: "Fecha" },
              { key: "pct_bruto", label: "Bruto", render: (value) => `${value}%` },
              { key: "pct_neto", label: "Neto", render: (value) => `${value}%` },
            ]}
            rows={data.evaluaciones || []}
          />
        </Panel>
      </section>
      <section className="split-grid">
        <Panel title="Mi asistencia reciente" subtitle={`${absenceCount} ausencias registradas en la muestra`}>
          <DataTable
            columns={[
              { key: "fecha", label: "Fecha" },
              { key: "presente", label: "Estado", render: (value) => <StatusBadge value={value ? "Presente" : "Ausente"} /> },
            ]}
            rows={data.asistencias || []}
          />
        </Panel>
        <Panel title="Mis capacitaciones">
          <DataTable
            columns={[
              { key: "nombre_capacitacion", label: "Capacitación" },
              { key: "fecha_inicio", label: "Inicio" },
              { key: "fecha_fin", label: "Fin" },
            ]}
            rows={data.capacitaciones || []}
          />
        </Panel>
      </section>
    </>
  );
}

function TeamPage() {
  const roles = [
    ["Líder del proyecto", "Coordina avances, alcance, integración y presentación final."],
    ["Analista de RRHH", "Define procesos, indicadores y reglas de negocio."],
    ["Diseñador", "Organiza pantallas, experiencia visual y claridad de la demostración."],
    ["Encargado de datos", "Estructura la base, valida datos demo y reportes."],
    ["Presentador", "Expone la solución, explica sus beneficios y conduce la defensa."],
  ];
  return (
    <>
      <PageHeader
        eyebrow="Quiénes somos"
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
    ["Personal", "Registrar un colaborador, asignar un departamento y consultar la plantilla por estado o área."],
    ["Control diario", "Marcar asistencia desde formulario web. Registra fecha, colaborador y presente/ausente; ausencias incluyen motivo."],
    ["Desarrollo", "Seleccionar un colaborador, registrar una capacitación o evaluación y ver su porcentaje de desempeño."],
    ["Salida", "Registrar movimiento interno o salida definitiva con fecha, motivo y observaciones."],
    ["Reportes", "Consultar KPI, gráficas y datos consolidados para tomar decisiones."],
  ];
  return (
    <>
      <PageHeader
        eyebrow="Manual de usuario"
        title="Uso por módulo"
        description="Guía breve para explicar el recorrido durante la demostración del producto."
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
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("todos");
  const departments = useAsync(api.getDepartments, [refreshKey]);
  const { data, loading, error } = useAsync(
    () => api.getDashboard({
      start_date: startDate,
      end_date: endDate,
      department_id: department,
      status,
    }),
    [refreshKey, startDate, endDate, department, status],
  );

  if (loading || departments.loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (departments.error) return <ErrorScreen error={departments.error} />;

  const summary = data.summary;
  const departmentData = data.by_department.map((item, index) => ({
    ...item,
    color: colorForDepartment(item.name, index),
  }));
  const performanceData = data.performance_by_department
    .map((item, index) => ({
      ...item,
      color: colorForDepartment(item.departamento, index),
    }))
    .sort((a, b) => b.promedio - a.promedio);
  const attendanceData = data.attendance_by_department
    .map((item, index) => ({
      ...item,
      color: colorForDepartment(item.departamento, index),
    }))
    .sort((a, b) => a.asistencia - b.asistencia);
  const departmentTotal = departmentData.reduce((total, item) => total + item.value, 0);
  const topPerformance = performanceData.reduce(
    (highest, item) => (!highest || item.promedio > highest.promedio ? item : highest),
    null,
  );
  const lowestAttendance = attendanceData[0];

  return (
    <>
      <PageHeader
        eyebrow="Vista gerencial"
        title="Dashboard de Recursos Humanos"
        description="Indicadores clave con filtros por fecha, departamento y estado para una empresa demo de mínimo 300 colaboradores."
        actions={<button className="ghost-button" onClick={refresh}><RefreshCw size={16} />Actualizar</button>}
      />
      <Panel title="Filtros de grupos" subtitle="Ajusta fechas y condiciones para leer la información por segmento">
        <div className="filter-grid">
          <Field label="Desde">
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </Field>
          <Field label="Hasta">
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </Field>
          <Field label="Departamento">
            <select value={department} onChange={(event) => setDepartment(event.target.value)}>
              <option value="">Todos los departamentos</option>
              {(departments.data || []).map((dep) => (
                <option key={dep.id_departamento} value={dep.id_departamento}>{dep.nombre_departamento}</option>
              ))}
            </select>
          </Field>
          <Field label="Condición">
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="terminado">Inactivos</option>
            </select>
          </Field>
          <button
            className="ghost-button filter-reset"
            type="button"
            onClick={() => {
              setStartDate(defaultStartDate);
              setEndDate(today);
              setDepartment("");
              setStatus("todos");
            }}
          >
            <Filter size={16} />
            Limpiar filtros
          </button>
        </div>
      </Panel>
      <section className="metric-grid five">
        <MetricCard label="Colaboradores filtrados" value={summary.total_colaboradores} detail="Según condición actual" icon={UsersRound} />
        <MetricCard label="Activos" value={summary.activos} detail="Personas vigentes" icon={UserCheck} tone="green" />
        <MetricCard label="Inactivos" value={summary.terminados} detail="Salidas registradas" icon={LogOut} tone="lime" />
        <MetricCard label="Asistencia" value={`${summary.tasa_asistencia}%`} detail={`${summary.ausencias} ausencias`} icon={Activity} tone="green" />
        <MetricCard label="Desempeño" value={`${summary.desempeno_promedio}%`} detail="Promedio neto" icon={BookOpenCheck} tone="cyan" />
      </section>
      <section className="dashboard-grid">
        <Panel title="Plantilla activa e inactiva" subtitle="Conteos visibles por departamento">
          <div className="chart-insight">
            <span>Total visible</span>
            <strong>{formatInteger(departmentTotal)} colaboradores</strong>
            <b>{formatInteger(summary.activos)} activos</b>
          </div>
          <DepartmentStaffBars items={departmentData} total={departmentTotal} />
        </Panel>
        <Panel title="Desempeño por departamento" subtitle="Ranking con promedio y evaluaciones">
          <div className="chart-insight">
            <span>Mejor resultado</span>
            <strong>{topPerformance?.departamento || "Sin datos"}</strong>
            <b>{formatPercentage(topPerformance?.promedio)}</b>
          </div>
          <PerformanceRanking items={performanceData} />
        </Panel>
        <Panel title="Semáforo de asistencia" subtitle="Presencias, ausencias y porcentaje por departamento" className="wide-panel">
          <div className="chart-insight">
            <span>Atención prioritaria</span>
            <strong>{lowestAttendance?.departamento || "Sin datos"}</strong>
            <b>{formatPercentage(lowestAttendance?.asistencia)}</b>
          </div>
          <AttendanceBoard items={attendanceData} />
        </Panel>
        <Panel title="Evaluaciones destacadas por usuario" subtitle="Desempeño individual para profundizar por colaborador" className="wide-panel">
          <DataTable
            columns={[
              { key: "codigo_empresa", label: "Código" },
              { key: "empleado", label: "Empleado" },
              { key: "fecha_evaluacion", label: "Fecha" },
              { key: "pct_bruto", label: "Bruto", render: (value) => `${value}%` },
              { key: "pct_neto", label: "Neto", render: (value) => `${value}%` },
            ]}
            rows={data.performance_by_employee || []}
          />
        </Panel>
      </section>
    </>
  );
}

function DepartmentStaffBars({ items, total }) {
  if (!items?.length) return <EmptyState text="No hay departamentos para el filtro seleccionado." />;
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="department-bars">
      {items.map((item) => {
        const activePct = item.value ? (item.activos / item.value) * 100 : 0;
        const inactivePct = item.value ? (item.terminados / item.value) * 100 : 0;
        return (
          <article className="department-bar-row" key={item.name}>
            <div className="department-bar-title">
              <span><i style={{ background: item.color }} />{item.name}</span>
              <strong>{formatInteger(item.value)}</strong>
            </div>
            <div className="staff-meter" aria-label={`${item.name}: ${item.activos} activos y ${item.terminados} inactivos`}>
              <div className="staff-meter-scale" style={{ width: `${Math.max((item.value / max) * 100, 4)}%` }}>
                <i className="staff-active" style={{ width: `${activePct}%` }} />
                <i className="staff-inactive" style={{ width: `${inactivePct}%` }} />
              </div>
            </div>
            <div className="department-bar-meta">
              <span>{formatInteger(item.activos)} activos</span>
              <span>{formatInteger(item.terminados)} inactivos</span>
              <span>{formatPercentage(total ? (item.value / total) * 100 : 0)} del total</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PerformanceRanking({ items }) {
  if (!items?.length) return <EmptyState text="No hay evaluaciones para el filtro seleccionado." />;

  return (
    <div className="ranking-list">
      {items.map((item, index) => (
        <article className="ranking-row" key={item.departamento}>
          <div className="ranking-heading">
            <span>{index + 1}. {item.departamento}</span>
            <strong>{formatPercentage(item.promedio)}</strong>
          </div>
          <div className="ranking-track">
            <i style={{ width: `${Math.min(Math.max(item.promedio, 0), 100)}%`, background: item.color }} />
          </div>
          <small>{formatInteger(item.evaluaciones)} evaluaciones registradas</small>
        </article>
      ))}
    </div>
  );
}

function AttendanceBoard({ items }) {
  if (!items?.length) return <EmptyState text="No hay registros de asistencia para el filtro seleccionado." />;

  return (
    <div className="attendance-board">
      {items.map((item) => {
        const pct = Math.min(Math.max(item.asistencia, 0), 100);
        return (
          <article className="attendance-row" key={item.departamento}>
            <div>
              <strong>{item.departamento}</strong>
              <span>{formatInteger(item.presentes)} presentes · {formatInteger(item.ausentes)} ausentes · {formatInteger(item.registros)} registros</span>
            </div>
            <div className="attendance-meter">
              <i style={{ width: `${pct}%`, background: item.color }} />
            </div>
            <b>{formatPercentage(item.asistencia)}</b>
          </article>
        );
      })}
    </div>
  );
}

function RecruitmentPage({ refreshKey, refresh }) {
  const recruitment = useAsync(api.getRecruitment, [refreshKey]);
  const vacancies = useAsync(api.getVacancies, [refreshKey]);
  const [cvFile, setCvFile] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  async function analyzeCv(event) {
    event.preventDefault();
    if (!cvFile) return;
    const formElement = event.currentTarget;
    setUploading(true);
    setMessage("");
    setUploadError("");
    try {
      const result = await api.analyzeCv(cvFile, keywords);
      setMessage(`Hoja de vida analizada: ${result.porcentaje}% de coincidencia.`);
      setCvFile(null);
      formElement.reset();
      refresh();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

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
        eyebrow="Módulo 1"
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
      <Panel
        title="Analizar hoja de vida"
        subtitle="Carga un archivo PDF o TXT de hasta 5 MB"
      >
        <Notice>{message}</Notice>
        <Notice type="error">{uploadError}</Notice>
        <FormGrid onSubmit={analyzeCv} busy={uploading} buttonLabel="Analizar candidatura">
          <Field label="Hoja de vida">
            <input
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              required
              onChange={(event) => setCvFile(event.target.files?.[0] || null)}
            />
          </Field>
          <Field label="Palabras clave opcionales">
            <input
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="Python, análisis de datos, Excel"
            />
          </Field>
        </FormGrid>
      </Panel>
      <Panel title="Reporte de candidatos" subtitle="Datos provenientes del módulo de reclutamiento">
        <DataTable columns={columns} rows={records} emptyText="Aún no hay un reporte CSV de reclutamiento." />
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
  const [departmentMessage, setDepartmentMessage] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [savingDepartment, setSavingDepartment] = useState(false);
  const [departmentForm, setDepartmentForm] = useState({
    id_departamento: null,
    nombre_departamento: "",
    descripcion: "",
  });
  const departments = useAsync(api.getDepartments, [refreshKey]);
  const employees = useAsync(() => api.getEmployees({ q: query, status, department_id: department, limit: 150 }), [query, status, department, refreshKey]);
  const [form, setForm] = useState({
    numero_cedula: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "1995-01-01",
    nacionalidad: "Panameña",
    direccion: "Ciudad de Panamá",
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

  async function submitDepartment(event) {
    event.preventDefault();
    setSavingDepartment(true);
    setDepartmentMessage("");
    setDepartmentError("");
    const payload = {
      nombre_departamento: departmentForm.nombre_departamento,
      descripcion: departmentForm.descripcion || null,
    };
    try {
      if (departmentForm.id_departamento) {
        await api.updateDepartment(departmentForm.id_departamento, payload);
        setDepartmentMessage("Departamento actualizado correctamente.");
      } else {
        await api.createDepartment(payload);
        setDepartmentMessage("Departamento creado correctamente.");
      }
      setDepartmentForm({ id_departamento: null, nombre_departamento: "", descripcion: "" });
      refresh();
    } catch (err) {
      setDepartmentError(err.message);
    } finally {
      setSavingDepartment(false);
    }
  }

  function editDepartment(row) {
    setDepartmentMessage("");
    setDepartmentError("");
    setDepartmentForm({
      id_departamento: row.id_departamento,
      nombre_departamento: row.nombre_departamento,
      descripcion: row.descripcion || "",
    });
  }

  async function removeDepartment(row) {
    if (!window.confirm(`¿Eliminar el departamento “${row.nombre_departamento}”?`)) return;
    setDepartmentMessage("");
    setDepartmentError("");
    try {
      await api.deleteDepartment(row.id_departamento);
      setDepartmentMessage("Departamento eliminado correctamente.");
      refresh();
    } catch (err) {
      setDepartmentError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Módulo 2"
        title="Personal"
        description="Registro maestro de colaboradores, ingreso laboral, estructura organizacional y consulta de plantilla."
      />
      <section className="split-grid">
        <Panel title="Nuevo colaborador" subtitle="Formulario conectado al backend">
          <Notice>{message}</Notice>
          <Notice type="error">{errorMessage}</Notice>
          <FormGrid onSubmit={submit} busy={saving} buttonLabel="Registrar colaborador">
            <Field label="Cédula"><input required value={form.numero_cedula} onChange={(e) => setForm({ ...form, numero_cedula: e.target.value })} /></Field>
            <Field label="Nombre"><input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Field>
            <Field label="Apellido"><input required value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} /></Field>
            <Field label="Nacimiento"><input type="date" required value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} /></Field>
            <Field label="Teléfono"><input required value={form.telefono_principal} onChange={(e) => setForm({ ...form, telefono_principal: e.target.value })} /></Field>
            <Field label="Puesto"><input required value={form.puesto} onChange={(e) => setForm({ ...form, puesto: e.target.value })} /></Field>
            <Field label="Departamento">
              <select required value={form.id_departamento} onChange={(e) => setForm({ ...form, id_departamento: e.target.value })}>
                {(departments.data || []).map((dep) => <option key={dep.id_departamento} value={dep.id_departamento}>{dep.nombre_departamento}</option>)}
              </select>
            </Field>
            <Field label="Ingreso"><input type="date" required value={form.fecha_ingreso} onChange={(e) => setForm({ ...form, fecha_ingreso: e.target.value })} /></Field>
            <Field label="Dirección"><input required value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} /></Field>
          </FormGrid>
        </Panel>
        <Panel title="Departamentos" subtitle="Administración de la estructura organizacional">
          <Notice>{departmentMessage}</Notice>
          <Notice type="error">{departmentError}</Notice>
          <FormGrid
            onSubmit={submitDepartment}
            busy={savingDepartment}
            buttonLabel={departmentForm.id_departamento ? "Actualizar departamento" : "Crear departamento"}
          >
            <Field label="Nombre">
              <input
                required
                minLength="2"
                value={departmentForm.nombre_departamento}
                onChange={(event) => setDepartmentForm({
                  ...departmentForm,
                  nombre_departamento: event.target.value,
                })}
              />
            </Field>
            <Field label="Descripción">
              <input
                value={departmentForm.descripcion}
                onChange={(event) => setDepartmentForm({
                  ...departmentForm,
                  descripcion: event.target.value,
                })}
              />
            </Field>
          </FormGrid>
          <DataTable
            columns={[
              { key: "nombre_departamento", label: "Departamento" },
              { key: "colaboradores", label: "Colaboradores" },
              { key: "descripcion", label: "Descripción" },
              {
                key: "acciones",
                label: "Acciones",
                render: (_value, row) => (
                  <div className="table-actions">
                    <button type="button" className="compact-button" onClick={() => editDepartment(row)}>
                      Editar
                    </button>
                    <button type="button" className="compact-button danger" onClick={() => removeDepartment(row)}>
                      Eliminar
                    </button>
                  </div>
                ),
              },
            ]}
            rows={departments.data || []}
          />
        </Panel>
      </section>
      <Panel title="Plantilla de colaboradores" subtitle={<LastUpdated label={`${employees.data?.length || 0} registros visibles`} />}>
        <div className="toolbar">
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar por nombre, código o cédula" />
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
            { key: "codigo_empresa", label: "Código" },
            { key: "nombre_completo", label: "Nombre" },
            { key: "departamento", label: "Departamento" },
            { key: "puesto", label: "Puesto" },
            { key: "estado", label: "Estado", render: (value) => <StatusBadge value={value} /> },
            { key: "pct_desempeno", label: "Desempeño", render: (value) => value ? `${value}%` : "-" },
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
  const [absence, setAbsence] = useState({ codigo_empresa: "", fecha: today, motivo: "Cita médica" });
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
        eyebrow="Módulo 3"
        title="Control diario"
        description="Marcado digital de asistencia y registro de ausencias/vacaciones."
      />
      <Panel title="Tipo de marcado de asistencia" subtitle="Propuesta para el cliente">
        <p className="soft-text">
          La demo utiliza marcado web por formulario: se selecciona colaborador, fecha y estado.
          En una versión productiva puede integrarse con código QR, reloj biométrico, geolocalización
          o validación desde dispositivo autorizado.
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
            <Field label="Observación"><input value={vacation.observaciones} onChange={(e) => setVacation({ ...vacation, observaciones: e.target.value })} /></Field>
          </FormGrid>
        </Panel>
      </section>
      <Panel title="Registros recientes" subtitle="Últimos movimientos de control diario">
        <DataTable
          columns={[
            { key: "codigo_empresa", label: "Código" },
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
        eyebrow="Módulo 4"
        title="Desarrollo"
        description="Capacitaciones y evaluación de desempeño por colaborador, con filtro individual."
      />
      <Notice>{message}</Notice>
      <Notice type="error">{error}</Notice>
      <section className="split-grid">
        <Panel title="Evaluación por usuario" subtitle="Filtra un colaborador y consulta su porcentaje">
          <div className="toolbar">
            <EmployeeSelect value={selectedEmployee} options={options.data} onChange={setSelectedEmployee} />
          </div>
          <div className="score-card">
            <span>Desempeño neto actual</span>
            <strong>{latestEvaluation ? `${latestEvaluation.pct_neto}%` : "Sin evaluación"}</strong>
            <small>{latestEvaluation ? `Última evaluación: ${latestEvaluation.fecha_evaluacion}` : "Registra una evaluación para ver el resultado."}</small>
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
        <Panel title="Nueva capacitación">
          <FormGrid onSubmit={(e) => submit(e, api.recordTraining, training, "Capacitación")} buttonLabel="Guardar capacitación">
            <EmployeeSelect value={training.codigo_empresa} options={options.data} onChange={(value) => setTraining({ ...training, codigo_empresa: value })} />
            <Field label="Capacitación"><input value={training.nombre_capacitacion} onChange={(e) => setTraining({ ...training, nombre_capacitacion: e.target.value })} /></Field>
            <Field label="Inicio"><input type="date" value={training.fecha_inicio} onChange={(e) => setTraining({ ...training, fecha_inicio: e.target.value })} /></Field>
            <Field label="Fin"><input type="date" value={training.fecha_fin} onChange={(e) => setTraining({ ...training, fecha_fin: e.target.value })} /></Field>
          </FormGrid>
        </Panel>
      </section>
      <Panel title="Registrar evaluación de desempeño">
        <FormGrid onSubmit={(e) => submit(e, api.recordEvaluation, { ...evaluation, pct_bruto: Number(evaluation.pct_bruto) }, "Evaluación")} buttonLabel="Guardar evaluación">
          <EmployeeSelect value={evaluation.codigo_empresa} options={options.data} onChange={(value) => setEvaluation({ ...evaluation, codigo_empresa: value })} />
          <Field label="Fecha"><input type="date" value={evaluation.fecha_evaluacion} onChange={(e) => setEvaluation({ ...evaluation, fecha_evaluacion: e.target.value })} /></Field>
          <Field label="Puntuación bruta"><input type="number" min="0" max="100" value={evaluation.pct_bruto} onChange={(e) => setEvaluation({ ...evaluation, pct_bruto: e.target.value })} /></Field>
        </FormGrid>
      </Panel>
      <section className="split-grid">
        <Panel title="Capacitaciones recientes">
          <DataTable
            columns={[
              { key: "empleado", label: "Empleado" },
              { key: "nombre_capacitacion", label: "Capacitación" },
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
  const [movement, setMovement] = useState({ codigo_empresa: "", fecha_movimiento: today, puesto_nuevo: "Coordinador", depto_nuevo: "", motivo: "Promoción interna" });
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
      <PageHeader eyebrow="Módulo 5" title="Salida y movimientos" description="Registro de promociones, traslados y salida definitiva." />
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
            <Field label="Observación"><input value={termination.observaciones} onChange={(e) => setTermination({ ...termination, observaciones: e.target.value })} /></Field>
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
  const departmentTotal = departmentData.reduce((total, item) => total + item.value, 0);

  return (
    <>
      <PageHeader
        eyebrow="Módulo 6"
        title="Reportes gerenciales"
        description="Panel consolidado para analizar plantilla, rotación, asistencia y desempeño."
        actions={
          <>
            <PrintReportButton />
            <button className="ghost-button" onClick={refresh}><RefreshCw size={16} />Actualizar</button>
          </>
        }
      />
      <Panel title="Reporte ejecutivo Talento 360" subtitle={`Preparado para impresión PDF · ${today}`}>
        <div className="report-cover">
          <div>
            <FileDown size={22} />
            <strong>Resumen para gerencia</strong>
            <p>
              Este reporte consolida la situación de plantilla, asistencia, rotación,
              capacitación y desempeño con datos demo del sistema.
            </p>
          </div>
          <div className="report-stats">
            <span><b>{formatInteger(data.summary.total_colaboradores)}</b> colaboradores</span>
            <span><b>{formatInteger(data.summary.activos)}</b> activos</span>
            <span><b>{formatInteger(data.summary.terminados)}</b> inactivos</span>
            <span><b>{formatPercentage(data.summary.tasa_asistencia)}</b> asistencia</span>
          </div>
        </div>
      </Panel>
      <section className="metric-grid four">
        <MetricCard label="Plantilla activa" value={data.summary.activos} icon={UsersRound} />
        <MetricCard label="Rotación" value={`${data.summary.rotacion}%`} icon={LogOut} tone="lime" />
        <MetricCard label="Capacitaciones" value={data.summary.capacitaciones} icon={Brain} tone="green" />
        <MetricCard label="Ausencias" value={data.summary.ausencias} icon={ClipboardList} tone="cyan" />
      </section>
      <section className="dashboard-grid">
        <Panel title="Salidas por mes">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthly_exits} margin={{ top: 28, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip
                {...chartTooltipProps}
                formatter={(value) => [formatInteger(value), "Salidas"]}
              />
              <Bar dataKey="salidas" fill="#0f766e" radius={[8, 8, 0, 0]} maxBarSize={48}>
                <LabelList
                  dataKey="salidas"
                  position="top"
                  formatter={formatInteger}
                  className="chart-value-label"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Plantilla por departamento">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} layout="vertical" margin={{ left: 35, right: 58 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
              <Tooltip
                {...chartTooltipProps}
                formatter={(value) => [
                  `${formatInteger(value)} · ${formatPercentage((value / departmentTotal) * 100)}`,
                  "Colaboradores",
                ]}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {departmentData.map((item) => <Cell key={item.name} fill={item.color} />)}
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={formatInteger}
                  className="chart-value-label"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </section>
    </>
  );
}

function PrintReportButton() {
  return (
    <button className="primary-button standalone" type="button" onClick={() => window.print()}>
      <Printer size={16} />
      Imprimir PDF
    </button>
  );
}

function DepartmentLegend({ items, total }) {
  return (
    <div className="department-legend">
      {items.map((item) => (
        <div className="department-legend-item" key={item.name} title={item.name}>
          <span>
            <i style={{ background: item.color }} />
            {item.name}
          </span>
          <strong>{formatInteger(item.value)}</strong>
          <small>{formatPercentage((item.value / total) * 100)}</small>
        </div>
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
      <strong>No se pudo cargar la información</strong>
      <span>{error}</span>
    </div>
  );
}

export default App;
