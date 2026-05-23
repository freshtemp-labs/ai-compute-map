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

/** 对比功能的 Context 值类型 */
interface CompareContextValue {
  /** 当前已选中的对比设施列表 */
  comparePins: ComparePin[];
  /** 添加设施到对比列表，返回 true 表示添加成功 */
  addComparePin: (pin: ComparePin) => boolean;
  /** 从对比列表中移除指定 ID 的设施 */
  removeComparePin: (id: string) => void;
  /** 清空所有对比设施 */
  clearCompare: () => void;
  /** 判断指定 ID 的设施是否已在对比列表中 */
  isInCompare: (id: string) => boolean;
}

/** localStorage 存储键名 */
const STORAGE_KEY = 'compare-pins';
/** 最大可对比的设施数量 */
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
