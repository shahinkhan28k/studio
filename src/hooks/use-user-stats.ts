
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { useSettings } from "./use-settings"
import type { UserInfo } from "./use-admin-stats";
import type { UserInvestment } from "./use-investments";

export type UserStats = {
  totalEarnings: number
  totalDeposit: number
  totalWithdraw: number
  totalInvestment: number;
  availableBalance: number
  todaysEarnings: number
}

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type DepositRecord = {
  id: string;
  userId: string;
  date: string;
  amount: number; // Stored in BDT
  method: string;
  status: TransactionStatus;
  transactionId?: string;
}

export type WithdrawalRecord = {
    id: string;
    userId: string;
    date: string;
    amount: number; // Stored in BDT
    method: string;
    status: TransactionStatus;
    details?: {
      walletNumber?: string | null;
      bankName?: string | null;
      accountHolderName?: string | null;
      bankAccountNumber?: string | null;
      swiftCode?: string | null;
      usdtAddress?: string | null;
    }
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
  totalInvestment: 0,
  availableBalance: 0,
  todaysEarnings: 0,
}

// Helper functions to interact with localStorage
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

const calculateDailyEarnings = (userId: string) => {
    if(!userId) return;
    const allUserInvestments = getFromStorage<UserInvestment[]>('userInvestments', []);
    const activeInvestments = allUserInvestments.filter(inv => inv.userId === userId && inv.isActive);
    
    let dailyInvestmentIncome = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    activeInvestments.forEach(investment => {
        const investmentDate = new Date(investment.investmentDate);
        investmentDate.setHours(0, 0, 0, 0);
        const endDate = new Date(investment.endDate);
        endDate.setHours(0, 0, 0, 0);

        if (today >= investmentDate && today <= endDate) {
            dailyInvestmentIncome += investment.dailyIncome;
        }
    });

    const userStats = getFromStorage<UserStats>(`userStats-${userId}`, defaultStats);
    const lastEarningsUpdateKey = `lastEarningsUpdate-${userId}`;
    const lastUpdateStr = getFromStorage(lastEarningsUpdateKey, new Date(0).toISOString());
    const lastUpdate = new Date(lastUpdateStr);
    lastUpdate.setHours(0, 0, 0, 0);

    if (today > lastUpdate) {
        const newStats = {
            ...userStats,
            availableBalance: userStats.availableBalance + dailyInvestmentIncome,
            totalEarnings: userStats.totalEarnings + dailyInvestmentIncome,
            todaysEarnings: dailyInvestmentIncome 
        };
        setInStorage(`userStats-${userId}`, newStats);
        setInStorage(lastEarningsUpdateKey, today.toISOString());
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
    
    calculateDailyEarnings(uid);

    const allDeposits = getFromStorage<DepositRecord[]>(`allDeposits`, []);
    setDepositHistory(allDeposits.filter(d => d.userId === uid));

    const allWithdrawals = getFromStorage<WithdrawalRecord[]>(`allWithdrawals`, []);
    setWithdrawalHistory(allWithdrawals.filter(w => w.userId === uid));

    setReferrals(getFromStorage(`referrals-${uid}`, []));
    
    // Calculate total investment and update stats
    const allUserInvestments = getFromStorage<UserInvestment[]>('userInvestments', []);
    const userInvestments = allUserInvestments.filter(inv => inv.userId === uid);
    const totalInvestment = userInvestments.reduce((sum, inv) => sum + inv.initialInvestment, 0);

    const currentStats = getFromStorage(`userStats-${uid}`, defaultStats);
    const updatedStats = { ...currentStats, totalInvestment };
    setInStorage(`userStats-${uid}`, updatedStats);
    setStats(updatedStats);


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
      if(userId === uid) {
        setStats(updatedStats);
      }
  }, [uid]);

  const addEarning = useCallback(async (amount: number) => {
    if (!user || !user.uid) return;

    const currentUserStats = getFromStorage(`userStats-${user.uid}`, defaultStats);
    const newTotalEarnings = currentUserStats.totalEarnings + amount;
    const newAvailableBalance = currentUserStats.availableBalance + amount;
    const newTodaysEarnings = currentUserStats.todaysEarnings + amount;
    
    updateStats(user.uid, { 
        totalEarnings: newTotalEarnings, 
        availableBalance: newAvailableBalance,
        todaysEarnings: newTodaysEarnings
    });
    
    // Handle referral commission
    let allUsers: UserInfo[] = getFromStorage('allUsersData', []);
    let currentUserInfo = allUsers.find(u => u.uid === user.uid);
    let tempReferrerId = currentUserInfo?.referrerId;
    
    // Iterate up the referral chain
    for (const level of settings.referralLevels.sort((a,b)=>a.level - b.level)) {
        if (!tempReferrerId) break;

        const referrerInfo = allUsers.find(u => u.uid === tempReferrerId);
        if (!referrerInfo) break;
        
        const referrerReferrals: Referral[] = getFromStorage(`referrals-${referrerInfo.uid}`, []);
        const referrerLevel = settings.referralLevels
            .filter(l => referrerReferrals.length >= l.requiredReferrals)
            .sort((a,b) => b.level-a.level)[0];
        
        if (referrerLevel && referrerLevel.level === level.level) {
             const commission = amount * (referrerLevel.commissionRate / 100);
             const referrerStats = getFromStorage(`userStats-${referrerInfo.uid}`, defaultStats);
             updateStats(referrerInfo.uid, {
                totalEarnings: referrerStats.totalEarnings + commission,
                availableBalance: referrerStats.availableBalance + commission
            });
            
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
             setInStorage(`referrals-${referrerInfo.uid}`, referrerReferrals);
        }
        
        tempReferrerId = referrerInfo.referrerId;
    }


  }, [user, settings, updateStats]);
  
  
  const addWithdrawal = useCallback((withdrawal: Omit<WithdrawalRecord, 'date' | 'id' | 'userId'>) => {
    if (!uid) return;

    const currentStats = getFromStorage(`userStats-${uid}`, defaultStats);
    if (withdrawal.amount > currentStats.availableBalance) {
        throw new Error("Insufficient Balance");
    }

    // No balance change on request, only on approval by admin
    const newRecord: WithdrawalRecord = { 
        ...withdrawal, 
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        userId: uid
    };
    
    const allWithdrawals = getFromStorage<WithdrawalRecord[]>(`allWithdrawals`, []);
    setInStorage(`allWithdrawals`, [newRecord, ...allWithdrawals]);

  }, [uid]);

  return { stats, depositHistory, withdrawalHistory, referrals, addEarning, addWithdrawal, updateStats, refresh: loadAllUserData };
}

    