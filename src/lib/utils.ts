
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

export function convertToUSD(amount: number, fromCurrency: Currency): number {
    if (fromCurrency === 'USD') return amount;
    const rate = CONVERSION_RATES[fromCurrency];
    return amount / rate;
}

export function convertFromUSD(amount: number, toCurrency: Currency): number {
    if (toCurrency === 'USD') return amount;
    const rate = CONVERSION_RATES[toCurrency];
    return amount * rate;
}


export function formatCurrency(amount: number, currency: Currency) {
    // The internal amount is always in USD. We convert it to the target currency for display.
    const convertedAmount = convertFromUSD(amount, currency);
    
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
