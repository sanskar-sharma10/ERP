import { useToast } from '../../context/ToastContext.jsx';

/**
 * Global toast notification — renders in top-right corner
 */
export default function Toast() {
  const { toast } = useToast();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '14px 24px',
        borderRadius: '10px',
        fontSize: '0.85rem',
        fontWeight: '700',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: isSuccess ? 'rgba(16,185,129,0.95)' : 'rgba(244,63,94,0.95)',
        color: '#000',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        animation: 'toastSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)',
        maxWidth: '380px',
      }}
    >
      <span style={{ fontSize: '1rem' }}>{isSuccess ? '🛡️' : '⚠️'}</span>
      <span>{toast.text}</span>
    </div>
  );
}
