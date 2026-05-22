import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Cpu,
  Globe,
  TrendingUp,
  MapPin,
  Microchip,
  Factory,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  Layers,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Activity,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Animations
   ────────────────────────────────────────────── */
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: easeOutExpo },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: easeOutExpo } },
};

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const foundryMarketData = [
  { name: 'TSMC', value: 62, color: '#00D4FF' },
  { name: 'Samsung', value: 13, color: '#3B82F6' },
  { name: 'UMC', value: 6, color: '#9A9AAF' },
  { name: 'SMIC', value: 5, color: '#EF4444' },
  { name: 'GlobalFoundries', value: 5, color: '#6B6B80' },
  { name: 'Intel', value: 2, color: '#F59E0B' },
  { name: 'Others', value: 7, color: '#4B5563' },
];

const revenueTrendData = {
  years: ['2019', '2020', '2021', '2022', '2023', '2024E'],
  tsmc: [34.6, 45.5, 56.8, 75.9, 69.3, 90.0],
  samsung: [6.0, 7.6, 10.0, 9.5, 8.0, 12.0],
  intel: [0, 0, 0, 0, 1.0, 2.0],
  smic: [3.1, 3.9, 5.4, 7.2, 6.3, 8.0],
};

const tsmcFabs = [
  { name: 'Hsinchu', nameCn: '新竹', role: 'R&D + 12"/8" production', lat: 24.8, lng: 121.0, status: 'Active' as const, nodes: '3nm–28nm', capacity: '200K+' },
  { name: 'Tainan', nameCn: '台南', role: '5nm/3nm/2nm advanced', lat: 23.0, lng: 120.2, status: 'Active' as const, nodes: '2nm–5nm', capacity: '250K' },
  { name: 'Taichung', nameCn: '台中', role: '7nm/28nm', lat: 24.1, lng: 120.7, status: 'Active' as const, nodes: '7nm–28nm', capacity: '140K' },
  { name: 'Arizona', nameCn: '', role: '4nm/3nm (under construction)', lat: 33.4, lng: -112.1, status: 'Building' as const, nodes: '3nm–4nm', capacity: '50K' },
  { name: 'Kumamoto', nameCn: '熊本', role: '28nm/12nm/16nm', lat: 32.8, lng: 130.7, status: 'New' as const, nodes: '12nm–28nm', capacity: '40K' },
  { name: 'Dresden', nameCn: '', role: '28nm/22nm (planned)', lat: 51.0, lng: 13.7, status: 'Planned' as const, nodes: '22nm–28nm', capacity: '—' },
];

const tsmcNodes = [
  { node: '3nm', location: 'Tainan', capacity: '100K', status: 'Mass production', contribution: '35%' },
  { node: '5nm', location: 'Tainan', capacity: '150K', status: 'Mature', contribution: '30%' },
  { node: '7nm', location: 'Taichung', capacity: '140K', status: 'Mature', contribution: '20%' },
  { node: '28nm', location: 'Multiple', capacity: '200K+', status: 'Stable', contribution: '12%' },
  { node: '2nm', location: 'Tainan', capacity: '—', status: 'Risk production 2025', contribution: '15% (proj)' },
];

const samsungFabs = [
  { name: 'Hwasung', country: 'South Korea', role: 'Advanced logic (3nm GAA)', status: 'Active' as const },
  { name: 'Pyeongtaek', country: 'South Korea', role: 'Memory + Logic', status: 'Active' as const },
  { name: 'Austin, TX', country: 'USA', role: '28nm/14nm', status: 'Active' as const },
  { name: 'Taylor, TX', country: 'USA', role: '4nm/5nm/2nm', status: 'Building' as const },
];

const smicFabs = [
  { name: 'Shanghai', role: '14nm/28nm', status: 'Active' as const },
  { name: 'Beijing', role: '12nm/28nm', status: 'Active' as const },
  { name: 'Shenzhen', role: '28nm+', status: 'Active' as const },
  { name: 'Tianjin', role: 'Mature nodes', status: 'Active' as const },
];

const comparisonData = [
  { company: 'TSMC', revenue: '$90B', share: '62%', node: '3nm', fabs: 6, usaFabs: '2', chinaFabs: '0', europeFabs: '1', capacity: '1.5M+', customers: 'Apple, NVIDIA, AMD' },
  { company: 'Samsung', revenue: '$12B', share: '13%', node: '3nm GAA', fabs: 4, usaFabs: '2', chinaFabs: '0', europeFabs: '0', capacity: '500K', customers: 'Qualcomm, Self' },
  { company: 'Intel', revenue: '$2B', share: '2%', node: '18A', fabs: 7, usaFabs: '5+', chinaFabs: '0', europeFabs: '2', capacity: '200K', customers: 'Self (IDM 2.0)' },
  { company: 'SMIC', revenue: '$8B', share: '5%', node: '7nm', fabs: 4, usaFabs: '0', chinaFabs: '4', europeFabs: '0', capacity: '400K', customers: 'Domestic China' },
  { company: 'GlobalFoundries', revenue: '$7B', share: '5%', node: '12nm', fabs: 4, usaFabs: '3', chinaFabs: '0', europeFabs: '1', capacity: '300K', customers: 'Auto, Defense' },
  { company: 'UMC', revenue: '$5B', share: '6%', node: '22nm', fabs: 4, usaFabs: '1', chinaFabs: '1', europeFabs: '1', capacity: '300K', customers: 'IoT, Comm' },
];

const processTimeline = [
  { year: '2018', node: '7nm', leader: 'TSMC', color: '#00D4FF' },
  { year: '2020', node: '5nm', leader: 'TSMC', color: '#00D4FF' },
  { year: '2022', node: '3nm', leader: 'TSMC / Samsung', color: '#00D4FF' },
  { year: '2024', node: '3nm GAA', leader: 'Samsung', color: '#3B82F6' },
  { year: '2025', node: '2nm', leader: 'TSMC', color: '#00D4FF' },
  { year: '2027', node: '1.4nm', leader: 'TSMC (est)', color: 'rgba(0,212,255,0.5)' },
];

type SortKey = keyof typeof comparisonData[number];

/* ──────────────────────────────────────────────
   Count-up hook
   ────────────────────────────────────────────── */
function useCountUp(end: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView || triggered.current) return;
    triggered.current = true;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return { ref, value };
}

/* ──────────────────────────────────────────────
   StatusBadge
   ────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: 'border-success text-success',
    New: 'border-accent-cyan text-accent-cyan',
    Building: 'border-warning text-warning',
    Planned: 'border-text-muted text-text-muted',
    'Risk production 2025': 'border-warning text-warning',
    'Mass production': 'border-success text-success',
    Mature: 'border-info text-info',
    Stable: 'border-info text-info',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-mono-sm ${styles[status] || 'border-text-muted text-text-muted'}`}>
      {status === 'Active' && <CheckCircle2 size={10} />}
      {status === 'Building' && <Clock size={10} />}
      {status === 'Planned' && <AlertCircle size={10} />}
      {status}
    </span>
  );
}

/* ──────────────────────────────────────────────
   KPI Stat
   ────────────────────────────────────────────── */
function KpiStat({ label, value, prefix = '', suffix = '', index }: { label: string; value: number; prefix?: string; suffix?: string; index: number }) {
  const { ref, value: animated } = useCountUp(value);
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center"
      ref={ref}
    >
      <div className="text-data-md text-accent-cyan font-mono">
        {prefix}{animated.toLocaleString()}{suffix}
      </div>
      <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em] mt-1">{label}</div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Section Label
   ────────────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-center gap-2 mb-4"
    >
      <span className="w-2 h-2 rounded-full bg-accent-cyan" />
      <span className="text-mono-sm text-accent-cyan tracking-[0.04em] uppercase">{text}</span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Comparison Table
   ────────────────────────────────────────────── */
function ComparisonMatrix() {
  const [sortKey, setSortKey] = useState<SortKey>('company');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...comparisonData].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const headers: { key: SortKey; label: string }[] = [
    { key: 'company', label: 'Company' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'share', label: 'Share' },
    { key: 'node', label: 'Advanced Node' },
    { key: 'fabs', label: 'Fabs' },
    { key: 'usaFabs', label: 'USA Fabs' },
    { key: 'chinaFabs', label: 'China Fabs' },
    { key: 'europeFabs', label: 'Europe Fabs' },
    { key: 'capacity', label: 'Capacity/mo' },
    { key: 'customers', label: 'Key Customers' },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-surface">
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => handleSort(h.key)}
                  className="text-left text-mono-sm text-text-muted uppercase tracking-[0.04em] px-4 py-3 cursor-pointer select-none hover:text-text-primary transition-colors whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {h.label}
                    {sortKey === h.key && (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <motion.tr
                key={row.company}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3, ease: easeOutExpo }}
                viewport={{ once: true }}
                className="border-t border-border-subtle hover:bg-bg-surface transition-all duration-200 group cursor-default"
                style={{ borderLeft: '2px solid transparent' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = '#00D4FF'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent'; }}
              >
                <td className="px-4 py-3 text-body-md font-semibold text-text-primary">{row.company}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary font-mono">{row.revenue}</td>
                <td className="px-4 py-3 text-body-md text-accent-cyan font-mono">{row.share}</td>
                <td className="px-4 py-3 text-body-md text-text-primary">{row.node}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary text-center">{row.fabs}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary">{row.usaFabs}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary">{row.chinaFabs}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary">{row.europeFabs}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary font-mono">{row.capacity}</td>
                <td className="px-4 py-3 text-body-sm text-text-secondary">{row.customers}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Charts
   ────────────────────────────────────────────── */
function DonutChart() {
  const option = {
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontFamily: 'Inter' },
      formatter: (params: Record<string, string>) => `${params.name}: ${params.value}%`,
    },
    series: [
      {
        type: 'pie',
        radius: ['52%', '78%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: { borderRadius: 4 },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#E8E8EC',
            formatter: (p: Record<string, string>) => `${p.name}\n${p.value}%`,
          },
          itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,212,255,0.3)' },
        },
        data: foundryMarketData.map((d) => ({
          ...d,
          itemStyle: { color: d.color },
        })),
        animationType: 'scale' as const,
        animationEasing: 'elasticOut' as const,
        animationDelay: () => Math.random() * 200,
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '42%',
        style: {
          text: '$230B+',
          fill: '#00D4FF',
          fontSize: 28,
          fontWeight: 500,
          fontFamily: 'JetBrains Mono',
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '55%',
        style: {
          text: 'Total Market',
          fill: '#6B6B80',
          fontSize: 11,
          fontFamily: 'JetBrains Mono',
          letterSpacing: 2,
        },
      },
    ],
  };

  return <ReactEChartsCore option={option} style={{ height: 320 }} notMerge={true} lazyUpdate={true} />;
}

function RevenueTrendChart() {
  const option = {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontFamily: 'Inter' },
    },
    legend: {
      data: ['TSMC', 'Samsung', 'Intel', 'SMIC'],
      textStyle: { color: '#9A9AAF', fontFamily: 'Inter', fontSize: 11 },
      bottom: 0,
    },
    grid: { top: 24, right: 16, bottom: 40, left: 50 },
    xAxis: {
      type: 'category' as const,
      data: revenueTrendData.years,
      axisLine: { lineStyle: { color: '#1E1E28' } },
      axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono', fontSize: 10 },
    },
    yAxis: {
      type: 'value' as const,
      name: '$B',
      nameTextStyle: { color: '#6B6B80', fontSize: 10 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1E1E28', type: 'dashed' as const } },
      axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono', fontSize: 10 },
    },
    series: [
      { name: 'TSMC', type: 'line', smooth: true, data: revenueTrendData.tsmc, lineStyle: { color: '#00D4FF', width: 3 }, itemStyle: { color: '#00D4FF' }, symbolSize: 6 },
      { name: 'Samsung', type: 'line', smooth: true, data: revenueTrendData.samsung, lineStyle: { color: '#3B82F6', width: 2 }, itemStyle: { color: '#3B82F6' }, symbolSize: 5 },
      { name: 'SMIC', type: 'line', smooth: true, data: revenueTrendData.smic, lineStyle: { color: '#EF4444', width: 2 }, itemStyle: { color: '#EF4444' }, symbolSize: 5 },
      { name: 'Intel', type: 'line', smooth: true, data: revenueTrendData.intel, lineStyle: { color: '#F59E0B', width: 2, type: 'dashed' as const }, itemStyle: { color: '#F59E0B' }, symbolSize: 5 },
    ],
    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
  };

  return <ReactEChartsCore option={option} style={{ height: 280 }} notMerge={true} lazyUpdate={true} />;
}

function CapacityProjectionChart() {
  const option = {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontFamily: 'Inter' },
    },
    legend: {
      data: ['TSMC', 'Samsung', 'SMIC', 'Others'],
      textStyle: { color: '#9A9AAF', fontFamily: 'Inter', fontSize: 11 },
      bottom: 0,
    },
    grid: { top: 24, right: 16, bottom: 40, left: 50 },
    xAxis: {
      type: 'category' as const,
      data: ['2024', '2025E', '2026E', '2027E', '2028E', '2030E'],
      axisLine: { lineStyle: { color: '#1E1E28' } },
      axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono', fontSize: 10 },
    },
    yAxis: {
      type: 'value' as const,
      name: 'K Wafers/mo',
      nameTextStyle: { color: '#6B6B80', fontSize: 10 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1E1E28', type: 'dashed' as const } },
      axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono', fontSize: 10 },
    },
    series: [
      { name: 'TSMC', type: 'line', stack: 'Total', areaStyle: { color: 'rgba(0,212,255,0.15)' }, lineStyle: { color: '#00D4FF' }, itemStyle: { color: '#00D4FF' }, data: [1500, 1700, 1900, 2100, 2300, 2600] },
      { name: 'Samsung', type: 'line', stack: 'Total', areaStyle: { color: 'rgba(59,130,246,0.12)' }, lineStyle: { color: '#3B82F6' }, itemStyle: { color: '#3B82F6' }, data: [500, 550, 600, 650, 700, 800] },
      { name: 'SMIC', type: 'line', stack: 'Total', areaStyle: { color: 'rgba(239,68,68,0.1)' }, lineStyle: { color: '#EF4444' }, itemStyle: { color: '#EF4444' }, data: [400, 450, 500, 550, 600, 700] },
      { name: 'Others', type: 'line', stack: 'Total', areaStyle: { color: 'rgba(107,107,128,0.1)' }, lineStyle: { color: '#6B6B80' }, itemStyle: { color: '#6B6B80' }, data: [600, 650, 700, 750, 800, 900] },
    ],
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  };

  return <ReactEChartsCore option={option} style={{ height: 300 }} notMerge={true} lazyUpdate={true} />;
}

/* ──────────────────────────────────────────────
   GAA Comparison mini chart
   ────────────────────────────────────────────── */
function GaaComparisonChart() {
  const option = {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontFamily: 'Inter', fontSize: 11 },
    },
    legend: {
      data: ['Samsung 3nm GAA', 'TSMC 3nm FinFET'],
      textStyle: { color: '#9A9AAF', fontFamily: 'Inter', fontSize: 10 },
      bottom: 0,
    },
    grid: { top: 20, right: 16, bottom: 36, left: 50 },
    radar: {
      indicator: [
        { name: 'Density', max: 100 },
        { name: 'Power Eff.', max: 100 },
        { name: 'Performance', max: 100 },
        { name: 'Yield', max: 100 },
        { name: 'Ecosystem', max: 100 },
      ],
      shape: 'polygon' as const,
      axisName: { color: '#6B6B80', fontFamily: 'Inter', fontSize: 10 },
      splitArea: { areaStyle: { color: ['rgba(10,10,15,0.5)', 'rgba(10,10,15,0.3)'] } },
      splitLine: { lineStyle: { color: '#1E1E28' } },
      axisLine: { lineStyle: { color: '#1E1E28' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [90, 95, 88, 55, 50], name: 'Samsung 3nm GAA', itemStyle: { color: '#3B82F6' }, areaStyle: { color: 'rgba(59,130,246,0.15)' } },
          { value: [88, 82, 95, 92, 98], name: 'TSMC 3nm FinFET', itemStyle: { color: '#00D4FF' }, areaStyle: { color: 'rgba(0,212,255,0.15)' } },
        ],
      },
    ],
    animationDuration: 800,
  };

  return <ReactEChartsCore option={option} style={{ height: 260 }} notMerge={true} lazyUpdate={true} />;
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function FoundriesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-bg-base">
      {/* ── Section 1: Page Header ── */}
      <section className="relative pt-24 pb-12 px-6 border-b-[3px] border-accent-cyan overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 40%, #0A0A0F 100%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #00D4FF 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-[1440px] mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <button onClick={() => navigate('/')} className="text-mono-sm text-text-muted hover:text-text-primary transition-colors">Map</button>
            <span className="text-text-muted">/</span>
            <span className="text-mono-sm text-accent-cyan">Foundry Layer</span>
          </motion.div>

          {/* Layer Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: easeOutExpo }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent-cyan rounded-full mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-accent-cyan" />
            <span className="text-mono-sm text-accent-cyan">封装工厂层 · FOUNDRY</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}
            className="text-heading-lg font-display text-text-primary mb-3"
          >
            Semiconductor Foundry Landscape
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
            className="text-body-lg text-text-secondary max-w-[640px] mb-8"
          >
            Global fabrication capacity, process node leadership, and expansion dynamics across the world's chip manufacturers.
          </motion.p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8 items-center">
            <KpiStat label="Fabs Tracked" value={18} index={3} />
            <KpiStat label="TSMC Share" value={62} suffix="%" index={4} />
            <div className="text-center">
              <div className="text-data-md text-text-primary font-mono">$230B+</div>
              <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em] mt-1">Market Size</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live-pulse opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-live-pulse" />
              </span>
              <span className="text-mono-sm text-text-muted">Updated 2m ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Market Overview ── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, #111118 0%, #161620 100%)' }}>
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="Market Overview" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Donut Chart */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <PieChartIcon size={18} className="text-accent-cyan" />
                2024 Foundry Market Share
              </h3>
              <DonutChart />
            </motion.div>

            {/* Revenue Trend */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-accent-cyan" />
                Revenue Trend ($B)
              </h3>
              <RevenueTrendChart />
            </motion.div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'TSMC Revenue', value: '$90B', color: 'text-accent-cyan', icon: <Zap size={16} /> },
              { label: 'Samsung Foundry', value: '$12B', color: 'text-text-secondary', icon: <Cpu size={16} /> },
              { label: 'Intel Foundry (Target)', value: '$5B', color: 'text-warning', icon: <AlertCircle size={16} /> },
              { label: 'SMIC Revenue', value: '$8B', color: 'text-text-primary', icon: <Activity size={16} /> },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-bg-elevated border border-border-subtle rounded-lg p-5 hover:border-border-active transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 text-text-muted mb-2">{kpi.icon}<span className="text-body-sm">{kpi.label}</span></div>
                <div className={`text-data-md font-mono ${kpi.color}`}>{kpi.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: TSMC Deep Dive ── */}
      <section className="py-16 px-6 bg-bg-base">
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="TSMC · TAIWAN SEMICONDUCTOR" />

          {/* Company Header Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-bg-elevated border border-border-subtle rounded-lg p-6 mb-8 hover:border-border-active transition-all duration-200"
            style={{ borderLeft: '4px solid #00D4FF' }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-heading-md font-display text-text-primary">TSMC</h2>
                  <span className="text-mono-sm text-text-muted">NYSE: TSM</span>
                </div>
                <p className="text-body-md text-text-secondary">Hsinchu, Taiwan · World's largest dedicated independent semiconductor foundry</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Market Leader', '3nm Shipping', '2nm 2025'].map((badge) => (
                  <span key={badge} className="px-2.5 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded text-mono-sm text-accent-cyan">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border-subtle">
              {[
                { label: 'Revenue', value: '$90B' },
                { label: 'Net Margin', value: '~40%' },
                { label: 'Market Cap', value: '~$800B' },
                { label: 'Fabs', value: '6 Active' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-data-md text-accent-cyan font-mono">{stat.value}</div>
                  <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Fab Locations + Timeline Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Fab Cards */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-accent-cyan" />
                Fab Locations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tsmcFabs.map((fab, i) => (
                  <motion.div
                    key={fab.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3, ease: easeOutExpo }}
                    viewport={{ once: true }}
                    className="p-3 bg-bg-surface rounded border border-border-subtle hover:border-accent-cyan/40 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-body-md font-semibold text-text-primary">
                        {fab.nameCn ? `${fab.name} (${fab.nameCn})` : fab.name}
                      </span>
                      <StatusBadge status={fab.status === 'Active' ? 'Active' : fab.status === 'New' ? 'New' : fab.status === 'Building' ? 'Building' : 'Planned'} />
                    </div>
                    <p className="text-body-sm text-text-secondary mb-1">{fab.role}</p>
                    <div className="flex items-center gap-3 text-mono-sm text-text-muted">
                      <span>{fab.nodes}</span>
                      <span>·</span>
                      <span className="text-accent-cyan">{fab.capacity} wfr/mo</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Process Timeline */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <Layers size={18} className="text-accent-cyan" />
                Process Node Timeline
              </h3>
              <div className="space-y-3">
                {processTimeline.map((item, i) => (
                  <motion.div
                    key={item.node + item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: easeOutExpo }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-mono-sm text-text-muted w-12 text-right font-mono">{item.year}</span>
                    <div className="relative w-4 h-4 flex-shrink-0">
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{ borderColor: item.color, backgroundColor: item.color }}
                      />
                      {i < processTimeline.length - 1 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-border-subtle" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-body-md font-semibold text-text-primary">{item.node}</span>
                      <span className="text-body-sm text-text-secondary ml-2">— {item.leader}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Capacity by Node Table */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden mb-8 hover:border-border-active transition-all duration-200"
          >
            <div className="p-4 border-b border-border-subtle">
              <h3 className="text-heading-sm text-text-primary flex items-center gap-2">
                <BarChart3 size={18} className="text-accent-cyan" />
                Capacity by Node
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-surface">
                    {['Node', 'Location', 'Capacity (wafers/mo)', 'Status', 'Revenue Contribution'].map((h) => (
                      <th key={h} className="text-left text-mono-sm text-text-muted uppercase tracking-[0.04em] px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tsmcNodes.map((row, i) => (
                    <motion.tr
                      key={row.node}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease: easeOutExpo }}
                      viewport={{ once: true }}
                      className="border-t border-border-subtle hover:bg-bg-surface transition-colors"
                    >
                      <td className="px-4 py-3 text-body-md font-semibold text-accent-cyan font-mono">{row.node}</td>
                      <td className="px-4 py-3 text-body-md text-text-secondary">{row.location}</td>
                      <td className="px-4 py-3 text-body-md text-text-primary font-mono">{row.capacity}</td>
                      <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                      <td className="px-4 py-3 text-body-md text-accent-cyan font-mono">{row.contribution}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Expansion Plan */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-lg p-6 border border-accent-cyan/30"
            style={{ background: 'rgba(0,212,255,0.06)' }}
          >
            <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
              <Globe size={18} className="text-accent-cyan" />
              Global Expansion Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Kumamoto, Japan (JASM): 28nm/12nm/16nm, operational 2024',
                'Phoenix, Arizona: 4nm/3nm, Phase 1 2025, Phase 2 2028',
                'Dresden, Germany (ESMC): 28nm/22nm, planning stage',
                'Kaohsiung: 28nm/7nm capacity expansion',
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: easeOutExpo }}
                  viewport={{ once: true }}
                  className="flex items-start gap-2"
                >
                  <ArrowUpRight size={14} className="text-accent-cyan mt-1 flex-shrink-0" />
                  <span className="text-body-md text-text-secondary">{plan}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 4: Samsung Foundry ── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, #111118 0%, #161620 100%)' }}>
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="SAMSUNG ELECTRONICS · FOUNDRY" />

          {/* Samsung Header Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-bg-elevated border border-border-subtle rounded-lg p-6 mb-8 hover:border-border-active transition-all duration-200"
            style={{ borderLeft: '4px solid #00D4FF' }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-heading-md font-display text-text-primary">Samsung Foundry</h2>
                  <span className="text-mono-sm text-text-muted">KRX: 005930</span>
                </div>
                <p className="text-body-md text-text-secondary">Suwon, South Korea · Integrated device manufacturer with foundry services</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {['3nm GAA', '2nm 2025', 'Taylor Fab Under Construction'].map((badge) => (
                  <span key={badge} className="px-2.5 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded text-mono-sm text-accent-cyan">{badge}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border-subtle">
              {[
                { label: 'Foundry Revenue', value: '$12B' },
                { label: 'Net Margin', value: '~15%' },
                { label: 'Market Share', value: '13%' },
                { label: 'GAA Lead', value: 'Yes' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-data-md text-accent-cyan font-mono">{stat.value}</div>
                  <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fab Locations */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <Factory size={18} className="text-accent-cyan" />
                Fab Locations
              </h3>
              <div className="space-y-3">
                {samsungFabs.map((fab, i) => (
                  <motion.div
                    key={fab.name}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3, ease: easeOutExpo }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-3 bg-bg-surface rounded border border-border-subtle hover:border-accent-cyan/40 transition-all duration-200"
                  >
                    <div>
                      <div className="text-body-md font-semibold text-text-primary">{fab.name}</div>
                      <div className="text-body-sm text-text-secondary">{fab.role}</div>
                    </div>
                    <StatusBadge status={fab.status === 'Building' ? 'Building' : 'Active'} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* GAA Comparison */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-2 flex items-center gap-2">
                <Cpu size={18} className="text-accent-cyan" />
                GAA vs FinFET Comparison
              </h3>
              <p className="text-body-sm text-text-secondary mb-4">
                Samsung is the only foundry shipping GAA (Gate-All-Around) transistors at 3nm, while TSMC uses FinFET at 3nm.
              </p>
              <GaaComparisonChart />
              <div className="mt-3 p-3 bg-bg-surface rounded border border-border-subtle">
                <div className="text-body-sm text-text-secondary">
                  <span className="text-accent-cyan font-semibold">Samsung advantage:</span> GAA architecture offers better electrostatic control
                </div>
                <div className="text-body-sm text-text-secondary mt-1">
                  <span className="text-info font-semibold">TSMC advantage:</span> Yield maturity and customer ecosystem lock-in
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Intel + Others ── */}
      <section className="py-16 px-6 bg-bg-base">
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="OTHER FOUNDRIES" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Intel Foundry */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-warning/50 transition-all duration-200"
              style={{ borderLeft: '3px solid #F59E0B' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Microchip size={18} className="text-warning" />
                <h3 className="text-heading-sm font-display text-text-primary">Intel Foundry</h3>
              </div>
              <p className="text-body-sm text-text-secondary mb-4">IDM 2.0 strategy — transitioning from internal-only to external foundry services.</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Revenue Target</span>
                  <span className="text-warning font-mono">$5B (2027)</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Leading Node</span>
                  <span className="text-text-primary font-mono">18A</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Fabs</span>
                  <span className="text-text-primary font-mono">7</span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-3 mb-4">
                <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em] mb-2">Key Locations</div>
                <div className="space-y-1">
                  {['Ocotillo, AZ', 'Ronler Acres, OR', 'New Albany, OH', 'Leixlip, Ireland', 'Kiryat Gat, Israel', 'Magdeburg, Germany'].map((loc) => (
                    <div key={loc} className="flex items-center gap-1.5 text-body-sm text-text-secondary">
                      <MapPin size={10} className="text-warning" />
                      {loc}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-warning/5 border border-warning/20 rounded">
                <span className="text-mono-sm text-warning">Node Roadmap: 20A → 18A (2025) → 14A (2026)</span>
              </div>
            </motion.div>

            {/* SMIC */}
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
              style={{ borderLeft: '3px solid #E8E8EC' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={18} className="text-text-primary" />
                <h3 className="text-heading-sm font-display text-text-primary">SMIC 中芯国际</h3>
              </div>
              <p className="text-body-sm text-text-secondary mb-4">China's largest foundry. Domestic market focus under US sanctions context.</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Revenue</span>
                  <span className="text-text-primary font-mono">$8B</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Leading Node</span>
                  <span className="text-text-primary font-mono">7nm (N+2)</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Market Share</span>
                  <span className="text-text-primary font-mono">5%</span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-3">
                <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em] mb-2">Fab Locations</div>
                <div className="space-y-1">
                  {smicFabs.map((fab) => (
                    <div key={fab.name} className="flex items-center justify-between text-body-sm">
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        <MapPin size={10} className="text-text-muted" />
                        {fab.name}
                      </span>
                      <span className="text-text-muted">{fab.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* GF + UMC */}
            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
              style={{ borderLeft: '3px solid #9A9AAF' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Factory size={18} className="text-text-secondary" />
                <h3 className="text-heading-sm font-display text-text-primary">Mature Node Specialists</h3>
              </div>

              {/* GlobalFoundries */}
              <div className="mb-4">
                <h4 className="text-body-md font-semibold text-text-primary mb-2">GlobalFoundries</h4>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-text-muted">Revenue</span>
                  <span className="text-text-secondary font-mono">$7B</span>
                </div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span className="text-text-muted">Strategy</span>
                  <span className="text-text-secondary">Feature-Rich</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['Malta, NY', 'Burlington, VT', 'Dresden', 'Singapore'].map((loc) => (
                    <span key={loc} className="px-1.5 py-0.5 bg-bg-surface rounded text-mono-sm text-text-muted">{loc}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-border-subtle pt-3">
                <h4 className="text-body-md font-semibold text-text-primary mb-2">UMC 联电</h4>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-text-muted">Revenue</span>
                  <span className="text-text-secondary font-mono">$5B</span>
                </div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span className="text-text-muted">Focus</span>
                  <span className="text-text-secondary">22nm/28nm</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['Hsinchu', 'Japan', 'Singapore', 'Suzhou'].map((loc) => (
                    <span key={loc} className="px-1.5 py-0.5 bg-bg-surface rounded text-mono-sm text-text-muted">{loc}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 6: Comparison Matrix ── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, #111118 0%, #161620 100%)' }}>
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="COMPARISON MATRIX" />
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-heading-md font-display text-text-primary mb-6"
          >
            Foundry Comparison Matrix
          </motion.h2>

          <ComparisonMatrix />

          {/* Capacity Projection */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
          >
            <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-accent-cyan" />
              Capacity Projection (K Wafers/Month)
            </h3>
            <CapacityProjectionChart />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Inline icon components (to avoid tree-shake issues)
   ────────────────────────────────────────────── */
function PieChartIcon({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
