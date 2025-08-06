
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { useUserStats } from "./use-user-stats"
import { useSettings } from "./use-settings"
import type { UserInfo } from "./use-admin-stats"

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
  isFeatured: boolean;
  purchaseLimit: number;
}

export type InvestmentPlan = InvestmentPlanFormValues & {
  id: string
  createdAt: string
};

export type UserInvestment = {
    planId: string;
    userId: string;
    investmentDate: string;
    endDate: string;
    dailyIncome: number;
    initialInvestment: number;
    isActive: boolean;
}

const INVESTMENT_PLANS_STORAGE_KEY = "investmentPlans"
const USER_INVESTMENTS_STORAGE_KEY = "userInvestments"

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
  const { user } = useAuth();
  const { stats, updateStats, addEarning } = useUserStats();
  const { settings } = useSettings();
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);

  const loadInvestmentPlans = useCallback(() => {
    const storedPlans = getFromStorage<InvestmentPlan[]>(INVESTMENT_PLANS_STORAGE_KEY, []);
    setInvestmentPlans(storedPlans.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    if(user){
        const allUserInvestments = getFromStorage<UserInvestment[]>(USER_INVESTMENTS_STORAGE_KEY, []);
        setUserInvestments(allUserInvestments.filter(inv => inv.userId === user.uid));
    }
  }, [user]);

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

  const investInPlan = useCallback((plan: InvestmentPlan) => {
    if(!user) throw new Error("আপনাকে অবশ্যই লগইন করতে হবে।");

    if (stats.availableBalance < plan.minInvestment) {
      throw new Error("আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।");
    }
    
    const allUserInvestments = getFromStorage<UserInvestment[]>(USER_INVESTMENTS_STORAGE_KEY, []);
    const userPurchasesOfThisPlan = allUserInvestments.filter(inv => inv.userId === user.uid && inv.planId === plan.id);
    
    if (plan.purchaseLimit > 0 && userPurchasesOfThisPlan.length >= plan.purchaseLimit) {
        throw new Error(`আপনি এই প্ল্যানটি সর্বোচ্চ ${plan.purchaseLimit} বার কিনতে পারবেন।`);
    }


    const totalReturn = plan.minInvestment + (plan.minInvestment * (plan.profitRate / 100));
    const getDurationInDays = (value: number, unit: "Days" | "Months" | "Years") => {
        switch (unit) {
            case 'Days': return value;
            case 'Months': return value * 30;
            case 'Years': return value * 365;
            default: return value;
        }
    }
    const durationInDays = getDurationInDays(plan.durationValue, plan.durationUnit);
    const dailyIncome = durationInDays > 0 ? totalReturn / durationInDays : 0;
    
    const investmentDate = new Date();
    const endDate = new Date(investmentDate);
    endDate.setDate(endDate.getDate() + durationInDays);

    const newInvestment: UserInvestment = {
        planId: plan.id,
        userId: user.uid,
        investmentDate: investmentDate.toISOString(),
        endDate: endDate.toISOString(),
        dailyIncome: dailyIncome,
        initialInvestment: plan.minInvestment,
        isActive: true,
    }
    
    // Update user stats
    const newBalance = stats.availableBalance - plan.minInvestment;
    const newTotalInvestment = stats.totalInvestment + plan.minInvestment;
    updateStats(user.uid, { availableBalance: newBalance, totalInvestment: newTotalInvestment });
    
    // Handle investment referral commission
    const allUsers: UserInfo[] = getFromStorage('allUsersData', []);
    const currentUserInfo = allUsers.find(u => u.uid === user.uid);
    if(currentUserInfo?.referrerId) {
        const commissionAmount = plan.minInvestment * (settings.investmentReferralCommissionRate / 100);
        if(commissionAmount > 0) {
            addEarning(commissionAmount, currentUserInfo.referrerId);
        }
    }


    // Update total investors for the plan
    const updatedPlanData = { totalInvestors: plan.totalInvestors + 1 };
    updateInvestmentPlan(plan.id, updatedPlanData);
    
    // Save new investment
    setInStorage(USER_INVESTMENTS_STORAGE_KEY, [...allUserInvestments, newInvestment]);
    
  }, [user, stats, updateStats, updateInvestmentPlan, settings.investmentReferralCommissionRate, addEarning]);

  return { investmentPlans, addInvestmentPlan, updateInvestmentPlan, deleteInvestmentPlan, getInvestmentPlanById, investInPlan, userInvestments };
}
