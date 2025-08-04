
"use client"

import { useState, useEffect, useCallback } from "react"

type UserStats = {
  totalEarnings: number
  totalDeposit: number
  totalWithdraw: number
  availableBalance: number
}

const STATS_STORAGE_KEY = "userStats"

const defaultStats: UserStats = {
  totalEarnings: 1250.75,
  totalDeposit: 500.00,
  totalWithdraw: 250.00,
  availableBalance: 1500.75,
}

// Helper to get stats from localStorage
const getStoredStats = (): UserStats => {
  if (typeof window === "undefined") {
    return defaultStats
  }
  try {
    const stored = window.localStorage.getItem(STATS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as UserStats
    }
  } catch (error) {
    console.error("Failed to parse user stats from localStorage", error)
  }
  return defaultStats
}

// Helper to set stats in localStorage
const setStoredStats = (stats: UserStats) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error("Failed to save user stats to localStorage", error)
  }
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(getStoredStats)

  useEffect(() => {
    // This effect ensures that if localStorage is updated in another tab,
    // this hook's state reflects that change.
    const handleStorageChange = () => {
      setStats(getStoredStats())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const updateStats = useCallback((newStats: Partial<UserStats>) => {
    setStats((prevStats) => {
      const updatedStats = { ...prevStats, ...newStats }
      setStoredStats(updatedStats)
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
      setStoredStats(updatedStats)
      return updatedStats
    })
  }, [])
  
  const addDeposit = useCallback((amount: number) => {
    setStats((prevStats) => {
        const newTotalDeposit = prevStats.totalDeposit + amount;
        const newAvailableBalance = prevStats.availableBalance + amount;
        const updatedStats = {
            ...prevStats,
            totalDeposit: newTotalDeposit,
            availableBalance: newAvailableBalance
        };
        setStoredStats(updatedStats);
        return updatedStats;
    });
  }, []);
  
  const addWithdrawal = useCallback((amount: number) => {
    setStats((prevStats) => {
        if(amount > prevStats.availableBalance) {
            // This check is a safeguard, the form should prevent this.
            return prevStats;
        }
        const newTotalWithdraw = prevStats.totalWithdraw + amount;
        const newAvailableBalance = prevStats.availableBalance - amount;
        const updatedStats = {
            ...prevStats,
            totalWithdraw: newTotalWithdraw,
            availableBalance: newAvailableBalance
        };
        setStoredStats(updatedStats);
        return updatedStats;
    });
  }, []);


  return { stats, updateStats, addEarning, addDeposit, addWithdrawal }
}
