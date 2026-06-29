import { useAuth } from '../../context/AuthContext.jsx';
import { useAuthActions } from '../../hooks/useAuth.js';
import { useConnection } from '../../context/ConnectionContext.jsx';
import { ROUTES } from '../../router/index.jsx';
import { getInitials } from '../../utils/formatters.js';
import NavIcons from './NavIcons.jsx';

/**
 * Main navigation sidebar
 * @param {{ activePage: string, onNavigate: (id: string) => void }} props
 */
export default function Sidebar({ activePage, onNavigate }) {
  const { auth } = useAuth();
  const { logout } = useAuthActions();
  const { connectionStatus, backendUrl, latency } = useConnection();

  return (
    <aside className="sidebar-panel">
      {/* User profile card */}
      {auth && (
        <div
          className="glass-card"
          style={{
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(18, 20, 32, 0.85))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              aria-hidden="true"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.9rem',
                color: '#ffffff',
                flexShrink: 0,
              }}
            >
              {getInitials(auth.name)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {auth.name}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#a5b4fc',
                  fontWeight: '700',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                }}
              >
                {auth.role}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3
          className="panel-title"
          style={{
            margin: '0 0 1.25rem 0',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Univers-One Modules
        </h3>

        <nav aria-label="Main navigation">
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ROUTES.map((route) => {
              const isActive = activePage === route.id;
              return (
                <li key={route.id}>
                  <button
                    onClick={() => onNavigate(route.id)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '11px 12px',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(79, 70, 229, 0.12))'
                        : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.4)' : 'transparent'}`,
                      borderRadius: '10px',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    {isActive && (
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '25%',
                          bottom: '25%',
                          width: '3px',
                          backgroundColor: '#6366f1',
                          boxShadow: '0 0 8px #6366f1',
                          borderRadius: '0 4px 4px 0',
                        }}
                      />
                    )}
                    <span style={{ color: isActive ? '#6366f1' : 'var(--text-muted)', display: 'flex' }}>
                      <NavIcons id={route.icon} />
                    </span>
                    <span>
                      <div style={{ fontWeight: isActive ? '700' : '500', fontSize: '0.8rem', color: isActive ? '#ffffff' : 'inherit' }}>
                        {route.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {route.subtitle}
                      </div>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Connection status */}
      <div
        className="glass-card"
        style={{
          background: 'rgba(0,0,0,0.2)',
          border:
            connectionStatus === 'connected'
              ? '1px solid rgba(16,185,129,0.15)'
              : '1px solid rgba(244,63,94,0.15)',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Connection Status
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor:
                connectionStatus === 'connected'
                  ? 'var(--accent-emerald)'
                  : connectionStatus === 'connecting'
                  ? 'var(--accent-purple)'
                  : 'var(--accent-rose)',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color:
                connectionStatus === 'connected'
                  ? 'var(--accent-emerald)'
                  : connectionStatus === 'connecting'
                  ? 'var(--accent-purple)'
                  : 'var(--accent-rose)',
            }}
          >
            {connectionStatus === 'connected'
              ? 'DB LINKED ONLINE'
              : connectionStatus === 'connecting'
              ? 'SYNCING...'
              : 'SANDBOXED OFFLINE'}
          </span>
        </div>

        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>API Address:</span>
            <span
              style={{
                fontFamily: 'monospace',
                color: 'var(--accent-cyan)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '120px',
                whiteSpace: 'nowrap',
              }}
              title={backendUrl}
            >
              {backendUrl.replace(/^https?:\/\//, '')}
            </span>
          </div>
          {connectionStatus === 'connected' && latency !== null && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Latency:</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>{latency}ms</span>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          style={{
            marginTop: '1.25rem',
            width: '100%',
            height: '30px',
            background: 'rgba(244,63,94,0.1)',
            color: 'var(--accent-rose)',
            border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
