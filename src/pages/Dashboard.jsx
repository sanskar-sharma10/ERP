import { useState } from 'react';
import { useERP } from '../context/ERPContext';
import Students from './Students';
import Faculty from './Faculty';
import Gradebook from './Gradebook';
import Attendance from './Attendance';
import Timetable from './Timetable';
import Settings from './Settings';
import Announcements from './Announcements';
import { AssignmentsPage, PerformancePage } from './TeacherPages';

// ── Utility ───────────────────────────────────────────────────────
function getDayName() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

// ── Icons ─────────────────────────────────────────────────────────
const Icon = ({ path, size = 16, color = 'currentColor', strokeWidth = 2, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

// ── KPI Card ──────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon, colorClass }) {
  return (
    <div className={`erp-stat-card ${colorClass}`}>
      <div className="erp-stat-top">
        <span className="erp-stat-label">{label}</span>
        <div className={`erp-stat-icon ${colorClass}`}>{icon}</div>
      </div>
      <div className="erp-stat-value">{value}</div>
      <div className="erp-stat-sub">{sub}</div>
    </div>
  );
}

// ── Course Card ───────────────────────────────────────────────────
const COURSE_THEMES = {
  purple: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  teal:   'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
  orange: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)',
};

function CourseCard({ code, title, students, progress, theme, onClick, schedule, nextClass, avgGrade }) {
  return (
    <div className="erp-course-card" style={{ background: COURSE_THEMES[theme] }} onClick={onClick}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span className="erp-course-code">{code}</span>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
            👥 {students}
          </span>
        </div>
        <div className="erp-course-title">{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {schedule && <span className="erp-course-meta">📅 {schedule}</span>}
          {nextClass && <span className="erp-course-meta">▶ Next: {nextClass}</span>}
          {avgGrade  && <span className="erp-course-meta">📊 Avg: {avgGrade}</span>}
        </div>
      </div>
      <div className="erp-course-footer">
        <div className="erp-course-progress-label">
          <span>Syllabus Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="erp-course-progress-track">
          <div className="erp-course-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

// ── Navigation items ──────────────────────────────────────────────
const NAV_ITEMS = [
  {
    section: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></> },
      { id: 'myclasses', label: 'My Classes', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></> },
      { id: 'attendance', label: 'Attendance', icon: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></> },
      { id: 'timetable', label: 'Timetable', icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
    ],
  },
  {
    section: 'ACADEMIC',
    items: [
      { id: 'assignments', label: 'Assignments', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> },
      { id: 'exams', label: 'Exams & Grades', icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 10 3 12 0v-5"/></> },
      { id: 'performance', label: 'My Attendance', icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></> },
    ],
  },
  {
    section: 'COMMUNICATION',
    items: [
      { id: 'announcements', label: 'Notices', badge: 3, icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></> },
      { id: 'settings', label: 'Settings', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></> },
    ],
  },
];

// ── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ activeMenu, setActiveMenu, auth, logout, connectionStatus }) {
  const displayName = auth ? auth.name.split(',').reverse().join(' ').trim() : 'Dr. Evelyn Vance';
  const role = auth?.role || 'Senior Academic Faculty';

  const connLabel = connectionStatus === 'connected' ? 'Live — Backend Connected'
    : connectionStatus === 'connecting' ? 'Connecting to server…'
    : 'Offline — Sandbox Mode';

  return (
    <aside className="erp-sidebar">
      {/* Logo */}
      <div className="erp-sidebar-header">
        <div className="erp-logo">
          <div className="erp-logo-icon">
            <img src="/logo.png" alt="Univers-One" />
          </div>
          <div className="erp-logo-text">
            <span className="erp-logo-name">Univers-One</span>
            <span className="erp-logo-sub">ERP Platform</span>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div style={{ padding: '10px 12px' }}>
        <div className="erp-sidebar-profile">
          <div className="erp-profile-avatar">
            {initials(displayName)}
            <div className="erp-profile-status" />
          </div>
          <div className="erp-profile-info">
            <div className="erp-profile-name">{displayName.split(' ').slice(-2).join(' ')}</div>
            <div className="erp-profile-role">{role}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="erp-sidebar-nav">
        {NAV_ITEMS.map(group => (
          <div key={group.section}>
            <div className="erp-nav-section-label">{group.section}</div>
            {group.items.map(item => (
              <button
                key={item.id}
                className={`erp-nav-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.id)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon}
                </svg>
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.badge && (
                  <span className="erp-nav-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="erp-sidebar-footer">
        <div className="erp-connection-pill">
          <div className={`erp-connection-dot ${connectionStatus === 'connected' ? 'online' : connectionStatus === 'connecting' ? 'connecting' : 'offline'}`} />
          <span className="erp-connection-text">{connLabel}</span>
        </div>
        <button className="erp-signout-btn" onClick={logout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// ── Top Bar ───────────────────────────────────────────────────────
function TopBar({ title, onAnnouncement }) {
  return (
    <div className="erp-topbar">
      <div className="erp-topbar-title">{title}</div>
      <div className="erp-topbar-search">
        <svg className="erp-topbar-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input placeholder="Search anything…" />
      </div>
      <div className="erp-topbar-actions">
        <button className="erp-icon-btn" title="Notifications" onClick={onAnnouncement}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Dashboard Home Content ────────────────────────────────────────
function DashboardHome({ setActiveMenu }) {
  const { auth } = useERP();
  const displayName = auth ? auth.name.split(',').reverse().join(' ').trim() : 'Dr. Evelyn Vance';
  const greetingName = auth ? auth.name.split(' ').pop().replace('Dr.','').replace('Prof.','').trim() : 'Evelyn';

  // Get time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [tasks, setTasks] = useState([
    { id: 1, type: 'CS-301 Exam',    name: 'Grade midterm exam papers (48 students) — Due May 28',        color: '#ea580c', priority: 'high',   checked: false },
    { id: 2, type: 'Course Prep',    name: 'Prepare slides: Neural Networks Ch.9 (CS-101, Thu)',           color: '#6366f1', priority: 'medium', checked: false },
    { id: 3, type: 'Registrar',      name: 'Submit weekly attendance logs for all 3 courses',              color: '#0d9488', priority: 'high',   checked: true  },
    { id: 4, type: 'CS-202 Lab',     name: 'Post Assignment 5: Docker & CI/CD Lab — deadline June 2',     color: '#3b82f6', priority: 'medium', checked: false },
    { id: 5, type: 'Office Hours',   name: 'Reply to 6 pending student consultation emails',               color: '#f43f5e', priority: 'low',    checked: false },
    { id: 6, type: 'Research Grant', name: 'Review & submit IEEE conference paper draft by May 30',        color: '#10b981', priority: 'low',    checked: false },
  ]);
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));

  const [expandedNotice, setExpandedNotice] = useState(null);
  const schoolNotices = [
    { id: 1, title: 'End-of-Semester Exam Schedule Published', dept: 'Registrar', time: 'Today, 09:00 AM', priority: 'urgent', color: '#dc2626', icon: '🏛️', desc: 'Final exams: June 9–20, 2026. Question papers due to Exam Cell by May 30 (5:00 PM). No extensions. Download timetable from Academic Portal.', action: 'Submit papers by May 30' },
    { id: 2, title: 'Grade Submission Deadline — June 25', dept: 'Registrar', time: 'Yesterday, 04:00 PM', priority: 'urgent', color: '#dc2626', icon: '📋', desc: 'All final grades must be submitted via ERP Gradebook by June 25, 11:59 PM. Late submissions require Dean approval.', action: 'Submit grades by Jun 25' },
    { id: 3, title: 'Faculty Professional Dev Day — May 28', dept: 'Academic Affairs', time: '2 days ago', priority: 'high', color: '#e11d48', icon: '🎓', desc: 'May 28, 9 AM–4 PM, Main Auditorium. Topics: AI Pedagogy, Inclusive Classrooms, Research Ethics. Lunch provided.', action: 'Confirm attendance' },
    { id: 4, title: 'Campus Network Maintenance — May 24', dept: 'IT Department', time: '3 days ago', priority: 'medium', color: '#6366f1', icon: '💻', desc: 'Saturday May 24, 2:00–6:00 AM. ERP Portal, Wi-Fi, email, and Library DB will be offline.', action: 'Save work by Fri night' },
    { id: 5, title: 'Tuition Balance Clearance — June 15', dept: 'Finance', time: '4 days ago', priority: 'medium', color: '#d97706', icon: '💰', desc: 'Students must clear balances by June 15 for Fall 2026 registration. Flag students with unpaid status.', action: 'Flag unpaid students' },
  ];

  const todayStr = new Date().toLocaleDateString('en-US', { weekday:'short' }).toLowerCase();
  const WEEK_DAYS = [
    { day: 'Mon', classes: 2, hours: '3h',   highlight: todayStr === 'mon' },
    { day: 'Tue', classes: 1, hours: '1.5h', highlight: todayStr === 'tue' },
    { day: 'Wed', classes: 2, hours: '3h',   highlight: todayStr === 'wed' },
    { day: 'Thu', classes: 1, hours: '1.5h', highlight: todayStr === 'thu' },
    { day: 'Fri', classes: 1, hours: '1h',   highlight: todayStr === 'fri' },
  ];

  return (
    <div style={{ display: 'flex', gap: '0', height: '100%', minHeight: 0 }}>
      {/* ── Main scrollable area ── */}
      <div className="erp-page" style={{ flex: 1, minWidth: 0 }}>
        {/* Greeting Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div className="erp-greeting">
            <h2>{greeting}, Dr. {greetingName} 👋</h2>
            <p>{getDayName()}</p>
          </div>
          <button className="erp-btn erp-btn-primary" onClick={() => setActiveMenu('announcements')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Post Announcement
          </button>
        </div>

        {/* KPI Stats */}
        <div className="erp-stat-grid">
          <KpiCard label="My Classes"         value="3"    sub="CS-301, CS-101, CS-202"        icon="📚" colorClass="purple" />
          <KpiCard label="Total Students"     value="203"  sub="48 + 120 + 35 enrolled"        icon="👥" colorClass="blue" />
          <KpiCard label="Avg Attendance"     value="87%"  sub={<><span className="positive">↑ 3%</span> from last week</>} icon="✅" colorClass="emerald" />
          <KpiCard label="Pending Grades"     value="34"   sub="12 overdue · 22 this week"     icon="📝" colorClass="amber" />
          <KpiCard label="Upcoming Deadlines" value="2"    sub="Grade submission · Exam papers" icon="⏰" colorClass="rose" />
        </div>

        {/* Course Cards */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>My Courses</h3>
            <button className="erp-btn erp-btn-ghost erp-btn-sm" onClick={() => setActiveMenu('myclasses')}>View all →</button>
          </div>
          <div className="erp-course-grid">
            <CourseCard code="CS-301" title="Advanced Algorithms" students={48} progress={96} theme="purple" onClick={() => setActiveMenu('myclasses')} schedule="Mon & Wed, 10:00–11:30 AM" nextClass="Wed, May 28 · Room 204" avgGrade="B+ (3.4)" />
            <CourseCard code="CS-101" title="Introduction to AI"  students={120} progress={46} theme="teal"  onClick={() => setActiveMenu('myclasses')} schedule="Tue & Thu, 2:00–3:30 PM" nextClass="Thu, May 29 · Hall A" avgGrade="B (3.1)" />
            <CourseCard code="CS-202" title="Software Engineering" students={35} progress={73} theme="orange" onClick={() => setActiveMenu('myclasses')} schedule="Mon, Wed & Fri, 9–10 AM" nextClass="Wed, May 28 · Lab 3" avgGrade="A- (3.7)" />
          </div>
        </div>

        {/* Bottom Grid: Tasks + Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

          {/* Tasks Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Academic Tasks</h3>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {tasks.filter(t => t.checked).length}/{tasks.length} done
              </span>
            </div>
            <div className="erp-task-list">
              {tasks.map(t => (
                <div
                  key={t.id}
                  className={`erp-task-item ${t.checked ? 'checked' : ''}`}
                  style={{ '--task-color': t.color }}
                  onClick={() => toggleTask(t.id)}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: '0 2px 2px 0', background: t.color }} />
                  <div className={`erp-task-checkbox ${t.checked ? 'done' : ''}`}>
                    {t.checked && '✓'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span className="erp-task-name" style={{ textDecoration: t.checked ? 'line-through' : 'none' }}>
                        {t.type}
                      </span>
                      <span className={`erp-badge erp-badge-square erp-priority-${t.priority}`} style={{ fontSize: '0.55rem', padding: '1px 5px' }}>
                        {t.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="erp-task-sub" style={{ textDecoration: t.checked ? 'line-through' : 'none' }}>
                      {t.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Teaching Stats</h3>

            <div className="erp-mini-stat-grid">
              {[
                { value: '3',   label: 'Active\nCourses' },
                { value: '142', label: 'Graded\nPapers' },
                { value: '87%', label: 'Avg\nAttendance', onClick: () => setActiveMenu('attendance') },
                { value: '4.6', label: 'Student\nRating' },
              ].map((s, i) => (
                <div key={i} className="erp-mini-stat" onClick={s.onClick} style={{ cursor: s.onClick ? 'pointer' : 'default' }}>
                  <div className="erp-mini-stat-value">{s.value}</div>
                  <div className="erp-mini-stat-label" style={{ whiteSpace: 'pre-line' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Week at a glance */}
            <div className="erp-card">
              <div className="erp-card-header" style={{ padding: '10px 14px' }}>
                <span className="erp-card-title" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>This Week at a Glance</span>
              </div>
              <div className="erp-card-body" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {WEEK_DAYS.map(d => (
                  <div key={d.day} className="erp-week-bar">
                    <span className="erp-week-day-label" style={{ color: d.highlight ? 'var(--primary)' : 'var(--text)' }}>{d.day}</span>
                    <div className="erp-week-track">
                      <div className="erp-week-fill" style={{
                        width: `${(d.classes / 3) * 100}%`,
                        background: d.highlight ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : 'linear-gradient(90deg,#0d9488,#059669)',
                      }} />
                    </div>
                    <span className="erp-week-meta">{d.classes} cls · {d.hours}</span>
                  </div>
                ))}
                <p style={{ margin: '4px 0 0', fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Total: 7 classes · 10 teaching hours this week
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { label: '📋 Take Attendance',   action: 'attendance' },
                  { label: '🏆 Open Gradebook',    action: 'exams' },
                  { label: '📢 Post Announcement', action: 'announcements' },
                ].map(a => (
                  <button
                    key={a.action}
                    className="erp-btn erp-btn-secondary"
                    style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}
                    onClick={() => setActiveMenu(a.action)}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Notices Panel ── */}
      <div className="erp-right-panel">
        {/* Semester progress */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>📢 School Notices</span>
            <button className="erp-btn erp-btn-ghost erp-btn-sm" onClick={() => setActiveMenu('announcements')} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>
              All →
            </button>
          </div>
          <div className="erp-semester-bar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Spring 2026</span>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--primary)' }}>Week 14 / 18</span>
            </div>
            <div className="erp-progress" style={{ marginBottom: '5px' }}>
              <div className="erp-progress-bar" style={{ width: '78%', background: 'linear-gradient(90deg, var(--primary), #8b5cf6)' }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 500 }}>4 weeks until semester end</p>
          </div>
        </div>

        {/* Notices feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {schoolNotices.map(notice => {
            const isExpanded = expandedNotice === notice.id;
            return (
              <div
                key={notice.id}
                className="erp-notice-card"
                style={{ borderLeftColor: notice.color }}
                onClick={() => setExpandedNotice(isExpanded ? null : notice.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className="erp-notice-priority" style={{ color: notice.color, background: `${notice.color}14` }}>
                    {notice.priority}
                  </span>
                  <span className="erp-notice-time">{notice.time}</span>
                </div>
                <div className="erp-notice-title">
                  {notice.icon} {notice.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {notice.dept}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', transition: 'transform 0.2s', display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>▼</span>
                </div>
                {isExpanded && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--border)', animation: 'page-fade-in 0.2s ease both' }}>
                    <p style={{ margin: '0 0 6px', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontWeight: 400 }}>
                      {notice.desc}
                    </p>
                    {notice.action && (
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, color: notice.color, background: `${notice.color}12`, padding: '3px 8px', borderRadius: '4px', border: `1px solid ${notice.color}25` }}>
                        → {notice.action}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Page title map ────────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard:    'Dashboard',
  myclasses:    'My Classes',
  attendance:   'Attendance Tracker',
  assignments:  'Assignments',
  exams:        'Exams & Grades',
  timetable:    'Timetable',
  announcements:'Notice Board',
  performance:  'My Attendance Record',
  settings:     'Settings',
};

// ── Main Dashboard Export ─────────────────────────────────────────
export default function Dashboard() {
  const { auth, logout, activePage, setActivePage, connectionStatus } = useERP();
  const activeMenu = activePage;
  const setActiveMenu = (page) => setActivePage(page);

  const isHome = activeMenu === 'dashboard';

  return (
    <div className="erp-shell">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        auth={auth}
        logout={logout}
        connectionStatus={connectionStatus}
      />

      <div className="erp-main">
        <TopBar
          title={PAGE_TITLES[activeMenu] || 'Dashboard'}
          onAnnouncement={() => setActiveMenu('announcements')}
        />

        {/* Content */}
        {isHome ? (
          <DashboardHome setActiveMenu={setActiveMenu} />
        ) : (
          <div className="erp-page">
            {activeMenu === 'myclasses'    && <Faculty />}
            {activeMenu === 'attendance'   && <Attendance />}
            {activeMenu === 'assignments'  && <AssignmentsPage />}
            {activeMenu === 'exams'        && <Gradebook />}
            {activeMenu === 'timetable'    && <Timetable />}
            {activeMenu === 'announcements'&& <Announcements />}
            {activeMenu === 'performance'  && <PerformancePage />}
            {activeMenu === 'settings'     && <Settings />}
          </div>
        )}
      </div>
    </div>
  );
}
