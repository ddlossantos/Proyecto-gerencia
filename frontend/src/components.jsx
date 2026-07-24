import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  CircleGauge,
  Clock3,
  RefreshCw,
  Search,
} from "lucide-react";

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function MetricCard({ label, value, detail, icon: Icon = CircleGauge, tone = "teal" }) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-icon">
        <Icon size={22} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </article>
  );
}

export function Panel({ title, subtitle, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      {(title || subtitle) && (
        <div className="panel-heading">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusBadge({ value }) {
  const normalized = String(value || "").toLowerCase();
  const active = normalized === "activo" || normalized === "true" || normalized === "presente";
  return <span className={`badge ${active ? "badge-ok" : "badge-warn"}`}>{value}</span>;
}

export function EmptyState({ title = "Sin datos", text = "No hay registros para mostrar." }) {
  return (
    <div className="empty-state">
      <BriefcaseBusiness size={28} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export function DataTable({ columns, rows, emptyText }) {
  if (!rows?.length) return <EmptyState text={emptyText} />;
  const recordKey = (row, index) => (
    row.id
    ?? row.id_empleado
    ?? row.id_asistencia
    ?? row.id_ausencia
    ?? row.id_vacacion
    ?? row.id_capacitacion
    ?? row.id_evaluacion
    ?? row.id_salida
    ?? row.id_movimiento
    ?? `${row.codigo_empresa || "row"}-${index}`
  );

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={recordKey(row, index)}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function FormGrid({ children, onSubmit, buttonLabel = "Guardar", busy = false }) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      {children}
      <button className="primary-button" disabled={busy} type="submit">
        {busy ? <RefreshCw size={16} className="spin" /> : <CheckCircle2 size={16} />}
        {buttonLabel}
      </button>
    </form>
  );
}

export function Notice({ type = "info", children }) {
  if (!children) return null;
  return (
    <div className={`notice notice-${type}`}>
      {type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{children}</span>
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="search-bar">
      <Search size={18} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function LastUpdated({ label = "Datos actualizados" }) {
  return (
    <span className="last-updated">
      <Clock3 size={15} />
      {label}
    </span>
  );
}
