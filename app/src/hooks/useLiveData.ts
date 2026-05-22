import { useState, useEffect, useRef, useCallback } from 'react';

export interface DataMeta {
  version: string;
  updatedAt: string;
  datasets: Record<string, {
    label: string;
    records: number;
    outputFile: string;
    validation: {
      pass: boolean;
      errors: number;
      warnings: number;
      errorRate: number;
    };
  }>;
  summary: {
    totalRecords: number;
    totalErrors: number;
    totalWarnings: number;
  };
}

export interface LiveDataState<T> {
  data: T | null;
  meta: DataMeta | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  nextRefresh: Date | null;
  refreshCount: number;
}

const DEFAULT_INTERVAL = 300000; // 5 minutes

/**
 * useLiveData — Automatic data refresh with 5-minute polling.
 * Fetches JSON data from /data/ path and refreshes on interval.
 */
export function useLiveData<T>(
  dataPath: string,
  options: { intervalMs?: number; enabled?: boolean } = {}
): LiveDataState<T> & { refresh: () => void } {
  const { intervalMs = DEFAULT_INTERVAL, enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [meta, setMeta] = useState<DataMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);

    try {
      // Fetch both data and metadata in parallel
      const [dataRes, metaRes] = await Promise.all([
        fetch(dataPath, { cache: 'no-cache' }),
        fetch('/data/metadata.json', { cache: 'no-cache' }).catch(() => null),
      ]);

      if (!dataRes.ok) {
        throw new Error(`HTTP ${dataRes.status}: ${dataRes.statusText}`);
      }

      const json = await dataRes.json();
      setData(json);
      setLastUpdated(new Date());
      setNextRefresh(new Date(Date.now() + intervalMs));
      setRefreshCount(c => c + 1);

      if (metaRes && metaRes.ok) {
        const metaJson = await metaRes.json();
        setMeta(metaJson);
      }

      // Cache in localStorage for offline support
      try {
        localStorage.setItem(`cached_${dataPath}`, JSON.stringify(json));
        localStorage.setItem(`cached_${dataPath}_time`, Date.now().toString());
      } catch {
        // localStorage may be full or unavailable
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);

      // Try loading from cache on error
      try {
        const cached = localStorage.getItem(`cached_${dataPath}`);
        if (cached) {
          setData(JSON.parse(cached));
          console.warn(`[useLiveData] Loaded cached data for ${dataPath} due to error: ${message}`);
        }
      } catch {
        // No cache available
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [dataPath, intervalMs]);

  // Initial load + interval refresh
  useEffect(() => {
    if (!enabled) return;

    fetchData(false); // Initial load

    timerRef.current = setInterval(() => {
      console.log(`[useLiveData] Auto-refreshing ${dataPath}...`);
      fetchData(true); // Background refresh
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData, intervalMs, enabled]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  return {
    data,
    meta,
    loading,
    error,
    lastUpdated,
    nextRefresh,
    refreshCount,
    refresh,
  };
}

/**
 * Format time until next refresh
 */
export function formatTimeUntil(date: Date | null): string {
  if (!date) return '--:--';
  const ms = date.getTime() - Date.now();
  if (ms <= 0) return 'Now';
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format relative time (e.g. "2 min ago")
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Never';
  const ms = Date.now() - date.getTime();
  if (ms < 60000) return 'Just now';
  if (ms < 3600000) return `${Math.floor(ms / 60000)} min ago`;
  if (ms < 86400000) return `${Math.floor(ms / 3600000)} hr ago`;
  return `${Math.floor(ms / 86400000)} days ago`;
}
