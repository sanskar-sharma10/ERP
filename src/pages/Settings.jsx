import { useState } from 'react';
import { useERP } from '../context/ERPContext';

const C = {
  bg: '#f7f6f3', card: '#ffffff', bd: '#e8e3dc',
  h: '#1e1b4b', sub: '#64748b', lab: '#6b7280', val: '#1e293b',
  shadow: '0 1px 8px rgba(30,27,75,.07)',
  shadowHover: '0 6px 24px rgba(30,27,75,.12)',
};

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
  courses: 3,
};

function Toggle({ checked, onChange, color = '#6366f1' }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: '40px', height: '22px', borderRadius: '11px',
        background: checked ? color : '#d1d5db',
        cursor: 'pointer', position: 'relative',
        transition: 'background .2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: '3px',
        left: checked ? '20px' : '3px',
        width: '16px', height: '16px',
        borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        transition: 'left .2s'
      }} />
    </div>
  );
}

export default function Settings() {
  const {
    backendUrl,
    updateBackendUrl,
    connectionStatus,
    latency,
    serverInfo,
    triggerManualCheck,
    loading,
    auth
  } = useERP();

  const [inputUrl, setInputUrl] = useState(backendUrl);
  const [successMsg, setSuccessMsg] = useState(null);
  const [apiOpen, setApiOpen] = useState(false);

  // Profile edit state
  const displayName = auth ? auth.name : TEACHER_PROFILE.name;
  const [profile, setProfile] = useState({ ...TEACHER_PROFILE, name: displayName });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ ...TEACHER_PROFILE, name: displayName });

  // Notification toggles
  const [notifs, setNotifs] = useState({
    attendanceAlerts: true,
    gradeSubmissions: true,
    studentMessages: false,
    deadlineReminders: true,
    systemUpdates: false,
    weeklyReport: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateBackendUrl(inputUrl);
    if (success) {
      setSuccessMsg('Backend synchronized successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const saveProfile = () => {
    setProfile({ ...profileDraft });
    setEditingProfile(false);
  };

  const initials = profile.name.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <div className="main-panel">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .settings-input:focus { border-color: #6366f1 !important; outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
        .toggle-row:hover { background: #fafaf8 !important; }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: '800', color: C.h }}>Settings</h2>
        <p style={{ margin: 0, fontSize: '0.78rem', color: C.sub }}>Manage your profile, preferences and system connection</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── TEACHER PROFILE CARD ── */}
        <div style={{ background: C.card, border: `1px solid ${C.bd}`, borderRadius: '20px', overflow: 'hidden', boxShadow: C.shadow, animation: 'fadeUp .3s both' }}>
          {/* Top gradient banner */}
          <div style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,.2)', border: '3px solid rgba(255,255,255,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: '800', color: '#fff', flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: '0 0 2px', fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{profile.name}</h3>
              <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: 'rgba(255,255,255,.8)', fontWeight: '600' }}>{profile.department}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', borderRadius: '6px', padding: '2px 9px', fontSize: '0.65rem', fontWeight: '800' }}>{profile.employeeId}</span>
                <span style={{ background: 'rgba(16,185,129,.25)', color: '#6ee7b7', borderRadius: '6px', padding: '2px 9px', fontSize: '0.65rem', fontWeight: '800' }}>● Active Faculty</span>
              </div>
            </div>
            <button
              onClick={() => { setProfileDraft({ ...profile }); setEditingProfile(e => !e); }}
              style={{ height: '36px', padding: '0 16px', background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', borderRadius: '9px', color: '#fff', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {editingProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile details / edit form */}
          <div style={{ padding: '1.5rem 2rem' }}>
            {!editingProfile ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem' }}>
                {[
                  { label: 'Email Address', value: profile.email, icon: '✉️' },
                  { label: 'Phone Number', value: profile.phone, icon: '📞' },
                  { label: 'Office Location', value: profile.office, icon: '🚪' },
                  { label: 'Office Hours', value: profile.officeHours, icon: '🕐' },
                  { label: 'Faculty Since', value: profile.joined, icon: '📅' },
                  { label: 'Specialization', value: profile.specialization, icon: '🎓' },
                ].map(f => (
                  <div key={f.label} style={{ padding: '.9rem 1rem', background: '#fafaf8', border: `1px solid ${C.bd}`, borderRadius: '12px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: '0.62rem', fontWeight: '700', color: C.sub, textTransform: 'uppercase', letterSpacing: '.5px' }}>{f.icon} {f.label}</p>
                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '700', color: C.h }}>{f.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeUp .2s ease-out both' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'Dr. Evelyn Vance' },
                    { key: 'employeeId', label: 'Employee ID', placeholder: 'FAC-2019-0051', disabled: true },
                    { key: 'department', label: 'Department', placeholder: 'Computer Science' },
                    { key: 'email', label: 'Email', placeholder: 'name@university.edu' },
                    { key: 'phone', label: 'Phone', placeholder: '(555) 000-0000' },
                    { key: 'office', label: 'Office Location', placeholder: 'Building C, Room 212' },
                    { key: 'officeHours', label: 'Office Hours', placeholder: 'Tue & Thu: 12–1 PM' },
                    { key: 'specialization', label: 'Specialization', placeholder: 'Algorithms, AI' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>{f.label}</label>
                      <input
                        type="text"
                        value={profileDraft[f.key] || ''}
                        disabled={f.disabled}
                        onChange={e => setProfileDraft(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="settings-input"
                        style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.82rem', fontFamily: 'inherit', color: C.h, background: f.disabled ? '#f4f4f4' : '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                  <button onClick={saveProfile} style={{ flex: 1, height: '40px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Save Profile
                  </button>
                  <button onClick={() => setEditingProfile(false)} style={{ height: '40px', padding: '0 20px', border: `1px solid ${C.bd}`, borderRadius: '10px', background: '#fff', color: C.sub, fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── NOTIFICATION PREFERENCES ── */}
        <div style={{ background: C.card, border: `1px solid ${C.bd}`, borderRadius: '20px', overflow: 'hidden', boxShadow: C.shadow, animation: 'fadeUp .35s .05s both' }}>
          <div style={{ padding: '1.25rem 1.75rem', borderBottom: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: 'rgba(99,102,241,.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: C.h }}>Notification Preferences</h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: C.sub }}>Control which alerts you receive</p>
            </div>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {[
              { key: 'attendanceAlerts',   label: 'Attendance Alerts',       desc: 'Notified when a student is marked absent or late',          color: '#0d9488' },
              { key: 'gradeSubmissions',   label: 'Grade Submission Reminders', desc: 'Reminders to submit grades before deadline',            color: '#7c3aed' },
              { key: 'studentMessages',    label: 'Student Messages',         desc: 'Email notification for new student inquiries',             color: '#3b82f6' },
              { key: 'deadlineReminders',  label: 'Deadline Reminders',       desc: 'Alerts for upcoming assignment and quiz deadlines',         color: '#ea580c' },
              { key: 'systemUpdates',      label: 'System & Portal Updates',  desc: 'ERP platform announcements and feature updates',           color: '#6366f1' },
              { key: 'weeklyReport',       label: 'Weekly Summary Report',    desc: 'Email digest of class performance and attendance weekly',   color: '#059669' },
            ].map((item, i, arr) => (
              <div
                key={item.key}
                className="toggle-row"
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '1rem 1.75rem', borderBottom: i < arr.length - 1 ? `1px solid ${C.bd}` : 'none', background: 'transparent', transition: 'background .15s', cursor: 'pointer' }}
                onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: '700', color: C.h }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: C.sub }}>{item.desc}</p>
                </div>
                <Toggle checked={notifs[item.key]} onChange={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))} color={item.color} />
              </div>
            ))}
          </div>
        </div>

        {/* ── SYSTEM SETTINGS (Collapsible) ── */}
        <div style={{ background: C.card, border: `1px solid ${C.bd}`, borderRadius: '20px', overflow: 'hidden', boxShadow: C.shadow, animation: 'fadeUp .4s .1s both' }}>
          <button
            onClick={() => setApiOpen(o => !o)}
            style={{ width: '100%', padding: '1.25rem 1.75rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit', textAlign: 'left' }}
          >
            <div style={{ width: '34px', height: '34px', background: 'rgba(100,116,139,.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: '800', color: C.h }}>System & API Settings</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: C.sub }}>Backend connection, server URL, latency monitoring</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '2px 9px', borderRadius: '20px', background: connectionStatus === 'connected' ? 'rgba(5,150,105,.1)' : 'rgba(225,29,72,.1)', color: connectionStatus === 'connected' ? '#059669' : '#e11d48', border: `1px solid ${connectionStatus === 'connected' ? 'rgba(5,150,105,.2)' : 'rgba(225,29,72,.2)'}` }}>
                {connectionStatus === 'connected' ? '● Online' : connectionStatus === 'connecting' ? '● Connecting' : '● Offline'}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5" style={{ transform: apiOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>

          {apiOpen && (
            <div style={{ borderTop: `1px solid ${C.bd}`, padding: '1.5rem 1.75rem', animation: 'fadeUp .2s ease-out both' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: C.h, marginBottom: '6px' }}>Backend API URL</label>
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    placeholder="http://localhost:5000"
                    className="settings-input"
                    style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.bd}`, borderRadius: '10px', fontSize: '0.88rem', fontFamily: 'monospace', color: C.h, background: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                {successMsg && (
                  <div style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', background: 'rgba(5,150,105,.08)', color: '#059669', border: '1px solid rgba(5,150,105,.2)', fontWeight: '600' }}>
                    ✓ {successMsg}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ flex: 1, height: '40px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Update Connection
                  </button>
                  <button type="button" onClick={triggerManualCheck} disabled={loading} style={{ height: '40px', padding: '0 18px', border: `1px solid ${C.bd}`, borderRadius: '10px', background: '#fff', color: C.sub, fontSize: '0.82rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? .6 : 1 }}>
                    {loading ? 'Testing…' : 'Test Connection'}
                  </button>
                </div>
              </form>

              {/* Live server stats */}
              {connectionStatus === 'connected' && serverInfo && (
                <div style={{ borderTop: `1px solid ${C.bd}`, paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '0.72rem', fontWeight: '700', color: C.sub, textTransform: 'uppercase', letterSpacing: '.5px' }}>Live Server Stats</p>
                  {[
                    { label: 'Status', val: serverInfo.status?.toUpperCase(), color: '#059669' },
                    { label: 'Round-Trip Latency', val: `${latency}ms`, color: '#0d9488' },
                    { label: 'Uptime', val: `${(serverInfo.uptime || 0).toFixed(1)}s`, color: C.h },
                    { label: 'Server Clock', val: serverInfo.timestamp, color: C.h },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fafaf8', borderRadius: '8px', border: `1px solid ${C.bd}` }}>
                      <span style={{ fontSize: '0.78rem', color: C.sub, fontWeight: '600' }}>{r.label}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: '800', color: r.color, fontFamily: 'monospace' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
