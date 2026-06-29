export default function HR() {
  // Static high-fidelity staffing records for display
  const employees = [
    { id: 'EMP-102', name: 'Dr. Sarah Connor', role: 'Chief AI Biodiversity Architect', dept: 'Research & Model Design', salary: 14500, status: 'Active' },
    { id: 'EMP-103', name: 'James Carter', role: 'Lead GIS Server Admin', dept: 'System Infrastructure', salary: 9200, status: 'Active' },
    { id: 'EMP-104', name: 'Elena Rostova', role: 'Financial Comptroller', dept: 'Finance & Ledger', salary: 8500, status: 'Active' },
    { id: 'EMP-105', name: 'David Kim', role: 'Full-Stack Software Engineer', dept: 'Product Engineering', salary: 7800, status: 'Active' },
    { id: 'EMP-106', name: 'Samantha Vance', role: 'Client Relations Officer', dept: 'Sales & Support', salary: 6500, status: 'On Leave' }
  ];

  const totalHeadcount = employees.length;
  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const activeDepartments = 5;
  const avgMonthlySalary = Math.round(totalMonthlyPayroll / totalHeadcount);

  return (
    <div className="main-panel">
      {/* HR Header Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(18, 20, 32, 0.8) 100%)',
        padding: '2rem'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>
          Staffing Matrix & <span style={{ color: 'var(--accent-purple)' }}>Payroll Systems</span>
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '650px' }}>
          Coordinate employee rosters, payroll budgets, contractor hourly pools, and divisional staffing distributions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="top-stats-grid">
        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>TOTAL STAFF HEADCOUNT</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="stat-value">{totalHeadcount}</div>
          <div className="stat-footer">Active personnel accounts</div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>MONTHLY PAYROLL DEBIT</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="stat-value">${totalMonthlyPayroll.toLocaleString()}</div>
          <div className="stat-footer">Recurring operating salaries</div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>ACTIVE DEPARTMENTS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
          </div>
          <div className="stat-value">{activeDepartments}</div>
          <div className="stat-footer">Organized divisional hubs</div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>AVERAGE BASE SALARY</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="stat-value">${avgMonthlySalary.toLocaleString()}</div>
          <div className="stat-footer">Average monthly payment limit</div>
        </div>
      </div>

      {/* Staff Roster Matrix */}
      <div className="glass-card">
        <h3 className="panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Enterprise Personnel Roster
        </h3>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Detailed view of contract configurations, department alignments, and base compensation allocations.
        </p>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Enterprise Title</th>
                <th>Division Department</th>
                <th>Base Monthly</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="item-id">{emp.id}</td>
                  <td className="item-name">{emp.name}</td>
                  <td>{emp.role}</td>
                  <td><span className="category-badge" style={{ background: 'rgba(192, 132, 252, 0.15)', color: 'var(--accent-purple)', borderColor: 'rgba(192, 132, 252, 0.2)' }}>{emp.dept}</span></td>
                  <td style={{ fontWeight: '600' }}>${emp.salary.toLocaleString()}/mo</td>
                  <td className="action-cell">
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: emp.status === 'Active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(192, 132, 252, 0.12)',
                      color: emp.status === 'Active' ? 'var(--accent-emerald)' : 'var(--accent-purple)',
                      border: emp.status === 'Active' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(192, 132, 252, 0.2)'
                    }}>
                      {emp.status}
                    </span>
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
