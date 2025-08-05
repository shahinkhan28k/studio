
"use client"

import { useState, useEffect, useCallback } from "react"

export interface BannerFormValues {
  src: string;
  alt: string;
  'data-ai-hint': string;
}

export type Banner = BannerFormValues & {
  id: string;
  createdAt: string;
};

const BANNERS_STORAGE_KEY = "banners"

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);

  const loadBanners = useCallback(() => {
    try {
      const storedBanners = localStorage.getItem(BANNERS_STORAGE_KEY);
      if (storedBanners) {
        setBanners(JSON.parse(storedBanners));
      }
    } catch (error) {
      console.error("Error fetching banners from localStorage: ", error);
    }
  }, []);

  useEffect(() => {
    loadBanners();
    // Listen for storage changes to sync across tabs
    window.addEventListener('storage', loadBanners);
    return () => {
      window.removeEventListener('storage', loadBanners);
    };
  }, [loadBanners]);
  
  const addBanner = useCallback((bannerData: BannerFormValues) => {
    try {
      const newBanner: Banner = {
        ...bannerData,
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      const updatedBanners = [...banners, newBanner];
      setBanners(updatedBanners);
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(updatedBanners));
      // Manually dispatch a storage event to notify other components/tabs
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error adding banner to localStorage: ", error);
    }
  }, [banners]);

  const deleteBanner = useCallback((bannerId: string) => {
    try {
      const updatedBanners = banners.filter(banner => banner.id !== bannerId);
      setBanners(updatedBanners);
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(updatedBanners));
      // Manually dispatch a storage event to notify other components/tabs
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error deleting banner from localStorage: ", error);
    }
  }, [banners]);
  
  return { banners, addBanner, deleteBanner, refreshBanners: loadBanners };
}
