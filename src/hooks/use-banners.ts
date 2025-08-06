
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

const initialBanners: Banner[] = [
    {
        id: "1",
        src: "https://i.postimg.cc/k4pC1TqG/Green-and-White-Modern-Digital-Marketing-Agency-Banner-1.png",
        alt: "Modern Digital Marketing Agency Banner",
        "data-ai-hint": "marketing agency",
        createdAt: "2024-01-01T12:00:00.000Z"
    },
    {
        id: "2",
        src: "https://i.postimg.cc/2yR9k4q9/Green-and-White-Modern-Digital-Marketing-Agency-Banner.png",
        alt: "Another Modern Digital Marketing Agency Banner",
        "data-ai-hint": "digital marketing",
        createdAt: "2024-01-02T12:00:00.000Z"
    }
];


export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);

  const loadBanners = useCallback(() => {
    try {
      const storedBanners = localStorage.getItem(BANNERS_STORAGE_KEY);
      if (storedBanners) {
        setBanners(JSON.parse(storedBanners));
      } else {
        setBanners(initialBanners);
        localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(initialBanners));
      }
    } catch (error) {
      console.error("Error fetching banners from localStorage: ", error);
      setBanners(initialBanners);
    }
  }, []);

  useEffect(() => {
    loadBanners();
    
    window.addEventListener('storage', loadBanners);
    return () => {
      window.removeEventListener('storage', loadBanners);
    };
  }, [loadBanners]);
  
  const addBanner = useCallback((bannerData: BannerFormValues) => {
    try {
      const storedBanners = localStorage.getItem(BANNERS_STORAGE_KEY);
      const currentBanners = storedBanners ? JSON.parse(storedBanners) : [];
      const newBanner: Banner = {
        ...bannerData,
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      const updatedBanners = [...currentBanners, newBanner];
      setBanners(updatedBanners);
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(updatedBanners));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error adding banner to localStorage: ", error);
    }
  }, []);

  const deleteBanner = useCallback((bannerId: string) => {
    try {
      const storedBanners = localStorage.getItem(BANNERS_STORAGE_KEY);
      const currentBanners = storedBanners ? JSON.parse(storedBanners) : [];
      const updatedBanners = currentBanners.filter(banner => banner.id !== bannerId);
      setBanners(updatedBanners);
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(updatedBanners));
      window.dispatchEvent(new Event('storage'));
    }
     catch (error)
     {
      console.error("Error deleting banner from localStorage: ", error);
    }
  }, []);
  
  return { banners, addBanner, deleteBanner, refreshBanners: loadBanners };
}
