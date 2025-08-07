
"use client"

import { useState, useEffect, useCallback } from 'react';
import { WithdrawalRecord, UserStats, defaultStats } from './use-user-stats';
import { useAdminStats, UserInfo } from './use-admin-stats';

export type WithdrawalRecordWithUser = WithdrawalRecord & { userName: string | null };

const ALL_WITHDRAWALS_STORAGE_KEY = 'allWithdrawals';

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

export function useWithdrawals() {
    const [withdrawals, setWithdrawals] = useState<WithdrawalRecordWithUser[]>([]);
    const { allUsersData } = useAdminStats();

    const loadWithdrawals = useCallback(() => {
        const allWithdrawals = getFromStorage<WithdrawalRecord[]>(ALL_WITHDRAWALS_STORAGE_KEY, []);
        if (allUsersData.length > 0) {
            const usersMap = new Map<string, UserInfo>(allUsersData.map(u => [u.uid, u]));
            
            const withdrawalsWithUsers = allWithdrawals.map(withdrawal => ({
                ...withdrawal,
                userName: usersMap.get(withdrawal.userId)?.displayName ?? 'Unknown User'
            }));

            setWithdrawals(withdrawalsWithUsers.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
    }, [allUsersData]);

    useEffect(() => {
        loadWithdrawals();
        window.addEventListener('storage', loadWithdrawals);
        return () => {
            window.removeEventListener('storage', loadWithdrawals);
        };
    }, [loadWithdrawals]);

    const updateWithdrawalStatus = useCallback((withdrawalId: string, userId: string, amount: number, status: 'completed' | 'failed') => {
        const allWithdrawals = getFromStorage<WithdrawalRecord[]>(ALL_WITHDRAWALS_STORAGE_KEY, []);
        const withdrawalIndex = allWithdrawals.findIndex(d => d.id === withdrawalId);

        if (withdrawalIndex === -1) {
            throw new Error("Withdrawal not found.");
        }
        
        const withdrawalToUpdate = allWithdrawals[withdrawalIndex];
        if (withdrawalToUpdate.status !== 'pending') {
            throw new Error("This withdrawal has already been processed.");
        }
        
        allWithdrawals[withdrawalIndex].status = status;
        
        const userStatsKey = `userStats-${userId}`;
        const currentStats = getFromStorage<UserStats>(userStatsKey, defaultStats);

        if (status === 'completed') {
            const newStats = {
                ...currentStats,
                totalWithdraw: (currentStats.totalWithdraw || 0) + amount,
                // Balance is already deducted on request, so no change here
            };
            setInStorage(userStatsKey, newStats);
        } else if (status === 'failed') {
            // If the withdrawal fails, add the amount back to the user's available balance.
             const newStats = {
                ...currentStats,
                availableBalance: (currentStats.availableBalance || 0) + amount,
            };
            setInStorage(userStatsKey, newStats);
        }

        setInStorage(ALL_WITHDRAWALS_STORAGE_KEY, allWithdrawals);
    }, []);

    return { withdrawals, updateWithdrawalStatus, refreshWithdrawals: loadWithdrawals };
}
