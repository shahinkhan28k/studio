
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Currency } from "@/context/app-context";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CONVERSION_RATES = {
    USD: 1,
    BDT: 117.5, // 1 USD = 117.5 BDT
    EUR: 0.92, // 1 USD = 0.92 EUR
    INR: 83.4, // 1 USD = 83.4 INR
}


export function formatCurrency(amount: number, currency: Currency) {
    let convertedAmount = amount * (CONVERSION_RATES[currency] / CONVERSION_RATES['USD']);
    
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
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(convertedAmount).replace(currency, symbol).trim().replace('US$', '$');
}
