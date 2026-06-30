import { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Loader from './components/ui/Loader';

// ── Toast Notification Component ─────────────────────────────────
function Toast({ message }) {
  if (!message) return null;
  const isSuccess = message.type === 'success';
  return (
    <div className={`erp-toast ${isSuccess ? 'success' : 'error'}`}>
      <div className="erp-toast-icon">
        {isSuccess ? '✅' : '⚠️'}
      </div>
      <span style={{ flex: 1 }}>{message.text}</span>
    </div>
  );
}

// ── App Content ───────────────────────────────────────────────────
function AppContent() {
  const { auth, feedbackMessage } = useERP();
  const [publicView, setPublicView] = useState('landing');
  const [showPreloader, setShowPreloader] = useState(true);

  if (showPreloader) {
    return <Loader onComplete={() => setShowPreloader(false)} />;
  }

  // Unauthenticated — show landing or login
  if (!auth) {
    return (
      <div style={{ padding: 0 }}>
        {publicView === 'landing'
          ? <Landing onBookDemo={() => setPublicView('login')} triggerPreloader={() => setShowPreloader(true)} />
          : <Login onBack={() => setPublicView('landing')} />}
        <Toast message={feedbackMessage} />
      </div>
    );
  }

  // Authenticated — show dashboard shell
  return (
    <div className="chaart-app-wrapper" style={{ animation: 'page-fade-in 0.35s ease both' }}>
      <Dashboard />
      <Toast message={feedbackMessage} />
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <ERPProvider>
      <AppContent />
    </ERPProvider>
  );
}
