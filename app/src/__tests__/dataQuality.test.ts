import { describe, it, expect } from 'vitest';
import {
  computeQualityScore,
  computeSourceDistribution,
  computeMissingFields,
  computeSourceEntryDistribution,
  computeCompleteness,
  computeConsistency,
  computeTimeliness,
} from '@/utils/dataQuality';
import { supplyChainData, fabricationFacilities, dataCenters, sourcesTableData } from '@/data/mockData';

describe('dataQuality utilities', () => {
  it('computeQualityScore returns scores in 0-100 range', () => {
    const score = computeQualityScore(supplyChainData, fabricationFacilities, dataCenters);
    expect(score.completeness).toBeGreaterThanOrEqual(0);
    expect(score.completeness).toBeLessThanOrEqual(100);
    expect(score.consistency).toBeGreaterThanOrEqual(0);
    expect(score.consistency).toBeLessThanOrEqual(100);
    expect(score.timeliness).toBeGreaterThanOrEqual(0);
    expect(score.timeliness).toBeLessThanOrEqual(100);
    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(100);
  });

  it('computeSourceDistribution counts tiers correctly', () => {
    const dist = computeSourceDistribution(supplyChainData, fabricationFacilities, dataCenters);
    expect(dist.tier1).toBeGreaterThan(0);
    expect(dist.tier2).toBeGreaterThan(0);
    expect(dist.total).toBe(dist.tier1 + dist.tier2 + dist.tier3);
    expect(dist.total).toBe(supplyChainData.length + fabricationFacilities.length + dataCenters.length);
  });

  it('computeMissingFields returns sorted results', () => {
    const fields = computeMissingFields(supplyChainData, fabricationFacilities, dataCenters);
    expect(fields.length).toBeGreaterThan(0);
    for (const f of fields) {
      expect(f.percent).toBeGreaterThanOrEqual(0);
      expect(f.percent).toBeLessThanOrEqual(100);
      expect(f.missing).toBeLessThanOrEqual(f.total);
    }
    // Should be sorted by percent descending
    for (let i = 1; i < fields.length; i++) {
      expect(fields[i - 1].percent).toBeGreaterThanOrEqual(fields[i].percent);
    }
  });

  it('computeSourceEntryDistribution counts tiers correctly', () => {
    const dist = computeSourceEntryDistribution(sourcesTableData);
    expect(dist.tier1).toBeGreaterThan(0);
    expect(dist.tier2).toBeGreaterThan(0);
    expect(dist.total).toBe(sourcesTableData.length);
  });

  it('computeCompleteness returns 0-100', () => {
    const c = computeCompleteness(supplyChainData, fabricationFacilities, dataCenters);
    expect(c).toBeGreaterThanOrEqual(0);
    expect(c).toBeLessThanOrEqual(100);
  });

  it('computeConsistency returns 0-100', () => {
    const c = computeConsistency(supplyChainData, fabricationFacilities, dataCenters);
    expect(c).toBeGreaterThanOrEqual(0);
    expect(c).toBeLessThanOrEqual(100);
  });

  it('computeTimeliness returns 0-100', () => {
    const t = computeTimeliness(supplyChainData, fabricationFacilities, dataCenters);
    expect(t).toBeGreaterThanOrEqual(0);
    expect(t).toBeLessThanOrEqual(100);
  });

  it('computeQualityScore handles empty arrays', () => {
    const score = computeQualityScore([], [], []);
    expect(score.completeness).toBe(100);
    expect(score.consistency).toBe(100);
    expect(score.timeliness).toBe(100);
    expect(score.overall).toBe(100);
  });
});
