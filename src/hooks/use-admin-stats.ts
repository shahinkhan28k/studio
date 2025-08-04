
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

export type AllUsersData = UserInfo & {
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
            
            const allSignupsData = Object.keys(allItems)
                .filter(k => k.startsWith('signup_'))
                .map(key => {
                    try {
                        const data = JSON.parse(allItems[key]);
                        return data.user as UserInfo;
                    } catch (e) {
                        return null;
                    }
                })
                .filter((u): u is UserInfo => u !== null);

            let totalEarnings = 0;
            let totalDeposits = 0;
            let totalWithdrawals = 0;
            let tasksCompleted = 0;

            const usersData: AllUsersData[] = [];
            const processedUids = new Set<string>();

            // Process users who have stats
            userStatKeys.forEach(key => {
                try {
                    const userStats: UserStats = JSON.parse(allItems[key]);
                    totalEarnings += userStats.totalEarnings;
                    totalDeposits += userStats.totalDeposit;
                    totalWithdrawals += userStats.totalWithdraw;

                    const uid = key.replace('userStats_', '');
                    processedUids.add(uid);

                    const signupInfo = allSignupsData.find(u => u.uid === uid) || { uid, email: null, displayName: null, photoURL: null };

                    usersData.push({
                        ...signupInfo,
                        stats: userStats
                    });

                } catch (e) {
                    console.error(`Could not parse user stats for key ${key}`, e)
                }
            })
            
            // Add users who have signed up but have no stats yet
            allSignupsData.forEach(signup => {
                if (!processedUids.has(signup.uid)) {
                    usersData.push({
                        ...signup,
                        stats: defaultStats
                    })
                }
            });


            tasksCompleted = Math.floor(totalEarnings / 5);


            const signups: UserInfo[] = allSignupsData.sort((a,b) => {
                 const aData = JSON.parse(allItems[`signup_${a.uid}`]);
                 const bData = JSON.parse(allItems[`signup_${b.uid}`]);
                 return new Date(bData.timestamp).getTime() - new Date(aData.timestamp).getTime();
            });


            setStats({
                totalUsers: usersData.length,
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
