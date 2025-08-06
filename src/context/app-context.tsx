
"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { translations, Language, Locale } from '@/lib/i18n';

export type Currency = 'BDT'; // Only BDT is supported now

interface AppContextType {
  language: Language;
  setLanguage: (locale: Locale) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void; // Kept for type consistency, but won't be used to change.
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('bn');
  const [currency, setCurrency] = useState<Currency>('BDT');

  useEffect(() => {
    const savedLocale = localStorage.getItem('app-locale') as Locale | null;
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const handleSetLanguage = useCallback((newLocale: Locale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('app-locale', newLocale);
    }
  }, []);
  
  const handleSetCurrency = useCallback((newCurrency: Currency) => {
    // This function is now a no-op as currency is fixed to BDT.
    // Kept for type consistency if needed elsewhere.
    setCurrency('BDT');
  }, []);

  const value = {
    language: { ...translations[locale], locale },
    setLanguage: handleSetLanguage,
    currency,
    setCurrency: handleSetCurrency,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
