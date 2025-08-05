
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface NoticeFormValues {
  title: string;
  description: string;
}

export type Notice = NoticeFormValues & {
  id: string;
  createdAt: any;
};

const NOTICES_COLLECTION = "notices"

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotices = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, NOTICES_COLLECTION), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const noticesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notice));
      setNotices(noticesData);
    } catch (error) {
      console.error("Error fetching notices: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);
  
  const addNotice = useCallback(async (noticeData: NoticeFormValues) => {
    try {
      await addDoc(collection(db, NOTICES_COLLECTION), {
        ...noticeData,
        createdAt: serverTimestamp()
      });
      await loadNotices();
    } catch (error) {
      console.error("Error adding notice: ", error);
    }
  }, [loadNotices]);

  const updateNotice = useCallback(async (noticeId: string, noticeData: NoticeFormValues) => {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await updateDoc(noticeRef, noticeData);
      await loadNotices();
    } catch (error) {
      console.error("Error updating notice: ", error);
    }
  }, [loadNotices]);

  const deleteNotice = useCallback(async (noticeId: string) => {
    try {
      await deleteDoc(doc(db, NOTICES_COLLECTION, noticeId));
      setNotices(prevNotices => prevNotices.filter(notice => notice.id !== noticeId));
    } catch (error) {
      console.error("Error deleting notice: ", error);
    }
  }, []);
  
  const getNoticeById = useCallback(async (noticeId: string): Promise<Notice | undefined> => {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      const docSnap = await getDoc(noticeRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Notice;
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching notice by ID: ", error);
      return undefined;
    }
  }, []);

  return { notices, loading, addNotice, updateNotice, deleteNotice, getNoticeById, refreshNotices: loadNotices };
}
