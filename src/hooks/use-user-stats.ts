
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

    const lastEarningsUpdateKey = `lastEarningsUpdate-${userId}`;
    const lastUpdateStr = getFromStorage(lastEarningsUpdateKey, new Date(0).toISOString());
    const lastUpdate = new Date(lastUpdateStr);
    lastUpdate.setHours(0, 0, 0, 0);

    if (today > lastUpdate) {
        activeInvestments.forEach(investment => {
            const investmentDate = new Date(investment.investmentDate);
            investmentDate.setHours(0, 0, 0, 0);
            const endDate = new Date(investment.endDate);
            endDate.setHours(0, 0, 0, 0);

            if (today >= investmentDate && today <= endDate) {
                dailyInvestmentIncome += investment.dailyIncome;
            }
        });

        if (dailyInvestmentIncome > 0) {
            const userStats = getFromStorage<UserStats>(`userStats-${userId}`, defaultStats);
            const newStats = {
                ...userStats,
                availableBalance: userStats.availableBalance + dailyInvestmentIncome,
                totalEarnings: userStats.totalEarnings + dailyInvestmentIncome,
                todaysEarnings: userStats.todaysEarnings + dailyInvestmentIncome
            };
            setInStorage(`userStats-${userId}`, newStats);
        }
        
        // Always update the date, and if no income today, reset today's earnings
        const userStats = getFromStorage<UserStats>(`userStats-${userId}`, defaultStats);
        setInStorage(`userStats-${userId}`, { ...userStats, todaysEarnings: dailyInvestmentIncome });
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

  const addEarning = useCallback(async (baseAmount: number, earningUserId?: string) => {
    const targetUserId = earningUserId || (user?.uid);
    if (!targetUserId) return;

    const currentUserStats = getFromStorage(`userStats-${targetUserId}`, defaultStats);
    const newTotalEarnings = currentUserStats.totalEarnings + baseAmount;
    const newAvailableBalance = currentUserStats.availableBalance + baseAmount;
    const newTodaysEarnings = currentUserStats.todaysEarnings + baseAmount;
    
    updateStats(targetUserId, { 
        totalEarnings: newTotalEarnings, 
        availableBalance: newAvailableBalance,
        todaysEarnings: newTodaysEarnings
    });
    
    // Handle referral commission
    let allUsers: UserInfo[] = getFromStorage('allUsersData', []);
    let earningUserInfo = allUsers.find(u => u.uid === targetUserId);
    
    // This is for commissions from other users (tasks or investment)
    if (earningUserInfo?.referrerId) {
        let parentReferrerId = earningUserInfo.referrerId;
        if (parentReferrerId) {
            const referrerStats = getFromStorage(`userStats-${parentReferrerId}`, defaultStats);
            // Commission logic for tasks (fixed amount per task)
            const commission = settings.referralLevels[0]?.commissionAmount ?? 0;
            
            if (commission > 0) {
              updateStats(parentReferrerId, {
                  totalEarnings: referrerStats.totalEarnings + commission,
                  availableBalance: referrerStats.availableBalance + commission,
              });
            }
        }
    } else if (earningUserId && settings.investmentReferralCommissionRate > 0) {
        // This block handles investment referral commission for the immediate referrer.
        const referrerId = allUsers.find(u => u.uid === earningUserId)?.referrerId;
        if (referrerId) {
            const commissionAmount = baseAmount * (settings.investmentReferralCommissionRate / 100);
            if (commissionAmount > 0) {
                const referrerStats = getFromStorage(`userStats-${referrerId}`, defaultStats);
                 updateStats(referrerId, {
                    totalEarnings: referrerStats.totalEarnings + commissionAmount,
                    availableBalance: referrerStats.availableBalance + commissionAmount,
                });
            }
        }
    }


  }, [user, settings.referralLevels, settings.investmentReferralCommissionRate, updateStats]);
  
  
  const addWithdrawal = useCallback((withdrawal: Omit<WithdrawalRecord, 'date' | 'id' | 'userId'>) => {
    if (!uid) return;

    const currentStats = getFromStorage(`userStats-${uid}`, defaultStats);
    if (withdrawal.amount > currentStats.availableBalance) {
        throw new Error("Insufficient Balance");
    }

    const newStats = {
      ...currentStats,
      availableBalance: currentStats.availableBalance - withdrawal.amount,
    };
    setInStorage(`userStats-${uid}`, newStats);

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

    
