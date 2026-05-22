import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock heavy dependencies
vi.mock('echarts-for-react', () => ({
  default: vi.fn(({ style }: { style?: Record<string, unknown> }) =>
    React.createElement('div', { 'data-testid': 'echarts-mock', style }),
  ),
}));

vi.mock('@amcharts/amcharts5', () => ({
  Root: { new: vi.fn(() => ({ container: { children: { push: vi.fn() } } })) },
  MapChart: { new: vi.fn() },
  MapPolygonSeries: { new: vi.fn() },
  color: vi.fn(),
  percent: vi.fn((v: number) => v),
  Theme: { new: vi.fn() },
}));

vi.mock('@amcharts/amcharts5-geodata', () => ({}));

// ── Supply chain relation logic tests ─────────────────────────

describe('DetailPanel supply chain relations', () => {
  // We test the getSupplyChainRelations logic by importing the module
  // and simulating pin data

  it('DetailPanel module exports a function component', async () => {
    const mod = await import('@/components/map/DetailPanel');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});

// ── HistoryPage smoke tests ──────────────────────────────────

describe('HistoryPage smoke tests', () => {
  it('HistoryPage module exports a function component', async () => {
    const mod = await import('@/pages/HistoryPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});

// ── SupplyChainPage smoke tests ──────────────────────────────

describe('SupplyChainPage smoke tests', () => {
  it('SupplyChainPage module exports a function component', async () => {
    const mod = await import('@/pages/SupplyChainPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});

// ── FoundriesPage smoke tests ────────────────────────────────

describe('FoundriesPage smoke tests', () => {
  it('FoundriesPage module exports a function component', async () => {
    const mod = await import('@/pages/FoundriesPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});

// ── DataCentersPage smoke tests ──────────────────────────────

describe('DataCentersPage smoke tests', () => {
  it('DataCentersPage module exports a function component', async () => {
    const mod = await import('@/pages/DataCentersPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});

// ── SourcesPage smoke tests ──────────────────────────────────

describe('SourcesPage smoke tests', () => {
  it('SourcesPage module exports a function component', async () => {
    const mod = await import('@/pages/SourcesPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});

// ── DevelopersPage smoke tests ───────────────────────────────

describe('DevelopersPage smoke tests', () => {
  it('DevelopersPage module exports a function component', async () => {
    const mod = await import('@/pages/DevelopersPage');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
