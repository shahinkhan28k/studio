
"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
    email: string;
    // For simplicity, we are not storing the password hash, but in a real app, you should.
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateAdminCredentials: (email: string, pass: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_CREDS_KEY = 'adminCredentials';
const ADMIN_SESSION_KEY = 'adminSession';

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAdminCredentials = useCallback(() => {
    if(typeof window === 'undefined') return { email: '', password: '' };
    try {
        const storedCreds = localStorage.getItem(ADMIN_CREDS_KEY);
        if (storedCreds) {
            return JSON.parse(storedCreds);
        }
    } catch (e) { console.error(e) }

    // Set default credentials if none exist
    const defaultCreds = { email: 'shahinkhan28r@gmail.com', password: 'Shahin811@##' };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(defaultCreds));
    return defaultCreds;
  }, []);

  useEffect(() => {
    if(typeof window === 'undefined') return;
    try {
        const sessionActive = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
        if (sessionActive) {
            const creds = getAdminCredentials();
            setAdmin({ email: creds.email });
        }
    } catch(e) { console.error(e); }
    setLoading(false);
  }, [getAdminCredentials]);

  const login = useCallback((email: string, pass: string): boolean => {
    const creds = getAdminCredentials();
    if (email.toLowerCase() === creds.email.toLowerCase() && pass === creds.password) {
      setAdmin({ email: creds.email });
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  }, [getAdminCredentials]);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    router.push('/admin/login');
  }, [router]);

  const updateAdminCredentials = useCallback((email: string, pass: string) => {
    const creds = getAdminCredentials();
    const newCreds = {
      email: email,
      // If password is blank, keep old one.
      password: pass ? pass : creds.password,
    };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(newCreds));
    // Update current session if email changed
    if (admin && admin.email.toLowerCase() !== email.toLowerCase()) {
        setAdmin({ email });
    }
  }, [getAdminCredentials, admin]);

  const value = { admin, loading, login, logout, updateAdminCredentials };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
