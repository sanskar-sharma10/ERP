import { useState, useEffect, useCallback } from 'react';
import { fetchStudents, createStudent, removeStudent } from '../api/students.api.js';
import { mapInventoryToStudent } from '../utils/formatters.js';
import { MAJOR_TO_CATEGORY, FALLBACK_STUDENTS } from '../utils/constants.js';
import { useConnection } from '../context/ConnectionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Manages the student list — fetching, adding, and removing.
 * Automatically falls back to local sandbox data when offline.
 */
export function useStudents() {
  const { backendUrl, connectionStatus } = useConnection();
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load students whenever connection status changes to connected
  useEffect(() => {
    if (connectionStatus === 'connected') {
      setLoading(true);
      fetchStudents(backendUrl)
        .then((raw) => setStudents(raw.map(mapInventoryToStudent)))
        .catch(() => {
          setStudents((prev) => (prev.length === 0 ? FALLBACK_STUDENTS : prev));
        })
        .finally(() => setLoading(false));
    } else if (connectionStatus === 'offline') {
      setStudents((prev) => (prev.length === 0 ? FALLBACK_STUDENTS : prev));
    }
  }, [backendUrl, connectionStatus]);

  const addStudent = useCallback(
    async (student) => {
      if (connectionStatus === 'connected') {
        try {
          const payload = {
            name: student.name,
            category: MAJOR_TO_CATEGORY[student.major] || 'Hardware',
            price: student.tuition,
            stock: student.grade,
          };
          const created = await createStudent(backendUrl, payload);
          setStudents((prev) => [mapInventoryToStudent(created), ...prev]);
          showToast('success', `Registered "${student.name}" on the live database.`);
          return true;
        } catch (err) {
          showToast('error', `Failed to register student: ${err.message}`);
          return false;
        }
      } else {
        // Offline sandbox
        const sandboxStudent = {
          id: `${Date.now()}_local`,
          name: student.name,
          major: student.major,
          tuition: student.tuition,
          grade: student.grade,
        };
        setStudents((prev) => [sandboxStudent, ...prev]);
        showToast('success', `[Sandbox] Registered "${student.name}" locally.`);
        return true;
      }
    },
    [backendUrl, connectionStatus, showToast]
  );

  const deleteStudent = useCallback(
    async (id, name) => {
      if (connectionStatus === 'connected') {
        try {
          await removeStudent(backendUrl, id);
          setStudents((prev) => prev.filter((s) => s.id !== id));
          showToast('success', `Removed student record for "${name}".`);
          return true;
        } catch (err) {
          showToast('error', `Failed to remove student: ${err.message}`);
          return false;
        }
      } else {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        showToast('success', `[Sandbox] Removed "${name}" locally.`);
        return true;
      }
    },
    [backendUrl, connectionStatus, showToast]
  );

  return { students, loading, addStudent, deleteStudent };
}
