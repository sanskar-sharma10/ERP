import { useERP } from '../context/ERPContext';

export default function Sidebar() {
  const { activePage, setActivePage, connectionStatus, backendUrl, latency, auth, logout } = useERP();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Overview & my day',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: 'faculty',
      label: 'My Classes',
      subtitle: 'Course schedule & info',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    },

    {
      id: 'attendance',
      label: 'Attendance',
      subtitle: 'Roll call & tracking',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      )
    },
    {
      id: 'timetable',
      label: 'Timetable',
      subtitle: 'Weekly class schedule',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      id: 'fees',
      label: 'Gradebook',
      subtitle: 'Grades & assessments',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 'announcements',
      label: 'Announcements',
      subtitle: 'Post & manage notices',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      subtitle: 'Profile & preferences',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="sidebar-panel">
      {/* Roster Profile Header inside Sidebar */}
      {auth && (
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(18, 20, 32, 0.85))',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.9rem',
              color: '#ffffff',
              flexShrink: 0,
              boxShadow: '0 0 12px rgba(99,102,241,0.4)'
            }}>
              {auth.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                {auth.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#a5b4fc', fontWeight: '700', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                {auth.role || 'Teacher'}
              </div>
            </div>
          </div>
          {/* Online indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700', letterSpacing: '0.5px' }}>ACTIVE SESSION</span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="glass-card" style={{ padding: '1rem' }}>
        <h3 className="panel-title" style={{ margin: '0 0 1rem 0', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Teacher Portal
        </h3>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navigationItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  width: '100%',
                  padding: '10px 12px',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(79, 70, 229, 0.12))'
                    : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(99, 102, 241, 0.4)' : 'transparent',
                  borderRadius: '10px',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '25%',
                    bottom: '25%',
                    width: '3px',
                    backgroundColor: '#6366f1',
                    boxShadow: '0 0 8px #6366f1',
                    borderRadius: '0 4px 4px 0'
                  }} />
                )}

                <div style={{ color: isActive ? '#6366f1' : 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
                  {item.icon}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: isActive ? '700' : '500', fontSize: '0.8rem', color: isActive ? '#ffffff' : 'inherit', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '400', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.subtitle}
                  </div>
                </div>

                {/* Notification badge for announcements */}
                {item.id === 'announcements' && (
                  <div style={{
                    marginLeft: 'auto',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'rgba(244,63,94,0.15)',
                    border: '1px solid rgba(244,63,94,0.3)',
                    color: '#f43f5e',
                    fontSize: '0.6rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>3</div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Connection status box */}
      <div className="glass-card" style={{
        background: 'rgba(0,0,0,0.2)',
        border: connectionStatus === 'connected' ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(244, 63, 94, 0.15)'
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          System Status
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div className="status-dot" style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: connectionStatus === 'connected' ? 'var(--accent-emerald)' : connectionStatus === 'connecting' ? 'var(--accent-purple)' : 'var(--accent-rose)',
            boxShadow: connectionStatus === 'connected'
              ? '0 0 6px var(--accent-emerald)'
              : connectionStatus === 'connecting'
                ? '0 0 6px var(--accent-purple)'
                : '0 0 6px var(--accent-rose)'
          }}></div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            color: connectionStatus === 'connected' ? 'var(--accent-emerald)' : connectionStatus === 'connecting' ? 'var(--accent-purple)' : 'var(--accent-rose)'
          }}>
            {connectionStatus === 'connected' ? 'DB ONLINE' : connectionStatus === 'connecting' ? 'CONNECTING...' : 'OFFLINE MODE'}
          </span>
        </div>

        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>API:</span>
            <span style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px', whiteSpace: 'nowrap' }} title={backendUrl}>
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

        {/* Sign Out button */}
        <button
          onClick={logout}
          style={{
            marginTop: '1rem',
            width: '100%',
            height: '30px',
            background: 'rgba(244, 63, 94, 0.1)',
            color: 'var(--accent-rose)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.18)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
