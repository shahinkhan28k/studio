
"use client"

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";

export type ReferralLevel = {
  level: number;
  requiredReferrals: number;
  commissionRate: number;
};

export type Settings = {
  referralLevels: ReferralLevel[];
  investmentReferralCommissionRate: number;
  withdrawalRequirement: number;
  minimumWithdrawalAmount: number;
  depositSessionDuration: number; // in minutes
  agentNumbers: {
    [key: string]: string[];
    bkash: string[];
    nagad: string[];
    rocket: string[];
  };
  supportEmail: string;
  supportPhoneNumber: string;
  supportWhatsApp: string;
};

const SETTINGS_STORAGE_KEY = "platformSettings";

const defaultSettings: Settings = {
  referralLevels: [
    { level: 1, requiredReferrals: 3, commissionRate: 5 },
    { level: 2, requiredReferrals: 10, commissionRate: 7 },
    { level: 3, requiredReferrals: 20, commissionRate: 10 },
    { level: 4, requiredReferrals: 30, commissionRate: 11 },
    { level: 5, requiredReferrals: 40, commissionRate: 12 },
    { level: 6, requiredReferrals: 50, commissionRate: 13 },
    { level: 7, requiredReferrals: 60, commissionRate: 14 },
    { level: 8, requiredReferrals: 70, commissionRate: 15 },
    { level: 9, requiredReferrals: 80, commissionRate: 16 },
    { level: 10, requiredReferrals: 90, commissionRate: 17 },
  ],
  investmentReferralCommissionRate: 5,
  withdrawalRequirement: 20,
  minimumWithdrawalAmount: 10,
  depositSessionDuration: 5,
  agentNumbers: {
    bkash: ["01234567890"],
    nagad: ["01234567891"],
    rocket: ["01234567892"],
  },
  supportEmail: "support@example.com",
  supportPhoneNumber: "+1234567890",
  supportWhatsApp: "1234567890",
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
                const parsed = JSON.parse(storedSettings);
                // Ensure referralLevels is always an array
                if (!Array.isArray(parsed.referralLevels)) {
                    parsed.referralLevels = defaultSettings.referralLevels;
                }
                setSettingsState({ ...defaultSettings, ...parsed });
            } else {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
                setSettingsState(defaultSettings);
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
            const settingsToSave = {
                ...newSettings,
                // Ensure agentNumbers are arrays, even if empty from the form
                agentNumbers: {
                    bkash: Array.isArray(newSettings.agentNumbers.bkash) ? newSettings.agentNumbers.bkash : [],
                    nagad: Array.isArray(newSettings.agentNumbers.nagad) ? newSettings.agentNumbers.nagad : [],
                    rocket: Array.isArray(newSettings.agentNumbers.rocket) ? newSettings.agentNumbers.rocket : [],
                }
            };
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
            setSettingsState(settingsToSave);
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
