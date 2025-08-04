
"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, Language, Locale } from '@/lib/i18n';

export type Currency = 'USD' | 'BDT' | 'EUR' | 'INR';

interface AppContextType {
  language: Language;
  setLanguage: (locale: Locale) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('bn');
  const [currency, setCurrency] = useState<Currency>('BDT');

  useEffect(() => {
    const savedLocale = localStorage.getItem('app-locale') as Locale | null;
    const savedCurrency = localStorage.getItem('app-currency') as Currency | null;
    if (savedLocale) {
      setLocale(savedLocale);
    }
     if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleSetLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('app-locale', newLocale);
  };
  
  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('app-currency', newCurrency);
  }

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
