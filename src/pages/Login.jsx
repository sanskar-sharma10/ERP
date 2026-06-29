import { useState, useEffect, useRef } from 'react';
import { useERP } from '../context/ERPContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Login({ onBack }) {
  const { showFeedback } = useERP();
  const [portalType, setPortalType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Draggable floating cards — exactly 7 icons
  const CARD_ICONS = ['🎓', '📊', '📚', '💡', '👤', '🏫', '⚙️'];
  const [cardPos, setCardPos] = useState([
    { x: 610, y: 600 }, // 🎓 (bottom-middle)
    { x: 480, y: 240 }, // 📊 (middle-left)
    { x: 610, y: 50 }, // 📚 (top-middle)
    { x: 420, y: 510 }, // 💡 (lower-left)
    { x: 760, y: 220 }, // 👤 (top-right)
    { x: 630, y: 370 }, // 🏫 (center)
    { x: 820, y: 510 }, // ⚙️ (lower-right)
  ]);
  const dragRef = useRef(null); // { idx, ox, oy }

  useEffect(() => {
    // Dynamically calculate default positions on load relative to the screen size (perfect match for user screenshot)
    const w = window.innerWidth;
    const h = window.innerHeight;
    setCardPos([
      { x: w * 0.45, y: h * 0.83 }, // 🎓 (bottom-middle)
      { x: w * 0.28, y: h * 0.14 }, // 📊 (middle-left)
      { x: w * 0.45, y: h * 0.08 }, // 📚 (top-middle)
      { x: w * 0.36, y: h * 0.54 }, // 💡 (lower-left)
      { x: w * 0.56, y: h * 0.33 }, // 👤 (top-right)
      { x: w * 0.42, y: h * 0.33 }, // 🏫 (center)
      { x: w * 0.60, y: h * 0.71 }, // ⚙️ (lower-right)
    ]);

    const onMove = (e) => {
      if (!dragRef.current) return;
      const { idx, ox, oy } = dragRef.current;
      setCardPos(prev => {
        const next = [...prev];
        next[idx] = {
          x: Math.min(Math.max(0, e.clientX - ox), window.innerWidth - 48),
          y: Math.min(Math.max(0, e.clientY - oy), window.innerHeight - 48),
        };
        return next;
      });
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    if (portalType === 'student') {
      setEmail('student@univers-one.com');
      setPassword('student123');
    } else {
      setEmail('teacher@univers-one.com');
      setPassword('teacher123');
    }
  }, [portalType]);

  const startDrag = (idx, e) => {
    e.preventDefault();
    const pos = cardPos[idx];
    dragRef.current = { idx, ox: e.clientX - pos.x, oy: e.clientY - pos.y };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showFeedback('error', 'Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      if (email === 'admin@univers-one.com' && password === 'admin123') {
        localStorage.setItem('college_auth', JSON.stringify({
          name: 'Arthur Pendelton',
          email: 'admin@univers-one.com',
          role: 'System Administrator',
          token: 'jwt_mock_token_admin_2026',
        }));
        window.location.reload();
      } else if (email === 'student@univers-one.com' && password === 'student123') {
        localStorage.setItem('college_auth', JSON.stringify({
          name: 'Alexander Pierce',
          email: 'student@univers-one.com',
          role: 'Student Portal User',
          token: 'jwt_mock_token_student_2026',
        }));
        window.location.reload();
      } else if (email === 'teacher@univers-one.com' && password === 'teacher123') {
        localStorage.setItem('college_auth', JSON.stringify({
          name: 'Professor Evelyn Vance',
          email: 'teacher@univers-one.com',
          role: 'Senior Academic Faculty',
          token: 'jwt_mock_token_teacher_2026',
        }));
        window.location.reload();
      } else {
        showFeedback('error', 'Authentication failed. Check your credentials.');
        setIsSubmitting(false);
      }
    }, 900);
  };

  const stats = [
    { value: '99.9%', label: 'System Uptime' },
    { value: '25k+', label: 'Active Users' },
    { value: '150+', label: 'Enterprise Modules' },
  ];

  const modules = [
    { icon: '💼', name: 'Core Operations' },
    { icon: '👥', name: 'Human Capital' },
    { icon: '📊', name: 'Financial Intelligence' },
    { icon: '🛡️', name: 'System Security' },
  ];

  return (
    <>
      <style>{`
        /* ── Reset for login page ── */
        .lp-page {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow: hidden;
        }

        /* ══════════════════════════════
           LEFT PANEL — white, ERP info
        ══════════════════════════════ */
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg);   opacity: 0.55; }
          50%  { transform: translateY(-18px) rotate(6deg); opacity: 0.9; }
          100% { transform: translateY(0px) rotate(0deg);   opacity: 0.55; }
        }
        @keyframes floatSide {
          0%   { transform: translateX(0px) rotate(0deg);   opacity: 0.5; }
          50%  { transform: translateX(12px) rotate(-8deg); opacity: 0.85; }
          100% { transform: translateX(0px) rotate(0deg);   opacity: 0.5; }
        }

        .lp-left {
          position: relative;
          width: 65%;
          flex-shrink: 0;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem 3rem 2.5rem 4rem;
          box-sizing: border-box;
          overflow: hidden;
          z-index: 2;
          /* Convex outward curve on right edge — all coords within [0,1] */
          clip-path: url(#concaveClip);
        }

        /* Subtle decorative circles in the background */
        .lp-deco {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .lp-deco-1 {
          width: 420px; height: 420px;
          top: -120px; right: -80px;
          background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
        }
        .lp-deco-2 {
          width: 300px; height: 300px;
          bottom: -60px; left: -60px;
          background: radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%);
        }
        .lp-deco-3 {
          width: 180px; height: 180px;
          bottom: 120px; right: 60px;
          background: radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%);
        }

        /* ── Draggable floating cards (icon-only, position:fixed) ── */
        @keyframes floatCard {
          0%, 100% { box-shadow: 0 6px 20px rgba(99,102,241,0.07), 0 2px 6px rgba(99,102,241,0.03); }
          50%       { box-shadow: 0 12px 28px rgba(99,102,241,0.13), 0 4px 10px rgba(99,102,241,0.06); }
        }
        .lp-fcard {
          position: fixed;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(99,102,241,0.18);
          border-radius: 14px;
          font-size: 1.4rem;
          z-index: 99999;
          cursor: grab;
          user-select: none;
          animation: floatCard 3.8s ease-in-out infinite;
          transition: box-shadow 0.3s, transform 0.2s, border-color 0.3s;
        }
        .lp-fcard:hover {
          border-color: rgba(99,102,241,0.4);
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 16px 36px rgba(99,102,241,0.18), 0 6px 14px rgba(99,102,241,0.08);
        }
        .lp-fcard:active {
          cursor: grabbing;
          transform: scale(1.12);
          box-shadow: 0 8px 20px rgba(99,102,241,0.22);
        }

        /* Top brand bar */
        .lp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 2;
        }

        .lp-brand-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .lp-brand-text {
          display: flex;
          flex-direction: column;
        }

        .lp-brand-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e1b4b;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }

        .lp-brand-tagline {
          font-size: 0.72rem;
          color: #6366f1;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* Center hero content */
        .lp-hero {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem 0;
        }

        .lp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.18);
          color: #6366f1;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 1.25rem;
          width: fit-content;
        }

        .lp-hero-title {
          font-size: 2.65rem;
          font-weight: 850;
          color: #1e1b4b;
          line-height: 1.1;
          margin: 0 0 1rem 0;
          letter-spacing: -1.2px;
        }

        .lp-hero-title span {
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-hero-desc {
          font-size: 0.92rem;
          color: #4b5563;
          line-height: 1.65;
          margin: 0 0 2.25rem 0;
          max-width: 440px;
          letter-spacing: -0.1px;
        }

        /* Stats row */
        .lp-stats {
          display: flex;
          gap: 1.75rem;
          margin-bottom: 2.25rem;
          align-items: center;
        }

        .lp-stat {
          display: flex;
          flex-direction: column;
        }

        .lp-stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #1e1b4b, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-stat-label {
          font-size: 0.72rem;
          color: #6b7280;
          font-weight: 600;
          margin-top: 4px;
          letter-spacing: 0.1px;
        }

        .lp-stat-divider {
          width: 1.5px;
          height: 28px;
          background: linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.25) 30%, rgba(99, 102, 241, 0.25) 70%, transparent);
          align-self: center;
        }

        /* Module pills */
        .lp-modules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .lp-module-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(99, 102, 241, 0.04);
          border: 1px solid rgba(99, 102, 241, 0.08);
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #4338ca;
        }

        /* Bottom footer */
        .lp-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lp-footer-url {
          font-size: 0.72rem;
          color: #d1d5db;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .lp-footer-copy {
          font-size: 0.7rem;
          color: #d1d5db;
        }

        /* ══════════════════════════════
           RIGHT PANEL — gradient form
        ══════════════════════════════ */
        .lp-right {
          flex: 1;
          background: linear-gradient(160deg, #6366f1 0%, #7c3aed 50%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 4rem 3rem 16%;
          box-sizing: border-box;
          position: relative;
          z-index: 1;
          /* Slide behind the white bulge — purple starts at 43% of screen */
          margin-left: -22%;
        }

        /* Subtle pattern overlay on gradient */
        .lp-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .lp-form-wrap {
          width: 100%;
          max-width: 320px;
          position: relative;
          z-index: 1;
        }

        .lp-hello {
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255,255,255,0.75);
          margin: 0;
          line-height: 1.4;
        }

        .lp-greeting {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          margin: 2px 0 0.5rem 0;
          letter-spacing: -0.3px;
        }

        .lp-form-heading {
          font-size: 0.88rem;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          margin: 0 0 2rem 0;
        }

        .lp-form-heading span {
          color: #ffffff;
          font-weight: 700;
        }

        /* Divider line */
        .lp-divider {
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.15));
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }

        /* sliding portal tabs */
        .lp-portal-tabs {
          display: flex;
          position: relative;
          background: rgba(0, 0, 0, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 2rem;
          gap: 4px;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .lp-portal-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.65);
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          letter-spacing: 0.3px;
        }

        .lp-portal-tab.active {
          background: #ffffff;
          color: #6366f1;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06);
          transform: scale(1.02);
        }

        .lp-portal-tab:hover:not(.active) {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .lp-field { margin-bottom: 1.6rem; }

        .lp-label {
          display: block;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 6px;
          transition: color 0.3s;
        }
        .lp-field:focus-within .lp-label {
          color: #ffffff;
        }

        .lp-input {
          width: 100%;
          border: none;
          border-bottom: 1.5px solid rgba(255, 255, 255, 0.25);
          outline: none;
          padding: 8px 0;
          font-size: 0.98rem;
          color: #ffffff;
          background: transparent;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.3s, padding-left 0.3s;
        }
        .lp-input:focus {
          border-bottom-color: #ffffff;
          padding-left: 2px;
        }
        .lp-input::placeholder { color: rgba(255,255,255,0.3); }

        .lp-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .lp-remember-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          user-select: none;
        }

        /* Highly stylized custom checkbox */
        .lp-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border: 1.5px solid rgba(255, 255, 255, 0.5);
          border-radius: 4px;
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .lp-checkbox:checked {
          background: #ffffff;
          border-color: #ffffff;
        }
        .lp-checkbox:checked::after {
          content: '✓';
          font-size: 10px;
          color: #6366f1;
          font-weight: 800;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .lp-checkbox:hover {
          border-color: #ffffff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
        }

        .lp-forgot-btn {
          background: none;
          border: none;
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: color 0.2s;
        }
        .lp-forgot-btn:hover { color: #ffffff; }

        .lp-submit {
          width: 100%;
          height: 50px;
          background: #ffffff;
          color: #6366f1;
          border: none;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 850;
          letter-spacing: 2px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          margin-bottom: 1.25rem;
        }
        .lp-submit:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 12px 28px rgba(255, 255, 255, 0.25), 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .lp-submit:active:not(:disabled) {
          transform: translateY(0) scale(0.985);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .lp-create-row { text-align: center; }

        .lp-create-btn {
          background: none;
          border: none;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: color 0.2s;
        }
        .lp-create-btn:hover { color: #ffffff; text-decoration: underline; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .lp-page { flex-direction: column; overflow-y: auto; }
          .lp-left {
            width: 100%;
            padding: 2rem;
            min-height: auto;
            clip-path: none;
          }
          .lp-hero-title { font-size: 1.8rem; }
          .lp-stats { gap: 1.25rem; }
          .lp-right {
            border-radius: 32px 32px 0 0;
            padding: 2.5rem 2rem;
            margin-top: -32px;
            margin-left: 0;
          }
        }
      `}</style>

      {/* SVG clip-path: OUTWARD (convex) curve on white panel's right edge.
          Path: top-right at 77%, curves OUT to x=1.0 at midpoint, back to 77% at bottom.
          At element width 65%: top/bottom edge = 0.77*65% = 50% of screen.
          Middle bulge = ~0.94*65% = 61% of screen. All coords within [0,1]. */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="concaveClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 0.77,0 C 1.0,0.25 1.0,0.75 0.77,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ── Draggable fixed-position icon cards — z-index 99999, whole screen ── */}
      {CARD_ICONS.map((icon, idx) => (
        <div
          key={idx}
          className="lp-fcard"
          style={{ left: cardPos[idx].x, top: cardPos[idx].y }}
          onMouseDown={(e) => startDrag(idx, e)}
        >
          {icon}
        </div>
      ))}

      <div className="lp-page">

        {/* Back-to-home pill (only when invoked via "Book a Demo") */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              position: 'fixed',
              top: 20,
              left: 20,
              zIndex: 100000,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 999,
              border: '1px solid rgba(99,102,241,0.25)',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(10px)',
              color: '#4f46e5',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 8px 22px rgba(99,102,241,0.18)',
              fontFamily: 'inherit',
            }}
          >
            ← Back to Home
          </button>
        )}

        {/* ══ LEFT — white ERP info panel ══ */}
        <div className="lp-left">
          {/* Decorative background circles */}
          <div className="lp-deco lp-deco-1" />
          <div className="lp-deco lp-deco-2" />
          <div className="lp-deco lp-deco-3" />

          {/* Draggable icons rendered dynamically via fixed-position overlay above */}

          {/* Brand */}
          <div className="lp-brand">
            <div className="lp-brand-icon">
              <img src="/logo.png" alt="Univers-One logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className="lp-brand-text">
              <span className="lp-brand-name">Univers-One</span>
              <span className="lp-brand-tagline">Engineered by Optatech Innovation</span>
            </div>
          </div>

          {/* Hero */}
          <div className="lp-hero">

            <h1 className="lp-hero-title">
              Manage Your<br />
              Campus <span>Smarter</span>
            </h1>

            <p className="lp-hero-desc">
              An all-in-one command center for campus life. Seamlessly unify academic
              tracking, admissions, finances, and resources — all under a single secure gateway.
            </p>

            {/* Stats */}
            <div className="lp-stats">
              {stats.map((s, i) => (
                <>
                  <div className="lp-stat" key={s.label}>
                    <span className="lp-stat-value">{s.value}</span>
                    <span className="lp-stat-label">{s.label}</span>
                  </div>
                  {i < stats.length - 1 && <div className="lp-stat-divider" key={`d${i}`} />}
                </>
              ))}
            </div>

            {/* Module pills */}
            <div className="lp-modules">
              {modules.map((m) => (
                <div className="lp-module-pill" key={m.name}>
                  <span>{m.icon}</span>
                  <span>{m.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="lp-footer">
            <span className="lp-footer-url">www.optatech-innovations.com</span>
          </div>
        </div>

        {/* ══ RIGHT — gradient form panel ══ */}
        <div className="lp-right">
          <div className="lp-form-wrap">
            <p className="lp-hello">Hello !</p>
            <p className="lp-greeting">{getGreeting()}</p>
            <p className="lp-form-heading">
              Sign in to your <span>account</span>
            </p>
            <div className="lp-divider" />

            <div className="lp-portal-tabs">
              <button
                type="button"
                className={`lp-portal-tab ${portalType === 'student' ? 'active' : ''}`}
                onClick={() => setPortalType('student')}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className={`lp-portal-tab ${portalType === 'teacher' ? 'active' : ''}`}
                onClick={() => setPortalType('teacher')}
              >
                👨‍🏫 Teacher
              </button>
            </div>

            <form onSubmit={handleLogin} noValidate>
              <div className="lp-field">
                <label htmlFor="lp-email" className="lp-label">Email Address</label>
                <input
                  id="lp-email"
                  type="email"
                  className="lp-input"
                  placeholder="admin@univers-one.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="lp-field">
                <label htmlFor="lp-password" className="lp-label">Password</label>
                <input
                  id="lp-password"
                  type="password"
                  className="lp-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="lp-options">
                <label className="lp-remember-label">
                  <input
                    type="checkbox"
                    className="lp-checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="lp-forgot-btn"
                  onClick={() => showFeedback('error', 'Password recovery is managed by your system administrator.')}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="lp-submit" disabled={isSubmitting}>
                {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
              </button>

            </form>
          </div>
        </div>

      </div>
    </>
  );
}
