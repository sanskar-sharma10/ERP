import { useState } from 'react';
import { useERP } from '../context/ERPContext';

const C = {
  bg: '#f7f6f3', card: '#ffffff', bd: '#e8e3dc',
  h: '#1e1b4b', sub: '#64748b', lab: '#6b7280', val: '#1e293b',
  shadow: '0 1px 8px rgba(30,27,75,.07)',
};

// Extended mock students dataset
const MOCK_STUDENTS = [
  { id: 'S2024-0042', name: 'Alexander Pierce',   major: 'Computer Science',       email: 'a.pierce@student.edu',       tuition: 4800, grade: 95, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0051', name: 'Sophia Martinez',    major: 'Computer Science',       email: 's.martinez@student.edu',     tuition: 4800, grade: 88, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0063', name: 'James Thornton',     major: 'Computer Science',       email: 'j.thornton@student.edu',     tuition: 4800, grade: 74, feeStatus: 'Partial', semester: 'Spring 2026' },
  { id: 'S2024-0071', name: 'Priya Nair',         major: 'Computer Science',       email: 'p.nair@student.edu',         tuition: 4800, grade: 91, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0084', name: 'Ethan Caldwell',     major: 'Computer Science',       email: 'e.caldwell@student.edu',     tuition: 4800, grade: 82, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0089', name: 'Amara Osei',         major: 'Computer Science',       email: 'a.osei@student.edu',         tuition: 4800, grade: 67, feeStatus: 'Unpaid',  semester: 'Spring 2026' },
  { id: 'S2024-0102', name: 'Lucas Bennett',      major: 'Computer Science',       email: 'l.bennett@student.edu',      tuition: 4800, grade: 78, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0118', name: 'Fatima Al-Rashid',  major: 'Computer Science',       email: 'f.alrashid@student.edu',     tuition: 4800, grade: 93, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0125', name: 'Ryan Nguyen',        major: 'Computer Science',       email: 'r.nguyen@student.edu',       tuition: 4800, grade: 85, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0137', name: 'Isabella Ferreira',  major: 'Computer Science',       email: 'i.ferreira@student.edu',     tuition: 4800, grade: 70, feeStatus: 'Partial', semester: 'Spring 2026' },
  { id: 'S2024-0201', name: 'Noah Williams',      major: 'Bio-Engineering',        email: 'n.williams@student.edu',     tuition: 5200, grade: 90, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0213', name: 'Emma Johnson',       major: 'Bio-Engineering',        email: 'e.johnson@student.edu',      tuition: 5200, grade: 76, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0228', name: 'Liam Davis',         major: 'Bio-Engineering',        email: 'l.davis@student.edu',        tuition: 5200, grade: 83, feeStatus: 'Partial', semester: 'Spring 2026' },
  { id: 'S2024-0234', name: 'Olivia Brown',       major: 'Bio-Engineering',        email: 'o.brown@student.edu',        tuition: 5200, grade: 88, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0249', name: 'Mason Wilson',       major: 'Bio-Engineering',        email: 'm.wilson@student.edu',       tuition: 5200, grade: 61, feeStatus: 'Unpaid',  semester: 'Spring 2026' },
  { id: 'S2024-0257', name: 'Charlotte Taylor',   major: 'Bio-Engineering',        email: 'c.taylor@student.edu',       tuition: 5200, grade: 95, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0263', name: 'Elijah Anderson',    major: 'Bio-Engineering',        email: 'e.anderson@student.edu',     tuition: 5200, grade: 79, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0271', name: 'Ava Thomas',         major: 'Bio-Engineering',        email: 'a.thomas@student.edu',       tuition: 5200, grade: 84, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0301', name: 'Benjamin Jackson',   major: 'Quantum Physics',        email: 'b.jackson@student.edu',      tuition: 4500, grade: 87, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0315', name: 'Harper White',       major: 'Quantum Physics',        email: 'h.white@student.edu',        tuition: 4500, grade: 92, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0323', name: 'Evelyn Harris',      major: 'Quantum Physics',        email: 'e.harris@student.edu',       tuition: 4500, grade: 73, feeStatus: 'Partial', semester: 'Spring 2026' },
  { id: 'S2024-0338', name: 'Daniel Martin',      major: 'Quantum Physics',        email: 'd.martin@student.edu',       tuition: 4500, grade: 68, feeStatus: 'Unpaid',  semester: 'Spring 2026' },
  { id: 'S2024-0347', name: 'Mia Thompson',       major: 'Quantum Physics',        email: 'm.thompson@student.edu',     tuition: 4500, grade: 96, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0356', name: 'Sebastian Garcia',   major: 'Quantum Physics',        email: 's.garcia@student.edu',       tuition: 4500, grade: 80, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0401', name: 'Aria Robinson',      major: 'Business Administration',email: 'a.robinson@student.edu',     tuition: 3800, grade: 89, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0414', name: 'Henry Lewis',        major: 'Business Administration',email: 'h.lewis@student.edu',        tuition: 3800, grade: 75, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0422', name: 'Scarlett Walker',    major: 'Business Administration',email: 's.walker@student.edu',       tuition: 3800, grade: 94, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0431', name: 'Jack Hall',          major: 'Business Administration',email: 'j.hall@student.edu',         tuition: 3800, grade: 66, feeStatus: 'Partial', semester: 'Spring 2026' },
  { id: 'S2024-0447', name: 'Camila Young',       major: 'Business Administration',email: 'c.young@student.edu',        tuition: 3800, grade: 83, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0501', name: 'Ethan Hunt',         major: 'Information Security',   email: 'e.hunt@student.edu',         tuition: 4800, grade: 97, feeStatus: 'Paid',    semester: 'Spring 2026' },
  { id: 'S2024-0512', name: 'Brooke Sterling',    major: 'Information Security',   email: 'b.sterling@student.edu',     tuition: 4800, grade: 88, feeStatus: 'Paid',    semester: 'Spring 2026' },
];

const COURSE_MAP = {
  'Computer Science':        { code: 'CS-301', name: 'Advanced Algorithms',  dot: '#7c3aed', bg: 'rgba(124,58,237,.09)', border: 'rgba(124,58,237,.2)' },
  'Bio-Engineering':         { code: 'CS-101', name: 'Intro to AI',          dot: '#0d9488', bg: 'rgba(13,148,136,.09)', border: 'rgba(13,148,136,.2)' },
  'Quantum Physics':         { code: 'CS-202', name: 'Software Engineering', dot: '#ea580c', bg: 'rgba(234,88,12,.09)',  border: 'rgba(234,88,12,.2)'  },
  'Business Administration': { code: 'CS-204', name: 'Database Systems',     dot: '#3b82f6', bg: 'rgba(59,130,246,.09)', border: 'rgba(59,130,246,.2)' },
  'Information Security':    { code: 'CS-305', name: 'Cybersecurity',        dot: '#f43f5e', bg: 'rgba(244,63,94,.09)',  border: 'rgba(244,63,94,.2)'  },
};

const FEE_CFG = {
  Paid:    { color: '#059669', bg: 'rgba(5,150,105,.09)',   border: 'rgba(5,150,105,.22)'   },
  Partial: { color: '#d97706', bg: 'rgba(217,119,6,.09)',   border: 'rgba(217,119,6,.22)'   },
  Unpaid:  { color: '#e11d48', bg: 'rgba(225,29,72,.09)',   border: 'rgba(225,29,72,.22)'   },
};

function getGradeBadge(g) {
  if (g >= 96) return { text: 'A+', color: '#059669', bg: 'rgba(5,150,105,.1)' };
  if (g >= 90) return { text: 'A',  color: '#0d9488', bg: 'rgba(13,148,136,.1)' };
  if (g >= 80) return { text: 'B',  color: '#2563eb', bg: 'rgba(37,99,235,.1)' };
  if (g >= 70) return { text: 'C',  color: '#d97706', bg: 'rgba(217,119,6,.1)' };
  return               { text: 'D',  color: '#e11d48', bg: 'rgba(225,29,72,.1)' };
}

function initials(name) { return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(); }
const AVATAR_COLORS = ['#7c3aed','#0d9488','#2563eb','#ea580c','#db2777','#059669','#d97706','#6366f1'];
function avatarColor(id) {
  const n = parseInt(id.replace(/\D/g, ''), 10) || 0;
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export default function Students() {
  const { students: dbStudents, addStudent, deleteStudent, connectionStatus } = useERP();

  // Merge DB + mock
  const allStudents = dbStudents.length > 0 ? dbStudents.map(s => ({
    ...s,
    id: `S2024-${String(s.id).padStart(4, '0')}`,
    email: `${s.name.toLowerCase().replace(/\s/g,'.')}@student.edu`,
    feeStatus: 'Paid',
    semester: 'Spring 2026',
  })) : MOCK_STUDENTS;

  const [searchQuery, setSearchQuery]     = useState('');
  const [filterCourse, setFilterCourse]   = useState('All');
  const [selectedStudent, setSelected]    = useState(null);
  const [showForm, setShowForm]           = useState(false);

  // Form state
  const [name, setName]     = useState('');
  const [major, setMajor]   = useState('Computer Science');
  const [tuition, setTuition] = useState('4800');
  const [grade, setGrade]   = useState('90');
  const [formMsg, setFormMsg] = useState(null);

  const resetForm = () => { setName(''); setTuition('4800'); setGrade('90'); setMajor('Computer Science'); };
  const showMsg = (type, text) => { setFormMsg({ type, text }); setTimeout(() => setFormMsg(null), 3500); };

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

  const FILTER_TABS = ['All', ...Object.keys(COURSE_MAP)];

  const filtered = allStudents.filter(st => {
    const q = searchQuery.toLowerCase();
    const matchQ = st.name.toLowerCase().includes(q) || (st.email || '').toLowerCase().includes(q) || st.id.toLowerCase().includes(q);
    const matchC = filterCourse === 'All' || st.major === filterCourse;
    return matchQ && matchC;
  });

  const courseStats = Object.entries(COURSE_MAP).map(([major, meta]) => ({
    ...meta, major,
    count: allStudents.filter(s => s.major === major).length,
  }));

  return (
    <div className="main-panel">
      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ margin: '0 0 3px', fontSize: '1.5rem', fontWeight: '800', color: C.h }}>Student Registry</h2>
          <p style={{ margin: 0, fontSize: '0.78rem', color: C.sub }}>{allStudents.length} enrolled students · Spring 2026</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: .45 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.h} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search name, ID, email…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', paddingRight: '12px', height: '38px', border: `1px solid ${C.bd}`, borderRadius: '10px', fontSize: '0.8rem', fontFamily: 'inherit', color: C.h, background: '#fff', outline: 'none', width: '220px' }}
            />
          </div>
          <button onClick={() => setShowForm(s => !s)} style={{ height: '38px', padding: '0 16px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(99,102,241,.3)', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Enroll Student
          </button>
        </div>
      </div>

      {/* Course summary pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {courseStats.map(cs => (
          <button key={cs.major} onClick={() => setFilterCourse(filterCourse === cs.major ? 'All' : cs.major)}
            style={{ padding: '5px 12px', border: `1px solid ${filterCourse === cs.major ? cs.border : C.bd}`, borderRadius: '8px', background: filterCourse === cs.major ? cs.bg : '#fff', color: filterCourse === cs.major ? cs.dot : C.sub, fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cs.dot, display: 'inline-block', flexShrink: 0 }} />
            {cs.code} — {cs.name}
            <span style={{ background: filterCourse === cs.major ? `${cs.dot}20` : '#f0ede8', color: filterCourse === cs.major ? cs.dot : C.lab, borderRadius: '99px', padding: '0 6px', fontWeight: '700', fontSize: '0.65rem' }}>{cs.count}</span>
          </button>
        ))}
        {filterCourse !== 'All' && (
          <button onClick={() => setFilterCourse('All')} style={{ padding: '5px 10px', border: `1px solid ${C.bd}`, borderRadius: '8px', background: '#fff', color: C.sub, fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>✕ Clear</button>
        )}
      </div>

      {/* Enroll Form (expandable) */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid rgba(99,102,241,.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 4px 20px rgba(99,102,241,.08)', animation: 'fadeUp .2s ease-out both' }}>
          <h3 style={{ margin: '0 0 1.1rem', fontSize: '0.95rem', fontWeight: '800', color: C.h }}>📋 Enroll New Student</h3>
          <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Full Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Harrison Ford" style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.82rem', fontFamily: 'inherit', color: C.h, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Course</label>
              <select value={major} onChange={e => setMajor(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.82rem', fontFamily: 'inherit', color: C.h, background: '#fff', boxSizing: 'border-box' }}>
                {Object.entries(COURSE_MAP).map(([k, v]) => <option key={k} value={k}>{v.code} — {v.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Semester Tuition ($)</label>
              <input type="number" value={tuition} onChange={e => setTuition(e.target.value)} min="0" style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.82rem', fontFamily: 'inherit', color: C.h, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Starting Grade (%)</label>
              <input type="number" value={grade} onChange={e => setGrade(e.target.value)} min="0" max="100" style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.82rem', fontFamily: 'inherit', color: C.h, boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              {formMsg && <div style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600', background: formMsg.type === 'success' ? 'rgba(5,150,105,.08)' : 'rgba(225,29,72,.08)', color: formMsg.type === 'success' ? '#059669' : '#e11d48', border: `1px solid ${formMsg.type === 'success' ? 'rgba(5,150,105,.2)' : 'rgba(225,29,72,.2)'}` }}>{formMsg.text}</div>}
              <button type="submit" style={{ height: '40px', padding: '0 20px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>Enroll Student</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ height: '40px', padding: '0 16px', border: `1px solid ${C.bd}`, borderRadius: '10px', background: '#fff', color: C.sub, fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Main layout: table + optional detail panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 340px' : '1fr', gap: '1.25rem', alignItems: 'start' }}>

        {/* Table */}
        <div style={{ background: C.card, border: `1px solid ${C.bd}`, borderRadius: '16px', overflow: 'hidden', boxShadow: C.shadow }}>
          <div style={{ padding: '.85rem 1.25rem', borderBottom: `1px solid ${C.bd}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafaf8' }}>
            <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: '800', color: C.h }}>Enrolled Students</h3>
            <span style={{ fontSize: '0.7rem', color: C.sub, fontWeight: '600' }}>{filtered.length} of {allStudents.length} students</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#fafaf8' }}>
                  {['Student', 'Course', 'Grade', 'Tuition Status', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '.7rem 1rem', textAlign: i >= 4 ? 'right' : 'left', fontSize: '0.62rem', fontWeight: '800', color: C.sub, textTransform: 'uppercase', letterSpacing: '.5px', borderBottom: `1px solid ${C.bd}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: C.sub, fontSize: '0.85rem' }}>No students match your search.</td></tr>
                ) : filtered.map((st, i) => {
                  const course = COURSE_MAP[st.major] || { code: '—', name: st.major, dot: '#94a3b8', bg: 'rgba(148,163,184,.08)', border: 'rgba(148,163,184,.2)' };
                  const grade  = getGradeBadge(st.grade);
                  const fee    = FEE_CFG[st.feeStatus] || FEE_CFG.Paid;
                  const ac     = avatarColor(st.id);
                  const isSelected = selectedStudent?.id === st.id;
                  return (
                    <tr
                      key={st.id}
                      onClick={() => setSelected(isSelected ? null : st)}
                      style={{ background: isSelected ? 'rgba(99,102,241,.04)' : i % 2 === 0 ? '#fff' : '#fafaf8', cursor: 'pointer', transition: 'background .15s', borderBottom: `1px solid ${C.bd}` }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f5f3ef'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafaf8'; }}
                    >
                      {/* Student */}
                      <td style={{ padding: '.7rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 2px 6px ${ac}44` }}>
                            <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: '800' }}>{initials(st.name)}</span>
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: C.h, lineHeight: '1.2' }}>{st.name}</div>
                            <div style={{ fontSize: '0.65rem', color: C.sub }}>{st.id}</div>
                          </div>
                        </div>
                      </td>
                      {/* Course */}
                      <td style={{ padding: '.7rem 1rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '2px 9px', borderRadius: '6px', background: course.bg, color: course.dot, border: `1px solid ${course.border}`, whiteSpace: 'nowrap' }}>{course.code}</span>
                      </td>
                      {/* Grade */}
                      <td style={{ padding: '.7rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '2px 6px', borderRadius: '5px', background: grade.bg, color: grade.color }}>{grade.text}</span>
                          <span style={{ fontWeight: '700', fontSize: '0.82rem', color: C.h }}>{st.grade}%</span>
                        </div>
                      </td>
                      {/* Fee Status */}
                      <td style={{ padding: '.7rem 1rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '2px 9px', borderRadius: '20px', background: fee.bg, color: fee.color, border: `1px solid ${fee.border}` }}>{st.feeStatus}</span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '.7rem 1rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => deleteStudent(st.id, st.name)}
                          style={{ padding: '4px 10px', border: '1px solid rgba(225,29,72,.25)', borderRadius: '7px', background: 'rgba(225,29,72,.06)', color: '#e11d48', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(225,29,72,.12)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(225,29,72,.06)'}
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
        </div>

        {/* Student Detail Drawer */}
        {selectedStudent && (() => {
          const course = COURSE_MAP[selectedStudent.major] || { code: '—', name: selectedStudent.major, dot: '#94a3b8', bg: 'rgba(148,163,184,.08)', border: 'rgba(148,163,184,.2)', grad: 'linear-gradient(135deg,#94a3b8,#64748b)' };
          const grade  = getGradeBadge(selectedStudent.grade);
          const fee    = FEE_CFG[selectedStudent.feeStatus] || FEE_CFG.Paid;
          const ac     = avatarColor(selectedStudent.id);
          return (
            <div style={{ background: C.card, border: `1px solid ${C.bd}`, borderRadius: '16px', overflow: 'hidden', boxShadow: C.shadow, animation: 'slideIn .25s cubic-bezier(.16,1,.3,1) both', position: 'sticky', top: '1rem' }}>
              {/* Top banner */}
              <div style={{ background: `linear-gradient(135deg,${course.dot},${course.dot}cc)`, padding: '1.25rem', position: 'relative' }}>
                <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '12px', right: '12px', width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800' }}>✕</button>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,.25)', border: '2px solid rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>
                  {initials(selectedStudent.name)}
                </div>
                <h3 style={{ margin: '0 0 2px', color: '#fff', fontSize: '1rem', fontWeight: '800' }}>{selectedStudent.name}</h3>
                <p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,.8)', fontSize: '0.72rem' }}>{selectedStudent.id}</p>
                <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', borderRadius: '6px', padding: '2px 9px', fontSize: '0.62rem', fontWeight: '800' }}>{course.code} — {course.name}</span>
              </div>
              {/* Details */}
              <div style={{ padding: '1.1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Email', value: selectedStudent.email || '—', icon: '✉️' },
                    { label: 'Semester', value: selectedStudent.semester || 'Spring 2026', icon: '📅' },
                    { label: 'Tuition', value: `$${(selectedStudent.tuition || 0).toLocaleString()}`, icon: '💰' },
                    { label: 'Fee Status', value: selectedStudent.feeStatus || 'Paid', icon: '🏷️', badge: true },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#fafaf8', borderRadius: '9px', border: `1px solid ${C.bd}` }}>
                      <span style={{ fontSize: '0.72rem', color: C.sub, fontWeight: '600' }}>{f.icon} {f.label}</span>
                      {f.badge ? (
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '2px 8px', borderRadius: '20px', background: (FEE_CFG[f.value] || FEE_CFG.Paid).bg, color: (FEE_CFG[f.value] || FEE_CFG.Paid).color, border: `1px solid ${(FEE_CFG[f.value] || FEE_CFG.Paid).border}` }}>{f.value}</span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: C.h }}>{f.value}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Grade ring */}
                <div style={{ textAlign: 'center', padding: '1.1rem 0 .5rem' }}>
                  <div style={{ position: 'relative', display: 'inline-block', width: '90px', height: '90px' }}>
                    <svg width="90" height="90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#f0ede8" strokeWidth="8" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke={course.dot} strokeWidth="8"
                        strokeDasharray="238.76"
                        strokeDashoffset={238.76 - (238.76 * selectedStudent.grade) / 100}
                        strokeLinecap="round" transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset .6s ease' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '900', color: C.h }}>{selectedStudent.grade}%</span>
                      <span style={{ fontSize: '0.55rem', fontWeight: '700', color: C.sub, textTransform: 'uppercase' }}>GPA</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', color: C.sub, marginTop: '4px' }}>
                    Grade: <span style={{ fontWeight: '800', color: grade.color }}>{grade.text}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
