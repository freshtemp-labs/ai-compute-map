/** @file LithographySection.tsx - Semiconductor lithography equipment section. */
import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: easeOutExpo },
  }),
};

/* ── data ── */
const lithoMarket = [
  { name: 'ASML', units: 418, share: 61.2, revenue: 23.5, color: '#00D4FF' },
  { name: 'Canon', units: 233, share: 34.1, revenue: 1.65, color: '#FFB84D' },
  { name: 'Nikon', units: 32, share: 4.7, revenue: 1.25, color: '#6B6B80' },
];

const techTable = [
  { tech: 'EUV', leader: 'ASML', share: '100%', price: '€1.9B/unit', node: '≤7nm' },
  { tech: 'ArFi', leader: 'ASML', share: '97.7%', price: '€0.74B/unit', node: '7–16nm' },
  { tech: 'ArF dry', leader: 'ASML', share: '80%', price: '€0.3B/unit', node: '28–45nm' },
  { tech: 'KrF', leader: 'Canon/ASML/Nikon', share: 'Shared', price: '€0.05B/unit', node: '40–90nm' },
  { tech: 'i-line', leader: 'Canon', share: '~70%', price: '€0.02B/unit', node: '≥90nm' },
];

const asmlRevenue = [
  { year: '2020', euv: 9.0, arfi: 5.5, arf: 2.0, krf: 3.5, iline: 1.5, metrology: 2.5 },
  { year: '2021', euv: 12.5, arfi: 6.2, arf: 2.3, krf: 3.8, iline: 1.6, metrology: 2.8 },
  { year: '2022', euv: 16.0, arfi: 6.8, arf: 2.5, krf: 4.0, iline: 1.7, metrology: 3.1 },
  { year: '2023', euv: 19.5, arfi: 7.5, arf: 2.6, krf: 4.1, iline: 1.7, metrology: 3.4 },
  { year: '2024', euv: 24.0, arfi: 8.2, arf: 2.8, krf: 4.3, iline: 1.8, metrology: 3.8 },
];

/* ── ECharts: donut ── */
function getDonutOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontFamily: 'Inter' },
      formatter: (p: { name: string; color: string; data: { units: number; share: number; revenue: number } }) =>
        `<div style="font-weight:600;margin-bottom:4px">${p.name}</div>
         <div>Units: <b style="color:${p.color}">${p.data.units.toLocaleString()}</b></div>
         <div>Share: <b>${p.data.share}%</b></div>
         <div>Revenue: <b>$${p.data.revenue}B</b></div>`,
    },
    series: [{
      type: 'pie',
      radius: ['52%', '76%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      padAngle: 2,
      itemStyle: { borderRadius: 6 },
      label: {
        show: true,
        position: 'outside',
        formatter: '{name|{b}}\n{value|{c} units}',
        rich: {
          name: { fontSize: 12, color: '#E8E8EC', fontFamily: 'Space Grotesk', fontWeight: 600 },
          value: { fontSize: 11, color: '#9A9AAF', fontFamily: 'JetBrains Mono', lineHeight: 18 },
        },
      },
      labelLine: { lineStyle: { color: '#2A2A3A' }, smooth: 0.2 },
      emphasis: {
        scaleSize: 8,
        itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,212,255,0.3)' },
      },
      data: lithoMarket.map((d) => ({
        name: d.name,
        value: d.units,
        units: d.units,
        share: d.share,
        revenue: d.revenue,
        itemStyle: { color: d.color },
      })),
    }, {
      type: 'pie',
      radius: ['0%', '0%'],
      center: ['50%', '50%'],
      silent: true,
      label: {
        show: true,
        position: 'center',
        formatter: '{value|683}\n{label|units shipped}',
        rich: {
          value: { fontSize: 32, fontWeight: 700, color: '#E8E8EC', fontFamily: 'Space Grotesk', lineHeight: 40 },
          label: { fontSize: 11, color: '#6B6B80', fontFamily: 'Inter', lineHeight: 20 },
        },
      },
      data: [{ value: 1 }],
    }],
    animationType: 'scale',
    animationDuration: 800,
    animationEasing: 'cubicOut',
  };
}

/* ── ECharts: stacked bar (ASML revenue) ── */
function getAsmlRevenueOption() {
  const years = asmlRevenue.map((d) => d.year);
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontFamily: 'Inter' },
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['EUV', 'ArFi', 'ArF dry', 'KrF', 'i-line', 'Metrology'],
      textStyle: { color: '#9A9AAF', fontSize: 11, fontFamily: 'Inter' },
      bottom: 0,
      itemWidth: 12, itemHeight: 8,
    },
    grid: { left: '3%', right: '4%', bottom: '18%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category', data: years,
      axisLine: { lineStyle: { color: '#1E1E28' } },
      axisLabel: { color: '#9A9AAF', fontFamily: 'JetBrains Mono', fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '$B',
      nameTextStyle: { color: '#6B6B80', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#1E1E28', type: 'dashed' } },
      axisLabel: { color: '#6B6B80', fontSize: 11, fontFamily: 'JetBrains Mono' },
    },
    series: [
      { name: 'EUV', type: 'bar', stack: 'total', data: asmlRevenue.map((d) => d.euv), itemStyle: { color: '#00D4FF' } },
      { name: 'ArFi', type: 'bar', stack: 'total', data: asmlRevenue.map((d) => d.arfi), itemStyle: { color: '#33DFFF' } },
      { name: 'ArF dry', type: 'bar', stack: 'total', data: asmlRevenue.map((d) => d.arf), itemStyle: { color: '#66E9FF' } },
      { name: 'KrF', type: 'bar', stack: 'total', data: asmlRevenue.map((d) => d.krf), itemStyle: { color: '#FFB84D' } },
      { name: 'i-line', type: 'bar', stack: 'total', data: asmlRevenue.map((d) => d.iline), itemStyle: { color: '#B37830' } },
      { name: 'Metrology', type: 'bar', stack: 'total', data: asmlRevenue.map((d) => d.metrology), itemStyle: { color: '#6B6B80' }, itemStyle_borderRadius: [4, 4, 0, 0] as [number, number, number, number] },
    ].map((s, idx, arr) => ({
      ...s,
      itemStyle: {
        ...s.itemStyle,
        borderRadius: idx === arr.length - 1 ? ([4, 4, 0, 0] as [number, number, number, number]) : ([0, 0, 0, 0] as [number, number, number, number]),
      },
    })),
    animationDuration: 800,
    animationEasing: 'cubicOut',
  };
}

export default function LithographySection() {
  const [activeCompany, setActiveCompany] = useState<'ASML' | 'Canon' | 'Nikon'>('ASML');

  const companies: Record<string, { name: string; units: number; revenue: string; focus: string; details: string[]; color: string }> = {
    ASML: {
      name: 'ASML Holding', units: 418, revenue: '$23.5B', focus: 'EUV Monopoly — Advanced Nodes',
      color: '#00D4FF',
      details: ['EUV: 44 units @ €1.9B avg', 'DUV: 374 units', 'China Revenue: ~€9.0B', '2025 Plan: 90 EUV + 600 DUV'],
    },
    Canon: {
      name: 'Canon', units: 233, revenue: '$1.65B', focus: 'i-line / KrF — Mature Nodes',
      color: '#FFB84D',
      details: ['i-line: ~70% market share', 'KrF: Strong position', 'Japan-focused production', 'Cost-effective solutions'],
    },
    Nikon: {
      name: 'Nikon Precision', units: 32, revenue: '$1.25B', focus: 'ArF / KrF — Refurbished Focus',
      color: '#6B6B80',
      details: ['ArF: Specialized applications', 'KrF: Legacy support', '53% units refurbished', 'Japan semiconductor focus'],
    },
  };

  return (
    <section id="lithography" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-bg-base">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="max-w-[1440px] mx-auto mb-8"
      >
        <span className="text-mono-sm text-accent-cyan tracking-[0.06em] uppercase">Lithography Equipment</span>
      </motion.div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Donut chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="bg-bg-elevated border border-border-subtle rounded-lg p-5 hover:border-border-active transition-all duration-200"
        >
          <h3 className="text-heading-sm text-text-primary font-display mb-1">2024 Global Lithography Market</h3>
          <p className="text-body-sm text-text-muted mb-2">Total units shipped: 683</p>
          <div className="h-[340px]">
            <ReactEChartsCore option={getDonutOption()} style={{ height: '100%', width: '100%' }} notMerge={true} />
          </div>
        </motion.div>

        {/* ASML revenue stacked bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.1 }}
          className="bg-bg-elevated border border-border-subtle rounded-lg p-5 hover:border-border-active transition-all duration-200"
        >
          <h3 className="text-heading-sm text-text-primary font-display mb-1">ASML Revenue Breakdown</h3>
          <p className="text-body-sm text-text-muted mb-2">Revenue by technology segment ($B)</p>
          <div className="h-[340px]">
            <ReactEChartsCore option={getAsmlRevenueOption()} style={{ height: '100%', width: '100%' }} notMerge={true} />
          </div>
        </motion.div>
      </div>

      {/* Company cards row */}
      <div className="max-w-[1440px] mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(companies) as Array<'ASML' | 'Canon' | 'Nikon'>).map((key, i) => {
          const c = companies[key];
          const isActive = activeCompany === key;
          return (
            <motion.div
              key={key} custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              onClick={() => setActiveCompany(key)}
              className={`relative rounded-lg p-5 border cursor-pointer transition-all duration-300 overflow-hidden ${
                isActive ? 'border-opacity-100' : 'border-opacity-60 hover:border-opacity-100'
              }`}
              style={{
                background: isActive ? `${c.color}08` : '#111118',
                borderColor: isActive ? c.color : '#1E1E28',
                boxShadow: isActive ? `0 0 40px ${c.color}20` : 'none',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-heading-sm font-display" style={{ color: c.color }}>{c.name}</h4>
                <span className="text-data-md font-mono text-text-primary">{c.units}</span>
              </div>
              <div className="text-body-sm text-text-secondary mb-3">{c.focus}</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <div className="text-mono-sm text-text-muted">Revenue</div>
                  <div className="text-data-md font-mono text-text-primary">{c.revenue}</div>
                </div>
                <div>
                  <div className="text-mono-sm text-text-muted">Units</div>
                  <div className="text-data-md font-mono text-text-primary">{c.units}</div>
                </div>
              </div>
              <ul className="space-y-1">
                {c.details.map((d) => (
                  <li key={d} className="text-body-sm text-text-secondary flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: c.color }} />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Technology table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="max-w-[1440px] mx-auto mt-8 bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border-subtle">
          <h3 className="text-heading-sm text-text-primary font-display">Lithography Technology Roadmap</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-surface">
                {['Technology', 'Leader', 'Market Share', 'Price Range', 'Process Node'].map((h) => (
                  <th key={h} className="px-4 py-3 text-body-sm uppercase text-text-muted tracking-[0.04em] font-medium border-b border-border-subtle">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {techTable.map((row, i) => (
                <motion.tr key={row.tech} custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }}
                  className="border-b border-border-subtle last:border-0 bg-bg-base hover:bg-bg-elevated transition-all duration-200 group"
                >
                  <td className="px-4 py-3 relative">
                    <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="font-medium text-text-primary">{row.tech}</span>
                  </td>
                  <td className="px-4 py-3 text-body-md text-text-secondary">{row.leader}</td>
                  <td className="px-4 py-3 text-body-md text-accent-amber">{row.share}</td>
                  <td className="px-4 py-3 text-body-md text-text-secondary font-mono">{row.price}</td>
                  <td className="px-4 py-3 text-body-md text-text-secondary font-mono">{row.node}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
