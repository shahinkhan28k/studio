
"use client"

import { useState, useEffect } from "react"
import { UserStats } from "./use-user-stats"

type AdminStats = {
    totalUsers: number;
    totalEarnings: number;
    totalDeposits: number;
    totalWithdrawals: number;
    tasksCompleted: number;
}

type UserInfo = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

type AllUsersData = UserInfo & {
    stats: UserStats;
}

const defaultAdminStats: AdminStats = {
    totalUsers: 0,
    totalEarnings: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    tasksCompleted: 0
}

const getAllLocalStorageItems = (): Record<string, string> => {
    if (typeof window === "undefined") {
        return {};
    }
    return { ...localStorage };
}


export function useAdminStats() {
    const [stats, setStats] = useState<AdminStats>(defaultAdminStats)
    const [recentSignups, setRecentSignups] = useState<UserInfo[]>([])
    const [allUsersData, setAllUsersData] = useState<AllUsersData[]>([])

    useEffect(() => {
        const calculateStats = () => {
            const allItems = getAllLocalStorageItems()
            const userStatKeys = Object.keys(allItems).filter(k => k.startsWith('userStats_'))
            const allSignups = Object.keys(allItems).filter(k => k.startsWith('signup_'))

            let totalEarnings = 0;
            let totalDeposits = 0;
            let totalWithdrawals = 0;
            let tasksCompleted = 0; // This is a simplification, will need better tracking for real accuracy

            const usersData: AllUsersData[] = [];

            userStatKeys.forEach(key => {
                try {
                    const userStats: UserStats = JSON.parse(allItems[key]);
                    totalEarnings += userStats.totalEarnings;
                    totalDeposits += userStats.totalDeposit;
                    totalWithdrawals += userStats.totalWithdraw;

                    const uid = key.replace('userStats_', '');
                    const signupKey = `signup_${uid}`;
                    let userInfo: UserInfo = { uid, email: null, displayName: null, photoURL: null };
                    if(allItems[signupKey]){
                       const signupData = JSON.parse(allItems[signupKey])
                       userInfo = { ...userInfo, ...signupData.user }
                    }

                    usersData.push({
                        ...userInfo,
                        stats: userStats
                    });

                } catch (e) {
                    console.error(`Could not parse user stats for key ${key}`, e)
                }
            })
            
             // A simple heuristic for tasks completed based on earnings.
             // Assumes an average reward of $5 per task. This should be improved.
            tasksCompleted = Math.floor(totalEarnings / 5);


            const signups: UserInfo[] = allSignups.map(key => {
                try {
                    return JSON.parse(allItems[key]).user as UserInfo;
                } catch(e) {
                    return null;
                }
            }).filter((u): u is UserInfo => u !== null);


            setStats({
                totalUsers: userStatKeys.length,
                totalEarnings,
                totalDeposits,
                totalWithdrawals,
                tasksCompleted
            })
            
            setRecentSignups(signups);
            setAllUsersData(usersData);
        }

        calculateStats()

        const handleStorageChange = (event: StorageEvent) => {
           calculateStats();
        }

        window.addEventListener("storage", handleStorageChange)
        return () => {
            window.removeEventListener("storage", handleStorageChange)
        }
    }, [])

    return { stats, recentSignups, allUsersData }
}
