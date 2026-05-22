import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// ── Mock heavy browser-only dependencies ──────────────────────────

// Mock echarts-for-react (needs canvas / DOM measurement)
vi.mock('echarts-for-react', () => ({
  default: vi.fn(({ style }: { style?: Record<string, unknown> }) =>
    React.createElement('div', { 'data-testid': 'echarts-mock', style }),
  ),
}));

// Mock @amcharts/amcharts5 (requires complex setup)
vi.mock('@amcharts/amcharts5', () => ({
  Root: { new: vi.fn(() => ({ container: { children: { push: vi.fn() } } })) },
  MapChart: { new: vi.fn() },
  MapPolygonSeries: { new: vi.fn() },
  color: vi.fn(),
  percent: vi.fn((v: number) => v),
  Theme: { new: vi.fn() },
}));

vi.mock('@amcharts/amcharts5-geodata', () => ({}));

// ── Smoke Tests ──────────────────────────────────────────────────

describe('Component smoke tests', () => {
  it('Home page module exports a function component', async () => {
    const mod = await import('@/pages/Home');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('MapPage module exports a function component', async () => {
    const mod = await import('@/pages/MapPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('ComparePage module exports a function component', async () => {
    const mod = await import('@/pages/ComparePage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('App module exports a function component', async () => {
    const mod = await import('@/App');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('CountryDetailPage module exports a function component', async () => {
    const mod = await import('@/pages/CountryDetailPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('NewsPage module exports a function component', async () => {
    const mod = await import('@/pages/NewsPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('CountryComparePage module exports a function component', async () => {
    const mod = await import('@/pages/CountryComparePage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('InsightsPage module exports a function component', async () => {
    const mod = await import('@/pages/InsightsPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});

describe('Data module smoke tests', () => {
  it('mockData exports all expected datasets', async () => {
    const mod = await import('@/data/mockData');
    expect(mod.supplyChainData).toBeDefined();
    expect(mod.fabricationFacilities).toBeDefined();
    expect(mod.dataCenters).toBeDefined();
    expect(mod.sourceReferences).toBeDefined();
    expect(mod.facilitiesData).toBeDefined();
    expect(mod.supplyChainTableData).toBeDefined();
    expect(mod.sourcesTableData).toBeDefined();
    expect(mod.layers).toBeDefined();
    expect(mod.kpis).toBeDefined();
    expect(mod.companies).toBeDefined();
  });

  it('newsData exports expected datasets', async () => {
    const mod = await import('@/data/newsData');
    expect(mod.newsData).toBeDefined();
    expect(Array.isArray(mod.newsData)).toBe(true);
    expect(mod.newsData.length).toBeGreaterThan(0);
    expect(mod.NEWS_TAGS).toBeDefined();
    expect(Array.isArray(mod.NEWS_TAGS)).toBe(true);
  });
});

describe('Chart component smoke tests', () => {
  it('TrendChart module exports a function component', async () => {
    const mod = await import('@/components/charts/TrendChart');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('FunnelChart module exports a function component', async () => {
    const mod = await import('@/components/charts/FunnelChart');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('GaugeDashboard module exports a function component', async () => {
    const mod = await import('@/components/charts/GaugeDashboard');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('SupplyChainSankey module exports a function component', async () => {
    const mod = await import('@/components/supply-chain/SupplyChainSankey');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('DataQualityDashboard module exports a function component', async () => {
    const mod = await import('@/components/data-quality/DataQualityDashboard');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});

describe('Page smoke tests for enhanced features', () => {
  it('DataCentersPage module exports a function component', async () => {
    const mod = await import('@/pages/DataCentersPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('SupplyChainPage module exports a function component', async () => {
    const mod = await import('@/pages/SupplyChainPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('SettingsPage module exports a function component', async () => {
    const mod = await import('@/pages/SettingsPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('FoundriesPage module exports a function component', async () => {
    const mod = await import('@/pages/FoundriesPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});

describe('CompareContext smoke tests', () => {
  it('CompareProvider and useCompare exports exist', async () => {
    const mod = await import('@/context/CompareContext');
    expect(mod.CompareProvider).toBeDefined();
    expect(typeof mod.CompareProvider).toBe('function');
    expect(mod.useCompare).toBeDefined();
    expect(typeof mod.useCompare).toBe('function');
    expect(mod.MAX_COMPARE).toBe(3);
  });
});
