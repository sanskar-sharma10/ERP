import { useERP } from '../context/ERPContext';

export default function Finance() {
  const { inventory } = useERP();

  // Sum valuations from inventory
  const assetsValuation = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const totalOperatingCapital = 1250000;
  const liquidCash = 450320.15;
  const receivables = 189200.00;

  // Static high fidelity transactions for display
  const ledgerEntries = [
    { id: 'TX-4091', date: '2026-05-16', desc: 'Asset Acquisition (Server Hardware)', type: 'debit', amount: 4999.99, account: 'Asset Pool A' },
    { id: 'TX-4090', date: '2026-05-15', desc: 'Client License Sale - AI Model Suite', type: 'credit', amount: 12990.00, account: 'Receivable Core' },
    { id: 'TX-4089', date: '2026-05-14', desc: 'Satellite Imagery Monthly API Cost', type: 'debit', amount: 450.00, account: 'Operational Ops' },
    { id: 'TX-4088', date: '2026-05-12', desc: 'AWS Node Hosting Infrastructure', type: 'debit', amount: 1200.00, account: 'Operational Ops' },
    { id: 'TX-4087', date: '2026-05-10', desc: 'Global BioMap Enterprise Contract', type: 'credit', amount: 85000.00, account: 'Contract Revenue' }
  ];

  return (
    <div className="main-panel">
      {/* Finance Header Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(18, 20, 32, 0.8) 100%)',
        padding: '2rem'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>
          Ledger & <span style={{ color: 'var(--accent-emerald)' }}>Capital Allocation</span>
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '650px' }}>
          Real-time oversight of operations expenses, asset pools, software amortization, and invoice receipts.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="top-stats-grid">
        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>OPERATING CAPITAL</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="stat-value">${totalOperatingCapital.toLocaleString()}</div>
          <div className="stat-footer">Total liquid allocation limits</div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>HARDWARE/SW ASSETS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          </div>
          <div className="stat-value">${assetsValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="stat-footer">Calculated from dynamic resource inventory</div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>LIQUID CASH BALANCE</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="stat-value">${liquidCash.toLocaleString()}</div>
          <div className="stat-footer">Escrow and operational reserves</div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-header">
            <span>ACCOUNTS RECEIVABLES</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
          </div>
          <div className="stat-value">${receivables.toLocaleString()}</div>
          <div className="stat-footer">Outstanding client invoices billed</div>
        </div>
      </div>

      {/* Ledger Entries Matrix */}
      <div className="glass-card">
        <h3 className="panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Recent Journal Postings
        </h3>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Detailed record of financial debits and credits written to double-entry ledgers.
        </p>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Posting Date</th>
                <th>Description</th>
                <th>Ledger Account</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="item-id">#{entry.id}</td>
                  <td>{entry.date}</td>
                  <td style={{ fontWeight: '600' }}>{entry.desc}</td>
                  <td><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{entry.account}</span></td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: entry.type === 'credit' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                      color: entry.type === 'credit' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                      border: entry.type === 'credit' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)'
                    }}>
                      {entry.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ 
                    textAlign: 'right', 
                    fontWeight: '700',
                    color: entry.type === 'credit' ? 'var(--accent-emerald)' : 'var(--text-primary)'
                  }}>
                    {entry.type === 'credit' ? '+' : '-'}${entry.amount.toFixed(2)}
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
