export default function StatCard({ label, value, icon: Icon, color = 'var(--primary)', trend }) {
  return (
    <div className="stat-card fade-in">
      <div className="stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={20} />
      </div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {trend && <p className="stat-trend">{trend}</p>}
      </div>
      <style>{`
        .stat-card { display:flex; align-items:center; gap:16px; }
        .stat-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .stat-label { font-size:13px; color:var(--text-muted); margin-bottom:2px; }
        .stat-value { font-size:24px; font-weight:700; color:var(--text); font-family:'Playfair Display',serif; }
        .stat-trend { font-size:12px; color:var(--success); margin-top:2px; }
      `}</style>
    </div>
  );
}
