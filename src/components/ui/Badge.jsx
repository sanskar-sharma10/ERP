/**
 * Badge — small inline label chip
 * @param {{ children: React.ReactNode, color?: 'blue'|'emerald'|'purple'|'rose'|'cyan', className?: string }} props
 */
export default function Badge({ children, color = 'blue', className = '' }) {
  const colorMap = {
    blue: { bg: 'rgba(59,130,246,0.15)', text: 'var(--accent-blue)', border: 'rgba(59,130,246,0.2)' },
    emerald: { bg: 'rgba(16,185,129,0.15)', text: 'var(--accent-emerald)', border: 'rgba(16,185,129,0.2)' },
    purple: { bg: 'rgba(192,132,252,0.15)', text: 'var(--accent-purple)', border: 'rgba(192,132,252,0.2)' },
    rose: { bg: 'rgba(244,63,94,0.15)', text: 'var(--accent-rose)', border: 'rgba(244,63,94,0.2)' },
    cyan: { bg: 'rgba(6,182,212,0.15)', text: 'var(--accent-cyan)', border: 'rgba(6,182,212,0.2)' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <span
      className={`badge ${className}`}
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}
