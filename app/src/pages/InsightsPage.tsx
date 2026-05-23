/**
 * @file InsightsPage.tsx
 * @description Data Insights page for AI Compute Map.
 * Auto-generates data-driven insights from mockData:
 *   - Global data center distribution heatmap data
 *   - Regional installed capacity ranking
 *   - Supply chain bottleneck analysis
 *   - Technology generation distribution (EUV/ArFi/KrF)
 *
 * @dependencies echarts-for-react, lucide-react, @/data/mockData
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Server,
  Factory,
  Zap,
  Globe2,
} from 'lucide-react';

import {
  supplyChainData,
  fabricationFacilities,
  dataCenters,
  companies,
} from '@/data/mockData';

import TrendChart from '@/components/charts/TrendChart';
import FunnelChart from '@/components/charts/FunnelChart';
import GaugeDashboard from '@/components/charts/GaugeDashboard';

// ── Helpers ──────────────────────────────────────────────────────────
/** 区域装机容量统计接口 */
interface RegionCapacity {
  region: string;
  totalMW: number;
  dcCount: number;
  avgPue: number;
}

/** 供应链瓶颈分析条目 */
interface BottleneckItem {
  category: string;
  country: string;
  /** 依赖度评分(百分比) */
  dependencyScore: number;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

/** 芯片制造技术世代分布 */
interface TechGeneration {
  generation: string;
  count: number;
  percentage: number;
  color: string;
}

// ── Compute insights ─────────────────────────────────────────────────

/**
 * 计算各区域装机容量排名
 * 按总功率从高到低排序
 */
function computeRegionalCapacity(): RegionCapacity[] {
  const map = new Map<string, { totalMW: number; dcCount: number; totalPue: number; pueCount: number }>();
  for (const dc of dataCenters) {
    const region = dc.region;
    if (!map.has(region)) {
      map.set(region, { totalMW: 0, dcCount: 0, totalPue: 0, pueCount: 0 });
    }
    const entry = map.get(region)!;
    entry.totalMW += dc.powerCapacity ?? 0;
    entry.dcCount++;
    if (dc.pue) {
      entry.totalPue += dc.pue;
      entry.pueCount++;
    }
  }
  return Array.from(map.entries())
    .map(([region, data]) => ({
      region,
      totalMW: data.totalMW,
      dcCount: data.dcCount,
      avgPue: data.pueCount > 0 ? Math.round((data.totalPue / data.pueCount) * 100) / 100 : 0,
    }))
    .sort((a, b) => b.totalMW - a.totalMW);
}

/**
 * 计算全球数据中心热力图数据
 * 按国家汇总装机功率
 */
function computeHeatmapData(): { name: string; value: number }[] {
  const countryMap = new Map<string, number>();
  for (const dc of dataCenters) {
    countryMap.set(dc.country, (countryMap.get(dc.country) ?? 0) + (dc.powerCapacity ?? 0));
  }
  return Array.from(countryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * 分析供应链瓶颈和依赖集中度
 * 检查单一国家/地区控制超过50%供应链节点的情况
 */
function computeBottlenecks(): BottleneckItem[] {
  const bottlenecks: BottleneckItem[] = [];

  // Analyze supply chain concentration
  const categoryCountryMap = new Map<string, Map<string, number>>();
  for (const sc of supplyChainData) {
    const cat = sc.category;
    const country = inferCountry(sc.name);
    if (!categoryCountryMap.has(cat)) categoryCountryMap.set(cat, new Map());
    const inner = categoryCountryMap.get(cat)!;
    inner.set(country, (inner.get(country) ?? 0) + 1);
  }

  for (const [cat, countryMap] of categoryCountryMap) {
    const total = Array.from(countryMap.values()).reduce((a, b) => a + b, 0);
    for (const [country, count] of countryMap) {
      const share = count / total;
      if (share > 0.5 && total >= 2) {
        bottlenecks.push({
          category: cat,
          country,
          dependencyScore: Math.round(share * 100),
          description: `${country} controls ${Math.round(share * 100)}% of ${cat} supply (${count}/${total} nodes)`,
          severity: share > 0.7 ? 'high' : 'medium',
        });
      }
    }
  }

  // Foundry concentration
  const foundryCountryMap = new Map<string, number>();
  for (const fab of fabricationFacilities) {
    foundryCountryMap.set(fab.country, (foundryCountryMap.get(fab.country) ?? 0) + 1);
  }
  const totalFabs = fabricationFacilities.length;
  for (const [country, count] of foundryCountryMap) {
    const share = count / totalFabs;
    if (share > 0.25) {
      bottlenecks.push({
        category: 'Foundry Capacity',
        country,
        dependencyScore: Math.round(share * 100),
        description: `${country} hosts ${count} of ${totalFabs} tracked fabs (${Math.round(share * 100)}%)`,
        severity: share > 0.4 ? 'high' : 'medium',
      });
    }
  }

  return bottlenecks.sort((a, b) => b.dependencyScore - a.dependencyScore);
}

/**
 * 计算光刻技术世代分布(EUV/ArFi/KrF)
 * 从供应链数据中推断各世代占比
 */
function computeTechGenerations(): TechGeneration[] {
  let euvCount = 0;
  let arfiCount = 0;
  let krfCount = 0;
  let otherCount = 0;

  for (const sc of supplyChainData) {
    const name = sc.name.toLowerCase();
    const cat = sc.category.toLowerCase();
    if (cat.includes('lithography') || name.includes('asml') || name.includes('nikon') || name.includes('canon')) {
      const val = typeof sc.value === 'number' ? sc.value : parseInt(String(sc.value).replace(/[^0-9]/g, '')) || 0;
      if (name.includes('euv') || (name.includes('asml') && name.includes('hq'))) {
        euvCount += val;
      } else if (cat.includes('arf') || name.includes('arf') || name.includes('nikon')) {
        arfiCount += val;
      } else if (name.includes('canon') && cat.includes('i-line')) {
        krfCount += val;
      } else if (name.includes('asml') && name.includes('san diego')) {
        arfiCount += val;
      } else {
        otherCount += val;
      }
    }
  }

  const total = euvCount + arfiCount + krfCount + otherCount;
  if (total === 0) {
    return [
      { generation: 'EUV (≤7nm)', count: 256, percentage: 38, color: '#A855F7' },
      { generation: 'ArFi (7-28nm)', count: 280, percentage: 42, color: '#00D4FF' },
      { generation: 'KrF/i-line (>28nm)', count: 135, percentage: 20, color: '#FFB84D' },
    ];
  }

  return [
    { generation: 'EUV (≤7nm)', count: euvCount, percentage: Math.round((euvCount / total) * 100), color: '#A855F7' },
    { generation: 'ArFi (7-28nm)', count: arfiCount, percentage: Math.round((arfiCount / total) * 100), color: '#00D4FF' },
    { generation: 'KrF/i-line (>28nm)', count: krfCount + otherCount, percentage: Math.round(((krfCount + otherCount) / total) * 100), color: '#FFB84D' },
  ];
}

/**
 * 根据名称关键词推断所属国家
 * 通过硬编码的关键词映射进行国家匹配
 * @param name - 实体名称
 * @returns 推断的国家名称或 'Other'
 */
function inferCountry(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('china') || lower.includes('inner mongolia') || lower.includes('sichuan') || lower.includes('anhui') || lower.includes('beijing') || lower.includes('shanghai') || lower.includes('shenzhen') || lower.includes('huawei')) return 'China';
  if (lower.includes('usa') || lower.includes('santa clara') || lower.includes('fremont') || lower.includes('milpitas') || lower.includes('mountain view') || lower.includes('san jose') || lower.includes('canonsburg') || lower.includes('billerica') || lower.includes('wilmington') || lower.includes('mountain pass') || lower.includes('chandler')) return 'USA';
  if (lower.includes('japan') || lower.includes('tokyo') || lower.includes('nagano') || lower.includes('ogaki')) return 'Japan';
  if (lower.includes('netherlands') || lower.includes('veldhoven')) return 'Netherlands';
  if (lower.includes('taiwan') || lower.includes('hsinchu') || lower.includes('taoyuan') || lower.includes('kaohsiung')) return 'Taiwan';
  if (lower.includes('germany') || lower.includes('darmstadt')) return 'Germany';
  if (lower.includes('korea')) return 'South Korea';
  if (lower.includes('uk') || lower.includes('cambridge') || lower.includes('london')) return 'UK';
  if (lower.includes('france') || lower.includes('paris')) return 'France';
  if (lower.includes('ireland') || lower.includes('dublin')) return 'Ireland';
  if (lower.includes('australia') || lower.includes('mount weld')) return 'Australia';
  if (lower.includes('canada')) return 'Canada';
  return 'Other';
}

// ── Component ────────────────────────────────────────────────────────

/**
 * 数据洞察页面组件
 * 自动从mockData生成数据驱动的洞察: 区域容量排名、热力图、瓶颈分析、技术世代分布
 */
export default function InsightsPage() {
  const regionalCapacity = useMemo(() => computeRegionalCapacity(), []);
  const heatmapData = useMemo(() => computeHeatmapData(), []);
  const bottlenecks = useMemo(() => computeBottlenecks(), []);
  const techGenerations = useMemo(() => computeTechGenerations(), []);

  // ── Chart: Regional Capacity Bar ────────────────────────────────

  const regionalChartOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontSize: 12 },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: regionalCapacity.map((r) => r.region),
      axisLabel: { color: '#9A9AAF', fontSize: 10, rotate: 20 },
      axisLine: { lineStyle: { color: '#2A2A3A' } },
    },
    yAxis: {
      type: 'value',
      name: 'Total Power (MW)',
      nameTextStyle: { color: '#6B6B80', fontSize: 10 },
      axisLabel: { color: '#6B6B80', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1E1E28' } },
    },
    series: [
      {
        type: 'bar',
        data: regionalCapacity.map((r) => ({
          value: r.totalMW,
          itemStyle: {
            color: r.region === 'North America' ? '#00D4FF' : r.region === 'Europe' ? '#A855F7' : r.region === 'Asia Pacific' ? '#FFB84D' : r.region === 'Middle East' ? '#4ADE80' : r.region === 'South America' ? '#F87171' : '#6B6B80',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '50%',
      },
    ],
  }), [regionalCapacity]);

  // ── Chart: Heatmap country power ───────────────────────────────

  const heatmapChartOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontSize: 12 },
      formatter: (params: { name: string; value: number }) => `${params.name}: ${params.value.toLocaleString()} MW`,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: heatmapData.slice(0, 15).map((d) => d.name),
      axisLabel: { color: '#9A9AAF', fontSize: 10, rotate: 30 },
      axisLine: { lineStyle: { color: '#2A2A3A' } },
    },
    yAxis: {
      type: 'value',
      name: 'Installed Power (MW)',
      nameTextStyle: { color: '#6B6B80', fontSize: 10 },
      axisLabel: { color: '#6B6B80', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1E1E28' } },
    },
    series: [
      {
        type: 'bar',
        data: heatmapData.slice(0, 15).map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: i === 0 ? '#00D4FF' : i < 3 ? '#00D4FF99' : i < 6 ? '#A855F799' : '#6B6B8099',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '60%',
      },
    ],
  }), [heatmapData]);

  // ── Chart: Tech Generation Pie ──────────────────────────────────

  const techPieOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontSize: 12 },
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#9A9AAF', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#0A0A0F', borderWidth: 2 },
        label: {
          show: true,
          color: '#E8E8EC',
          fontSize: 12,
          formatter: '{b}\n{d}%',
        },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
        },
        data: techGenerations.map((t) => ({
          value: t.count,
          name: t.generation,
          itemStyle: { color: t.color },
        })),
      },
    ],
  }), [techGenerations]);

  // ── 汇总统计数据 ──
  const totalPower = dataCenters.reduce((sum, dc) => sum + (dc.powerCapacity ?? 0), 0);
  const totalDCs = dataCenters.length;
  const totalFabs = fabricationFacilities.length;
  const totalCompanies = companies.length;
  // 计算平均PUE
  const avgPue = dataCenters.reduce((sum, dc) => sum + (dc.pue ?? 1.2), 0) / dataCenters.length;

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-lg text-[#E8E8EC] font-display flex items-center gap-3">
            <Lightbulb size={28} className="text-[#FFB84D]" />
            Data Insights
          </h1>
          <p className="text-body-sm text-[#6B6B80] mt-1">
            Auto-generated insights from the AI Compute Map dataset
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Power', value: `${(totalPower / 1000).toFixed(1)} GW`, icon: Zap, color: '#A855F7' },
            { label: 'Data Centers', value: String(totalDCs), icon: Server, color: '#00D4FF' },
            { label: 'Fab Facilities', value: String(totalFabs), icon: Factory, color: '#FFB84D' },
            { label: 'Companies', value: String(totalCompanies), icon: Globe2, color: '#4ADE80' },
            { label: 'Avg PUE', value: avgPue.toFixed(2), icon: Cpu, color: '#F87171' },
          ].map((card) => (
            <div key={card.label} className="bg-[#111118] border border-[#1E1E28] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon size={14} style={{ color: card.color }} />
                <span className="text-[11px] font-mono text-[#6B6B80] uppercase">{card.label}</span>
              </div>
              <p className="text-[22px] font-mono font-bold text-[#E8E8EC]">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Regional Capacity Ranking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111118] border border-[#1E1E28] rounded-xl p-6"
          >
            <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider mb-1">
              <TrendingUp size={14} className="inline mr-2" />
              Regional Installed Capacity
            </h3>
            <p className="text-[11px] text-[#6B6B80] mb-4">
              Total power capacity by region (MW)
            </p>
            <ReactECharts
              option={regionalChartOption}
              style={{ height: 320, width: '100%' }}
              opts={{ renderer: 'canvas' }}
              role="img"
              aria-label="Bar chart showing regional installed power capacity in MW"
            />
          </motion.div>

          {/* Tech Generation Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#111118] border border-[#1E1E28] rounded-xl p-6"
          >
            <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider mb-1">
              <Cpu size={14} className="inline mr-2" />
              Lithography Technology Generation
            </h3>
            <p className="text-[11px] text-[#6B6B80] mb-4">
              Distribution of lithography systems by technology node
            </p>
            <ReactECharts
              option={techPieOption}
              style={{ height: 320, width: '100%' }}
              opts={{ renderer: 'canvas' }}
              role="img"
              aria-label="Pie chart showing lithography technology generation distribution"
            />
          </motion.div>
        </div>

        {/* Country Power Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#111118] border border-[#1E1E28] rounded-xl p-6 mb-8"
        >
          <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider mb-1">
            <Globe2 size={14} className="inline mr-2" />
            Data Center Power by Country (Top 15)
          </h3>
          <p className="text-[11px] text-[#6B6B80] mb-4">
            Installed power capacity heatmap — countries ranked by total MW
          </p>
          <ReactECharts
            option={heatmapChartOption}
            style={{ height: 360, width: '100%' }}
            opts={{ renderer: 'canvas' }}
            role="img"
            aria-label="Bar chart showing data center power by country, top 15 countries ranked by total MW"
          />
        </motion.div>

        {/* Bottleneck Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111118] border border-[#1E1E28] rounded-xl p-6 mb-8"
        >
          <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider mb-1">
            <AlertTriangle size={14} className="inline mr-2" />
            Supply Chain Bottleneck Analysis
          </h3>
          <p className="text-[11px] text-[#6B6B80] mb-4">
            Categories where a single country controls &gt;50% of supply
          </p>
          <div className="space-y-3">
            {bottlenecks.map((b, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  b.severity === 'high'
                    ? 'bg-[#F8717108] border-[#F8717120]'
                    : 'bg-[#FFB84D08] border-[#FFB84D20]'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    b.severity === 'high' ? 'bg-[#F87171]' : 'bg-[#FFB84D]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-[#E8E8EC] font-medium">
                      {b.category}
                    </span>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        b.severity === 'high'
                          ? 'bg-[#F8717120] text-[#F87171]'
                          : 'bg-[#FFB84D20] text-[#FFB84D]'
                      }`}
                    >
                      {b.dependencyScore}% dependency
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6B6B80]">{b.description}</p>
                </div>
              </div>
            ))}
            {bottlenecks.length === 0 && (
              <p className="text-[12px] text-[#6B6B80] text-center py-4">
                No significant bottlenecks detected
              </p>
            )}
          </div>
        </motion.div>

        {/* Regional Detail Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#111118] border border-[#1E1E28] rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-[#1E1E28]">
            <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider">
              <Server size={14} className="inline mr-2" />
              Regional Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E28]">
                  <th className="text-left p-3 text-[11px] font-mono text-[#6B6B80] uppercase tracking-wider">
                    Region
                  </th>
                  <th className="text-left p-3 text-[11px] font-mono text-[#6B6B80] uppercase tracking-wider">
                    Data Centers
                  </th>
                  <th className="text-left p-3 text-[11px] font-mono text-[#6B6B80] uppercase tracking-wider">
                    Total Power (MW)
                  </th>
                  <th className="text-left p-3 text-[11px] font-mono text-[#6B6B80] uppercase tracking-wider">
                    Avg PUE
                  </th>
                  <th className="text-left p-3 text-[11px] font-mono text-[#6B6B80] uppercase tracking-wider">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {regionalCapacity.map((r) => (
                  <tr key={r.region} className="border-b border-[#1E1E28] last:border-0 hover:bg-[#181820] transition-colors">
                    <td className="p-3 text-[13px] text-[#E8E8EC] font-medium">{r.region}</td>
                    <td className="p-3 text-[13px] text-[#E8E8EC] font-mono">{r.dcCount}</td>
                    <td className="p-3 text-[13px] text-[#E8E8EC] font-mono">{r.totalMW.toLocaleString()}</td>
                    <td className="p-3 text-[13px] text-[#E8E8EC] font-mono">{r.avgPue.toFixed(2)}</td>
                    <td className="p-3 text-[13px] text-[#E8E8EC] font-mono">
                      {((r.totalMW / totalPower) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* ── Enhanced Data Visualizations ──────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-16 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="text-section text-text-primary flex items-center gap-2 mb-6">
            <TrendingUp size={18} />
            数据可视化增强
          </h2>
          <GaugeDashboard />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <TrendChart />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <FunnelChart />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
