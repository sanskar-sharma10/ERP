import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

const ERPContext = createContext();

// Mock Fallback: Academic Courses (Mapped from modules)
const FALLBACK_COURSES = [
  { id: 'cse101', name: 'CSE-101: Software Architecture & Data Systems', instructor: 'Dr. Sarah Connor', enrollment: 52 },
  { id: 'math202', name: 'MAT-202: Advanced Linear Algebra & Neural Models', instructor: 'Prof. Richard Feynman', enrollment: 24 },
  { id: 'phy303', name: 'PHY-303: Quantum Computing & Electromagnetism', instructor: 'Dr. Alan Turing', enrollment: 15 },
  { id: 'mgt404', name: 'MGT-404: Tech Product Development & Management', instructor: 'Prof. Samantha Vance', enrollment: 30 }
];

// Mock Fallback: Student Registry (Mapped from inventory data schema)
const FALLBACK_STUDENTS = [
  { id: '1', name: 'Alexander Pierce', major: 'Computer Science', tuition: 4800.00, grade: 95 },
  { id: '2', name: 'Brooke Sterling', major: 'Bio-Engineering', tuition: 5200.00, grade: 88 },
  { id: '3', name: 'Charles Vance', major: 'Quantum Physics', tuition: 4500.00, grade: 92 },
  { id: '4', name: 'Danielle Miller', major: 'Business Administration', tuition: 3800.00, grade: 85 },
  { id: '5', name: 'Ethan Hunt', major: 'Information Security', tuition: 4800.00, grade: 97 }
];

// Mock Fallback: College Faculty / Professors List
const MOCK_FACULTY = [
  { id: 'FAC-201', name: 'Dr. Sarah Connor', title: 'Professor of AI Engineering', dept: 'Computer Science', salary: 11500, load: '3 Classes' },
  { id: 'FAC-202', name: 'Prof. Richard Feynman', title: 'Dean of Sciences', dept: 'Applied Mathematics', salary: 14000, load: '2 Classes' },
  { id: 'FAC-203', name: 'Dr. Alan Turing', title: 'Lead Cybernetics Scholar', dept: 'Quantum Physics', salary: 12500, load: '4 Classes' },
  { id: 'FAC-204', name: 'Prof. Samantha Vance', title: 'Instructor of Enterprise Dev', dept: 'Business Operations', salary: 9800, load: '2 Classes' }
];

export function ERPProvider({ children }) {
  // Authentication State
  const [auth, setAuth] = useState(() => {
    const cached = localStorage.getItem('college_auth');
    return cached ? JSON.parse(cached) : null;
  });

  // System Settings State
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('erp_backend_url') || 'http://localhost:5000';
  });
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting' | 'connected' | 'offline'
  const [latency, setLatency] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);

  // College Domain Entities State
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState(MOCK_FACULTY);
  
  // UI Controls
  const [activePage, setActivePage] = useState('dashboard');
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const pollTimerRef = useRef(null);

  // Alert Feedback Notifier
  const showFeedback = useCallback((type, text) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  }, []);

  // Map backend `/api/inventory` model into structured `students`
  const mapInventoryToStudents = (invItems) => {
    return invItems.map(item => {
      // Clean ID format
      const cleanId = item.id.replace('_local', '');
      
      // Attempt to map category to valid college major, else default
      let major = item.category;
      if (major === 'Hardware') major = 'Computer Science';
      if (major === 'Software License') major = 'Bio-Engineering';
      if (major === 'Subscription') major = 'Quantum Physics';
      if (major === 'Office Supplies') major = 'Business Administration';
      if (major === 'Networking') major = 'Information Security';

      return {
        id: cleanId,
        name: item.name,
        major: major,
        tuition: item.price || 4000.00,
        grade: item.stock || 80
      };
    });
  };

  // Health check and synchronizer
  const checkHealthAndSync = useCallback(async (currentUrl, showLoader = false) => {
    if (showLoader) setLoading(true);
    
    try {
      // 1. Validate health of live Node server
      const healthData = await api.checkHealth(currentUrl);
      
      setConnectionStatus('connected');
      setLatency(healthData.latencyMs);
      setServerInfo({
        status: healthData.status,
        uptime: healthData.uptime,
        timestamp: healthData.timestamp,
        message: healthData.message
      });

      // 2. Fetch live modules and map to active College Courses
      const statusData = await api.getStatus(currentUrl);
      const serverModules = statusData.modules || [];
      
      // Keep alignment with modules count
      const mappedCourses = serverModules.map((mod, index) => {
        const fall = FALLBACK_COURSES[index] || { id: mod.id, name: mod.name, instructor: 'Instructor Staff', enrollment: 20 };
        return {
          id: mod.id,
          name: `${mod.id.toUpperCase()}-101: Live ${mod.name}`,
          instructor: fall.instructor,
          enrollment: fall.enrollment
        };
      });
      setCourses(mappedCourses.length > 0 ? mappedCourses : FALLBACK_COURSES);

      // 3. Fetch live DB inventory and map directly into Student Matriculations
      const invData = await api.getInventory(currentUrl);
      setStudents(mapInventoryToStudents(invData));
      
      setLastSync(new Date());
    } catch (err) {
      console.warn(`[College ERP] Connection handshake offline at ${currentUrl}. Falling back to sandbox...`);
      setConnectionStatus('offline');
      setLatency(null);
      setServerInfo(null);
      
      // Load fallback cached datasets
      setStudents(prev => prev.length === 0 ? FALLBACK_STUDENTS : prev);
      setCourses(prev => prev.length === 0 ? FALLBACK_COURSES : prev);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // API update handler
  const updateBackendUrl = useCallback(async (newUrl) => {
    if (!newUrl || !newUrl.startsWith('http')) {
      showFeedback('error', 'Invalid URL. Must begin with http:// or https://');
      return false;
    }
    
    const cleanedUrl = newUrl.replace(/\/$/, '');
    setBackendUrl(cleanedUrl);
    localStorage.setItem('erp_backend_url', cleanedUrl);
    setConnectionStatus('connecting');
    showFeedback('success', `API backend shift: link redirected to ${cleanedUrl}`);
    
    await checkHealthAndSync(cleanedUrl, true);
    return true;
  }, [checkHealthAndSync, showFeedback]);

  // Insert Student: Save to live DB via map payload
  const addStudent = useCallback(async (student) => {
    // Reverse map student to Inventory Schema
    let backendCategory = 'Hardware'; // CS
    if (student.major === 'Computer Science') backendCategory = 'Hardware';
    if (student.major === 'Bio-Engineering') backendCategory = 'Software License';
    if (student.major === 'Quantum Physics') backendCategory = 'Subscription';
    if (student.major === 'Business Administration') backendCategory = 'Office Supplies';
    if (student.major === 'Information Security') backendCategory = 'Networking';

    const payload = {
      name: student.name,
      category: backendCategory,
      price: student.tuition,
      stock: student.grade
    };

    if (connectionStatus === 'connected') {
      try {
        const created = await api.addInventoryItem(backendUrl, payload);
        const mappedCreated = mapInventoryToStudents([created])[0];
        setStudents(prev => [mappedCreated, ...prev]);
        showFeedback('success', `Live Server DB: Registered "${student.name}" on database!`);
        return true;
      } catch (err) {
        showFeedback('error', `DB Save Failed: ${err.message}`);
        return false;
      }
    } else {
      // Offline mode local sandbox append
      const sandboxStudent = {
        id: (students.length + 1).toString() + '_local',
        name: student.name,
        major: student.major,
        tuition: student.tuition,
        grade: student.grade
      };
      setStudents(prev => [sandboxStudent, ...prev]);
      showFeedback('success', `[SANDBOX] Student registered locally: "${student.name}"`);
      return true;
    }
  }, [backendUrl, connectionStatus, students.length, showFeedback]);

  // Purge Student: Delete from live DB via ID
  const deleteStudent = useCallback(async (id, name) => {
    if (connectionStatus === 'connected') {
      try {
        await api.deleteInventoryItem(backendUrl, id);
        setStudents(prev => prev.filter(st => st.id !== id));
        showFeedback('success', `Live DB: Purged Student record "${name}"`);
        return true;
      } catch (err) {
        showFeedback('error', `DB Purge Failed: ${err.message}`);
        return false;
      }
    } else {
      // Offline local sandbox purge
      setStudents(prev => prev.filter(st => st.id !== id));
      showFeedback('success', `[SANDBOX] Student record "${name}" removed locally.`);
      return true;
    }
  }, [backendUrl, connectionStatus, showFeedback]);

  // Update Student Grade: modifies student grade locally
  const updateStudentGrade = useCallback((id, newGrade) => {
    setStudents(prev => prev.map(st => st.id === id ? { ...st, grade: Number(newGrade) } : st));
    showFeedback('success', `Adjusted grade successfully to ${newGrade}%`);
  }, [showFeedback]);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('college_auth');
    setAuth(null);
    showFeedback('success', 'Logged out safely from ERP secure session.');
    window.location.reload();
  }, [showFeedback]);

  // Mounting poller
  useEffect(() => {
    checkHealthAndSync(backendUrl, true);

    pollTimerRef.current = setInterval(() => {
      checkHealthAndSync(backendUrl, false);
    }, 5000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [backendUrl, checkHealthAndSync]);

  const value = {
    auth,
    logout,
    backendUrl,
    connectionStatus,
    latency,
    serverInfo,
    students,
    courses,
    faculty,
    activePage,
    setActivePage,
    feedbackMessage,
    showFeedback,
    loading,
    lastSync,
    updateBackendUrl,
    addStudent,
    deleteStudent,
    updateStudentGrade,
    triggerManualCheck: () => checkHealthAndSync(backendUrl, true)
  };

  return (
    <ERPContext.Provider value={value}>
      {children}
    </ERPContext.Provider>
  );
}

export function useERP() {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
}
