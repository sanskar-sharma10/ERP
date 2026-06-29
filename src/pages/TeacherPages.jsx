import { useState } from 'react';

/* ─── Shared Page Header Component ─── */
function PageHeader({ title, highlight, description, children }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #faf9f6 0%, #f5f3ef 100%)', borderRadius: '20px', padding: '2rem 2.2rem', marginBottom: '1.5rem', border: '1px solid #e8e3dc' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '1.5rem', fontWeight: '800', color: '#1e1b4b', lineHeight: '1.3' }}>
        {title} {highlight && <span style={{ color: '#7c3aed' }}>{highlight}</span>}
      </h2>
      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: '1.6', maxWidth: '600px' }}>{description}</p>
      {children}
    </div>
  );
}

/* ─── Shared Stat Card ─── */
function StatCard({ label, value, sub, icon, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e3dc', borderRadius: '16px', padding: '1.1rem 1.3rem', flex: 1, minWidth: '140px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.6rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.6px', color: '#64748b' }}>{label}</span>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      </div>
      <p style={{ margin: '0 0 3px', fontSize: '1.6rem', fontWeight: '800', color: color || '#1e1b4b', lineHeight: '1' }}>{value}</p>
      <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8', fontWeight: '500' }}>{sub}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ASSIGNMENTS PAGE
═══════════════════════════════════════════ */
export function AssignmentsPage() {
  const [tab, setTab] = useState('all');
  const [assignments] = useState([
    { id: 1, title: 'Assignment 4: Binary Search Trees', course: 'CS-301', dueDate: '2026-05-22', submissions: 42, total: 48, status: 'grading', marks: 25 },
    { id: 2, title: 'Lab 3: Neural Network Basics', course: 'CS-101', dueDate: '2026-05-25', submissions: 98, total: 120, status: 'open', marks: 20 },
    { id: 3, title: 'Assignment 5: Docker & CI/CD Pipeline', course: 'CS-202', dueDate: '2026-06-02', submissions: 0, total: 35, status: 'draft', marks: 30 },
    { id: 4, title: 'Assignment 3: Sorting Algorithms Analysis', course: 'CS-301', dueDate: '2026-05-15', submissions: 48, total: 48, status: 'graded', marks: 25 },
    { id: 5, title: 'Lab 2: Data Preprocessing with Pandas', course: 'CS-101', dueDate: '2026-05-18', submissions: 115, total: 120, status: 'graded', marks: 15 },
    { id: 6, title: 'Mini Project: REST API Design', course: 'CS-202', dueDate: '2026-05-20', submissions: 33, total: 35, status: 'grading', marks: 40 },
  ]);

  const statusCfg = {
    open: { color: '#059669', bg: 'rgba(5,150,105,.08)', border: 'rgba(5,150,105,.18)', label: 'Open' },
    grading: { color: '#d97706', bg: 'rgba(217,119,6,.08)', border: 'rgba(217,119,6,.18)', label: 'Grading' },
    graded: { color: '#6366f1', bg: 'rgba(99,102,241,.08)', border: 'rgba(99,102,241,.18)', label: 'Graded' },
    draft: { color: '#64748b', bg: 'rgba(100,116,139,.08)', border: 'rgba(100,116,139,.15)', label: 'Draft' },
  };

  const filtered = tab === 'all' ? assignments : assignments.filter(a => a.status === tab);

  return (
    <div className="main-panel">
      <PageHeader
        title="Assignments &"
        highlight="Evaluations"
        description="Create assignments, track submissions, and evaluate student work across all your courses. Monitor deadlines and grading progress."
      />

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <StatCard label="Total Assignments" value={assignments.length} sub="Across 3 courses" icon="📋" color="#6366f1" />
        <StatCard label="Pending Grading" value={assignments.filter(a => a.status === 'grading').length} sub="Need evaluation" icon="✏️" color="#d97706" />
        <StatCard label="Submissions" value={assignments.reduce((s, a) => s + a.submissions, 0)} sub="Total received" icon="📥" color="#059669" />
        <StatCard label="Avg Completion" value={Math.round(assignments.filter(a => a.status !== 'draft').reduce((s, a) => s + (a.submissions / a.total) * 100, 0) / assignments.filter(a => a.status !== 'draft').length) + '%'} sub="Submission rate" icon="📊" color="#7c3aed" />
      </div>

      {/* Tab filter + Create button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', background: '#eeeae3', borderRadius: '10px', padding: '3px', gap: '2px' }}>
          {[{ id: 'all', label: 'All' }, { id: 'open', label: 'Open' }, { id: 'grading', label: 'Grading' }, { id: 'graded', label: 'Graded' }, { id: 'draft', label: 'Drafts' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '6px 14px', border: 'none', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1e1b4b' : '#64748b', boxShadow: tab === t.id ? '0 1px 4px rgba(30,27,75,.08)' : 'none' }}>
              {t.label}
            </button>
          ))}
        </div>
        <button style={{ height: '38px', padding: '0 18px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(99,102,241,.25)' }}>+ Create Assignment</button>
      </div>

      {/* Assignment list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(a => {
          const s = statusCfg[a.status];
          const pct = a.total > 0 ? Math.round((a.submissions / a.total) * 100) : 0;
          return (
            <div key={a.id} style={{ background: '#fff', border: '1px solid #e8e3dc', borderRadius: '16px', padding: '1.1rem 1.3rem', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(30,27,75,.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#1e1b4b' }}>{a.title}</h4>
                  <span style={{ fontSize: '0.58rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.7rem', color: '#64748b' }}>
                  <span style={{ fontWeight: '600' }}>{a.course}</span>
                  <span>·</span>
                  <span>Due: {a.dueDate}</span>
                  <span>·</span>
                  <span>Max Marks: {a.marks}</span>
                </div>
              </div>
              {/* Progress */}
              <div style={{ width: '120px', textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px', fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>{a.submissions}/{a.total} submitted</p>
                <div style={{ height: '5px', background: '#f0ede8', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#059669' : '#6366f1', borderRadius: '99px', transition: 'width .4s' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PERFORMANCE ANALYTICS PAGE
═══════════════════════════════════════════ */
export function PerformancePage() {
  const [courseFilter, setCourseFilter] = useState('all');
  const [students] = useState([
    { id: 1, name: 'Alexander Pierce', course: 'CS-301', grade: 95, attendance: 96, assignments: '5/5', trend: 'up' },
    { id: 2, name: 'Brooke Sterling', course: 'CS-101', grade: 72, attendance: 68, assignments: '3/5', trend: 'down' },
    { id: 3, name: 'Charles Vance', course: 'CS-301', grade: 92, attendance: 91, assignments: '5/5', trend: 'stable' },
    { id: 4, name: 'Danielle Miller', course: 'CS-202', grade: 65, attendance: 55, assignments: '2/5', trend: 'down' },
    { id: 5, name: 'Ethan Hunt', course: 'CS-301', grade: 97, attendance: 100, assignments: '5/5', trend: 'up' },
    { id: 6, name: 'Fiona Walsh', course: 'CS-101', grade: 58, attendance: 45, assignments: '1/5', trend: 'down' },
    { id: 7, name: 'George Kim', course: 'CS-202', grade: 84, attendance: 88, assignments: '4/5', trend: 'up' },
    { id: 8, name: 'Hannah Lee', course: 'CS-101', grade: 91, attendance: 94, assignments: '5/5', trend: 'stable' },
  ]);

  const trendIcon = { up: '📈', down: '📉', stable: '➡️' };
  const filtered = courseFilter === 'all' ? students : students.filter(s => s.course === courseFilter);
  const atRisk = students.filter(s => s.grade < 70 || s.attendance < 60);
  const avgGrade = Math.round(students.reduce((s, st) => s + st.grade, 0) / students.length);
  const avgAttendance = Math.round(students.reduce((s, st) => s + st.attendance, 0) / students.length);

  return (
    <div className="main-panel">
      <PageHeader
        title="My"
        highlight="Attendance"
        description="View your teaching attendance records, class sessions conducted, and leave history. Track your presence across all scheduled classes this semester."
      />

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <StatCard label="Classes Conducted" value="56" sub="Out of 62 scheduled" icon="📚" color="#6366f1" />
        <StatCard label="Attendance Rate" value="90%" sub="This semester" icon="✅" color="#059669" />
        <StatCard label="Leaves Taken" value="4" sub="2 casual · 1 sick · 1 academic" icon="📋" color="#d97706" />
        <StatCard label="Remaining Leaves" value="18" sub="Out of 22 total" icon="📅" color="#7c3aed" />
      </div>

      {/* Monthly attendance record */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', background: '#eeeae3', borderRadius: '10px', padding: '3px', gap: '2px' }}>
          {[{ id: 'all', label: 'All Courses' }, { id: 'CS-301', label: 'CS-301' }, { id: 'CS-101', label: 'CS-101' }, { id: 'CS-202', label: 'CS-202' }].map(t => (
            <button key={t.id} onClick={() => setCourseFilter(t.id)}
              style={{ padding: '6px 14px', border: 'none', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: courseFilter === t.id ? '#fff' : 'transparent', color: courseFilter === t.id ? '#1e1b4b' : '#64748b', boxShadow: courseFilter === t.id ? '0 1px 4px rgba(30,27,75,.08)' : 'none' }}>
              {t.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>May 2026</span>
      </div>

      {/* Attendance Table */}
      <div style={{ background: '#fff', border: '1px solid #e8e3dc', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#faf9f6' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '.4px' }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '.4px' }}>Course</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '.4px' }}>Time</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '.4px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '.4px' }}>Students Present</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: 'Mon, May 26', course: 'CS-301', time: '10:00 – 11:30 AM', status: 'conducted', present: '46/48' },
              { date: 'Mon, May 26', course: 'CS-202', time: '2:00 – 3:30 PM', status: 'conducted', present: '33/35' },
              { date: 'Fri, May 23', course: 'CS-204', time: '1:00 – 4:00 PM', status: 'conducted', present: '38/41' },
              { date: 'Thu, May 22', course: 'CS-101', time: '10:00 – 11:30 AM', status: 'conducted', present: '112/120' },
              { date: 'Wed, May 21', course: 'CS-301', time: '10:00 – 11:30 AM', status: 'conducted', present: '45/48' },
              { date: 'Wed, May 21', course: 'CS-202', time: '2:00 – 3:30 PM', status: 'cancelled', present: '—' },
              { date: 'Tue, May 20', course: 'CS-101', time: '10:00 – 11:30 AM', status: 'conducted', present: '118/120' },
              { date: 'Mon, May 19', course: 'CS-301', time: '10:00 – 11:30 AM', status: 'leave', present: '—' },
              { date: 'Mon, May 19', course: 'CS-202', time: '2:00 – 3:30 PM', status: 'leave', present: '—' },
            ].filter(r => courseFilter === 'all' || r.course === courseFilter).map((r, i) => {
              const statusCfg = {
                conducted: { color: '#059669', bg: 'rgba(5,150,105,.08)', label: 'Conducted' },
                cancelled: { color: '#d97706', bg: 'rgba(217,119,6,.08)', label: 'Cancelled' },
                leave: { color: '#e11d48', bg: 'rgba(225,29,72,.08)', label: 'On Leave' },
              };
              const s = statusCfg[r.status];
              return (
                <tr key={i} style={{ borderTop: '1px solid #f0ede8', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#faf9f6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e1b4b' }}>{r.date}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontWeight: '600' }}>{r.course}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontWeight: '500' }}>{r.time}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '3px 9px', borderRadius: '6px', background: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: r.present === '—' ? '#94a3b8' : '#1e1b4b' }}>{r.present}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
