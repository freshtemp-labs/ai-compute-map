import { useMemo } from 'react';
import { supplyChainData, fabricationFacilities, dataCenters } from '@/data/mockData';
import type { DataPoint, Facility, DataCenter, LayerType, SourceTier } from '@/types';

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
}

const LAYER_COLORS: Record<LayerType, string> = {
  supply: '#FFB84D',
  foundry: '#00D4FF',
  datacenter: '#A855F7',
};

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

export function formatPinValue(pin: MapPin): string {
  if (typeof pin.value === 'number') {
    if (pin.value >= 1000) return `${(pin.value / 1000).toFixed(1)}K ${pin.unit || ''}`;
    return `${pin.value} ${pin.unit || ''}`;
  }
  return `${pin.value} ${pin.unit || ''}`;
}
