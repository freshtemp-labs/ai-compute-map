/**
 * @file CompareContext.tsx
 * @description React Context for managing the facility comparison feature.
 * Allows users to select up to MAX_COMPARE (3) facilities for side-by-side
 * comparison on the /compare page. Persists selections to localStorage.
 *
 * @dependencies react, @/components/map/useMapData
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MapPin } from '@/components/map/useMapData';

/** Type alias for pins that can be compared */
export type ComparePin = MapPin;

interface CompareContextValue {
  comparePins: ComparePin[];
  addComparePin: (pin: ComparePin) => boolean;
  removeComparePin: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const STORAGE_KEY = 'compare-pins';
const MAX_COMPARE = 3;

const CompareContext = createContext<CompareContextValue | null>(null);

/** Context provider that manages compare pin state and localStorage sync */
export function CompareProvider({ children }: { children: ReactNode }) {
  const [comparePins, setComparePins] = useState<ComparePin[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comparePins));
  }, [comparePins]);

  const addComparePin = useCallback((pin: ComparePin) => {
    let added = false;
    setComparePins((prev) => {
      if (prev.length >= MAX_COMPARE || prev.some((p) => p.id === pin.id)) {
        added = false;
        return prev;
      }
      added = true;
      return [...prev, pin];
    });
    return added;
  }, []);

  const removeComparePin = useCallback((id: string) => {
    setComparePins((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setComparePins([]);
  }, []);

  const isInCompare = useCallback(
    (id: string) => comparePins.some((p) => p.id === id),
    [comparePins]
  );

  return (
    <CompareContext.Provider
      value={{ comparePins, addComparePin, removeComparePin, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

/** Hook to access the compare context. Must be used within a CompareProvider. */
export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}

export { MAX_COMPARE };
