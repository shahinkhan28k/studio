
"use client"

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";

export type Settings = {
  referralCommissionRateL1: number;
  referralCommissionRateL2: number;
  referralCommissionRateL3: number;
  withdrawalRequirement: number;
  minimumWithdrawalAmount: number;
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
  minimumWithdrawalAmount: 10,
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

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettingsState] = useState<Settings>(defaultSettings);

    const loadSettings = useCallback(() => {
        try {
            const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (storedSettings) {
                setSettingsState({ ...defaultSettings, ...JSON.parse(storedSettings) });
            } else {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
            }
        } catch (error) {
            console.error("Error loading settings from localStorage: ", error);
            setSettingsState(defaultSettings);
        }
    }, []);

    useEffect(() => {
        loadSettings();
        window.addEventListener('storage', loadSettings);
        return () => {
            window.removeEventListener('storage', loadSettings);
        };
    }, [loadSettings]);

    const setSettings = useCallback((newSettings: Settings) => {
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
            setSettingsState(newSettings);
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Error saving settings to localStorage: ", error);
        }
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
