export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
      <style>{`
        .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
        .page-header h1 { font-size:26px; color:var(--text); }
        .page-subtitle { color:var(--text-muted); font-size:14px; margin-top:4px; }
      `}</style>
    </div>
  );
}
