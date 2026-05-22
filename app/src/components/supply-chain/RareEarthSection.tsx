import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import { AlertTriangle } from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: easeOutExpo },
  }),
};

/* ── data ── */
const reservesData = [
  { name: 'China', value: 4400, share: 38.0, mines: 'Bayan Obo, Sichuan, Jiangxi', policy: 'Export controls active' },
  { name: 'Brazil', value: 2200, share: 19.0, mines: 'Serra Verde', policy: 'Expanding' },
  { name: 'India', value: 690, share: 6.0, mines: 'Odisha, Kerala', policy: 'Limited production' },
  { name: 'Australia', value: 570, share: 4.9, mines: 'Mt Weld, Nolans', policy: 'Lynas expansion' },
  { name: 'USA', value: 190, share: 1.6, mines: 'Mountain Pass', policy: 'MP Materials' },
  { name: 'Russia', value: 100, share: 0.9, mines: 'Tomtor, Lovozero', policy: 'Developing' },
  { name: 'Vietnam', value: 220, share: 1.9, mines: 'Dong Pao', policy: 'Japan partnership' },
  { name: 'Greenland', value: 150, share: 1.3, mines: 'Kvanefjeld', policy: 'Exploration' },
];

const quotaData = [
  { year: '2020', light: 120350, heavy: 10150 },
  { year: '2021', light: 148850, heavy: 19150 },
  { year: '2022', light: 190850, heavy: 19200 },
  { year: '2023', light: 220850, heavy: 20150 },
  { year: '2024', light: 250850, heavy: 19150 },
];

const totalGlobal = reservesData.reduce((s, d) => s + d.value, 0);

/* ── ECharts option: treemap ── */
function getTreemapOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontFamily: 'Inter' },
      formatter: (p: any) => {
        const d = p.data;
        return `<div style="font-weight:600;margin-bottom:4px">${d.name}</div>
                <div>Reserves: <b style="color:#FFB84D">${d.value.toLocaleString()}万吨</b></div>
                <div>Share: <b>${((d.value / totalGlobal) * 100).toFixed(1)}%</b></div>`;
      },
    },
    series: [{
      type: 'treemap',
      width: '100%', height: '100%',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      label: {
        show: true,
        formatter: '{name}\n{bValue|{value}万吨}',
        rich: { bValue: { fontSize: 12, color: '#E8E8EC', fontWeight: 600, lineHeight: 18 } },
        fontSize: 13, color: '#0A0A0F', fontWeight: 700, fontFamily: 'Space Grotesk',
      },
      itemStyle: { borderColor: '#0A0A0F', borderWidth: 2, gapWidth: 2 },
      levels: [{
        itemStyle: { borderColor: '#0A0A0F', borderWidth: 2, gapWidth: 2 },
        colorMappingBy: 'value',
      }],
      data: reservesData.map((d) => ({
        name: d.name,
        value: d.value,
        itemStyle: {
          color: d.value > 4000
            ? '#FFB84D'
            : d.value > 2000
              ? '#E5A344'
              : d.value > 500
                ? '#CC8E3A'
                : d.value > 200
                  ? '#B37830'
                  : '#8A5E26',
        },
      })),
    }],
  };
}

/* ── ECharts option: stacked bar (quota) ── */
function getQuotaOption() {
  const years = quotaData.map((d) => d.year);
  const light = quotaData.map((d) => (d.light / 10000).toFixed(1));
  const heavy = quotaData.map((d) => (d.heavy / 10000).toFixed(1));
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontFamily: 'Inter' },
      axisPointer: { type: 'shadow' },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category', data: years,
      axisLine: { lineStyle: { color: '#1E1E28' } },
      axisLabel: { color: '#9A9AAF', fontFamily: 'JetBrains Mono', fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '万吨',
      nameTextStyle: { color: '#6B6B80', fontSize: 11, fontFamily: 'Inter' },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#1E1E28', type: 'dashed' } },
      axisLabel: { color: '#6B6B80', fontSize: 11, fontFamily: 'JetBrains Mono' },
    },
    series: [
      {
        name: 'Light RE', type: 'bar', stack: 'total',
        data: light,
        itemStyle: { color: '#FFB84D', borderRadius: [0, 0, 0, 0] },
        barWidth: '40%',
        emphasis: { itemStyle: { color: '#FFC570' } },
      },
      {
        name: 'Medium-Heavy RE', type: 'bar', stack: 'total',
        data: heavy,
        itemStyle: { color: '#B37830', borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: '#CC8E3A' } },
      },
    ],
    legend: {
      data: ['Light RE', 'Medium-Heavy RE'],
      textStyle: { color: '#9A9AAF', fontSize: 11, fontFamily: 'Inter' },
      bottom: 0,
      itemWidth: 12, itemHeight: 8,
    },
    animationDuration: 800,
    animationEasing: 'cubicOut',
  };
}

/* ── sort helpers ── */
type SortKey = 'name' | 'value' | 'share';
type SortDir = 'asc' | 'desc';

export default function RareEarthSection() {
  const [sortKey, setSortKey] = useState<SortKey>('value');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) { setSortDir((d) => (d === 'asc' ? 'desc' : 'asc')); return prev; }
      setSortDir('desc');
      return key;
    });
  }, []);

  const sorted = [...reservesData].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'name') return a.name.localeCompare(b.name) * mul;
    return ((a[sortKey] as number) - (b[sortKey] as number)) * mul;
  });

  return (
    <section id="rare-earth" className="w-full py-16 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(180deg, #111118 0%, #161620 100%)' }}>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="max-w-[1440px] mx-auto mb-8"
      >
        <span className="text-mono-sm text-accent-amber tracking-[0.06em] uppercase">Rare Earth Elements</span>
      </motion.div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Left: Treemap + Table ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="space-y-6"
        >
          {/* Treemap */}
          <div className="bg-bg-elevated border border-border-subtle rounded-lg p-5 transition-all duration-200 hover:border-border-active"
            style={{ boxShadow: '0 0 40px rgba(255,184,77,0.06)' }}>
            <h3 className="text-heading-sm text-text-primary font-display mb-4">Global Rare Earth Reserves</h3>
            <div className="h-[320px]">
              <ReactEChartsCore option={getTreemapOption()} style={{ height: '100%', width: '100%' }} notMerge={true} />
            </div>
          </div>

          {/* Reserves table */}
          <div className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-bg-surface">
                    {(['name', 'value', 'share', 'mines', 'policy'] as const).map((col) => (
                      <th key={col}
                        onClick={() => col === 'name' || col === 'value' || col === 'share' ? handleSort(col as SortKey) : undefined}
                        className={`px-4 py-3 text-body-sm uppercase text-text-muted tracking-[0.04em] font-medium border-b border-border-subtle
                          ${col === 'name' || col === 'value' || col === 'share' ? 'cursor-pointer hover:text-accent-amber select-none' : ''}`}>
                          {col === 'name' ? 'Country' : col === 'value' ? 'Reserves (万吨)' : col === 'share' ? 'Share' : col === 'mines' ? 'Key Mines' : 'Policy'}
                          {sortKey === col && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                        </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, i) => (
                    <motion.tr key={row.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                      viewport={{ once: true }}
                      className="border-b border-border-subtle last:border-0 bg-bg-base hover:bg-bg-elevated transition-all duration-200 group cursor-default"
                    >
                      <td className="px-4 py-3 relative">
                        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-amber opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <span className="font-medium text-text-primary">{row.name}</span>
                      </td>
                      <td className="px-4 py-3 text-data-md text-accent-amber">{row.value.toLocaleString()}</td>
                      <td className="px-4 py-3 text-body-md text-text-primary">{row.share}%</td>
                      <td className="px-4 py-3 text-body-sm text-text-secondary max-w-[180px] truncate">{row.mines}</td>
                      <td className="px-4 py-3 text-body-sm text-text-secondary">{row.policy}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* ── Right: Quota chart + metrics + alert ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Quota bar chart */}
          <div className="bg-bg-elevated border border-border-subtle rounded-lg p-5 transition-all duration-200 hover:border-border-active"
            style={{ boxShadow: '0 0 40px rgba(255,184,77,0.06)' }}>
            <h3 className="text-heading-sm text-text-primary font-display mb-2">China Rare Earth Production Quota</h3>
            <p className="text-body-sm text-text-muted mb-4">2020–2024 annual quotas (light + medium-heavy rare earth)</p>
            <div className="h-[280px]">
              <ReactEChartsCore option={getQuotaOption()} style={{ height: '100%', width: '100%' }} notMerge={true} />
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: '2024 China Quota', value: '270,000', unit: 'tonnes', color: 'text-accent-amber' },
              { label: 'Light RE Growth', value: '+6.36%', unit: 'YoY', color: 'text-success' },
              { label: 'Heavy RE Quota', value: '20,000', unit: 'tonnes', color: 'text-text-primary' },
            ].map((m, i) => (
              <motion.div key={m.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                className="bg-bg-elevated border border-border-subtle rounded-lg p-5 text-center hover:border-border-active transition-all duration-200">
                <div className={`text-data-md font-mono ${m.color}`}>{m.value}</div>
                <div className="text-body-sm text-text-muted mt-1">{m.label}</div>
                <div className="text-mono-sm text-text-muted">{m.unit}</div>
              </motion.div>
            ))}
          </div>

          {/* Policy alert card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.2 }}
            className="rounded-lg p-5 border"
            style={{ background: 'rgba(255,184,77,0.06)', borderColor: 'rgba(255,184,77,0.2)' }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-heading-sm text-text-primary font-display mb-2">Export Control Alert</h4>
                <p className="text-body-md text-text-secondary leading-relaxed mb-3">
                  Since April 2025, China has implemented export licensing requirements for certain medium-heavy rare earths including dysprosium (Dy) and terbium (Tb). This affects global supply chains for high-performance magnets used in data center cooling systems.
                </p>
                <span className="inline-flex items-center gap-1.5 text-mono-sm text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Source: China Ministry of Commerce · Tier 1
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
