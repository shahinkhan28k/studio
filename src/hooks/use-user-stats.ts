
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"

export type UserStats = {
  totalEarnings: number
  totalDeposit: number
  totalWithdraw: number
  availableBalance: number
}

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type DepositRecord = {
  date: string;
  amount: number;
  method: string;
  status: TransactionStatus;
}

export type WithdrawalRecord = {
    date: string;
    amount: number;
    method: string;
    status: TransactionStatus;
}

const defaultStats: UserStats = {
  totalEarnings: 0,
  totalDeposit: 0,
  totalWithdraw: 0,
  availableBalance: 0,
}

const REFERRAL_COMMISSION_RATE = 0.05; // 5%

const getStoredData = <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") {
        return defaultValue;
    }
    try {
        const stored = window.localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored) as T;
        }
    } catch (error) {
        console.error(`Failed to parse ${key} from localStorage`, error);
    }
    return defaultValue;
}

const setStoredData = <T>(key: string, data: T) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
        // Manually dispatch a storage event to ensure same-page updates
        window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: JSON.stringify(data),
        }));
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage`, error);
    }
}

// This is a placeholder. In a real app, you'd fetch this from your backend/DB.
const hasReferrer = (uid: string | undefined): boolean => {
    if (!uid) return false;
    // In a real app, you would check if the user with this 'uid' was referred by someone.
    // For this demo, we'll just check for a query param saved during signup.
    if (typeof window !== "undefined") {
        return !!localStorage.getItem(`referrer_${uid}`);
    }
    return false;
}


export function useUserStats() {
  const { user } = useAuth();
  const uid = user?.uid;

  const STATS_STORAGE_KEY = uid ? `userStats_${uid}` : 'userStats';
  const DEPOSIT_HISTORY_KEY = uid ? `depositHistory_${uid}` : 'depositHistory';
  const WITHDRAWAL_HISTORY_KEY = uid ? `withdrawalHistory_${uid}` : 'withdrawalHistory';

  const [stats, setStats] = useState<UserStats>(() => getStoredData(STATS_STORAGE_KEY, defaultStats));
  const [depositHistory, setDepositHistory] = useState<DepositRecord[]>(() => getStoredData(DEPOSIT_HISTORY_KEY, []));
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>(() => getStoredData(WITHDRAWAL_HISTORY_KEY, []));

  useEffect(() => {
    if (uid) {
        setStats(getStoredData(STATS_STORAGE_KEY, defaultStats));
        setDepositHistory(getStoredData(DEPOSIT_HISTORY_KEY, []));
        setWithdrawalHistory(getStoredData(WITHDRAWAL_HISTORY_KEY, []));
    } else {
        // Clear stats if user logs out
        setStats(defaultStats);
        setDepositHistory([]);
        setWithdrawalHistory([]);
    }
  }, [uid, STATS_STORAGE_KEY, DEPOSIT_HISTORY_KEY, WITHDRAWAL_HISTORY_KEY]);


  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
        if (!uid) return;
        const keys = {
            [STATS_STORAGE_KEY]: () => setStats(getStoredData(STATS_STORAGE_KEY, defaultStats)),
            [DEPOSIT_HISTORY_KEY]: () => setDepositHistory(getStoredData(DEPOSIT_HISTORY_KEY, [])),
            [WITHDRAWAL_HISTORY_KEY]: () => setWithdrawalHistory(getStoredData(WITHDRAWAL_HISTORY_KEY, [])),
        };

        if (event.key && event.key in keys) {
            (keys as any)[event.key]();
        }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [uid, STATS_STORAGE_KEY, DEPOSIT_HISTORY_KEY, WITHDRAWAL_HISTORY_KEY])
  
  const updateStats = useCallback((newStats: Partial<UserStats>) => {
    if (!uid) return;
    setStats((prevStats) => {
      const updatedStats = { ...prevStats, ...newStats }
      setStoredData(STATS_STORAGE_KEY, updatedStats)
      return updatedStats
    })
  }, [uid, STATS_STORAGE_KEY])

  const addEarning = useCallback((amount: number) => {
    if (!uid) return;
    setStats((prevStats) => {
      const newTotalEarnings = prevStats.totalEarnings + amount
      const newAvailableBalance = prevStats.availableBalance + amount
      
      // In a real app, you would have a backend service calculate and distribute commission.
      // This is a simplified client-side simulation.
      const referrerId = localStorage.getItem(`referrer_${uid}`);
      if (referrerId) {
          const commission = amount * REFERRAL_COMMISSION_RATE;
          const referrerStatsKey = `userStats_${referrerId}`;
          const referrerStats = getStoredData<UserStats>(referrerStatsKey, defaultStats);
          
          const updatedReferrerStats = {
              ...referrerStats,
              totalEarnings: referrerStats.totalEarnings + commission,
              availableBalance: referrerStats.availableBalance + commission
          };
          setStoredData(referrerStatsKey, updatedReferrerStats);
      }
      
      const updatedStats = {
        ...prevStats,
        totalEarnings: newTotalEarnings,
        availableBalance: newAvailableBalance,
      }
      
      setStoredData(STATS_STORAGE_KEY, updatedStats)
      return updatedStats
    })
  }, [uid, STATS_STORAGE_KEY])
  
  const addDeposit = useCallback((deposit: Omit<DepositRecord, 'date'>) => {
    if (!uid) return;
    setStats((prevStats) => {
        const newTotalDeposit = prevStats.totalDeposit + deposit.amount;
        const newAvailableBalance = prevStats.availableBalance + deposit.amount;
        const updatedStats = {
            ...prevStats,
            totalDeposit: newTotalDeposit,
            availableBalance: newAvailableBalance
        };
        setStoredData(STATS_STORAGE_KEY, updatedStats);
        return updatedStats;
    });

    setDepositHistory(prevHistory => {
        const newRecord: DepositRecord = { ...deposit, date: new Date().toISOString() };
        const updatedHistory = [newRecord, ...prevHistory];
        setStoredData(DEPOSIT_HISTORY_KEY, updatedHistory);
        return updatedHistory;
    })

  }, [uid, STATS_STORAGE_KEY, DEPOSIT_HISTORY_KEY]);
  
  const addWithdrawal = useCallback((withdrawal: Omit<WithdrawalRecord, 'date'>) => {
    if (!uid) return;
    setStats((prevStats) => {
        if(withdrawal.amount > prevStats.availableBalance) {
            return prevStats;
        }
        const newTotalWithdraw = prevStats.totalWithdraw + withdrawal.amount;
        const newAvailableBalance = prevStats.availableBalance - withdrawal.amount;
        const updatedStats = {
            ...prevStats,
            totalWithdraw: newTotalWithdraw,
            availableBalance: newAvailableBalance
        };
        setStoredData(STATS_STORAGE_KEY, updatedStats);
        return updatedStats;
    });

    setWithdrawalHistory(prevHistory => {
        const newRecord: WithdrawalRecord = { ...withdrawal, date: new Date().toISOString() };
        const updatedHistory = [newRecord, ...prevHistory];
        setStoredData(WITHDRAWAL_HISTORY_KEY, updatedHistory);
        return updatedHistory;
    });

  }, [uid, STATS_STORAGE_KEY, WITHDRAWAL_HISTORY_KEY]);


  return { stats, updateStats, addEarning, addDeposit, addWithdrawal, depositHistory, withdrawalHistory }
}
