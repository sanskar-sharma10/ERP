import { useState } from 'react';
import { useERP } from '../context/ERPContext';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TIME_SLOTS = [
  { id: 1, label: '09:00 - 10:30', name: 'Slot 1' },
  { id: 2, label: '10:30 - 12:00', name: 'Slot 2' },
  { id: 3, label: '12:00 - 13:30', name: 'Slot 3' },
  { id: 4, label: '13:30 - 15:00', name: 'Slot 4' },
  { id: 5, label: '15:00 - 16:30', name: 'Slot 5' }
];

const SCHEDULE_DATA = [
  { 
    id: 'CS-301', 
    title: 'Advanced Algorithms', 
    classroom: 'Room 402', 
    days: ['Monday', 'Wednesday'], 
    slot: 2, 
    credits: 3, 
    enrollment: 48, 
    instructor: 'Dr. Evelyn Vance',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    bgLight: 'rgba(124, 58, 237, 0.08)',
    accent: '#7c3aed',
    syllabus: 96
  },
  { 
    id: 'CS-202', 
    title: 'Software Engineering', 
    classroom: 'Room 203', 
    days: ['Tuesday', 'Thursday'], 
    slot: 4, 
    credits: 4, 
    enrollment: 35, 
    instructor: 'Dr. Evelyn Vance',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
    bgLight: 'rgba(251, 146, 60, 0.08)',
    accent: '#ea580c',
    syllabus: 73
  },
  { 
    id: 'CS-101', 
    title: 'Introduction to AI', 
    classroom: 'Room 105', 
    days: ['Tuesday', 'Thursday'], 
    slot: 1, 
    credits: 3, 
    enrollment: 120, 
    instructor: 'Prof. Richard Feynman',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
    bgLight: 'rgba(13, 148, 136, 0.08)',
    accent: '#0d9488',
    syllabus: 46
  },
  { 
    id: 'CS-305', 
    title: 'Cybersecurity', 
    classroom: 'Room 301', 
    days: ['Tuesday', 'Thursday'], 
    slot: 3, 
    credits: 3, 
    enrollment: 24, 
    instructor: 'Dr. Sarah Connor',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
    bgLight: 'rgba(244, 63, 94, 0.08)',
    accent: '#f43f5e',
    syllabus: 82
  },
  { 
    id: 'MAT-202', 
    title: 'Advanced Linear Algebra', 
    classroom: 'Room 204', 
    days: ['Monday', 'Wednesday'], 
    slot: 3, 
    credits: 3, 
    enrollment: 38, 
    instructor: 'Prof. Richard Feynman',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    bgLight: 'rgba(59, 130, 246, 0.08)',
    accent: '#3b82f6',
    syllabus: 60
  },
  { 
    id: 'PHY-303', 
    title: 'Quantum Computing', 
    classroom: 'Room 101', 
    days: ['Wednesday', 'Friday'], 
    slot: 5, 
    credits: 4, 
    enrollment: 15, 
    instructor: 'Dr. Alan Turing',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    bgLight: 'rgba(16, 185, 129, 0.08)',
    accent: '#10b981',
    syllabus: 88
  },
  { 
    id: 'CS-204', 
    title: 'Database Systems', 
    classroom: 'Room 204', 
    days: ['Friday'], 
    slot: 2, 
    credits: 3, 
    enrollment: 30, 
    instructor: 'Prof. Samantha Vance',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    bgLight: 'rgba(236, 72, 153, 0.08)',
    accent: '#ec4899',
    syllabus: 90
  }
];

export default function Faculty() {
  const { auth, setActivePage } = useERP();
  
  // Timetable view states
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [inspectedClass, setInspectedClass] = useState(null); // Inspected class modal/overlay

  // Resolve the logged-in teacher's academic catalog name
  const getLoggedInTeacherName = () => {
    if (!auth || !auth.name) return 'Dr. Evelyn Vance'; // Fallback
    const name = auth.name.toLowerCase();
    if (name.includes('evelyn') || name.includes('vance')) {
      if (name.includes('samantha')) {
        return 'Prof. Samantha Vance';
      }
      return 'Dr. Evelyn Vance';
    }
    if (name.includes('connor') || name.includes('sarah')) {
      return 'Dr. Sarah Connor';
    }
    if (name.includes('feynman') || name.includes('richard')) {
      return 'Prof. Richard Feynman';
    }
    if (name.includes('turing') || name.includes('alan')) {
      return 'Dr. Alan Turing';
    }
    return 'Dr. Evelyn Vance'; // Fallback to Dr. Evelyn Vance for students/admins so they see a realistic schedule
  };

  const loggedInTeacher = getLoggedInTeacherName();

  // Filter schedule strictly by the logged-in professor
  const filteredSchedule = SCHEDULE_DATA.filter(course => course.instructor === loggedInTeacher);

  const activeClassesCount = filteredSchedule.length;
  const totalCredits = filteredSchedule.reduce((sum, c) => sum + c.credits, 0);
  const totalStudents = filteredSchedule.reduce((sum, c) => sum + c.enrollment, 0);
  const avgSyllabus = filteredSchedule.length > 0
    ? Math.round(filteredSchedule.reduce((sum, c) => sum + c.syllabus, 0) / filteredSchedule.length)
    : 0;
  
  // Custom helpers to fetch cell slots matching day and time coordinates
  const getClassesForSlotAndDay = (slotId, dayName) => {
    return filteredSchedule.filter(course => 
      course.slot === slotId && course.days.includes(dayName)
    );
  };

  return (
    <div className="main-panel" style={{ color: '#1e1b4b', animation: 'pageFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      
      {/* Banner Heading */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(59, 130, 246, 0.04) 50%, #ffffff 100%)',
        padding: '2rem',
        border: '1px solid #f2ede2',
        borderRadius: '20px'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: '900' }}>
          My Classes & <span style={{ color: '#7c3aed' }}>Curriculum Schedule</span>
        </h2>
        <p style={{ margin: 0, color: '#7b7890', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '650px', fontWeight: '600' }}>
          Personalized academic lecture planner for {loggedInTeacher}. Manage classroom workloads, syllabus progression tracking, and student attendance logs.
        </p>
      </div>

      {/* Roster Controls: View toggles only (Active Roster line removed) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.25rem' }}>
        
        {/* View Mode controls */}
        <div style={{ display: 'flex', gap: '4px', background: '#fbfaf8', border: '1px solid #ebe7de', borderRadius: '10px', padding: '3px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              border: 'none',
              background: viewMode === 'grid' ? '#ffffff' : 'transparent',
              color: viewMode === 'grid' ? '#1e1b4b' : '#7b7890',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '750',
              boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(30, 27, 75, 0.04)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            🗓️ Timetable Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              border: 'none',
              background: viewMode === 'list' ? '#ffffff' : 'transparent',
              color: viewMode === 'list' ? '#1e1b4b' : '#7b7890',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '750',
              boxShadow: viewMode === 'list' ? '0 2px 6px rgba(30, 27, 75, 0.04)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            📋 List View
          </button>
        </div>

      </div>

      {/* KPI Stats widgets */}
      <div className="top-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
        <div className="glass-card stat-widget" style={{ background: '#ffffff', border: '1px solid #f2ede2', padding: '1.25rem', borderRadius: '16px' }}>
          <div className="stat-header" style={{ color: '#7b7890' }}>
            <span>ACTIVE CLASSES</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          </div>
          <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: 'initial', color: '#7c3aed', fontSize: '1.7rem' }}>
            {activeClassesCount}
          </div>
          <div className="stat-footer">Courses taught this semester</div>
        </div>

        <div className="glass-card stat-widget" style={{ background: '#ffffff', border: '1px solid #f2ede2', padding: '1.25rem', borderRadius: '16px' }}>
          <div className="stat-header" style={{ color: '#7b7890' }}>
            <span>CREDIT HOURS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: 'initial', color: '#10b981', fontSize: '1.7rem' }}>
            {totalCredits}
          </div>
          <div className="stat-footer">Total teaching credit weight</div>
        </div>

        <div className="glass-card stat-widget" style={{ background: '#ffffff', border: '1px solid #f2ede2', padding: '1.25rem', borderRadius: '16px' }}>
          <div className="stat-header" style={{ color: '#7b7890' }}>
            <span>TOTAL STUDENTS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: 'initial', color: '#3b82f6', fontSize: '1.7rem' }}>
            {totalStudents}
          </div>
          <div className="stat-footer">Combined student enrollment</div>
        </div>

        <div className="glass-card stat-widget" style={{ background: '#ffffff', border: '1px solid #f2ede2', padding: '1.25rem', borderRadius: '16px' }}>
          <div className="stat-header" style={{ color: '#7b7890' }}>
            <span>AVG SYLLABUS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          </div>
          <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: 'initial', color: '#ea580c', fontSize: '1.7rem' }}>
            {avgSyllabus}%
          </div>
          <div className="stat-footer">Average syllabus completion</div>
        </div>
      </div>

      {/* ── CORE TIMETABLE WEEKLY GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div 
          className="glass-card" 
          style={{ 
            background: '#ffffff', 
            border: '1px solid #f2ede2', 
            padding: '1.5rem', 
            borderRadius: '20px', 
            boxShadow: '0 8px 30px rgba(30, 27, 75, 0.02)',
            overflowX: 'auto',
            animation: 'pageFadeIn 0.3s ease-out'
          }}
        >
          {/* Main Grid Wrapper Table */}
          <div style={{ minWidth: '850px' }}>
            
            {/* Timetable Header Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '130px repeat(5, 1fr)', borderBottom: '1px solid #ebe7de', paddingBottom: '12px', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#7b7890', textTransform: 'uppercase', alignSelf: 'center', paddingLeft: '8px' }}>
                Time Schedule
              </div>
              {WEEKDAYS.map(day => (
                <div key={day} style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e1b4b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2px' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Timetable Slot Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {TIME_SLOTS.map(slot => (
                <div key={slot.id} style={{ display: 'grid', gridTemplateColumns: '130px repeat(5, 1fr)', minHeight: '94px', borderBottom: '1px dashed #f2ede2' }}>
                  
                  {/* Left Slot Details cell */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '850', color: '#1e1b4b' }}>
                      {slot.label}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#7b7890', textTransform: 'uppercase' }}>
                      {slot.name}
                    </span>
                  </div>

                  {/* Midweek scheduling cells mapping days */}
                  {WEEKDAYS.map(day => {
                    const cellClasses = getClassesForSlotAndDay(slot.id, day);

                    return (
                      <div 
                        key={day} 
                        style={{ 
                          borderRight: '1px dashed #f2ede2', 
                          padding: '4px', 
                          display: 'flex', 
                          flexDirection: 'column',
                          gap: '4px',
                          justifyContent: 'center',
                          position: 'relative',
                          background: cellClasses.length > 0 ? 'transparent' : 'rgba(251,250,248,0.3)'
                        }}
                      >
                        {cellClasses.map(course => (
                          <div
                            key={course.id}
                            onClick={() => setInspectedClass(course)}
                            style={{
                              background: course.gradient,
                              color: '#ffffff',
                              padding: '8px 10px',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              height: 'calc(100% - 10px)',
                              boxShadow: '0 4px 10px rgba(30, 27, 75, 0.05)',
                              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'scale(1.03)';
                              e.currentTarget.style.boxShadow = `0 6px 15px rgba(${course.accent === '#7c3aed' ? '124,58,237' : '13,148,136'}, 0.2)`;
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 4px 10px rgba(30, 27, 75, 0.05)';
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: '900', background: 'rgba(255,255,255,0.22)', padding: '2px 5px', borderRadius: '4px' }}>
                                  {course.id}
                                </span>
                                <span style={{ fontSize: '0.65rem', fontWeight: '800', opacity: 0.88 }}>
                                  🚪 {course.classroom}
                                </span>
                              </div>
                              <h5 style={{ margin: '6px 0 2px 0', fontSize: '0.78rem', fontWeight: '800', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {course.title}
                              </h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ── ALTERNATIVE DETAILED LIST VIEW ── */}
      {viewMode === 'list' && (
        <div 
          className="glass-card" 
          style={{ 
            background: '#ffffff', 
            border: '1px solid #f2ede2', 
            padding: '1.5rem', 
            borderRadius: '20px', 
            boxShadow: '0 8px 30px rgba(30, 27, 75, 0.02)',
            animation: 'pageFadeIn 0.3s ease-out'
          }}
        >
          <div className="table-header-container" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📋 Roster of Lecturing Blocks
            </h3>
          </div>

          <div className="table-responsive" style={{ border: '1px solid #f2ede2', background: '#fbfaf8' }}>
            <table className="erp-table" style={{ color: '#1e1b4b' }}>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Faculty Instructor</th>
                  <th>Location Room</th>
                  <th>Days & Lecture Time</th>
                  <th style={{ textAlign: 'right' }}>Enrolled Students</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#7b7890' }}>
                      No classes scheduled.
                    </td>
                  </tr>
                ) : (
                  filteredSchedule.map(course => (
                    <tr 
                      key={course.id} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setInspectedClass(course)}
                    >
                      <td style={{ fontWeight: '750', fontFamily: 'ui-monospace, monospace' }} className="item-id">
                        {course.id}
                      </td>
                      <td style={{ fontWeight: '750' }} className="item-name">{course.title}</td>
                      <td style={{ fontWeight: '600', color: '#7b7890' }}>{course.instructor}</td>
                      <td style={{ fontWeight: '700' }}>🚪 {course.classroom}</td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: course.bgLight,
                          color: course.accent,
                          border: `1px solid rgba(${course.accent === '#7c3aed' ? '124,58,237' : '13,148,136'}, 0.2)`
                        }}>
                          {course.days.join('/')} at Slot {course.slot} ({TIME_SLOTS.find(s => s.id === course.slot)?.label})
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: '#10b981' }}>
                        {course.enrollment} Enrolled
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PREMIUM INTERACTIVE INSPECTION OVERLAY MODAL ── */}
      {inspectedClass && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(30, 27, 75, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'pageFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }} onClick={() => setInspectedClass(null)}>
          
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #f2ede2',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 24px 60px rgba(30, 27, 75, 0.15)',
              overflow: 'hidden',
              animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Top Header banner */}
            <div style={{ background: inspectedClass.gradient, padding: '1.75rem 2rem', color: '#ffffff', position: 'relative' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '850', background: 'rgba(255,255,255,0.22)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                Course Blueprint
              </span>
              <h3 style={{ margin: '8px 0 2px 0', fontSize: '1.45rem', fontWeight: '900', color: '#ffffff' }}>
                {inspectedClass.id}: {inspectedClass.title}
              </h3>
              <p style={{ margin: 0, opacity: 0.85, fontSize: '0.8rem', fontWeight: '600' }}>
                Instructed by {inspectedClass.instructor}
              </p>

              {/* Close button X */}
              <button 
                onClick={() => setInspectedClass(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                ✕
              </button>
            </div>

            {/* Modal Body Stats & Details */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Detailed metrics grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                
                <div style={{ padding: '12px', background: '#fbfaf8', border: '1px solid #f2ede2', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: '750', color: '#7b7890', textTransform: 'uppercase' }}>Location Hall</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '850', color: '#1e1b4b', marginTop: '2px' }}>
                    🚪 {inspectedClass.classroom}
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#fbfaf8', border: '1px solid #f2ede2', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: '750', color: '#7b7890', textTransform: 'uppercase' }}>Roster Registry</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '850', color: '#1e1b4b', marginTop: '2px' }}>
                    👥 {inspectedClass.enrollment} Students
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#fbfaf8', border: '1px solid #f2ede2', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: '750', color: '#7b7890', textTransform: 'uppercase' }}>Academic Credits</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '850', color: '#1e1b4b', marginTop: '2px' }}>
                    ⚡ {inspectedClass.credits} CR Credits
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#fbfaf8', border: '1px solid #f2ede2', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: '750', color: '#7b7890', textTransform: 'uppercase' }}>Session Slot</span>
                  <div style={{ fontSize: '0.82rem', fontWeight: '850', color: '#1e1b4b', marginTop: '4px', lineHeight: '1.2' }}>
                    📅 {inspectedClass.days.join('/')} at {TIME_SLOTS.find(s => s.id === inspectedClass.slot)?.label}
                  </div>
                </div>

              </div>

              {/* Progress bar showing syllabus progression */}
              <div style={{ borderTop: '1px solid #f2ede2', paddingTop: '16px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '750', color: '#7b7890' }}>Syllabus Course Progress:</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '850', color: inspectedClass.accent }}>{inspectedClass.syllabus}% Completed</span>
                </div>
                <div style={{ height: '6px', background: '#f2ede2', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: inspectedClass.gradient, width: `${inspectedClass.syllabus}%`, borderRadius: '3px' }} />
                </div>
              </div>

              {/* Action buttons integrated with App routing */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  onClick={() => {
                    setActivePage('attendance');
                    setInspectedClass(null);
                  }}
                  className="chaart-btn-add"
                  style={{ flexGrow: 1, height: '40px', background: inspectedClass.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  📝 Mark Attendance
                </button>
                <button
                  onClick={() => {
                    setActivePage('fees'); // fees routes to Gradebook
                    setInspectedClass(null);
                  }}
                  className="chaart-btn-search"
                  style={{ width: '120px', height: '40px', fontSize: '0.78rem', fontWeight: '700', color: inspectedClass.accent, borderColor: inspectedClass.accent }}
                >
                  🏆 Gradebook
                </button>
              </div>

            </div>

          </div>

          <style>{`
            @keyframes modalSlideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>

        </div>
      )}

    </div>
  );
}
