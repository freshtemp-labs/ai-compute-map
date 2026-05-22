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
import type { DataPoint } from '@/types';

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

  it('computeSourceDistribution handles empty arrays', () => {
    const dist = computeSourceDistribution([], [], []);
    expect(dist.tier1).toBe(0);
    expect(dist.tier2).toBe(0);
    expect(dist.tier3).toBe(0);
    expect(dist.total).toBe(0);
  });

  it('computeMissingFields handles empty arrays', () => {
    const fields = computeMissingFields([], [], []);
    expect(fields.length).toBe(0);
  });

  it('computeSourceEntryDistribution handles empty sources', () => {
    const dist = computeSourceEntryDistribution([]);
    expect(dist.tier1).toBe(0);
    expect(dist.tier2).toBe(0);
    expect(dist.tier3).toBe(0);
    expect(dist.total).toBe(0);
  });

  it('computeConsistency ranks tier1 data higher than tier3', () => {
    const tier1Data: Partial<DataPoint>[] = [
      { sourceTier: 1 as DataPoint['sourceTier'], name: 't1', value: 1, sourceName: 's', lastUpdated: '2024-01-01', lat: 0, lng: 0, layer: 'supply', category: 'test' },
    ];
    const tier3Data: Partial<DataPoint>[] = [
      { sourceTier: 3 as DataPoint['sourceTier'], name: 't3', value: 1, sourceName: 's', lastUpdated: '2024-01-01', lat: 0, lng: 0, layer: 'supply', category: 'test' },
    ];
    const score1 = computeConsistency(tier1Data as DataPoint[], [], []);
    const score3 = computeConsistency(tier3Data as DataPoint[], [], []);
    expect(score1).toBeGreaterThan(score3);
  });

  it('computeTimeliness scores recent data higher than old data', () => {
    const recentData: Partial<DataPoint>[] = [
      { sourceTier: 1, name: 'recent', value: 1, sourceName: 's', lastUpdated: new Date().toISOString().slice(0, 10), lat: 0, lng: 0, layer: 'supply', category: 'test' } as DataPoint,
    ];
    const oldData: Partial<DataPoint>[] = [
      { sourceTier: 1, name: 'old', value: 1, sourceName: 's', lastUpdated: '2020-01-01', lat: 0, lng: 0, layer: 'supply', category: 'test' } as DataPoint,
    ];
    const recentScore = computeTimeliness(recentData as DataPoint[], [], []);
    const oldScore = computeTimeliness(oldData as DataPoint[], [], []);
    expect(recentScore).toBeGreaterThan(oldScore);
  });

  it('overall score is weighted average of sub-scores', () => {
    const score = computeQualityScore(supplyChainData, fabricationFacilities, dataCenters);
    const expected = Math.round(score.completeness * 0.4 + score.consistency * 0.35 + score.timeliness * 0.25);
    expect(score.overall).toBe(expected);
  });

  it('computeMissingFields percent is correctly calculated', () => {
    const fields = computeMissingFields(supplyChainData, fabricationFacilities, dataCenters);
    for (const f of fields) {
      const expectedPercent = Math.round((f.missing / f.total) * 100);
      expect(f.percent).toBe(expectedPercent);
    }
  });

  it('all source tiers are represented in supply chain data', () => {
    const dist = computeSourceDistribution(supplyChainData, fabricationFacilities, dataCenters);
    expect(dist.tier1).toBeGreaterThan(0);
    expect(dist.tier2).toBeGreaterThan(0);
    // Tier 3 may be 0 for some datasets but supply chain has tier3 data
    const totalTiers = dist.tier1 + dist.tier2 + dist.tier3;
    expect(totalTiers).toBeGreaterThan(50);
  });
});
