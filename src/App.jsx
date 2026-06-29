import { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { auth, feedbackMessage, connectionStatus } = useERP();
  // Unauthenticated view: 'landing' (marketing site) or 'login' (sign-in)
  const [publicView, setPublicView] = useState('landing');

  if (!auth) {
    return (
      <div style={{ padding: 0 }}>
        {publicView === 'landing'
          ? <Landing onBookDemo={() => setPublicView('login')} />
          : <Login onBack={() => setPublicView('landing')} />}
        
        {/* Modern Top-Right Floating Notification Toast Center */}
        {feedbackMessage && (
          <div className="feedback-toast" style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '14px 24px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: '700',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: feedbackMessage.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(244, 63, 94, 0.95)',
            color: '#000',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <span style={{ fontSize: '1rem' }}>
              {feedbackMessage.type === 'success' ? '🛡️' : '⚠️'}
            </span>
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        <style>{`
          @keyframes toastSlideIn {
            from { transform: translateX(120%) translateY(0); opacity: 0; }
            to { transform: translateX(0) translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* Chaart Light-Mode Centered Layout */}
      <div className="chaart-app-wrapper" style={{ animation: 'pageFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <Dashboard />
      </div>

      {/* Modern Top-Right Floating Notification Toast Center */}
      {feedbackMessage && (
        <div className="feedback-toast" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '14px 24px',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: '700',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: feedbackMessage.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(244, 63, 94, 0.95)',
          color: '#000',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <span style={{ fontSize: '1rem' }}>
            {feedbackMessage.type === 'success' ? '🛡️' : '⚠️'}
          </span>
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Global Embedded Styles */}
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastSlideIn {
          from { transform: translateX(120%) translateY(0); opacity: 0; }
          to { transform: translateX(0) translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default function App() {
  return (
    <ERPProvider>
      <AppContent />
    </ERPProvider>
  );
}
