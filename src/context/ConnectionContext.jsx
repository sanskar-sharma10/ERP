import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { checkHealth, getStatus } from '../api/health.api.js';
import { STORAGE_KEYS, DEFAULT_BACKEND_URL, FALLBACK_COURSES } from '../utils/constants.js';

const ConnectionContext = createContext(null);

const POLL_INTERVAL_MS = 5000;

export function ConnectionProvider({ children }) {
  const [backendUrl, setBackendUrl] = useState(
    () => localStorage.getItem(STORAGE_KEYS.BACKEND_URL) || DEFAULT_BACKEND_URL
  );
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting' | 'connected' | 'offline'
  const [latency, setLatency] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);
  const [courses, setCourses] = useState([]);

  const pollRef = useRef(null);

  const syncServer = useCallback(async (url) => {
    try {
      const health = await checkHealth(url);
      setConnectionStatus('connected');
      setLatency(health.latencyMs);
      setServerInfo({ status: health.status, uptime: health.uptime, timestamp: health.timestamp });

      const statusData = await getStatus(url);
      const modules = statusData.modules || [];
      const mapped = modules.map((mod, i) => {
        const fallback = FALLBACK_COURSES[i] || { instructor: 'Staff', enrollment: 20 };
        return {
          id: mod.id,
          name: `${mod.id.toUpperCase()}-101: Live ${mod.name}`,
          instructor: fallback.instructor,
          enrollment: fallback.enrollment,
        };
      });
      setCourses(mapped.length > 0 ? mapped : FALLBACK_COURSES);
    } catch {
      setConnectionStatus('offline');
      setLatency(null);
      setServerInfo(null);
      setCourses((prev) => (prev.length === 0 ? FALLBACK_COURSES : prev));
    }
  }, []);

  const updateBackendUrl = useCallback(
    (newUrl) => {
      const cleaned = newUrl.replace(/\/$/, '');
      localStorage.setItem(STORAGE_KEYS.BACKEND_URL, cleaned);
      setBackendUrl(cleaned);
      setConnectionStatus('connecting');
    },
    []
  );

  // Start polling whenever backendUrl changes
  useEffect(() => {
    syncServer(backendUrl);
    pollRef.current = setInterval(() => syncServer(backendUrl), POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [backendUrl, syncServer]);

  return (
    <ConnectionContext.Provider
      value={{
        backendUrl,
        connectionStatus,
        latency,
        serverInfo,
        courses,
        updateBackendUrl,
        triggerSync: () => syncServer(backendUrl),
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error('useConnection must be used within ConnectionProvider');
  return ctx;
}
