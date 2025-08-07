
"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
    email: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateAdminCredentials: (email: string, pass: string) => void;
  adminEmails: string[];
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_CREDS_KEY = 'adminCredentials';
const ADMIN_SESSION_KEY = 'adminSession';

const adminEmails = ['shahinkhan28r@gmail.com', 'shahinkhan3563@gmail.com'];

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAdminCredentials = useCallback(() => {
    if(typeof window === 'undefined') return { password: '' };
    try {
        const storedCreds = localStorage.getItem(ADMIN_CREDS_KEY);
        if (storedCreds) {
            return JSON.parse(storedCreds);
        }
    } catch (e) { console.error(e) }

    // Set default credentials if none exist
    const defaultCreds = { password: 'Shahin811@##' };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(defaultCreds));
    return defaultCreds;
  }, []);

  useEffect(() => {
    if(typeof window === 'undefined') return;
    try {
        const sessionActive = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || 'null') as AdminUser | null;
        if (sessionActive && adminEmails.includes(sessionActive.email.toLowerCase())) {
            setAdmin(sessionActive);
        }
    } catch(e) { console.error(e); }
    setLoading(false);
  }, []);

  const login = useCallback((email: string, pass: string): boolean => {
    const creds = getAdminCredentials();
    const normalizedEmail = email.toLowerCase();
    
    if (adminEmails.includes(normalizedEmail) && pass === creds.password) {
      const adminUser = { email: normalizedEmail };
      setAdmin(adminUser);
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
      return true;
    }
    return false;
  }, [getAdminCredentials]);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    router.push('/admin/login');
  }, [router]);

  const updateAdminCredentials = useCallback((password: string) => {
    if(password) {
        localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ password }));
    }
  }, []);

  const value = { admin, loading, login, logout, updateAdminCredentials, adminEmails };

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
