
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
  writeBatch
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { UserStats, defaultStats } from "./use-user-stats"

type AdminSummaryStats = {
  totalUsers: number
  totalEarnings: number
  totalDeposits: number
  totalWithdrawals: number
  tasksCompleted: number
}

export type UserInfo = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt?: any
}

export type AllUsersData = UserInfo & {
  stats: UserStats
}

export type ReferralDetail = UserInfo & {
  referrerId: string | null
  referrerName: string | null
  referralCount: number
}

const defaultAdminStats: AdminSummaryStats = {
  totalUsers: 0,
  totalEarnings: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
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
        (doc) => doc.data() as UserInfo
      )

      let totalEarnings = 0
      let totalDeposits = 0
      let totalWithdrawals = 0
      
      const allUsersDataPromises = users.map(async (user) => {
        const statsDocRef = doc(db, "userStats", user.uid)
        const statsSnap = await getDoc(statsDocRef)
        const userStats = statsSnap.exists()
          ? (statsSnap.data() as UserStats)
          : defaultStats
        
        totalEarnings += userStats.totalEarnings
        totalDeposits += userStats.totalDeposit
        totalWithdrawals += userStats.totalWithdraw
        
        return {
          ...user,
          stats: userStats,
        }
      })
      
      const resolvedAllUsersData = await Promise.all(allUsersDataPromises)
      setAllUsersData(resolvedAllUsersData)
      
      // Calculate tasks completed based on total earnings
      // This is an estimation, assuming a fixed reward per task if not stored elsewhere
      const tasksQuery = query(collection(db, "tasks"))
      const tasksSnapshot = await getDocs(tasksQuery)
      const tasksCompleted = tasksSnapshot.size; // Or a more complex calculation if needed

      setStats({
        totalUsers: users.length,
        totalEarnings,
        totalDeposits,
        totalWithdrawals,
        tasksCompleted,
      })

      // Fetch recent signups
      const recentSignupsQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        limit(5)
      )
      const recentSignupsSnapshot = await getDocs(recentSignupsQuery)
      setRecentSignups(
        recentSignupsSnapshot.docs.map((doc) => doc.data() as UserInfo)
      )
      
      // Fetch referral details
      const referralDetailsPromises = users.map(async (user) => {
          const referrerId = user.referrerId || null;
          const referrer = referrerId ? users.find(u => u.uid === referrerId) : null;
          
          const referralsSnapshot = await getDocs(collection(db, `users/${user.uid}/referrals`));

          return {
              ...user,
              referrerId: referrerId,
              referrerName: referrer?.displayName || referrerId,
              referralCount: referrals.size,
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

      // List of top-level collections/documents to delete for a user
      const userDocRef = doc(db, "users", uid);
      const userStatsDocRef = doc(db, "userStats", uid);
      const accountDetailsDocRef = doc(db, "accountDetails", uid);

      batch.delete(userDocRef);
      batch.delete(userStatsDocRef);
      batch.delete(accountDetailsDocRef);

      // Delete subcollections
      const depositHistoryQuery = query(collection(db, `users/${uid}/depositHistory`));
      const withdrawalHistoryQuery = query(collection(db, `users/${uid}/withdrawalHistory`));
      const referralsQuery = query(collection(db, `users/${uid}/referrals`));

      const [depositDocs, withdrawalDocs, referralDocs] = await Promise.all([
          getDocs(depositHistoryQuery),
          getDocs(withdrawalHistoryQuery),
          getDocs(referralsQuery)
      ]);

      depositDocs.forEach(doc => batch.delete(doc.ref));
      withdrawalDocs.forEach(doc => batch.delete(doc.ref));
      referralDocs.forEach(doc => batch.delete(doc.ref));

      await batch.commit();

      // We need to re-fetch to update the UI
      fetchAdminStats()
      // Note: Deleting the user from Firebase Auth is a separate, more complex operation
      // that should be handled with a Cloud Function for security reasons.
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
