import { useState } from 'react';
import { useERP } from '../context/ERPContext';

// Define courses mapping aligned with ERP dataset major definitions
const COURSE_MAP = {
  'Computer Science': { 
    code: 'CS-301', 
    name: 'Advanced Algorithms', 
    theme: 'purple', 
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    bgLight: 'rgba(124, 58, 237, 0.08)',
    accent: '#7c3aed'
  },
  'Bio-Engineering': { 
    code: 'CS-101', 
    name: 'Introduction to AI', 
    theme: 'teal', 
    gradient: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
    bgLight: 'rgba(13, 148, 136, 0.08)',
    accent: '#0d9488'
  },
  'Quantum Physics': { 
    code: 'CS-202', 
    name: 'Software Engineering', 
    theme: 'orange', 
    gradient: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
    bgLight: 'rgba(251, 146, 60, 0.08)',
    accent: '#ea580c'
  },
  'Business Administration': { 
    code: 'CS-204', 
    name: 'Database Systems', 
    theme: 'blue', 
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    bgLight: 'rgba(59, 130, 246, 0.08)',
    accent: '#3b82f6'
  },
  'Information Security': { 
    code: 'CS-305', 
    name: 'Cybersecurity', 
    theme: 'rose', 
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
    bgLight: 'rgba(244, 63, 94, 0.08)',
    accent: '#f43f5e'
  }
};

// Deterministic mockup generators based on student criteria
const generateAttendance = (studentId) => {
  const dates = [
    '2026-05-18', '2026-05-15', '2026-05-13', '2026-05-11', '2026-05-08',
    '2026-05-06', '2026-05-04', '2026-05-01', '2026-04-29', '2026-04-27'
  ];
  return dates.map((date, idx) => {
    const code = (parseInt(studentId || '0', 10) + idx) % 10;
    let status = 'Present';
    if (code === 3) status = 'Late';
    if (code === 7) status = 'Absent';
    return { date, status, duration: '2 Hours' };
  });
};

const generateAssignments = (student, courseCode) => {
  const assignmentsMap = {
    'CS-301': ['Asymptotic Complexity Analysis', 'Divide and Conquer Recursion', 'Dynamic Programming Matrix', 'Graph Shortest Path Search', 'NP-Completeness Proofs'],
    'CS-101': ['Heuristic Search Strategies', 'Linear Regression Fit', 'Neural Network Feedforward', 'NLP Sentiment Classifier', 'Reinforcement Learning Gridworld'],
    'CS-202': ['Git Branching Strategy', 'Design Patterns Refactoring', 'Unit Testing Suite', 'CI/CD Pipeline Setup', 'Docker Containerization'],
    'CS-204': ['Relational Schema Normalization', 'SQL Join Optimizations', 'Index Indexing Tuning', 'NoSQL Document Mock', 'Transaction ACID Controls'],
    'CS-305': ['Symmetric Cryptography Lab', 'Buffer Overflow Mitigations', 'Wireshark Packet Analysis', 'RSA Cryptosystem Audit', 'Penetration Testing Scope']
  };
  const list = assignmentsMap[courseCode] || ['Lab Assignment 1', 'Lab Assignment 2', 'Midterm Project', 'Homework Sheet', 'Practical Review'];
  
  return list.map((name, idx) => {
    const seed = (parseInt(student.id || '0', 10) + idx) % 9;
    const deviation = seed - 4; // -4 to +4
    const score = Math.max(50, Math.min(100, student.grade + deviation));
    return { id: `ASG-${100 + idx}`, name, score, total: 100, status: 'Submitted' };
  });
};

const generateQuizzes = (student, courseCode) => {
  const quizzesMap = {
    'CS-301': ['Complexity Theory Quiz', 'Greedy Alg Quiz', 'Midterm Examination'],
    'CS-101': ['Search Algorithms Quiz', 'Perceptron Math Quiz', 'Midterm Examination'],
    'CS-202': ['SOLID Principles Quiz', 'MVC Architecture Quiz', 'Midterm Examination'],
    'CS-204': ['Entity-Relationship Quiz', 'SQL Aggregations Quiz', 'Midterm Examination'],
    'CS-305': ['Network Security Quiz', 'XSS Defenses Quiz', 'Midterm Examination']
  };
  const list = quizzesMap[courseCode] || ['Quiz 1', 'Quiz 2', 'Midterm Examination'];
  
  return list.map((name, idx) => {
    const seed = (parseInt(student.id || '0', 10) + idx * 2) % 7;
    const deviation = seed - 3; // -3 to +3
    const score = Math.max(50, Math.min(100, student.grade + deviation));
    
    const isExam = name.includes('Midterm') || name.includes('Final');
    const total = isExam ? 100 : 10;
    const scaledScore = isExam ? score : Math.round((score / 10) * 10) / 10;
    
    return { id: `QZ-${200 + idx}`, name, score: scaledScore, total };
  });
};

export default function Gradebook() {
  const { students, updateStudentGrade } = useERP();
  
  // Navigation states
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  
  // Tab states for Student Deep Record view
  const [activeTab, setActiveTab] = useState('assignments');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Score editor transient state
  const [editScore, setEditScore] = useState('');
  
  // ── DYNAMIC CALCULATIONS ──
  
  // Group student rosters by major classes
  const classesData = Object.entries(COURSE_MAP).map(([majorName, meta]) => {
    const roster = students.filter(st => st.major === majorName);
    const count = roster.length;
    const average = count > 0 
      ? Math.round(roster.reduce((acc, s) => acc + s.grade, 0) / count)
      : 0;
    
    const scores = roster.map(s => s.grade);
    const high = scores.length > 0 ? Math.max(...scores) : 0;
    const low = scores.length > 0 ? Math.min(...scores) : 0;

    return {
      major: majorName,
      code: meta.code,
      name: meta.name,
      theme: meta.theme,
      gradient: meta.gradient,
      bgLight: meta.bgLight,
      accent: meta.accent,
      studentsCount: count,
      averageGrade: average,
      highScore: high,
      lowScore: low,
      roster
    };
  });

  const activeClassData = selectedClass 
    ? classesData.find(c => c.code === selectedClass) 
    : null;

  const activeStudent = activeClassData && selectedStudentId
    ? activeClassData.roster.find(s => s.id === selectedStudentId)
    : null;

  const handleSelectStudent = (student) => {
    setSelectedStudentId(student.id);
    setEditScore(student.grade.toString());
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    const parsed = parseInt(editScore, 10);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      alert('Grade must be a valid number between 0 and 100.');
      return;
    }
    updateStudentGrade(activeStudent.id, parsed);
  };

  // Helper to resolve GPA letter badge
  const getGradeBadge = (score) => {
    if (score >= 96) return { text: 'A+', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
    if (score >= 90) return { text: 'A', bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' };
    if (score >= 85) return { text: 'B', bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' };
    if (score >= 80) return { text: 'C', bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' };
    return { text: 'Alert', bg: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' };
  };

  // Custom inline style utilities for visual consistency
  const styles = {
    flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    backBtn: {
      border: '1px solid #f2ede2',
      background: '#ffffff',
      color: '#1e1b4b',
      fontSize: '0.8rem',
      fontWeight: '700',
      padding: '8px 16px',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 6px rgba(30, 27, 75, 0.02)'
    }
  };

  // ── VIEW 3: STUDENT ACADEMIC RECORD DETAIL VIEW ──
  if (activeStudent && activeClassData) {
    const attendanceRecords = generateAttendance(activeStudent.id);
    const assignmentsRecords = generateAssignments(activeStudent, activeClassData.code);
    const quizzesRecords = generateQuizzes(activeStudent, activeClassData.code);
    
    const computedAttendanceRate = Math.round(
      (attendanceRecords.filter(r => r.status !== 'Absent').length / attendanceRecords.length) * 100
    );

    return (
      <div className="main-panel" style={{ animation: 'pageFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        
        {/* Header Breadcrumbs */}
        <div style={styles.flexBetween}>
          <button 
            style={styles.backBtn}
            onClick={() => setSelectedStudentId(null)}
            onMouseEnter={e => e.currentTarget.style.background = '#fbfaf8'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            ← Back to {activeClassData.code} Roster
          </button>
          
          <div style={{ fontSize: '0.8rem', color: '#7b7890', fontWeight: '600' }}>
            Gradebook Ledger &gt; {activeClassData.code} &gt; {activeStudent.name}
          </div>
        </div>

        {/* Dynamic Detail layout columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.75rem', marginTop: '0.5rem' }}>
          
          {/* LEFT COLUMN: Student Overview & Grade Adjuster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Student profile Card */}
            <div className="glass-card" style={{ border: '1px solid #f2ede2', padding: '1.5rem', background: '#ffffff', borderRadius: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                {/* Profile Circle with customized SVG icon based on initials */}
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: activeClassData.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: `2px solid ${activeClassData.accent}` }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: '800', color: activeClassData.accent }}>
                    {activeStudent.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '800', color: '#1e1b4b' }}>
                  {activeStudent.name}
                </h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#7b7890', fontWeight: '600' }}>
                  ID: #ST-{activeStudent.id} | {activeStudent.major}
                </p>

                {/* Score gauge with progress Ring */}
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '1rem 0' }}>
                  <svg width="120" height="120" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f2ede2" strokeWidth="8" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke={activeClassData.accent} 
                      strokeWidth="8" 
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * activeStudent.grade) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1e1b4b' }}>
                      {activeStudent.grade}%
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#7b7890', textTransform: 'uppercase' }}>
                      GPA Score
                    </span>
                  </div>
                </div>

                {/* Stats summaries */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginTop: '0.5rem', borderTop: '1px solid #f2ede2', paddingTop: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#7b7890', fontWeight: '700' }}>ATTENDANCE</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: computedAttendanceRate >= 90 ? '#10b981' : '#f59e0b' }}>
                      {computedAttendanceRate}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#7b7890', fontWeight: '700' }}>COURSE STATUS</div>
                    <div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: getGradeBadge(activeStudent.grade).bg,
                        color: getGradeBadge(activeStudent.grade).color
                      }}>
                        {getGradeBadge(activeStudent.grade).text}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Interactive Grade Adjuster Card */}
            <div className="glass-card" style={{ border: '1px solid #f2ede2', padding: '1.5rem', background: '#ffffff', borderRadius: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: '800', color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🛡️ Scholar Grade Adjuster
              </h4>
              <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.72rem', color: '#7b7890', lineHeight: '1.4' }}>
                Instantly adjust the student's term score. Changes sync immediately to all related summaries and modules.
              </p>

              <form onSubmit={handleSaveGrade}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                    style={{ flexGrow: 1, accentColor: activeClassData.accent, cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={editScore}
                      onChange={(e) => setEditScore(e.target.value)}
                      style={{
                        width: '56px',
                        textAlign: 'center',
                        fontWeight: '800',
                        color: '#1e1b4b',
                        padding: '6px',
                        border: '1.5px solid #ebe7de',
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                      }}
                    />
                    <span style={{ marginLeft: '4px', fontWeight: '800', fontSize: '0.85rem', color: '#1e1b4b' }}>%</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="chaart-btn-add" 
                  style={{ width: '100%', height: '38px', background: activeClassData.accent }}
                >
                  Confirm & Sync Grade
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT COLUMN: Nested deep records tabs list */}
          <div className="glass-card" style={{ border: '1px solid #f2ede2', padding: '1.5rem', background: '#ffffff', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Tab navigation headers */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #f2ede2', paddingBottom: '12px', marginBottom: '1.25rem' }}>
              <button
                onClick={() => setActiveTab('assignments')}
                style={{
                  border: 'none',
                  background: activeTab === 'assignments' ? activeClassData.bgLight : 'transparent',
                  color: activeTab === 'assignments' ? activeClassData.accent : '#7b7890',
                  padding: '8px 16px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                📋 Assignments ({assignmentsRecords.length})
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                style={{
                  border: 'none',
                  background: activeTab === 'quizzes' ? activeClassData.bgLight : 'transparent',
                  color: activeTab === 'quizzes' ? activeClassData.accent : '#7b7890',
                  padding: '8px 16px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ⚡ Quizzes & Tests ({quizzesRecords.length})
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                style={{
                  border: 'none',
                  background: activeTab === 'attendance' ? activeClassData.bgLight : 'transparent',
                  color: activeTab === 'attendance' ? activeClassData.accent : '#7b7890',
                  padding: '8px 16px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                📅 Class Attendance ({attendanceRecords.length})
              </button>
            </div>

            {/* TAB CONTENT: ASSIGNMENTS */}
            {activeTab === 'assignments' && (
              <div style={{ flexGrow: 1, animation: 'pageFadeIn 0.2s ease-out' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '800', color: '#1e1b4b' }}>
                  Assignments Ledger - {activeClassData.code}
                </h4>
                <div className="table-responsive" style={{ border: '1px solid #f2ede2', background: '#fbfaf8' }}>
                  <table className="erp-table" style={{ color: '#1e1b4b' }}>
                    <thead>
                      <tr>
                        <th>Assignment ID</th>
                        <th>Task / Title</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Score Achieved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignmentsRecords.map(a => (
                        <tr key={a.id}>
                          <td style={{ color: '#7b7890', fontFamily: 'ui-monospace, monospace' }}>#{a.id}</td>
                          <td style={{ fontWeight: '700' }}>{a.name}</td>
                          <td>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(16, 185, 129, 0.12)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}>
                              {a.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: '800', color: a.score >= 85 ? '#10b981' : a.score >= 75 ? '#3b82f6' : '#f43f5e' }}>
                            {a.score} / {a.total} ({Math.round((a.score/a.total)*100)}%)
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: QUIZZES */}
            {activeTab === 'quizzes' && (
              <div style={{ flexGrow: 1, animation: 'pageFadeIn 0.2s ease-out' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '800', color: '#1e1b4b' }}>
                  Quizzes & Exams Listing - {activeClassData.code}
                </h4>
                <div className="table-responsive" style={{ border: '1px solid #f2ede2', background: '#fbfaf8' }}>
                  <table className="erp-table" style={{ color: '#1e1b4b' }}>
                    <thead>
                      <tr>
                        <th>Quiz ID</th>
                        <th>Assessment Name</th>
                        <th>Type</th>
                        <th style={{ textAlign: 'right' }}>Grade Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzesRecords.map(q => {
                        const isExam = q.name.includes('Exam') || q.name.includes('Midterm');
                        return (
                          <tr key={q.id}>
                            <td style={{ color: '#7b7890', fontFamily: 'ui-monospace, monospace' }}>#{q.id}</td>
                            <td style={{ fontWeight: '700' }}>{q.name}</td>
                            <td>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: isExam ? 'rgba(124, 58, 237, 0.12)' : 'rgba(6, 182, 212, 0.12)',
                                color: isExam ? '#7c3aed' : '#06b6d4'
                              }}>
                                {isExam ? 'EXAM' : 'QUIZ'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: '800' }}>
                              <span style={{ color: activeStudent.grade >= 85 ? '#10b981' : '#f59e0b' }}>
                                {q.score}
                              </span>
                              <span style={{ color: '#7b7890', fontWeight: '600' }}>
                                 / {q.total}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ATTENDANCE */}
            {activeTab === 'attendance' && (
              <div style={{ flexGrow: 1, animation: 'pageFadeIn 0.2s ease-out' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '800', color: '#1e1b4b' }}>
                  Class Session Attendance Register
                </h4>
                <div className="table-responsive" style={{ border: '1px solid #f2ede2', background: '#fbfaf8' }}>
                  <table className="erp-table" style={{ color: '#1e1b4b' }}>
                    <thead>
                      <tr>
                        <th>Lecture Date</th>
                        <th>Assigned Hours</th>
                        <th style={{ textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((r, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '700' }}>{r.date}</td>
                          <td style={{ color: '#7b7890' }}>{r.duration}</td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              background: r.status === 'Present' ? 'rgba(16, 185, 129, 0.12)' : r.status === 'Late' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                              color: r.status === 'Present' ? '#10b981' : r.status === 'Late' ? '#f59e0b' : '#f43f5e',
                              border: r.status === 'Present' ? '1px solid rgba(16, 185, 129, 0.2)' : r.status === 'Late' ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)'
                            }}>
                              {r.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    );
  }

  // ── VIEW 2: CLASS ROSTER LIST VIEW ──
  if (activeClassData) {
    const filteredRoster = activeClassData.roster.filter(st =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="main-panel" style={{ animation: 'pageFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        
        {/* Header Navigation */}
        <div style={styles.flexBetween}>
          <button 
            style={styles.backBtn}
            onClick={() => { setSelectedClass(null); setSearchQuery(''); }}
            onMouseEnter={e => e.currentTarget.style.background = '#fbfaf8'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            ← Back to Class Ledger
          </button>
          
          <div style={{ fontSize: '0.8rem', color: '#7b7890', fontWeight: '600' }}>
            Gradebook Ledger &gt; {activeClassData.code} ({activeClassData.name})
          </div>
        </div>

        {/* Class Banner Card with gradient background */}
        <div className="glass-card" style={{
          background: activeClassData.gradient,
          padding: '2rem',
          color: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 12px 30px rgba(30, 27, 75, 0.15)'
        }}>
          <div style={styles.flexBetween}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Lecture Division
              </span>
              <h2 style={{ margin: '8px 0 4px 0', fontSize: '1.8rem', fontWeight: '900' }}>
                {activeClassData.code}: {activeClassData.name}
              </h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontWeight: '600' }}>
                Primary Cohort Major: {activeClassData.major}
              </p>
            </div>
            
            {/* Round Class Metric Indicator */}
            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', padding: '1rem 1.5rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: '750', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Class Average</div>
              <div style={{ fontSize: '2rem', fontWeight: '950' }}>{activeClassData.averageGrade}%</div>
            </div>
          </div>
        </div>

        {/* KPI metrics row for the selected class */}
        <div className="top-stats-grid">
          <div className="glass-card stat-widget" style={{ background: '#ffffff', border: '1px solid #f2ede2', borderRadius: '16px', padding: '1.25rem' }}>
            <div className="stat-header" style={{ color: '#7b7890' }}>
              <span>ENROLLED STUDENTS</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeClassData.accent} strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: 'initial', color: '#1e1b4b' }}>
              {activeClassData.studentsCount} Students
            </div>
            <div className="stat-footer">Active academic matriculations</div>
          </div>

          <div className="glass-card stat-widget" style={{ background: '#ffffff', border: '1px solid #f2ede2', borderRadius: '16px', padding: '1.25rem' }}>
            <div className="stat-header" style={{ color: '#7b7890' }}>
              <span>HIGHEST GPA SCORE</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </div>
            <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: 'initial', color: '#10b981' }}>
              {activeClassData.highScore}%
            </div>
            <div className="stat-footer">Top student standing grade</div>
          </div>

          <div className="glass-card stat-widget" style={{ background: '#ffffff', border: '1px solid #f2ede2', borderRadius: '16px', padding: '1.25rem' }}>
            <div className="stat-header" style={{ color: '#7b7890' }}>
              <span>LOWEST STANDING GRADE</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
            </div>
            <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: 'initial', color: activeClassData.lowScore < 85 ? '#f43f5e' : '#1e1b4b' }}>
              {activeClassData.lowScore}%
            </div>
            <div className="stat-footer">Lowest cohort grade threshold</div>
          </div>
        </div>

        {/* Student roster Table */}
        <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #f2ede2', padding: '1.5rem', borderRadius: '20px' }}>
          
          <div className="table-header-container" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              👥 Academic Roster and GPA Listing
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="🔍 Search student name..."
                className="form-control"
                style={{ maxWidth: '220px', border: '1.5px solid #ebe7de', borderRadius: '10px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => {
                  const headers = 'Name,Major,Grade,Attendance';
                  const rows = activeClassData.roster.map(s => {
                    const att = generateAttendance(s.id);
                    const rate = Math.round((att.filter(r => r.status !== 'Absent').length / att.length) * 100);
                    return `${s.name},${s.major},${s.grade}%,${rate}%`;
                  });
                  const csv = [headers, ...rows].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${activeClassData.code}_grades.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{ height: '36px', padding: '0 14px', background: 'rgba(5,150,105,.08)', border: '1px solid rgba(5,150,105,.2)', borderRadius: '9px', color: '#059669', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export CSV
              </button>
            </div>
          </div>

          <div className="table-responsive" style={{ border: '1px solid #f2ede2', background: '#fbfaf8' }}>
            <table className="erp-table" style={{ color: '#1e1b4b' }}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Rank ID</th>
                  <th>Student Name</th>
                  <th>Core Program Major</th>
                  <th>Attendance Rating</th>
                  <th>Current GPA</th>
                  <th style={{ textAlign: 'right', width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#7b7890' }}>
                      No student records match the search.
                    </td>
                  </tr>
                ) : (
                  filteredRoster.map((st) => {
                    const status = getGradeBadge(st.grade);
                    const localAttendance = generateAttendance(st.id);
                    const attendanceRate = Math.round(
                      (localAttendance.filter(r => r.status !== 'Absent').length / localAttendance.length) * 100
                    );

                    return (
                      <tr key={st.id} style={{ cursor: 'pointer' }} onClick={() => handleSelectStudent(st)}>
                        <td style={{ color: '#7b7890', fontFamily: 'ui-monospace, monospace' }}>#ST-{st.id}</td>
                        <td style={{ fontWeight: '750' }}>{st.name}</td>
                        <td><span style={{ fontSize: '0.8rem', color: '#7b7890', fontWeight: '600' }}>{st.major}</span></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: attendanceRate >= 90 ? '#10b981' : '#f59e0b' }}></div>
                            <span style={{ fontWeight: '600', fontSize: '0.82rem' }}>{attendanceRate}% Present</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: status.bg,
                              color: status.color
                            }}>
                              {status.text}
                            </span>
                            <span style={{ fontWeight: '800' }}>{st.grade}%</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="chaart-btn-add" 
                            style={{ height: '30px', padding: '0 12px', fontSize: '0.75rem', background: activeClassData.accent }}
                            onClick={() => handleSelectStudent(st)}
                          >
                            Open Records
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    );
  }

  // ── VIEW 1: PROFESSOR CLASSES GRID SELECTOR VIEW ──
  return (
    <div className="main-panel" style={{ animation: 'pageFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      
      {/* Banner / Title Area */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(59, 130, 246, 0.04) 50%, #ffffff 100%)',
        padding: '2rem',
        border: '1px solid #f2ede2',
        borderRadius: '20px'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: '900', color: '#1e1b4b' }}>
          Interactive Academic <span style={{ color: '#7c3aed' }}>Gradebook Ledger</span>
        </h2>
        <p style={{ margin: 0, color: '#7b7890', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '650px', fontWeight: '600' }}>
          Direct management console for syllabus cohorts. Select a course below to review matriculations, inspect detailed homework/quiz journals, and log grades.
        </p>
      </div>

      {/* Grid of Taught Classes */}
      <h3 style={{ margin: '1rem 0 0 0', fontSize: '1.1rem', fontWeight: '800', color: '#1e1b4b' }}>
        🏫 Active Lecture Cohorts ({classesData.length})
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
        {classesData.map((cls) => {
          // Grade distribution for histogram
          const dist = {
            'A+/A': cls.roster.filter(s => s.grade >= 90).length,
            'B':    cls.roster.filter(s => s.grade >= 80 && s.grade < 90).length,
            'C':    cls.roster.filter(s => s.grade >= 70 && s.grade < 80).length,
            'D/F':  cls.roster.filter(s => s.grade < 70).length,
          };
          const maxDist = Math.max(...Object.values(dist), 1);
          const total = cls.roster.length || 1;
          return (
            <div 
              key={cls.code}
              onClick={() => setSelectedClass(cls.code)}
              style={{
                borderRadius: '20px',
                border: '1px solid #f2ede2',
                background: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(30, 27, 75, 0.03)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = cls.accent;
                e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#f2ede2';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 27, 75, 0.03)';
              }}
            >
              
              {/* Card top banner */}
              <div style={{ background: cls.gradient, padding: '1.25rem 1.5rem', color: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: '850', background: 'rgba(255,255,255,0.22)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {cls.code} Course
                    </span>
                    <h4 style={{ margin: '8px 0 0 0', fontSize: '1.1rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.3' }}>
                      {cls.name}
                    </h4>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', borderRadius: '10px', padding: '8px 14px', textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', lineHeight: '1' }}>{cls.averageGrade}%</div>
                    <div style={{ fontSize: '0.58rem', fontWeight: '700', opacity: .8, marginTop: '2px' }}>CLASS AVG</div>
                  </div>
                </div>
              </div>

              {/* Card stats body */}
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                
                <div style={styles.flexBetween}>
                  <span style={{ fontSize: '0.78rem', color: '#7b7890', fontWeight: '600' }}>Enrolled:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e1b4b' }}>{cls.studentsCount} Students</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid #f2ede2', paddingTop: '10px' }}>
                  <div style={{ textAlign: 'center', padding: '6px', background: '#fafaf8', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.58rem', color: '#7b7890', fontWeight: '700', textTransform: 'uppercase' }}>Lowest</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: cls.lowScore < 70 ? '#e11d48' : '#1e1b4b' }}>{cls.lowScore}%</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '6px', background: '#fafaf8', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.58rem', color: '#7b7890', fontWeight: '700', textTransform: 'uppercase' }}>Highest</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#10b981' }}>{cls.highScore}%</div>
                  </div>
                </div>

                {/* Grade distribution histogram */}
                {cls.roster.length > 0 && (
                  <div style={{ borderTop: '1px solid #f2ede2', paddingTop: '10px' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '0.62rem', fontWeight: '700', color: '#7b7890', textTransform: 'uppercase', letterSpacing: '.5px' }}>Grade Distribution</p>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '40px' }}>
                      {Object.entries(dist).map(([grade, count]) => {
                        const gradeColors = { 'A+/A':'#059669','B':'#3b82f6','C':'#d97706','D/F':'#e11d48' };
                        const pct = Math.round((count/total)*100);
                        return (
                          <div key={grade} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                            <span style={{ fontSize: '0.55rem', fontWeight: '700', color: '#94a3b8' }}>{pct}%</span>
                            <div style={{ width: '100%', height: `${Math.max(4, (count/maxDist)*30)}px`, background: gradeColors[grade], borderRadius: '3px 3px 0 0', opacity: .85, transition: 'height .4s ease', minHeight: '4px' }} />
                            <span style={{ fontSize: '0.52rem', fontWeight: '800', color: '#64748b' }}>{grade}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
