/**
 * @file dataQuality.ts
 * @description Data quality scoring and monitoring utilities.
 * Computes completeness, consistency, timeliness, and source distribution.
 */

import type { DataPoint, Facility, DataCenter, SourceEntry } from '@/types';

export interface QualityScore {
  completeness: number;   // 0–100
  consistency: number;    // 0–100
  timeliness: number;     // 0–100
  overall: number;        // weighted avg
}

export interface SourceDistribution {
  tier1: number;
  tier2: number;
  tier3: number;
  total: number;
}

export interface MissingFieldStat {
  field: string;
  missing: number;
  total: number;
  percent: number;
}

/** Calculate completeness: how many required fields are present */
export function computeCompleteness(
  dataPoints: DataPoint[],
  facilities: Facility[],
  dataCenters: DataCenter[],
): number {
  const allItems = [
    ...dataPoints.map((d) => [d.name, d.value, d.sourceName, d.lastUpdated, d.lat, d.lng]),
    ...facilities.map((f) => [f.name, f.company, f.country, f.city, f.capacity, f.lastUpdated]),
    ...dataCenters.map((d) => [d.name, d.provider, d.country, d.city, d.powerCapacity, d.lastUpdated]),
  ];
  let filled = 0;
  let total = 0;
  for (const fields of allItems) {
    for (const f of fields) {
      total++;
      if (f !== undefined && f !== null && f !== '') filled++;
    }
  }
  return total > 0 ? Math.round((filled / total) * 100) : 100;
}

/** Calculate consistency: source tier distribution quality */
export function computeConsistency(
  dataPoints: DataPoint[],
  facilities: Facility[],
  dataCenters: DataCenter[],
): number {
  const allTiers = [
    ...dataPoints.map((d) => d.sourceTier),
    ...facilities.map((f) => f.sourceTier),
    ...dataCenters.map((d) => d.sourceTier),
  ];
  if (allTiers.length === 0) return 100;
  const tier1Count = allTiers.filter((t) => t === 1).length;
  const tier2Count = allTiers.filter((t) => t === 2).length;
  // Tier 1 gets full weight, Tier 2 gets 70%, Tier 3 gets 40%
  const weighted = (tier1Count * 100 + tier2Count * 70 + (allTiers.length - tier1Count - tier2Count) * 40) / allTiers.length;
  return Math.round(weighted);
}

/** Calculate timeliness: how recent the data is */
export function computeTimeliness(
  dataPoints: DataPoint[],
  facilities: Facility[],
  dataCenters: DataCenter[],
): number {
  const allDates = [
    ...dataPoints.map((d) => d.lastUpdated),
    ...facilities.map((f) => f.lastUpdated),
    ...dataCenters.map((d) => d.lastUpdated),
  ].filter(Boolean);
  if (allDates.length === 0) return 100;
  const now = Date.now();
  const scores = allDates.map((d) => {
    const age = (now - new Date(d).getTime()) / (1000 * 60 * 60 * 24); // days
    if (age < 90) return 100;
    if (age < 180) return 80;
    if (age < 365) return 60;
    return 40;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/** Compute overall quality score */
export function computeQualityScore(
  dataPoints: DataPoint[],
  facilities: Facility[],
  dataCenters: DataCenter[],
): QualityScore {
  const completeness = computeCompleteness(dataPoints, facilities, dataCenters);
  const consistency = computeConsistency(dataPoints, facilities, dataCenters);
  const timeliness = computeTimeliness(dataPoints, facilities, dataCenters);
  const overall = Math.round(completeness * 0.4 + consistency * 0.35 + timeliness * 0.25);
  return { completeness, consistency, timeliness, overall };
}

/** Source tier distribution */
export function computeSourceDistribution(
  dataPoints: DataPoint[],
  facilities: Facility[],
  dataCenters: DataCenter[],
): SourceDistribution {
  const allTiers = [
    ...dataPoints.map((d) => d.sourceTier),
    ...facilities.map((f) => f.sourceTier),
    ...dataCenters.map((d) => d.sourceTier),
  ];
  return {
    tier1: allTiers.filter((t) => t === 1).length,
    tier2: allTiers.filter((t) => t === 2).length,
    tier3: allTiers.filter((t) => t === 3).length,
    total: allTiers.length,
  };
}

/** Missing field statistics */
export function computeMissingFields(
  dataPoints: DataPoint[],
  facilities: Facility[],
  dataCenters: DataCenter[],
): MissingFieldStat[] {
  const fieldMap: Record<string, { missing: number; total: number }> = {};

  const check = (obj: Record<string, unknown>, fields: string[]) => {
    for (const f of fields) {
      if (!fieldMap[f]) fieldMap[f] = { missing: 0, total: 0 };
      fieldMap[f].total++;
      const val = obj[f];
      if (val === undefined || val === null || val === '') {
        fieldMap[f].missing++;
      }
    }
  };

  dataPoints.forEach((d) => check(d as unknown as Record<string, unknown>, ['value', 'unit', 'confidence', 'sourceName', 'lastUpdated']));
  facilities.forEach((f) => check(f as unknown as Record<string, unknown>, ['capacity', 'processNode', 'yearEstablished', 'employees']));
  dataCenters.forEach((d) => check(d as unknown as Record<string, unknown>, ['powerCapacity', 'pue', 'yearOperational', 'cloudProviders']));

  return Object.entries(fieldMap)
    .map(([field, { missing, total }]) => ({
      field,
      missing,
      total,
      percent: Math.round((missing / total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);
}

/** Compute source distribution from SourceEntry table data */
export function computeSourceEntryDistribution(sources: SourceEntry[]): SourceDistribution {
  return {
    tier1: sources.filter((s) => s.tier === 'tier1').length,
    tier2: sources.filter((s) => s.tier === 'tier2').length,
    tier3: sources.filter((s) => s.tier === 'tier3').length,
    total: sources.length,
  };
}
