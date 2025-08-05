
"use client"

import { useState, useEffect, useCallback } from "react"

// This type was previously imported from a now-deleted file.
// We define it here to keep the hook self-contained.
export interface BannerFormValues {
  src: string;
  alt: string;
  'data-ai-hint': string;
}


export type Banner = BannerFormValues & {
  id: number;
};

const BANNERS_STORAGE_KEY = "banners"

const defaultBanners: Banner[] = [
    {
        id: 1,
        src: "https://placehold.co/1200x500.png",
        alt: "Promotional Banner 1",
        "data-ai-hint": "digital marketing"
    },
    {
        id: 2,
        src: "https://placehold.co/1200x500.png",
        alt: "Promotional Banner 2",
        "data-ai-hint": "online earnings"
    },
    {
        id: 3,
        src: "https://placehold.co/1200x500.png",
        alt: "Promotional Banner 3",
        "data-ai-hint": "successful teamwork"
    }
]

const getStoredData = <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") {
        return defaultValue;
    }
    try {
        const stored = window.localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored) as T;
        } else {
             window.localStorage.setItem(key, JSON.stringify(defaultValue));
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

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);

  const loadBanners = useCallback(() => {
    const storedBanners = getStoredData(BANNERS_STORAGE_KEY, defaultBanners);
    setBanners(storedBanners);
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === BANNERS_STORAGE_KEY) {
         loadBanners();
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [loadBanners])
  
  const addBanner = useCallback((bannerData: BannerFormValues) => {
    const currentBanners = getStoredData<Banner[]>(BANNERS_STORAGE_KEY, defaultBanners);
    const newId = currentBanners.length > 0 ? Math.max(...currentBanners.map(b => b.id)) + 1 : 1;
    const newBanner: Banner = {
      ...bannerData,
      id: newId,
    };
    const updatedBanners = [...currentBanners, newBanner];
    setStoredData(BANNERS_STORAGE_KEY, updatedBanners);
  }, []);

  const deleteBanner = useCallback((bannerId: number) => {
    const currentBanners = getStoredData<Banner[]>(BANNERS_STORAGE_KEY, defaultBanners);
    const updatedBanners = currentBanners.filter(banner => banner.id !== bannerId);
    setStoredData(BANNERS_STORAGE_KEY, updatedBanners);
    setBanners(updatedBanners); // Update the state after deleting
  }, []);
  
  return { banners, addBanner, deleteBanner };
}
