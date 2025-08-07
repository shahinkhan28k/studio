
"use client"

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";

const LUCKY_DRAW_SPINS_KEY_PREFIX = "luckyDrawSpins-";

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

export function useLuckyDraw() {
    const { user } = useAuth();
    const [spins, setSpins] = useState<number>(0);
    const storageKey = user ? `${LUCKY_DRAW_SPINS_KEY_PREFIX}${user.uid}` : '';

    const loadSpins = useCallback(() => {
        if (storageKey) {
            const storedSpins = getFromStorage<number>(storageKey, 0);
            setSpins(storedSpins);
        }
    }, [storageKey]);

    useEffect(() => {
        loadSpins();
        window.addEventListener('storage', loadSpins);
        return () => {
            window.removeEventListener('storage', loadSpins);
        };
    }, [loadSpins]);
    
    const addSpins = useCallback((count: number) => {
        if (!storageKey) return;
        const currentSpins = getFromStorage<number>(storageKey, 0);
        const newSpins = currentSpins + count;
        setInStorage(storageKey, newSpins);
        setSpins(newSpins);
    }, [storageKey]);

    const useSpin = useCallback(() => {
        if (!storageKey) return;
        const currentSpins = getFromStorage<number>(storageKey, 0);
        if (currentSpins > 0) {
            const newSpins = currentSpins - 1;
            setInStorage(storageKey, newSpins);
            setSpins(newSpins);
        }
    }, [storageKey]);

    return { spins, addSpins, useSpin };
}
