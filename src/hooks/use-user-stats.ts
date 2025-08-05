
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { useSettings } from "./use-settings"
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export type UserStats = {
  totalEarnings: number
  totalDeposit: number
  totalWithdraw: number
  availableBalance: number
}

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type DepositRecord = {
  id?: string;
  date: any;
  amount: number;
  method: string;
  status: TransactionStatus;
}

export type WithdrawalRecord = {
    id?: string;
    date: any;
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

export function useUserStats() {
  const { user } = useAuth()
  const { settings, loading: settingsLoading } = useSettings()
  const uid = user?.uid

  const [stats, setStats] = useState<UserStats>(defaultStats)
  const [depositHistory, setDepositHistory] = useState<DepositRecord[]>([])
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)

  const loadAllUserData = useCallback(async () => {
    if (!uid || settingsLoading) return;
    setLoading(true);

    try {
      // Fetch stats
      const statsRef = doc(db, "userStats", uid);
      const statsSnap = await getDoc(statsRef);
      if (statsSnap.exists()) {
        setStats(statsSnap.data() as UserStats);
      } else {
        await setDoc(statsRef, defaultStats); // Initialize stats if not present
        setStats(defaultStats);
      }

      // Fetch deposit history
      const depositQuery = query(collection(db, `users/${uid}/depositHistory`), orderBy("date", "desc"));
      const depositSnapshot = await getDocs(depositQuery);
      setDepositHistory(depositSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DepositRecord)));

      // Fetch withdrawal history
      const withdrawalQuery = query(collection(db, `users/${uid}/withdrawalHistory`), orderBy("date", "desc"));
      const withdrawalSnapshot = await getDocs(withdrawalQuery);
      setWithdrawalHistory(withdrawalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRecord)));
      
      // Fetch referrals
      const referralsQuery = query(collection(db, `users/${uid}/referrals`), orderBy("earnings", "desc"));
      const referralsSnapshot = await getDocs(referralsQuery);
      setReferrals(referralsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Referral)));

    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, [uid, settingsLoading]);

  useEffect(() => {
    if (uid) {
      loadAllUserData();
    } else {
      // Clear stats if user logs out
      setStats(defaultStats);
      setDepositHistory([]);
      setWithdrawalHistory([]);
      setReferrals([]);
      setLoading(false);
    }
  }, [uid, loadAllUserData]);

  const addEarning = useCallback(async (amount: number) => {
    if (!user || !user.uid) return;

    const batch = writeBatch(db);
    const currentUserStatsRef = doc(db, "userStats", user.uid);

    try {
        const currentUserStatsSnap = await getDoc(currentUserStatsRef);
        const currentStats = currentUserStatsSnap.exists() ? currentUserStatsSnap.data() as UserStats : defaultStats;

        const newTotalEarnings = currentStats.totalEarnings + amount;
        const newAvailableBalance = currentStats.availableBalance + amount;

        batch.update(currentUserStatsRef, {
            totalEarnings: newTotalEarnings,
            availableBalance: newAvailableBalance,
        });
        setStats(prev => ({ ...prev, totalEarnings: newTotalEarnings, availableBalance: newAvailableBalance }));

        // Handle referral commission
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        const referrerId = userData?.referrerId;

        if (referrerId) {
            const commission = amount * (settings.referralCommissionRateL1 / 100);
            const referrerStatsRef = doc(db, "userStats", referrerId);
            const referrerReferralRef = doc(db, `users/${referrerId}/referrals`, user.uid);

            const referrerStatsSnap = await getDoc(referrerStatsRef);
            const referrerStats = referrerStatsSnap.exists() ? referrerStatsSnap.data() as UserStats : defaultStats;

            batch.update(referrerStatsRef, {
                totalEarnings: referrerStats.totalEarnings + commission,
                availableBalance: referrerStats.availableBalance + commission
            });
            
            const referrerReferralSnap = await getDoc(referrerReferralRef);
            if (referrerReferralSnap.exists()) {
                 const currentReferralEarnings = referrerReferralSnap.data().earnings || 0;
                 batch.update(referrerReferralRef, { earnings: currentReferralEarnings + commission });
            } else {
                 batch.set(referrerReferralRef, {
                    name: user.displayName || user.email || 'Anonymous',
                    earnings: commission
                 });
            }
        }
        
        await batch.commit();

    } catch (error) {
        console.error("Error adding earning:", error);
    }
  }, [user, settings.referralCommissionRateL1]);
  
  const addDeposit = useCallback(async (deposit: Omit<DepositRecord, 'date' | 'id'>) => {
    if (!uid) return;
    
    const batch = writeBatch(db);
    const statsRef = doc(db, "userStats", uid);
    const newDepositRef = doc(collection(db, `users/${uid}/depositHistory`));
    
    try {
        const statsSnap = await getDoc(statsRef);
        const currentStats = statsSnap.exists() ? statsSnap.data() as UserStats : defaultStats;

        const newTotalDeposit = currentStats.totalDeposit + deposit.amount;
        const newAvailableBalance = currentStats.availableBalance + deposit.amount;

        batch.update(statsRef, {
            totalDeposit: newTotalDeposit,
            availableBalance: newAvailableBalance,
        });

        const newRecord: DepositRecord = { ...deposit, date: serverTimestamp() };
        batch.set(newDepositRef, newRecord);

        await batch.commit();

        setStats(prev => ({...prev, totalDeposit: newTotalDeposit, availableBalance: newAvailableBalance}));
        setDepositHistory(prev => [{...newRecord, id: newDepositRef.id}, ...prev]);

    } catch (error) {
        console.error("Error adding deposit:", error);
    }
  }, [uid]);
  
  const addWithdrawal = useCallback(async (withdrawal: Omit<WithdrawalRecord, 'date' | 'id'>) => {
    if (!uid) return;

    const batch = writeBatch(db);
    const statsRef = doc(db, "userStats", uid);
    const newWithdrawalRef = doc(collection(db, `users/${uid}/withdrawalHistory`));

    try {
        const statsSnap = await getDoc(statsRef);
        const currentStats = statsSnap.exists() ? statsSnap.data() as UserStats : defaultStats;

        if (withdrawal.amount > currentStats.availableBalance) {
            console.error("Withdrawal amount exceeds available balance.");
            // Optionally throw an error to be caught by the UI
            throw new Error("Insufficient Balance");
        }

        const newTotalWithdraw = currentStats.totalWithdraw + withdrawal.amount;
        const newAvailableBalance = currentStats.availableBalance - withdrawal.amount;
        
        batch.update(statsRef, {
            totalWithdraw: newTotalWithdraw,
            availableBalance: newAvailableBalance,
        });

        const newRecord: WithdrawalRecord = { ...withdrawal, date: serverTimestamp() };
        batch.set(newWithdrawalRef, newRecord);
        
        await batch.commit();

        setStats(prev => ({...prev, totalWithdraw: newTotalWithdraw, availableBalance: newAvailableBalance}));
        setWithdrawalHistory(prev => [{...newRecord, id: newWithdrawalRef.id}, ...prev]);

    } catch (error) {
        console.error("Error adding withdrawal:", error);
        // Rethrow for UI handling
        throw error;
    }
  }, [uid]);

  return { stats, depositHistory, withdrawalHistory, referrals, loading, addEarning, addDeposit, addWithdrawal, refresh: loadAllUserData };
}
