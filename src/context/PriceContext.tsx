import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FALLBACK_PRICES } from '../services/items';
import { GEItemPrice } from '../types/osrs';

interface PriceContextType {
  prices: Record<number, number>;
  isLive: boolean;
  isLoading: boolean;
  lastUpdated: Date | null;
  getPrice: (itemId: number, fallback?: number) => number;
  refreshPrices: () => Promise<void>;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Record<number, number>>(FALLBACK_PRICES);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      // First try our Cloudflare edge function
      let res: Response;
      try {
        res = await fetch('/api/prices');
      } catch {
        // Dev fallback directly to Wiki API
        res = await fetch('https://prices.runescape.wiki/api/v1/osrs/latest', {
          headers: {
            'User-Agent': 'OSRSPortalStreamlined/1.0 (contact: github.com/Jnowakoski15/osrs-calcs)',
          },
        });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as any;
      const rawData = json?.data || json;

      const newPrices: Record<number, number> = { ...FALLBACK_PRICES };
      for (const [idStr, p] of Object.entries(rawData as Record<string, GEItemPrice>)) {
        const id = Number(idStr);
        if (p && typeof p === 'object') {
          // Use high price or low price if high is 0
          const validPrice = p.high || p.low;
          if (validPrice && validPrice > 0) {
            newPrices[id] = validPrice;
          }
        }
      }

      setPrices(newPrices);
      setIsLive(true);
      setLastUpdated(new Date());
    } catch {
      // Retain fallback prices
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const getPrice = useCallback(
    (itemId: number, fallback?: number): number => {
      if (prices[itemId] !== undefined) {
        return prices[itemId];
      }
      if (fallback !== undefined) return fallback;
      return FALLBACK_PRICES[itemId] ?? 0;
    },
    [prices]
  );

  return (
    <PriceContext.Provider
      value={{
        prices,
        isLive,
        isLoading,
        lastUpdated,
        getPrice,
        refreshPrices: fetchPrices,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

export function usePrices(): PriceContextType {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrices must be used within a PriceProvider');
  }
  return context;
}
