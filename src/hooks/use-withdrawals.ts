
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
        const usersMap = new Map<string, UserInfo>(allUsersData.map(u => [u.uid, u]));
        
        const withdrawalsWithUsers = allWithdrawals.map(withdrawal => ({
            ...withdrawal,
            userName: usersMap.get(withdrawal.userId)?.displayName ?? 'Unknown User'
        }));

        setWithdrawals(withdrawalsWithUsers.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
        setInStorage(ALL_WITHDRAWALS_STORAGE_KEY, allWithdrawals);

        const userStatsKey = `userStats-${userId}`;
        const currentStats = getFromStorage<UserStats>(userStatsKey, defaultStats);

        if (status === 'completed') {
            const newStats = {
                ...currentStats,
                totalWithdraw: currentStats.totalWithdraw + amount,
                availableBalance: currentStats.availableBalance - amount,
            };
            setInStorage(userStatsKey, newStats);
        } else if (status === 'failed') {
            // Balance is not deducted on request, so no need to refund.
            // If logic changes to deduct on request, we would add the amount back here.
        }
    }, []);

    return { withdrawals, updateWithdrawalStatus, refreshWithdrawals: loadWithdrawals };
}
