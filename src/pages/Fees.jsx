import { useERP } from '../context/ERPContext';

export default function Fees() {
  const { students } = useERP();

  // Dynamically calculate average grade from students registry
  const totalStudents = students.length;
  const averageGrade = totalStudents > 0 
    ? Math.round(students.reduce((sum, st) => sum + st.grade, 0) / totalStudents)
    : 85;

  const academicHonors = students.filter(st => st.grade >= 92).length;
  const academicAlerts = students.filter(st => st.grade < 85).length;
  
  // Mock gradebook journals postings
  const gradebookJournal = [
    { id: 'GRD-9021', date: '2026-05-17', desc: 'Semester Midterm - CS-301 (Advanced Algorithms)', type: 'exam', average: '88.5%', course: 'Computer Science' },
    { id: 'GRD-9020', date: '2026-05-16', desc: 'Neural Network Quiz - CS-101 (Intro to AI)', type: 'quiz', average: '82.0%', course: 'Intro to AI' },
    { id: 'GRD-9019', date: '2026-05-15', desc: 'Architecture Project - CS-202 (Software Engineering)', type: 'project', average: '91.2%', course: 'Software Eng' },
    { id: 'GRD-9018', date: '2026-05-14', desc: 'SQL Normalization Lab - CS-204 (Database Systems)', type: 'lab', average: '85.0%', course: 'Database Systems' },
    { id: 'GRD-9017', date: '2026-05-12', desc: 'Cryptography Assignment - CS-305 (Cybersecurity)', type: 'assignment', average: '89.4%', course: 'Cybersecurity' }
  ];

  return (
    <div className="main-panel">
      {/* Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(18, 20, 32, 0.8) 100%)',
        padding: '2rem'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>
          Gradebook Ledger & <span style={{ color: 'var(--accent-emerald)' }}>Scholastic Reports</span>
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '650px' }}>
          Real-time analysis of student grade entries, class averages, honors list distributions, and active academic alerts.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="top-stats-grid">
        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>CLASS AVERAGE GRADE</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div className="stat-value">{averageGrade}%</div>
          <div className="stat-footer">Direct average across roster</div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>TOTAL STUDENT ENROLLED</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>
          </div>
          <div className="stat-value">{totalStudents} Students</div>
          <div className="stat-footer">Derived dynamically from active list</div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>ACADEMIC HONORS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <div className="stat-value">{academicHonors} Students</div>
          <div className="stat-footer">Roster members with GPA ≥ 92%</div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>ACADEMIC WARNINGS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rose)" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2" ry="2" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
          </div>
          <div className="stat-value" style={{ color: academicAlerts > 0 ? 'var(--accent-rose)' : 'inherit' }}>
            {academicAlerts} Warnings
          </div>
          <div className="stat-footer">Roster members with GPA &lt; 85%</div>
        </div>
      </div>

      {/* Ledger lists */}
      <div className="glass-card">
        <h3 className="panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          Assignment Grade Posting Logs
        </h3>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Detailed ledger listing assignment postings, course directories, grading types, and aggregate average results.
        </p>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Evaluation Date</th>
                <th>Posting Description</th>
                <th>Course Division</th>
                <th>Evaluation Type</th>
                <th style={{ textAlign: 'right' }}>Class Average</th>
              </tr>
            </thead>
            <tbody>
              {gradebookJournal.map((entry) => (
                <tr key={entry.id}>
                  <td className="item-id">#{entry.id}</td>
                  <td>{entry.date}</td>
                  <td style={{ fontWeight: '600' }}>{entry.desc}</td>
                  <td><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{entry.course}</span></td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: 'var(--accent-emerald)',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      {entry.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ 
                    textAlign: 'right', 
                    fontWeight: '700',
                    color: 'var(--accent-emerald)'
                  }}>
                    {entry.average}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
