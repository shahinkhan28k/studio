
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  doc,
  deleteDoc,
  getDoc,
  writeBatch,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
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

export function useAdminStats() {
  const [stats, setStats] = useState<AdminSummaryStats>(defaultAdminStats)
  const [recentSignups, setRecentSignups] = useState<UserInfo[]>([])
  const [allUsersData, setAllUsersData] = useState<AllUsersData[]>([])
  const [referralDetails, setReferralDetails] = useState<ReferralDetail[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAdminStats = useCallback(async () => {
    setLoading(true)
    try {
      const usersQuery = query(collection(db, "users"))
      const usersSnapshot = await getDocs(usersQuery)
      const users = usersSnapshot.docs.map(
        (doc) => ({...doc.data(), uid: doc.id} as UserInfo)
      )

      let totalEarnings = 0
      let totalDeposits = 0
      
      const allUsersDataPromises = users.map(async (user) => {
        const statsDocRef = doc(db, "userStats", user.uid)
        const statsSnap = await getDoc(statsDocRef)
        const userStats = statsSnap.exists()
          ? (statsSnap.data() as UserStats)
          : defaultStats
        
        totalEarnings += userStats.totalEarnings
        totalDeposits += userStats.totalDeposit
        
        return {
          ...user,
          stats: userStats,
        }
      })
      
      const resolvedAllUsersData = await Promise.all(allUsersDataPromises)
      setAllUsersData(resolvedAllUsersData)
      
      const tasksQuery = query(collection(db, "tasks"))
      const tasksSnapshot = await getDocs(tasksQuery)
      const tasksCompleted = tasksSnapshot.size;

      setStats({
        totalUsers: users.length,
        totalEarnings,
        totalDeposits,
        tasksCompleted,
      })

      const recentSignupsQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        limit(5)
      )
      const recentSignupsSnapshot = await getDocs(recentSignupsQuery)
      setRecentSignups(
        recentSignupsSnapshot.docs.map((doc) => doc.data() as UserInfo)
      )
      
      const referralDetailsPromises = users.map(async (user) => {
          const referrerId = user.referrerId || null;
          const referrer = referrerId ? users.find(u => u.uid === referrerId) : null;
          
          const referralsQuery = query(collection(db, "users"), where("referrerId", "==", user.uid));
          const referralsSnapshot = await getDocs(referralsQuery);

          return {
              ...user,
              referrerName: referrer?.displayName || 'N/A',
              referralCount: referralsSnapshot.size,
          };
      });

      const resolvedReferralDetails = await Promise.all(referralDetailsPromises);
      setReferralDetails(resolvedReferralDetails);


    } catch (error) {
      console.error("Error fetching admin stats:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAdminStats()
  }, [fetchAdminStats])

  const deleteUser = useCallback(
    async (uid: string) => {
      if (!uid) return

      const batch = writeBatch(db);
      const userDocRef = doc(db, "users", uid);
      const userStatsDocRef = doc(db, "userStats", uid);
      const accountDetailsDocRef = doc(db, "accountDetails", uid);

      batch.delete(userDocRef);
      batch.delete(userStatsDocRef);
      batch.delete(accountDetailsDocRef);

      const depositHistoryQuery = query(collection(db, `userStats/${uid}/depositHistory`));
      const withdrawalHistoryQuery = query(collection(db, `userStats/${uid}/withdrawalHistory`));
      const referralsQuery = query(collection(db, `userStats/${uid}/referrals`));
      const completedTasksQuery = query(collection(db, `userStats/${uid}/completedTasks`));

      const [depositDocs, withdrawalDocs, referralDocs, completedTasksDocs] = await Promise.all([
          getDocs(depositHistoryQuery),
          getDocs(withdrawalHistoryQuery),
          getDocs(referralsQuery),
          getDocs(completedTasksQuery)
      ]);

      depositDocs.forEach(doc => batch.delete(doc.ref));
      withdrawalDocs.forEach(doc => batch.delete(doc.ref));
      referralDocs.forEach(doc => batch.delete(doc.ref));
      completedTasksDocs.forEach(doc => batch.delete(doc.ref));

      await batch.commit();

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
    loading,
    refresh: fetchAdminStats,
  }
}
