
"use client"

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";

export type Settings = {
  referralCommissionRateL1: number;
  referralCommissionRateL2: number;
  referralCommissionRateL3: number;
  withdrawalRequirement: number;
  agentNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  usdtAddress: string;
};

const SETTINGS_STORAGE_KEY = "platformSettings";

const defaultSettings: Settings = {
  referralCommissionRateL1: 5,
  referralCommissionRateL2: 2,
  referralCommissionRateL3: 1,
  withdrawalRequirement: 20,
  agentNumber: "01234567890",
  bankName: "Example Bank Ltd.",
  bankAccountName: "Onearn Platform",
  bankAccountNumber: "1234567890123",
  bankBranch: "Dhaka",
  usdtAddress: "TX1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r",
};

interface SettingsContextType {
    settings: Settings;
    setSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);


const getStoredData = <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") {
        return defaultValue;
    }
    try {
        const stored = window.localStorage.getItem(key);
        if (stored) {
            return { ...defaultValue, ...JSON.parse(stored) };
        } else {
             window.localStorage.setItem(key, JSON.stringify(defaultValue));
        }
    } catch (error) {
        console.error(`Failed to parse ${key} from localStorage`, error);
    }
    return defaultValue;
}

const setStoredData = <T>(key: string, data: T) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
        window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: JSON.stringify(data),
        }));
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage`, error);
    }
}

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettingsState] = useState<Settings>(() => 
        getStoredData(SETTINGS_STORAGE_KEY, defaultSettings)
    );

    const loadSettings = useCallback(() => {
        const storedSettings = getStoredData(SETTINGS_STORAGE_KEY, defaultSettings);
        setSettingsState(storedSettings);
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
        if (event.key === SETTINGS_STORAGE_KEY) {
            loadSettings();
        }
        }
        window.addEventListener("storage", handleStorageChange);
        return () => {
        window.removeEventListener("storage", handleStorageChange);
        }
    }, [loadSettings]);

    const setSettings = useCallback((newSettings: Settings) => {
        setStoredData(SETTINGS_STORAGE_KEY, newSettings);
        setSettingsState(newSettings);
    }, []);

    const value = { settings, setSettings };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};


export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
