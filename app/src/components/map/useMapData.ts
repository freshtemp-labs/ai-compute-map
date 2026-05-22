/**
 * @file useMapData.ts
 * @description Custom hook and helpers for transforming raw mock data into
 * unified MapPin objects for rendering on the AmCharts map. Includes
 * pin importance calculation and value formatting utilities.
 *
 * @dependencies @/data/mockData, @/types, @/constants/layerColors
 */
import { useMemo } from 'react';
import { supplyChainData, fabricationFacilities, dataCenters } from '@/data/mockData';
import type { DataPoint, Facility, DataCenter, LayerType, SourceTier } from '@/types';
import { LAYER_COLORS } from '@/constants/layerColors';

/** Unified pin data structure representing any facility on the map */
export interface MapPin {
  id: string;
  name: string;
  layer: LayerType;
  lat: number;
  lng: number;
  value: string | number;
  unit?: string;
  category?: string;
  sourceTier: SourceTier;
  sourceName: string;
  lastUpdated: string;
  confidence?: number;
  company?: string;
  city?: string;
  country?: string;
  status?: string;
  processNode?: string;
  capacity?: string;
  provider?: string;
  pue?: number;
  powerCapacity?: number;
  yearOperational?: number;
  yearEstablished?: number;
  employees?: number;
  // Internal rendering flags (set during data preparation)
  _highlighted?: boolean;
  _selected?: boolean;
}

/**
 * Main hook that transforms supply chain, foundry, and data center datasets
 * into a unified array of MapPin objects for map rendering.
 * @returns Object containing the pins array, getPinColor helper, and layerColors
 */
export function useMapData() {
  const pins = useMemo<MapPin[]>(() => {
    const supplyPins: MapPin[] = supplyChainData.map((item: DataPoint) => ({
      id: item.id,
      name: item.name,
      layer: item.layer as LayerType,
      lat: item.lat,
      lng: item.lng,
      value: item.value,
      unit: item.unit,
      category: item.category,
      sourceTier: item.sourceTier,
      sourceName: item.sourceName,
      lastUpdated: item.lastUpdated,
      confidence: item.confidence,
    }));

    const foundryPins: MapPin[] = fabricationFacilities.map((item: Facility) => ({
      id: item.id,
      name: item.name,
      layer: item.layer as LayerType,
      lat: item.lat,
      lng: item.lng,
      value: item.capacity || 'N/A',
      company: item.company,
      city: item.city,
      country: item.country,
      status: item.status,
      processNode: item.processNode,
      capacity: item.capacity,
      sourceTier: item.sourceTier,
      sourceName: 'Company Filing',
      lastUpdated: item.lastUpdated,
      yearEstablished: item.yearEstablished,
      employees: item.employees,
    }));

    const dcPins: MapPin[] = dataCenters.map((item: DataCenter) => ({
      id: item.id,
      name: item.name,
      layer: 'datacenter' as LayerType,
      lat: item.lat,
      lng: item.lng,
      value: item.powerCapacity || 0,
      unit: item.powerUnit,
      provider: item.provider,
      city: item.city,
      country: item.country,
      status: item.status,
      pue: item.pue,
      powerCapacity: item.powerCapacity,
      sourceTier: item.sourceTier,
      sourceName: item.provider,
      lastUpdated: item.lastUpdated,
      yearOperational: item.yearOperational,
    }));

    return [...supplyPins, ...foundryPins, ...dcPins];
  }, []);

  const getPinColor = (layer: LayerType): string => LAYER_COLORS[layer];

  return { pins, getPinColor, layerColors: LAYER_COLORS };
}

/**
 * Calculate visual importance (0-1) of a pin for sizing purposes.
 * Supply: based on value magnitude. Foundry: based on company prestige.
 * DataCenter: based on power capacity.
 * @param pin - The map pin to evaluate
 * @returns Importance score from 0 (least) to 1 (most important)
 */
export function getPinImportance(pin: MapPin): number {
  switch (pin.layer) {
    case 'supply':
      if (typeof pin.value === 'number') return Math.min(pin.value / 30000, 1);
      return 0.5;
    case 'foundry':
      return pin.company === 'TSMC' ? 1 : pin.company === 'Samsung Foundry' ? 0.8 : 0.5;
    case 'datacenter':
      return (pin.powerCapacity || 0) > 300 ? 1 : (pin.powerCapacity || 0) > 100 ? 0.7 : 0.4;
    default:
      return 0.5;
  }
}

/**
 * Format a pin's value and unit into a human-readable string.
 * Numbers >= 1000 are displayed with "K" suffix.
 * @param pin - The map pin whose value to format
 * @returns Formatted string like "15.0K tonnes" or "53 EUV units"
 */
export function formatPinValue(pin: MapPin): string {
  if (typeof pin.value === 'number') {
    if (pin.value >= 1000) return `${(pin.value / 1000).toFixed(1)}K ${pin.unit || ''}`;
    return `${pin.value} ${pin.unit || ''}`;
  }
  return `${pin.value} ${pin.unit || ''}`;
}
