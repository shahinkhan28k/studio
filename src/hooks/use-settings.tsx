
"use client"

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

const SETTINGS_DOC_ID = "platformSettings";
const SETTINGS_COLLECTION = "configuration";

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
    setSettings: (settings: Settings) => Promise<void>;
    loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettingsState] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const loadSettings = useCallback(async () => {
        setLoading(true);
        try {
            const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists()) {
                setSettingsState({ ...defaultSettings, ...docSnap.data() } as Settings);
            } else {
                // If settings don't exist, create them with default values
                await setDoc(settingsRef, defaultSettings);
                setSettingsState(defaultSettings);
            }
        } catch (error) {
            console.error("Error loading settings from Firestore: ", error);
            setSettingsState(defaultSettings);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const setSettings = useCallback(async (newSettings: Settings) => {
        try {
            const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
            await setDoc(settingsRef, newSettings);
            setSettingsState(newSettings);
        } catch (error) {
            console.error("Error saving settings to Firestore: ", error);
        }
    }, []);

    const value = { settings, setSettings, loading };

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
