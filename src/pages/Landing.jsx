import { useState, useEffect } from 'react';

/**
 * Univers-One landing page.
 * Designed to share the exact visual language of the Login screen:
 * indigo→violet→purple gradient, white surfaces with hairline indigo borders,
 * eyebrow pills, gradient stat numbers, and floating glass icon cards.
 *
 * Every "Book a Demo" / "Get Started" CTA invokes `onBookDemo` to flip
 * the parent view to the existing Login screen.
 */
export default function Landing({ onBookDemo, triggerPreloader }) {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    // Style root and body for landing page
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.classList.add('lp-landing-root');
    }
    document.body.classList.add('lp-landing-body');

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);

    return () => {
      if (rootEl) {
        rootEl.classList.remove('lp-landing-root');
      }
      document.body.classList.remove('lp-landing-body');
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goto = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setNavOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'modules', label: 'Modules' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ];

  const stats = [
    { value: '99.9%', label: 'System Uptime' },
    { value: '25k+', label: 'Active Users' },
    { value: '150+', label: 'Enterprise Modules' },
    { value: '24/7', label: 'Expert Support' },
  ];

  const modulePills = [
    { icon: '💼', name: 'Core Operations' },
    { icon: '👥', name: 'Human Capital' },
    { icon: '📊', name: 'Financial Intelligence' },
    { icon: '🛡️', name: 'System Security' },
  ];

  const features = [
    { icon: '🎓', title: 'Academics', desc: 'Curriculum, lesson plans, syllabus tracking, and a unified digital library across every department.' },
    { icon: '📝', title: 'Admissions', desc: 'Online enquiries, applications, and seamless onboarding for incoming students and parents.' },
    { icon: '🗓️', title: 'Attendance', desc: 'Biometric, RFID, and manual attendance with real-time alerts to parents and class teachers.' },
    { icon: '💳', title: 'Fees & Billing', desc: 'Automated invoices, online payments, and flexible installment plans tailored to your campus.' },
    { icon: '📈', title: 'Examinations', desc: 'Schedule exams, build report cards, and publish results in one continuous workflow.' },
    { icon: '🚌', title: 'Transport', desc: 'GPS-tracked buses, route planning, and driver dashboards for total operational visibility.' },
    { icon: '🏠', title: 'Hostel', desc: 'Manage rooms, allocations, and resident records across every hostel and block you operate.' },
    { icon: '📚', title: 'Library', desc: 'Catalog, lend, and return — with dues and reservations handled automatically online.' },
    { icon: '💬', title: 'Communication', desc: 'In-app chat, SMS, and email blasts to reach parents and staff in seconds, not hours.' },
  ];

  const benefits = [
    { icon: '🪄', title: 'Easy to Use', desc: 'Clean, opinionated UI gets your team productive on day one — no prior ERP experience required.' },
    { icon: '🔐', title: 'Secured Backup', desc: 'Encrypted backups protect your data from accidental loss, corruption, or unauthorized access.' },
    { icon: '📑', title: 'Powerful Reporting', desc: '200+ ready reports across academics, finance, and operations at the click of a button.' },
    { icon: '☁️', title: 'Fully Cloud Based', desc: 'Unlimited storage on the cloud. Access your campus from anywhere, on any device, any time.' },
    { icon: '💸', title: 'Saves Money', desc: 'A single unified platform replaces a dozen tools, so there\'s no need to buy additional software.' },
    { icon: '⏱️', title: 'Saves Time', desc: 'Automate administrative and non-administrative tasks so staff can focus on students, not paperwork.' },
    { icon: '🧩', title: 'Choose Plans', desc: 'Affordable, modular plans let you pick exactly what your institution needs today and tomorrow.' },
    { icon: '🎯', title: 'Training & Support', desc: 'Complete onboarding and continuous training so your team gets started in no time, hassle-free.' },
  ];

  const steps = [
    { num: '01', title: 'Setup in days, not months', desc: 'Guided onboarding, data import, and dedicated training delivered by Optatech specialists.' },
    { num: '02', title: 'Configure your modules', desc: 'Pick the modules that matter and tailor every workflow to the rhythm of your campus.' },
    { num: '03', title: 'Go live with confidence', desc: '24×7 support, secure cloud, and continuous updates ship in the background — forever.' },
  ];

  const testimonials = [
    {
      quote: 'Univers-One is incredibly helpful for school data management with a user-friendly interface. It fulfils every requirement of our institution and has lifted our day-to-day operations completely.',
      name: 'Dr. Alistair Vance',
      role: 'Dean of Academic Affairs · CSI Institute of Legal Studies',
      avatarSrc: '/dean_avatar.png',
    },
    {
      quote: 'The major benefit is being able to manage our campus digitally. Before Univers-One, every task was manual. Now everything from admissions to finance is automated and hassle-free.',
      name: 'Deepak Khaitan',
      role: 'Managing Director · Sunshine Worldwide School',
      avatar: '🏫',
    },
    {
      quote: 'Communication with parents has been transformed completely. Real-time updates, transparent fees, and instant notifications have made our school feel modern and trustworthy.',
      name: 'Anita Mehta',
      role: 'Vice Principal · Bright Horizons Academy',
      avatar: '🌟',
    },
  ];

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const allSearchable = [
    ...features.map(f => ({ title: f.title, desc: f.desc, type: 'Feature', sectionId: 'features' })),
    ...navLinks.map(n => ({ title: n.label, desc: `Navigate to the ${n.label} section.`, type: 'Section', sectionId: n.id })),
    { title: 'Core Operations', desc: 'Manage basic academic, student, and admin records.', type: 'Module', sectionId: 'modules' },
    { title: 'Human Capital', desc: 'HR management, payroll, and faculty allocation.', type: 'Module', sectionId: 'modules' },
    { title: 'Financial Intelligence', desc: 'Fee collections, accounting, and financial reports.', type: 'Module', sectionId: 'modules' },
    { title: 'System Security', desc: 'Role-based access control, security logs, and backups.', type: 'Module', sectionId: 'modules' }
  ];

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = allSearchable.filter(
      item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  const partners = ['NORTHWOOD', 'GLENVIEW', 'SUNRISE', 'OAKMONT', 'EVERGREEN', 'STAFFORD', 'JEPPIAAR', 'LE COLE', 'AL FITRAH', 'BRIGHT'];

  return (
    <div className="lp-landing">
      <style>{LANDING_STYLES}</style>

      {/* ═══════════════════════════════════════════════════
         HEADER — sticky glass with gradient brand mark
      ═══════════════════════════════════════════════════ */}
      <header className={`u1-header ${scrolled ? 'u1-header-scrolled' : ''}`}>
        <div className="u1-container u1-header-inner">
          <button className="u1-brand" onClick={() => goto('home')} aria-label="Univers-One home">
            <span className="u1-brand-mark">
              <img src="/logo.png" alt="Univers-One logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </span>
            <span className="u1-brand-text">
              <span className="u1-brand-name">Univers-One</span>
              <span className="u1-brand-tag">Engineered by Optatech Innovation</span>
            </span>
          </button>

          <nav className={`u1-nav ${navOpen ? 'u1-nav-open' : ''}`}>
            {navLinks.map((l) => (
              <button key={l.id} className="u1-nav-link" onClick={() => goto(l.id)}>
                {l.label}
              </button>
            ))}
          </nav>

          <div className="u1-header-actions" style={{ position: 'relative' }}>
            {searchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid var(--u1-line)', borderRadius: '20px', padding: '2px 8px 2px 14px', gap: '8px', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }} className="u1-search-input-wrap">
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'var(--u1-ink)', fontSize: '0.85rem', fontWeight: '600', outline: 'none', width: '130px' }}
                  autoFocus
                  onBlur={() => {
                    // Slight delay so click on result is registered
                    setTimeout(() => {
                      if (!searchQuery) setSearchOpen(false);
                    }, 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                />
                <button className="u1-search-btn" aria-label="Close Search" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', color: 'var(--u1-ink)', width: 'auto', height: 'auto', fontSize: '0.75rem' }}>
                  ✕
                </button>
              </div>
            ) : (
              <>
                <span className="u1-search-text" style={{ cursor: 'pointer' }} onClick={() => setSearchOpen(true)}>Search</span>
                <button className="u1-search-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
                  🔍
                </button>
              </>
            )}

            {/* Search Results Dropdown */}
            {searchOpen && searchQuery && searchResults.length > 0 && (
              <div className="u1-search-dropdown" style={{ position: 'absolute', top: '48px', right: '0', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--u1-line-soft)', boxShadow: 'var(--u1-shadow-2)', width: '320px', maxHeight: '350px', overflowY: 'auto', zIndex: 1000, padding: '8px 0', animation: 'dropdownFadeIn 0.2s ease-out' }}>
                <div style={{ padding: '4px 16px 8px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--u1-soft)', borderBottom: '1px solid var(--u1-line-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Search Results ({searchResults.length})
                </div>
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      goto(res.sectionId);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}
                    className="u1-search-item"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--u1-ink)' }}>{res.title}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', background: 'var(--u1-tint-2)', color: 'var(--u1-brand-deep)', padding: '2px 6px', borderRadius: '6px' }}>{res.type}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--u1-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.desc}</div>
                  </button>
                ))}
              </div>
            )}
            {searchOpen && searchQuery && searchResults.length === 0 && (
              <div className="u1-search-dropdown" style={{ position: 'absolute', top: '48px', right: '0', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--u1-line-soft)', boxShadow: 'var(--u1-shadow-2)', width: '320px', zIndex: 1000, padding: '24px 16px', textAlign: 'center', color: 'var(--u1-soft)', fontSize: '0.82rem' }}>
                🔍 No results found for "{searchQuery}"
              </div>
            )}
          </div>

          <button className="u1-burger" aria-label="Menu" onClick={() => setNavOpen((v) => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════
         HERO — white left, gradient right (echoes Login)
      ═══════════════════════════════════════════════════ */}
      <section id="home" className="u1-hero">
        <div className="u1-hero-bg-curve" />

        <div className="u1-container u1-hero-grid">
          <div className="u1-hero-copy">
            <h1 className="u1-h1">
              Manage Your<br />
              Campus Smarter.
            </h1>
            <p className="u1-lede">
              An all-in-one command center for campus life. Seamlessly unify academic
              tracking, admissions, finances, and resources — all under a single secure gateway.
            </p>

            <div className="u1-hero-actions">
              <button className="u1-btn u1-btn-hero-primary" onClick={() => goto('features')}>
                Learn More
              </button>
              <button className="u1-btn u1-btn-hero-secondary" onClick={onBookDemo}>
                Download
              </button>
            </div>
          </div>

          {/* Right showcase — clean isometric laptop mockup */}
          <div className="u1-hero-showcase">
            <img
              src="/hero_dashboard_mockup.png"
              alt="Univers-One ERP Analytics Console Mockup"
              className="u1-hero-image"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         ABOUT / DIGITIZE — split layout
      ═══════════════════════════════════════════════════ */}
      <section id="about" className="u1-section">
        <div className="u1-container u1-split">
          <div className="u1-split-visual">
            <img
              src="/exam_medal.png"
              alt="Univers-One Student Academic Transcript Mockup"
              className="u1-mock-image-card"
            />
            <div className="u1-mock-pill u1-mock-pill-top">🎓 25,420 Students</div>
            <div className="u1-mock-pill u1-mock-pill-bottom">💰 ₹ 12.4 Cr collected</div>
          </div>

          <div className="u1-split-copy">
            <span className="u1-eyebrow">Why Univers-One</span>
            <h2 className="u1-h2">Digitize your School with a <span className="u1-grad">Smart ERP</span></h2>
            <p className="u1-body">
              Univers-One is a cloud-based platform with 40+ modules built to simplify every
              operation. Designed around the diverse needs of educational institutions, it
              delivers tailored interfaces for parents, teachers, drivers, and administrators —
              so every routine task gets a measurable lift.
            </p>
            <ul className="u1-bullets">
              <li><span>✓</span> 40+ modules covering every department</li>
              <li><span>✓</span> Dedicated portals for students, parents, and staff</li>
              <li><span>✓</span> Real-time analytics and 200+ ready reports</li>
              <li><span>✓</span> Bank-grade security with automated backups</li>
            </ul>
            <div className="u1-hero-actions">
              <button className="u1-btn u1-btn-primary" onClick={onBookDemo}>Book a Demo</button>
              <button className="u1-btn u1-btn-outline" onClick={() => goto('pricing')}>Download Brochure</button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         FEATURES — 9 module cards
      ═══════════════════════════════════════════════════ */}
      <section id="features" className="u1-section u1-section-tinted">
        <div className="u1-container">
          <div className="u1-heading">
            <span className="u1-eyebrow">★ Smart Features</span>
            <h2 className="u1-h2">Built around <span className="u1-grad">every department</span></h2>
            <p className="u1-body u1-body-center">
              Univers-One is an award-winning school management system with 12+ years of
              experience offering a fully automated cloud solution. Enjoy a polished experience
              on desktop and mobile — with 40+ modules to manage day-to-day operations.
            </p>
          </div>

          <div id="modules" className="u1-feature-grid">
            {features.map((f) => (
              <div key={f.title} className="u1-feature">
                <div className="u1-feature-icon">{f.icon}</div>
                <h3 className="u1-feature-title">{f.title}</h3>
                <p className="u1-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="u1-center">
            <button className="u1-btn u1-btn-primary" onClick={onBookDemo}>See All Features</button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section className="u1-section">
        <div className="u1-container u1-split u1-split-reverse">
          <div className="u1-split-copy">
            <span className="u1-eyebrow">★ How it works</span>
            <h2 className="u1-h2">From manual to <span className="u1-grad">magical</span> in three steps</h2>
            <p className="u1-body">
              Eliminate paperwork and manual processes — from onboarding admissions to ongoing
              academic activities like meetings, projects, assignments, and attendance.
            </p>
            <div className="u1-steps">
              {steps.map((s) => (
                <div key={s.num} className="u1-step">
                  <span className="u1-step-num">{s.num}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="u1-btn u1-btn-primary" onClick={onBookDemo}>Book a Demo</button>
          </div>

          <div className="u1-split-visual">
            <img
              src="/faculty_illustration.png"
              alt="Univers-One Faculty Timetable Schedule"
              className="u1-mock-image-card"
            />
            <div className="u1-mock-pill u1-mock-pill-top">👨‍🏫 Faculty Live</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         BENEFITS GRID
      ═══════════════════════════════════════════════════ */}
      <section id="pricing" className="u1-section u1-section-tinted">
        <div className="u1-container">
          <div className="u1-heading">
            <span className="u1-eyebrow">★ Smart Benefits</span>
            <h2 className="u1-h2">Built to deliver <span className="u1-grad">measurable results</span></h2>
          </div>
          <div className="u1-benefit-grid">
            {benefits.map((b) => (
              <div key={b.title} className="u1-benefit">
                <div className="u1-benefit-icon">{b.icon}</div>
                <h3 className="u1-benefit-title">{b.title}</h3>
                <p className="u1-benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         GRADIENT CTA — same gradient as Login's right panel
      ═══════════════════════════════════════════════════ */}
      <section className="u1-cta-banner">
        <div className="u1-cta-glow u1-cta-glow-1" />
        <div className="u1-cta-glow u1-cta-glow-2" />
        <div className="u1-container u1-cta-grid">
          <div>
            <span className="u1-eyebrow u1-eyebrow-light">★ Ready when you are</span>
            <h2 className="u1-h2 u1-h2-light">Save money &amp; time. Make better, faster decisions.</h2>
            <p className="u1-body u1-body-light">
              Implement Univers-One and watch the quality time, money, and resources you save.
              Your school in your fingertips — anytime, anywhere.
            </p>
          </div>
          <div className="u1-cta-actions">
            <button className="u1-btn u1-btn-light" onClick={onBookDemo}>
              Book a Demo <span className="u1-arrow">→</span>
            </button>
            <button className="u1-btn u1-btn-glass" onClick={onBookDemo}>Sign In</button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <section className="u1-section">
        <div className="u1-container">
          <div className="u1-heading">
            <span className="u1-eyebrow">★ Customer Stories</span>
            <h2 className="u1-h2">Loved by <span className="u1-grad">principals</span> &amp; <span className="u1-grad">administrators</span></h2>
          </div>
          <div className="u1-testi-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="u1-testi">
                <div className="u1-testi-mark">"</div>
                <p className="u1-testi-quote">{t.quote}</p>
                <div className="u1-testi-author">
                  {t.avatarSrc ? (
                    <img src={t.avatarSrc} alt={t.name} className="u1-testi-avatar-img" />
                  ) : (
                    <div className="u1-testi-avatar">{t.avatar}</div>
                  )}
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         PARTNERS
      ═══════════════════════════════════════════════════ */}
      <section className="u1-section u1-section-tinted">
        <div className="u1-container">
          <div className="u1-heading">
            <span className="u1-eyebrow">★ Trusted Partners</span>
            <h2 className="u1-h2">Powering schools across the world</h2>
          </div>
          <div className="u1-marquee">
            <div className="u1-marquee-track">
              {[...partners, ...partners].map((p, i) => (
                <span key={i} className="u1-partner">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer id="contact" className="u1-footer">
        <div className="u1-container u1-footer-grid">
          <div>
            <div className="u1-brand">
              <span className="u1-brand-mark">✦</span>
              <span className="u1-brand-text">
                <span className="u1-brand-name">Univers-One</span>
                <span className="u1-brand-tag">Engineered by Optatech Innovation</span>
              </span>
            </div>
            <p className="u1-footer-desc">
              An all-in-one command center for campus life. Seamlessly unify academics,
              admissions, finance, and resources under a single secure gateway.
            </p>
          </div>

          <div>
            <h4>Product</h4>
            <button onClick={() => goto('features')}>Features</button>
            <button onClick={() => goto('modules')}>Modules</button>
            <button onClick={() => goto('pricing')}>Pricing</button>
            <button onClick={onBookDemo}>Book a Demo</button>
          </div>

          <div>
            <h4>Company</h4>
            <button onClick={() => goto('about')}>About</button>
            <button onClick={onBookDemo}>Sign In</button>
            <a href="#">Careers</a>
            <a href="#">Privacy</a>
          </div>

          <div>
            <h4>Contact</h4>
            <a href="mailto:hello@univers-one.com">hello@univers-one.com</a>
            <a href="tel:+919846504233">+91 98465 04233</a>
            <a href="tel:+971542504233">+971 54 250 4233</a>
            <div className="u1-socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Twitter">x</a>
            </div>
          </div>
        </div>

        <div className="u1-container u1-footer-bottom">
          <span>© {new Date().getFullYear()} Univers-One — Engineered by Optatech Innovation. All rights reserved.</span>
          <span className="u1-footer-url">www.optatech-innovations.com</span>
        </div>
      </footer>

      {/* Floating Demo Trigger for Preloader */}
      {triggerPreloader && (
        <button 
          onClick={triggerPreloader}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            background: 'rgba(99, 102, 241, 0.95)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.4)';
          }}
        >
          <span>⚡</span> Replay Preloader
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Styles — share the exact tokens used in Login.jsx so the two screens
   feel like one continuous product.
════════════════════════════════════════════════════════════════════════════ */
const LANDING_STYLES = `
/* Reset the project's dark global theme so the landing fills white with grid pattern */
body.lp-landing-body {
  --color: #E1E1E1;
  background-color: #ffffff !important;
  background-image: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent),
      linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent) !important;
  background-size: 55px 55px !important;
  color: #1e1b4b !important;
  overflow-x: hidden;
}
#root.lp-landing-root {
  max-width: none !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
}

.lp-landing {
  --u1-brand: #6366f1;
  --u1-brand-2: #7c3aed;
  --u1-brand-3: #a855f7;
  --u1-brand-deep: #4f46e5;
  --u1-grad-mark: linear-gradient(135deg, #6366f1, #a855f7);
  --u1-grad-text: linear-gradient(135deg, #4f46e5, #9333ea);
  --u1-grad-panel: linear-gradient(160deg, #6366f1 0%, #7c3aed 50%, #a855f7 100%);
  --u1-grad-num: linear-gradient(135deg, #1e1b4b, #6366f1);
  --u1-ink: #1e1b4b;
  --u1-muted: #4b5563;
  --u1-soft: #6b7280;
  --u1-line: rgba(99, 102, 241, 0.18);
  --u1-line-soft: rgba(99, 102, 241, 0.12);
  --u1-tint: rgba(99, 102, 241, 0.04);
  --u1-tint-2: rgba(99, 102, 241, 0.08);
  --u1-shadow-1: 0 8px 22px rgba(99, 102, 241, 0.10);
  --u1-shadow-2: 0 18px 42px rgba(99, 102, 241, 0.18);

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--u1-ink);
  background: transparent !important;
  line-height: 1.65;
  letter-spacing: -0.1px;
}
.lp-landing *, .lp-landing *::before, .lp-landing *::after { box-sizing: border-box; }
.lp-landing button { font-family: inherit; }

.u1-container { max-width: 1240px; margin: 0 auto; padding: 0 28px; }

/* ───────── Eyebrow pill (matches Login) ───────── */
.u1-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--u1-tint-2);
  border: 1px solid var(--u1-line);
  color: var(--u1-brand);
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
  padding: 6px 14px; border-radius: 999px;
  margin-bottom: 16px;
}
.u1-eyebrow-light {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.28);
  color: #ffffff;
}

/* ───────── Headings ───────── */
.u1-h1 {
  font-size: 3.2rem; line-height: 1.05; letter-spacing: -1.4px;
  font-weight: 850; color: var(--u1-ink); margin: 0 0 18px;
}
.u1-h2 {
  font-size: 2.3rem; line-height: 1.15; letter-spacing: -0.8px;
  font-weight: 800; color: var(--u1-ink); margin: 0 0 14px;
}
.u1-h2-light { color: #ffffff; }
.u1-grad {
  background: var(--u1-grad-text);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.u1-lede { font-size: 1.05rem; color: var(--u1-muted); margin: 0 0 28px; max-width: 540px; }
.u1-body { font-size: 0.98rem; color: var(--u1-muted); margin: 0 0 22px; line-height: 1.7; }
.u1-body-light { color: rgba(255, 255, 255, 0.88); }
.u1-body-center { text-align: center; max-width: 740px; margin: 0 auto 36px; }
.u1-heading { text-align: center; margin-bottom: 56px; }
.u1-center { text-align: center; margin-top: 48px; }

/* ───────── Buttons ───────── */
.u1-btn {
  display: inline-flex; align-items: center; gap: 10px;
  border: none; cursor: pointer;
  padding: 14px 26px; border-radius: 14px;
  font-size: 0.92rem; font-weight: 750; letter-spacing: 0.2px;
  transition: transform 0.2s, box-shadow 0.25s, background 0.25s, color 0.25s, border-color 0.25s;
}
.u1-btn-primary {
  background: var(--u1-grad-panel);
  color: #ffffff;
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.36);
}
.u1-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(99, 102, 241, 0.45); }
.u1-btn-ghost { background: var(--u1-tint-2); color: var(--u1-brand-deep); }
.u1-btn-ghost:hover { background: rgba(99, 102, 241, 0.16); }
.u1-btn-outline { background: transparent; color: var(--u1-brand-deep); border: 1.5px solid var(--u1-line); }
.u1-btn-outline:hover { background: var(--u1-tint); border-color: rgba(99, 102, 241, 0.4); }
.u1-btn-light { background: #ffffff; color: var(--u1-brand-deep); box-shadow: 0 14px 32px rgba(0, 0, 0, 0.18); }
.u1-btn-light:hover { transform: translateY(-2px); box-shadow: 0 22px 44px rgba(0, 0, 0, 0.22); }
.u1-btn-glass {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(8px);
}
.u1-btn-glass:hover { background: rgba(255, 255, 255, 0.2); }
.u1-arrow { transition: transform 0.2s; display: inline-block; }
.u1-btn:hover .u1-arrow, .u1-cta:hover .u1-arrow { transform: translateX(3px); }

/* ───────── Header ───────── */
.u1-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.u1-header-scrolled {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: var(--u1-line-soft);
  box-shadow: 0 12px 30px rgba(15, 12, 41, 0.05);
}

/* Curve-aware text colors when not scrolled at top */
.u1-header:not(.u1-header-scrolled) .u1-brand-name {
  color: #ffffff;
}
.u1-header:not(.u1-header-scrolled) .u1-brand-tag {
  color: rgba(255, 255, 255, 0.7);
}
.u1-header:not(.u1-header-scrolled) .u1-brand-mark {
  background: transparent;
  box-shadow: none;
}
.u1-header:not(.u1-header-scrolled) .u1-nav-link {
  color: rgba(255, 255, 255, 0.85);
}
.u1-header:not(.u1-header-scrolled) .u1-nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
}
.u1-search-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--u1-ink);
  transition: color 0.3s;
}
.u1-header:not(.u1-header-scrolled) .u1-search-text {
  color: var(--u1-ink); /* search sits on the right side over white background */
}
.u1-search-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--u1-ink);
  color: #ffffff;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: transform 0.2s, background-color 0.3s;
}
.u1-search-btn:hover {
  transform: scale(1.05);
}
.u1-header-inner {
  display: flex; align-items: center; justify-content: space-between;
  height: 78px; gap: 28px;
}
.u1-brand {
  display: inline-flex; align-items: center; gap: 12px;
  background: none; border: none; cursor: pointer; padding: 0;
}
.u1-brand-mark {
  width: 44px; height: 44px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 1.2rem; flex-shrink: 0;
}
.u1-brand-text { display: flex; flex-direction: column; align-items: flex-start; gap: 1px; }
.u1-brand-name {
  font-size: 1.08rem; font-weight: 800; color: var(--u1-ink); line-height: 1.15; letter-spacing: -0.3px;
}
.u1-brand-tag {
  font-size: 0.66rem; color: var(--u1-brand);
  font-weight: 700; letter-spacing: 1.1px; text-transform: uppercase;
}
.u1-nav { display: flex; align-items: center; gap: 4px; margin-right: auto; margin-left: 48px; }
.u1-nav-link {
  background: none; border: none; cursor: pointer;
  padding: 9px 14px; border-radius: 10px;
  font-size: 0.9rem; font-weight: 600; color: var(--u1-muted);
  transition: color 0.2s, background 0.2s;
}
.u1-nav-link:hover { color: var(--u1-brand-deep); background: var(--u1-tint); }
.u1-header-actions { display: flex; align-items: center; gap: 12px; }
.u1-link {
  background: none; border: none; cursor: pointer;
  font-size: 0.9rem; font-weight: 700; color: var(--u1-ink);
  padding: 8px 12px;
}
.u1-link:hover { color: var(--u1-brand-deep); }
.u1-cta {
  display: inline-flex; align-items: center; gap: 8px;
  border: none; cursor: pointer;
  padding: 12px 22px; border-radius: 999px;
  background: var(--u1-grad-panel);
  color: #ffffff; font-weight: 750; font-size: 0.88rem;
  box-shadow: 0 10px 26px rgba(99, 102, 241, 0.34);
  transition: transform 0.2s, box-shadow 0.2s;
}
.u1-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(99, 102, 241, 0.44); }
.u1-burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 8px; }
.u1-burger span { width: 22px; height: 2px; background: var(--u1-ink); border-radius: 2px; }

/* ───────── Hero ───────── */
.u1-hero {
  position: relative;
  background: transparent;
  padding: 180px 0 130px;
  overflow: hidden;
}

.u1-hero-bg-curve {
  position: absolute;
  top: 0;
  left: 0;
  width: 62vw;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 40%, #1d4ed8 70%, #1e1b4b 100%);
  border-bottom-right-radius: 100% 90%;
  z-index: 0;
  pointer-events: none;
}

@media (max-width: 1024px) {
  .u1-hero-bg-curve {
    width: 100%;
    border-bottom-right-radius: 0;
  }
}

.u1-hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 56px;
  align-items: center;
  position: relative;
  z-index: 1;
}

/* Hero copy left side */
.u1-hero-copy {
  color: #ffffff;
  position: relative;
  z-index: 2;
}
.u1-hero-copy .u1-h1 {
  color: #ffffff;
  font-size: 3.8rem;
  line-height: 1.1;
  letter-spacing: -1.8px;
  font-weight: 850;
  margin-bottom: 22px;
}
.u1-hero-copy .u1-lede {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.15rem;
  line-height: 1.7;
  margin-bottom: 38px;
}

.u1-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 0;
}

.u1-btn-hero-primary {
  background-color: #4f51c4;
  color: #ffffff;
  border-radius: 9999px;
  padding: 16px 36px;
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 10px 25px rgba(79, 81, 196, 0.35);
  border: none;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.25s, box-shadow 0.25s;
}
.u1-btn-hero-primary:hover {
  background-color: #3b3db0;
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(79, 81, 196, 0.45);
}
.u1-btn-hero-secondary {
  background-color: #121424;
  color: #ffffff;
  border-radius: 9999px;
  padding: 16px 36px;
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 10px 25px rgba(18, 20, 36, 0.35);
  border: none;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.25s, box-shadow 0.25s;
}
.u1-btn-hero-secondary:hover {
  background-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(18, 20, 36, 0.45);
}
.u1-stats {
  display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 28px;
}
.u1-stats-cell { display: flex; align-items: center; gap: 8px; }
.u1-stat { display: flex; flex-direction: column; gap: 4px; }
.u1-stat-value {
  font-size: 1.7rem; font-weight: 850; line-height: 1; letter-spacing: -0.6px;
  background: var(--u1-grad-num);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.u1-stat-label {
  font-size: 0.7rem; color: var(--u1-soft); font-weight: 700;
  letter-spacing: 0.4px; text-transform: uppercase;
}
.u1-stat-divider {
  width: 1.5px; height: 30px;
  background: linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.28) 30%, rgba(99, 102, 241, 0.28) 70%, transparent);
  margin: 0 14px;
}
.u1-modules { display: flex; flex-wrap: wrap; gap: 10px; }
.u1-module-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--u1-tint);
  border: 1px solid var(--u1-line-soft);
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 0.8rem; font-weight: 700; color: var(--u1-brand-deep);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.u1-module-pill:hover { background: var(--u1-tint-2); border-color: var(--u1-line); transform: translateY(-1px); }

/* Hero showcase right side — gradient panel echoing Login */
.u1-hero-showcase { position: relative; padding-left: 40px; }
.u1-showcase-panel {
  position: relative;
  background: var(--u1-grad-panel);
  border-radius: 32px;
  padding: 32px;
  box-shadow: 0 40px 90px rgba(99, 102, 241, 0.28), 0 12px 28px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.u1-showcase-panel::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.16) 0%, transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.10) 0%, transparent 45%);
}
.u1-showcase-glow {
  position: absolute; inset: -40px; pointer-events: none;
  background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.22), transparent 60%);
  filter: blur(40px);
  z-index: -1;
}

/* Floating glass icon cards (same as Login) */
@keyframes u1-float-card {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50%     { transform: translateY(-10px) rotate(3deg); }
}
.u1-fcard {
  position: absolute; z-index: 3;
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(99, 102, 241, 0.18);
  border-radius: 14px;
  font-size: 1.4rem;
  box-shadow: 0 10px 28px rgba(15, 12, 41, 0.18);
  animation: u1-float-card 4s ease-in-out infinite;
  backdrop-filter: blur(10px);
}
.u1-fcard-1 { top: -16px; left: 12px; animation-delay: 0s; }
.u1-fcard-2 { top: 22%; right: -22px; animation-delay: -1s; }
.u1-fcard-3 { bottom: 30%; left: -22px; animation-delay: -2s; }
.u1-fcard-4 { bottom: -16px; right: 18%; animation-delay: -3s; }
.u1-fcard-5 { top: -18px; right: 32%; animation-delay: -1.5s; }

/* ───────── Real Mockup Images ───────── */
.u1-hero-image {
  width: 105%;
  height: auto;
  margin-left: auto;
  display: block;
  position: relative;
  z-index: 2;
}

.u1-mock-image-card {
  width: 110%;
  max-width: 440px;
  height:330px;  
  border-radius: 22px;
  box-shadow: var(--u1-shadow-2);
  border: 1px solid var(--u1-line-soft);
  display: block;
  background: #ffffff;
}

.u1-testi-avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 18px rgba(99, 102, 241, 0.28);
}

/* ───────── Inline dashboard mockup ───────── */
.u1-dash {
  position: relative; z-index: 2;
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 30px 60px rgba(15, 12, 41, 0.22);
}
.u1-dash-top {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 16px;
  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid var(--u1-line-soft);
}
.u1-dash-dots { display: flex; gap: 6px; }
.u1-dash-dots span { width: 11px; height: 11px; border-radius: 50%; background: #e5e7eb; }
.u1-dash-dots span:nth-child(1) { background: #ef4444; }
.u1-dash-dots span:nth-child(2) { background: #f59e0b; }
.u1-dash-dots span:nth-child(3) { background: #10b981; }
.u1-dash-url {
  flex: 1; padding: 6px 14px; border-radius: 8px;
  background: #ffffff; border: 1px solid var(--u1-line-soft);
  font-size: 0.72rem; color: var(--u1-soft); font-weight: 500;
  text-align: center;
}
.u1-dash-body { display: grid; grid-template-columns: 150px 1fr; min-height: 320px; }
.u1-dash-side {
  background: linear-gradient(180deg, #faf5ff, #f5f3ff);
  border-right: 1px solid var(--u1-line-soft);
  padding: 14px 10px;
}
.u1-dash-brand {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 8px 14px; border-bottom: 1px solid var(--u1-line-soft); margin-bottom: 10px;
}
.u1-dash-logo {
  width: 26px; height: 26px; border-radius: 8px;
  background: var(--u1-grad-mark);
  color: #fff; display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 800;
}
.u1-dash-brand span { font-size: 0.78rem; font-weight: 800; color: var(--u1-ink); }
.u1-dash-menu { display: flex; flex-direction: column; gap: 2px; }
.u1-dash-mi {
  padding: 8px 10px; border-radius: 8px;
  font-size: 0.72rem; font-weight: 600; color: var(--u1-muted);
  white-space: nowrap;
}
.u1-dash-mi-active {
  background: var(--u1-grad-panel);
  color: #fff;
  box-shadow: 0 6px 14px rgba(99, 102, 241, 0.32);
}
.u1-dash-main { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.u1-dash-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.u1-kpi {
  background: #fff; border: 1px solid var(--u1-line-soft);
  border-radius: 10px; padding: 10px 12px;
  display: flex; flex-direction: column; gap: 2px;
}
.u1-kpi-label { font-size: 0.62rem; color: var(--u1-soft); font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.u1-kpi-value { font-size: 1rem; font-weight: 800; color: var(--u1-ink); }
.u1-kpi-trend { font-size: 0.62rem; color: #10b981; font-weight: 700; }
.u1-dash-chart {
  background: #fff; border: 1px solid var(--u1-line-soft);
  border-radius: 10px; padding: 12px 14px; flex: 1;
  display: flex; flex-direction: column;
}
.u1-dash-chart-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.u1-dash-chart-head strong { font-size: 0.78rem; color: var(--u1-ink); }
.u1-dash-chart-head span { font-size: 0.72rem; color: #10b981; font-weight: 800; }
.u1-dash-bars {
  flex: 1; display: flex; align-items: flex-end; gap: 8px;
  height: 110px; padding: 6px 4px; border-bottom: 1px dashed var(--u1-line-soft);
}
.u1-bar {
  flex: 1; min-height: 6px; display: flex; align-items: flex-end;
  border-radius: 6px 6px 0 0; overflow: hidden; background: rgba(99, 102, 241, 0.08);
}
.u1-bar-inner {
  width: 100%;
  background: linear-gradient(180deg, var(--u1-brand-3), var(--u1-brand));
  border-radius: 6px 6px 0 0;
  animation: u1-bar 0.9s cubic-bezier(0.25, 0.8, 0.25, 1) both;
}
@keyframes u1-bar { from { height: 0%; } }
.u1-dash-axis {
  display: flex; gap: 8px; padding: 6px 4px 0;
  font-size: 0.62rem; color: var(--u1-soft); font-weight: 600;
}
.u1-dash-axis span { flex: 1; text-align: center; }

/* ───────── Sections ───────── */
.u1-section { padding: 110px 0; position: relative; }
.u1-section-tinted {
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.04), transparent);
  border-top: 1px solid var(--u1-line-soft);
  border-bottom: 1px solid var(--u1-line-soft);
}

/* ───────── Split layout ───────── */
.u1-split { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
.u1-split-reverse .u1-split-copy { order: 2; }
.u1-split-reverse .u1-split-visual { order: 1; }

.u1-split-visual { position: relative; }
.u1-mock {
  background: #fff; border: 1px solid var(--u1-line-soft);
  border-radius: 22px; padding: 24px;
  box-shadow: var(--u1-shadow-2);
}
.u1-mock-bar {
  height: 6px; background: var(--u1-grad-mark);
  border-radius: 3px; margin-bottom: 16px;
}
.u1-mock-bar-purple { background: linear-gradient(90deg, var(--u1-brand-3), var(--u1-brand-deep)); }
.u1-mock-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 14px; border-radius: 10px;
  font-size: 0.92rem; color: var(--u1-ink); font-weight: 600;
}
.u1-mock-row:nth-child(even) { background: var(--u1-tint); }
.u1-mock-row em { font-style: normal; font-weight: 800; color: var(--u1-brand-deep); }
.u1-mock-foot {
  margin-top: 14px; padding-top: 14px; border-top: 1px dashed var(--u1-line-soft);
  font-size: 0.78rem; color: var(--u1-soft); text-align: center; font-weight: 700;
  letter-spacing: 0.4px; text-transform: uppercase;
}
.u1-mock-pill {
  position: absolute;
  background: #fff; border: 1px solid var(--u1-line);
  padding: 10px 16px; border-radius: 999px;
  font-size: 0.82rem; font-weight: 700; color: var(--u1-ink);
  box-shadow: var(--u1-shadow-1);
}
.u1-mock-pill-top { top: -16px; right: 18px; }
.u1-mock-pill-bottom { bottom: -16px; left: 24px; color: var(--u1-brand-2); }

.u1-bullets { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 12px; }
.u1-bullets li { display: flex; align-items: center; gap: 12px; color: var(--u1-ink); font-weight: 550; font-size: 0.95rem; }
.u1-bullets li span {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--u1-grad-mark);
  color: #ffffff; display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 800; flex-shrink: 0;
}

/* ───────── Feature grid ───────── */
.u1-feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.u1-feature {
  background: #ffffff; border: 1px solid var(--u1-line-soft);
  border-radius: 20px; padding: 28px;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.u1-feature:hover {
  transform: translateY(-4px);
  border-color: var(--u1-line);
  box-shadow: var(--u1-shadow-2);
}
.u1-feature-icon {
  width: 54px; height: 54px; border-radius: 14px;
  background: var(--u1-tint-2);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 1.5rem; margin-bottom: 16px;
  border: 1px solid var(--u1-line-soft);
}
.u1-feature-title { font-size: 1.05rem; font-weight: 800; margin: 0 0 8px; color: var(--u1-ink); }
.u1-feature-desc { font-size: 0.9rem; color: var(--u1-muted); margin: 0; line-height: 1.6; }

/* ───────── Steps ───────── */
.u1-steps { display: flex; flex-direction: column; gap: 18px; margin: 6px 0 28px; }
.u1-step { display: flex; gap: 16px; align-items: flex-start; }
.u1-step-num {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  background: var(--u1-grad-mark);
  color: #ffffff; display: inline-flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.85rem; letter-spacing: 0.4px;
  box-shadow: 0 8px 18px rgba(99, 102, 241, 0.32);
}
.u1-step strong { display: block; font-size: 1.02rem; color: var(--u1-ink); margin-bottom: 3px; }
.u1-step p { margin: 0; font-size: 0.92rem; color: var(--u1-muted); line-height: 1.55; }

/* ───────── Benefits ───────── */
.u1-benefit-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.u1-benefit {
  background: #ffffff; border: 1px solid var(--u1-line-soft);
  border-radius: 22px; padding: 28px 22px; text-align: center;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.u1-benefit:hover { transform: translateY(-4px); box-shadow: var(--u1-shadow-2); border-color: var(--u1-line); }
.u1-benefit-icon {
  width: 60px; height: 60px; margin: 0 auto 16px; border-radius: 16px;
  background: var(--u1-tint-2); border: 1px solid var(--u1-line-soft);
  display: inline-flex; align-items: center; justify-content: center; font-size: 1.65rem;
}
.u1-benefit-title { font-size: 1.02rem; font-weight: 800; margin: 0 0 8px; color: var(--u1-ink); }
.u1-benefit-desc { font-size: 0.88rem; color: var(--u1-muted); margin: 0; line-height: 1.6; }

/* ───────── CTA banner (gradient) ───────── */
.u1-cta-banner {
  position: relative; overflow: hidden;
  background: var(--u1-grad-panel);
  padding: 90px 0;
}
.u1-cta-banner::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(circle at 18% 22%, rgba(255,255,255,0.16) 0%, transparent 45%),
    radial-gradient(circle at 82% 78%, rgba(255,255,255,0.10) 0%, transparent 45%);
}
.u1-cta-glow {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(60px); opacity: 0.3;
}
.u1-cta-glow-1 { width: 320px; height: 320px; top: -120px; right: -80px; background: #ffffff; }
.u1-cta-glow-2 { width: 240px; height: 240px; bottom: -100px; left: -60px; background: #ffffff; opacity: 0.18; }
.u1-cta-grid {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 2fr 1fr; gap: 50px; align-items: center;
}
.u1-cta-actions { display: flex; flex-wrap: wrap; gap: 14px; justify-content: flex-end; }

/* ───────── Testimonials ───────── */
.u1-testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
.u1-testi {
  background: #fff; border: 1px solid var(--u1-line-soft);
  border-radius: 24px; padding: 34px 30px;
  position: relative;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.u1-testi:hover { transform: translateY(-4px); box-shadow: var(--u1-shadow-2); border-color: var(--u1-line); }
.u1-testi-mark {
  position: absolute; top: 14px; right: 22px;
  font-size: 4.5rem; line-height: 1;
  font-family: Georgia, 'Times New Roman', serif;
  color: rgba(99, 102, 241, 0.18);
}
.u1-testi-quote { color: var(--u1-ink); font-size: 0.96rem; line-height: 1.7; margin: 0 0 22px; font-style: italic; }
.u1-testi-author { display: flex; gap: 14px; align-items: center; }
.u1-testi-avatar {
  width: 50px; height: 50px; border-radius: 50%;
  background: var(--u1-grad-mark);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 1.4rem; box-shadow: 0 8px 18px rgba(99, 102, 241, 0.28);
}
.u1-testi-author strong { display: block; font-size: 0.94rem; color: var(--u1-ink); font-weight: 800; }
.u1-testi-author span { font-size: 0.78rem; color: var(--u1-soft); }

/* ───────── Partners marquee ───────── */
.u1-marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.u1-marquee-track {
  display: flex; gap: 56px; padding: 16px 0;
  width: max-content;
  animation: u1-marquee 30s linear infinite;
}
@keyframes u1-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.u1-partner {
  font-weight: 850; font-size: 1.1rem; letter-spacing: 2.4px;
  color: var(--u1-soft); white-space: nowrap;
  opacity: 0.65; transition: color 0.2s, opacity 0.2s;
}
.u1-partner:hover { color: var(--u1-brand-deep); opacity: 1; }

/* ───────── Footer ───────── */
.u1-footer {
  background: linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.05));
  border-top: 1px solid var(--u1-line-soft);
  padding: 80px 0 28px;
}
.u1-footer .u1-brand-name { color: var(--u1-ink); }
.u1-footer-grid {
  display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.2fr; gap: 44px;
  padding-bottom: 50px; border-bottom: 1px solid var(--u1-line-soft);
}
.u1-footer-desc {
  font-size: 0.92rem; color: var(--u1-muted);
  margin-top: 16px; max-width: 360px; line-height: 1.7;
}
.u1-footer h4 {
  color: var(--u1-ink); font-size: 0.74rem;
  text-transform: uppercase; letter-spacing: 1.4px;
  margin: 0 0 18px; font-weight: 800;
}
.u1-footer button, .u1-footer a {
  display: block; background: none; border: none; padding: 6px 0;
  color: var(--u1-muted); cursor: pointer; text-align: left;
  font-size: 0.92rem; font-weight: 600; text-decoration: none;
  transition: color 0.2s;
}
.u1-footer button:hover, .u1-footer a:hover { color: var(--u1-brand-deep); }
.u1-socials { display: flex; gap: 10px; margin-top: 16px; }
.u1-socials a {
  width: 38px; height: 38px; border-radius: 12px;
  background: var(--u1-tint-2); border: 1px solid var(--u1-line-soft);
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0; font-weight: 800; font-size: 0.85rem; text-transform: uppercase;
  color: var(--u1-brand-deep);
}
.u1-socials a:hover { background: var(--u1-grad-mark); color: #fff; border-color: transparent; }
.u1-footer-bottom {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 24px; flex-wrap: wrap; gap: 14px;
  font-size: 0.8rem; color: var(--u1-soft);
}
.u1-footer-url { letter-spacing: 1.2px; text-transform: uppercase; font-weight: 700; }

/* ───────── Responsive ───────── */
@media (max-width: 1024px) {
  .u1-h1 { font-size: 2.6rem; }
  .u1-h2 { font-size: 1.9rem; }
  .u1-hero-grid { grid-template-columns: 1fr; gap: 56px; }
  .u1-feature-grid { grid-template-columns: repeat(2, 1fr); }
  .u1-benefit-grid { grid-template-columns: repeat(2, 1fr); }
  .u1-testi-grid { grid-template-columns: 1fr; }
  .u1-footer-grid { grid-template-columns: 1fr 1fr; }
  .u1-cta-grid { grid-template-columns: 1fr; }
  .u1-cta-actions { justify-content: flex-start; }
}
@media (max-width: 768px) {
  .u1-container { padding: 0 20px; }
  .u1-nav {
    position: absolute; top: 78px; left: 0; right: 0;
    background: #fff; border-bottom: 1px solid var(--u1-line-soft);
    flex-direction: column; align-items: stretch; gap: 0; padding: 8px 0;
    transform: translateY(-110%); transition: transform 0.3s;
    box-shadow: 0 16px 30px rgba(15, 12, 41, 0.06);
    margin: 0;
  }
  .u1-nav-open { transform: translateY(0); }
  .u1-nav-link { padding: 14px 24px; border-radius: 0; text-align: left; }
  .u1-link { display: none; }
  .u1-burger { display: flex; }
  .u1-cta { padding: 10px 18px; font-size: 0.82rem; }

  .u1-hero { padding: 60px 0 80px; }
  .u1-h1 { font-size: 2.1rem; }
  .u1-h2 { font-size: 1.6rem; }
  .u1-section { padding: 70px 0; }
  .u1-stats { gap: 16px; }
  .u1-stat-divider { display: none; }
  .u1-split { grid-template-columns: 1fr; gap: 56px; }
  .u1-split-reverse .u1-split-copy { order: 0; }
  .u1-split-reverse .u1-split-visual { order: 0; }
  .u1-feature-grid, .u1-benefit-grid { grid-template-columns: 1fr; }
  .u1-footer-grid { grid-template-columns: 1fr; gap: 32px; padding-bottom: 32px; }
  .u1-cta-actions { justify-content: center; }
  .u1-fcard { display: none; }
  .u1-showcase-panel { padding: 18px; border-radius: 24px; }
}

/* ───────── Search Dropdown Custom Styles ───────── */
.u1-search-item:hover {
  background-color: var(--u1-tint-2) !important;
}
@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
