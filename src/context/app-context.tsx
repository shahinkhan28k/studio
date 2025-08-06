
"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
      // We force a router refresh to re-render server components with the new locale if needed,
      // and ensure all client components re-render with the new context value.
      window.location.reload();
    }
  }, [router]);
  
  const handleSetCurrency = useCallback((newCurrency: Currency) => {
    // This function is now a no-op as currency is fixed to BDT.
    // Kept for type consistency if needed elsewhere.
    setCurrency('BDT');
  }, []);

  const value = useMemo(() => ({
    language: { ...translations[locale], locale },
    setLanguage: handleSetLanguage,
    currency,
    setCurrency: handleSetCurrency,
  }), [locale, handleSetLanguage, currency, handleSetCurrency]);

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
