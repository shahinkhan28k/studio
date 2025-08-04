
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Currency } from "@/context/app-context";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BDT_CONVERSION_RATE = 117.5; // 1 USD = 117.5 BDT

export function formatCurrency(amount: number, currency: Currency) {
    let convertedAmount = amount;
    let symbol = '$';
    let locale = 'en-US';

    if (currency === 'BDT') {
        convertedAmount = amount * BDT_CONVERSION_RATE;
        symbol = '৳';
        locale = 'bn-BD';
    }
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(convertedAmount).replace(currency, symbol).trim();
}
