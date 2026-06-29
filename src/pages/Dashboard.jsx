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

// ── AVATAR SVG helpers ──────────────────────────────────────────────

const SarahAvatarSvg = () => (
  <svg viewBox="0 0 100 100" className="chaart-avatar">
    <circle cx="50" cy="50" r="50" fill="#e0f2fe" />
    <path d="M25 45c-2 0-5 2-5 5s2 6 5 6c2 1 4 0 5-2c1-2 0-4-1-6c-1-2-2-3-4-3z" fill="#2d2a45" />
    <path d="M75 45c2 0 5 2 5 5s-2 6-5 6c-2 1-4 0-5-2c-1-2 0-4 1-6c1-2 2-3 4-3z" fill="#2d2a45" />
    <circle cx="28" cy="40" r="8" fill="#2d2a45" /><circle cx="72" cy="40" r="8" fill="#2d2a45" />
    <circle cx="32" cy="30" r="10" fill="#2d2a45" /><circle cx="68" cy="30" r="10" fill="#2d2a45" />
    <circle cx="50" cy="24" r="12" fill="#2d2a45" />
    <path d="M50 82c12 0 20-8 20-18V48H30v16c0 10 8 18 20 18z" fill="#fcd34d" />
    <circle cx="34" cy="48" r="7" fill="#2d2a45" /><circle cx="66" cy="48" r="7" fill="#2d2a45" />
    <circle cx="40" cy="28" r="8" fill="#2d2a45" /><circle cx="60" cy="28" r="8" fill="#2d2a45" />
    <circle cx="50" cy="26" r="9" fill="#2d2a45" />
    <rect x="33" y="44" width="14" height="10" rx="4" fill="none" stroke="#2d2a45" strokeWidth="3" />
    <rect x="53" y="44" width="14" height="10" rx="4" fill="none" stroke="#2d2a45" strokeWidth="3" />
    <line x1="47" y1="48" x2="53" y2="48" stroke="#2d2a45" strokeWidth="3" />
    <circle cx="40" cy="49" r="2" fill="#1e1b4b" /><circle cx="60" cy="49" r="2" fill="#1e1b4b" />
    <path d="M46 62q4 3 8 0" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M30 82c0 0 5 10 20 10s20-10 20-10H30z" fill="#f43f5e" />
    <path d="M45 82l5 6 5-6z" fill="#fcd34d" />
  </svg>
);

const DefaultAvatarSvg = () => (
  <svg viewBox="0 0 100 100" className="chaart-avatar">
    <circle cx="50" cy="50" r="50" fill="#e0f2fe" />
    <path d="M50 65c12 0 18-6 18-12V35H32v18c0 6 6 12 18 12z" fill="#fed7aa" />
    <path d="M30 35c0-8 8-12 20-12s20 4 20 12v3H30v-3z" fill="#475569" />
    <circle cx="43" cy="45" r="2" fill="#1e1b4b" /><circle cx="57" cy="45" r="2" fill="#1e1b4b" />
    <path d="M46 54q4 2 8 0" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M30 65s3 12 20 12 20-12 20-12H30z" fill="#2563eb" />
  </svg>
);

const SidebarWaveSvg = () => (
  <svg viewBox="0 0 240 180" className="chaart-wavy-blob">
    <path d="M0 180v-50c30-15 60 10 90 0s50-40 90-20c30 15 45 40 60 70v0z" fill="rgba(45, 212, 191, 0.08)" />
    <path d="M0 180v-30c25-10 50 15 75 5s45-30 80-15c25 10 40 30 55 50v0z" fill="rgba(99, 102, 241, 0.06)" />
    <path d="M0 180v-15c15-5 35 10 55 2s35-20 60-10c20 8 30 20 40 33v0z" fill="rgba(244, 121, 82, 0.04)" />
  </svg>
);

const renderAvatar = (name) => {
  if (!name) return <SarahAvatarSvg />;
  const l = name.toLowerCase();
  if (l.includes('evelyn') || l.includes('vance') || l.includes('sara') || l.includes('connor')) return <SarahAvatarSvg />;
  return <DefaultAvatarSvg />;
};

// ── Utility ───────────────────────────────────────────────────────
function getDayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// KPI stat widget
function KpiCard({ label, value, sub, icon, color, bg, border }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${border}`, borderRadius: '16px', padding: '1.1rem 1.25rem', boxShadow: '0 1px 8px rgba(30,27,75,.06)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.62rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.6px', color: '#64748b' }}>{label}</span>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>{icon}</div>
      </div>
      <div style={{ fontSize: '1.7rem', fontWeight: '800', color, lineHeight: '1' }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '500' }}>{sub}</div>
    </div>
  );
}

// Course progress card
function CourseCard({ code, title, students, progress, theme, onClick, schedule, nextClass, avgGrade }) {
  const themes = {
    purple: { grad: 'linear-gradient(135deg,#7c3aed,#4f46e5)', dot: '#7c3aed', light: 'rgba(124,58,237,.08)', border: 'rgba(124,58,237,.2)' },
    teal:   { grad: 'linear-gradient(135deg,#0d9488,#0284c7)', dot: '#0d9488', light: 'rgba(13,148,136,.08)', border: 'rgba(13,148,136,.2)' },
    orange: { grad: 'linear-gradient(135deg,#ea580c,#f59e0b)', dot: '#ea580c', light: 'rgba(234,88,12,.08)', border: 'rgba(234,88,12,.2)' },
  };
  const t = themes[theme] || themes.purple;
  return (
    <div
      onClick={onClick}
      style={{ background: '#fff', border: `1px solid ${t.border}`, borderRadius: '18px', padding: '1.25rem', cursor: 'pointer', transition: 'all .22s', boxShadow: '0 1px 8px rgba(30,27,75,.05)' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,27,75,.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 8px rgba(30,27,75,.05)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '3px 9px', borderRadius: '6px', background: t.light, color: t.dot, border: `1px solid ${t.border}` }}>{code}</span>
        <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600' }}>👥 {students} students</span>
      </div>
      <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: '800', color: '#1e1b4b', lineHeight: '1.3' }}>{title}</h4>
      {/* Schedule & Next Class info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '10px' }}>
        {schedule && <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '500' }}>📅 {schedule}</span>}
        {nextClass && <span style={{ fontSize: '0.65rem', color: t.dot, fontWeight: '600' }}>▶ Next: {nextClass}</span>}
        {avgGrade && <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '500' }}>📊 Class Avg: {avgGrade}</span>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '600' }}>Syllabus Progress</span>
        <span style={{ fontSize: '0.72rem', fontWeight: '800', color: t.dot }}>{progress}%</span>
      </div>
      <div style={{ height: '5px', background: '#f0ede8', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: t.grad, borderRadius: '99px', transition: 'width .5s ease' }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { auth, logout } = useERP();
  const { activePage, setActivePage } = useERP();

  const displayName = auth ? auth.name.split(',').reverse().join(' ').trim() : 'Dr. Evelyn Vance';
  const greetingName = auth ? auth.name.split(' ').pop().replace('Dr.', '').replace('Prof.', '').trim() : 'Evelyn';
  const displayEmail = auth ? auth.email : 'evelyn.vance@univers-one.edu';

  // Map page IDs for sidebar navigation sync
  const activeMenu = activePage;

  const setActiveMenu = (page) => {
    setActivePage(page);
  };

  const hasCalendar = activePage === 'dashboard';
  const isMainDashboard = activePage === 'dashboard';

  // ── Interactive tasks state ──
  const [tasks, setTasks] = useState([
    { id: 1, type: 'CS-301 Exam',     name: 'Grade midterm exam papers (48 students) — Due May 28',           color: 'orange', priority: 'high',   checked: false },
    { id: 2, type: 'Course Prep',     name: 'Prepare slides: Neural Networks Ch.9 (CS-101, Thu lecture)',      color: 'purple', priority: 'medium', checked: false },
    { id: 3, type: 'Registrar',       name: 'Submit weekly attendance logs for all 3 courses',                 color: 'teal',   priority: 'high',   checked: true  },
    { id: 4, type: 'CS-202 Lab',      name: 'Post Assignment 5: Docker & CI/CD Lab — deadline June 2',        color: 'blue',   priority: 'medium', checked: false },
    { id: 5, type: 'Office Hours',    name: 'Reply to 6 pending student consultation emails',                  color: 'rose',   priority: 'low',    checked: false },
    { id: 6, type: 'Research Grant',  name: 'Review & submit IEEE conference paper draft by May 30',           color: 'green',  priority: 'low',    checked: false },
  ]);
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));

  const PRIORITY_COLOR = { high: '#e11d48', medium: '#d97706', low: '#059669' };
  const TASK_COLOR_MAP = { orange:'#ea580c', purple:'#7c3aed', teal:'#0d9488', blue:'#3b82f6', rose:'#f43f5e', green:'#059669' };

  // ── Interactive School Notices State ──
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [schoolNotices] = useState([
    {
      id: 1,
      title: 'End-of-Semester Exam Schedule Published',
      dept: 'Registrar',
      time: 'Today, 09:00 AM',
      priority: 'urgent',
      color: '#dc2626',
      icon: '🏛️',
      desc: 'Final exams: June 9–20, 2026. Question papers due to Exam Cell by May 30 (5:00 PM). No extensions. Download timetable from Academic Portal.',
      action: 'Submit papers by May 30'
    },
    {
      id: 2,
      title: 'Grade Submission Deadline — June 25',
      dept: 'Registrar',
      time: 'Yesterday, 04:00 PM',
      priority: 'urgent',
      color: '#dc2626',
      icon: '📋',
      desc: 'All final grades must be submitted via ERP Gradebook by June 25, 11:59 PM. Late submissions require Dean approval. Contact ext. 2200 for issues.',
      action: 'Submit grades by Jun 25'
    },
    {
      id: 3,
      title: 'Faculty Professional Dev Day — May 28',
      dept: 'Academic Affairs',
      time: '2 days ago',
      priority: 'high',
      color: '#e11d48',
      icon: '🎓',
      desc: 'May 28, 9 AM–4 PM, Main Auditorium. Topics: AI Pedagogy, Inclusive Classrooms, Research Ethics. Lunch provided. RSVP by May 25.',
      action: 'Confirm attendance'
    },
    {
      id: 4,
      title: 'Campus Network Maintenance — May 24',
      dept: 'IT Department',
      time: '3 days ago',
      priority: 'high',
      color: '#6366f1',
      icon: '💻',
      desc: 'Saturday May 24, 2:00–6:00 AM. ERP Portal, Wi-Fi, email, and Library DB will be offline. Save work before maintenance window.',
      action: 'Save work by Fri night'
    },
    {
      id: 5,
      title: 'Tuition Balance Clearance — June 15',
      dept: 'Finance',
      time: '4 days ago',
      priority: 'medium',
      color: '#d97706',
      icon: '💰',
      desc: 'Students must clear balances by June 15 for Fall 2026 registration. Flag students with unpaid status and direct to Finance Office (Block A, Room 102).',
      action: 'Flag unpaid students'
    },
    {
      id: 6,
      title: 'Research Symposium — Call for Papers',
      dept: 'Academic Affairs',
      time: '5 days ago',
      priority: 'medium',
      color: '#0d9488',
      icon: '🔬',
      desc: '12th Annual Symposium on June 5, Science Complex. Submit abstracts by May 28. Keynote: Dr. Ananya Rao, MIT Media Lab. Free registration.',
      action: 'Submit abstract by May 28'
    }
  ]);

  return (
    <div className={`chaart-dashboard-card ${!hasCalendar ? 'hide-calendar' : ''}`}>

      {/* ══════════════════════════════
         LEFT SIDEBAR COLUMN
      ══════════════════════════════ */}
      <aside className="chaart-sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo */}
          <div className="chaart-logo">
            <div style={{ width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span>Univers-One</span>
          </div>

          {/* Profile Card */}
          <div className="chaart-profile-box">
            <div className="chaart-avatar-wrapper">
              {renderAvatar(displayName)}
              <div className="chaart-status-dot"></div>
            </div>
            <h4 className="chaart-profile-name">{displayName}</h4>
            <p className="chaart-profile-email">{displayEmail}</p>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: 'auto' }}>
            <ul className="chaart-nav-list" style={{ gap: '2px' }}>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
                { id: 'myclasses', label: 'My Classes', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></> },
                { id: 'attendance', label: 'Attendance', icon: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></> },
                { id: 'assignments', label: 'Assignments', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> },
                { id: 'exams', label: 'Exams & Grades', icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 10 3 12 0v-5"/></> },
                { id: 'timetable', label: 'Timetable', icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
                { id: 'announcements', label: 'Notices', icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>, badge: 3 },
                { id: 'performance', label: 'My Attendance', icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></> },
                { id: 'settings', label: 'Settings', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></> },
              ].map(item => (
                <li key={item.id} className={`chaart-nav-item ${activeMenu === item.id ? 'active' : ''}`}>
                  <button onClick={() => setActiveMenu(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                    {item.label}
                    {item.badge && <span style={{ marginLeft: 'auto', fontSize: '0.55rem', fontWeight: '800', padding: '1px 5px', borderRadius: '99px', background: 'rgba(244,63,94,.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,.25)' }}>{item.badge}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <button
            onClick={logout}
            style={{ zIndex: 2, border: 'none', background: 'rgba(30, 27, 75, 0.04)', color: '#1e1b4b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(30, 27, 75, 0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(30, 27, 75, 0.04)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════
         MAIN CENTER CONTENT
      ══════════════════════════════ */}
      <main className="chaart-main-content">

        {/* ── DASHBOARD HOME ── */}
        {isMainDashboard && (
          <>
            {/* Header */}
            <header className="chaart-header">
              <div>
                <h2 className="chaart-greeting-title">Good morning, Dr. {greetingName} 👋</h2>
                <p className="chaart-greeting-subtitle">{getDayName()}</p>
              </div>
              <div className="chaart-header-controls">
                <button className="chaart-btn-search" title="Search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
                <button className="chaart-btn-add" onClick={() => setActiveMenu('announcements')}>
                  📢 Post Announcement
                </button>
              </div>
            </header>

            {/* KPI Cards Row */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px', marginBottom: '1.5rem' }}>
              <KpiCard label="My Classes"         value="3"    sub="CS-301, CS-101, CS-202"          icon="📚" color="#7c3aed" bg="rgba(124,58,237,.1)"  border="rgba(124,58,237,.18)" />
              <KpiCard label="Total Students"     value="203"  sub="48 + 120 + 35 enrolled"          icon="👥" color="#2563eb" bg="rgba(37,99,235,.1)"   border="rgba(37,99,235,.18)" />
              <KpiCard label="Avg Attendance"     value="87%"  sub="↑ 3% from last week"             icon="✅" color="#059669" bg="rgba(5,150,105,.1)"   border="rgba(5,150,105,.18)" />
              <KpiCard label="Pending Grades"     value="34"   sub="12 overdue · 22 this week"       icon="📝" color="#d97706" bg="rgba(217,119,6,.1)"   border="rgba(217,119,6,.18)" />
              <KpiCard label="Upcoming Deadlines" value="2"    sub="Grade submission · Exam papers"  icon="⏰" color="#e11d48" bg="rgba(225,29,72,.1)"   border="rgba(225,29,72,.18)" />
            </section>

            {/* Course Cards Grid */}
            <section className="chaart-projects-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <CourseCard code="CS-301" title="Advanced Algorithms" students={48} progress={96} theme="purple" onClick={() => setActiveMenu('tasks')}
                schedule="Mon & Wed, 10:00–11:30 AM" nextClass="Wed, May 28 · Room 204" avgGrade="B+ (3.4 GPA)" />
              <CourseCard code="CS-101" title="Introduction to AI" students={120} progress={46} theme="teal" onClick={() => setActiveMenu('tasks')}
                schedule="Tue & Thu, 2:00–3:30 PM" nextClass="Thu, May 29 · Hall A" avgGrade="B (3.1 GPA)" />
              <CourseCard code="CS-202" title="Software Engineering" students={35} progress={73} theme="orange" onClick={() => setActiveMenu('tasks')}
                schedule="Mon, Wed & Fri, 9:00–10:00 AM" nextClass="Wed, May 28 · Lab 3" avgGrade="A- (3.7 GPA)" />
            </section>

            {/* Bottom Grid: Tasks + Stats */}
            <section className="chaart-bottom-grid">

              {/* Tasks Column */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 className="chaart-section-title" style={{ margin: 0 }}>Academic tasks for today</h3>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '600' }}>
                    {tasks.filter(t => t.checked).length}/{tasks.length} done
                  </span>
                </div>
                <div className="chaart-tasks-list">
                  {tasks.map(t => (
                    <div
                      key={t.id}
                      className={`chaart-task-card chaart-task-card-${t.color}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleTask(t.id)}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <h4 className="chaart-task-name" style={{ textDecoration: t.checked ? 'line-through' : 'none', opacity: t.checked ? 0.5 : 1, margin: 0 }}>
                            {t.type}
                          </h4>
                          <span style={{ fontSize: '0.58rem', fontWeight: '800', padding: '1px 5px', borderRadius: '4px', background: t.priority === 'high' ? 'rgba(225,29,72,.12)' : t.priority === 'medium' ? 'rgba(217,119,6,.12)' : 'rgba(5,150,105,.12)', color: PRIORITY_COLOR[t.priority], flexShrink: 0 }}>
                            {t.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="chaart-task-sub" style={{ textDecoration: t.checked ? 'line-through' : 'none', opacity: t.checked ? 0.5 : 1 }}>
                          {t.name}
                        </p>
                      </div>
                      <div className={`chaart-task-checkbox ${t.checked ? 'checked' : ''}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Column */}
              <div>
                <h3 className="chaart-section-title">Teaching Statistics</h3>

                <div className="chaart-stats-grid">
                  <div className="chaart-stat-box">
                    <h4 className="chaart-stat-value">3</h4>
                    <p className="chaart-stat-label">Active<br />Courses</p>
                  </div>
                  <div className="chaart-stat-box">
                    <h4 className="chaart-stat-value">142</h4>
                    <p className="chaart-stat-label">Graded<br />Papers</p>
                  </div>
                  <div className="chaart-stat-box" onClick={() => setActiveMenu('attendance')} style={{ cursor: 'pointer' }}>
                    <h4 className="chaart-stat-value">87%</h4>
                    <p className="chaart-stat-label">Avg<br />Attendance</p>
                  </div>
                  <div className="chaart-stat-box">
                    <h4 className="chaart-stat-value">4.6</h4>
                    <p className="chaart-stat-label">Student<br />Rating</p>
                  </div>
                </div>

                {/* This Week's Schedule Summary */}
                <div style={{ marginTop: '14px', background: '#fff', border: '1px solid #e8e3dc', borderRadius: '14px', padding: '14px' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.4px' }}>This Week at a Glance</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { day: 'Mon', classes: 2, hours: '3h', highlight: false },
                      { day: 'Tue', classes: 1, hours: '1.5h', highlight: true },
                      { day: 'Wed', classes: 2, hours: '3h', highlight: false },
                      { day: 'Thu', classes: 1, hours: '1.5h', highlight: false },
                      { day: 'Fri', classes: 1, hours: '1h', highlight: false },
                    ].map(d => (
                      <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '700', color: d.highlight ? '#6366f1' : '#1e1b4b', width: '30px' }}>{d.day}</span>
                        <div style={{ flex: 1, height: '6px', background: '#f0ede8', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(d.classes / 3) * 100}%`, background: d.highlight ? 'linear-gradient(90deg,#6366f1,#7c3aed)' : 'linear-gradient(90deg,#0d9488,#059669)', borderRadius: '99px' }} />
                        </div>
                        <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: '600', width: '40px', textAlign: 'right' }}>{d.classes} cls · {d.hours}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '0.65rem', color: '#64748b', fontWeight: '500' }}>Total: 7 classes · 10 teaching hours this week</p>
                </div>

                {/* Quick Actions */}
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.5px' }}>Quick Actions</h4>
                  {[
                    { label: '📋 Take Attendance',       action: 'attendance',    color: '#0d9488', bg: 'rgba(13,148,136,.08)', border: 'rgba(13,148,136,.2)' },
                    { label: '🏆 Open Gradebook',        action: 'tracking',      color: '#7c3aed', bg: 'rgba(124,58,237,.08)', border: 'rgba(124,58,237,.2)' },
                    { label: '📢 Post Announcement',     action: 'announcements', color: '#6366f1', bg: 'rgba(99,102,241,.08)', border: 'rgba(99,102,241,.2)' },
                  ].map(a => (
                    <button
                      key={a.action}
                      onClick={() => setActiveMenu(a.action)}
                      style={{ width: '100%', height: '36px', background: a.bg, border: `1px solid ${a.border}`, borderRadius: '10px', color: a.color, fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(3px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

            </section>
          </>
        )}

        {/* ── ROUTED PAGES ── */}
        {activeMenu === 'myclasses' && <Faculty />}
        {activeMenu === 'attendance' && <Attendance />}
        {activeMenu === 'assignments' && <AssignmentsPage />}
        {activeMenu === 'exams' && <Gradebook />}
        {activeMenu === 'timetable' && <Timetable />}
        {activeMenu === 'announcements' && <Announcements />}
        {activeMenu === 'performance' && <PerformancePage />}
        {activeMenu === 'settings' && <Settings />}

      </main>

      {/* ══════════════════════════════
         RIGHT CALENDAR PANEL
      ══════════════════════════════ */}
      {hasCalendar && (
        <aside className="chaart-calendar-panel">

          <div className="chaart-calendar-header">
            <h3 className="chaart-calendar-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              📢 School Notices
            </h3>
            <button className="chaart-btn-bell" onClick={() => setActiveMenu('announcements')} title="Announcements Center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div className="chaart-bell-dot"></div>
            </button>
          </div>

          {/* Semester progress mini-bar */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e3dc', padding: '12px 14px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.4px' }}>Spring 2026</span>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#7c3aed' }}>Week 14 / 18</span>
            </div>
            <div style={{ height: '5px', background: '#f0ede8', borderRadius: '99px', overflow: 'hidden', marginBottom: '5px' }}>
              <div style={{ height: '100%', width: '78%', background: 'linear-gradient(90deg,#7c3aed,#6366f1)', borderRadius: '99px' }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.62rem', color: '#94a3b8', fontWeight: '500' }}>4 weeks until semester end</p>
          </div>

          {/* Notices Feed */}
          <div className="chaart-timeline-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
            {schoolNotices.map((notice) => {
              const isExpanded = expandedNotice === notice.id;
              const priorityColors = {
                urgent: { color: '#dc2626', bg: 'rgba(220,38,38,.07)' },
                high: { color: '#e11d48', bg: 'rgba(225,29,72,.07)' },
                medium: { color: '#d97706', bg: 'rgba(217,119,6,.07)' }
              };
              const styleSet = priorityColors[notice.priority] || { color: '#6366f1', bg: 'rgba(99,102,241,.07)' };

              return (
                <div 
                  key={notice.id} 
                  onClick={() => setExpandedNotice(isExpanded ? null : notice.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #e8e3dc',
                    background: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: `4px solid ${styleSet.color}`,
                    boxShadow: '0 2px 6px rgba(30,27,75,0.02)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = styleSet.color;
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,27,75,0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e8e3dc';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(30,27,75,0.02)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: '850', textTransform: 'uppercase', color: styleSet.color, background: styleSet.bg, padding: '2px 6px', borderRadius: '4px', border: `1.2px solid ${styleSet.color}25`, letterSpacing: '0.3px' }}>
                      {notice.priority}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: '600' }}>{notice.time}</span>
                  </div>

                  <h5 style={{ margin: '4px 0', fontSize: '0.78rem', fontWeight: '800', color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.25' }}>
                    <span>{notice.icon}</span>
                    <span style={{ flex: 1 }}>{notice.title}</span>
                    <span style={{ color: '#a5a2b8', fontSize: '0.65rem', transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </h5>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#64748b', fontWeight: '700', marginTop: '2px' }}>
                    <span>Posted by:</span>
                    <span style={{ color: '#1e1b4b' }}>{notice.dept}</span>
                  </div>

                  {/* Message container */}
                  <div style={{
                    maxHeight: isExpanded ? '200px' : '0px',
                    opacity: isExpanded ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginTop: isExpanded ? '8px' : '0px',
                    borderTop: isExpanded ? '1px dashed #e8e3dc' : 'none',
                    paddingTop: isExpanded ? '8px' : '0px',
                  }}>
                    <p style={{ margin: '0 0 6px', fontSize: '0.72rem', color: '#475569', lineHeight: '1.45', fontWeight: '500' }}>
                      {notice.desc}
                    </p>
                    {notice.action && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 8px', background: styleSet.bg, borderRadius: '6px', border: `1px solid ${styleSet.color}20`, marginTop: '6px' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: '700', color: styleSet.color }}>→ {notice.action}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* View All Button */}
            <button
              onClick={() => setActiveMenu('announcements')}
              style={{
                marginTop: '6px',
                width: '100%',
                padding: '9px',
                background: 'rgba(30, 27, 75, 0.03)',
                color: '#1e1b4b',
                border: '1px solid #e8e3dc',
                borderRadius: '10px',
                fontSize: '0.74rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(30, 27, 75, 0.06)';
                e.currentTarget.style.borderColor = '#1e1b4b';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(30, 27, 75, 0.03)';
                e.currentTarget.style.borderColor = '#e8e3dc';
              }}
            >
              🌐 Open Notice Board Center
            </button>
          </div>
        </aside>
      )}

    </div>
  );
}
