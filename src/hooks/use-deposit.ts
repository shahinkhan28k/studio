
"use client"

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useUserStats } from './use-user-stats';
import { useSettings } from './use-settings';
import { convertToUSD } from '@/lib/utils';

export interface DepositSession {
  id: string;
  userId: string;
  amount: number; // amount in BDT
  method: string;
  createdAt: string;
  expiresAt: string;
}

export type DepositRecord = {
  id: string;
  userId: string;
  date: string;
  amount: number; // amount in USD
  method: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
};

const DEPOSIT_SESSION_STORAGE_KEY = 'depositSession';
const ALL_DEPOSITS_STORAGE_KEY = 'allDeposits';

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const setInStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};


export function useDeposit() {
  const { user } = useAuth();
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

  const startDepositSession = useCallback((amountInBDT: number, method: string) => {
    if (!user) {
      throw new Error('You must be logged in to start a deposit.');
    }
    
    clearDepositSession();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + settings.depositSessionDuration * 60 * 1000);

    const newSession: DepositSession = {
      id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      amount: amountInBDT, // Store amount in BDT in the session
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

    const allDeposits = getFromStorage<DepositRecord[]>(ALL_DEPOSITS_STORAGE_KEY, []);
    
    const amountInUSD = convertToUSD(session.amount, 'BDT');
    
    const newRecord: DepositRecord = {
        id: session.id,
        userId: session.userId,
        date: new Date().toISOString(),
        amount: amountInUSD, // Store amount in USD
        method: session.method,
        status: 'pending',
        transactionId: transactionId,
    };
    
    setInStorage(ALL_DEPOSITS_STORAGE_KEY, [newRecord, ...allDeposits]);
    clearDepositSession();
  }, [session, clearDepositSession]);

  return { session, startDepositSession, submitDeposit, clearDepositSession };
}


// A hook for the admin panel
export function useDeposits() {
    const [deposits, setDeposits] = useState<DepositRecord[]>([]);
    
    const loadDeposits = useCallback(() => {
        const allDeposits = getFromStorage<DepositRecord[]>(ALL_DEPOSITS_STORAGE_KEY, []);
        setDeposits(allDeposits.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, []);

    useEffect(() => {
        loadDeposits();
        window.addEventListener('storage', loadDeposits);
        return () => {
            window.removeEventListener('storage', loadDeposits);
        }
    }, [loadDeposits]);

    const updateDepositStatus = useCallback((depositId: string, userId: string, amount: number, status: 'completed' | 'failed') => {
        const allDeposits = getFromStorage<DepositRecord[]>(ALL_DEPOSITS_STORAGE_KEY, []);
        const depositIndex = allDeposits.findIndex(d => d.id === depositId);

        if (depositIndex === -1) {
            throw new Error("Deposit not found.");
        }
        
        const depositToUpdate = allDeposits[depositIndex];
        if (depositToUpdate.status !== 'pending') {
            throw new Error("This deposit has already been processed.");
        }
        
        allDeposits[depositIndex].status = status;
        setInStorage(ALL_DEPOSITS_STORAGE_KEY, allDeposits);

        if (status === 'completed') {
            const userStatsKey = `userStats-${userId}`;
            const currentStats = getFromStorage(userStatsKey, { totalDeposit: 0, availableBalance: 0 });
            const newStats = {
                ...currentStats,
                totalDeposit: currentStats.totalDeposit + amount,
                availableBalance: currentStats.availableBalance + amount,
            };
            setInStorage(userStatsKey, newStats);
        }
    }, []);

    return { deposits, updateDepositStatus, refreshDeposits: loadDeposits };
}
