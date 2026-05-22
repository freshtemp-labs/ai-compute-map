/**
 * @file dataCache.ts
 * @description Data caching utility using localStorage with TTL (24h default).
 * Provides cache hit/miss, expiry, size tracking, and cache clearing.
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number; // bytes
  hitRate: number; // 0-1
  entries: { key: string; size: number; age: number; ttl: number }[];
}

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_PREFIX = 'ai-compute-cache:';

let hitCount = 0;
let missCount = 0;

function fullKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

/**
 * Store data in localStorage cache with TTL.
 */
export function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(fullKey(key), JSON.stringify(entry));
  } catch {
    // localStorage may be full or unavailable
  }
}

/**
 * Retrieve data from cache. Returns null if missing or expired.
 */
export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(fullKey(key));
    if (!raw) {
      missCount++;
      return null;
    }
    const entry: CacheEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      // Expired — remove it
      localStorage.removeItem(fullKey(key));
      missCount++;
      return null;
    }
    hitCount++;
    return entry.data;
  } catch {
    missCount++;
    return null;
  }
}

/**
 * Remove a specific cache entry.
 */
export function removeCache(key: string): void {
  try {
    localStorage.removeItem(fullKey(key));
  } catch {
    // ignore
  }
}

/**
 * Clear all cache entries (matching our prefix).
 */
export function clearAllCache(): number {
  let cleared = 0;
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) {
        keys.push(k);
      }
    }
    keys.forEach((k) => {
      localStorage.removeItem(k);
      cleared++;
    });
    hitCount = 0;
    missCount = 0;
  } catch {
    // ignore
  }
  return cleared;
}

/**
 * Get cache statistics for display in Settings.
 */
export function getCacheStats(): CacheStats {
  const entries: CacheStats['entries'] = [];
  let totalSize = 0;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) {
        const raw = localStorage.getItem(k) || '';
        const size = new Blob([raw]).size;
        totalSize += size;

        try {
          const entry = JSON.parse(raw);
          entries.push({
            key: k.replace(CACHE_PREFIX, ''),
            size,
            age: Date.now() - entry.timestamp,
            ttl: entry.ttl,
          });
        } catch {
          // skip malformed entries
        }
      }
    }
  } catch {
    // ignore
  }

  const total = hitCount + missCount;
  return {
    totalEntries: entries.length,
    totalSize,
    hitRate: total > 0 ? hitCount / total : 0,
    entries,
  };
}

/**
 * Format bytes to human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Format milliseconds to human-readable age string.
 */
export function formatAge(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
