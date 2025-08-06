
"use client"

import { useState, useEffect, useCallback } from "react"

export interface InvestmentPlanFormValues {
  title: string
  subtitle: string
  badge: string
  imageUrl: string
  durationValue: number
  durationUnit: 'Days' | 'Months' | 'Years'
  minInvestment: number
  profitRate: number
  progress: number
  riskLevel: "Low" | "Medium" | "High"
  tag: string
  maxInvestors: number;
  totalInvestors: number;
}

export type InvestmentPlan = InvestmentPlanFormValues & {
  id: string
  createdAt: string
};

const INVESTMENT_PLANS_STORAGE_KEY = "investmentPlans"

// Helper to interact with localStorage
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


export function useInvestments() {
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);

  const loadInvestmentPlans = useCallback(() => {
    const storedPlans = getFromStorage<InvestmentPlan[]>(INVESTMENT_PLANS_STORAGE_KEY, []);
    setInvestmentPlans(storedPlans.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  useEffect(() => {
    loadInvestmentPlans();
    window.addEventListener('storage', loadInvestmentPlans);
    return () => {
      window.removeEventListener('storage', loadInvestmentPlans);
    };
  }, [loadInvestmentPlans]);
  
  const addInvestmentPlan = useCallback((planData: InvestmentPlanFormValues) => {
      const currentPlans = getFromStorage<InvestmentPlan[]>(INVESTMENT_PLANS_STORAGE_KEY, []);
      const newPlan: InvestmentPlan = {
        ...planData,
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      const updatedPlans = [...currentPlans, newPlan];
      setInStorage(INVESTMENT_PLANS_STORAGE_KEY, updatedPlans);
  }, []);

  const updateInvestmentPlan = useCallback((planId: string, updatedData: Partial<InvestmentPlanFormValues>) => {
      const currentPlans = getFromStorage<InvestmentPlan[]>(INVESTMENT_PLANS_STORAGE_KEY, []);
      const updatedPlans = currentPlans.map(p => p.id === planId ? {...p, ...updatedData} : p);
      setInStorage(INVESTMENT_PLANS_STORAGE_KEY, updatedPlans);
  }, []);

  const deleteInvestmentPlan = useCallback((planId: string) => {
      const currentPlans = getFromStorage<InvestmentPlan[]>(INVESTMENT_PLANS_STORAGE_KEY, []);
      const updatedPlans = currentPlans.filter(plan => plan.id !== planId);
      setInStorage(INVESTMENT_PLANS_STORAGE_KEY, updatedPlans);
  }, []);
  
  const getInvestmentPlanById = useCallback((planId: string): InvestmentPlan | undefined => {
    const allPlans = getFromStorage<InvestmentPlan[]>(INVESTMENT_PLANS_STORAGE_KEY, []);
    return allPlans.find(p => p.id === planId);
  }, []);

  return { investmentPlans, addInvestmentPlan, updateInvestmentPlan, deleteInvestmentPlan, getInvestmentPlanById };
}
