import { useState } from 'react';

/* ── Palette ── */
const C = {
  bg: 'var(--bg)', card: 'var(--surface)', bd: 'var(--border)',
  h: 'var(--text)', sub: 'var(--text-secondary)', lab: 'var(--text-muted)', val: 'var(--text)',
  shadow: 'var(--shadow-sm)',
  shadowHover: 'var(--shadow-md)',
};

/* ── Semester Info ── */
const SEMESTER = {
  name: 'Spring 2026',
  week: 14,
  totalWeeks: 18,
  startDate: '2026-01-20',
  endDate:   '2026-06-15',
};

/* ── Course palette ── */
const COURSE_COLORS = {
  'CS-301': { dot:'#7c3aed', light:'rgba(124,58,237,.09)', border:'rgba(124,58,237,.2)', grad:'linear-gradient(135deg,#7c3aed,#4f46e5)' },
  'CS-101': { dot:'#0d9488', light:'rgba(13,148,136,.09)', border:'rgba(13,148,136,.2)', grad:'linear-gradient(135deg,#0d9488,#0284c7)' },
  'CS-202': { dot:'#2563eb', light:'rgba(37,99,235,.09)',  border:'rgba(37,99,235,.2)',  grad:'linear-gradient(135deg,#2563eb,#7c3aed)' },
  'CS-204': { dot:'#ea580c', light:'rgba(234,88,12,.09)',  border:'rgba(234,88,12,.2)',  grad:'linear-gradient(135deg,#ea580c,#f59e0b)' },
  'BREAK':  { dot:'#94a3b8', light:'rgba(148,163,184,.1)', border:'rgba(148,163,184,.2)',grad:'linear-gradient(135deg,#94a3b8,#64748b)' },
  'LUNCH':  { dot:'#059669', light:'rgba(5,150,105,.09)',  border:'rgba(5,150,105,.2)',  grad:'linear-gradient(135deg,#059669,#10b981)' },
  'OFFICE': { dot:'#6366f1', light:'rgba(99,102,241,.09)', border:'rgba(99,102,241,.2)', grad:'linear-gradient(135deg,#6366f1,#4f46e5)' },
};

/* ── Days & Timetable data ── */
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00',
];

/* Classes: { day, start, end, code, title, room, type } */
const CLASSES = [
  { day:'Monday',    start:'10:00', end:'11:30', code:'CS-301',  title:'Advanced Algorithms',   room:'Room 402', type:'Lecture'      },
  { day:'Monday',    start:'14:00', end:'15:30', code:'CS-202',  title:'Software Engineering',  room:'Room 203', type:'Lab'          },
  { day:'Tuesday',   start:'10:00', end:'11:30', code:'CS-101',  title:'Introduction to AI',    room:'Room 105', type:'Lecture'      },
  { day:'Tuesday',   start:'12:00', end:'13:00', code:'OFFICE',  title:'Office Hours',          room:'Office 212', type:'Office Hours'},
  { day:'Tuesday',   start:'13:00', end:'14:30', code:'CS-204',  title:'Database Systems',      room:'Room 301', type:'Tutorial'     },
  { day:'Wednesday', start:'10:00', end:'11:30', code:'CS-301',  title:'Advanced Algorithms',   room:'Room 402', type:'Lecture'      },
  { day:'Wednesday', start:'14:00', end:'15:00', code:'CS-202',  title:'Software Engineering',  room:'Room 203', type:'Seminar'      },
  { day:'Thursday',  start:'10:00', end:'11:30', code:'CS-101',  title:'Introduction to AI',    room:'Room 105', type:'Lecture'      },
  { day:'Thursday',  start:'12:00', end:'13:00', code:'OFFICE',  title:'Office Hours',          room:'Office 212', type:'Office Hours'},
  { day:'Thursday',  start:'13:00', end:'14:30', code:'CS-204',  title:'Database Systems',      room:'Room 301', type:'Lab'          },
  { day:'Friday',    start:'13:00', end:'16:00', code:'CS-204',  title:'Database Systems',      room:'Room 301', type:'Lecture'      },
];

const TODAY = DAYS[new Date().getDay() - 1] || 'Monday';


/* ── Helper: convert time to slot index ── */
function timeToIdx(t) { return TIME_SLOTS.indexOf(t); }
function slotHeight(start, end) {
  const diff = timeToIdx(end) - timeToIdx(start);
  return diff * 48; // 48px per 30-min slot
}
function slotTop(start) { return timeToIdx(start) * 48; }

/* ── Type badge colors ── */
const TYPE_COLORS = {
  Lecture:         { color:'#7c3aed', bg:'rgba(124,58,237,.1)', border:'rgba(124,58,237,.2)' },
  Lab:             { color:'#0d9488', bg:'rgba(13,148,136,.1)', border:'rgba(13,148,136,.2)' },
  Tutorial:        { color:'#2563eb', bg:'rgba(37,99,235,.1)',  border:'rgba(37,99,235,.2)'  },
  Seminar:         { color:'#ea580c', bg:'rgba(234,88,12,.1)',  border:'rgba(234,88,12,.2)'  },
  'Office Hours':  { color:'#6366f1', bg:'rgba(99,102,241,.1)', border:'rgba(99,102,241,.2)' },
};

/* ═══════════════════════════════════════
   WEEKLY GRID VIEW
═══════════════════════════════════════ */
function WeeklyGrid({ onDaySelect }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: '16px', border: `1px solid ${C.bd}`, background: C.card, boxShadow: C.shadow }}>
      <div style={{ display: 'grid', gridTemplateColumns: `72px repeat(${DAYS.length}, 1fr)`, minWidth: '780px' }}>

        {/* Header Row */}
        <div style={{ background: '#fafaf8', borderBottom: `1px solid ${C.bd}`, padding: '12px 8px' }} />
        {DAYS.map(d => (
          <div key={d} style={{ background: '#fafaf8', borderBottom: `1px solid ${C.bd}`, borderLeft: `1px solid ${C.bd}`, padding: '10px 8px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.6px', color: C.sub }}>{d.slice(0,3)}</p>
            <p style={{ margin: '3px 0 0', fontSize: '1rem', fontWeight: '800', color: d === TODAY ? '#7c3aed' : C.h,
              background: d === TODAY ? 'rgba(124,58,237,.1)' : 'transparent',
              borderRadius: '50%', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {new Date().getDate() - (new Date().getDay() - 1) + DAYS.indexOf(d)}
            </p>
          </div>
        ))}

        {/* Time Column + Rows */}
        <div style={{ gridColumn: `1 / span ${DAYS.length + 1}`, display: 'grid', gridTemplateColumns: `72px repeat(${DAYS.length}, 1fr)`, position: 'relative' }}>
          {/* Time labels */}
          <div>
            {TIME_SLOTS.map((t, i) => (
              <div key={t} style={{ height: '48px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: '10px', paddingTop: '5px', borderBottom: i < TIME_SLOTS.length - 1 ? `1px solid ${C.bd}` : 'none' }}>
                {t.endsWith(':00') && (
                  <span style={{ fontSize: '0.62rem', fontWeight: '700', color: C.sub }}>{t}</span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map(day => {
            const dayClasses = CLASSES.filter(c => c.day === day);
            return (
              <div key={day} onClick={() => onDaySelect(day)}
                style={{ borderLeft: `1px solid ${C.bd}`, position: 'relative', cursor: 'pointer', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Hour grid lines */}
                {TIME_SLOTS.map((t, i) => (
                  <div key={t} style={{ height: '48px', borderBottom: i < TIME_SLOTS.length - 1 ? `1px solid ${t.endsWith(':00') ? C.bd : 'rgba(232,227,220,.5)'}` : 'none' }} />
                ))}

                {/* Class blocks */}
                {dayClasses.map((cls, idx) => {
                  const col = COURSE_COLORS[cls.code] || COURSE_COLORS['BREAK'];
                  const tc  = TYPE_COLORS[cls.type] || TYPE_COLORS.Lecture;
                  const h   = slotHeight(cls.start, cls.end);
                  const top = slotTop(cls.start);
                  return (
                    <div key={idx}
                      style={{ position: 'absolute', top: `${top}px`, left: '4px', right: '4px', height: `${h - 4}px`,
                        background: col.light, border: `1px solid ${col.border}`, borderLeft: `3px solid ${col.dot}`,
                        borderRadius: '8px', padding: '5px 7px', overflow: 'hidden', zIndex: 2 }}
                      onClick={e => { e.stopPropagation(); onDaySelect(day); }}
                    >
                      <p style={{ margin: 0, fontSize: '0.62rem', fontWeight: '800', color: col.dot, lineHeight: '1.2' }}>{cls.code}</p>
                      {h >= 72 && <p style={{ margin: '2px 0 0', fontSize: '0.6rem', fontWeight: '600', color: C.val, lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cls.title}</p>}
                      {h >= 96 && <p style={{ margin: '2px 0 0', fontSize: '0.58rem', color: C.sub }}>{cls.start}–{cls.end}</p>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DAY VIEW
═══════════════════════════════════════ */
function DayView({ day, onBack }) {
  const dayClasses = CLASSES.filter(c => c.day === day).sort((a,b)=>a.start.localeCompare(b.start));
  const now = new Date();
  const nowMin = now.getHours()*60 + now.getMinutes();

  function statusOf(cls) {
    const [sh,sm] = cls.start.split(':').map(Number);
    const [eh,em] = cls.end.split(':').map(Number);
    const s = sh*60+sm, e = eh*60+em;
    if (day !== TODAY) return 'upcoming';
    if (nowMin >= s && nowMin < e) return 'live';
    if (nowMin >= e) return 'done';
    return 'upcoming';
  }

  const STATUS_STYLE = {
    live:     { color:'#059669', bg:'rgba(5,150,105,.1)',   border:'rgba(5,150,105,.22)',   label:'● Live Now'  },
    done:     { color:'#94a3b8', bg:'rgba(148,163,184,.1)', border:'rgba(148,163,184,.2)',  label:'Completed'   },
    upcoming: { color:'#7c3aed', bg:'rgba(124,58,237,.1)',  border:'rgba(124,58,237,.22)',  label:'Upcoming'    },
  };

  return (
    <div>
      <button onClick={onBack} style={{ display:'inline-flex',alignItems:'center',gap:'6px',border:`1px solid ${C.bd}`,background:'#fff',color:C.sub,borderRadius:'9px',padding:'6px 14px',fontSize:'0.78rem',fontWeight:'700',cursor:'pointer',fontFamily:'inherit',marginBottom:'1.1rem',boxShadow:'0 1px 3px rgba(0,0,0,.05)',transition:'all .18s' }}
        onMouseEnter={e=>{e.currentTarget.style.color='#7c3aed';e.currentTarget.style.borderColor='#7c3aed';}}
        onMouseLeave={e=>{e.currentTarget.style.color=C.sub;e.currentTarget.style.borderColor=C.bd;}}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Week View
      </button>

      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem' }}>
        <div>
          <h3 style={{ margin:'0 0 2px',fontSize:'1.15rem',fontWeight:'800',color:C.h }}>{day}'s Schedule</h3>
          <p style={{ margin:0,fontSize:'0.75rem',color:C.sub }}>{dayClasses.length} class{dayClasses.length!==1?'es':''} scheduled</p>
        </div>
        {day===TODAY && <span style={{ background:'rgba(5,150,105,.09)',color:'#059669',border:'1px solid rgba(5,150,105,.18)',borderRadius:'20px',padding:'4px 12px',fontSize:'0.68rem',fontWeight:'800' }}>● Today</span>}
      </div>

      {dayClasses.length === 0 ? (
        <div style={{ background:'#fff',border:`1px solid ${C.bd}`,borderRadius:'14px',padding:'3rem',textAlign:'center',color:C.sub }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.bd} strokeWidth="1.5" style={{marginBottom:'10px'}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p style={{ margin:0,fontWeight:'700',color:C.lab }}>No classes scheduled for {day}</p>
        </div>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
          {dayClasses.map((cls,i) => {
            const col = COURSE_COLORS[cls.code] || COURSE_COLORS['BREAK'];
            const tc  = TYPE_COLORS[cls.type] || TYPE_COLORS.Lecture;
            const st  = statusOf(cls);
            const ss  = STATUS_STYLE[st];
            return (
              <div key={i} style={{ background:'#fff',border:`1px solid ${C.bd}`,borderRadius:'14px',overflow:'hidden',boxShadow:C.shadow,display:'flex',transition:'box-shadow .2s' }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow=C.shadowHover}
                onMouseLeave={e=>e.currentTarget.style.boxShadow=C.shadow}
              >
                {/* Coloured left rail */}
                <div style={{ width:'5px',background:col.grad,flexShrink:0 }} />

                <div style={{ flex:1,padding:'1rem 1.1rem',display:'flex',alignItems:'center',gap:'14px',flexWrap:'wrap' }}>
                  {/* Time block */}
                  <div style={{ minWidth:'70px',textAlign:'center',background:'#fafaf8',borderRadius:'10px',padding:'8px 10px',flexShrink:0 }}>
                    <p style={{ margin:0,fontSize:'0.72rem',fontWeight:'800',color:col.dot }}>{cls.start}</p>
                    <p style={{ margin:'2px 0',fontSize:'0.58rem',color:C.sub }}>to</p>
                    <p style={{ margin:0,fontSize:'0.72rem',fontWeight:'800',color:col.dot }}>{cls.end}</p>
                  </div>

                  {/* Details */}
                  <div style={{ flex:1,minWidth:'140px' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:'7px',marginBottom:'4px',flexWrap:'wrap' }}>
                      <span style={{ background:col.light,color:col.dot,border:`1px solid ${col.border}`,borderRadius:'6px',padding:'2px 8px',fontSize:'0.62rem',fontWeight:'800',letterSpacing:'.4px' }}>{cls.code}</span>
                      <span style={{ background:tc.bg,color:tc.color,border:`1px solid ${tc.border}`,borderRadius:'6px',padding:'2px 8px',fontSize:'0.62rem',fontWeight:'800' }}>{cls.type}</span>
                      <span style={{ background:ss.bg,color:ss.color,border:`1px solid ${ss.border}`,borderRadius:'6px',padding:'2px 8px',fontSize:'0.62rem',fontWeight:'800' }}>{ss.label}</span>
                    </div>
                    <h4 style={{ margin:'0 0 3px',fontSize:'0.95rem',fontWeight:'800',color:C.h }}>{cls.title}</h4>
                    <p style={{ margin:0,fontSize:'0.75rem',color:C.sub,display:'flex',alignItems:'center',gap:'5px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      {cls.room}
                    </p>
                  </div>

                  {/* Duration chip */}
                  <div style={{ textAlign:'right',flexShrink:0 }}>
                    {(() => {
                      const [sh,sm]=cls.start.split(':').map(Number);
                      const [eh,em]=cls.end.split(':').map(Number);
                      const mins=(eh*60+em)-(sh*60+sm);
                      return <span style={{ fontSize:'0.68rem',fontWeight:'700',color:C.sub }}>{mins} min</span>;
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN TIMETABLE PAGE
═══════════════════════════════════════ */
export default function Timetable() {
  const [view, setView]         = useState('week');  // 'week' | 'day'
  const [selectedDay, setDay]   = useState(TODAY);

  const todayClasses = CLASSES.filter(c => c.day === TODAY);
  const totalWeek    = CLASSES.length;

  const handleDaySelect = (day) => { setDay(day); setView('day'); };

  return (
    <div className="main-panel">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ marginBottom:'1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px' }}>
        <div>
          <h2 style={{ margin:'0 0 2px',fontSize:'1.4rem',fontWeight:'800',color:C.h }}>
            {view === 'week' ? 'Weekly Timetable' : `${selectedDay} Schedule`}
          </h2>
          <p style={{ margin:0,fontSize:'0.78rem',color:C.sub }}>
            May 2026 · Academic Semester II
          </p>
        </div>

        <div style={{ display:'flex',alignItems:'center',gap:'8px' }}>
          {/* View Toggle */}
          <div style={{ display:'flex',background:'#eeeae3',borderRadius:'10px',padding:'3px',gap:'2px' }}>
            {[{id:'week',label:'Week'},{id:'day',label:'Day'}].map(v=>(
              <button key={v.id} onClick={()=>{ if(v.id==='day') setDay(TODAY); setView(v.id); }}
                style={{ padding:'5px 14px',border:'none',borderRadius:'8px',fontSize:'0.72rem',fontWeight:'800',cursor:'pointer',fontFamily:'inherit',transition:'all .18s',
                  background: view===v.id?'#fff':'transparent', color: view===v.id?C.h:C.sub,
                  boxShadow: view===v.id?'0 1px 4px rgba(30,27,75,.1)':'none' }}
              >{v.label}</button>
            ))}
          </div>

          <span style={{ background:'rgba(124,58,237,.08)',color:'#7c3aed',border:'1px solid rgba(124,58,237,.16)',borderRadius:'20px',padding:'4px 12px',fontSize:'0.68rem',fontWeight:'800' }}>
            {totalWeek} Classes/Week
          </span>
        </div>
      </div>

      {/* ── Semester Summary Card ── */}
      <div style={{ background:'#fff',border:'1px solid rgba(99,102,241,.18)',borderRadius:'14px',padding:'1rem 1.25rem',marginBottom:'1rem',animation:'fadeUp .32s both',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'10px',boxShadow:C.shadow }}>
        <div style={{ display:'flex',alignItems:'center',gap:'14px',flexWrap:'wrap' }}>
          <div style={{ width:'38px',height:'38px',background:'rgba(99,102,241,.1)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <p style={{ margin:'0 0 2px',fontSize:'0.9rem',fontWeight:'800',color:C.h }}>{SEMESTER.name}</p>
            <p style={{ margin:0,fontSize:'0.72rem',color:C.sub }}>Week {SEMESTER.week} of {SEMESTER.totalWeeks} · {SEMESTER.totalWeeks - SEMESTER.week} weeks until semester end</p>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
          <div style={{ width:'180px' }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'5px' }}>
              <span style={{ fontSize:'0.62rem',fontWeight:'700',color:C.sub,textTransform:'uppercase',letterSpacing:'.4px' }}>Progress</span>
              <span style={{ fontSize:'0.62rem',fontWeight:'800',color:'#6366f1' }}>{Math.round((SEMESTER.week/SEMESTER.totalWeeks)*100)}%</span>
            </div>
            <div style={{ height:'6px',background:'#f0ede8',borderRadius:'99px',overflow:'hidden' }}>
              <div style={{ height:'100%',width:`${(SEMESTER.week/SEMESTER.totalWeeks)*100}%`,background:'linear-gradient(90deg,#6366f1,#7c3aed)',borderRadius:'99px',transition:'width .5s ease' }}/>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick-stat bar ── */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'.75rem',marginBottom:'1.25rem',animation:'fadeUp .35s both' }}>
        {[
          { label:"Today's Classes",   val: todayClasses.length,  color:'#7c3aed',  light:'rgba(124,58,237,.08)', bd:'rgba(124,58,237,.16)' },
          { label:'Total This Week',   val: totalWeek,             color:'#2563eb',  light:'rgba(37,99,235,.08)',  bd:'rgba(37,99,235,.16)'  },
          { label:'Office Hours/Week', val: 2,                     color:'#6366f1',  light:'rgba(99,102,241,.08)', bd:'rgba(99,102,241,.16)' },
          { label:'Free Days',         val: 1,                     color:'#059669',  light:'rgba(5,150,105,.08)',  bd:'rgba(5,150,105,.16)'  },
        ].map(k=>(
          <div key={k.label} style={{ background:'#fff',border:`1px solid ${k.bd}`,borderRadius:'12px',padding:'.8rem 1rem',boxShadow:C.shadow }}>
            <p style={{ margin:'0 0 3px',fontSize:'0.62rem',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.6px',color:C.sub }}>{k.label}</p>
            <p style={{ margin:0,fontSize:'1.55rem',fontWeight:'800',color:k.color,lineHeight:'1' }}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* ── Legend ── */}
      <div style={{ display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'1rem' }}>
        {Object.entries(COURSE_COLORS).filter(([k])=>k!=='BREAK'&&k!=='LUNCH').map(([code,col])=>{
          const course = CLASSES.find(c=>c.code===code);
          if (!course) return null;
          const displayTitle = code === 'OFFICE' ? 'Office Hours' : course.title;
          return (
            <span key={code} style={{ background:col.light,color:col.dot,border:`1px solid ${col.border}`,borderRadius:'8px',padding:'3px 10px',fontSize:'0.65rem',fontWeight:'800',display:'flex',alignItems:'center',gap:'5px' }}>
              <span style={{ width:'7px',height:'7px',borderRadius:'50%',background:col.dot,display:'inline-block' }}/>
              {code} — {displayTitle}
            </span>
          );
        })}
      </div>

      {/* ── Views ── */}
      <div style={{ animation:'fadeUp .35s .05s both' }}>
        {view === 'week'
          ? <WeeklyGrid onDaySelect={handleDaySelect} />
          : <DayView day={selectedDay} onBack={()=>setView('week')} />
        }
      </div>

      {/* ── Today's Upcoming ── */}
      {view === 'week' && (
        <div style={{ marginTop:'1.25rem',animation:'fadeUp .35s .1s both' }}>
          <h3 style={{ margin:'0 0 10px',fontSize:'0.92rem',fontWeight:'800',color:C.h }}>Today's Classes — {TODAY}</h3>
          {todayClasses.length === 0 ? (
            <div style={{ background:'#fff',border:`1px solid ${C.bd}`,borderRadius:'12px',padding:'1.5rem',textAlign:'center',color:C.sub,fontSize:'0.82rem' }}>No classes today.</div>
          ) : (
            <div style={{ display:'flex',gap:'10px',overflowX:'auto',paddingBottom:'4px' }}>
              {todayClasses.map((cls,i)=>{
                const col = COURSE_COLORS[cls.code]||COURSE_COLORS['BREAK'];
                const tc  = TYPE_COLORS[cls.type]||TYPE_COLORS.Lecture;
                return (
                  <div key={i} onClick={()=>handleDaySelect(TODAY)} style={{ background:'#fff',border:`1px solid ${C.bd}`,borderRadius:'12px',padding:'12px 14px',minWidth:'190px',flexShrink:0,cursor:'pointer',boxShadow:C.shadow,borderTop:`3px solid ${col.dot}`,transition:'all .2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.boxShadow=C.shadowHover;e.currentTarget.style.transform='translateY(-2px)';}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow=C.shadow;e.currentTarget.style.transform='translateY(0)';}}
                  >
                    <span style={{ background:col.light,color:col.dot,border:`1px solid ${col.border}`,borderRadius:'5px',padding:'1px 7px',fontSize:'0.6rem',fontWeight:'800',marginBottom:'6px',display:'inline-block' }}>{cls.code}</span>
                    <p style={{ margin:'0 0 2px',fontSize:'0.82rem',fontWeight:'800',color:C.h }}>{cls.title}</p>
                    <p style={{ margin:'0 0 5px',fontSize:'0.7rem',color:C.sub }}>{cls.start} – {cls.end}</p>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                      <span style={{ fontSize:'0.65rem',color:C.sub }}>{cls.room}</span>
                      <span style={{ background:tc.bg,color:tc.color,border:`1px solid ${tc.border}`,borderRadius:'5px',padding:'1px 7px',fontSize:'0.6rem',fontWeight:'800' }}>{cls.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
