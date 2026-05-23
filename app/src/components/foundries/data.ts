/**
 * @file data.ts
 * @description 晶圆厂页面数据常量。包含市场份额、营收趋势、各厂设施、制程节点、
 * 对比数据和制程演进时间线等静态数据。
 * @dependencies (none - static data)
 */

/** 全球晶圆代工市场份额分布（百分比） */
export const foundryMarketData = [
  { name: 'TSMC', value: 62, color: '#00D4FF' },
  { name: 'Samsung', value: 13, color: '#3B82F6' },
  { name: 'UMC', value: 6, color: '#9A9AAF' },
  { name: 'SMIC', value: 5, color: '#EF4444' },
  { name: 'GlobalFoundries', value: 5, color: '#6B6B80' },
  { name: 'Intel', value: 2, color: '#F59E0B' },
  { name: 'Others', value: 7, color: '#4B5563' },
];

/** 各主要厂商年度营收趋势数据（单位：十亿美元, 2024E 为预测值） */
export const revenueTrendData = {
  years: ['2019', '2020', '2021', '2022', '2023', '2024E'],
  tsmc: [34.6, 45.5, 56.8, 75.9, 69.3, 90.0],
  samsung: [6.0, 7.6, 10.0, 9.5, 8.0, 12.0],
  intel: [0, 0, 0, 0, 1.0, 2.0],
  smic: [3.1, 3.9, 5.4, 7.2, 6.3, 8.0],
};

/** TSMC 全球晶圆厂设施列表 */
export const tsmcFabs = [
  { name: 'Hsinchu', nameCn: '新竹', role: 'R&D + 12"/8" production', lat: 24.8, lng: 121.0, status: 'Active' as const, nodes: '3nm–28nm', capacity: '200K+' },
  { name: 'Tainan', nameCn: '台南', role: '5nm/3nm/2nm advanced', lat: 23.0, lng: 120.2, status: 'Active' as const, nodes: '2nm–5nm', capacity: '250K' },
  { name: 'Taichung', nameCn: '台中', role: '7nm/28nm', lat: 24.1, lng: 120.7, status: 'Active' as const, nodes: '7nm–28nm', capacity: '140K' },
  { name: 'Arizona', nameCn: '', role: '4nm/3nm (under construction)', lat: 33.4, lng: -112.1, status: 'Building' as const, nodes: '3nm–4nm', capacity: '50K' },
  { name: 'Kumamoto', nameCn: '熊本', role: '28nm/12nm/16nm', lat: 32.8, lng: 130.7, status: 'New' as const, nodes: '12nm–28nm', capacity: '40K' },
  { name: 'Dresden', nameCn: '', role: '28nm/22nm (planned)', lat: 51.0, lng: 13.7, status: 'Planned' as const, nodes: '22nm–28nm', capacity: '—' },
];

/** TSMC 制程节点产能分布 */
export const tsmcNodes = [
  { node: '3nm', location: 'Tainan', capacity: '100K', status: 'Mass production', contribution: '35%' },
  { node: '5nm', location: 'Tainan', capacity: '150K', status: 'Mature', contribution: '30%' },
  { node: '7nm', location: 'Taichung', capacity: '140K', status: 'Mature', contribution: '20%' },
  { node: '28nm', location: 'Multiple', capacity: '200K+', status: 'Stable', contribution: '12%' },
  { node: '2nm', location: 'Tainan', capacity: '—', status: 'Risk production 2025', contribution: '15% (proj)' },
];

/** Samsung 晶圆代工设施列表 */
export const samsungFabs = [
  { name: 'Hwasung', country: 'South Korea', role: 'Advanced logic (3nm GAA)', status: 'Active' as const },
  { name: 'Pyeongtaek', country: 'South Korea', role: 'Memory + Logic', status: 'Active' as const },
  { name: 'Austin, TX', country: 'USA', role: '28nm/14nm', status: 'Active' as const },
  { name: 'Taylor, TX', country: 'USA', role: '4nm/5nm/2nm', status: 'Building' as const },
];

/** SMIC（中芯国际）晶圆厂设施列表 */
export const smicFabs = [
  { name: 'Shanghai', role: '14nm/28nm', status: 'Active' as const },
  { name: 'Beijing', role: '12nm/28nm', status: 'Active' as const },
  { name: 'Shenzhen', role: '28nm+', status: 'Active' as const },
  { name: 'Tianjin', role: 'Mature nodes', status: 'Active' as const },
];

/** 全球主要晶圆代工厂综合对比数据 */
export const comparisonData = [
  { company: 'TSMC', revenue: '$90B', share: '62%', node: '3nm', fabs: 6, usaFabs: '2', chinaFabs: '0', europeFabs: '1', capacity: '1.5M+', customers: 'Apple, NVIDIA, AMD' },
  { company: 'Samsung', revenue: '$12B', share: '13%', node: '3nm GAA', fabs: 4, usaFabs: '2', chinaFabs: '0', europeFabs: '0', capacity: '500K', customers: 'Qualcomm, Self' },
  { company: 'Intel', revenue: '$2B', share: '2%', node: '18A', fabs: 7, usaFabs: '5+', chinaFabs: '0', europeFabs: '2', capacity: '200K', customers: 'Self (IDM 2.0)' },
  { company: 'SMIC', revenue: '$8B', share: '5%', node: '7nm', fabs: 4, usaFabs: '0', chinaFabs: '4', europeFabs: '0', capacity: '400K', customers: 'Domestic China' },
  { company: 'GlobalFoundries', revenue: '$7B', share: '5%', node: '12nm', fabs: 4, usaFabs: '3', chinaFabs: '0', europeFabs: '1', capacity: '300K', customers: 'Auto, Defense' },
  { company: 'UMC', revenue: '$5B', share: '6%', node: '22nm', fabs: 4, usaFabs: '1', chinaFabs: '1', europeFabs: '1', capacity: '300K', customers: 'IoT, Comm' },
];

/** 半导体制程技术演进时间线 */
export const processTimeline = [
  { year: '2018', node: '7nm', leader: 'TSMC', color: '#00D4FF' },
  { year: '2020', node: '5nm', leader: 'TSMC', color: '#00D4FF' },
  { year: '2022', node: '3nm', leader: 'TSMC / Samsung', color: '#00D4FF' },
  { year: '2024', node: '3nm GAA', leader: 'Samsung', color: '#3B82F6' },
  { year: '2025', node: '2nm', leader: 'TSMC', color: '#00D4FF' },
  { year: '2027', node: '1.4nm', leader: 'TSMC (est)', color: 'rgba(0,212,255,0.5)' },
];

/** 对比表格可排序的键类型 */
export type SortKey = keyof typeof comparisonData[number];
