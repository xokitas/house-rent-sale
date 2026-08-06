'use client';

import { useState, useEffect } from 'react';

export type CurrencyType = 'USD' | 'CUP' | 'EUR';

// Tasas de cambio fijas provisionales como fuente de verdad
export const EXCHANGE_RATES = {
  USD: 1,      // Base de conversión
  CUP: 320,    // 1 USD = 320 CUP
  EUR: 0.92,   // 1 USD = 0.92 EUR
};

export interface ConversionResult {
  amount: number;
  currency: CurrencyType;
  formatted: string;
}

/**
 * Servicio centralizado para la conversión de monedas.
 * Devuelve el importe convertido y formateado para mostrar en el frontend.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: CurrencyType
): ConversionResult {
  // Aseguramos que la moneda de origen sea válida, si no usamos USD como fallback
  const from = (fromCurrency && fromCurrency.toUpperCase() in EXCHANGE_RATES)
    ? (fromCurrency.toUpperCase() as CurrencyType)
    : 'USD';

  const to = toCurrency;

  // Convertimos primero el importe a USD (la base)
  const rateFrom = EXCHANGE_RATES[from];
  const amountInUSD = amount / rateFrom;

  // De USD convertimos a la moneda destino
  const rateTo = EXCHANGE_RATES[to];
  const finalAmount = amountInUSD * rateTo;

  // Formateamos el importe de forma amigable
  let formatted = '';
  if (to === 'USD') {
    formatted = `$${Math.round(finalAmount).toLocaleString('en-US')} USD`;
  } else if (to === 'EUR') {
    formatted = `€${Math.round(finalAmount).toLocaleString('de-DE')} EUR`;
  } else {
    formatted = `${Math.round(finalAmount).toLocaleString('es-ES')} CUP`;
  }

  return {
    amount: finalAmount,
    currency: to,
    formatted,
  };
}

// Configuración global de almacenamiento en localStorage para conservar la preferencia
const CURRENCY_STORAGE_KEY = 'tucasita_currency_preference';

/**
 * Custom Hook para gestionar la preferencia de moneda globalmente.
 * Permite cambiar la moneda y obtener precios formateados de forma reactiva.
 */
export function useCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyType>('USD');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyType | null;
      if (stored && (stored === 'USD' || stored === 'CUP' || stored === 'EUR')) {
        Promise.resolve().then(() => setCurrencyState(stored));
      }
    }
  }, []);

  const changeCurrency = (newCurrency: CurrencyType) => {
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
    }
    // Desencadenar evento personalizado para sincronizar otras instancias del hook si las hay
    window.dispatchEvent(new Event('tucasita_currency_changed'));
  };

  useEffect(() => {
    const handleSync = () => {
      const stored = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyType | null;
      if (stored && stored !== currency) {
        Promise.resolve().then(() => setCurrencyState(stored));
      }
    };
    window.addEventListener('tucasita_currency_changed', handleSync);
    return () => window.removeEventListener('tucasita_currency_changed', handleSync);
  }, [currency]);

  const formatPrice = (amount: number, originalCurrency: string): string => {
    return convertCurrency(amount, originalCurrency, currency).formatted;
  };

  return {
    currency,
    changeCurrency,
    formatPrice,
  };
}
