import { useState, useEffect, useMemo } from 'react';
import { useERP } from '../context/ERPContext';

/* ── Course master data ── */
const COURSES = [
  { id:'CS-301', title:'Advanced Algorithms',  code:'CS-301', schedule:'Mon, Wed', time:'10:00 – 11:30 AM', room:'Room 402', credits:3, majorKey:'Computer Science',       defaultCount:48 },
  { id:'CS-101', title:'Introduction to AI',    code:'CS-101', schedule:'Tue, Thu', time:'10:00 – 11:30 AM', room:'Room 105', credits:3, majorKey:'Bio-Engineering',        defaultCount:34 },
  { id:'CS-202', title:'Software Engineering',  code:'CS-202', schedule:'Mon, Wed', time:'2:00 – 3:30 PM',   room:'Room 203', credits:4, majorKey:'Quantum Physics',        defaultCount:27 },
  { id:'CS-204', title:'Database Systems',      code:'CS-204', schedule:'Fri',      time:'1:00 – 4:00 PM',   room:'Room 301', credits:3, majorKey:'Business Administration',defaultCount:41 },
];

/* Realistic mock roster per course (used when DB roster is empty) */
const MOCK_STUDENTS = {
  'CS-301': [
    { id:101, name:'Alexander Pierce',   grade:95 }, { id:102, name:'Sophia Martinez',   grade:88 },
    { id:103, name:'James Thornton',     grade:74 }, { id:104, name:'Priya Nair',         grade:91 },
    { id:105, name:'Ethan Caldwell',     grade:82 }, { id:106, name:'Amara Osei',         grade:67 },
    { id:107, name:'Lucas Bennett',      grade:78 }, { id:108, name:'Fatima Al-Rashid',   grade:93 },
    { id:109, name:'Ryan Nguyen',        grade:85 }, { id:110, name:'Isabella Ferreira',  grade:70 },
  ],
  'CS-101': [
    { id:201, name:'Noah Williams',      grade:90 }, { id:202, name:'Emma Johnson',       grade:76 },
    { id:203, name:'Liam Davis',         grade:83 }, { id:204, name:'Olivia Brown',       grade:88 },
    { id:205, name:'Mason Wilson',       grade:61 }, { id:206, name:'Charlotte Taylor',   grade:95 },
    { id:207, name:'Elijah Anderson',    grade:79 }, { id:208, name:'Ava Thomas',         grade:84 },
  ],
  'CS-202': [
    { id:301, name:'Benjamin Jackson',   grade:87 }, { id:302, name:'Harper White',       grade:92 },
    { id:303, name:'Evelyn Harris',      grade:73 }, { id:304, name:'Daniel Martin',      grade:68 },
    { id:305, name:'Mia Thompson',       grade:96 }, { id:306, name:'Sebastian Garcia',   grade:80 },
  ],
  'CS-204': [
    { id:401, name:'Aria Robinson',      grade:89 }, { id:402, name:'Henry Lewis',        grade:75 },
    { id:403, name:'Scarlett Walker',    grade:94 }, { id:404, name:'Jack Hall',          grade:66 },
    { id:405, name:'Camila Young',       grade:83 }, { id:406, name:'Dylan King',         grade:78 },
    { id:407, name:'Penelope Scott',     grade:91 }, { id:408, name:'Owen Green',         grade:72 },
    { id:409, name:'Layla Adams',        grade:86 }, { id:410, name:'Wyatt Baker',        grade:63 },
  ],
};

const ACCENTS = [
  { grad:'linear-gradient(135deg,#7c3aed,#4f46e5)', light:'rgba(124,58,237,.07)',  border:'rgba(124,58,237,.16)', dot:'#7c3aed', btnGrad:'linear-gradient(135deg,#7c3aed,#4f46e5)', shadow:'rgba(124,58,237,.25)' },
  { grad:'linear-gradient(135deg,#0d9488,#0ea5e9)', light:'rgba(13,148,136,.07)',  border:'rgba(13,148,136,.16)', dot:'#0d9488', btnGrad:'linear-gradient(135deg,#0d9488,#0284c7)', shadow:'rgba(13,148,136,.25)' },
  { grad:'linear-gradient(135deg,#2563eb,#7c3aed)', light:'rgba(37,99,235,.07)',   border:'rgba(37,99,235,.16)',  dot:'#2563eb', btnGrad:'linear-gradient(135deg,#2563eb,#7c3aed)', shadow:'rgba(37,99,235,.25)' },
  { grad:'linear-gradient(135deg,#ea580c,#f59e0b)', light:'rgba(234,88,12,.07)',   border:'rgba(234,88,12,.16)',  dot:'#ea580c', btnGrad:'linear-gradient(135deg,#ea580c,#f59e0b)', shadow:'rgba(234,88,12,.25)' },
];

const S_CFG = [
  { key:'present', label:'Present', color:'#059669', bg:'rgba(5,150,105,.10)',  border:'rgba(5,150,105,.22)'  },
  { key:'late',    label:'Late',    color:'#d97706', bg:'rgba(217,119,6,.10)',  border:'rgba(217,119,6,.22)'  },
  { key:'absent',  label:'Absent',  color:'#e11d48', bg:'rgba(225,29,72,.10)', border:'rgba(225,29,72,.22)'  },
];

/* Avatar initials + color */
function initials(name) { return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
const AVATAR_COLORS = ['#7c3aed','#0d9488','#2563eb','#ea580c','#db2777','#059669','#d97706','#6366f1'];
function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

/* ════════════════════════════════════════════════
   ROLL-CALL VIEW
════════════════════════════════════════════════ */
function RollCallView({ course, students, onBack, showFeedback }) {
  const today   = new Date().toISOString().slice(0,10);
  const [date, setDate]       = useState(today);
  const [records, setRecords] = useState({});
  const [saved, setSaved]     = useState(false);
  const [search, setSearch]   = useState('');

  const idx = COURSES.findIndex(c=>c.id===course.id);
  const ac  = ACCENTS[idx%ACCENTS.length];

  /* Merge DB students + mock fallback */
  const dbStudents  = students.filter(st=>st.major===course.majorKey);
  const mockList    = MOCK_STUDENTS[course.id]||[];
  const roster      = dbStudents.length>0
    ? dbStudents.map(st=>({ id:st.id, name:st.name, grade:st.grade }))
    : mockList;

  const filtered = useMemo(()=>
    roster.filter(st=>st.name.toLowerCase().includes(search.toLowerCase())),[roster,search]);

  useEffect(()=>{
    const init={};
    roster.forEach(st=>{ init[st.id]='present'; });
    setRecords(init); setSaved(false);
  },[course.id]);

  const mark    = (id,s) => { setRecords(p=>({...p,[id]:s})); setSaved(false); };
  const markAll = s => { const n={}; roster.forEach(st=>{n[st.id]=s;}); setRecords(n); setSaved(false); };

  const total   = roster.length;
  const present = Object.values(records).filter(v=>v==='present').length;
  const late    = Object.values(records).filter(v=>v==='late').length;
  const absent  = Object.values(records).filter(v=>v==='absent').length;
  const rate    = total>0?Math.round(((present+late*0.5)/total)*100):100;

  const submit = e=>{
    e.preventDefault();
    setSaved(true);
    showFeedback('success',`Attendance saved for ${course.title}! Present:${present} · Late:${late} · Absent:${absent}`);
  };

  const C={ bg:'#f7f6f3', card:'#fff', bd:'#e8e3dc', h:'#1e1b4b', sub:'#64748b', lab:'#6b7280', val:'#1e293b' };

  return (
    <div style={{fontFamily:'inherit'}}>

      {/* ── Back btn ── */}
      <button onClick={onBack} style={{display:'inline-flex',alignItems:'center',gap:'6px',border:`1px solid ${C.bd}`,background:'#fff',color:C.sub,borderRadius:'9px',padding:'6px 14px',fontSize:'0.78rem',fontWeight:'700',cursor:'pointer',fontFamily:'inherit',marginBottom:'1.25rem',boxShadow:'0 1px 3px rgba(0,0,0,.06)',transition:'all .18s'}}
        onMouseEnter={e=>{e.currentTarget.style.color=ac.dot;e.currentTarget.style.borderColor=ac.dot;}}
        onMouseLeave={e=>{e.currentTarget.style.color=C.sub;e.currentTarget.style.borderColor=C.bd;}}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to Courses
      </button>

      {/* ── Course Banner ── */}
      <div style={{borderRadius:'16px',overflow:'hidden',marginBottom:'1rem',boxShadow:`0 4px 20px ${ac.shadow}`}}>
        <div style={{background:ac.grad,padding:'1.1rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'5px'}}>
              <span style={{background:'rgba(255,255,255,.2)',color:'#fff',borderRadius:'6px',padding:'2px 10px',fontSize:'0.65rem',fontWeight:'800',letterSpacing:'.5px'}}>{course.code}</span>
              <span style={{background:'rgba(255,255,255,.15)',color:'#fff',borderRadius:'6px',padding:'2px 10px',fontSize:'0.65rem',fontWeight:'800'}}>● Live Session</span>
            </div>
            <h2 style={{margin:'0 0 2px',fontSize:'1.3rem',fontWeight:'800',color:'#fff'}}>{course.title}</h2>
            <p style={{margin:0,fontSize:'0.76rem',color:'rgba(255,255,255,.75)'}}>{course.room} · {course.schedule} · {course.time}</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <label style={{fontSize:'0.65rem',fontWeight:'700',color:'rgba(255,255,255,.7)',textTransform:'uppercase'}}>Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)}
              style={{padding:'6px 10px',fontSize:'0.76rem',border:'1px solid rgba(255,255,255,.3)',borderRadius:'8px',background:'rgba(255,255,255,.15)',color:'#fff',fontFamily:'inherit',outline:'none',cursor:'pointer',backdropFilter:'blur(4px)'}}
            />
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',background:'#fff',borderTop:'none'}}>
          {[
            {label:'Attendance Rate', val:`${rate}%`,  color:rate>=85?'#059669':'#e11d48', sub:`${present} of ${total}` },
            {label:'Present',        val:present,      color:'#059669', sub:`${total?Math.round(present/total*100):0}%` },
            {label:'Late',           val:late,         color:'#d97706', sub:`${total?Math.round(late/total*100):0}%`    },
            {label:'Absent',         val:absent,       color:'#e11d48', sub:`${total?Math.round(absent/total*100):0}%`  },
          ].map((k,i,arr)=>(
            <div key={k.label} style={{padding:'.9rem 1.1rem',borderRight:i<arr.length-1?`1px solid ${C.bd}`:'none',display:'flex',flexDirection:'column',gap:'2px'}}>
              <span style={{fontSize:'0.62rem',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.7px',color:C.sub}}>{k.label}</span>
              <span style={{fontSize:'1.55rem',fontWeight:'800',color:k.color,lineHeight:'1'}}>{k.val}</span>
              <span style={{fontSize:'0.62rem',color:C.sub}}>{k.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Roll Call Form ── */}
      <form onSubmit={submit} style={{background:C.card,border:`1px solid ${C.bd}`,borderRadius:'16px',overflow:'hidden',boxShadow:'0 1px 8px rgba(30,27,75,.06)'}}>

        {/* Form Header */}
        <div style={{padding:'1rem 1.25rem',borderBottom:`1px solid ${C.bd}`,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px',background:'#fafaf8'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <span style={{background:ac.light,border:`1px solid ${ac.border}`,borderRadius:'9px',padding:'5px 7px',display:'flex'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ac.dot} strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <div>
              <p style={{margin:0,fontSize:'0.85rem',fontWeight:'800',color:C.h}}>Student Roll Call</p>
              <p style={{margin:0,fontSize:'0.68rem',color:C.sub}}>{total} students enrolled · Tap a status to mark</p>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            {/* Search */}
            <div style={{position:'relative'}}>
              <svg style={{position:'absolute',left:'9px',top:'50%',transform:'translateY(-50%)',opacity:.45}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.h} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search student…" value={search} onChange={e=>setSearch(e.target.value)}
                style={{paddingLeft:'27px',paddingRight:'10px',height:'32px',border:`1px solid ${C.bd}`,borderRadius:'8px',fontSize:'0.75rem',fontFamily:'inherit',color:C.h,background:'#fff',outline:'none',width:'160px'}}
              />
            </div>
            {/* Mark all */}
            <div style={{display:'flex',gap:'4px'}}>
              {S_CFG.map(s=>(
                <button key={s.key} type="button" onClick={()=>markAll(s.key)}
                  style={{padding:'5px 10px',border:`1px solid ${s.border}`,borderRadius:'7px',background:s.bg,color:s.color,fontSize:'0.66rem',fontWeight:'800',cursor:'pointer',fontFamily:'inherit',transition:'opacity .18s',letterSpacing:'.2px'}}
                  onMouseEnter={e=>e.currentTarget.style.opacity='.7'}
                  onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                >All {s.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Student List ── */}
        <div style={{maxHeight:'400px',overflowY:'auto'}}>
          {!filtered.length ? (
            <div style={{padding:'3rem',textAlign:'center',color:C.sub,fontSize:'0.85rem'}}>
              {search ? `No students match "${search}"` : 'No students enrolled yet.'}
            </div>
          ) : filtered.map((st,i)=>{
            const cur = records[st.id]||'present';
            const color = avatarColor(st.id);
            return (
              <div key={st.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 1.25rem',borderBottom:i<filtered.length-1?`1px solid ${C.bd}`:'none',background:i%2===0?'#fff':'#fafaf8',transition:'background .15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='#f5f3ef'}
                onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'#fff':'#fafaf8'}
              >
                {/* Avatar */}
                <div style={{width:'34px',height:'34px',borderRadius:'50%',background:color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:`0 2px 6px ${color}44`}}>
                  <span style={{color:'#fff',fontSize:'0.62rem',fontWeight:'800',letterSpacing:'.3px'}}>{initials(st.name)}</span>
                </div>

                {/* Name + ID */}
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:'0.85rem',fontWeight:'700',color:C.h,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{st.name}</p>
                  <p style={{margin:0,fontSize:'0.65rem',color:C.sub}}>#ST-{st.id}</p>
                </div>

                {/* Grade badge */}
                <span style={{fontSize:'0.78rem',fontWeight:'800',color:st.grade>=90?'#059669':st.grade>=75?'#0d9488':'#e11d48',background:st.grade>=90?'rgba(5,150,105,.08)':st.grade>=75?'rgba(13,148,136,.08)':'rgba(225,29,72,.08)',border:`1px solid ${st.grade>=90?'rgba(5,150,105,.18)':st.grade>=75?'rgba(13,148,136,.18)':'rgba(225,29,72,.18)'}`,borderRadius:'7px',padding:'2px 8px',flexShrink:0}}>
                  {st.grade}%
                </span>

                {/* Status Toggle */}
                <div style={{display:'flex',gap:'3px',background:'#ede9e3',borderRadius:'9px',padding:'3px',flexShrink:0}}>
                  {S_CFG.map(s=>{
                    const active=cur===s.key;
                    return (
                      <button key={s.key} type="button" onClick={()=>mark(st.id,s.key)}
                        style={{padding:'5px 12px',border:active?`1px solid ${s.border}`:'1px solid transparent',borderRadius:'7px',background:active?'#fff':'transparent',color:active?s.color:C.lab,fontSize:'0.68rem',fontWeight:'800',cursor:'pointer',fontFamily:'inherit',transition:'all .15s cubic-bezier(.16,1,.3,1)',boxShadow:active?`0 1px 4px ${s.color}22`:'none'}}>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Progress Bar + Submit ── */}
        <div style={{padding:'1rem 1.25rem',borderTop:`1px solid ${C.bd}`,background:'#fafaf8',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'16px',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:'180px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
              <span style={{fontSize:'0.66rem',fontWeight:'700',color:C.sub,textTransform:'uppercase',letterSpacing:'.5px'}}>Session Progress</span>
              <span style={{fontSize:'0.66rem',fontWeight:'700',color:C.sub}}>{present+late+absent} / {total} marked</span>
            </div>
            <div style={{height:'6px',background:'#e8e3dc',borderRadius:'99px',overflow:'hidden'}}>
              <div style={{height:'100%',width:`${rate}%`,background:ac.grad,borderRadius:'99px',transition:'width .5s cubic-bezier(.16,1,.3,1)'}}/>
            </div>
          </div>
          <button type="submit" style={{height:'38px',padding:'0 22px',display:'inline-flex',alignItems:'center',gap:'7px',background:saved?'linear-gradient(135deg,#059669,#10b981)':ac.btnGrad,color:'#fff',border:'none',borderRadius:'10px',fontSize:'0.8rem',fontWeight:'800',cursor:'pointer',fontFamily:'inherit',boxShadow:`0 3px 12px ${saved?'rgba(5,150,105,.3)':ac.shadow}`,transition:'all .2s',flexShrink:0}}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
          >
            {saved
              ?<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Saved!</>
              :<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Submit Attendance</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ACTIVE COURSES GRID
════════════════════════════════════════════════ */
export default function Attendance() {
  const { students, showFeedback } = useERP();
  const [activeCourse, setActiveCourse] = useState(null);
  const [openMenu,     setOpenMenu]     = useState(null);

  const C = { h:'#1e1b4b', sub:'#64748b', lab:'#6b7280', val:'#1e293b', bd:'#e8e3dc' };

  if (activeCourse) return (
    <div className="main-panel">
      <RollCallView course={activeCourse} students={students} onBack={()=>setActiveCourse(null)} showFeedback={showFeedback}/>
    </div>
  );

  return (
    <div className="main-panel" onClick={()=>setOpenMenu(null)}>
      <style>{`
        @keyframes crdIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes mnIn{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>

      {/* ── Page Header Banner ── */}
      <div style={{background:'linear-gradient(135deg, #faf9f6 0%, #f5f3ef 100%)',borderRadius:'20px',padding:'2rem 2.2rem',marginBottom:'1.5rem',border:'1px solid #e8e3dc'}}>
        <h2 style={{margin:'0 0 6px',fontSize:'1.5rem',fontWeight:'800',color:C.h,lineHeight:'1.3'}}>
          Attendance & <span style={{color:'#7c3aed'}}>Roll Call</span>
        </h2>
        <p style={{margin:0,fontSize:'0.82rem',color:C.sub,lineHeight:'1.6',maxWidth:'550px'}}>
          Mark daily attendance for your classes. Track student presence, generate reports, and monitor attendance trends across all courses.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div style={{display:'flex',gap:'12px',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        <div style={{background:'#fff',border:'1px solid #e8e3dc',borderRadius:'16px',padding:'1.1rem 1.3rem',flex:1,minWidth:'140px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <span style={{fontSize:'0.6rem',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.6px',color:'#64748b'}}>Active Courses</span>
            <span style={{fontSize:'1.1rem'}}>📚</span>
          </div>
          <p style={{margin:'0 0 3px',fontSize:'1.6rem',fontWeight:'800',color:'#6366f1',lineHeight:'1'}}>{COURSES.length}</p>
          <p style={{margin:0,fontSize:'0.68rem',color:'#94a3b8',fontWeight:'500'}}>This semester</p>
        </div>
        <div style={{background:'#fff',border:'1px solid #e8e3dc',borderRadius:'16px',padding:'1.1rem 1.3rem',flex:1,minWidth:'140px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <span style={{fontSize:'0.6rem',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.6px',color:'#64748b'}}>Total Students</span>
            <span style={{fontSize:'1.1rem'}}>👥</span>
          </div>
          <p style={{margin:'0 0 3px',fontSize:'1.6rem',fontWeight:'800',color:'#2563eb',lineHeight:'1'}}>{COURSES.reduce((s,c)=>s+c.defaultCount,0)}</p>
          <p style={{margin:0,fontSize:'0.68rem',color:'#94a3b8',fontWeight:'500'}}>Combined enrollment</p>
        </div>
        <div style={{background:'#fff',border:'1px solid #e8e3dc',borderRadius:'16px',padding:'1.1rem 1.3rem',flex:1,minWidth:'140px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <span style={{fontSize:'0.6rem',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.6px',color:'#64748b'}}>Today's Sessions</span>
            <span style={{fontSize:'1.1rem'}}>📅</span>
          </div>
          <p style={{margin:'0 0 3px',fontSize:'1.6rem',fontWeight:'800',color:'#059669',lineHeight:'1'}}>2</p>
          <p style={{margin:0,fontSize:'0.68rem',color:'#94a3b8',fontWeight:'500'}}>Classes scheduled today</p>
        </div>
        <div style={{background:'#fff',border:'1px solid #e8e3dc',borderRadius:'16px',padding:'1.1rem 1.3rem',flex:1,minWidth:'140px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <span style={{fontSize:'0.6rem',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.6px',color:'#64748b'}}>Avg Attendance</span>
            <span style={{fontSize:'1.1rem'}}>✅</span>
          </div>
          <p style={{margin:'0 0 3px',fontSize:'1.6rem',fontWeight:'800',color:'#7c3aed',lineHeight:'1'}}>87%</p>
          <p style={{margin:0,fontSize:'0.68rem',color:'#94a3b8',fontWeight:'500'}}>This week overall</p>
        </div>
      </div>

      {/* ── Course Cards Grid ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(265px,1fr))',gap:'1rem'}}>
        {COURSES.map((course,idx)=>{
          const ac    = ACCENTS[idx%ACCENTS.length];
          const count = course.defaultCount;
          const isOpen= openMenu===course.id;
          const days  = course.schedule.split(',');

          return (
            <div key={course.id}
              style={{background:'#fff',border:`1px solid ${C.bd}`,borderRadius:'16px',overflow:'hidden',boxShadow:'0 1px 8px rgba(30,27,75,.07)',animation:`crdIn .32s cubic-bezier(.16,1,.3,1) ${idx*.06}s both`,transition:'box-shadow .22s,transform .22s',position:'relative'}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 28px rgba(30,27,75,.12)';e.currentTarget.style.transform='translateY(-3px)';}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 1px 8px rgba(30,27,75,.07)';e.currentTarget.style.transform='translateY(0)';}}
            >
              {/* Gradient Header */}
              <div style={{background:ac.grad,padding:'1.1rem 1.1rem .85rem',position:'relative',overflow:'hidden'}}>
                {/* Decorative circle */}
                <div style={{position:'absolute',right:'-18px',top:'-18px',width:'80px',height:'80px',borderRadius:'50%',background:'rgba(255,255,255,.1)',pointerEvents:'none'}}/>
                <div style={{position:'absolute',right:'18px',bottom:'-24px',width:'55px',height:'55px',borderRadius:'50%',background:'rgba(255,255,255,.07)',pointerEvents:'none'}}/>

                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <span style={{display:'inline-block',background:'rgba(255,255,255,.2)',color:'#fff',borderRadius:'6px',padding:'2px 9px',fontSize:'0.6rem',fontWeight:'800',letterSpacing:'.5px',marginBottom:'5px'}}>
                      {course.code}
                    </span>
                    <h3 style={{margin:0,fontSize:'1rem',fontWeight:'800',color:'#fff',lineHeight:'1.3'}}>{course.title}</h3>
                  </div>
                  <span style={{background:'rgba(255,255,255,.2)',color:'#fff',borderRadius:'10px',padding:'2px 8px',fontSize:'0.6rem',fontWeight:'800',flexShrink:0,marginLeft:'6px'}}>Active</span>
                </div>

                {/* Student count */}
                <div style={{marginTop:'10px',display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
                  <div>
                    <p style={{margin:0,fontSize:'1.9rem',fontWeight:'800',color:'#fff',lineHeight:'1'}}>{count}</p>
                    <p style={{margin:'1px 0 0',fontSize:'0.62rem',color:'rgba(255,255,255,.7)',fontWeight:'600'}}>students enrolled</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{margin:0,fontSize:'0.62rem',color:'rgba(255,255,255,.7)',fontWeight:'600'}}>{course.room}</p>
                    <p style={{margin:'2px 0 0',fontSize:'0.68rem',color:'rgba(255,255,255,.88)',fontWeight:'700'}}>{course.time}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div style={{padding:'.85rem 1.1rem'}}>
                {/* Schedule Day Chips */}
                <div style={{display:'flex',gap:'5px',marginBottom:'12px',flexWrap:'wrap'}}>
                  {days.map(d=>(
                    <span key={d} style={{background:ac.light,color:ac.dot,border:`1px solid ${ac.border}`,borderRadius:'6px',padding:'2px 9px',fontSize:'0.65rem',fontWeight:'800'}}>
                      {d.trim()}
                    </span>
                  ))}
                  <span style={{marginLeft:'auto',fontSize:'0.65rem',color:C.sub,alignSelf:'center'}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{verticalAlign:'middle',marginRight:'3px'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {course.time}
                  </span>
                </div>

                {/* Action Row */}
                <div style={{display:'flex',gap:'7px'}}>
                  <button onClick={()=>setActiveCourse(course)} style={{flex:1,height:'36px',background:ac.btnGrad,color:'#fff',border:'none',borderRadius:'9px',fontSize:'0.78rem',fontWeight:'800',cursor:'pointer',fontFamily:'inherit',boxShadow:`0 2px 8px ${ac.shadow}`,transition:'all .18s',display:'flex',alignItems:'center',justifyContent:'center',gap:'5px'}}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow=`0 5px 14px ${ac.shadow}`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow=`0 2px 8px ${ac.shadow}`;}}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    Take Attendance
                  </button>

                  {/* ⋮ Menu */}
                  <div style={{position:'relative',flexShrink:0}} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>setOpenMenu(isOpen?null:course.id)} style={{width:'36px',height:'36px',background:isOpen?ac.light:'#f4f2ee',border:`1px solid ${isOpen?ac.border:C.bd}`,borderRadius:'9px',color:isOpen?ac.dot:C.sub,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .18s',fontFamily:'inherit'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </button>
                    {isOpen&&(
                      <div style={{position:'absolute',bottom:'42px',right:0,background:'#fff',border:`1px solid ${C.bd}`,borderRadius:'12px',padding:'5px',zIndex:300,minWidth:'162px',boxShadow:'0 8px 28px rgba(30,27,75,.13)',animation:'mnIn .16s cubic-bezier(.16,1,.3,1)'}}>
                        {[{icon:'📋',label:'View History'},{icon:'📊',label:'Attendance Report'},{icon:'⚙️',label:'Course Settings'}].map(m=>(
                          <button key={m.label} onClick={()=>setOpenMenu(null)} style={{display:'flex',alignItems:'center',gap:'8px',width:'100%',padding:'8px 11px',border:'none',background:'transparent',color:C.lab,fontSize:'0.77rem',fontWeight:'600',cursor:'pointer',fontFamily:'inherit',borderRadius:'8px',textAlign:'left',transition:'all .13s'}}
                            onMouseEnter={e=>{e.currentTarget.style.background=ac.light;e.currentTarget.style.color=ac.dot;}}
                            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=C.lab;}}
                          ><span>{m.icon}</span>{m.label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
