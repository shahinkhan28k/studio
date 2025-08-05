
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { useSettings } from "./use-settings"
import type { UserInfo } from "./use-admin-stats";

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
  

  const updateStats = useCallback((userId: string, newStats: Partial<UserStats>) => {
      if (!userId) return;
      const currentStats = getFromStorage(`userStats-${userId}`, defaultStats);
      const updatedStats = { ...currentStats, ...newStats };
      setInStorage(`userStats-${userId}`, updatedStats);
  }, []);

  const addEarning = useCallback(async (amount: number) => {
    if (!user || !user.uid) return;

    const currentUserStats = getFromStorage(`userStats-${user.uid}`, defaultStats);
    const newTotalEarnings = currentUserStats.totalEarnings + amount;
    const newAvailableBalance = currentUserStats.availableBalance + amount;
    
    updateStats(user.uid, { totalEarnings: newTotalEarnings, availableBalance: newAvailableBalance });
    
    // Handle referral commission
    const allUsers: UserInfo[] = getFromStorage('allUsersData', []);
    const currentUserInfo = allUsers.find(u => u.uid === user.uid);
    const referrerId = currentUserInfo?.referrerId;

    if (referrerId) {
        const referrerInfo = allUsers.find(u => u.uid === referrerId);
        if (referrerInfo) {
            const commissionL1 = amount * (settings.referralCommissionRateL1 / 100);
            
            // Add L1 commission
            const referrerStats = getFromStorage(`userStats-${referrerId}`, defaultStats);
            updateStats(referrerId, {
                totalEarnings: referrerStats.totalEarnings + commissionL1,
                availableBalance: referrerStats.availableBalance + commissionL1
            });

            // Update referrer's referral list
            const referrerReferrals: Referral[] = getFromStorage(`referrals-${referrerId}`, []);
            const existingReferralIndex = referrerReferrals.findIndex(r => r.id === user.uid);
            if (existingReferralIndex > -1) {
                referrerReferrals[existingReferralIndex].earnings += commissionL1;
            } else {
                referrerReferrals.push({
                    id: user.uid,
                    name: user.displayName || user.email || 'Anonymous',
                    earnings: commissionL1
                });
            }
            setInStorage(`referrals-${referrerId}`, referrerReferrals);

            // Handle L2 and L3 commissions
            const l2ReferrerId = referrerInfo.referrerId;
            if (l2ReferrerId) {
                const commissionL2 = amount * (settings.referralCommissionRateL2 / 100);
                 const l2ReferrerStats = getFromStorage(`userStats-${l2ReferrerId}`, defaultStats);
                updateStats(l2ReferrerId, {
                    totalEarnings: l2ReferrerStats.totalEarnings + commissionL2,
                    availableBalance: l2ReferrerStats.availableBalance + commissionL2
                });

                 const l2ReferrerInfo = allUsers.find(u => u.uid === l2ReferrerId);
                 const l3ReferrerId = l2ReferrerInfo?.referrerId;
                 if (l3ReferrerId) {
                    const commissionL3 = amount * (settings.referralCommissionRateL3 / 100);
                    const l3ReferrerStats = getFromStorage(`userStats-${l3ReferrerId}`, defaultStats);
                    updateStats(l3ReferrerId, {
                        totalEarnings: l3ReferrerStats.totalEarnings + commissionL3,
                        availableBalance: l3ReferrerStats.availableBalance + commissionL3
                    });
                 }
            }
        }
    }

  }, [user, settings, updateStats]);
  
  const addDeposit = useCallback((deposit: Omit<DepositRecord, 'date' | 'id'>) => {
    if (!uid) return;
    
    const currentStats = getFromStorage(`userStats-${uid}`, defaultStats);
    const newTotalDeposit = currentStats.totalDeposit + deposit.amount;
    const newAvailableBalance = currentStats.availableBalance + deposit.amount;
    updateStats(uid, { totalDeposit: newTotalDeposit, availableBalance: newAvailableBalance });

    const newRecord: DepositRecord = { 
        ...deposit, 
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        status: 'completed' // Mark as completed immediately
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
    updateStats(uid, { totalWithdraw: newTotalWithdraw, availableBalance: newAvailableBalance });

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
