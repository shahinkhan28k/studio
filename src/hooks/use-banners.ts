
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface BannerFormValues {
  src: string;
  alt: string;
  'data-ai-hint': string;
}

export type Banner = BannerFormValues & {
  id: string;
  createdAt: any;
};

const BANNERS_COLLECTION = "banners"

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, BANNERS_COLLECTION), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const bannersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Banner));
      setBanners(bannersData);
    } catch (error) {
      console.error("Error fetching banners: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);
  
  const addBanner = useCallback(async (bannerData: BannerFormValues) => {
    try {
      await addDoc(collection(db, BANNERS_COLLECTION), {
        ...bannerData,
        createdAt: serverTimestamp()
      });
      await loadBanners(); // Reload banners after adding
    } catch (error) {
      console.error("Error adding banner: ", error);
    }
  }, [loadBanners]);

  const deleteBanner = useCallback(async (bannerId: string) => {
    try {
      await deleteDoc(doc(db, BANNERS_COLLECTION, bannerId));
      setBanners(prevBanners => prevBanners.filter(banner => banner.id !== bannerId));
    } catch (error) {
      console.error("Error deleting banner: ", error);
    }
  }, []);
  
  return { banners, loading, addBanner, deleteBanner, refreshBanners: loadBanners };
}
