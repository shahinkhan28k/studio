
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Currency } from "@/context/app-context";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: Currency = 'BDT') {
    let symbol: string;
    let locale: string;

    switch(currency) {
        case 'BDT':
            symbol = '৳';
            locale = 'bn-BD';
            break;
        case 'EUR':
            symbol = '€';
            locale = 'es-ES';
            break;
        case 'INR':
            symbol = '₹';
            locale = 'en-IN';
            break;
        case 'USD':
        default:
            symbol = '$';
            locale = 'en-US';
            break;
    }
    
    // In this version, amount is always BDT, so no conversion is needed.
    // The currency parameter is kept for i18n formatting but logic assumes BDT value.
    if (currency !== 'BDT') {
       console.warn("formatCurrency is called with a non-BDT currency, but the app is configured for BDT only.")
    }

    return new Intl.NumberFormat('bn-BD', {
        style: 'currency',
        currency: 'BDT',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount).replace('BDT', '৳').trim();
}
