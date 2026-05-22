/**
 * @file dataCache.test.ts
 * @description Tests for the data caching utility.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setCache, getCache, removeCache, clearAllCache, getCacheStats, formatBytes, formatAge } from '@/utils/dataCache';

// Mock localStorage
const storage: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => storage[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { storage[key] = value; }),
  removeItem: vi.fn((key: string) => { delete storage[key]; }),
  clear: vi.fn(() => { Object.keys(storage).forEach(k => delete storage[k]); }),
  get length() { return Object.keys(storage).length; },
  key: vi.fn((i: number) => Object.keys(storage)[i] ?? null),
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('dataCache', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should store and retrieve data', () => {
    const data = { name: 'test', value: 42 };
    setCache('test-key', data);
    const result = getCache<typeof data>('test-key');
    expect(result).toEqual(data);
  });

  it('should return null for missing keys', () => {
    expect(getCache('nonexistent')).toBeNull();
  });

  it('should return null for expired entries', () => {
    // Create an already-expired entry
    const expiredEntry = {
      data: 'old',
      timestamp: Date.now() - 100000,
      ttl: 1000,
    };
    storage['ai-compute-cache:expired'] = JSON.stringify(expiredEntry);
    expect(getCache('expired')).toBeNull();
  });

  it('should remove a specific cache entry', () => {
    setCache('key1', 'value1');
    setCache('key2', 'value2');
    removeCache('key1');
    expect(getCache('key1')).toBeNull();
    expect(getCache('key2')).toBe('value2');
  });

  it('should clear all cache entries', () => {
    setCache('a', 1);
    setCache('b', 2);
    const cleared = clearAllCache();
    expect(cleared).toBe(2);
    expect(getCache('a')).toBeNull();
    expect(getCache('b')).toBeNull();
  });

  it('should return cache stats', () => {
    setCache('item1', { data: 'hello' });
    setCache('item2', [1, 2, 3]);
    const stats = getCacheStats();
    expect(stats.totalEntries).toBe(2);
    expect(stats.totalSize).toBeGreaterThan(0);
    expect(stats.entries.length).toBe(2);
  });

  it('should track hit rate changes', () => {
    clearAllCache(); // reset counters
    setCache('hit-key', 'value');
    getCache('hit-key');       // hit
    getCache('hit-key');       // hit
    getCache('miss-key');      // miss
    const stats = getCacheStats();
    // 2 hits out of 3 total = 0.666...
    expect(stats.hitRate).toBeGreaterThan(0.5);
    expect(stats.hitRate).toBeLessThan(1);
  });

  describe('formatBytes', () => {
    it('should format 0 bytes', () => {
      expect(formatBytes(0)).toBe('0 B');
    });
    it('should format bytes', () => {
      expect(formatBytes(512)).toBe('512.0 B');
    });
    it('should format kilobytes', () => {
      expect(formatBytes(1024)).toBe('1.0 KB');
    });
    it('should format megabytes', () => {
      expect(formatBytes(1048576)).toBe('1.0 MB');
    });
  });

  describe('formatAge', () => {
    it('should format seconds', () => {
      expect(formatAge(5000)).toBe('5s');
    });
    it('should format minutes', () => {
      expect(formatAge(120000)).toBe('2m');
    });
    it('should format hours', () => {
      expect(formatAge(7200000)).toBe('2h');
    });
    it('should format days', () => {
      expect(formatAge(172800000)).toBe('2d');
    });
  });
});
