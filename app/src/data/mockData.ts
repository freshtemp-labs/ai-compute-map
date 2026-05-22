import type { DataPoint, Facility, DataCenter, KPI, SourceReference, LayerInfo, Company, DataCenterEntry, SupplyChainEntry, SourceEntry } from '@/types';
import { useLiveData } from '../hooks/useLiveData';

export { useLiveData };
export { formatRelativeTime, formatTimeUntil } from '../hooks/useLiveData';

export function useDataCentersLive() {
  return useLiveData<any[]>('/data/datacenters.json');
}
export function useFoundriesLive() {
  return useLiveData<any[]>('/data/foundries.json');
}
export function useLithographyLive() {
  return useLiveData<any[]>('/data/lithography.json');
}
export function useRareEarthLive() {
  return useLiveData<any[]>('/data/rare-earth.json');
}
export function useDataMeta() {
  return useLiveData<Record<string, any>>('/data/metadata.json', { intervalMs: 60000 });
}

export const layers: LayerInfo[] = [
  {
    type: 'supply',
    title: 'Supply Chain Layer',
    chineseLabel: '基础层',
    accentColor: '#FFB84D',
    glowGradient: 'radial-gradient(circle, rgba(255,184,77,0.12) 0%, transparent 70%)',
    icon: '/layer-supply-icon.png',
    description: 'Rare earth elements, lithography equipment, and semiconductor design firms. Track production quotas, export controls, energy supply, and policy impacts across 40+ countries.',
    dataPointCount: 27,
    route: '/supply-chain',
  },
  {
    type: 'foundry',
    title: 'Foundry Layer',
    chineseLabel: '封装工厂层',
    accentColor: '#00D4FF',
    glowGradient: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
    icon: '/layer-foundry-icon.png',
    description: 'TSMC, Samsung, Intel, SMIC, and GlobalFoundries. Monitor fab locations, process nodes, capacity utilization, and expansion plans across 6 continents.',
    dataPointCount: 18,
    route: '/foundries',
  },
  {
    type: 'datacenter',
    title: 'Data Center Layer',
    chineseLabel: '算力中心层',
    accentColor: '#A855F7',
    glowGradient: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
    icon: '/layer-datacenter-icon.png',
    description: 'Global AI compute clusters — power consumption, PUE ratings, cloud providers, and capacity forecasts. Covering 200+ facilities with real-time energy metrics.',
    dataPointCount: 200,
    route: '/datacenters',
  },
];

export const kpis: KPI[] = [
  {
    id: 'kpi-1',
    label: 'Global Data Center Power (2025)',
    value: 485.4,
    unit: 'TWh',
    delta: '+94.8% by 2030',
    deltaType: 'positive',
    accentColor: '#A855F7',
    progressPercent: 51,
    layer: 'datacenter',
  },
  {
    id: 'kpi-2',
    label: 'EUV Lithography Units (2024)',
    value: 418,
    unit: 'units',
    delta: 'ASML 61.2% share',
    deltaType: 'neutral',
    accentColor: '#00D4FF',
    progressPercent: 42,
    layer: 'foundry',
  },
  {
    id: 'kpi-3',
    label: 'China Rare Earth Quota',
    value: 270000,
    unit: 'tonnes',
    delta: '+6.36% light RE',
    deltaType: 'positive',
    accentColor: '#FFB84D',
    progressPercent: 65,
    layer: 'supply',
  },
  {
    id: 'kpi-4',
    label: 'TSMC Foundry Revenue',
    value: 90.0,
    unit: '$B',
    delta: '62% market share',
    deltaType: 'positive',
    accentColor: '#00D4FF',
    progressPercent: 62,
    layer: 'foundry',
  },
  {
    id: 'kpi-5',
    label: 'Projected 2030 DC Power',
    value: 945,
    unit: 'TWh',
    delta: 'IEA forecast',
    deltaType: 'neutral',
    accentColor: '#A855F7',
    progressPercent: 78,
    layer: 'datacenter',
  },
];

export const companies: Company[] = [
  { id: 'c1', name: 'ASML Holding', ticker: 'ASML', country: 'Netherlands', layer: 'supply', marketShare: 85.2, revenue: 27.6, revenueUnit: '$B' },
  { id: 'c2', name: 'Applied Materials', ticker: 'AMAT', country: 'USA', layer: 'supply', marketShare: 16.8, revenue: 26.5, revenueUnit: '$B' },
  { id: 'c3', name: 'Lam Research', ticker: 'LRCX', country: 'USA', layer: 'supply', marketShare: 13.2, revenue: 14.7, revenueUnit: '$B' },
  { id: 'c4', name: 'Synopsys', ticker: 'SNPS', country: 'USA', layer: 'supply', marketShare: 32.5, revenue: 5.8, revenueUnit: '$B' },
  { id: 'c5', name: 'Cadence', ticker: 'CDNS', country: 'USA', layer: 'supply', marketShare: 22.1, revenue: 4.0, revenueUnit: '$B' },
  { id: 'c6', name: 'Arm Holdings', ticker: 'ARM', country: 'UK', layer: 'supply', marketShare: 90.0, revenue: 2.9, revenueUnit: '$B' },
  { id: 'c7', name: 'Nikon Precision', country: 'Japan', layer: 'supply', marketShare: 10.5, revenue: 1.8, revenueUnit: '$B' },
  { id: 'c8', name: 'Canon Tokki', country: 'Japan', layer: 'supply', marketShare: 8.2, revenue: 1.2, revenueUnit: '$B' },
  { id: 'c9', name: 'TSMC', ticker: 'TSM', country: 'Taiwan', layer: 'foundry', marketShare: 62.0, revenue: 90.0, revenueUnit: '$B', employees: 73000 },
  { id: 'c10', name: 'Samsung Foundry', ticker: '005930.KS', country: 'South Korea', layer: 'foundry', marketShare: 11.5, revenue: 15.5, revenueUnit: '$B', employees: 45000 },
  { id: 'c11', name: 'Intel Foundry', ticker: 'INTC', country: 'USA', layer: 'foundry', marketShare: 6.8, revenue: 5.2, revenueUnit: '$B', employees: 120000 },
  { id: 'c12', name: 'SMIC', ticker: 'SMICY', country: 'China', layer: 'foundry', marketShare: 5.3, revenue: 7.2, revenueUnit: '$B', employees: 20000 },
  { id: 'c13', name: 'GlobalFoundries', ticker: 'GFS', country: 'USA', layer: 'foundry', marketShare: 5.8, revenue: 8.1, revenueUnit: '$B', employees: 12000 },
  { id: 'c14', name: 'UMC', ticker: 'UMC', country: 'Taiwan', layer: 'foundry', marketShare: 5.5, revenue: 7.8, revenueUnit: '$B', employees: 19000 },
  { id: 'c15', name: 'Amazon Web Services', ticker: 'AMZN', country: 'USA', layer: 'datacenter', marketShare: 32.0, revenue: 90.8, revenueUnit: '$B' },
  { id: 'c16', name: 'Microsoft Azure', ticker: 'MSFT', country: 'USA', layer: 'datacenter', marketShare: 23.0, revenue: 75.3, revenueUnit: '$B' },
  { id: 'c17', name: 'Google Cloud', ticker: 'GOOGL', country: 'USA', layer: 'datacenter', marketShare: 10.0, revenue: 33.1, revenueUnit: '$B' },
  { id: 'c18', name: 'Equinix', ticker: 'EQIX', country: 'USA', layer: 'datacenter', marketShare: 5.2, revenue: 7.2, revenueUnit: '$B' },
  { id: 'c19', name: 'Digital Realty', ticker: 'DLR', country: 'USA', layer: 'datacenter', marketShare: 3.8, revenue: 5.5, revenueUnit: '$B' },
  { id: 'c20', name: 'NTT Global', country: 'Japan', layer: 'datacenter', marketShare: 3.5, revenue: 4.8, revenueUnit: '$B' },
];

export const supplyChainData: DataPoint[] = [
  // Rare Earth Mines
  { id: 'sc1', name: 'Bayan Obo Mine', layer: 'supply', lat: 41.7667, lng: 109.9833, value: 48000, unit: 'tonnes RE', category: 'Rare Earth Mine', sourceTier: 1, sourceName: 'USGS Mineral Commodity Summaries', lastUpdated: '2024-01-15', confidence: 0.95 },
  { id: 'sc2', name: 'Mountain Pass Mine', layer: 'supply', lat: 35.4667, lng: -115.5333, value: 42000, unit: 'tonnes RE', category: 'Rare Earth Mine', sourceTier: 1, sourceName: 'MP Materials Annual Report', lastUpdated: '2024-03-22', confidence: 0.92 },
  { id: 'sc3', name: 'Mount Weld Mine', layer: 'supply', lat: -28.7667, lng: 122.2667, value: 25000, unit: 'tonnes RE', category: 'Rare Earth Mine', sourceTier: 1, sourceName: 'Lynas Annual Report', lastUpdated: '2024-02-10', confidence: 0.90 },
  { id: 'sc4', name: 'Shenghe Resources (Sichuan)', layer: 'supply', lat: 27.8500, lng: 102.2500, value: 15000, unit: 'tonnes RE', category: 'Rare Earth Mine', sourceTier: 2, sourceName: 'TrendForce', lastUpdated: '2024-04-01', confidence: 0.78 },
  { id: 'sc5', name: 'Northern Minerals Browns Range', layer: 'supply', lat: -19.0333, lng: 127.7333, value: 5600, unit: 'tonnes RE', category: 'Rare Earth Mine', sourceTier: 2, sourceName: 'Geoscience Australia', lastUpdated: '2024-01-30', confidence: 0.72 },
  { id: 'sc6', name: 'Rainbow Rare Earths Gakara', layer: 'supply', lat: -3.1333, lng: 29.7667, value: 5000, unit: 'tonnes RE', category: 'Rare Earth Mine', sourceTier: 2, sourceName: 'Company Disclosure', lastUpdated: '2024-02-15', confidence: 0.70 },
  { id: 'sc7', name: 'Vital Metals Nechalacho', layer: 'supply', lat: 62.6833, lng: -113.6333, value: 10000, unit: 'tonnes RE', category: 'Rare Earth Mine', sourceTier: 2, sourceName: 'Vital Metals Disclosure', lastUpdated: '2024-03-05', confidence: 0.75 },
  { id: 'sc8', name: 'Pensana Rare Earths (Angola)', layer: 'supply', lat: -8.5000, lng: 13.5000, value: 8000, unit: 'tonnes RE', category: 'Rare Earth Mine', sourceTier: 3, sourceName: 'Company Estimate', lastUpdated: '2024-01-20', confidence: 0.60 },
  // Lithography Companies
  { id: 'sc9', name: 'ASML HQ (Veldhoven)', layer: 'supply', lat: 51.4167, lng: 5.3833, value: 256, unit: 'EUV units shipped', category: 'Lithography', sourceTier: 1, sourceName: 'ASML Annual Report 2024', lastUpdated: '2024-02-14', confidence: 0.98 },
  { id: 'sc10', name: 'ASML San Diego', layer: 'supply', lat: 32.7157, lng: -117.1611, value: 45, unit: 'DUV units', category: 'Lithography', sourceTier: 1, sourceName: 'ASML Annual Report 2024', lastUpdated: '2024-02-14', confidence: 0.92 },
  { id: 'sc11', name: 'Nikon Precision Equipment', layer: 'supply', lat: 35.7333, lng: 139.6833, value: 28, unit: 'ArF units', category: 'Lithography', sourceTier: 2, sourceName: 'Nikon Financial Report', lastUpdated: '2024-01-25', confidence: 0.82 },
  { id: 'sc12', name: 'Canon Semiconductor Equipment', layer: 'supply', lat: 35.6500, lng: 139.7000, value: 35, unit: 'i-line units', category: 'Lithography', sourceTier: 2, sourceName: 'Canon Annual Report', lastUpdated: '2024-03-01', confidence: 0.80 },
  { id: 'sc13', name: 'Applied Materials Santa Clara', layer: 'supply', lat: 37.3541, lng: -121.9552, value: 15600, unit: 'process systems', category: 'Deposition/Etch', sourceTier: 1, sourceName: 'Applied Materials 10-K', lastUpdated: '2024-02-28', confidence: 0.95 },
  { id: 'sc14', name: 'Lam Research Fremont', layer: 'supply', lat: 37.5483, lng: -121.9886, value: 8900, unit: 'etch units', category: 'Etch Equipment', sourceTier: 1, sourceName: 'Lam Research 10-K', lastUpdated: '2024-03-15', confidence: 0.93 },
  { id: 'sc15', name: 'KLA Corporation Milpitas', layer: 'supply', lat: 37.4344, lng: -121.9015, value: 5200, unit: 'inspection units', category: 'Metrology', sourceTier: 1, sourceName: 'KLA Annual Report', lastUpdated: '2024-02-20', confidence: 0.94 },
  { id: 'sc16', name: 'TEL Tokyo Electron', layer: 'supply', lat: 35.6500, lng: 139.7000, value: 12500, unit: 'process units', category: 'Deposition/Coater', sourceTier: 1, sourceName: 'TEL Annual Report', lastUpdated: '2024-01-18', confidence: 0.92 },
  // Design Firms
  { id: 'sc17', name: 'Synopsys Mountain View', layer: 'supply', lat: 37.3861, lng: -122.0839, value: 5800, unit: 'EDA licenses', category: 'EDA Software', sourceTier: 1, sourceName: 'Synopsys 10-K', lastUpdated: '2024-02-22', confidence: 0.95 },
  { id: 'sc18', name: 'Cadence San Jose', layer: 'supply', lat: 37.3382, lng: -121.8863, value: 4000, unit: 'EDA licenses', category: 'EDA Software', sourceTier: 1, sourceName: 'Cadence 10-K', lastUpdated: '2024-03-10', confidence: 0.94 },
  { id: 'sc19', name: 'Siemens EDA (Mentor)', layer: 'supply', lat: 45.5152, lng: -122.6784, value: 2100, unit: 'EDA licenses', category: 'EDA Software', sourceTier: 2, sourceName: 'Siemens Annual Report', lastUpdated: '2024-01-28', confidence: 0.85 },
  { id: 'sc20', name: 'Ansys Canonsburg', layer: 'supply', lat: 40.2667, lng: -80.1667, value: 890, unit: 'simulation licenses', category: 'Simulation Software', sourceTier: 2, sourceName: 'Ansys Annual Report', lastUpdated: '2024-02-05', confidence: 0.83 },
  // IP & Architecture
  { id: 'sc21', name: 'Arm Holdings Cambridge', layer: 'supply', lat: 52.2053, lng: 0.1218, value: 290, unit: 'B chips shipped', category: 'IP Architecture', sourceTier: 1, sourceName: 'Arm IPO Filing', lastUpdated: '2024-03-01', confidence: 0.96 },
  { id: 'sc22', name: 'Imagination Technologies', layer: 'supply', lat: 51.5074, lng: -0.1278, value: 8000, unit: 'IP licenses', category: 'GPU IP', sourceTier: 2, sourceName: 'Company Disclosure', lastUpdated: '2024-01-15', confidence: 0.75 },
  { id: 'sc23', name: 'CEVA San Jose', layer: 'supply', lat: 37.3360, lng: -121.8900, value: 3500, unit: 'DSP licenses', category: 'DSP IP', sourceTier: 2, sourceName: 'CEVA Annual Report', lastUpdated: '2024-02-18', confidence: 0.78 },
  { id: 'sc24', name: 'RISC-V International', layer: 'supply', lat: 37.4419, lng: -122.1430, value: 15000, unit: 'members', category: 'Open ISA', sourceTier: 2, sourceName: 'RISC-V International', lastUpdated: '2024-03-20', confidence: 0.88 },
  // Photoresist & Materials
  { id: 'sc25', name: 'JSR Micro (Tokyo)', layer: 'supply', lat: 35.6333, lng: 139.7833, value: 12000, unit: 'tonnes resist', category: 'Photoresist', sourceTier: 1, sourceName: 'JSR Annual Report', lastUpdated: '2024-01-22', confidence: 0.88 },
  { id: 'sc26', name: 'Tokyo Ohka Kogyo', layer: 'supply', lat: 35.7167, lng: 139.5000, value: 8500, unit: 'tonnes resist', category: 'Photoresist', sourceTier: 1, sourceName: 'TOK Annual Report', lastUpdated: '2024-02-08', confidence: 0.86 },
  { id: 'sc27', name: 'Shin-Etsu Chemical', layer: 'supply', lat: 36.6500, lng: 138.1833, value: 28000, unit: 'tonnes wafers', category: 'Silicon Wafers', sourceTier: 1, sourceName: 'Shin-Etsu Annual Report', lastUpdated: '2024-03-12', confidence: 0.91 },
  { id: 'sc28', name: 'SUMCO Tokyo', layer: 'supply', lat: 35.6586, lng: 139.7454, value: 22000, unit: 'tonnes wafers', category: 'Silicon Wafers', sourceTier: 1, sourceName: 'SUMCO Annual Report', lastUpdated: '2024-02-25', confidence: 0.90 },
  { id: 'sc29', name: 'Siltronic (Wacker)', layer: 'supply', lat: 48.3667, lng: 11.7833, value: 15000, unit: 'tonnes wafers', category: 'Silicon Wafers', sourceTier: 1, sourceName: 'Wacker Annual Report', lastUpdated: '2024-01-30', confidence: 0.89 },
  { id: 'sc30', name: 'GlobalWafers', layer: 'supply', lat: 24.9667, lng: 121.5167, value: 18000, unit: 'tonnes wafers', category: 'Silicon Wafers', sourceTier: 1, sourceName: 'GlobalWafers Annual Report', lastUpdated: '2024-03-05', confidence: 0.88 },
  // Process Chemicals
  { id: 'sc31', name: 'Entegris Billerica', layer: 'supply', lat: 42.5584, lng: -71.2690, value: 4500, unit: 'tonnes chemicals', category: 'Process Chemicals', sourceTier: 2, sourceName: 'Entegris 10-K', lastUpdated: '2024-02-14', confidence: 0.82 },
  { id: 'sc32', name: 'Merck KGaA (Darmstadt)', layer: 'supply', lat: 49.8728, lng: 8.6512, value: 8000, unit: 'tonnes chemicals', category: 'Electronic Materials', sourceTier: 1, sourceName: 'Merck Annual Report', lastUpdated: '2024-01-20', confidence: 0.90 },
  { id: 'sc33', name: 'DuPont Wilmington', layer: 'supply', lat: 39.7391, lng: -75.5398, value: 6200, unit: 'tonnes chemicals', category: 'Electronic Materials', sourceTier: 1, sourceName: 'DuPont 10-K', lastUpdated: '2024-03-08', confidence: 0.88 },
  { id: 'sc34', name: 'Air Liquide (Paris)', layer: 'supply', lat: 48.8566, lng: 2.3522, value: 15000, unit: 'm3 gases', category: 'Process Gases', sourceTier: 1, sourceName: 'Air Liquide Annual Report', lastUpdated: '2024-02-28', confidence: 0.91 },
  { id: 'sc35', name: 'Linde plc (Dublin)', layer: 'supply', lat: 53.3498, lng: -6.2603, value: 12000, unit: 'm3 gases', category: 'Process Gases', sourceTier: 1, sourceName: 'Linde Annual Report', lastUpdated: '2024-03-15', confidence: 0.90 },
  // Substrate & Advanced Packaging
  { id: 'sc36', name: 'Ibiden Ogaki', layer: 'supply', lat: 35.3500, lng: 136.6167, value: 8500, unit: 'substrate units', category: 'IC Substrates', sourceTier: 2, sourceName: 'Ibiden Annual Report', lastUpdated: '2024-01-18', confidence: 0.80 },
  { id: 'sc37', name: 'Shinko Electric (Nagano)', layer: 'supply', lat: 36.6500, lng: 138.1833, value: 7200, unit: 'substrate units', category: 'IC Substrates', sourceTier: 2, sourceName: 'Shinko Annual Report', lastUpdated: '2024-02-22', confidence: 0.79 },
  { id: 'sc38', name: 'Unimicron (Taoyuan)', layer: 'supply', lat: 24.9500, lng: 121.2167, value: 9500, unit: 'substrate units', category: 'IC Substrates', sourceTier: 2, sourceName: 'Unimicron Disclosure', lastUpdated: '2024-03-01', confidence: 0.76 },
  { id: 'sc39', name: 'ASE Kaohsiung', layer: 'supply', lat: 22.6273, lng: 120.3014, value: 12000, unit: 'WLP units', category: 'Advanced Packaging', sourceTier: 1, sourceName: 'ASE Annual Report', lastUpdated: '2024-03-10', confidence: 0.88 },
  { id: 'sc40', name: 'Amkor Chandler AZ', layer: 'supply', lat: 33.3062, lng: -111.8413, value: 15000, unit: 'package units', category: 'OSAT', sourceTier: 1, sourceName: 'Amkor 10-K', lastUpdated: '2024-02-18', confidence: 0.90 },
];

export const fabricationFacilities: Facility[] = [
  // TSMC
  { id: 'f1', name: 'Fab 12 (Gigafab)', company: 'TSMC', lat: 24.9714, lng: 121.0043, country: 'Taiwan', city: 'Hsinchu', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '240K WPM', processNode: '3nm-28nm', yearEstablished: 2000, employees: 18000, sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'f2', name: 'Fab 14 (Tainan Gigafab)', company: 'TSMC', lat: 23.0789, lng: 120.2555, country: 'Taiwan', city: 'Tainan', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '180K WPM', processNode: '3nm-7nm', yearEstablished: 2014, employees: 12000, sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'f3', name: 'Fab 15 (Taichung Gigafab)', company: 'TSMC', lat: 24.2332, lng: 120.7331, country: 'Taiwan', city: 'Taichung', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '200K WPM', processNode: '5nm-28nm', yearEstablished: 2016, employees: 15000, sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'f4', name: 'Fab 18 (Nanhai)', company: 'TSMC', lat: 22.8383, lng: 120.2150, country: 'Taiwan', city: 'Kaohsiung', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '120K WPM', processNode: '2nm-3nm', yearEstablished: 2022, employees: 8000, sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'f5', name: 'TSMC Arizona Fab 21', company: 'TSMC', lat: 33.0581, lng: -111.9719, country: 'USA', city: 'Phoenix', layer: 'foundry', type: '300mm Fab', status: 'construction', capacity: '60K WPM', processNode: '3nm-4nm', yearEstablished: 2025, employees: 3000, sourceTier: 1, lastUpdated: '2024-02-28' },
  { id: 'f6', name: 'TSMC Kumamoto (JASM)', company: 'TSMC', lat: 32.8031, lng: 130.7079, country: 'Japan', city: 'Kumamoto', layer: 'foundry', type: '300mm Fab', status: 'construction', capacity: '55K WPM', processNode: '12nm-28nm', yearEstablished: 2024, employees: 2500, sourceTier: 1, lastUpdated: '2024-03-01' },
  { id: 'f7', name: 'TSMC Dresden (ESMC)', company: 'TSMC', lat: 51.0504, lng: 13.7373, country: 'Germany', city: 'Dresden', layer: 'foundry', type: '300mm Fab', status: 'planned', capacity: '40K WPM', processNode: '22nm-28nm', yearEstablished: 2027, employees: 2000, sourceTier: 2, lastUpdated: '2024-01-20' },
  // Samsung
  { id: 'f8', name: 'S1 Line (Giheung)', company: 'Samsung Foundry', lat: 37.3000, lng: 127.1500, country: 'South Korea', city: 'Giheung', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '100K WPM', processNode: '8nm-14nm', yearEstablished: 2005, employees: 8000, sourceTier: 1, lastUpdated: '2024-03-10' },
  { id: 'f9', name: 'S3 Line (Austin)', company: 'Samsung Foundry', lat: 30.2672, lng: -97.7431, country: 'USA', city: 'Austin', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '45K WPM', processNode: '14nm-65nm', yearEstablished: 2011, employees: 3500, sourceTier: 1, lastUpdated: '2024-03-10' },
  { id: 'f10', name: 'S5 Line (Hwaseong/Pyeongtaek)', company: 'Samsung Foundry', lat: 37.2000, lng: 126.8000, country: 'South Korea', city: 'Hwaseong', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '160K WPM', processNode: '3nm-7nm', yearEstablished: 2017, employees: 15000, sourceTier: 1, lastUpdated: '2024-03-10' },
  { id: 'f11', name: 'Samsung Taylor TX', company: 'Samsung Foundry', lat: 30.5693, lng: -97.4097, country: 'USA', city: 'Taylor', layer: 'foundry', type: '300mm Fab', status: 'construction', capacity: '65K WPM', processNode: '2nm-3nm', yearEstablished: 2025, employees: 4000, sourceTier: 1, lastUpdated: '2024-02-15' },
  // Intel
  { id: 'f12', name: 'D1X (Ronler Acres)', company: 'Intel Foundry', lat: 45.5152, lng: -122.6784, country: 'USA', city: 'Hillsboro', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '80K WPM', processNode: 'Intel 18A/20A', yearEstablished: 2011, employees: 10000, sourceTier: 1, lastUpdated: '2024-03-12' },
  { id: 'f13', name: 'Intel Ocotillo', company: 'Intel Foundry', lat: 33.3062, lng: -111.8413, country: 'USA', city: 'Chandler', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '60K WPM', processNode: 'Intel 3/4', yearEstablished: 2020, employees: 8000, sourceTier: 1, lastUpdated: '2024-03-12' },
  { id: 'f14', name: 'Intel Leixlip (Fab 34)', company: 'Intel Foundry', lat: 53.3500, lng: -6.5000, country: 'Ireland', city: 'Leixlip', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '50K WPM', processNode: 'Intel 4/3', yearEstablished: 2022, employees: 5000, sourceTier: 1, lastUpdated: '2024-03-12' },
  { id: 'f15', name: 'Intel Magdeburg', company: 'Intel Foundry', lat: 52.1277, lng: 11.6294, country: 'Germany', city: 'Magdeburg', layer: 'foundry', type: '300mm Fab', status: 'planned', capacity: '70K WPM', processNode: 'Intel 14A', yearEstablished: 2027, employees: 3000, sourceTier: 2, lastUpdated: '2024-01-15' },
  { id: 'f16', name: 'Intel Fab 52/62 (Chandler)', company: 'Intel Foundry', lat: 33.3062, lng: -111.8413, country: 'USA', city: 'Chandler', layer: 'foundry', type: '300mm Fab', status: 'construction', capacity: '55K WPM', processNode: 'Intel 18A', yearEstablished: 2025, employees: 2500, sourceTier: 1, lastUpdated: '2024-02-20' },
  // SMIC
  { id: 'f17', name: 'SMIC Beijing (B1)', company: 'SMIC', lat: 39.9042, lng: 116.4074, country: 'China', city: 'Beijing', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '90K WPM', processNode: '14nm-90nm', yearEstablished: 2004, employees: 6000, sourceTier: 1, lastUpdated: '2024-03-08' },
  { id: 'f18', name: 'SMIC Shanghai (SN1)', company: 'SMIC', lat: 31.2304, lng: 121.4737, country: 'China', city: 'Shanghai', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '70K WPM', processNode: '7nm-28nm', yearEstablished: 2012, employees: 5000, sourceTier: 1, lastUpdated: '2024-03-08' },
  { id: 'f19', name: 'SMIC Shenzhen', company: 'SMIC', lat: 22.5431, lng: 114.0579, country: 'China', city: 'Shenzhen', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '48K WPM', processNode: '28nm-65nm', yearEstablished: 2021, employees: 3500, sourceTier: 2, lastUpdated: '2024-03-08' },
  // GlobalFoundries
  { id: 'f20', name: 'GF Fab 8 (Malta)', company: 'GlobalFoundries', lat: 42.9833, lng: -73.8500, country: 'USA', city: 'Malta', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '60K WPM', processNode: '12nm-45nm', yearEstablished: 2012, employees: 3500, sourceTier: 1, lastUpdated: '2024-03-05' },
  { id: 'f21', name: 'GF Fab 1 (Dresden)', company: 'GlobalFoundries', lat: 51.0504, lng: 13.7373, country: 'Germany', city: 'Dresden', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '75K WPM', processNode: '22nm-45nm', yearEstablished: 1998, employees: 4000, sourceTier: 1, lastUpdated: '2024-03-05' },
  { id: 'f22', name: 'GF Singapore (Woodlands)', company: 'GlobalFoundries', lat: 1.4400, lng: 103.7900, country: 'Singapore', city: 'Singapore', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '50K WPM', processNode: '40nm-180nm', yearEstablished: 2010, employees: 3000, sourceTier: 1, lastUpdated: '2024-03-05' },
  // UMC
  { id: 'f23', name: 'Fab 12A (Tainan)', company: 'UMC', lat: 22.9997, lng: 120.2270, country: 'Taiwan', city: 'Tainan', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '85K WPM', processNode: '14nm-28nm', yearEstablished: 2002, employees: 5000, sourceTier: 1, lastUpdated: '2024-02-28' },
  { id: 'f24', name: 'Fab 12i (Singapore)', company: 'UMC', lat: 1.3644, lng: 103.9915, country: 'Singapore', city: 'Singapore', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '55K WPM', processNode: '28nm-65nm', yearEstablished: 2003, employees: 2800, sourceTier: 1, lastUpdated: '2024-02-28' },
  // Others
  { id: 'f25', name: 'Tower Semiconductor Migdal HaEmek', company: 'Tower Semiconductor', lat: 32.6720, lng: 35.2340, country: 'Israel', city: 'Migdal HaEmek', layer: 'foundry', type: '200mm Fab', status: 'operational', capacity: '30K WPM', processNode: '65nm-1um', yearEstablished: 1993, employees: 2500, sourceTier: 1, lastUpdated: '2024-02-15' },
  { id: 'f26', name: 'PSMC Hsinchu', company: 'Powerchip (PSMC)', lat: 24.9000, lng: 121.0000, country: 'Taiwan', city: 'Hsinchu', layer: 'foundry', type: '300mm Fab', status: 'operational', capacity: '40K WPM', processNode: '25nm-90nm', yearEstablished: 2008, employees: 3500, sourceTier: 2, lastUpdated: '2024-01-25' },
  { id: 'f27', name: 'Vanguard Tainan', company: 'Vanguard International', lat: 22.9997, lng: 120.2270, country: 'Taiwan', city: 'Tainan', layer: 'foundry', type: '200mm Fab', status: 'operational', capacity: '35K WPM', processNode: '90nm-1um', yearEstablished: 1994, employees: 3000, sourceTier: 2, lastUpdated: '2024-01-20' },
];

export const dataCenters: DataCenter[] = [
  // North America
  { id: 'dc1', name: 'AWS US-East-1 (N. Virginia)', provider: 'Amazon Web Services', lat: 38.9517, lng: -77.4481, country: 'USA', city: 'Ashburn', region: 'North America', powerCapacity: 1200, powerUnit: 'MW', pue: 1.15, yearOperational: 2006, status: 'operational', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'dc2', name: 'AWS US-West-2 (Oregon)', provider: 'Amazon Web Services', lat: 45.5898, lng: -122.5951, country: 'USA', city: 'Boardman', region: 'North America', powerCapacity: 850, powerUnit: 'MW', pue: 1.12, yearOperational: 2011, status: 'operational', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'dc3', name: 'Microsoft Quincy (Columbia Basin)', provider: 'Microsoft Azure', lat: 46.2350, lng: -119.8532, country: 'USA', city: 'Quincy', region: 'North America', powerCapacity: 600, powerUnit: 'MW', pue: 1.16, yearOperational: 2007, status: 'operational', cloudProviders: ['Azure'], sourceTier: 1, lastUpdated: '2024-03-10' },
  { id: 'dc4', name: 'Google Council Bluffs', provider: 'Google Cloud', lat: 41.2619, lng: -95.8608, country: 'USA', city: 'Council Bluffs', region: 'North America', powerCapacity: 350, powerUnit: 'MW', pue: 1.11, yearOperational: 2009, status: 'operational', cloudProviders: ['Google Cloud'], sourceTier: 1, lastUpdated: '2024-02-28' },
  { id: 'dc5', name: 'Meta Prineville', provider: 'Meta', lat: 44.2999, lng: -120.8345, country: 'USA', city: 'Prineville', region: 'North America', powerCapacity: 350, powerUnit: 'MW', pue: 1.09, yearOperational: 2011, status: 'operational', cloudProviders: ['Meta'], sourceTier: 1, lastUpdated: '2024-03-01' },
  { id: 'dc6', name: 'CoreSite VA1 (Reston)', provider: 'CoreSite', lat: 38.9586, lng: -77.3570, country: 'USA', city: 'Reston', region: 'North America', powerCapacity: 50, powerUnit: 'MW', pue: 1.25, yearOperational: 2012, status: 'operational', cloudProviders: ['AWS', 'Azure', 'Google Cloud'], sourceTier: 2, lastUpdated: '2024-02-15' },
  { id: 'dc7', name: 'Equinix DC2 (Ashburn)', provider: 'Equinix', lat: 39.0438, lng: -77.4874, country: 'USA', city: 'Ashburn', region: 'North America', powerCapacity: 40, powerUnit: 'MW', pue: 1.35, yearOperational: 2001, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 1, lastUpdated: '2024-03-05' },
  { id: 'dc8', name: 'Digital Realty Dallas (DFW1)', provider: 'Digital Realty', lat: 32.7767, lng: -96.7970, country: 'USA', city: 'Dallas', region: 'North America', powerCapacity: 120, powerUnit: 'MW', pue: 1.22, yearOperational: 2007, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 1, lastUpdated: '2024-02-20' },
  { id: 'dc9', name: 'xAI Colossus (Memphis)', provider: 'xAI', lat: 35.1495, lng: -90.0490, country: 'USA', city: 'Memphis', region: 'North America', powerCapacity: 150, powerUnit: 'MW', pue: 1.18, yearOperational: 2024, status: 'operational', cloudProviders: ['xAI'], sourceTier: 2, lastUpdated: '2024-03-20' },
  { id: 'dc10', name: 'AWS Montreal', provider: 'Amazon Web Services', lat: 45.5017, lng: -73.5673, country: 'Canada', city: 'Montreal', region: 'North America', powerCapacity: 180, powerUnit: 'MW', pue: 1.13, yearOperational: 2016, status: 'operational', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  // Europe
  { id: 'dc11', name: 'Google St. Ghislain', provider: 'Google Cloud', lat: 50.4712, lng: 3.8252, country: 'Belgium', city: 'St. Ghislain', region: 'Europe', powerCapacity: 350, powerUnit: 'MW', pue: 1.08, yearOperational: 2009, status: 'operational', cloudProviders: ['Google Cloud'], sourceTier: 1, lastUpdated: '2024-03-10' },
  { id: 'dc12', name: 'Microsoft Dublin', provider: 'Microsoft Azure', lat: 53.3498, lng: -6.2603, country: 'Ireland', city: 'Dublin', region: 'Europe', powerCapacity: 300, powerUnit: 'MW', pue: 1.14, yearOperational: 2009, status: 'operational', cloudProviders: ['Azure'], sourceTier: 1, lastUpdated: '2024-02-25' },
  { id: 'dc13', name: 'AWS Frankfurt', provider: 'Amazon Web Services', lat: 50.1109, lng: 8.6821, country: 'Germany', city: 'Frankfurt', region: 'Europe', powerCapacity: 380, powerUnit: 'MW', pue: 1.16, yearOperational: 2014, status: 'operational', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'dc14', name: 'OVHcloud Gravelines', provider: 'OVHcloud', lat: 50.9861, lng: 2.1273, country: 'France', city: 'Gravelines', region: 'Europe', powerCapacity: 120, powerUnit: 'MW', pue: 1.28, yearOperational: 2003, status: 'operational', cloudProviders: ['OVHcloud'], sourceTier: 2, lastUpdated: '2024-01-15' },
  { id: 'dc15', name: 'Equinix AM3 (Amsterdam)', provider: 'Equinix', lat: 52.3676, lng: 4.9041, country: 'Netherlands', city: 'Amsterdam', region: 'Europe', powerCapacity: 35, powerUnit: 'MW', pue: 1.30, yearOperational: 2003, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 1, lastUpdated: '2024-03-05' },
  { id: 'dc16', name: 'Digital Realty Amsterdam (AMS1)', provider: 'Digital Realty', lat: 52.3060, lng: 4.9410, country: 'Netherlands', city: 'Amsterdam', region: 'Europe', powerCapacity: 80, powerUnit: 'MW', pue: 1.25, yearOperational: 2010, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 1, lastUpdated: '2024-02-20' },
  { id: 'dc17', name: 'Google Hamina', provider: 'Google Cloud', lat: 60.5693, lng: 27.1878, country: 'Finland', city: 'Hamina', region: 'Europe', powerCapacity: 250, powerUnit: 'MW', pue: 1.09, yearOperational: 2011, status: 'operational', cloudProviders: ['Google Cloud'], sourceTier: 1, lastUpdated: '2024-02-28' },
  { id: 'dc18', name: 'Meta Clonee', provider: 'Meta', lat: 53.5162, lng: -6.2580, country: 'Ireland', city: 'Clonee', region: 'Europe', powerCapacity: 200, powerUnit: 'MW', pue: 1.10, yearOperational: 2018, status: 'operational', cloudProviders: ['Meta'], sourceTier: 1, lastUpdated: '2024-03-01' },
  // Asia Pacific
  { id: 'dc19', name: 'AWS Singapore (ap-southeast-1)', provider: 'Amazon Web Services', lat: 1.3521, lng: 103.8198, country: 'Singapore', city: 'Singapore', region: 'Asia Pacific', powerCapacity: 150, powerUnit: 'MW', pue: 1.20, yearOperational: 2010, status: 'operational', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'dc20', name: 'AWS Tokyo (ap-northeast-1)', provider: 'Amazon Web Services', lat: 35.6762, lng: 139.6503, country: 'Japan', city: 'Tokyo', region: 'Asia Pacific', powerCapacity: 220, powerUnit: 'MW', pue: 1.18, yearOperational: 2011, status: 'operational', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'dc21', name: 'Microsoft Hong Kong', provider: 'Microsoft Azure', lat: 22.3193, lng: 114.1694, country: 'Hong Kong', city: 'Hong Kong', region: 'Asia Pacific', powerCapacity: 40, powerUnit: 'MW', pue: 1.45, yearOperational: 2014, status: 'operational', cloudProviders: ['Azure'], sourceTier: 1, lastUpdated: '2024-02-25' },
  { id: 'dc22', name: 'Alibaba Cloud Zhangjiakou', provider: 'Alibaba Cloud', lat: 40.7676, lng: 114.8863, country: 'China', city: 'Zhangjiakou', region: 'Asia Pacific', powerCapacity: 300, powerUnit: 'MW', pue: 1.15, yearOperational: 2018, status: 'operational', cloudProviders: ['Alibaba Cloud'], sourceTier: 2, lastUpdated: '2024-03-08' },
  { id: 'dc23', name: 'Tencent Cloud Gui\'an', provider: 'Tencent Cloud', lat: 26.0451, lng: 106.4549, country: 'China', city: 'Gui\'an', region: 'Asia Pacific', powerCapacity: 200, powerUnit: 'MW', pue: 1.20, yearOperational: 2019, status: 'operational', cloudProviders: ['Tencent Cloud'], sourceTier: 2, lastUpdated: '2024-03-08' },
  { id: 'dc24', name: 'ByteDance Malaysia', provider: 'ByteDance', lat: 2.9286, lng: 101.6781, country: 'Malaysia', city: 'Kuala Lumpur', region: 'Asia Pacific', powerCapacity: 80, powerUnit: 'MW', pue: 1.22, yearOperational: 2023, status: 'operational', cloudProviders: ['ByteDance'], sourceTier: 2, lastUpdated: '2024-03-20' },
  { id: 'dc25', name: 'Google Jurong West', provider: 'Google Cloud', lat: 1.3404, lng: 103.7090, country: 'Singapore', city: 'Singapore', region: 'Asia Pacific', powerCapacity: 200, powerUnit: 'MW', pue: 1.10, yearOperational: 2017, status: 'operational', cloudProviders: ['Google Cloud'], sourceTier: 1, lastUpdated: '2024-02-28' },
  { id: 'dc26', name: 'Microsoft Hyderabad', provider: 'Microsoft Azure', lat: 17.3850, lng: 78.4867, country: 'India', city: 'Hyderabad', region: 'Asia Pacific', powerCapacity: 120, powerUnit: 'MW', pue: 1.18, yearOperational: 2021, status: 'operational', cloudProviders: ['Azure'], sourceTier: 1, lastUpdated: '2024-02-25' },
  { id: 'dc27', name: 'AWS Sydney', provider: 'Amazon Web Services', lat: -33.8688, lng: 151.2093, country: 'Australia', city: 'Sydney', region: 'Asia Pacific', powerCapacity: 180, powerUnit: 'MW', pue: 1.17, yearOperational: 2012, status: 'operational', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'dc28', name: 'NTT East Tokyo (Fuchu)', provider: 'NTT', lat: 35.6684, lng: 139.4766, country: 'Japan', city: 'Tokyo', region: 'Asia Pacific', powerCapacity: 60, powerUnit: 'MW', pue: 1.45, yearOperational: 2005, status: 'operational', cloudProviders: ['NTT'], sourceTier: 1, lastUpdated: '2024-01-20' },
  { id: 'dc29', name: 'Equinix TY2 (Tokyo)', provider: 'Equinix', lat: 35.6185, lng: 139.7034, country: 'Japan', city: 'Tokyo', region: 'Asia Pacific', powerCapacity: 25, powerUnit: 'MW', pue: 1.35, yearOperational: 2002, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 1, lastUpdated: '2024-03-05' },
  { id: 'dc30', name: 'Digital Realty Singapore (SIN1)', provider: 'Digital Realty', lat: 1.2966, lng: 103.7764, country: 'Singapore', city: 'Singapore', region: 'Asia Pacific', powerCapacity: 45, powerUnit: 'MW', pue: 1.30, yearOperational: 2012, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 1, lastUpdated: '2024-02-20' },
  // Middle East & Africa
  { id: 'dc31', name: 'AWS Bahrain', provider: 'Amazon Web Services', lat: 26.0667, lng: 50.5577, country: 'Bahrain', city: 'Manama', region: 'Middle East', powerCapacity: 60, powerUnit: 'MW', pue: 1.25, yearOperational: 2019, status: 'operational', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'dc32', name: 'Oracle Jeddah', provider: 'Oracle Cloud', lat: 21.4858, lng: 39.1925, country: 'Saudi Arabia', city: 'Jeddah', region: 'Middle East', powerCapacity: 40, powerUnit: 'MW', pue: 1.22, yearOperational: 2022, status: 'operational', cloudProviders: ['Oracle Cloud'], sourceTier: 1, lastUpdated: '2024-02-15' },
  { id: 'dc33', name: 'Microsoft Doha', provider: 'Microsoft Azure', lat: 25.2854, lng: 51.5310, country: 'Qatar', city: 'Doha', region: 'Middle East', powerCapacity: 35, powerUnit: 'MW', pue: 1.28, yearOperational: 2022, status: 'operational', cloudProviders: ['Azure'], sourceTier: 1, lastUpdated: '2024-02-25' },
  { id: 'dc34', name: 'Raxio Kampala', provider: 'Raxio', lat: 0.3136, lng: 32.5811, country: 'Uganda', city: 'Kampala', region: 'Africa', powerCapacity: 2, powerUnit: 'MW', pue: 1.50, yearOperational: 2023, status: 'operational', cloudProviders: ['Local'], sourceTier: 2, lastUpdated: '2024-01-15' },
  // South America
  { id: 'dc35', name: 'AWS Sao Paulo', provider: 'Amazon Web Services', lat: -23.5505, lng: -46.6333, country: 'Brazil', city: 'Sao Paulo', region: 'South America', powerCapacity: 100, powerUnit: 'MW', pue: 1.24, yearOperational: 2016, status: 'operational', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'dc36', name: 'Google Santiago', provider: 'Google Cloud', lat: -33.4489, lng: -70.6693, country: 'Chile', city: 'Santiago', region: 'South America', powerCapacity: 40, powerUnit: 'MW', pue: 1.12, yearOperational: 2021, status: 'operational', cloudProviders: ['Google Cloud'], sourceTier: 1, lastUpdated: '2024-02-28' },
  // New/Planned
  { id: 'dc37', name: 'Microsoft Boydton Expansion', provider: 'Microsoft Azure', lat: 36.6676, lng: -78.3875, country: 'USA', city: 'Boydton', region: 'North America', powerCapacity: 500, powerUnit: 'MW', pue: 1.12, yearOperational: 2026, status: 'construction', cloudProviders: ['Azure'], sourceTier: 1, lastUpdated: '2024-03-10' },
  { id: 'dc38', name: 'Google Waltham Cross', provider: 'Google Cloud', lat: 51.6866, lng: -0.0416, country: 'UK', city: 'Waltham Cross', region: 'Europe', powerCapacity: 200, powerUnit: 'MW', pue: 1.10, yearOperational: 2025, status: 'construction', cloudProviders: ['Google Cloud'], sourceTier: 1, lastUpdated: '2024-02-28' },
  { id: 'dc39', name: 'Meta Cheyenne', provider: 'Meta', lat: 41.1400, lng: -104.8202, country: 'USA', city: 'Cheyenne', region: 'North America', powerCapacity: 300, powerUnit: 'MW', pue: 1.08, yearOperational: 2025, status: 'construction', cloudProviders: ['Meta'], sourceTier: 1, lastUpdated: '2024-03-01' },
  { id: 'dc40', name: 'AWS Malaysia (Iskandar Puteri)', provider: 'Amazon Web Services', lat: 1.4248, lng: 103.6225, country: 'Malaysia', city: 'Johor', region: 'Asia Pacific', powerCapacity: 200, powerUnit: 'MW', pue: 1.15, yearOperational: 2025, status: 'construction', cloudProviders: ['AWS'], sourceTier: 1, lastUpdated: '2024-03-15' },
  { id: 'dc41', name: 'Digital Realty Mumbai', provider: 'Digital Realty', lat: 19.0760, lng: 72.8777, country: 'India', city: 'Mumbai', region: 'Asia Pacific', powerCapacity: 60, powerUnit: 'MW', pue: 1.28, yearOperational: 2025, status: 'construction', cloudProviders: ['Multi-tenant'], sourceTier: 1, lastUpdated: '2024-02-20' },
  { id: 'dc42', name: 'xAI Atlanta', provider: 'xAI', lat: 33.7490, lng: -84.3880, country: 'USA', city: 'Atlanta', region: 'North America', powerCapacity: 700, powerUnit: 'MW', pue: 1.15, yearOperational: 2025, status: 'planned', cloudProviders: ['xAI'], sourceTier: 2, lastUpdated: '2024-03-20' },
  { id: 'dc43', name: 'Oracle Nashville', provider: 'Oracle Cloud', lat: 36.1627, lng: -86.7816, country: 'USA', city: 'Nashville', region: 'North America', powerCapacity: 200, powerUnit: 'MW', pue: 1.18, yearOperational: 2026, status: 'planned', cloudProviders: ['Oracle Cloud'], sourceTier: 1, lastUpdated: '2024-02-15' },
  { id: 'dc44', name: 'CoreSite NY1 (Secaucus)', provider: 'CoreSite', lat: 40.7895, lng: -74.0565, country: 'USA', city: 'Secaucus', region: 'North America', powerCapacity: 35, powerUnit: 'MW', pue: 1.28, yearOperational: 2006, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 2, lastUpdated: '2024-02-15' },
  { id: 'dc45', name: 'Vantage Frankfurt', provider: 'Vantage Data Centers', lat: 50.1109, lng: 8.6821, country: 'Germany', city: 'Frankfurt', region: 'Europe', powerCapacity: 100, powerUnit: 'MW', pue: 1.20, yearOperational: 2020, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 2, lastUpdated: '2024-01-20' },
  { id: 'dc46', name: 'STT GDC Bangalore', provider: 'ST Telemedia', lat: 12.9716, lng: 77.5946, country: 'India', city: 'Bangalore', region: 'Asia Pacific', powerCapacity: 50, powerUnit: 'MW', pue: 1.35, yearOperational: 2019, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 2, lastUpdated: '2024-01-25' },
  { id: 'dc47', name: 'Switch Las Vegas (The Core Campus)', provider: 'Switch', lat: 36.1699, lng: -115.1398, country: 'USA', city: 'Las Vegas', region: 'North America', powerCapacity: 250, powerUnit: 'MW', pue: 1.25, yearOperational: 2016, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 2, lastUpdated: '2024-01-18' },
  { id: 'dc48', name: 'CyrusOne Allen', provider: 'CyrusOne', lat: 33.1032, lng: -96.6706, country: 'USA', city: 'Allen', region: 'North America', powerCapacity: 80, powerUnit: 'MW', pue: 1.22, yearOperational: 2017, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 2, lastUpdated: '2024-01-22' },
  { id: 'dc49', name: 'Iron Mountain Boston', provider: 'Iron Mountain', lat: 42.3601, lng: -71.0589, country: 'USA', city: 'Boston', region: 'North America', powerCapacity: 30, powerUnit: 'MW', pue: 1.35, yearOperational: 2013, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 2, lastUpdated: '2024-01-28' },
  { id: 'dc50', name: 'Equinix LD5 (London)', provider: 'Equinix', lat: 51.5074, lng: -0.1278, country: 'UK', city: 'London', region: 'Europe', powerCapacity: 30, powerUnit: 'MW', pue: 1.32, yearOperational: 2004, status: 'operational', cloudProviders: ['Multi-tenant'], sourceTier: 1, lastUpdated: '2024-03-05' },
];

export const sourceReferences: SourceReference[] = [
  { id: 'sr1', name: 'ASML Annual Report 2024', tier: 1, type: 'Annual Report', url: 'https://www.asml.com/investors', lastUpdated: '2024-02-14', description: 'Annual financial and operational report from ASML Holding' },
  { id: 'sr2', name: 'TSMC Annual Report 2024', tier: 1, type: 'Annual Report', url: 'https://investor.tsmc.com', lastUpdated: '2024-03-15', description: 'TSMC annual report including capacity and revenue data' },
  { id: 'sr3', name: 'USGS Mineral Commodity Summaries', tier: 1, type: 'Government Survey', url: 'https://www.usgs.gov/centers/national-minerals-information-center', lastUpdated: '2024-01-15', description: 'Official US government mineral production statistics' },
  { id: 'sr4', name: 'IEA Global Energy Review 2024', tier: 1, type: 'International Report', url: 'https://www.iea.org/reports', lastUpdated: '2024-03-01', description: 'International Energy Agency energy demand forecasts' },
  { id: 'sr5', name: 'Samsung Electronics Annual Report', tier: 1, type: 'Annual Report', url: 'https://ir.samsungglobal.com', lastUpdated: '2024-03-10', description: 'Samsung Electronics annual report including foundry division' },
  { id: 'sr6', name: 'Intel Annual Report (10-K)', tier: 1, type: 'SEC Filing', url: 'https://www.intc.com', lastUpdated: '2024-03-12', description: 'Intel annual SEC filing with foundry revenue breakdown' },
  { id: 'sr7', name: 'TrendForce Semiconductor Research', tier: 2, type: 'Industry Report', url: 'https://www.trendforce.com', lastUpdated: '2024-03-20', description: 'TrendForce market research on foundry and memory markets' },
  { id: 'sr8', name: 'Gartner Semiconductor Forecast', tier: 2, type: 'Industry Report', url: 'https://www.gartner.com', lastUpdated: '2024-02-28', description: 'Gartner semiconductor industry forecast and analysis' },
  { id: 'sr9', name: 'SMIC Annual Report', tier: 1, type: 'Annual Report', url: 'https://www.smics.com', lastUpdated: '2024-03-08', description: 'SMIC annual report with capacity and utilization data' },
  { id: 'sr10', name: 'Data Center Knowledge', tier: 2, type: 'Industry Publication', url: 'https://www.datacenterknowledge.com', lastUpdated: '2024-03-18', description: 'Data center industry news and facility tracking' },
];

// ─── Page-specific datasets (single source of truth) ────────────

export const facilitiesData: DataCenterEntry[] = [
  { id: 1, name: 'AWS US-East-1', provider: 'Amazon (AWS)', country: 'USA', region: 'North America', powerMW: 180, pue: 1.12, year: 2006, status: 'Operational', energyMix: '50% renewable', layer: 'dataCenter' },
  { id: 2, name: 'Microsoft Boydton', provider: 'Microsoft', country: 'USA', region: 'North America', powerMW: 150, pue: 1.15, year: 2010, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
  { id: 3, name: 'Google The Dalles', provider: 'Google', country: 'USA', region: 'North America', powerMW: 90, pue: 1.10, year: 2006, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
  { id: 4, name: 'Meta Prineville', provider: 'Meta', country: 'USA', region: 'North America', powerMW: 85, pue: 1.13, year: 2010, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
  { id: 5, name: 'AWS EU-West-1', provider: 'Amazon (AWS)', country: 'Ireland', region: 'Europe', powerMW: 75, pue: 1.14, year: 2007, status: 'Operational', energyMix: '95% renewable', layer: 'dataCenter' },
  { id: 6, name: 'Chindata Huailai', provider: 'Chindata', country: 'China', region: 'China', powerMW: 220, pue: 1.18, year: 2018, status: 'Operational', energyMix: '60% renewable', layer: 'dataCenter' },
  { id: 7, name: 'Tencent Qingyuan', provider: 'Tencent', country: 'China', region: 'China', powerMW: 120, pue: 1.20, year: 2019, status: 'Operational', energyMix: '45% renewable', layer: 'dataCenter' },
  { id: 8, name: 'Equinix FR5', provider: 'Equinix', country: 'Germany', region: 'Europe', powerMW: 18, pue: 1.25, year: 2015, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
  { id: 9, name: 'AWS ap-southeast-1', provider: 'Amazon (AWS)', country: 'Singapore', region: 'Asia Pacific', powerMW: 55, pue: 1.22, year: 2010, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
  { id: 10, name: 'Microsoft San Antonio', provider: 'Microsoft', country: 'USA', region: 'North America', powerMW: 70, pue: 1.16, year: 2014, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
  { id: 11, name: 'Alibaba Zhangjiakou', provider: 'Alibaba Cloud', country: 'China', region: 'China', powerMW: 95, pue: 1.19, year: 2019, status: 'Operational', energyMix: '70% renewable', layer: 'dataCenter' },
  { id: 12, name: 'Google Eemshaven', provider: 'Google', country: 'Netherlands', region: 'Europe', powerMW: 50, pue: 1.11, year: 2016, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
  { id: 13, name: 'AWS us-west-2', provider: 'Amazon (AWS)', country: 'USA', region: 'North America', powerMW: 110, pue: 1.13, year: 2011, status: 'Operational', energyMix: '95% renewable', layer: 'dataCenter' },
  { id: 14, name: 'Meta Clonee', provider: 'Meta', country: 'Ireland', region: 'Europe', powerMW: 65, pue: 1.15, year: 2017, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
  { id: 15, name: 'Apple Reno', provider: 'Apple', country: 'USA', region: 'North America', powerMW: 40, pue: 1.14, year: 2012, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
  { id: 16, name: 'GDS Shanghai 6', provider: 'GDS', country: 'China', region: 'China', powerMW: 80, pue: 1.21, year: 2020, status: 'Operational', energyMix: '35% renewable', layer: 'dataCenter' },
  { id: 17, name: 'Digital Realty LHR', provider: 'Digital Realty', country: 'UK', region: 'Europe', powerMW: 25, pue: 1.28, year: 2014, status: 'Operational', energyMix: '80% renewable', layer: 'dataCenter' },
  { id: 18, name: 'NTT Tokyo 5', provider: 'NTT', country: 'Japan', region: 'Asia Pacific', powerMW: 35, pue: 1.24, year: 2018, status: 'Operational', energyMix: '30% renewable', layer: 'dataCenter' },
  { id: 19, name: 'CyrusOne Aurora', provider: 'CyrusOne', country: 'USA', region: 'North America', powerMW: 48, pue: 1.23, year: 2016, status: 'Operational', energyMix: '60% renewable', layer: 'dataCenter' },
  { id: 20, name: 'Switch LAS VEGAS 10', provider: 'Switch', country: 'USA', region: 'North America', powerMW: 55, pue: 1.20, year: 2015, status: 'Operational', energyMix: '100% renewable', layer: 'dataCenter' },
];

export const supplyChainTableData: SupplyChainEntry[] = [
  { id: 1, name: 'Inner Mongolia Rare Earth', type: 'rare-earth', country: 'China', keyMetric: 'Annual Production', value: '140,000 t', source: 'Ministry of Industry 2025', tier: 'tier1', updated: '2025-01' },
  { id: 2, name: 'Lynas Rare Earths', type: 'rare-earth', country: 'Australia', keyMetric: 'Capacity', value: '35,000 t/year', source: 'Annual Report 2024', tier: 'tier1', updated: '2024-12' },
  { id: 3, name: 'ASML EUV Systems', type: 'lithography', country: 'Netherlands', keyMetric: 'Systems Shipped (2024)', value: '53 EUV units', source: 'ASML Q4 2024 Report', tier: 'tier1', updated: '2025-01' },
  { id: 4, name: 'Mountain Pass Mine', type: 'rare-earth', country: 'USA', keyMetric: 'Production', value: '50,000 t/year', source: 'MP Materials Corp', tier: 'tier1', updated: '2024-11' },
  { id: 5, name: 'Nikon Precision', type: 'lithography', country: 'Japan', keyMetric: 'Market Share', value: 'ArF niche', source: 'Company Filings', tier: 'tier2', updated: '2024-10' },
  { id: 6, name: 'Huawei HiSilicon', type: 'design', country: 'China', keyMetric: 'Design Capacity', value: '5nm (SMIC fab)', source: 'Industry Analysis', tier: 'tier2', updated: '2024-12' },
  { id: 7, name: 'NVIDIA GPU Design', type: 'design', country: 'USA', keyMetric: 'Revenue (2024)', value: '$60.9B', source: 'Annual Report', tier: 'tier1', updated: '2025-01' },
  { id: 8, name: 'ARM Holdings', type: 'design', country: 'UK', keyMetric: 'Licenses', value: '250B+ chips', source: 'IPO Filing 2023', tier: 'tier1', updated: '2024-09' },
  { id: 9, name: 'Synopsys EDA', type: 'design', country: 'USA', keyMetric: 'Revenue (2024)', value: '$6.1B', source: 'Q4 2024 Earnings', tier: 'tier1', updated: '2024-12' },
  { id: 10, name: 'Cadence EDA', type: 'design', country: 'USA', keyMetric: 'Revenue (2024)', value: '$4.5B', source: 'Q4 2024 Earnings', tier: 'tier1', updated: '2024-12' },
  { id: 11, name: 'Anhui Mining Group', type: 'rare-earth', country: 'China', keyMetric: 'Reserve', value: 'Grade 0.8% TREO', source: 'Government Gazette', tier: 'tier2', updated: '2024-08' },
  { id: 12, name: 'Clean Energy Partnership', type: 'energy', country: 'Global', keyMetric: 'Renewable %', value: '42% of DC power', source: 'IEA Report 2024', tier: 'tier2', updated: '2024-11' },
  { id: 13, name: 'Myanmar Rare Earth', type: 'rare-earth', country: 'Myanmar', keyMetric: 'Output', value: '38,000 t (est.)', source: 'Trade estimates', tier: 'tier3', updated: '2024-12' },
  { id: 14, name: 'Shanghai Micro Electronics', type: 'lithography', country: 'China', keyMetric: 'Node Demo', value: '90nm achieved', source: 'Industry sources', tier: 'tier3', updated: '2024-06' },
];

export const sourcesTableData: SourceEntry[] = [
  { id: 1, name: 'TSMC Annual Report 2024', category: 'Financial', tier: 'tier1', layer: 'Foundry', dataPoints: 120, lastUpdated: '2025-01-15', status: 'active', url: 'https://investor.tsmc.com', description: 'Official audited financial statements from TSMC' },
  { id: 2, name: 'ASML Q4 2024 Earnings', category: 'Financial', tier: 'tier1', layer: 'Supply Chain', dataPoints: 85, lastUpdated: '2025-01-29', status: 'active', url: 'https://asml.com/investors', description: 'ASML quarterly earnings and unit shipments' },
  { id: 3, name: 'NVIDIA 10-K Filing 2024', category: 'Financial', tier: 'tier1', layer: 'Supply Chain', dataPoints: 95, lastUpdated: '2025-02-01', status: 'active', url: 'https://investor.nvidia.com', description: 'Annual SEC filing with detailed revenue breakdown' },
  { id: 4, name: 'China MIIT Rare Earth Quota', category: 'Government', tier: 'tier1', layer: 'Supply Chain', dataPoints: 45, lastUpdated: '2025-01-10', status: 'active', description: 'Official rare earth production quotas from Ministry of Industry' },
  { id: 5, name: 'Equinix ESG Report 2024', category: 'ESG', tier: 'tier1', layer: 'Data Center', dataPoints: 60, lastUpdated: '2024-12-20', status: 'active', description: 'Equinix environmental and energy data' },
  { id: 6, name: 'Samsung Electronics IR', category: 'Financial', tier: 'tier1', layer: 'Foundry', dataPoints: 75, lastUpdated: '2025-01-31', status: 'active', description: 'Samsung quarterly investor relations data' },
  { id: 7, name: 'Intel Foundry Update 2024', category: 'Financial', tier: 'tier1', layer: 'Foundry', dataPoints: 55, lastUpdated: '2025-01-25', status: 'active', description: 'Intel Foundry Services business updates' },
  { id: 8, name: 'SMIC Annual Report 2024', category: 'Financial', tier: 'tier1', layer: 'Foundry', dataPoints: 40, lastUpdated: '2025-01-20', status: 'active', description: 'SMIC audited annual financial report' },
  { id: 9, name: 'TrendForce Foundry Report', category: 'Industry Analysis', tier: 'tier2', layer: 'Foundry', dataPoints: 200, lastUpdated: '2025-01-28', status: 'active', url: 'https://trendforce.com', description: 'Monthly foundry revenue and capacity tracking' },
  { id: 10, name: 'Gartner Semiconductor Forecast', category: 'Forecast', tier: 'tier2', layer: 'Foundry', dataPoints: 80, lastUpdated: '2025-01-15', status: 'active', description: 'Gartner semiconductor market forecasts' },
  { id: 11, name: 'IEA Data Centre Energy 2024', category: 'Energy', tier: 'tier2', layer: 'Data Center', dataPoints: 150, lastUpdated: '2024-11-30', status: 'active', description: 'International Energy Agency data centre energy tracking' },
  { id: 12, name: 'Synergy Research DC Capacity', category: 'Market Research', tier: 'tier2', layer: 'Data Center', dataPoints: 120, lastUpdated: '2025-01-05', status: 'active', description: 'Quarterly cloud and DC infrastructure tracking' },
  { id: 13, name: 'McKinsey AI Infrastructure', category: 'Consulting', tier: 'tier2', layer: 'Data Center', dataPoints: 70, lastUpdated: '2024-12-15', status: 'pending', description: 'McKinsey analysis of AI infrastructure buildout' },
  { id: 14, name: 'SEMI Equipment Tracker', category: 'Industry', tier: 'tier2', layer: 'Supply Chain', dataPoints: 90, lastUpdated: '2025-01-20', status: 'active', description: 'Semiconductor equipment market data from SEMI' },
  { id: 15, name: 'Uptime Institute Survey', category: 'Survey', tier: 'tier2', layer: 'Data Center', dataPoints: 65, lastUpdated: '2024-12-01', status: 'stale', description: 'Annual data center industry survey' },
  { id: 16, name: 'BCG Supply Chain Report', category: 'Consulting', tier: 'tier2', layer: 'Supply Chain', dataPoints: 50, lastUpdated: '2024-10-30', status: 'stale', description: 'Boston Consulting Group semiconductor supply chain analysis' },
  { id: 17, name: 'Modeled: DC Power 2030', category: 'Model', tier: 'tier3', layer: 'Data Center', dataPoints: 30, lastUpdated: '2025-01-01', status: 'active', description: 'Regression model based on hyperscaler capex and server power curves' },
  { id: 18, name: 'Estimated: China Fab Capacity', category: 'Estimate', tier: 'tier3', layer: 'Foundry', dataPoints: 40, lastUpdated: '2024-12-20', status: 'pending', description: 'Capacity estimates derived from equipment import data and satellite imagery' },
  { id: 19, name: 'Projected: EUV Unit Sales', category: 'Forecast', tier: 'tier3', layer: 'Supply Chain', dataPoints: 25, lastUpdated: '2025-01-10', status: 'active', description: 'Forward projection based on fab construction announcements' },
  { id: 20, name: 'Inferred: SMIC 7nm Yield', category: 'Inferred', tier: 'tier3', layer: 'Foundry', dataPoints: 15, lastUpdated: '2024-11-15', status: 'stale', description: 'Yield estimates from die analysis and supply chain sources' },
];


