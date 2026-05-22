/**
 * @file performanceMonitor.ts
 * @description Performance monitoring utility using the Performance API.
 * Tracks page load times, key operation durations, and provides stats
 * for display in the Settings page.
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

export interface PerformanceStats {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  customMetrics: PerformanceMetric[];
}

const METRICS_KEY = 'ai-compute-perf-metrics';
const MAX_CUSTOM_METRICS = 50;

let customMetrics: PerformanceMetric[] = [];

/**
 * Load persisted custom metrics from localStorage.
 */
function loadMetrics(): PerformanceMetric[] {
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

/**
 * Persist custom metrics to localStorage.
 */
function saveMetrics(): void {
  try {
    localStorage.setItem(METRICS_KEY, JSON.stringify(customMetrics.slice(-MAX_CUSTOM_METRICS)));
  } catch {
    // ignore
  }
}

// Initialize on module load
customMetrics = loadMetrics();

/**
 * Measure an async operation and record its duration.
 */
export async function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    recordMetric(name, performance.now() - start);
    return result;
  } catch (error) {
    recordMetric(name, performance.now() - start);
    throw error;
  }
}

/**
 * Measure a sync operation and record its duration.
 */
export function measureSync<T>(name: string, fn: () => T): T {
  const start = performance.now();
  try {
    const result = fn();
    recordMetric(name, performance.now() - start);
    return result;
  } catch (error) {
    recordMetric(name, performance.now() - start);
    throw error;
  }
}

/**
 * Record a custom metric (e.g., manually measured duration).
 */
export function recordMetric(name: string, duration: number): void {
  customMetrics.push({
    name,
    duration: Math.round(duration * 100) / 100,
    timestamp: Date.now(),
  });
  // Keep only the last N metrics
  if (customMetrics.length > MAX_CUSTOM_METRICS) {
    customMetrics = customMetrics.slice(-MAX_CUSTOM_METRICS);
  }
  saveMetrics();
}

/**
 * Get performance stats including browser Performance API metrics.
 */
export function getPerformanceStats(): PerformanceStats {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const paint = performance.getEntriesByType('paint');

  const fcp = paint.find((p) => p.name === 'first-contentful-paint');
  const lcp = performance.getEntriesByType('largest-contentful-paint')[0] as PerformanceEntry | undefined;

  return {
    pageLoadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.startTime) : 0,
    domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.startTime) : 0,
    firstContentfulPaint: fcp ? Math.round(fcp.startTime) : 0,
    largestContentfulPaint: lcp ? Math.round(lcp.startTime) : 0,
    customMetrics: [...customMetrics],
  };
}

/**
 * Clear all recorded custom metrics.
 */
export function clearMetrics(): void {
  customMetrics = [];
  try {
    localStorage.removeItem(METRICS_KEY);
  } catch {
    // ignore
  }
}

/**
 * Format milliseconds to a readable duration string.
 */
export function formatDuration(ms: number): string {
  if (ms < 1) return '<1ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
