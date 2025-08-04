
"use client"

import { useState, useEffect, useCallback } from "react"

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

const STATS_STORAGE_KEY = "userStats"
const DEPOSIT_HISTORY_KEY = "depositHistory"
const WITHDRAWAL_HISTORY_KEY = "withdrawalHistory"


const defaultStats: UserStats = {
  totalEarnings: 1250.75,
  totalDeposit: 500.00,
  totalWithdraw: 250.00,
  availableBalance: 1500.75,
}

// Helper to get data from localStorage
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

// Helper to set data in localStorage
const setStoredData = <T>(key: string, data: T) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage`, error);
    }
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(() => getStoredData(STATS_STORAGE_KEY, defaultStats));
  const [depositHistory, setDepositHistory] = useState<DepositRecord[]>(() => getStoredData(DEPOSIT_HISTORY_KEY, []));
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>(() => getStoredData(WITHDRAWAL_HISTORY_KEY, []));


  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STATS_STORAGE_KEY) {
         setStats(getStoredData(STATS_STORAGE_KEY, defaultStats))
      }
      if (event.key === DEPOSIT_HISTORY_KEY) {
        setDepositHistory(getStoredData(DEPOSIT_HISTORY_KEY, []))
      }
      if (event.key === WITHDRAWAL_HISTORY_KEY) {
        setWithdrawalHistory(getStoredData(WITHDRAWAL_HISTORY_KEY, []))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])
  
  const updateStats = useCallback((newStats: Partial<UserStats>) => {
    setStats((prevStats) => {
      const updatedStats = { ...prevStats, ...newStats }
      setStoredData(STATS_STORAGE_KEY, updatedStats)
      return updatedStats
    })
  }, [])

  const addEarning = useCallback((amount: number) => {
    setStats((prevStats) => {
      const newTotalEarnings = prevStats.totalEarnings + amount
      const newAvailableBalance = prevStats.availableBalance + amount
      const updatedStats = {
        ...prevStats,
        totalEarnings: newTotalEarnings,
        availableBalance: newAvailableBalance,
      }
      setStoredData(STATS_STORAGE_KEY, updatedStats)
      return updatedStats
    })
  }, [])
  
  const addDeposit = useCallback((deposit: Omit<DepositRecord, 'date'>) => {
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

  }, []);
  
  const addWithdrawal = useCallback((withdrawal: Omit<WithdrawalRecord, 'date'>) => {
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

  }, []);


  return { stats, updateStats, addEarning, addDeposit, addWithdrawal, depositHistory, withdrawalHistory }
}
