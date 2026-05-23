/**
 * @file ComparePage.tsx
 * @description Facility comparison page allowing users to select 2-3 facilities
 * for side-by-side analysis. Features a search sidebar, ECharts radar chart
 * for multi-dimensional comparison, and a detailed comparison table.
 *
 * @dependencies react-i18next, echarts-for-react, lucide-react,
 *               @/context/CompareContext, @/components/map/useMapData,
 *               @/constants/layerColors
 */
import { useState, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { Search, X, GitCompareArrows, Trash2, BarChart3 } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import type { ComparePin } from '@/context/CompareContext';
import { useMapData } from '@/components/map/useMapData';
import { LAYER_COLORS } from '@/constants/layerColors';

/**
 * 设施对比页面组件
 * 选择2-3个设施进行多维度对比，含搜索侧边栏、雷达图和对比表格
 */
export default function ComparePage() {
  const { t } = useTranslation(['common', 'map']);
  const { comparePins, removeComparePin, clearCompare, addComparePin } = useCompare();
  const { pins } = useMapData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPins = useMemo(() => {
    if (!searchQuery.trim()) return pins.slice(0, 50);
    const q = searchQuery.toLowerCase();
    return pins.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.company?.toLowerCase().includes(q) ||
        p.provider?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.country?.toLowerCase().includes(q)
    );
  }, [pins, searchQuery]);

  // Normalize values for radar chart
  const radarData = useMemo(() => {
    if (comparePins.length < 2) return null;
    const dims = [
      { key: 'value', label: t('map:facility.capacity', 'Capacity') },
      { key: 'powerCapacity', label: t('map:facility.powerMW', 'Power (MW)') },
      { key: 'pue', label: t('map:facility.pue', 'PUE') },
      { key: 'employees', label: t('map:facility.employees', 'Employees') },
      { key: 'yearEstablished', label: t('map:facility.yearEst', 'Year Est.') },
    ];
    const maxVals: Record<string, number> = {};
    dims.forEach((d) => {
      maxVals[d.key] = Math.max(
        1,
        ...comparePins.map((p) => {
          const v = d.key === 'value' ? (typeof p.value === 'number' ? p.value : 0) : (p[d.key as keyof ComparePin] as number) || 0;
          return Math.abs(v);
        })
      );
    });
    return { dims, maxVals };
  }, [comparePins, t]);

  const chartOption = useMemo(() => {
    if (!radarData) return null;
    const { dims, maxVals } = radarData;
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
        itemWidth: 12,
        itemHeight: 12,
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
          data: comparePins.map((pin) => ({
            value: dims.map((d) => {
              const raw = d.key === 'value' ? (typeof pin.value === 'number' ? pin.value : 0) : (pin[d.key as keyof ComparePin] as number) || 0;
              const normalized = (Math.abs(raw) / maxVals[d.key]) * 100;
              return d.key === 'pue' ? Math.max(0, 100 - normalized) : normalized;
            }),
            name: pin.name,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2, color: LAYER_COLORS[pin.layer] },
            areaStyle: { opacity: 0.15, color: LAYER_COLORS[pin.layer] },
            itemStyle: { color: LAYER_COLORS[pin.layer] },
          })),
        },
      ],
    };
  }, [radarData, comparePins]);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-heading-lg text-[#E8E8EC] font-display flex items-center gap-3">
              <GitCompareArrows size={28} className="text-[#00D4FF]" />
              {t('common:nav.compare')}
            </h1>
            <p className="text-body-sm text-[#6B6B80] mt-1">
              {t('common:dataStatus.sources')}
            </p>
          </div>
          {comparePins.length > 0 && (
            <button
              onClick={clearCompare}
              className="flex items-center gap-2 px-3 py-2 text-[12px] font-mono text-[#F87171] bg-[#F8717110] border border-[#F8717130] rounded-lg hover:bg-[#F8717120] transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              {t('actions.close', { ns: 'common', defaultValue: 'Clear All' })}
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Facility Selector */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-[#111118] border border-[#1E1E28] rounded-xl p-4 sticky top-20">
              <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider mb-3">
                {t('search.placeholder', { ns: 'map' })}
              </h3>
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B80]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder', { ns: 'map' })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#181820] border border-[#2A2A3A] rounded-lg text-[13px] text-[#E8E8EC] placeholder:text-[#4A4A5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
                />
              </div>

              {/* Selected Pins */}
              {comparePins.length > 0 && (
                <div className="mb-4 space-y-2">
                  {comparePins.map((pin) => (
                    <div
                      key={pin.id}
                      className="flex items-center gap-2 p-2 bg-[#181820] border border-[#2A2A3A] rounded-lg"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: LAYER_COLORS[pin.layer] }}
                      />
                      <span className="text-[12px] text-[#E8E8EC] truncate flex-1">
                        {pin.name}
                      </span>
                      <button
                        onClick={() => removeComparePin(pin.id)}
                        className="text-[#6B6B80] hover:text-[#F87171] transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Available Pins */}
              <div className="max-h-[400px] overflow-y-auto space-y-1.5 pr-1">
                {filteredPins.map((pin) => {
                  const selected = comparePins.some((p) => p.id === pin.id);
                  return (
                    <button
                      key={pin.id}
                      onClick={() => !selected && addComparePin(pin)}
                      disabled={selected}
                      className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#00D4FF08] border border-[#00D4FF20] opacity-50'
                          : 'bg-[#181820] border border-transparent hover:border-[#2A2A3A] hover:bg-[#1E1E28]'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: LAYER_COLORS[pin.layer] }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] text-[#E8E8EC] truncate">{pin.name}</p>
                        <p className="text-[10px] text-[#6B6B80] truncate">
                          {[pin.city, pin.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      {selected && (
                        <span className="text-[9px] font-mono text-[#00D4FF] uppercase">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
                {filteredPins.length === 0 && (
                  <p className="text-[12px] text-[#6B6B80] text-center py-4">
                    {t('map:facility.noResults', { query: searchQuery })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Comparison */}
          <div className="flex-1 min-w-0">
            {comparePins.length < 2 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <BarChart3 size={48} className="text-[#2A2A3A] mb-4" />
                <h3 className="text-heading-sm text-[#6B6B80] mb-2">
                  {t('compare.selectTitle', { ns: 'map', defaultValue: 'Select 2-3 Facilities to Compare' })}
                </h3>
                <p className="text-body-sm text-[#4A4A5A] max-w-sm">
                  {t('compare.selectDesc', { ns: 'map', defaultValue: 'Choose facilities from the sidebar to see a side-by-side comparison of capacity, technology, location, and more.' })}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Radar Chart */}
                {chartOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111118] border border-[#1E1E28] rounded-xl p-6"
                  >
                    <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider mb-4">
                      <BarChart3 size={14} className="inline mr-2" />
                      {t('compare.radarTitle', { ns: 'map', defaultValue: 'Performance Comparison' })}
                    </h3>
                    <ReactECharts
                      option={chartOption}
                      style={{ height: 380, width: '100%' }}
                      opts={{ renderer: 'canvas' }}
                      role="img"
                      aria-label={t('compare.radarTitle', { ns: 'map', defaultValue: 'Performance Comparison' })}
                    />
                  </motion.div>
                )}

                {/* Comparison Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#111118] border border-[#1E1E28] rounded-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-[#1E1E28]">
                    <h3 className="text-[13px] font-mono text-[#9A9AAF] uppercase tracking-wider">
                      {t('compare.tableTitle', { ns: 'map', defaultValue: 'Detailed Comparison' })}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#1E1E28]">
                          <th className="text-left p-3 text-[11px] font-mono text-[#6B6B80] uppercase tracking-wider w-36">
                            {t('compare.metric', { ns: 'map', defaultValue: 'Metric' })}
                          </th>
                          {comparePins.map((pin) => (
                            <th key={pin.id} className="text-left p-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: LAYER_COLORS[pin.layer] }}
                                />
                                <span className="text-[12px] font-medium text-[#E8E8EC]">
                                  {pin.name}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <CompareRow
                          label={t('compare.type', { ns: 'map', defaultValue: 'Type' })}
                          values={comparePins.map((p) =>
                            p.layer === 'supply' ? t('layerToggle.supplyChain', { ns: 'map' }) : p.layer === 'foundry' ? t('layerToggle.foundry', { ns: 'map' }) : t('layerToggle.dataCenter', { ns: 'map' })
                          )}
                        />
                        <CompareRow
                          label={t('map:facility.company', 'Company')}
                          values={comparePins.map((p) => p.company || p.provider || '-')}
                        />
                        <CompareRow
                          label={t('map:facility.capacity', 'Capacity')}
                          values={comparePins.map((p) =>
                            typeof p.value === 'number'
                              ? `${p.value.toLocaleString()} ${p.unit || ''}`
                              : `${p.value} ${p.unit || ''}`
                          )}
                        />
                        <CompareRow
                          label={t('map:facility.processNode', 'Process Node')}
                          values={comparePins.map((p) => p.processNode || '-')}
                        />
                        <CompareRow
                          label={t('map:facility.powerMW', 'Power (MW)')}
                          values={comparePins.map((p) => (p.powerCapacity ? `${p.powerCapacity} MW` : '-'))}
                        />
                        <CompareRow
                          label={t('map:facility.pue', 'PUE')}
                          values={comparePins.map((p) => (p.pue ? p.pue.toFixed(2) : '-'))}
                        />
                        <CompareRow
                          label={t('map:facility.employees', 'Employees')}
                          values={comparePins.map((p) => (p.employees ? p.employees.toLocaleString() : '-'))}
                        />
                        <CompareRow
                          label={t('compare.location', { ns: 'map', defaultValue: 'Location' })}
                          values={comparePins.map((p) => [p.city, p.country].filter(Boolean).join(', ') || '-')}
                        />
                        <CompareRow
                          label={t('map:facility.status', 'Status')}
                          values={comparePins.map((p) => p.status || '-')}
                        />
                        <CompareRow
                          label={t('map:facility.yearEst', 'Year Est.')}
                          values={comparePins.map((p) => (p.yearEstablished ? String(p.yearEstablished) : p.yearOperational ? String(p.yearOperational) : '-'))}
                        />
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

const CompareRow = memo(function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-b border-[#1E1E28] last:border-0 hover:bg-[#181820] transition-colors">
      <td className="p-3 text-[11px] font-mono text-[#6B6B80] uppercase tracking-wider">
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="p-3 text-[13px] text-[#E8E8EC] font-mono">
          {v}
        </td>
      ))}
    </tr>
  );
});
