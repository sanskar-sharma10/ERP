import { useState, useEffect, useMemo } from 'react';
import { useERP } from '../context/ERPContext';

/* ── Course master data ── */
const COURSES = [
  { id:'CS-301', title:'Advanced Algorithms',  code:'CS-301', schedule:'Mon, Wed', time:'10:00 – 11:30 AM', room:'Room 402', credits:3, majorKey:'Computer Science',       defaultCount:48 },
  { id:'CS-101', title:'Introduction to AI',    code:'CS-101', schedule:'Tue, Thu', time:'10:00 – 11:30 AM', room:'Room 105', credits:3, majorKey:'Bio-Engineering',        defaultCount:34 },
  { id:'CS-202', title:'Software Engineering',  code:'CS-202', schedule:'Mon, Wed', time:'2:00 – 3:30 PM',   room:'Room 203', credits:4, majorKey:'Quantum Physics',        defaultCount:27 },
  { id:'CS-204', title:'Database Systems',      code:'CS-204', schedule:'Fri',      time:'1:00 – 4:00 PM',   room:'Room 301', credits:3, majorKey:'Business Administration',defaultCount:41 },
];

const MOCK_STUDENTS = {
  'CS-301': [
    { id:101, name:'Alexander Pierce',  grade:95 }, { id:102, name:'Sophia Martinez',  grade:88 },
    { id:103, name:'James Thornton',    grade:74 }, { id:104, name:'Priya Nair',        grade:91 },
    { id:105, name:'Ethan Caldwell',    grade:82 }, { id:106, name:'Amara Osei',        grade:67 },
    { id:107, name:'Lucas Bennett',     grade:78 }, { id:108, name:'Fatima Al-Rashid', grade:93 },
    { id:109, name:'Ryan Nguyen',       grade:85 }, { id:110, name:'Isabella Ferreira',grade:70 },
  ],
  'CS-101': [
    { id:201, name:'Noah Williams',     grade:90 }, { id:202, name:'Emma Johnson',      grade:76 },
    { id:203, name:'Liam Davis',        grade:83 }, { id:204, name:'Olivia Brown',      grade:88 },
    { id:205, name:'Mason Wilson',      grade:61 }, { id:206, name:'Charlotte Taylor',  grade:95 },
    { id:207, name:'Elijah Anderson',   grade:79 }, { id:208, name:'Ava Thomas',        grade:84 },
  ],
  'CS-202': [
    { id:301, name:'Benjamin Jackson',  grade:87 }, { id:302, name:'Harper White',      grade:92 },
    { id:303, name:'Evelyn Harris',     grade:73 }, { id:304, name:'Daniel Martin',     grade:68 },
    { id:305, name:'Mia Thompson',      grade:96 }, { id:306, name:'Sebastian Garcia',  grade:80 },
  ],
  'CS-204': [
    { id:401, name:'Aria Robinson',     grade:89 }, { id:402, name:'Henry Lewis',       grade:75 },
    { id:403, name:'Scarlett Walker',   grade:94 }, { id:404, name:'Jack Hall',         grade:66 },
    { id:405, name:'Camila Young',      grade:83 }, { id:406, name:'Dylan King',        grade:78 },
    { id:407, name:'Penelope Scott',    grade:91 }, { id:408, name:'Owen Green',        grade:72 },
    { id:409, name:'Layla Adams',       grade:86 }, { id:410, name:'Wyatt Baker',       grade:63 },
  ],
};

const COURSE_THEMES = [
  { grad:'linear-gradient(135deg,#6366f1,#4f46e5)', light:'rgba(99,102,241,0.08)',  border:'rgba(99,102,241,0.2)',  dot:'#6366f1', btnGrad:'linear-gradient(135deg,#6366f1,#4f46e5)', shadow:'rgba(99,102,241,0.3)'  },
  { grad:'linear-gradient(135deg,#0d9488,#0284c7)', light:'rgba(13,148,136,0.08)',  border:'rgba(13,148,136,0.2)',  dot:'#0d9488', btnGrad:'linear-gradient(135deg,#0d9488,#0284c7)', shadow:'rgba(13,148,136,0.3)'  },
  { grad:'linear-gradient(135deg,#2563eb,#6366f1)', light:'rgba(37,99,235,0.08)',   border:'rgba(37,99,235,0.2)',   dot:'#2563eb', btnGrad:'linear-gradient(135deg,#2563eb,#4f46e5)', shadow:'rgba(37,99,235,0.3)'   },
  { grad:'linear-gradient(135deg,#ea580c,#d97706)', light:'rgba(234,88,12,0.08)',   border:'rgba(234,88,12,0.2)',   dot:'#ea580c', btnGrad:'linear-gradient(135deg,#ea580c,#d97706)', shadow:'rgba(234,88,12,0.3)'   },
];

const STATUS_CFG = [
  { key:'present', label:'Present', color:'var(--success)', bg:'var(--success-bg)', border:'var(--success-border)' },
  { key:'late',    label:'Late',    color:'var(--warning)', bg:'var(--warning-bg)', border:'var(--warning-border)' },
  { key:'absent',  label:'Absent',  color:'var(--danger)',  bg:'var(--danger-bg)',  border:'var(--danger-border)'  },
];

function initials(name) { return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(); }
const AVATAR_COLORS = ['#6366f1','#0d9488','#2563eb','#ea580c','#db2777','#10b981','#d97706','#8b5cf6'];
function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

/* ── Roll Call View ─────────────────────────────────────────────── */
function RollCallView({ course, students, onBack, showFeedback }) {
  const today  = new Date().toISOString().slice(0, 10);
  const [date, setDate]       = useState(today);
  const [records, setRecords] = useState({});
  const [saved, setSaved]     = useState(false);
  const [search, setSearch]   = useState('');

  const idx = COURSES.findIndex(c => c.id === course.id);
  const ac  = COURSE_THEMES[idx % COURSE_THEMES.length];

  const dbStudents = students.filter(st => st.major === course.majorKey);
  const mockList   = MOCK_STUDENTS[course.id] || [];
  const roster     = dbStudents.length > 0
    ? dbStudents.map(st => ({ id: st.id, name: st.name, grade: st.grade }))
    : mockList;

  const filtered = useMemo(() =>
    roster.filter(st => st.name.toLowerCase().includes(search.toLowerCase())), [roster, search]);

  useEffect(() => {
    const init = {};
    roster.forEach(st => { init[st.id] = 'present'; });
    setRecords(init); setSaved(false);
  }, [course.id]);

  const mark    = (id, s) => { setRecords(p => ({ ...p, [id]: s })); setSaved(false); };
  const markAll = s => { const n = {}; roster.forEach(st => { n[st.id] = s; }); setRecords(n); setSaved(false); };

  const total   = roster.length;
  const present = Object.values(records).filter(v => v === 'present').length;
  const late    = Object.values(records).filter(v => v === 'late').length;
  const absent  = Object.values(records).filter(v => v === 'absent').length;
  const rate    = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

  const handleSubmit = e => {
    e.preventDefault();
    setSaved(true);
    showFeedback('success', `Attendance saved for ${course.title}! Present:${present} · Late:${late} · Absent:${absent}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Back */}
      <button className="erp-btn erp-btn-secondary" style={{ width: 'fit-content' }} onClick={onBack}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to Courses
      </button>

      {/* Course Banner */}
      <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: `0 4px 20px ${ac.shadow}` }}>
        {/* Header */}
        <div style={{ background: ac.grad, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 5, padding: '2px 9px', fontSize: '0.62rem', fontWeight: 800 }}>{course.code}</span>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 5, padding: '2px 9px', fontSize: '0.62rem', fontWeight: 800 }}>● Live Session</span>
            </div>
            <h2 style={{ margin: '0 0 2px', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{course.title}</h2>
            <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255,255,255,0.8)' }}>{course.room} · {course.schedule} · {course.time}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '0.76rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, background: 'rgba(255,255,255,0.15)', color: '#fff', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'var(--surface)', borderTop: 'none' }}>
          {[
            { label: 'Attendance Rate', val: `${rate}%`, color: rate >= 85 ? 'var(--success)' : 'var(--danger)', sub: `${present} of ${total}` },
            { label: 'Present',         val: present,    color: 'var(--success)', sub: `${total ? Math.round(present/total*100) : 0}%` },
            { label: 'Late',            val: late,       color: 'var(--warning)', sub: `${total ? Math.round(late/total*100)    : 0}%` },
            { label: 'Absent',          val: absent,     color: 'var(--danger)',  sub: `${total ? Math.round(absent/total*100)  : 0}%` },
          ].map((k, i, arr) => (
            <div key={k.label} style={{ padding: '12px 16px', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--text-muted)' }}>{k.label}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.val}</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{k.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Roll Call Form */}
      <form onSubmit={handleSubmit} className="erp-card">
        {/* Header */}
        <div className="erp-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: ac.light, border: `1px solid ${ac.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ac.dot} strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
              <div className="erp-card-title">Student Roll Call</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 1 }}>{total} students · Tap a status to mark</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Search */}
            <div className="erp-input-with-icon" style={{ width: 160 }}>
              <svg className="erp-input-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="erp-input" style={{ height: 32, fontSize: '0.75rem' }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {/* Mark all */}
            <div style={{ display: 'flex', gap: 4 }}>
              {STATUS_CFG.map(s => (
                <button key={s.key} type="button" className="erp-btn erp-btn-sm" onClick={() => markAll(s.key)}
                  style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: '0.65rem' }}>
                  All {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Student List */}
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          {!filtered.length ? (
            <div className="erp-empty">
              <div className="erp-empty-icon">🔍</div>
              <div className="erp-empty-title">{search ? `No students match "${search}"` : 'No students enrolled.'}</div>
            </div>
          ) : filtered.map((st, i) => {
            const cur   = records[st.id] || 'present';
            const color = avatarColor(typeof st.id === 'number' ? st.id : parseInt(String(st.id).replace(/\D/g, ''), 10) || 0);
            return (
              <div key={st.id} className="att-student-row" style={{ margin: '6px 16px', borderRadius: 10 }}>
                {/* Avatar */}
                <div className="erp-avatar" style={{ background: color, width: 34, height: 34, fontSize: '0.6rem' }}>
                  {initials(st.name)}
                </div>
                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="erp-cell-name">{st.name}</div>
                  <div className="erp-cell-sub">#ST-{st.id}</div>
                </div>
                {/* Grade */}
                <span className={`erp-badge ${st.grade >= 90 ? 'erp-badge-success' : st.grade >= 75 ? 'erp-badge-info' : 'erp-badge-danger'}`}>
                  {st.grade}%
                </span>
                {/* Status Toggle */}
                <div style={{ display: 'flex', gap: 3, background: 'var(--surface-3)', borderRadius: 8, padding: 3 }}>
                  {STATUS_CFG.map(s => {
                    const isActive = cur === s.key;
                    return (
                      <button key={s.key} type="button"
                        onClick={() => mark(st.id, s.key)}
                        style={{
                          padding: '4px 10px', border: isActive ? `1px solid ${s.border}` : '1px solid transparent',
                          borderRadius: 6, background: isActive ? 'var(--surface)' : 'transparent',
                          color: isActive ? s.color : 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 800,
                          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                          boxShadow: isActive ? `0 1px 4px rgba(0,0,0,0.08)` : 'none',
                        }}>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div style={{ height: 12 }} />
        </div>

        {/* Footer: progress + submit */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Session Progress</span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)' }}>{present+late+absent} / {total} marked</span>
            </div>
            <div className="erp-progress">
              <div className="erp-progress-bar" style={{ width: `${rate}%`, background: ac.grad }} />
            </div>
          </div>
          <button type="submit" className={`erp-btn ${saved ? 'erp-btn-secondary' : 'erp-btn-primary'}`}
            style={saved ? { color: 'var(--success)', borderColor: 'var(--success-border)', background: 'var(--success-bg)' } : {}}>
            {saved
              ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Saved!</>
              : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Submit Attendance</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Attendance Landing (Course selector) ───────────────────────── */
export default function Attendance() {
  const { students, showFeedback } = useERP();
  const [activeCourse, setActiveCourse] = useState(null);

  if (activeCourse) {
    return <RollCallView course={activeCourse} students={students} onBack={() => setActiveCourse(null)} showFeedback={showFeedback} />;
  }

  const totalStudents = COURSES.reduce((s, c) => s + c.defaultCount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stats Row */}
      <div className="erp-stat-grid">
        <div className="erp-stat-card purple">
          <div className="erp-stat-top">
            <span className="erp-stat-label">Active Courses</span>
            <div className="erp-stat-icon purple">📚</div>
          </div>
          <div className="erp-stat-value">{COURSES.length}</div>
          <div className="erp-stat-sub">This semester</div>
        </div>
        <div className="erp-stat-card blue">
          <div className="erp-stat-top">
            <span className="erp-stat-label">Total Students</span>
            <div className="erp-stat-icon blue">👥</div>
          </div>
          <div className="erp-stat-value">{totalStudents}</div>
          <div className="erp-stat-sub">Combined enrollment</div>
        </div>
        <div className="erp-stat-card emerald">
          <div className="erp-stat-top">
            <span className="erp-stat-label">Today's Sessions</span>
            <div className="erp-stat-icon emerald">📅</div>
          </div>
          <div className="erp-stat-value">2</div>
          <div className="erp-stat-sub">Classes scheduled today</div>
        </div>
        <div className="erp-stat-card teal">
          <div className="erp-stat-top">
            <span className="erp-stat-label">Avg Attendance</span>
            <div className="erp-stat-icon teal">✅</div>
          </div>
          <div className="erp-stat-value">87%</div>
          <div className="erp-stat-sub">This week overall</div>
        </div>
      </div>

      {/* Course Cards */}
      <div>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 12px' }}>
          Select a Class to Take Attendance
        </h3>
        <div className="att-course-grid">
          {COURSES.map((course, idx) => {
            const ac   = COURSE_THEMES[idx % COURSE_THEMES.length];
            const days = course.schedule.split(',');
            return (
              <div key={course.id} className="att-course-card" style={{ '--course-color': ac.dot }}>
                {/* Top accent line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: ac.grad, borderRadius: '16px 16px 0 0' }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.4px', background: ac.light, color: ac.dot, border: `1px solid ${ac.border}`, marginBottom: 6 }}>
                      {course.code}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.3 }}>{course.title}</h3>
                  </div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: ac.dot, lineHeight: 1 }}>{course.defaultCount}</span>
                </div>

                <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
                  {days.map(d => (
                    <span key={d} style={{ padding: '2px 8px', borderRadius: 5, fontSize: '0.63rem', fontWeight: 700, background: ac.light, color: ac.dot, border: `1px solid ${ac.border}` }}>
                      {d.trim()}
                    </span>
                  ))}
                  <span style={{ fontSize: '0.63rem', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: 4 }}>
                    {course.time}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {course.room} · {course.credits} Credits
                </div>

                <button
                  className="erp-btn erp-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', background: ac.btnGrad, borderColor: 'transparent', boxShadow: `0 3px 12px ${ac.shadow}` }}
                  onClick={() => setActiveCourse(course)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  Take Attendance
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
