/**
 * StatCard — KPI metric widget used on the dashboard
 */
export default function StatCard({ label, value, footer, icon, accentColor = 'var(--accent-purple)' }) {
  return (
    <div className="glass-card stat-widget">
      <div className="stat-header">
        <span>{label}</span>
        {icon && <span style={{ color: accentColor }}>{icon}</span>}
      </div>
      <div className="stat-value">{value}</div>
      {footer && <div className="stat-footer">{footer}</div>}
    </div>
  );
}
