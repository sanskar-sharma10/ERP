import { useState } from 'react';
import { useERP } from '../context/ERPContext';

const TEACHER_PROFILE = {
  name: 'Dr. Evelyn Vance',
  employeeId: 'FAC-2019-0051',
  department: 'Computer Science & Engineering',
  email: 'evelyn.vance@univers-one.edu',
  phone: '(555) 802-4431',
  office: 'Building C, Room 212',
  officeHours: 'Tue & Thu: 12:00 PM – 1:00 PM',
  joined: 'August 2019',
  specialization: 'Algorithms, AI & Machine Learning',
};

function Toggle({ checked, onChange, color = 'var(--primary)' }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 40, height: 22, borderRadius: 11, flexShrink: 0,
        background: checked ? color : 'var(--border)',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: checked ? 20 : 3,
        width: 16, height: 16,
        borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </div>
  );
}

export default function Settings() {
  const { backendUrl, updateBackendUrl, connectionStatus, latency, serverInfo, triggerManualCheck, loading, auth } = useERP();

  const [inputUrl, setInputUrl]       = useState(backendUrl);
  const [successMsg, setSuccessMsg]   = useState(null);
  const [apiOpen, setApiOpen]         = useState(false);

  const displayName = auth ? auth.name : TEACHER_PROFILE.name;
  const [profile, setProfile]         = useState({ ...TEACHER_PROFILE, name: displayName });
  const [editing, setEditing]         = useState(false);
  const [draft, setDraft]             = useState({ ...TEACHER_PROFILE, name: displayName });

  const [notifs, setNotifs] = useState({
    attendanceAlerts:  true,
    gradeSubmissions:  true,
    studentMessages:   false,
    deadlineReminders: true,
    systemUpdates:     false,
    weeklyReport:      true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateBackendUrl(inputUrl);
    if (success) {
      setSuccessMsg('Backend synchronized successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const saveProfile = () => { setProfile({ ...draft }); setEditing(false); };
  const initials = profile.name.split(' ').map(n => n[0]).slice(0, 2).join('');

  const connColor = connectionStatus === 'connected' ? 'var(--success)' : connectionStatus === 'connecting' ? 'var(--warning)' : 'var(--danger)';
  const connLabel = connectionStatus === 'connected' ? '● Online' : connectionStatus === 'connecting' ? '● Connecting…' : '● Offline';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Profile Card ── */}
      <div className="erp-card" style={{ animation: 'page-fade-in 0.3s ease both' }}>
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: '0 0 2px', fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{profile.name}</h3>
            <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{profile.department}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 5, padding: '2px 8px', fontSize: '0.62rem', fontWeight: 800 }}>{profile.employeeId}</span>
              <span style={{ background: 'rgba(16,185,129,0.3)', color: '#6ee7b7', borderRadius: 5, padding: '2px 8px', fontSize: '0.62rem', fontWeight: 800 }}>● Active Faculty</span>
            </div>
          </div>
          <button
            className="erp-btn"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => { setDraft({ ...profile }); setEditing(e => !e); }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Details / Edit Form */}
        <div className="erp-card-body">
          {!editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
              {[
                { label: 'Email Address',   value: profile.email,        icon: '✉️' },
                { label: 'Phone Number',    value: profile.phone,        icon: '📞' },
                { label: 'Office Location', value: profile.office,       icon: '🚪' },
                { label: 'Office Hours',    value: profile.officeHours,  icon: '🕐' },
                { label: 'Faculty Since',   value: profile.joined,       icon: '📅' },
                { label: 'Specialization',  value: profile.specialization, icon: '🎓' },
              ].map(f => (
                <div key={f.label} style={{ padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <p style={{ margin: '0 0 3px', fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.icon} {f.label}</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{f.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ animation: 'page-fade-in 0.2s ease both' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[
                  { key: 'name',           label: 'Full Name' },
                  { key: 'employeeId',     label: 'Employee ID', disabled: true },
                  { key: 'department',     label: 'Department' },
                  { key: 'email',          label: 'Email' },
                  { key: 'phone',          label: 'Phone' },
                  { key: 'office',         label: 'Office Location' },
                  { key: 'officeHours',    label: 'Office Hours' },
                  { key: 'specialization', label: 'Specialization' },
                ].map(f => (
                  <div key={f.key} className="erp-form-group">
                    <label className="erp-label">{f.label}</label>
                    <input
                      className="erp-input"
                      type="text"
                      value={draft[f.key] || ''}
                      disabled={f.disabled}
                      onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))}
                      style={f.disabled ? { background: 'var(--surface-3)', color: 'var(--text-muted)' } : {}}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="erp-btn erp-btn-primary" onClick={saveProfile}>Save Profile</button>
                <button className="erp-btn erp-btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Notification Preferences ── */}
      <div className="erp-card" style={{ animation: 'page-fade-in 0.35s 0.05s ease both' }}>
        <div className="erp-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'var(--primary-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div>
              <div className="erp-card-title">Notification Preferences</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 1 }}>Control which alerts you receive</div>
            </div>
          </div>
        </div>
        <div>
          {[
            { key: 'attendanceAlerts',   label: 'Attendance Alerts',         desc: 'Notified when a student is marked absent or late',       color: '#0d9488' },
            { key: 'gradeSubmissions',   label: 'Grade Submission Reminders', desc: 'Reminders to submit grades before deadline',             color: '#6366f1' },
            { key: 'studentMessages',    label: 'Student Messages',           desc: 'Email notification for new student inquiries',           color: '#3b82f6' },
            { key: 'deadlineReminders',  label: 'Deadline Reminders',         desc: 'Alerts for upcoming assignment and quiz deadlines',      color: '#ea580c' },
            { key: 'systemUpdates',      label: 'System & Portal Updates',    desc: 'ERP platform announcements and feature updates',         color: '#6366f1' },
            { key: 'weeklyReport',       label: 'Weekly Summary Report',      desc: 'Email digest of class performance and attendance weekly', color: '#10b981' },
          ].map((item, i, arr) => (
            <div
              key={item.key}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
              onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
              <Toggle checked={notifs[item.key]} onChange={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))} color={item.color} />
            </div>
          ))}
        </div>
      </div>

      {/* ── System & API Settings (collapsible) ── */}
      <div className="erp-card" style={{ animation: 'page-fade-in 0.4s 0.1s ease both' }}>
        <button
          onClick={() => setApiOpen(o => !o)}
          style={{ width: '100%', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', textAlign: 'left' }}
        >
          <div style={{ width: 32, height: 32, background: 'var(--surface-3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>System & API Settings</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Backend connection, server URL, latency</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: 99, color: connColor, background: `${connColor}18`, border: `1px solid ${connColor}40` }}>
              {connLabel}
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" style={{ transform: apiOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {apiOpen && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '20px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div className="erp-form-group">
                <label className="erp-label">Backend API URL</label>
                <input
                  type="text"
                  className="erp-input"
                  value={inputUrl}
                  onChange={e => setInputUrl(e.target.value)}
                  placeholder="http://localhost:5000"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
              {successMsg && (
                <div className="erp-badge erp-badge-success" style={{ padding: '7px 12px', fontSize: '0.75rem' }}>✓ {successMsg}</div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="erp-btn erp-btn-primary">Update Connection</button>
                <button type="button" className="erp-btn erp-btn-secondary" onClick={triggerManualCheck} disabled={loading}>
                  {loading ? 'Testing…' : 'Test Connection'}
                </button>
              </div>
            </form>

            {/* Live Stats */}
            {connectionStatus === 'connected' && serverInfo && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                  Live Server Stats
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Status',             val: serverInfo.status?.toUpperCase(), color: 'var(--success)' },
                    { label: 'Round-Trip Latency', val: `${latency}ms`,                  color: 'var(--text)' },
                    { label: 'Uptime',             val: `${(serverInfo.uptime||0).toFixed(1)}s`, color: 'var(--text)' },
                    { label: 'Server Clock',       val: serverInfo.timestamp,             color: 'var(--text)' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{r.label}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: r.color, fontFamily: 'monospace' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
