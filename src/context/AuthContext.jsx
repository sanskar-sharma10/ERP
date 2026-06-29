import { createContext, useContext, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEYS.AUTH);
    return cached ? JSON.parse(cached) : null;
  });

  const login = useCallback((userData) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(userData));
    setAuth(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
