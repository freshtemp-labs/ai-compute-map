/**
 * @file src/__tests__/dataValidation.test.ts
 * @description Extended data validation tests for mockData.
 * Tests type-specific field constraints, cross-dataset referential integrity,
 * data format consistency, and enum validation.
 *
 * @dependencies vitest, @/data/mockData, @/types
 */

import { describe, it, expect } from 'vitest';
import {
  supplyChainData,
  fabricationFacilities,
  dataCenters,
  sourceReferences,
  facilitiesData,
  supplyChainTableData,
  sourcesTableData,
  layers,
  kpis,
  companies,
} from '@/data/mockData';

// ── Type guards ──────────────────────────────────────────────────────

const VALID_LAYERS = ['supply', 'foundry', 'datacenter'] as const;
const VALID_SOURCE_TIERS = [1, 2, 3] as const;

describe('Type and enum validation', () => {
  it('all supplyChainData entries have layer="supply"', () => {
    for (const item of supplyChainData) {
      expect(item.layer).toBe('supply');
    }
  });

  it('all fabricationFacilities entries have layer="foundry"', () => {
    for (const item of fabricationFacilities) {
      expect(item.layer).toBe('foundry');
    }
  });

  it('all fabricationFacilities statuses are valid', () => {
    const validStatuses = ['operational', 'construction', 'planned', 'expansion'];
    for (const item of fabricationFacilities) {
      expect(validStatuses).toContain(item.status);
    }
  });

  it('all dataCenters statuses are valid', () => {
    const validStatuses = ['operational', 'construction', 'planned'];
    for (const item of dataCenters) {
      expect(validStatuses).toContain(item.status);
    }
  });

  it('all sourceTier values are 1, 2, or 3', () => {
    for (const item of supplyChainData) {
      expect(VALID_SOURCE_TIERS).toContain(item.sourceTier);
    }
    for (const item of fabricationFacilities) {
      expect(VALID_SOURCE_TIERS).toContain(item.sourceTier);
    }
    for (const item of dataCenters) {
      expect(VALID_SOURCE_TIERS).toContain(item.sourceTier);
    }
  });
});

// ── Data format consistency ──────────────────────────────────────────

describe('Date format consistency', () => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  it('supplyChainData lastUpdated follows YYYY-MM-DD', () => {
    for (const item of supplyChainData) {
      expect(item.lastUpdated).toMatch(datePattern);
    }
  });

  it('fabricationFacilities lastUpdated follows YYYY-MM-DD', () => {
    for (const item of fabricationFacilities) {
      expect(item.lastUpdated).toMatch(datePattern);
    }
  });

  it('dataCenters lastUpdated follows YYYY-MM-DD', () => {
    for (const item of dataCenters) {
      expect(item.lastUpdated).toMatch(datePattern);
    }
  });

  it('sourceReferences lastUpdated follows YYYY-MM-DD', () => {
    for (const item of sourceReferences) {
      expect(item.lastUpdated).toMatch(datePattern);
    }
  });
});

// ── Value range validation ───────────────────────────────────────────

describe('Value range validation', () => {
  it('supplyChainData confidence values are between 0 and 1', () => {
    for (const item of supplyChainData) {
      if (item.confidence !== undefined) {
        expect(item.confidence).toBeGreaterThanOrEqual(0);
        expect(item.confidence).toBeLessThanOrEqual(1);
      }
    }
  });

  it('dataCenters PUE values are >= 1.0', () => {
    for (const item of dataCenters) {
      if (item.pue !== undefined) {
        expect(item.pue).toBeGreaterThanOrEqual(1.0);
      }
    }
  });

  it('dataCenters powerCapacity values are positive', () => {
    for (const item of dataCenters) {
      if (item.powerCapacity !== undefined) {
        expect(item.powerCapacity).toBeGreaterThan(0);
      }
    }
  });

  it('facilitiesData PUE values are >= 1.0', () => {
    for (const item of facilitiesData) {
      expect(item.pue).toBeGreaterThanOrEqual(1.0);
    }
  });

  it('facilitiesData powerMW values are positive', () => {
    for (const item of facilitiesData) {
      expect(item.powerMW).toBeGreaterThan(0);
    }
  });

  it('kpis progressPercent values are 0-100', () => {
    for (const item of kpis) {
      expect(item.progressPercent).toBeGreaterThanOrEqual(0);
      expect(item.progressPercent).toBeLessThanOrEqual(100);
    }
  });

  it('companies marketShare values are 0-100', () => {
    for (const item of companies) {
      if (item.marketShare !== undefined) {
        expect(item.marketShare).toBeGreaterThanOrEqual(0);
        expect(item.marketShare).toBeLessThanOrEqual(100);
      }
    }
  });

  it('companies revenue values are positive', () => {
    for (const item of companies) {
      if (item.revenue !== undefined) {
        expect(item.revenue).toBeGreaterThan(0);
      }
    }
  });

  it('sourcesTableData dataPoints values are positive', () => {
    for (const item of sourcesTableData) {
      expect(item.dataPoints).toBeGreaterThan(0);
    }
  });
});

// ── Cross-dataset consistency ────────────────────────────────────────

describe('Cross-dataset consistency', () => {
  it('all dataCenters cloudProviders arrays are non-empty', () => {
    for (const item of dataCenters) {
      if (item.cloudProviders !== undefined) {
        expect(item.cloudProviders.length).toBeGreaterThan(0);
      }
    }
  });

  it('sourceReferences tier values are valid source tiers', () => {
    for (const item of sourceReferences) {
      expect(VALID_SOURCE_TIERS).toContain(item.tier);
    }
  });

  it('supplyChainTableData tier values match expected format', () => {
    const validTiers = ['tier1', 'tier2', 'tier3'];
    for (const item of supplyChainTableData) {
      expect(validTiers).toContain(item.tier);
    }
  });

  it('sourcesTableData tier values match expected format', () => {
    const validTiers = ['tier1', 'tier2', 'tier3'];
    for (const item of sourcesTableData) {
      expect(validTiers).toContain(item.tier);
    }
  });

  it('sourcesTableData status values are valid', () => {
    const validStatuses = ['active', 'pending', 'stale'];
    for (const item of sourcesTableData) {
      expect(validStatuses).toContain(item.status);
    }
  });

  it('supplyChainTableData type values are valid', () => {
    const validTypes = ['rare-earth', 'lithography', 'design', 'energy'];
    for (const item of supplyChainTableData) {
      expect(validTypes).toContain(item.type);
    }
  });

  it('layers all have valid LayerType', () => {
    for (const item of layers) {
      expect(VALID_LAYERS).toContain(item.type);
    }
  });

  it('layers accentColor is a valid hex color', () => {
    for (const item of layers) {
      expect(item.accentColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('layers route starts with /', () => {
    for (const item of layers) {
      expect(item.route).toMatch(/^\//);
    }
  });

  it('kpis deltaType is valid', () => {
    const validDeltaTypes = ['positive', 'negative', 'neutral'];
    for (const item of kpis) {
      expect(validDeltaTypes).toContain(item.deltaType);
    }
  });

  it('kpis layer references a valid layer type', () => {
    for (const item of kpis) {
      expect(VALID_LAYERS).toContain(item.layer);
    }
  });
});

// ── Data completeness ────────────────────────────────────────────────

describe('Data completeness', () => {
  it('every company has a country', () => {
    for (const c of companies) {
      expect(c.country).toBeTruthy();
      expect(c.country.length).toBeGreaterThan(0);
    }
  });

  it('every dataCenter has a region', () => {
    for (const dc of dataCenters) {
      expect(dc.region).toBeTruthy();
      expect(dc.region.length).toBeGreaterThan(0);
    }
  });

  it('every supplyChainData entry has a category', () => {
    for (const item of supplyChainData) {
      expect(item.category).toBeTruthy();
      expect(item.category.length).toBeGreaterThan(0);
    }
  });

  it('every fabricationFacility has a processNode', () => {
    for (const item of fabricationFacilities) {
      expect(item.processNode).toBeDefined();
    }
  });

  it('every fabricationFacility has a capacity string', () => {
    for (const item of fabricationFacilities) {
      expect(item.capacity).toBeDefined();
      expect(typeof item.capacity).toBe('string');
    }
  });
});

// ── Data diversity checks ────────────────────────────────────────────

describe('Data diversity', () => {
  it('supplyChainData covers multiple categories', () => {
    const categories = new Set(supplyChainData.map((d) => d.category));
    expect(categories.size).toBeGreaterThanOrEqual(5);
  });

  it('dataCenters cover multiple regions', () => {
    const regions = new Set(dataCenters.map((d) => d.region));
    expect(regions.size).toBeGreaterThanOrEqual(3);
  });

  it('companies include multiple layers', () => {
    const companyLayers = new Set(companies.map((c) => c.layer));
    expect(companyLayers.size).toBeGreaterThanOrEqual(2);
  });

  it('fabricationFacilities include multiple companies', () => {
    const companies = new Set(fabricationFacilities.map((f) => f.company));
    expect(companies.size).toBeGreaterThanOrEqual(4);
  });

  it('facilitiesData include multiple providers', () => {
    const providers = new Set(facilitiesData.map((f) => f.provider));
    expect(providers.size).toBeGreaterThanOrEqual(5);
  });

  it('sourcesTableData includes tier1, tier2, and tier3 sources', () => {
    const tiers = new Set(sourcesTableData.map((s) => s.tier));
    expect(tiers).toContain('tier1');
    expect(tiers).toContain('tier2');
    expect(tiers).toContain('tier3');
  });
});
