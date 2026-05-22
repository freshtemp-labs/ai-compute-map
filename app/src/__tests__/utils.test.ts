/**
 * @file src/__tests__/utils.test.ts
 * @description Unit tests for utility functions and hooks.
 * Tests cn() class merge, useMapData helpers, pin importance calculation,
 * and pin value formatting.
 *
 * @dependencies vitest, @/lib/utils, @/components/map/useMapData, @/constants/layerColors
 */

import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';
import { getPinImportance, formatPinValue } from '@/components/map/useMapData';
import { LAYER_COLORS } from '@/constants/layerColors';
import type { MapPin } from '@/components/map/useMapData';
import type { LayerType } from '@/types';

// ── cn() utility ─────────────────────────────────────────────────────

describe('cn() — class name merge utility', () => {
  it('merges multiple class strings', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('handles undefined and falsy values gracefully', () => {
    const result = cn('base', undefined, false, null, '', 'extra');
    expect(result).toContain('base');
    expect(result).toContain('extra');
  });

  it('deduplicates Tailwind classes (later wins)', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('handles conditional classes with objects', () => {
    const result = cn('base', { 'active': true, 'disabled': false });
    expect(result).toContain('base');
    expect(result).toContain('active');
    expect(result).not.toContain('disabled');
  });

  it('returns empty string for no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });
});

// ── LAYER_COLORS ─────────────────────────────────────────────────────

describe('LAYER_COLORS', () => {
  it('has a color for every LayerType', () => {
    expect(LAYER_COLORS.supply).toBeDefined();
    expect(LAYER_COLORS.foundry).toBeDefined();
    expect(LAYER_COLORS.datacenter).toBeDefined();
  });

  it('colors are valid hex format', () => {
    for (const color of Object.values(LAYER_COLORS)) {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('colors are distinct', () => {
    const colors = Object.values(LAYER_COLORS);
    const unique = new Set(colors);
    expect(unique.size).toBe(colors.length);
  });
});

// ── getPinImportance ─────────────────────────────────────────────────

describe('getPinImportance', () => {
  const makePin = (overrides: Partial<MapPin>): MapPin => ({
    id: 'test-1',
    name: 'Test Pin',
    layer: 'supply' as LayerType,
    lat: 0,
    lng: 0,
    value: 0,
    sourceTier: 1 as const,
    sourceName: 'test',
    lastUpdated: '2024-01-01',
    ...overrides,
  });

  it('supply pin: importance scales with numeric value', () => {
    const pin = makePin({ layer: 'supply', value: 30000 });
    expect(getPinImportance(pin)).toBe(1);
  });

  it('supply pin: caps importance at 1', () => {
    const pin = makePin({ layer: 'supply', value: 100000 });
    expect(getPinImportance(pin)).toBe(1);
  });

  it('supply pin: non-numeric value returns 0.5', () => {
    const pin = makePin({ layer: 'supply', value: 'N/A' });
    expect(getPinImportance(pin)).toBe(0.5);
  });

  it('foundry pin: TSMC has highest importance', () => {
    const pin = makePin({ layer: 'foundry', company: 'TSMC' });
    expect(getPinImportance(pin)).toBe(1);
  });

  it('foundry pin: Samsung gets 0.8', () => {
    const pin = makePin({ layer: 'foundry', company: 'Samsung Foundry' });
    expect(getPinImportance(pin)).toBe(0.8);
  });

  it('foundry pin: other companies get 0.5', () => {
    const pin = makePin({ layer: 'foundry', company: 'Intel' });
    expect(getPinImportance(pin)).toBe(0.5);
  });

  it('datacenter pin: high power (>300 MW) returns 1', () => {
    const pin = makePin({ layer: 'datacenter', powerCapacity: 500 });
    expect(getPinImportance(pin)).toBe(1);
  });

  it('datacenter pin: medium power (100-300 MW) returns 0.7', () => {
    const pin = makePin({ layer: 'datacenter', powerCapacity: 200 });
    expect(getPinImportance(pin)).toBe(0.7);
  });

  it('datacenter pin: low power (<100 MW) returns 0.4', () => {
    const pin = makePin({ layer: 'datacenter', powerCapacity: 50 });
    expect(getPinImportance(pin)).toBe(0.4);
  });

  it('datacenter pin: undefined power returns 0.4', () => {
    const pin = makePin({ layer: 'datacenter' });
    expect(getPinImportance(pin)).toBe(0.4);
  });
});

// ── formatPinValue ───────────────────────────────────────────────────

describe('formatPinValue', () => {
  const makePin = (value: string | number, unit?: string): MapPin => ({
    id: 'test-1',
    name: 'Test',
    layer: 'supply',
    lat: 0,
    lng: 0,
    value,
    unit,
    sourceTier: 1,
    sourceName: 'test',
    lastUpdated: '2024-01-01',
  });

  it('formats numbers >= 1000 with K suffix', () => {
    expect(formatPinValue(makePin(15000, 'tonnes'))).toBe('15.0K tonnes');
  });

  it('formats small numbers without suffix', () => {
    expect(formatPinValue(makePin(500, 'units'))).toBe('500 units');
  });

  it('handles string values', () => {
    expect(formatPinValue(makePin('180K WPM', 'cap'))).toBe('180K WPM cap');
  });

  it('handles missing unit', () => {
    expect(formatPinValue(makePin(42))).toBe('42 ');
  });

  it('handles zero value', () => {
    expect(formatPinValue(makePin(0, 'MW'))).toBe('0 MW');
  });
});
