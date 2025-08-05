
"use client"

import { useState, useEffect, useCallback } from "react"

export interface NoticeFormValues {
  title: string;
  description: string;
}

export type Notice = NoticeFormValues & {
  id: string;
  createdAt: string;
};

const NOTICES_STORAGE_KEY = "notices"

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);

  const loadNotices = useCallback(() => {
    try {
      const storedNotices = localStorage.getItem(NOTICES_STORAGE_KEY);
      if (storedNotices) {
        setNotices(JSON.parse(storedNotices).sort((a: Notice, b: Notice) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error("Error fetching notices from localStorage: ", error);
    }
  }, []);

  useEffect(() => {
    loadNotices();
    const handleStorageChange = () => {
        loadNotices();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadNotices]);
  
  const addNotice = useCallback((noticeData: NoticeFormValues) => {
    try {
      const storedNotices = localStorage.getItem(NOTICES_STORAGE_KEY);
      const currentNotices = storedNotices ? JSON.parse(storedNotices) : [];
      const newNotice: Notice = {
        ...noticeData,
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      const updatedNotices = [...currentNotices, newNotice];
      localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(updatedNotices));
      setNotices(updatedNotices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error adding notice to localStorage: ", error);
    }
  }, []);

  const updateNotice = useCallback((noticeId: string, noticeData: NoticeFormValues) => {
    try {
        const storedNotices = localStorage.getItem(NOTICES_STORAGE_KEY);
        const currentNotices = storedNotices ? JSON.parse(storedNotices) : [];
        const updatedNotices = currentNotices.map(n => n.id === noticeId ? { ...n, ...noticeData } : n);
        localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(updatedNotices));
        setNotices(updatedNotices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error updating notice in localStorage: ", error);
    }
  }, []);

  const deleteNotice = useCallback((noticeId: string) => {
    try {
        const storedNotices = localStorage.getItem(NOTICES_STORAGE_KEY);
        const currentNotices = storedNotices ? JSON.parse(storedNotices) : [];
        const updatedNotices = currentNotices.filter(notice => notice.id !== noticeId);
        localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(updatedNotices));
        setNotices(updatedNotices);
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error deleting notice from localStorage: ", error);
    }
  }, []);
  
  const getNoticeById = useCallback((noticeId: string): Notice | undefined => {
    const allNotices = JSON.parse(localStorage.getItem(NOTICES_STORAGE_KEY) || '[]') as Notice[];
    return allNotices.find(n => n.id === noticeId);
  }, []);

  return { notices, addNotice, updateNotice, deleteNotice, getNoticeById, refreshNotices: loadNotices };
}
