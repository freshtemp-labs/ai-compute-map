export type LayerType = 'supply' | 'foundry' | 'datacenter';

export type SourceTier = 1 | 2 | 3;

export interface DataPoint {
  id: string;
  name: string;
  layer: LayerType;
  lat: number;
  lng: number;
  value: string | number;
  unit?: string;
  category: string;
  sourceTier: SourceTier;
  sourceName: string;
  lastUpdated: string;
  confidence?: number;
}

export interface Company {
  id: string;
  name: string;
  ticker?: string;
  country: string;
  layer: LayerType;
  marketShare?: number;
  revenue?: number;
  revenueUnit?: string;
  employees?: number;
  website?: string;
}

export interface Facility {
  id: string;
  name: string;
  company: string;
  lat: number;
  lng: number;
  country: string;
  city: string;
  layer: LayerType;
  type: string;
  status: 'operational' | 'construction' | 'planned' | 'expansion';
  capacity?: string;
  processNode?: string;
  yearEstablished?: number;
  employees?: number;
  sourceTier: SourceTier;
  lastUpdated: string;
}

export interface DataCenter {
  id: string;
  name: string;
  provider: string;
  lat: number;
  lng: number;
  country: string;
  city: string;
  region: string;
  powerCapacity?: number;
  powerUnit?: string;
  pue?: number;
  yearOperational?: number;
  status: 'operational' | 'construction' | 'planned';
  cloudProviders?: string[];
  sourceTier: SourceTier;
  lastUpdated: string;
}

export interface KPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  delta: string;
  deltaType: 'positive' | 'negative' | 'neutral';
  accentColor: string;
  progressPercent: number;
  layer: LayerType;
}

export interface SourceReference {
  id: string;
  name: string;
  tier: SourceTier;
  type: string;
  url?: string;
  lastUpdated: string;
  description?: string;
}

export interface DataCenterEntry {
  id: number;
  name: string;
  provider: string;
  country: string;
  region: string;
  powerMW: number;
  pue: number;
  year: number;
  status: 'Operational' | 'Under Construction' | 'Planned';
  energyMix: string;
  layer: 'dataCenter';
}

export interface SupplyChainEntry {
  id: number;
  name: string;
  type: 'rare-earth' | 'lithography' | 'design' | 'energy';
  country: string;
  keyMetric: string;
  value: string;
  source: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  updated: string;
}

export interface SourceEntry {
  id: number;
  name: string;
  category: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  layer: string;
  dataPoints: number;
  lastUpdated: string;
  status: 'active' | 'pending' | 'stale';
  url?: string;
  description?: string;
}

export interface LayerInfo {
  type: LayerType;
  title: string;
  chineseLabel: string;
  accentColor: string;
  glowGradient: string;
  icon: string;
  description: string;
  dataPointCount: number;
  route: string;
}
