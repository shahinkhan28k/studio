
"use client"

import { useState, useEffect, useCallback } from "react"
import type { NoticeFormValues } from "@/app/admin/notices/new/page"

export type Notice = NoticeFormValues & {
  id: number;
  createdAt: string;
};

const NOTICES_STORAGE_KEY = "notices"

const defaultNotices: Notice[] = [
  { id: 1, title: "New high-value tasks available!", description: "Check the tasks section for more earning opportunities. Limited slots available!", createdAt: "2024-07-28T10:00:00Z" },
  { id: 2, title: "Referral Program Boost", description: "For a limited time, get a 10% bonus on your first-level referral commissions.", createdAt: "2024-07-27T10:00:00Z" },
  { id: 3, title: "Scheduled Maintenance", description: "The platform will be down for scheduled maintenance on Sunday at 2 PM UTC.", createdAt: "2024-07-26T10:00:00Z" },
]

const getStoredData = <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") {
        return defaultValue;
    }
    try {
        const stored = window.localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored) as T;
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

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const storedNotices = getStoredData(NOTICES_STORAGE_KEY, defaultNotices);
    // Sort notices by creation date, newest first
    const sortedNotices = storedNotices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotices(sortedNotices);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === NOTICES_STORAGE_KEY && event.newValue) {
         const newNotices = JSON.parse(event.newValue) as Notice[];
         const sortedNotices = newNotices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
         setNotices(sortedNotices);
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])
  
  const addNotice = useCallback((noticeData: NoticeFormValues) => {
    const currentNotices = getStoredData<Notice[]>(NOTICES_STORAGE_KEY, defaultNotices);
    const newId = currentNotices.length > 0 ? Math.max(...currentNotices.map(t => t.id)) + 1 : 1;
    const newNotice: Notice = {
      ...noticeData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    const updatedNotices = [...currentNotices, newNotice];
    setStoredData(NOTICES_STORAGE_KEY, updatedNotices);
  }, []);


  const deleteNotice = useCallback((noticeId: number) => {
    const currentNotices = getStoredData<Notice[]>(NOTICES_STORAGE_KEY, defaultNotices);
    const updatedNotices = currentNotices.filter(notice => notice.id !== noticeId);
    setStoredData(NOTICES_STORAGE_KEY, updatedNotices);
  }, []);

  return { notices, addNotice, deleteNotice };
}
