import { useState } from 'react';
import { useERP } from '../context/ERPContext';

// ── Constants ─────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  { id: 'S2024-0042', name: 'Alexander Pierce',   major: 'Computer Science',        email: 'a.pierce@student.edu',    tuition: 4800, grade: 95, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0051', name: 'Sophia Martinez',    major: 'Computer Science',        email: 's.martinez@student.edu',  tuition: 4800, grade: 88, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0063', name: 'James Thornton',     major: 'Computer Science',        email: 'j.thornton@student.edu',  tuition: 4800, grade: 74, feeStatus: 'Partial', semester: 'Spring 2026' },
  { id: 'S2024-0071', name: 'Priya Nair',         major: 'Computer Science',        email: 'p.nair@student.edu',      tuition: 4800, grade: 91, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0084', name: 'Ethan Caldwell',     major: 'Computer Science',        email: 'e.caldwell@student.edu',  tuition: 4800, grade: 82, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0089', name: 'Amara Osei',         major: 'Computer Science',        email: 'a.osei@student.edu',      tuition: 4800, grade: 67, feeStatus: 'Unpaid',  semester: 'Spring 2026' },
  { id: 'S2024-0102', name: 'Lucas Bennett',      major: 'Computer Science',        email: 'l.bennett@student.edu',   tuition: 4800, grade: 78, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0118', name: 'Fatima Al-Rashid',   major: 'Computer Science',        email: 'f.alrashid@student.edu',  tuition: 4800, grade: 93, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0125', name: 'Ryan Nguyen',        major: 'Computer Science',        email: 'r.nguyen@student.edu',    tuition: 4800, grade: 85, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0137', name: 'Isabella Ferreira',  major: 'Computer Science',        email: 'i.ferreira@student.edu',  tuition: 4800, grade: 70, feeStatus: 'Partial', semester: 'Spring 2026' },
  { id: 'S2024-0201', name: 'Noah Williams',      major: 'Bio-Engineering',         email: 'n.williams@student.edu',  tuition: 5200, grade: 90, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0213', name: 'Emma Johnson',       major: 'Bio-Engineering',         email: 'e.johnson@student.edu',   tuition: 5200, grade: 76, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0228', name: 'Liam Davis',         major: 'Bio-Engineering',         email: 'l.davis@student.edu',     tuition: 5200, grade: 83, feeStatus: 'Partial', semester: 'Spring 2026' },
  { id: 'S2024-0234', name: 'Olivia Brown',       major: 'Bio-Engineering',         email: 'o.brown@student.edu',     tuition: 5200, grade: 88, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0249', name: 'Mason Wilson',       major: 'Bio-Engineering',         email: 'm.wilson@student.edu',    tuition: 5200, grade: 61, feeStatus: 'Unpaid',  semester: 'Spring 2026' },
  { id: 'S2024-0257', name: 'Charlotte Taylor',   major: 'Bio-Engineering',         email: 'c.taylor@student.edu',    tuition: 5200, grade: 95, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0301', name: 'Benjamin Jackson',   major: 'Quantum Physics',         email: 'b.jackson@student.edu',   tuition: 4500, grade: 87, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0315', name: 'Harper White',       major: 'Quantum Physics',         email: 'h.white@student.edu',     tuition: 4500, grade: 92, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0323', name: 'Evelyn Harris',      major: 'Quantum Physics',         email: 'e.harris@student.edu',    tuition: 4500, grade: 73, feeStatus: 'Partial', semester: 'Spring 2026' },
  { id: 'S2024-0338', name: 'Daniel Martin',      major: 'Quantum Physics',         email: 'd.martin@student.edu',    tuition: 4500, grade: 68, feeStatus: 'Unpaid',  semester: 'Spring 2026' },
  { id: 'S2024-0347', name: 'Mia Thompson',       major: 'Quantum Physics',         email: 'm.thompson@student.edu',  tuition: 4500, grade: 96, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0401', name: 'Aria Robinson',      major: 'Business Administration', email: 'a.robinson@student.edu',  tuition: 3800, grade: 89, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0414', name: 'Henry Lewis',        major: 'Business Administration', email: 'h.lewis@student.edu',     tuition: 3800, grade: 75, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0422', name: 'Scarlett Walker',    major: 'Business Administration', email: 's.walker@student.edu',    tuition: 3800, grade: 94, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0501', name: 'Ethan Hunt',         major: 'Information Security',    email: 'e.hunt@student.edu',      tuition: 4800, grade: 97, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0512', name: 'Brooke Sterling',    major: 'Information Security',    email: 'b.sterling@student.edu',  tuition: 4800, grade: 88, feeStatus: 'Paid',    semester: 'Spring 2026' },
];

const COURSE_MAP = {
  'Computer Science':        { code: 'CS-301', name: 'Advanced Algorithms',  color: '#6366f1', bg: 'rgba(99,102,241,0.09)',   border: 'rgba(99,102,241,0.22)'  },
  'Bio-Engineering':         { code: 'CS-101', name: 'Intro to AI',          color: '#0d9488', bg: 'rgba(13,148,136,0.09)',   border: 'rgba(13,148,136,0.22)'  },
  'Quantum Physics':         { code: 'CS-202', name: 'Software Engineering', color: '#ea580c', bg: 'rgba(234,88,12,0.09)',    border: 'rgba(234,88,12,0.22)'   },
  'Business Administration': { code: 'CS-204', name: 'Database Systems',     color: '#3b82f6', bg: 'rgba(59,130,246,0.09)',   border: 'rgba(59,130,246,0.22)'  },
  'Information Security':    { code: 'CS-305', name: 'Cybersecurity',        color: '#f43f5e', bg: 'rgba(244,63,94,0.09)',    border: 'rgba(244,63,94,0.22)'   },
};

const FEE_CFG = {
  Paid:    { label: 'Paid',    cls: 'erp-badge-success' },
  Partial: { label: 'Partial', cls: 'erp-badge-warning' },
  Unpaid:  { label: 'Unpaid',  cls: 'erp-badge-danger'  },
};

const AVATAR_PALETTE = ['#6366f1','#0d9488','#3b82f6','#ea580c','#db2777','#10b981','#d97706','#8b5cf6'];

function initials(name) { return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(); }
function avatarBg(id) {
  const n = parseInt(id.replace(/\D/g, ''), 10) || 0;
  return AVATAR_PALETTE[n % AVATAR_PALETTE.length];
}

function gradeBadge(g) {
  if (g >= 96) return { text: 'A+', cls: 'erp-badge-success' };
  if (g >= 90) return { text: 'A',  cls: 'erp-badge-success' };
  if (g >= 80) return { text: 'B',  cls: 'erp-badge-info' };
  if (g >= 70) return { text: 'C',  cls: 'erp-badge-warning' };
  return              { text: 'D',  cls: 'erp-badge-danger' };
}

// ── Student Detail Panel ──────────────────────────────────────────
function StudentDetail({ student, onClose }) {
  const course = COURSE_MAP[student.major] || { code: '—', name: student.major, color: '#94a3b8', bg: 'rgba(148,163,184,0.09)', border: 'rgba(148,163,184,0.22)' };
  const grade  = gradeBadge(student.grade);
  const fee    = FEE_CFG[student.feeStatus] || FEE_CFG.Paid;
  const bg     = avatarBg(student.id);
  const circumference = 2 * Math.PI * 38;

  return (
    <div className="erp-detail-panel" style={{ width: 320 }}>
      {/* Top Banner */}
      <div style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)`, padding: '20px 18px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 12, width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}
        >✕</button>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: 10 }}>
          {initials(student.name)}
        </div>
        <h3 style={{ margin: '0 0 2px', color: '#fff', fontSize: '1rem', fontWeight: 800 }}>{student.name}</h3>
        <p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem' }}>{student.id}</p>
        <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px', padding: '2px 8px', fontSize: '0.62rem', fontWeight: 800 }}>
          {course.code} — {course.name}
        </span>
      </div>

      {/* Details */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Email',      value: student.email || '—',                        icon: '✉️' },
            { label: 'Semester',   value: student.semester || 'Spring 2026',            icon: '📅' },
            { label: 'Tuition',    value: `$${(student.tuition || 0).toLocaleString()}`, icon: '💰' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{f.icon} {f.label}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>{f.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>🏷️ Fee Status</span>
            <span className={`erp-badge ${fee.cls}`}>{fee.label}</span>
          </div>
        </div>

        {/* Grade ring */}
        <div style={{ textAlign: 'center', padding: '18px 0 6px' }}>
          <div style={{ position: 'relative', display: 'inline-block', width: 90, height: 90 }}>
            <svg width="90" height="90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="50" cy="50" r="38" fill="none" stroke={course.color} strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * student.grade) / 100}
                strokeLinecap="round" transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.7s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text)' }}>{student.grade}%</span>
              <span style={{ fontSize: '0.52rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>GPA Score</span>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>
            Grade: <span className={`erp-badge ${grade.cls}`} style={{ marginLeft: 4 }}>{grade.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Students Component ───────────────────────────────────────
export default function Students() {
  const { students: dbStudents, addStudent, deleteStudent } = useERP();

  const allStudents = dbStudents.length > 0
    ? dbStudents.map(s => ({
        ...s,
        id: `S2024-${String(s.id).padStart(4, '0')}`,
        email: `${s.name.toLowerCase().replace(/\s/g,'.')}@student.edu`,
        feeStatus: 'Paid',
        semester: 'Spring 2026',
      }))
    : MOCK_STUDENTS;

  const [searchQuery, setSearchQuery]   = useState('');
  const [filterMajor, setFilterMajor]  = useState('All');
  const [selectedStudent, setSelected] = useState(null);
  const [showForm, setShowForm]        = useState(false);

  // Form state
  const [name, setName]       = useState('');
  const [major, setMajor]     = useState('Computer Science');
  const [tuition, setTuition] = useState('4800');
  const [grade, setGrade]     = useState('90');
  const [formMsg, setFormMsg] = useState(null);

  const showMsg = (type, text) => { setFormMsg({ type, text }); setTimeout(() => setFormMsg(null), 3500); };
  const resetForm = () => { setName(''); setTuition('4800'); setGrade('90'); setMajor('Computer Science'); };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name) { showMsg('error', 'Student name is required.'); return; }
    const t = parseFloat(tuition), g = parseInt(grade, 10);
    if (isNaN(t) || t <= 0) { showMsg('error', 'Enter a valid tuition amount.'); return; }
    if (isNaN(g) || g < 0 || g > 100) { showMsg('error', 'Grade must be 0–100.'); return; }
    const ok = await addStudent({ name, major, tuition: t, grade: g });
    if (ok) { showMsg('success', `Enrolled ${name} successfully!`); resetForm(); setShowForm(false); }
    else showMsg('error', 'Failed to save to database.');
  };

  const MAJORS = ['All', ...Object.keys(COURSE_MAP)];

  const filtered = allStudents.filter(st => {
    const q = searchQuery.toLowerCase();
    const matchQ = st.name.toLowerCase().includes(q) || (st.email || '').toLowerCase().includes(q) || st.id.toLowerCase().includes(q);
    const matchM = filterMajor === 'All' || st.major === filterMajor;
    return matchQ && matchM;
  });

  // Course stats for summary pills
  const courseStats = Object.entries(COURSE_MAP).map(([maj, meta]) => ({
    ...meta, major: maj,
    count: allStudents.filter(s => s.major === maj).length,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Header */}
      <div className="erp-page-header">
        <div>
          <h2 className="erp-page-title">Student Registry</h2>
          <p className="erp-page-subtitle">{allStudents.length} enrolled students · Spring 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="erp-input-with-icon">
            <svg className="erp-input-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="erp-input"
              placeholder="Search name, ID, email…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: 220 }}
            />
          </div>
          <button className="erp-btn erp-btn-primary" onClick={() => setShowForm(s => !s)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Enroll Student
          </button>
        </div>
      </div>

      {/* Course filter pills */}
      <div className="erp-pill-group">
        {MAJORS.map(m => {
          const meta = COURSE_MAP[m];
          const isActive = filterMajor === m;
          return (
            <button
              key={m}
              className={`erp-pill ${isActive ? 'active' : ''}`}
              onClick={() => setFilterMajor(m === filterMajor ? 'All' : m)}
              style={meta && isActive ? { color: meta.color, borderColor: meta.border, background: meta.bg } : {}}
            >
              {meta && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, display: 'inline-block', flexShrink: 0 }} />
              )}
              {meta ? `${meta.code} — ${meta.name}` : 'All Courses'}
              {meta && (
                <span style={{
                  background: isActive ? `${meta.color}18` : 'var(--surface-3)',
                  color: isActive ? meta.color : 'var(--text-muted)',
                  borderRadius: '99px', padding: '0 5px', fontSize: '0.62rem', fontWeight: 700,
                }}>
                  {allStudents.filter(s => s.major === m).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Enroll Form */}
      {showForm && (
        <div className="erp-card" style={{ animation: 'page-fade-in 0.2s ease both', border: '1px solid var(--primary-border)', background: 'rgba(99,102,241,0.02)' }}>
          <div className="erp-card-header">
            <span className="erp-card-title">📋 Enroll New Student</span>
            <button className="erp-btn erp-btn-ghost erp-btn-sm" onClick={() => setShowForm(false)}>✕ Cancel</button>
          </div>
          <div className="erp-card-body">
            <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
              <div className="erp-form-group">
                <label className="erp-label">Full Name *</label>
                <input type="text" className="erp-input" value={name} onChange={e => setName(e.target.value)} placeholder="Harrison Ford" />
              </div>
              <div className="erp-form-group">
                <label className="erp-label">Course</label>
                <select className="erp-select" value={major} onChange={e => setMajor(e.target.value)}>
                  {Object.entries(COURSE_MAP).map(([k, v]) => <option key={k} value={k}>{v.code} — {v.name}</option>)}
                </select>
              </div>
              <div className="erp-form-group">
                <label className="erp-label">Semester Tuition ($)</label>
                <input type="number" className="erp-input" value={tuition} onChange={e => setTuition(e.target.value)} min="0" />
              </div>
              <div className="erp-form-group">
                <label className="erp-label">Starting Grade (%)</label>
                <input type="number" className="erp-input" value={grade} onChange={e => setGrade(e.target.value)} min="0" max="100" />
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10, alignItems: 'center' }}>
                {formMsg && (
                  <div className={`erp-badge ${formMsg.type === 'success' ? 'erp-badge-success' : 'erp-badge-danger'}`} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    {formMsg.text}
                  </div>
                )}
                <button type="submit" className="erp-btn erp-btn-primary" style={{ marginLeft: 'auto' }}>
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table + Detail panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 320px' : '1fr', gap: 16, alignItems: 'start' }}>

        {/* Table */}
        <div className="erp-table-wrapper">
          <div style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>Enrolled Students</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {filtered.length} of {allStudents.length} shown
            </span>
          </div>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Grade</th>
                <th>Fee Status</th>
                <th className="th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}>
                  <div className="erp-empty">
                    <div className="erp-empty-icon">🔍</div>
                    <div className="erp-empty-title">No students match your search</div>
                    <div className="erp-empty-sub">Try adjusting the search or filter</div>
                  </div>
                </td></tr>
              ) : filtered.map(st => {
                const course  = COURSE_MAP[st.major] || { code: '—', name: st.major, color: '#94a3b8', bg: 'rgba(148,163,184,0.09)', border: 'rgba(148,163,184,0.22)' };
                const grade   = gradeBadge(st.grade);
                const fee     = FEE_CFG[st.feeStatus] || FEE_CFG.Paid;
                const bg      = avatarBg(st.id);
                const isSelc  = selectedStudent?.id === st.id;
                return (
                  <tr
                    key={st.id}
                    className={isSelc ? 'selected' : ''}
                    onClick={() => setSelected(isSelc ? null : st)}
                  >
                    <td>
                      <div className="erp-cell-user">
                        <div className="erp-avatar" style={{ background: bg }}>
                          {initials(st.name)}
                        </div>
                        <div>
                          <div className="erp-cell-name">{st.name}</div>
                          <div className="erp-cell-sub">{st.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="erp-badge erp-badge-square" style={{ color: course.color, background: course.bg, border: `1px solid ${course.border}` }}>
                        {course.code}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className={`erp-badge ${grade.cls}`}>{grade.text}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>{st.grade}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`erp-badge ${fee.cls}`}>{fee.label}</span>
                    </td>
                    <td className="td-right" onClick={e => e.stopPropagation()}>
                      <button
                        className="erp-btn erp-btn-danger erp-btn-sm"
                        onClick={() => deleteStudent(st.id, st.name)}
                      >
                        Drop
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selectedStudent && (
          <StudentDetail student={selectedStudent} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}
