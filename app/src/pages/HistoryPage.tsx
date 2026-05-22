/**
 * @file HistoryPage.tsx
 * @description Changelog and data history page showing versioned updates,
 * data pipeline changes, and historical milestones for the platform.
 *
 * @dependencies react-i18next
 */
import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

// ─── Historical Data (IEA & industry forecasts) ────────────────
interface YearlyData {
  year: number;
  dcCount: number;         // Global data center count
  capacityGW: number;      // Total installed compute capacity (GW)
  powerTWh: number;        // Total DC power consumption (TWh)
  foundryRevenueB: number; // Global foundry revenue ($B)
  euvUnits: number;        // Cumulative EUV units shipped
}

const historicalData: YearlyData[] = [
  { year: 2019, dcCount: 4200,  capacityGW: 38,  powerTWh: 204,  foundryRevenueB: 58.2,  euvUnits: 62  },
  { year: 2020, dcCount: 4600,  capacityGW: 44,  powerTWh: 230,  foundryRevenueB: 65.1,  euvUnits: 100 },
  { year: 2021, dcCount: 5100,  capacityGW: 52,  powerTWh: 260,  foundryRevenueB: 78.5,  euvUnits: 150 },
  { year: 2022, dcCount: 5600,  capacityGW: 60,  powerTWh: 300,  foundryRevenueB: 85.3,  euvUnits: 210 },
  { year: 2023, dcCount: 6200,  capacityGW: 70,  powerTWh: 360,  foundryRevenueB: 72.1,  euvUnits: 280 },
  { year: 2024, dcCount: 6800,  capacityGW: 82,  powerTWh: 410,  foundryRevenueB: 88.0,  euvUnits: 360 },
  { year: 2025, dcCount: 7500,  capacityGW: 96,  powerTWh: 485,  foundryRevenueB: 95.0,  euvUnits: 418 },
  { year: 2026, dcCount: 8300,  capacityGW: 112, powerTWh: 560,  foundryRevenueB: 105.0, euvUnits: 490 },
  { year: 2027, dcCount: 9200,  capacityGW: 130, powerTWh: 650,  foundryRevenueB: 118.0, euvUnits: 570 },
  { year: 2028, dcCount: 10100, capacityGW: 150, powerTWh: 750,  foundryRevenueB: 130.0, euvUnits: 660 },
  { year: 2029, dcCount: 11000, capacityGW: 172, powerTWh: 850,  foundryRevenueB: 142.0, euvUnits: 760 },
  { year: 2030, dcCount: 12000, capacityGW: 195, powerTWh: 945,  foundryRevenueB: 155.0, euvUnits: 870 },
];

const metrics = [
  { key: 'dcCount', label: 'Data Centers', unit: '', color: '#A855F7', format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v) },
  { key: 'capacityGW', label: 'Compute Capacity', unit: 'GW', color: '#00D4FF', format: (v: number) => String(v) },
  { key: 'powerTWh', label: 'Power Consumption', unit: 'TWh', color: '#FFB84D', format: (v: number) => String(v) },
  { key: 'foundryRevenueB', label: 'Foundry Revenue', unit: '$B', color: '#22C55E', format: (v: number) => `$${v.toFixed(0)}B` },
  { key: 'euvUnits', label: 'EUV Units (Cumul.)', unit: 'units', color: '#F59E0B', format: (v: number) => String(v) },
] as const;

type MetricKey = typeof metrics[number]['key'];

export default function HistoryPage() {
  const { t } = useTranslation(['history', 'common']);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMetrics, setSelectedMetrics] = useState<Set<MetricKey>>(new Set(['dcCount', 'powerTWh']));
  const [compareMode, setCompareMode] = useState(false);
  const [compareYear, setCompareYear] = useState(2020);

  const filteredData = useMemo(() => {
    return historicalData.filter((d) => d.year <= Math.max(selectedYear, compareMode ? compareYear : selectedYear) + 1);
  }, [selectedYear, compareMode, compareYear]);

  const currentData = historicalData.find((d) => d.year === selectedYear);
  const compareData = compareMode ? historicalData.find((d) => d.year === compareYear) : null;

  const toggleMetric = useCallback((key: MetricKey) => {
    setSelectedMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      if (next.size === 0) next.add('dcCount');
      return next;
    });
  }, []);

  // ─── ECharts Option ─────────────────────
  const chartOption = useMemo(() => {
    const years = filteredData.map((d) => d.year);
    const selectedMetricsArr = Array.from(selectedMetrics);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#111118',
        borderColor: '#2A2A3A',
        textStyle: { color: '#E8E8EC', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
        axisPointer: { lineStyle: { color: '#2A2A3A' } },
      },
      legend: {
        data: selectedMetricsArr.map((k) => metrics.find((m) => m.key === k)?.label || k),
        top: 0,
        textStyle: { color: '#9A9AAF', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
        itemWidth: 16,
        itemHeight: 2,
      },
      grid: { left: 55, right: 20, top: 40, bottom: 30 },
      xAxis: {
        type: 'category' as const,
        data: years,
        axisLine: { lineStyle: { color: '#2A2A3A' } },
        axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 },
        splitLine: { show: false },
      },
      yAxis: selectedMetricsArr.map((key, i) => {
        const m = metrics.find((mk) => mk.key === key)!;
        return {
          type: 'value' as const,
          name: m.unit,
          position: i === 0 ? ('left' as const) : ('right' as const),
          axisLine: { lineStyle: { color: m.color } },
          axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 },
          splitLine: { lineStyle: { color: '#1E1E28', type: 'dashed' as const } },
        };
      }),
      series: selectedMetricsArr.map((key, i) => {
        const m = metrics.find((mk) => mk.key === key)!;
        return {
          name: m.label,
          type: 'line',
          data: filteredData.map((d) => d[key]),
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          yAxisIndex: i,
          lineStyle: { color: m.color, width: 2 },
          itemStyle: { color: m.color },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: m.color + '30' },
              { offset: 1, color: m.color + '00' },
            ]),
          },
          markLine: compareMode ? {
            data: [
              { xAxis: compareYear, lineStyle: { color: '#F59E0B', type: 'dashed', width: 1 }, label: { show: true, formatter: String(compareYear), color: '#F59E0B', fontSize: 10 } },
              { xAxis: selectedYear, lineStyle: { color: '#22C55E', type: 'dashed', width: 1 }, label: { show: true, formatter: String(selectedYear), color: '#22C55E', fontSize: 10 } },
            ],
          } : undefined,
        };
      }),
    };
  }, [filteredData, selectedMetrics, compareMode, compareYear, selectedYear]);

  // ─── Region distribution pie chart ────────────────
  const regionPieOption = useMemo(() => {
    const regions = [
      { name: 'North America', value: 38, color: '#00D4FF' },
      { name: 'Asia Pacific', value: 30, color: '#A855F7' },
      { name: 'Europe', value: 20, color: '#FFB84D' },
      { name: 'China', value: 8, color: '#22C55E' },
      { name: 'Others', value: 4, color: '#F59E0B' },
    ];
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#111118',
        borderColor: '#2A2A3A',
        textStyle: { color: '#E8E8EC', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
      },
      series: [{
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '50%'],
        data: regions.map((r) => ({
          name: r.name,
          value: r.value,
          itemStyle: { color: r.color },
          label: { color: '#9A9AAF', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 },
        })),
        label: { show: true, position: 'outside', formatter: '{b}: {d}%' },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
      }],
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="pt-28 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">{t('common:breadcrumb.home')}</Link>
            <span>/</span>
            <span className="text-text-secondary">{t('history:pageTitle')}</span>
          </nav>
          <h1 className="text-title text-text-primary">{t('history:pageTitle')}</h1>
          <p className="text-body text-text-secondary mt-3 max-w-2xl">
            {t('history:pageSubtitle')}
          </p>
        </div>
      </header>

      {/* Year Slider */}
      <section className="px-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#111118] border border-[#1E1E28] rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-mono-sm text-[#6B6B80] uppercase tracking-wider">{t('history:timeline.title', 'Timeline')}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-3 py-1 rounded text-mono-sm border transition-colors cursor-pointer ${
                    compareMode
                      ? 'bg-[#1E1E28] border-[#00D4FF] text-[#00D4FF]'
                      : 'border-[#2A2A3A] text-[#6B6B80] hover:text-[#E8E8EC] hover:border-[#6B6B80]'
                  }`}
                >
                  {t('history:compare', 'Compare')}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {compareMode && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-mono-sm text-[#F59E0B]">A:</span>
                  <select
                    value={compareYear}
                    onChange={(e) => setCompareYear(Number(e.target.value))}
                    className="bg-[#181820] border border-[#2A2A3A] rounded px-2 py-1 text-mono-sm text-[#E8E8EC] cursor-pointer"
                  >
                    {historicalData.map((d) => (
                      <option key={d.year} value={d.year}>{d.year}</option>
                    ))}
                  </select>
                  <span className="text-mono-sm text-[#22C55E] ml-2">B:</span>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="range"
                  min={2019}
                  max={2030}
                  step={1}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00D4FF ${((selectedYear - 2019) / 11) * 100}%, #1E1E28 ${((selectedYear - 2019) / 11) * 100}%)`,
                  }}
                />
              </div>
              <span className="text-data-md text-[#00D4FF] font-mono w-14 text-right">{selectedYear}</span>
            </div>
            <div className="flex justify-between mt-1.5">
              {historicalData.map((d) => (
                <span key={d.year} className="text-[9px] font-mono text-[#6B6B80]">{d.year}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metric Selector Chips */}
      <section className="px-6 pb-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => toggleMetric(m.key)}
              className={`px-3 py-1.5 rounded-full text-mono-sm border transition-all cursor-pointer ${
                selectedMetrics.has(m.key)
                  ? 'border-current'
                  : 'border-[#2A2A3A] text-[#6B6B80] hover:text-[#9A9AAF] hover:border-[#6B6B80]'
              }`}
              style={selectedMetrics.has(m.key) ? { color: m.color, borderColor: m.color, backgroundColor: m.color + '15' } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* KPI Summary Cards for Selected Year */}
      <section className="px-6 pb-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {currentData && metrics.map((m) => {
            const val = currentData[m.key];
            const compVal = compareData ? compareData[m.key] : null;
            const pctChange = compVal ? ((val - compVal) / compVal * 100) : null;

            return (
              <div key={m.key} className="bg-[#111118] border border-[#1E1E28] rounded-lg p-4">
                <span className="text-[10px] font-mono uppercase text-[#6B6B80] tracking-wider block">{m.label}</span>
                <span className="text-data-md font-mono block mt-1" style={{ color: m.color }}>
                  {m.format(val)} {m.unit}
                </span>
                {pctChange !== null && (
                  <span className={`text-mono-sm mt-1 block ${pctChange >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {pctChange >= 0 ? '▲' : '▼'} {Math.abs(pctChange).toFixed(1)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Chart */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#111118] border border-[#1E1E28] rounded-lg p-5">
            <h3 className="text-heading-sm text-[#E8E8EC] mb-4">
              {t('history:trendTitle', 'AI Infrastructure Growth Trend')}
            </h3>
            <div style={{ height: 380 }}>
              <ReactECharts option={chartOption} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'canvas' }} />
            </div>
            <p className="text-mono-sm text-[#6B6B80] mt-3">
              {t('history:dataNote', 'Data: IEA Global Energy Review, TrendForce, company reports. 2026-2030 values are projected forecasts.')}
            </p>
          </div>
        </div>
      </section>

      {/* Region Distribution + Data Table */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="bg-[#111118] border border-[#1E1E28] rounded-lg p-5">
            <h3 className="text-heading-sm text-[#E8E8EC] mb-2">
              {t('history:regionDist', 'Data Center Distribution by Region')}
            </h3>
            <div style={{ height: 280 }}>
              <ReactECharts option={regionPieOption} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'canvas' }} />
            </div>
          </div>

          {/* Data Table */}
          <div className="lg:col-span-2 bg-[#111118] border border-[#1E1E28] rounded-lg p-5 overflow-x-auto">
            <h3 className="text-heading-sm text-[#E8E8EC] mb-4">
              {t('history:yearlyData', 'Yearly Data Summary')}
            </h3>
            <table className="w-full text-mono-sm">
              <thead>
                <tr className="border-b border-[#1E1E28]">
                  <th className="text-left py-2 px-2 text-[#6B6B80] font-normal">Year</th>
                  <th className="text-right py-2 px-2 text-[#6B6B80] font-normal">DC Count</th>
                  <th className="text-right py-2 px-2 text-[#6B6B80] font-normal">Capacity</th>
                  <th className="text-right py-2 px-2 text-[#6B6B80] font-normal">Power</th>
                  <th className="text-right py-2 px-2 text-[#6B6B80] font-normal">Revenue</th>
                  <th className="text-right py-2 px-2 text-[#6B6B80] font-normal">EUV</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((d) => (
                  <tr
                    key={d.year}
                    className={`border-b border-[#1E1E28]/50 transition-colors ${
                      d.year === selectedYear ? 'bg-[#00D4FF]/10' : 'hover:bg-[#181820]'
                    }`}
                  >
                    <td className="py-2 px-2 text-[#E8E8EC] font-medium">{d.year}</td>
                    <td className="py-2 px-2 text-right text-[#A855F7]">{d.dcCount >= 1000 ? `${(d.dcCount / 1000).toFixed(1)}K` : d.dcCount}</td>
                    <td className="py-2 px-2 text-right text-[#00D4FF]">{d.capacityGW} GW</td>
                    <td className="py-2 px-2 text-right text-[#FFB84D]">{d.powerTWh} TWh</td>
                    <td className="py-2 px-2 text-right text-[#22C55E]">${d.foundryRevenueB}B</td>
                    <td className="py-2 px-2 text-right text-[#F59E0B]">{d.euvUnits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
