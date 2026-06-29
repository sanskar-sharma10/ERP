import { useState, useMemo, useCallback } from 'react';
import { useERP } from '../context/ERPContext';

/* ─── Theme ─── */
const C = {
  bg: '#f7f6f3', card: '#ffffff', bd: '#e8e3dc',
  h: '#1e1b4b', sub: '#64748b', lab: '#6b7280',
  shadow: '0 1px 8px rgba(30,27,75,.07)',
  shadowHover: '0 6px 24px rgba(30,27,75,.12)',
};

/* ─── Source Config ─── */
const SOURCE_CFG = {
  Administration: { color: '#7c3aed', bg: 'rgba(124,58,237,.09)', border: 'rgba(124,58,237,.22)', icon: '🏛️' },
  Registrar:      { color: '#2563eb', bg: 'rgba(37,99,235,.09)',   border: 'rgba(37,99,235,.22)',   icon: '📋' },
  'Academic Affairs': { color: '#0d9488', bg: 'rgba(13,148,136,.09)', border: 'rgba(13,148,136,.22)', icon: '🎓' },
  'IT Department':    { color: '#6366f1', bg: 'rgba(99,102,241,.09)', border: 'rgba(99,102,241,.22)', icon: '💻' },
  Library:        { color: '#059669', bg: 'rgba(5,150,105,.09)',   border: 'rgba(5,150,105,.22)',   icon: '📚' },
  Finance:        { color: '#d97706', bg: 'rgba(217,119,6,.09)',   border: 'rgba(217,119,6,.22)',   icon: '💰' },
  'Student Affairs': { color: '#db2777', bg: 'rgba(219,39,119,.09)', border: 'rgba(219,39,119,.22)', icon: '🎯' },
  'My Classes':   { color: '#ea580c', bg: 'rgba(234,88,12,.09)',   border: 'rgba(234,88,12,.22)',   icon: '📖' },
};

/* ─── Priority Config ─── */
const PRIORITY_CFG = {
  urgent: { label: 'Urgent',  color: '#dc2626', bg: 'rgba(220,38,38,.09)',   border: 'rgba(220,38,38,.25)' },
  high:   { label: 'High',    color: '#e11d48', bg: 'rgba(225,29,72,.09)',   border: 'rgba(225,29,72,.22)' },
  medium: { label: 'Medium',  color: '#d97706', bg: 'rgba(217,119,6,.09)',   border: 'rgba(217,119,6,.22)' },
  low:    { label: 'Low',     color: '#059669', bg: 'rgba(5,150,105,.09)',   border: 'rgba(5,150,105,.22)' },
  info:   { label: 'Info',    color: '#3b82f6', bg: 'rgba(59,130,246,.09)',  border: 'rgba(59,130,246,.22)' },
};

/* ─── Notification Types ─── */
const TYPE_CFG = {
  announcement: { label: 'Announcement', icon: '📢' },
  alert:        { label: 'Alert',        icon: '🚨' },
  event:        { label: 'Event',        icon: '📅' },
  policy:       { label: 'Policy',       icon: '📜' },
  deadline:     { label: 'Deadline',     icon: '⏰' },
  maintenance:  { label: 'Maintenance',  icon: '🔧' },
};

/* ─── Audience Config ─── */
const AUDIENCE_CFG = {
  all:      { label: 'Everyone', icon: '🌐' },
  faculty:  { label: 'Faculty Only', icon: '👨‍🏫' },
  students: { label: 'Students Only', icon: '🎒' },
  staff:    { label: 'Staff Only', icon: '👔' },
};

/* ─── Relative Time Helper ─── */
function getRelativeTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ─── Check if deadline is approaching (within 3 days) ─── */
function isApproaching(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.ceil((date - now) / 86400000);
  return diffDays >= 0 && diffDays <= 3;
}

/* ─── Pre-populated School-Wide Data ─── */
const SCHOOL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'End-of-Semester Examination Schedule — Spring 2026',
    source: 'Registrar',
    type: 'announcement',
    priority: 'urgent',
    audience: 'all',
    pinned: true,
    read: false,
    date: '2026-05-21',
    time: '09:00 AM',
    expiryDate: '2026-06-20',
    attachments: [{ name: 'Exam_Schedule_Spring2026.pdf', size: '245 KB' }],
    message: 'The final examination schedule for Spring 2026 has been officially published. All exams will be held from June 9–20, 2026. Faculty are requested to submit their final question papers to the Examination Cell by May 30, 2026 (5:00 PM). No extensions will be granted. Download the full timetable from the Academic Portal.',
  },
  {
    id: 2,
    title: 'Faculty Professional Development Day — May 28, 2026',
    source: 'Academic Affairs',
    type: 'event',
    priority: 'high',
    audience: 'faculty',
    pinned: true,
    read: false,
    date: '2026-05-21',
    time: '10:30 AM',
    expiryDate: '2026-05-28',
    attachments: [{ name: 'PD_Day_Agenda.pdf', size: '128 KB' }],
    message: 'The annual Faculty Professional Development Day will be held on May 28, 2026 (Wednesday) from 9:00 AM to 4:00 PM in the Main Auditorium. All teaching staff are required to attend. Topics include: AI-Assisted Pedagogy, Inclusive Classroom Strategies, and Research Publication Ethics. Lunch will be provided. Please confirm attendance by May 25.',
  },
  {
    id: 3,
    title: 'Grade Submission Deadline — Spring 2026',
    source: 'Registrar',
    type: 'deadline',
    priority: 'urgent',
    audience: 'faculty',
    pinned: true,
    read: true,
    date: '2026-05-20',
    time: '04:00 PM',
    expiryDate: '2026-06-25',
    attachments: [],
    message: 'All faculty are reminded that final grades for Spring 2026 must be submitted through the ERP Gradebook portal by June 25, 2026 at 11:59 PM. Grades submitted after this deadline will require Dean approval and may result in Incomplete (I) grades on student transcripts. Contact the Registrar Office at ext. 2200 for any grading issues.',
  },
  {
    id: 4,
    title: 'Campus Network Maintenance — Saturday May 24',
    source: 'IT Department',
    type: 'maintenance',
    priority: 'high',
    audience: 'all',
    pinned: false,
    read: true,
    date: '2026-05-20',
    time: '02:00 PM',
    expiryDate: '2026-05-25',
    attachments: [],
    message: 'Scheduled network maintenance will be performed on Saturday, May 24, 2026 from 2:00 AM to 6:00 AM. During this window, the ERP Portal, Campus Wi-Fi, email servers, and Library database will be temporarily unavailable. Please save all your work and log out before the maintenance begins. Emergency contact: it-support@univers-one.edu',
  },
  {
    id: 5,
    title: 'Revised Academic Integrity Policy — Effective Immediately',
    source: 'Administration',
    type: 'policy',
    priority: 'high',
    audience: 'all',
    pinned: false,
    read: false,
    date: '2026-05-19',
    time: '11:00 AM',
    expiryDate: null,
    attachments: [{ name: 'Academic_Integrity_Policy_v3.pdf', size: '512 KB' }, { name: 'AI_Disclosure_Template.docx', size: '34 KB' }],
    message: 'The Board of Academic Governance has approved a revised Academic Integrity Policy effective May 19, 2026. Key updates: (1) AI-generated content must be disclosed in all submissions; (2) Plagiarism penalty is now a mandatory F grade for first offence; (3) All faculty must include the updated Academic Integrity Clause in course syllabi. Full document available on the Academic Affairs portal.',
  },
  {
    id: 6,
    title: 'Spring 2026 Library Extended Hours',
    source: 'Library',
    type: 'announcement',
    priority: 'info',
    audience: 'all',
    pinned: false,
    read: true,
    date: '2026-05-19',
    time: '09:00 AM',
    expiryDate: '2026-06-25',
    attachments: [],
    message: 'The Main Library will operate on extended hours during exam season (June 1–25, 2026): Monday–Friday 7:00 AM – 12:00 Midnight, Saturday–Sunday 8:00 AM – 10:00 PM. Study room reservations can be made via the Library Portal. Faculty requesting course reserve materials should submit requests by May 28.',
  },
  {
    id: 7,
    title: 'Tuition Payment Deadline — Fall 2026 Registration',
    source: 'Finance',
    type: 'deadline',
    priority: 'medium',
    audience: 'students',
    pinned: false,
    read: false,
    date: '2026-05-18',
    time: '03:00 PM',
    expiryDate: '2026-06-15',
    attachments: [],
    message: 'Students must clear outstanding tuition balances by June 15, 2026 to be eligible for Fall 2026 course registration. Faculty advisors are requested to flag students with Unpaid or Partial fee status and direct them to the Finance Office (Block A, Room 102). Registration holds will be placed automatically after the deadline.',
  },
  {
    id: 8,
    title: 'Annual Research Symposium — June 5, 2026',
    source: 'Academic Affairs',
    type: 'event',
    priority: 'medium',
    audience: 'all',
    pinned: false,
    read: false,
    date: '2026-05-18',
    time: '11:00 AM',
    expiryDate: '2026-06-05',
    attachments: [{ name: 'Symposium_Call_For_Papers.pdf', size: '180 KB' }],
    message: 'The 12th Annual University Research Symposium will be held on June 5, 2026 in the Science Complex. Faculty are encouraged to submit research abstracts by May 28. Student poster presentations will also be featured. Keynote speaker: Dr. Ananya Rao, MIT Media Lab. Registration is free. Contact research@univers-one.edu for submissions.',
  },
  {
    id: 9,
    title: 'Student Mental Health Awareness Week — May 26–30',
    source: 'Student Affairs',
    type: 'event',
    priority: 'medium',
    audience: 'all',
    pinned: false,
    read: true,
    date: '2026-05-17',
    time: '10:00 AM',
    expiryDate: '2026-05-30',
    attachments: [],
    message: 'The Student Affairs Office is organizing Mental Health Awareness Week from May 26–30, 2026. Faculty are encouraged to be mindful of student stress levels during this exam period. Counseling services will be available daily 9 AM–5 PM in Block D. Faculty can refer distressed students to counseling@univers-one.edu.',
  },
  {
    id: 10,
    title: 'Midterm Exam Papers — Return to Students by May 28',
    source: 'Academic Affairs',
    type: 'deadline',
    priority: 'high',
    audience: 'faculty',
    pinned: false,
    read: false,
    date: '2026-05-17',
    time: '08:00 AM',
    expiryDate: '2026-05-28',
    attachments: [],
    message: 'As per university policy, all graded midterm exam papers must be returned to students within 10 working days of the exam date. Faculty who have not yet returned midterm papers are requested to do so no later than May 28, 2026. Students who have concerns about their grades should be directed to submit a formal re-evaluation request.',
  },
  {
    id: 11,
    title: 'New Classroom Technology Installed — Lecture Hall B & C',
    source: 'IT Department',
    type: 'announcement',
    priority: 'info',
    audience: 'faculty',
    pinned: false,
    read: true,
    date: '2026-05-16',
    time: '01:00 PM',
    expiryDate: null,
    attachments: [{ name: 'AV_Equipment_Guide.pdf', size: '2.1 MB' }],
    message: 'Lecture Halls B and C have been equipped with new 4K interactive projection systems and wireless screen mirroring (AirPlay/Miracast). Training sessions for faculty will be held May 22–23 at 2:00 PM in Hall B. The old projectors in Rooms 301 and 402 have also been replaced. Contact it-av@univers-one.edu for support.',
  },
  {
    id: 12,
    title: 'CS-301: Midterm Exam Date Confirmed — June 3',
    source: 'My Classes',
    type: 'announcement',
    priority: 'high',
    audience: 'students',
    pinned: false,
    read: false,
    date: '2026-05-20',
    time: '09:15 AM',
    expiryDate: '2026-06-03',
    attachments: [],
    message: 'The CS-301 Midterm Examination will be held on June 3, 2026 at 10:00 AM in Exam Hall A. Coverage: Chapters 1–8, all algorithm complexity topics covered so far. Bring your student ID and a non-programmable calculator. No electronic devices allowed.',
  },
  {
    id: 13,
    title: 'Grading Policy Reminder — Late Submissions',
    source: 'My Classes',
    type: 'policy',
    priority: 'high',
    audience: 'students',
    pinned: false,
    read: true,
    date: '2026-05-15',
    time: '08:30 AM',
    expiryDate: null,
    attachments: [],
    message: 'As per course policy, late assignments attract a 10% penalty per day (max 3 days). After 3 days, the submission will not be accepted. Please plan accordingly for upcoming deadlines.',
  },
];

/* ─── Sub-components ─── */
function PriorityBadge({ level }) {
  const p = PRIORITY_CFG[level] || PRIORITY_CFG.info;
  return (
    <span style={{ fontSize: '0.6rem', fontWeight: '800', padding: '2px 7px', borderRadius: '20px', background: p.bg, color: p.color, border: `1px solid ${p.border}`, textTransform: 'uppercase', letterSpacing: '.4px', flexShrink: 0 }}>
      {level === 'urgent' && '🚨 '}{p.label}
    </span>
  );
}

function SourceBadge({ source }) {
  const s = SOURCE_CFG[source] || SOURCE_CFG.Administration;
  return (
    <span style={{ fontSize: '0.6rem', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: s.bg, color: s.color, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
      {s.icon} {source}
    </span>
  );
}

function TypeBadge({ type }) {
  const t = TYPE_CFG[type] || TYPE_CFG.announcement;
  return (
    <span style={{ fontSize: '0.6rem', fontWeight: '700', color: C.sub }}>
      {t.icon} {t.label}
    </span>
  );
}

function AudienceBadge({ audience }) {
  const a = AUDIENCE_CFG[audience] || AUDIENCE_CFG.all;
  return (
    <span style={{ fontSize: '0.58rem', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', background: 'rgba(100,116,139,.08)', color: C.sub, border: '1px solid rgba(100,116,139,.15)' }}>
      {a.icon} {a.label}
    </span>
  );
}

export default function Announcements() {
  const { showFeedback } = useERP();

  const [items, setItems] = useState(SCHOOL_ANNOUNCEMENTS);
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQ, setSearchQ]               = useState('');
  const [expandedId, setExpandedId]         = useState(null);
  const [showForm, setShowForm]             = useState(false);
  const [activeTab, setActiveTab]           = useState('all'); // 'all' | 'students' | 'staff' | 'faculty'
  const [sortBy, setSortBy]                 = useState('date'); // 'date' | 'priority'
  const [showExpired, setShowExpired]       = useState(false);

  /* ─── Form state ─── */
  const [form, setForm] = useState({
    title: '', source: 'Administration', type: 'announcement',
    priority: 'medium', audience: 'all', message: '', expiryDate: '',
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  /* ─── Filtering & Sorting ─── */
  const filtered = useMemo(() => {
    const now = new Date();
    let result = items.filter(a => {
      // Hide expired unless toggled
      if (!showExpired && a.expiryDate && new Date(a.expiryDate) < now) return false;

      const priorityOk = filterPriority === 'all' || a.priority === filterPriority;
      // Audience/role filter: All shows everything, otherwise match audience
      const audienceOk = activeTab === 'all' || a.audience === activeTab || a.audience === 'all';
      const searchOk   = !searchQ
        || a.title.toLowerCase().includes(searchQ.toLowerCase())
        || a.message.toLowerCase().includes(searchQ.toLowerCase())
        || a.source.toLowerCase().includes(searchQ.toLowerCase());
      return priorityOk && audienceOk && searchOk;
    });

    // Sort
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3, info: 4 };
    result.sort((a, b) => {
      // Pinned always first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      if (sortBy === 'priority') return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
      if (sortBy === 'source') return a.source.localeCompare(b.source);
      return new Date(b.date) - new Date(a.date); // default: newest first
    });

    return result;
  }, [items, filterPriority, activeTab, searchQ, sortBy, showExpired]);

  const pinned  = filtered.filter(a => a.pinned);
  const regular = filtered.filter(a => !a.pinned);
  const unreadCount = items.filter(a => !a.read).length;

  /* ─── Stats ─── */
  const stats = useMemo(() => [
    { label: 'Total Notices',     val: items.length,                                                              color: '#6366f1', bg: 'rgba(99,102,241,.08)',  bd: 'rgba(99,102,241,.18)' },
    { label: 'Unread',            val: items.filter(a => !a.read).length,                                         color: '#7c3aed', bg: 'rgba(124,58,237,.08)', bd: 'rgba(124,58,237,.18)' },
    { label: 'Urgent / High',     val: items.filter(a => a.priority === 'urgent' || a.priority === 'high').length, color: '#e11d48', bg: 'rgba(225,29,72,.08)',  bd: 'rgba(225,29,72,.18)' },
    { label: 'Upcoming Deadlines',val: items.filter(a => a.type === 'deadline' && a.expiryDate && isApproaching(a.expiryDate)).length, color: '#d97706', bg: 'rgba(217,119,6,.08)', bd: 'rgba(217,119,6,.18)' },
    { label: 'Events This Month', val: items.filter(a => a.type === 'event').length,                              color: '#059669', bg: 'rgba(5,150,105,.08)',  bd: 'rgba(5,150,105,.18)' },
  ], [items]);

  /* ─── Handlers ─── */
  const handlePost = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      showFeedback('error', 'Title and message are required.');
      return;
    }
    const now = new Date();
    setItems(prev => [{
      id: Date.now(), ...form,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      pinned: false,
      read: true,
      expiryDate: form.expiryDate || null,
      attachments: [],
    }, ...prev]);
    setForm({ title: '', source: 'Administration', type: 'announcement', priority: 'medium', audience: 'all', message: '', expiryDate: '' });
    setShowForm(false);
    showFeedback('success', 'Notice posted successfully!');
  };

  const togglePin = (id) => setItems(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  const deleteItem = (id) => { setItems(prev => prev.filter(a => a.id !== id)); showFeedback('success', 'Notice removed.'); };
  const markAsRead = useCallback((id) => setItems(prev => prev.map(a => a.id === id ? { ...a, read: true } : a)), []);
  const markAllRead = () => { setItems(prev => prev.map(a => ({ ...a, read: true }))); showFeedback('success', 'All notices marked as read.'); };

  const clearFilters = () => {
    setFilterPriority('all');
    setSearchQ('');
    setActiveTab('all');
    setSortBy('date');
  };

  const handleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      markAsRead(id);
    }
  };

  /* ─── Render card ─── */
  const renderCard = (ann) => {
    const isExpanded = expandedId === ann.id;
    const src = SOURCE_CFG[ann.source] || SOURCE_CFG.Administration;
    return (
      <div
        key={ann.id}
        style={{
          background: C.card,
          border: `1px solid ${ann.pinned ? src.border : C.bd}`,
          borderLeft: `4px solid ${src.color}`,
          borderRadius: '14px', overflow: 'hidden',
          boxShadow: C.shadow, transition: 'all .2s',
          animation: 'annIn .3s cubic-bezier(.16,1,.3,1) both',
          opacity: ann.read ? 1 : 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = C.shadowHover; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {/* Card Header */}
        <div style={{ padding: '1rem 1.1rem', cursor: 'pointer' }} onClick={() => handleExpand(ann.id)}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {/* Unread indicator */}
            {!ann.read && (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '6px', boxShadow: '0 0 6px rgba(99,102,241,.5)' }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '5px' }}>
                {ann.pinned && (
                  <span style={{ fontSize: '0.58rem', fontWeight: '800', padding: '1px 6px', borderRadius: '20px', background: 'rgba(99,102,241,.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,.2)' }}>
                    📌 PINNED
                  </span>
                )}
                <SourceBadge source={ann.source} />
                <PriorityBadge level={ann.priority} />
                <TypeBadge type={ann.type} />
                {ann.attachments && ann.attachments.length > 0 && (
                  <span style={{ fontSize: '0.58rem', color: C.sub }}>📎 {ann.attachments.length}</span>
                )}
              </div>
              <h4 style={{ margin: '0 0 3px', fontSize: '0.9rem', fontWeight: ann.read ? '700' : '800', color: C.h, lineHeight: '1.35' }}>{ann.title}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <p style={{ margin: 0, fontSize: '0.68rem', color: C.sub }}>{ann.date} · {ann.time}</p>
                <span style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: '600' }}>{getRelativeTime(ann.date)}</span>
                {ann.expiryDate && isApproaching(ann.expiryDate) && (
                  <span style={{ fontSize: '0.58rem', fontWeight: '700', padding: '1px 5px', borderRadius: '4px', background: 'rgba(217,119,6,.1)', color: '#d97706', border: '1px solid rgba(217,119,6,.2)' }}>
                    ⚠️ Expires soon
                  </span>
                )}
              </div>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.lab} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '6px', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          {!isExpanded && (
            <p style={{ margin: '8px 0 0', fontSize: '0.76rem', color: C.lab, lineHeight: '1.55', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {ann.message}
            </p>
          )}
        </div>

        {/* Expanded body */}
        {isExpanded && (
          <div style={{ borderTop: `1px solid ${C.bd}`, background: '#fafaf8', animation: 'annIn .2s ease-out both' }}>
            <div style={{ padding: '1rem 1.1rem' }}>
              {/* Audience & Expiry info */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <AudienceBadge audience={ann.audience} />
                {ann.expiryDate && (
                  <span style={{ fontSize: '0.65rem', color: C.sub }}>
                    📅 Expires: {new Date(ann.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>

              <p style={{ margin: '0 0 1rem', fontSize: '0.83rem', color: C.h, lineHeight: '1.72' }}>{ann.message}</p>

              {/* Attachments */}
              {ann.attachments && ann.attachments.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '0.7rem', fontWeight: '700', color: C.sub, textTransform: 'uppercase', letterSpacing: '.4px' }}>Attachments</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {ann.attachments.map((att, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: 'rgba(99,102,241,.05)', border: '1px solid rgba(99,102,241,.15)', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => showFeedback('info', `Download: ${att.name}`)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#6366f1' }}>{att.name}</span>
                        <span style={{ fontSize: '0.6rem', color: C.sub }}>({att.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => togglePin(ann.id)}
                  style={{ padding: '5px 13px', border: `1px solid ${ann.pinned ? 'rgba(244,63,94,.3)' : 'rgba(99,102,241,.3)'}`, borderRadius: '8px', background: ann.pinned ? 'rgba(244,63,94,.06)' : 'rgba(99,102,241,.06)', color: ann.pinned ? '#e11d48' : '#6366f1', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {ann.pinned ? '📌 Unpin' : '📌 Pin Notice'}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(ann.message); showFeedback('success', 'Notice copied to clipboard.'); }}
                  style={{ padding: '5px 13px', border: '1px solid rgba(99,102,241,.2)', borderRadius: '8px', background: 'rgba(99,102,241,.04)', color: '#6366f1', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                  📋 Copy
                </button>
                <button onClick={() => deleteItem(ann.id)}
                  style={{ padding: '5px 13px', border: '1px solid rgba(225,29,72,.25)', borderRadius: '8px', background: 'rgba(225,29,72,.06)', color: '#e11d48', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                  🗑️ Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="main-panel">
      <style>{`
        @keyframes annIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .ann-tab { padding:7px 16px;border:none;border-radius:8px;font-family:inherit;font-size:0.75rem;font-weight:700;cursor:pointer;transition:all .18s; }
        .filter-btn { padding:5px 11px;border-radius:7px;font-family:inherit;font-size:0.7rem;font-weight:800;cursor:pointer;transition:all .18s; }
        .sort-select { padding:5px 10px;border:1px solid ${C.bd};border-radius:7px;font-family:inherit;font-size:0.72rem;font-weight:600;color:${C.h};background:#fff;cursor:pointer;outline:none; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(135deg, #faf9f6 0%, #f5f3ef 100%)', borderRadius: '20px', padding: '2rem 2.2rem', marginBottom: '1.5rem', border: '1px solid #e8e3dc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '1.5rem', fontWeight: '800', color: C.h, lineHeight: '1.3' }}>
            Announcements & <span style={{ color: '#7c3aed' }}>Notifications</span>
          </h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: C.sub, lineHeight: '1.6', maxWidth: '500px' }}>
            School-wide notices, deadlines, and updates. {today}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              style={{ height: '36px', padding: '0 14px', background: '#fff', color: '#6366f1', border: '1px solid rgba(99,102,241,.25)', borderRadius: '9px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
              ✓ Mark All Read
            </button>
          )}
          <button onClick={() => setShowForm(s => !s)}
            style={{ height: '40px', padding: '0 20px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 14px rgba(99,102,241,.3)', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Post Notice
          </button>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '.7rem', marginBottom: '1.25rem' }}>
        {stats.map(k => (
          <div key={k.label} style={{ background: '#fff', border: `1px solid ${k.bd}`, borderRadius: '12px', padding: '.8rem 1rem', boxShadow: C.shadow, transition: 'all .2s', cursor: 'default' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <p style={{ margin: '0 0 3px', fontSize: '0.58rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.5px', color: C.sub }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: '1.55rem', fontWeight: '800', color: k.color, lineHeight: '1' }}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* ── New Notice Form ── */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid rgba(99,102,241,.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(99,102,241,.1)', animation: 'annIn .25s ease-out both' }}>
          <h3 style={{ margin: '0 0 1.2rem', fontSize: '0.98rem', fontWeight: '800', color: C.h, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', background: 'rgba(99,102,241,.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>📢</span>
            Post New Notice
          </h3>
          <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Notice Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Semester Examination Schedule Published"
                maxLength={120}
                style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.85rem', fontFamily: 'inherit', color: C.h, outline: 'none', boxSizing: 'border-box' }} />
              <p style={{ margin: '3px 0 0', fontSize: '0.62rem', color: C.sub, textAlign: 'right' }}>{form.title.length}/120</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>From Department</label>
                <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.8rem', fontFamily: 'inherit', color: C.h, background: '#fff' }}>
                  {Object.entries(SOURCE_CFG).map(([k, v]) => <option key={k} value={k}>{v.icon} {k}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Notice Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.8rem', fontFamily: 'inherit', color: C.h, background: '#fff' }}>
                  {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Priority Level</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.8rem', fontFamily: 'inherit', color: C.h, background: '#fff' }}>
                  <option value="urgent">🚨 Urgent</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                  <option value="info">🔵 Info</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Target Audience</label>
                <select value={form.audience} onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.8rem', fontFamily: 'inherit', color: C.h, background: '#fff' }}>
                  {Object.entries(AUDIENCE_CFG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Expiry Date (optional)</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm(p => ({ ...p, expiryDate: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.8rem', fontFamily: 'inherit', color: C.h, background: '#fff', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: '700', color: C.h, marginBottom: '5px' }}>Message *</label>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Write the full notice content here..."
                rows={4}
                maxLength={2000}
                style={{ width: '100%', padding: '9px 12px', border: `1px solid ${C.bd}`, borderRadius: '9px', fontSize: '0.82rem', fontFamily: 'inherit', color: C.h, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.65' }} />
              <p style={{ margin: '3px 0 0', fontSize: '0.62rem', color: form.message.length > 1800 ? '#d97706' : C.sub, textAlign: 'right' }}>{form.message.length}/2000</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, height: '40px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit' }}>📢 Post Notice</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ height: '40px', padding: '0 18px', border: `1px solid ${C.bd}`, borderRadius: '10px', background: '#fff', color: C.sub, fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.15rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', opacity: .4 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.h} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search notices…" value={searchQ} onChange={e => setSearchQ(e.target.value)}
            style={{ paddingLeft: '28px', paddingRight: '10px', height: '34px', border: `1px solid ${C.bd}`, borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'inherit', color: C.h, background: '#fff', outline: 'none', width: '200px' }} />
        </div>

        {/* Role-based audience filter: All / Student / Admin / Teacher */}
        <div style={{ display: 'flex', background: '#eeeae3', borderRadius: '9px', padding: '3px', gap: '2px' }}>
          {[
            { id: 'all',      label: '🌐 All' },
            { id: 'students', label: '🎒 Student' },
            { id: 'staff',    label: '🏛️ Admin' },
            { id: 'faculty',  label: '👨‍🏫 Teacher' },
          ].map(r => (
            <button key={r.id} className="filter-btn" onClick={() => setActiveTab(r.id)}
              style={{ background: activeTab === r.id ? '#fff' : 'transparent', color: activeTab === r.id ? C.h : C.sub, boxShadow: activeTab === r.id ? '0 1px 3px rgba(30,27,75,.09)' : 'none', border: 'none' }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div style={{ display: 'flex', background: '#eeeae3', borderRadius: '9px', padding: '3px', gap: '2px' }}>
          {[{ id: 'all', label: 'All' }, { id: 'urgent', label: '🚨 Urgent' }, { id: 'high', label: '🔴 High' }, { id: 'medium', label: '🟡 Med' }, { id: 'info', label: '🔵 Info' }].map(p => (
            <button key={p.id} className="filter-btn" onClick={() => setFilterPriority(p.id)}
              style={{ background: filterPriority === p.id ? '#fff' : 'transparent', color: filterPriority === p.id ? C.h : C.sub, boxShadow: filterPriority === p.id ? '0 1px 3px rgba(30,27,75,.09)' : 'none', border: 'none' }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Sort: Newest</option>
          <option value="priority">Sort: Priority</option>
        </select>

        {/* Show expired toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', fontWeight: '600', color: C.sub, cursor: 'pointer' }}>
          <input type="checkbox" checked={showExpired} onChange={e => setShowExpired(e.target.checked)} style={{ accentColor: '#6366f1' }} />
          Show expired
        </label>

        {/* Clear filters */}
        {(filterPriority !== 'all' || searchQ || activeTab !== 'all') && (
          <button onClick={clearFilters}
            style={{ padding: '5px 10px', border: '1px solid rgba(225,29,72,.2)', borderRadius: '7px', background: 'rgba(225,29,72,.05)', color: '#e11d48', fontSize: '0.68rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            ✕ Clear
          </button>
        )}

        <span style={{ fontSize: '0.72rem', color: C.sub, marginLeft: 'auto', flexShrink: 0 }}>{filtered.length} notice{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Upcoming Deadlines Banner ── */}
      {items.filter(a => a.type === 'deadline' && a.expiryDate && isApproaching(a.expiryDate)).length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, rgba(217,119,6,.06), rgba(217,119,6,.02))', border: '1px solid rgba(217,119,6,.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '1.25rem', animation: 'annIn .3s ease-out both' }}>
          <p style={{ margin: '0 0 6px', fontSize: '0.72rem', fontWeight: '800', color: '#d97706', textTransform: 'uppercase', letterSpacing: '.4px' }}>⚠️ Upcoming Deadlines</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {items.filter(a => a.type === 'deadline' && a.expiryDate && isApproaching(a.expiryDate)).map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#fff', borderRadius: '8px', border: '1px solid rgba(217,119,6,.15)', cursor: 'pointer' }}
                onClick={() => handleExpand(d.id)}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#d97706' }}>⏰</span>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: C.h }}>{d.title.length > 40 ? d.title.slice(0, 40) + '…' : d.title}</span>
                <span style={{ fontSize: '0.62rem', color: C.sub }}>({new Date(d.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Pinned Section ── */}
      {pinned.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '0.75rem', fontWeight: '800', color: C.sub, textTransform: 'uppercase', letterSpacing: '.6px' }}>
            📌 Pinned Notices ({pinned.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{pinned.map(renderCard)}</div>
        </div>
      )}

      {/* ── Regular Notices ── */}
      <div>
        {pinned.length > 0 && regular.length > 0 && (
          <h3 style={{ margin: '0 0 10px', fontSize: '0.75rem', fontWeight: '800', color: C.sub, textTransform: 'uppercase', letterSpacing: '.6px' }}>
            All Notices ({regular.length})
          </h3>
        )}
        {filtered.length === 0 ? (
          <div style={{ background: '#fff', border: `1px solid ${C.bd}`, borderRadius: '16px', padding: '3rem', textAlign: 'center', color: C.sub }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.bd} strokeWidth="1.5" style={{ marginBottom: '12px' }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>No notices match your filters.</p>
            <p style={{ margin: '5px 0 0', fontSize: '0.78rem' }}>Try clearing a filter or switching tabs.</p>
            <button onClick={clearFilters}
              style={{ marginTop: '12px', padding: '8px 18px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{regular.map(renderCard)}</div>
        )}
      </div>
    </div>
  );
}
