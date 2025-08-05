
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { useSettings } from "./use-settings"

export type UserStats = {
  totalEarnings: number
  totalDeposit: number
  totalWithdraw: number
  availableBalance: number
}

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type DepositRecord = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: TransactionStatus;
}

export type WithdrawalRecord = {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: TransactionStatus;
}

export type Referral = {
    id: string; // The UID of the referred user
    name: string;
    earnings: number; // Commission earned from this specific referral
}

export const defaultStats: UserStats = {
  totalEarnings: 0,
  totalDeposit: 0,
  totalWithdraw: 0,
  availableBalance: 0,
}

// Helper functions to interact with localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const setInStorage = <T>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

export function useUserStats() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const uid = user?.uid

  const [stats, setStats] = useState<UserStats>(defaultStats)
  const [depositHistory, setDepositHistory] = useState<DepositRecord[]>([])
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])

  const loadAllUserData = useCallback(() => {
    if (!uid) {
        setStats(defaultStats);
        setDepositHistory([]);
        setWithdrawalHistory([]);
        setReferrals([]);
        return;
    };
    
    setStats(getFromStorage(`userStats-${uid}`, defaultStats));
    setDepositHistory(getFromStorage(`depositHistory-${uid}`, []));
    setWithdrawalHistory(getFromStorage(`withdrawalHistory-${uid}`, []));
    setReferrals(getFromStorage(`referrals-${uid}`, []));

  }, [uid]);

  useEffect(() => {
    loadAllUserData();
    window.addEventListener('storage', loadAllUserData);
    return () => {
        window.removeEventListener('storage', loadAllUserData);
    };
  }, [loadAllUserData]);
  

  const updateStats = useCallback((newStats: Partial<UserStats>) => {
      if (!uid) return;
      const currentStats = getFromStorage(`userStats-${uid}`, defaultStats);
      const updatedStats = { ...currentStats, ...newStats };
      setInStorage(`userStats-${uid}`, updatedStats);
  }, [uid]);

  const addEarning = useCallback(async (amount: number) => {
    if (!user || !user.uid) return;

    const currentUserStats = getFromStorage(`userStats-${user.uid}`, defaultStats);
    const newTotalEarnings = currentUserStats.totalEarnings + amount;
    const newAvailableBalance = currentUserStats.availableBalance + amount;
    
    updateStats({ totalEarnings: newTotalEarnings, availableBalance: newAvailableBalance });
    
    // Handle referral commission
    const allUsers = getFromStorage('allUsersData', []);
    const currentUserInfo = allUsers.find(u => u.uid === user.uid);
    const referrerId = currentUserInfo?.referrerId;

    if (referrerId) {
        const commission = amount * (settings.referralCommissionRateL1 / 100);
        const referrerStats = getFromStorage(`userStats-${referrerId}`, defaultStats);
        setInStorage(`userStats-${referrerId}`, {
            ...referrerStats,
            totalEarnings: referrerStats.totalEarnings + commission,
            availableBalance: referrerStats.availableBalance + commission
        });

        const referrerReferrals = getFromStorage(`referrals-${referrerId}`, []);
        const existingReferralIndex = referrerReferrals.findIndex(r => r.id === user.uid);
        if (existingReferralIndex > -1) {
            referrerReferrals[existingReferralIndex].earnings += commission;
        } else {
            referrerReferrals.push({
                id: user.uid,
                name: user.displayName || user.email || 'Anonymous',
                earnings: commission
            });
        }
        setInStorage(`referrals-${referrerId}`, referrerReferrals);
    }

  }, [user, settings.referralCommissionRateL1, updateStats]);
  
  const addDeposit = useCallback((deposit: Omit<DepositRecord, 'date' | 'id'>) => {
    if (!uid) return;
    
    const currentStats = getFromStorage(`userStats-${uid}`, defaultStats);
    const newTotalDeposit = currentStats.totalDeposit + deposit.amount;
    const newAvailableBalance = currentStats.availableBalance + deposit.amount;
    updateStats({ totalDeposit: newTotalDeposit, availableBalance: newAvailableBalance });

    const newRecord: DepositRecord = { 
        ...deposit, 
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString() 
    };
    const currentHistory = getFromStorage(`depositHistory-${uid}`, []);
    setInStorage(`depositHistory-${uid}`, [newRecord, ...currentHistory]);
  }, [uid, updateStats]);
  
  const addWithdrawal = useCallback((withdrawal: Omit<WithdrawalRecord, 'date' | 'id'>) => {
    if (!uid) return;

    const currentStats = getFromStorage(`userStats-${uid}`, defaultStats);
    if (withdrawal.amount > currentStats.availableBalance) {
        throw new Error("Insufficient Balance");
    }

    const newTotalWithdraw = currentStats.totalWithdraw + withdrawal.amount;
    const newAvailableBalance = currentStats.availableBalance - withdrawal.amount;
    updateStats({ totalWithdraw: newTotalWithdraw, availableBalance: newAvailableBalance });

    const newRecord: WithdrawalRecord = { 
        ...withdrawal, 
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString() 
    };
    const currentHistory = getFromStorage(`withdrawalHistory-${uid}`, []);
    setInStorage(`withdrawalHistory-${uid}`, [newRecord, ...currentHistory]);

  }, [uid, updateStats]);

  return { stats, depositHistory, withdrawalHistory, referrals, addEarning, addDeposit, addWithdrawal, refresh: loadAllUserData };
}
