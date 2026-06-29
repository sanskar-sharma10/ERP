import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

// Hardcoded credentials — replace with real API call when backend auth is ready
const MOCK_USERS = [
  {
    email: 'admin@college.edu',
    password: 'admin123',
    profile: {
      name: 'Dean Arthur Pendelton',
      email: 'admin@college.edu',
      role: 'Dean / Systems Admin',
      token: 'jwt_mock_token_admin_2026',
    },
  },
  {
    email: 'student@college.edu',
    password: 'student123',
    profile: {
      name: 'Alexander Pierce',
      email: 'student@college.edu',
      role: 'Undergraduate (Year 3)',
      token: 'jwt_mock_token_student_2026',
    },
  },
];

/**
 * Wraps auth context with login/logout logic and toast feedback.
 */
export function useAuthActions() {
  const { auth, login, logout: ctxLogout } = useAuth();
  const { showToast } = useToast();

  const loginWithCredentials = useCallback(
    async (email, password) => {
      // Simulate async auth call
      await new Promise((r) => setTimeout(r, 800));

      const match = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (match) {
        login(match.profile);
        showToast('success', `Welcome back, ${match.profile.name.split(' ')[0]}.`);
        return true;
      } else {
        showToast('error', 'Authentication failed. Check your credentials.');
        return false;
      }
    },
    [login, showToast]
  );

  const logout = useCallback(() => {
    ctxLogout();
    showToast('success', 'Signed out successfully.');
  }, [ctxLogout, showToast]);

  return { auth, loginWithCredentials, logout };
}
