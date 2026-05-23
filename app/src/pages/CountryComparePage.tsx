/**
 * @file CountryComparePage.tsx
 * @description Country-level comparison page for AI Compute Map.
 * Allows users to select 2-3 countries and compare them across dimensions:
 * data center count, total installed capacity, fab count, supply chain nodes.
 * Uses ECharts bar and radar charts. Supports region filtering.
 *
 * @dependencies react-i18next, echarts-for-react, lucide-react, @/data/mockData
 */
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { Search, X, GitCompareArrows, BarChart3, Globe2, Factory, Server, Cpu } from 'lucide-react';

import {
  supplyChainData,
  fabricationFacilities,
  dataCenters,
} from '@/data/mockData';

// ── Types ────────────────────────────────────────────────────────────
/** 国家统计接口，包含各维度的算力指标 */
interface CountryStats {
  country: string;
  region: string;
  dataCenterCount: number;
  totalPowerMW: number;
  fabCount: number;
  supplyChainNodes: number;
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * 计算所有国家的统计指标
 * 汇总数据中心、芯片厂和供应链节点数量
 */
function computeCountryStats(): CountryStats[] {
  const map = new Map<string, CountryStats>();

  // Data centers
  for (const dc of dataCenters) {
    const key = dc.country;
    if (!map.has(key)) {
      map.set(key, { country: key, region: dc.region, dataCenterCount: 0, totalPowerMW: 0, fabCount: 0, supplyChainNodes: 0 });
    }
    const entry = map.get(key)!;
    entry.dataCenterCount++;
    entry.totalPowerMW += dc.powerCapacity ?? 0;
  }

  // Fabs
  for (const fab of fabricationFacilities) {
    const key = fab.country;
    if (!map.has(key)) {
      map.set(key, { country: key, region: 'Other', dataCenterCount: 0, totalPowerMW: 0, fabCount: 0, supplyChainNodes: 0 });
    }
    map.get(key)!.fabCount++;
  }

  // Supply chain
  for (const sc of supplyChainData) {
    // Supply chain data doesn't have country field directly, but we can infer from name/location
    // Use a simple heuristic based on the data
    const country = inferCountryFromSupplyChain(sc.name);
    if (country) {
      if (!map.has(country)) {
        map.set(country, { country, region: 'Other', dataCenterCount: 0, totalPowerMW: 0, fabCount: 0, supplyChainNodes: 0 });
      }
      map.get(country)!.supplyChainNodes++;
    }
  }

  // Sort by total power descending
  return Array.from(map.values()).sort((a, b) => b.totalPowerMW - a.totalPowerMW);
}

/**
 * 根据供应链实体名称推断所属国家
 * @param name - 实体名称
 * @returns 国家名称或null
 */
function inferCountryFromSupplyChain(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes('china') || lower.includes('inner mongolia') || lower.includes('sichuan') || lower.includes('anhui') || lower.includes('beijing') || lower.includes('shanghai') || lower.includes('shenzhen') || lower.includes('shanghai micro') || lower.includes('huawei')) return 'China';
  if (lower.includes('usa') || lower.includes('santa clara') || lower.includes('fremont') || lower.includes('milpitas') || lower.includes('mountain view') || lower.includes('san jose') || lower.includes('canonsburg') || lower.includes('billerica') || lower.includes('wilmington') || lower.includes('mountain pass') || lower.includes('chandler')) return 'USA';
  if (lower.includes('japan') || lower.includes('tokyo') || lower.includes('nagano') || lower.includes('ogaki')) return 'Japan';
  if (lower.includes('netherlands') || lower.includes('veldhoven')) return 'Netherlands';
  if (lower.includes('taiwan') || lower.includes('hsinchu') || lower.includes('taoyuan') || lower.includes('kaohsiung')) return 'Taiwan';
  if (lower.includes('germany') || lower.includes('darmstadt') || lower.includes('munich')) return 'Germany';
  if (lower.includes('korea') || lower.includes('south korea')) return 'South Korea';
  if (lower.includes('uk') || lower.includes('cambridge') || lower.includes('london')) return 'UK';
  if (lower.includes('france') || lower.includes('paris')) return 'France';
  if (lower.includes('ireland') || lower.includes('dublin')) return 'Ireland';
  if (lower.includes('australia') || lower.includes('mount weld') || lower.includes('browns range')) return 'Australia';
  if (lower.includes('canada') || lower.includes('nechalacho')) return 'Canada';
  if (lower.includes('angola')) return 'Angola';
  if (lower.includes('burundi') || lower.includes('gakara')) return 'Burundi';
  if (lower.includes('global') || lower.includes('risc-v')) return 'Global';
  if (lower.includes('singapore')) return 'Singapore';
  if (lower.includes('myanmar')) return 'Myanmar';
  return null;
}

// ── Region mapping ───────────────────────────────────────────────────

const REGION_MAP: Record<string, string> = {
  USA: 'North America', Canada: 'North America',
  China: 'Asia Pacific', Japan: 'Asia Pacific', Taiwan: 'Asia Pacific',
  'South Korea': 'Asia Pacific', Singapore: 'Asia Pacific', India: 'Asia Pacific',
  Australia: 'Asia Pacific', Malaysia: 'Asia Pacific', Myanmar: 'Asia Pacific',
  'Hong Kong': 'Asia Pacific',
  UK: 'Europe', Germany: 'Europe', France: 'Europe', Ireland: 'Europe',
  Netherlands: 'Europe', Belgium: 'Europe', Finland: 'Europe',
  'Saudi Arabia': 'Middle East', Bahrain: 'Middle East', Qatar: 'Middle East',
  Brazil: 'South America', Chile: 'South America',
  Uganda: 'Africa',
  Angola: 'Africa', Burundi: 'Africa',
  Global: 'Global',
};

const REGIONS = ['All', 'North America', 'Europe', 'Asia Pacific', 'Middle East', 'South America', 'Africa'] as const;

const COUNTRY_COLORS = ['#00D4FF', '#FFB84D', '#A855F7', '#4ADE80', '#F87171'];

// ── Component ────────────────────────────────────────────────────────

/**
 * 国家对比页面组件
 * 选择2-3个国家横向对比数据中心、功率、芯片厂和供应链节点数
 */
export default function CountryComparePage() {
  const allStats = useMemo(() => computeCountryStats(), []);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');

  const filteredCountries = useMemo(() => {
    let pool = allStats;
    if (regionFilter !== 'All') {
      pool = pool.filter((s) => (REGION_MAP[s.country] ?? s.region) === regionFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter((s) => s.country.toLowerCase().includes(q));
    }
    return pool;
  }, [allStats, regionFilter, searchQuery]);

  const selectedStats = useMemo(
    () => selectedCountries.map((c) => allStats.find((s) => s.country === c)).filter(Boolean) as CountryStats[],
    [allStats, selectedCountries]
  );

  /**
   * 切换国家选择，最多3个
   * @param country - 国家名称
   */
  function toggleCountry(country: string) {
    setSelectedCountries((prev) => {
      if (prev.includes(country)) return prev.filter((c) => c !== country);
      if (prev.length >= 3) return prev;
      return [...prev, country];
    });
  }

  function removeCountry(country: string) {
    setSelectedCountries((prev) => prev.filter((c) => c !== country));
  }

  // ── Chart: Bar comparison ────────────────────────────────────────

  const barOption = useMemo(() => {
    if (selectedStats.length < 2) return null;
    const metrics = [
      { key: 'dataCenterCount' as const, label: 'Data Centers', icon: '🖥️' },
      { key: 'totalPowerMW' as const, label: 'Total Power (MW)', icon: '⚡' },
      { key: 'fabCount' as const, label: 'Fab Facilities', icon: '🏭' },
      { key: 'supplyChainNodes' as const, label: 'Supply Chain Nodes', icon: '🔗' },
    ];
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#111118',
        borderColor: '#2A2A3A',
        textStyle: { color: '#E8E8EC', fontSize: 12 },
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#9A9AAF', fontSize: 11 },
      },
      grid: { left: '3%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
      xAxis: {
        type: 'category',
        data: metrics.map((m) => `${m.icon} ${m.label}`),
        axisLabel: { color: '#9A9AAF', fontSize: 10, rotate: 15 },
        axisLine: { lineStyle: { color: '#2A2A3A' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6B6B80', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1E1E28' } },
      },
      series: selectedStats.map((stat, i) => ({
        name: stat.country,
        type: 'bar',
        barGap: '10%',
        data: metrics.map((m) => stat[m.key]),
        itemStyle: {
          color: COUNTRY_COLORS[i % COUNTRY_COLORS.length],
          borderRadius: [4, 4, 0, 0],
        },
      })),
    };
  }, [selectedStats]);

  // ── Chart: Radar comparison ──────────────────────────────────────

  const radarOption = useMemo(() => {
    if (selectedStats.length < 2) return null;
    const dims = [
      { key: 'dataCenterCount' as const, label: 'Data Centers' },
      { key: 'totalPowerMW' as const, label: 'Power (MW)' },
      { key: 'fabCount' as const, label: 'Fabs' },
      { key: 'supplyChainNodes' as const, label: 'Supply Chain' },
    ];
    const maxVals: Record<string, number> = {};
    dims.forEach((d) => {
      maxVals[d.key] = Math.max(1, ...selectedStats.map((s) => Math.abs(s[d.key])));
    });
    return {
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
      radar: {
        indicator: dims.map((d) => ({ name: d.label, max: 100 })),
        shape: 'polygon',
        splitNumber: 4,
        axisName: { color: '#9A9AAF', fontSize: 10 },
        splitLine: { lineStyle: { color: '#2A2A3A', width: 0.5 } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#2A2A3A', width: 0.5 } },
      },
      series: [
        {
          type: 'radar',
          data: selectedStats.map((stat, i) => ({
            value: dims.map((d) => (stat[d.key] / maxVals[d.key]) * 100),
            name: stat.country,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2, color: COUNTRY_COLORS[i % COUNTRY_COLORS.length] },
            areaStyle: { opacity: 0.15, color: COUNTRY_COLORS[i % COUNTRY_COLORS.length] },
            itemStyle: { color: COUNTRY_COLORS[i % COUNTRY_COLORS.length] },
          })),
        },
      ],
    };
  }, [selectedStats]);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-heading-lg text-[#E8E8EC] font-display flex items-center gap-3">
              <Globe2 size={28} className="text-[#00D4FF]" />
              Country Comparison
            </h1>
            <p className="text-body-sm text-[#6B6B80] mt-1">
              Compare AI compute infrastructure across 2-3 countries
            </p>
          </div>
          {selectedCountries.length > 0 && (
            <button
              onClick={() => setSelectedCountries([])}
              className="flex items-center gap-2 px-3 py-2 text-[12px] font-mono text-[#F87171] bg-[#F8717110] border border-[#F8717130] rounded-lg hover:bg-[#F8717120] transition-colors cursor-pointer"
            >
              <X size={14} />
              Clear All
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-[#111118] border border-[#1E1E28] rounded-xl p-4 sticky top-20">
              {/* Region Filter */}
              <div className="mb-4">
                <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider mb-2">
                  Filter by Region
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRegionFilter(r)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer ${
                        regionFilter === r
                          ? 'bg-[#00D4FF20] text-[#00D4FF] border border-[#00D4FF40]'
                          : 'bg-[#181820] text-[#6B6B80] border border-[#2A2A3A] hover:text-[#E8E8EC]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B80]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full pl-9 pr-3 py-2.5 bg-[#181820] border border-[#2A2A3A] rounded-lg text-[13px] text-[#E8E8EC] placeholder:text-[#4A4A5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
                />
              </div>

              {/* Selected */}
              {selectedCountries.length > 0 && (
                <div className="mb-4 space-y-2">
                  {selectedCountries.map((c, i) => (
                    <div
                      key={c}
                      className="flex items-center gap-2 p-2 bg-[#181820] border border-[#2A2A3A] rounded-lg"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COUNTRY_COLORS[i % COUNTRY_COLORS.length] }}
                      />
                      <span className="text-[12px] text-[#E8E8EC] truncate flex-1">{c}</span>
                      <button
                        onClick={() => removeCountry(c)}
                        className="text-[#6B6B80] hover:text-[#F87171] transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Country list */}
              <div className="max-h-[400px] overflow-y-auto space-y-1.5 pr-1">
                {filteredCountries.map((stat) => {
                  const selected = selectedCountries.includes(stat.country);
                  const idx = selectedCountries.indexOf(stat.country);
                  return (
                    <button
                      key={stat.country}
                      onClick={() => toggleCountry(stat.country)}
                      disabled={selected || selectedCountries.length >= 3}
                      className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#00D4FF08] border border-[#00D4FF20] opacity-50'
                          : 'bg-[#181820] border border-transparent hover:border-[#2A2A3A] hover:bg-[#1E1E28]'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: selected ? COUNTRY_COLORS[idx % COUNTRY_COLORS.length] : '#4A4A5A' }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] text-[#E8E8EC] truncate">{stat.country}</p>
                        <p className="text-[10px] text-[#6B6B80] truncate">
                          {stat.dataCenterCount} DCs · {stat.fabCount} fabs · {stat.totalPowerMW.toLocaleString()} MW
                        </p>
                      </div>
                      {selected && (
                        <span className="text-[9px] font-mono text-[#00D4FF] uppercase">✓</span>
                      )}
                    </button>
                  );
                })}
                {filteredCountries.length === 0 && (
                  <p className="text-[12px] text-[#6B6B80] text-center py-4">
                    No countries found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {selectedStats.length < 2 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <GitCompareArrows size={48} className="text-[#2A2A3A] mb-4" />
                <h3 className="text-heading-sm text-[#6B6B80] mb-2">
                  Select 2-3 Countries to Compare
                </h3>
                <p className="text-body-sm text-[#4A4A5A] max-w-sm">
                  Choose countries from the sidebar to compare their AI compute infrastructure across data centers, fabs, and supply chain.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Data Centers', key: 'dataCenterCount' as const, icon: Server, color: '#A855F7' },
                    { label: 'Total Power (MW)', key: 'totalPowerMW' as const, icon: Cpu, color: '#00D4FF' },
                    { label: 'Fab Facilities', key: 'fabCount' as const, icon: Factory, color: '#FFB84D' },
                    { label: 'Supply Chain Nodes', key: 'supplyChainNodes' as const, icon: Globe2, color: '#4ADE80' },
                  ].map((metric) => (
                    <div key={metric.key} className="bg-[#111118] border border-[#1E1E28] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon size={14} style={{ color: metric.color }} />
                        <span className="text-[11px] font-mono text-[#6B6B80] uppercase">{metric.label}</span>
                      </div>
                      {selectedStats.map((s, i) => (
                        <div key={s.country} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: COUNTRY_COLORS[i % COUNTRY_COLORS.length] }}
                            />
                            <span className="text-[11px] text-[#9A9AAF]">{s.country}</span>
                          </div>
                          <span className="text-[13px] font-mono text-[#E8E8EC]">
                            {metric.key === 'totalPowerMW' ? s[metric.key].toLocaleString() : s[metric.key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Bar Chart */}
                {barOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111118] border border-[#1E1E28] rounded-xl p-6"
                  >
                    <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider mb-4">
                      <BarChart3 size={14} className="inline mr-2" />
                      Infrastructure Comparison — Bar Chart
                    </h3>
                    <ReactECharts
                      option={barOption}
                      style={{ height: 360, width: '100%' }}
                      opts={{ renderer: 'canvas' }}
                    />
                  </motion.div>
                )}

                {/* Radar Chart */}
                {radarOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#111118] border border-[#1E1E28] rounded-xl p-6"
                  >
                    <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider mb-4">
                      <Globe2 size={14} className="inline mr-2" />
                      Multi-Dimensional Radar
                    </h3>
                    <ReactECharts
                      option={radarOption}
                      style={{ height: 380, width: '100%' }}
                      opts={{ renderer: 'canvas' }}
                    />
                  </motion.div>
                )}

                {/* Comparison Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#111118] border border-[#1E1E28] rounded-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-[#1E1E28]">
                    <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider">
                      Detailed Comparison
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#1E1E28]">
                          <th className="text-left p-3 text-[11px] font-mono text-[#6B6B80] uppercase tracking-wider w-40">
                            Metric
                          </th>
                          {selectedStats.map((s, i) => (
                            <th key={s.country} className="text-left p-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: COUNTRY_COLORS[i % COUNTRY_COLORS.length] }}
                                />
                                <span className="text-[12px] font-medium text-[#E8E8EC]">{s.country}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: 'Region', getValue: (s: CountryStats) => REGION_MAP[s.country] ?? s.region },
                          { label: 'Data Centers', getValue: (s: CountryStats) => String(s.dataCenterCount) },
                          { label: 'Total Power (MW)', getValue: (s: CountryStats) => s.totalPowerMW.toLocaleString() },
                          { label: 'Fab Facilities', getValue: (s: CountryStats) => String(s.fabCount) },
                          { label: 'Supply Chain Nodes', getValue: (s: CountryStats) => String(s.supplyChainNodes) },
                          { label: 'Power per DC (MW)', getValue: (s: CountryStats) => s.dataCenterCount > 0 ? Math.round(s.totalPowerMW / s.dataCenterCount).toLocaleString() : 'N/A' },
                        ].map((row) => (
                          <tr key={row.label} className="border-b border-[#1E1E28] last:border-0 hover:bg-[#181820] transition-colors">
                            <td className="p-3 text-[11px] font-mono text-[#6B6B80] uppercase tracking-wider">
                              {row.label}
                            </td>
                            {selectedStats.map((s) => (
                              <td key={s.country} className="p-3 text-[13px] text-[#E8E8EC] font-mono">
                                {row.getValue(s)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
