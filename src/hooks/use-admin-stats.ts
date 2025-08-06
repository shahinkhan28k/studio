
"use client"

import { useState, useEffect, useCallback } from "react"
import { UserStats, defaultStats } from "./use-user-stats"

type AdminSummaryStats = {
  totalUsers: number
  totalEarnings: number
  totalDeposits: number
  tasksCompleted: number
}

export type UserInfo = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt?: any
  referrerId?: string | null;
}

export type AllUsersData = UserInfo & {
  stats: UserStats
}

export type ReferralDetail = UserInfo & {
  referrerName: string | null
  referralCount: number
}

const defaultAdminStats: AdminSummaryStats = {
  totalUsers: 0,
  totalEarnings: 0,
  totalDeposits: 0,
  tasksCompleted: 0,
}

const getAllUsers = (): UserInfo[] => {
    if (typeof window === "undefined") return [];
    const allUsersStr = localStorage.getItem('allUsersData');
    return allUsersStr ? JSON.parse(allUsersStr) : [];
}

const getUserStats = (uid: string): UserStats => {
    if (typeof window === "undefined") return defaultStats;
    const statsStr = localStorage.getItem(`userStats-${uid}`);
    return statsStr ? JSON.parse(statsStr) : defaultStats;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminSummaryStats>(defaultAdminStats)
  const [recentSignups, setRecentSignups] = useState<UserInfo[]>([])
  const [allUsersData, setAllUsersData] = useState<AllUsersData[]>([])
  const [referralDetails, setReferralDetails] = useState<ReferralDetail[]>([])

  const fetchAdminStats = useCallback(() => {
    try {
      const users = getAllUsers();
      
      let totalEarnings = 0
      let totalDeposits = 0
      
      const resolvedAllUsersData = users.map(user => {
        const userStats = getUserStats(user.uid);
        totalEarnings += userStats.totalEarnings
        totalDeposits += userStats.totalDeposit
        return {
          ...user,
          stats: userStats,
        }
      });
      setAllUsersData(resolvedAllUsersData);
      
      const tasksStr = localStorage.getItem('tasks');
      const tasks = tasksStr ? JSON.parse(tasksStr) : [];
      
      let tasksCompleted = 0;
      users.forEach(user => {
        const completedStr = localStorage.getItem(`allCompletedTasks`);
        if(completedStr) {
            const allCompleted = JSON.parse(completedStr);
            const userCompleted = allCompleted[user.uid] || [];
            tasksCompleted += userCompleted.length;
        }
      });


      setStats({
        totalUsers: users.length,
        totalEarnings,
        totalDeposits,
        tasksCompleted,
      })

      const sortedUsers = [...users].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentSignups(sortedUsers.slice(0, 5));
      
      const resolvedReferralDetails = users.map((user) => {
          const referrerId = user.referrerId || null;
          const referrer = referrerId ? users.find(u => u.uid === referrerId) : null;
          const referralCount = users.filter(u => u.referrerId === user.uid).length;

          return {
              ...user,
              referrerName: referrer?.displayName || 'N/A',
              referralCount: referralCount,
          };
      });

      setReferralDetails(resolvedReferralDetails);

    } catch (error) {
      console.error("Error fetching admin stats from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    fetchAdminStats()
  }, [fetchAdminStats])

  const deleteUser = useCallback(
    (uid: string) => {
      if (!uid) return
      
      // Delete user from allUsersData
      const users = getAllUsers();
      const updatedUsers = users.filter(u => u.uid !== uid);
      localStorage.setItem('allUsersData', JSON.stringify(updatedUsers));
      
      // Delete user-specific data
      localStorage.removeItem(`userStats-${uid}`);
      localStorage.removeItem(`accountDetails-${uid}`);
      localStorage.removeItem(`depositHistory-${uid}`);
      localStorage.removeItem(`withdrawalHistory-${uid}`);
      localStorage.removeItem(`referrals-${uid}`);
      localStorage.removeItem(`completedTasks-${uid}`);
      
      // Refresh stats
      fetchAdminStats()
    },
    [fetchAdminStats]
  )

  return {
    stats,
    recentSignups,
    allUsersData,
    deleteUser,
    referralDetails,
    refresh: fetchAdminStats,
  }
}
