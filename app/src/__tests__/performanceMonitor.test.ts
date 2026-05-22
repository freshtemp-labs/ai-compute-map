/**
 * @file performanceMonitor.test.ts
 * @description Tests for the performance monitoring utility.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { measureSync, measureAsync, recordMetric, getPerformanceStats, clearMetrics, formatDuration } from '@/utils/performanceMonitor';

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

// Mock performance
vi.stubGlobal('performance', {
  now: vi.fn(() => Date.now()),
  getEntriesByType: vi.fn(() => []),
});

describe('performanceMonitor', () => {
  beforeEach(() => {
    localStorageMock.clear();
    clearMetrics();
    vi.clearAllMocks();
  });

  it('should record a custom metric', () => {
    recordMetric('test-op', 42.5);
    const stats = getPerformanceStats();
    expect(stats.customMetrics.length).toBe(1);
    expect(stats.customMetrics[0].name).toBe('test-op');
    expect(stats.customMetrics[0].duration).toBe(42.5);
  });

  it('should measure sync operations', () => {
    const result = measureSync('calc', () => 2 + 2);
    expect(result).toBe(4);
    const stats = getPerformanceStats();
    expect(stats.customMetrics.length).toBe(1);
    expect(stats.customMetrics[0].name).toBe('calc');
  });

  it('should measure async operations', async () => {
    const result = await measureAsync('async-op', async () => {
      return Promise.resolve('done');
    });
    expect(result).toBe('done');
    const stats = getPerformanceStats();
    expect(stats.customMetrics.length).toBe(1);
    expect(stats.customMetrics[0].name).toBe('async-op');
  });

  it('should clear metrics', () => {
    recordMetric('a', 10);
    recordMetric('b', 20);
    clearMetrics();
    const stats = getPerformanceStats();
    expect(stats.customMetrics.length).toBe(0);
  });

  it('should limit metrics to 50 entries', () => {
    for (let i = 0; i < 60; i++) {
      recordMetric(`op-${i}`, i);
    }
    const stats = getPerformanceStats();
    expect(stats.customMetrics.length).toBe(50);
    // Should keep the last 50
    expect(stats.customMetrics[0].name).toBe('op-10');
  });

  describe('formatDuration', () => {
    it('should format sub-millisecond', () => {
      expect(formatDuration(0.5)).toBe('<1ms');
    });
    it('should format milliseconds', () => {
      expect(formatDuration(42.7)).toBe('43ms');
    });
    it('should format seconds', () => {
      expect(formatDuration(1234)).toBe('1.23s');
    });
  });
});
