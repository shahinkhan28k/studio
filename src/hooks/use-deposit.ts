
"use client"

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useUserStats } from './use-user-stats';
import { useSettings } from './use-settings';

export interface DepositSession {
  id: string;
  userId: string;
  amount: number;
  method: string;
  createdAt: string;
  expiresAt: string;
}

const DEPOSIT_SESSION_STORAGE_KEY = 'depositSession';

export function useDeposit() {
  const { user } = useAuth();
  const { addDeposit } = useUserStats();
  const { settings } = useSettings();
  const [session, setSession] = useState<DepositSession | null>(null);

  const clearDepositSession = useCallback(() => {
    localStorage.removeItem(DEPOSIT_SESSION_STORAGE_KEY);
    setSession(null);
  }, []);

  const loadSession = useCallback(() => {
    if (typeof window === 'undefined' || !user) {
      setSession(null);
      return;
    }
    const storedSession = localStorage.getItem(DEPOSIT_SESSION_STORAGE_KEY);
    if (storedSession) {
      const parsedSession: DepositSession = JSON.parse(storedSession);
      if (new Date(parsedSession.expiresAt) > new Date() && parsedSession.userId === user.uid) {
        setSession(parsedSession);
      } else {
        clearDepositSession();
      }
    }
  }, [user, clearDepositSession]);

  useEffect(() => {
    loadSession();
    window.addEventListener('storage', loadSession);
    return () => {
      window.removeEventListener('storage', loadSession);
    };
  }, [loadSession]);

  const startDepositSession = useCallback((amount: number, method: string) => {
    if (!user) {
      throw new Error('You must be logged in to start a deposit.');
    }
    
    // Clear any existing session
    clearDepositSession();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + settings.depositSessionDuration * 60 * 1000);

    const newSession: DepositSession = {
      id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      amount,
      method,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    localStorage.setItem(DEPOSIT_SESSION_STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
  }, [user, settings.depositSessionDuration, clearDepositSession]);

  const submitDeposit = useCallback((transactionId: string) => {
    if (!session) {
      throw new Error('No active deposit session found.');
    }
    if (new Date(session.expiresAt) < new Date()) {
      clearDepositSession();
      throw new Error('Your deposit session has expired.');
    }

    addDeposit({
      amount: session.amount,
      method: session.method,
      status: 'pending',
      transactionId: transactionId,
    });
    
    clearDepositSession();
  }, [session, addDeposit, clearDepositSession]);

  return { session, startDepositSession, submitDeposit, clearDepositSession };
}

    