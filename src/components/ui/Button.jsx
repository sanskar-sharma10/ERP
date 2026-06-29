/**
 * Button — primary, secondary, and danger variants
 */
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  fullWidth = false,
  className = '',
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 18px',
    fontSize: '0.875rem',
    fontWeight: '700',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : undefined,
    fontFamily: 'inherit',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
      color: '#000',
    },
    secondary: {
      background: 'rgba(255,255,255,0.06)',
      color: 'var(--text-primary)',
      border: '1px solid rgba(255,255,255,0.08)',
    },
    danger: {
      background: 'rgba(244,63,94,0.1)',
      color: 'var(--accent-rose)',
      border: '1px solid rgba(244,63,94,0.2)',
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{ ...base, ...variants[variant] }}
      {...rest}
    >
      {children}
    </button>
  );
}
