/**
 * @file pages/CountryDetailPage.tsx
 * @description Country/region detail page showing all facilities (data centers,
 * foundries, supply chain) in a specific country, with ECharts pie charts,
 * power statistics, and a back-to-map button.
 *
 * @dependencies react-router-dom, echarts-for-react, @/data/mockData
 */

import { useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import {
  supplyChainData,
  fabricationFacilities,
  dataCenters,
} from '@/data/mockData';
import ExportPdfButton from '@/components/ExportPdfButton';

// Country name mapping (country code → display name)
const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', USA: 'United States',
  CN: 'China', TW: 'Taiwan', KR: 'South Korea', JP: 'Japan',
  DE: 'Germany', NL: 'Netherlands', IE: 'Ireland', IL: 'Israel',
  SG: 'Singapore', IN: 'India', MY: 'Malaysia', AU: 'Australia',
  UK: 'United Kingdom', FR: 'France', BE: 'Belgium', FI: 'Finland',
  SA: 'Saudi Arabia', QA: 'Qatar', BH: 'Bahrain', UG: 'Uganda',
  BR: 'Brazil', CL: 'Chile', CA: 'Canada', HK: 'Hong Kong',
};

// Reverse mapping: full country name → code
const NAME_TO_CODE: Record<string, string> = {};
Object.entries(COUNTRY_NAMES).forEach(([code, name]) => {
  NAME_TO_CODE[name] = code;
  NAME_TO_CODE[name.toUpperCase()] = code;
});

/**
 * 国家编码映射函数
 * 将完整国家名转换为两位大写代码
 * @param country - 国家名称
 * @returns 两位大写国家代码
 */
function getCountryCode(country: string): string {
  return NAME_TO_CODE[country] || country.slice(0, 2).toUpperCase();
}

// Build country data from all datasets
/**
 * 国家数据聚合Hook
 * 根据国家代码从所有数据集中匹配相关设施并计算统计指标
 * @param countryCode - 两位大写国家代码
 * @returns 包含该国家所有设施和统计的数据对象
 */
function useCountryData(countryCode: string) {
  return useMemo(() => {
    const code = countryCode.toUpperCase();
    const countryName = COUNTRY_NAMES[code] || code;

    // Match by code OR by full name
    const matchedSupply = supplyChainData.filter(
      (d) => d.name.toLowerCase().includes(countryName.toLowerCase()) ||
             d.category.toLowerCase().includes(countryName.toLowerCase())
    );

    // Supply chain entries don't have country field, so we match by location hints
    // Use the supplyChainTableData for better country matching
    const matchedFabs = fabricationFacilities.filter((f) => {
      const fc = getCountryCode(f.country);
      return fc === code || f.country.toUpperCase() === countryName.toUpperCase();
    });

    const matchedDCs = dataCenters.filter((dc) => {
      const dcC = getCountryCode(dc.country);
      return dcC === code || dc.country.toUpperCase() === countryName.toUpperCase();
    });

    // Total power capacity
    const totalPowerMW = matchedDCs.reduce((sum, dc) => sum + (dc.powerCapacity || 0), 0);

    // Layer distribution for pie chart
    const layerDist = [
      { name: 'Supply Chain', value: matchedSupply.length, color: '#FFB84D' },
      { name: 'Foundry Fabs', value: matchedFabs.length, color: '#00D4FF' },
      { name: 'Data Centers', value: matchedDCs.length, color: '#A855F7' },
    ].filter((d) => d.value > 0);

    // Status distribution
    const statusDist = [
      { name: 'Operational', value: matchedFabs.filter((f) => f.status === 'operational').length + matchedDCs.filter((d) => d.status === 'operational').length },
      { name: 'Construction', value: matchedFabs.filter((f) => f.status === 'construction').length + matchedDCs.filter((d) => d.status === 'construction').length },
      { name: 'Planned', value: matchedFabs.filter((f) => f.status === 'planned').length + matchedDCs.filter((d) => d.status === 'planned').length },
    ].filter((d) => d.value > 0);

    return {
      countryName,
      supplyChain: matchedSupply,
      fabs: matchedFabs,
      dataCenters: matchedDCs,
      totalPowerMW,
      totalFacilities: matchedSupply.length + matchedFabs.length + matchedDCs.length,
      layerDist,
      statusDist,
    };
  }, [countryCode]);
}

/**
 * 国家/地区详情页面组件
 * 显示指定国家的所有设施(数据中心、芯片厂、供应链)分布和统计
 */
export default function CountryDetailPage() {
  const { code } = useParams<{ code: string }>();
  const pageRef = useRef<HTMLDivElement>(null);

  if (!code) return null;

  const data = useCountryData(code);

  // Pie chart: layer distribution
  const layerPieOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#111118',
      borderColor: '#2A2A3A',
      textStyle: { color: '#E8E8EC', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
    },
    series: [{
      type: 'pie',
      radius: ['40%', '68%'],
      center: ['50%', '50%'],
      data: data.layerDist.map((d) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: d.color },
      })),
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}\n{c}',
        color: '#9A9AAF',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11,
      },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
    }],
  }), [data.layerDist]);

  // Pie chart: status distribution
  const statusPieOption = useMemo(() => {
    const statusColors: Record<string, string> = {
      Operational: '#22C55E',
      Construction: '#F59E0B',
      Planned: '#EF4444',
    };
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
        radius: ['40%', '68%'],
        center: ['50%', '50%'],
        data: data.statusDist.map((d) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: statusColors[d.name] || '#6B6B80' },
        })),
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c}',
          color: '#9A9AAF',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
        },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
      }],
    };
  }, [data.statusDist]);

  // Provider bar chart for data centers
  const providerChartOption = useMemo(() => {
    const providerMap: Record<string, number> = {};
    data.dataCenters.forEach((dc) => {
      providerMap[dc.provider] = (providerMap[dc.provider] || 0) + (dc.powerCapacity || 0);
    });
    const sorted = Object.entries(providerMap).sort((a, b) => b[1] - a[1]);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#111118',
        borderColor: '#2A2A3A',
        textStyle: { color: '#E8E8EC', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
      },
      grid: { left: 10, right: 10, top: 10, bottom: 24, containLabel: true },
      xAxis: {
        type: 'category' as const,
        data: sorted.map(([k]) => k),
        axisLine: { lineStyle: { color: '#2A2A3A' } },
        axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, rotate: 20 },
      },
      yAxis: {
        type: 'value' as const,
        name: 'MW',
        axisLine: { show: false },
        axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono, monospace', fontSize: 9 },
        splitLine: { lineStyle: { color: '#1E1E28', type: 'dashed' as const } },
      },
      series: [{
        type: 'bar',
        data: sorted.map(([, v]) => v),
        barWidth: '60%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#A855F7' },
            { offset: 1, color: '#A855F733' },
          ]),
          borderRadius: [3, 3, 0, 0],
        },
      }],
    };
  }, [data.dataCenters]);

  return (
    <div className="min-h-screen" ref={pageRef}>
      {/* Header */}
      <header className="pt-28 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">Home</Link>
            <span>/</span>
            <Link to="/map" className="hover:text-accent-cyan transition-colors">Map</Link>
            <span>/</span>
            <span className="text-text-secondary">{data.countryName}</span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-title text-text-primary">{data.countryName}</h1>
              <p className="text-body text-text-secondary mt-3 max-w-2xl">
                AI compute infrastructure overview for {data.countryName}. Showing all tracked facilities
                including supply chain nodes, foundry fabs, and data centers.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ExportPdfButton targetRef={pageRef} filename={`country-${code}-report`} />
              <Link
                to="/map"
                className="flex items-center gap-2 px-4 py-2 text-mono-sm text-text-secondary border border-border-subtle rounded-lg hover:text-accent-cyan hover:border-accent-cyan transition-colors"
              >
                ← 返回地图
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: data.totalFacilities, label: '总设施数' },
              { value: data.fabs.length, label: '晶圆工厂' },
              { value: data.dataCenters.length, label: '数据中心' },
              { value: `${data.totalPowerMW.toLocaleString()} MW`, label: '总功率容量' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <p className="text-mono-lg text-accent-cyan">{stat.value}</p>
                <p className="text-mono-sm text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Charts */}
      {data.totalFacilities > 0 && (
        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-section text-text-primary">设施分布</h2>
            <p className="text-sm text-text-secondary mt-2">
              Breakdown of tracked infrastructure by type and status
            </p>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Layer Pie */}
              {data.layerDist.length > 0 && (
                <div className="bg-[#111118] border border-[#1E1E28] rounded-lg p-5">
                  <h3 className="text-mono-sm text-[#6B6B80] uppercase tracking-wider mb-3">
                    设施类型分布
                  </h3>
                  <div style={{ height: 260 }}>
                    <ReactECharts option={layerPieOption} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'canvas' }} />
                  </div>
                </div>
              )}

              {/* Status Pie */}
              {data.statusDist.length > 0 && (
                <div className="bg-[#111118] border border-[#1E1E28] rounded-lg p-5">
                  <h3 className="text-mono-sm text-[#6B6B80] uppercase tracking-wider mb-3">
                    运营状态分布
                  </h3>
                  <div style={{ height: 260 }}>
                    <ReactECharts option={statusPieOption} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'canvas' }} />
                  </div>
                </div>
              )}

              {/* Provider Bar */}
              {data.dataCenters.length > 0 && (
                <div className="bg-[#111118] border border-[#1E1E28] rounded-lg p-5">
                  <h3 className="text-mono-sm text-[#6B6B80] uppercase tracking-wider mb-3">
                    数据中心供应商 (MW)
                  </h3>
                  <div style={{ height: 260 }}>
                    <ReactECharts option={providerChartOption} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'canvas' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Data Centers List */}
      {data.dataCenters.length > 0 && (
        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-section text-text-primary">数据中心 ({data.dataCenters.length})</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">名称</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">供应商</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">城市</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">功率</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">PUE</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dataCenters.map((dc) => (
                    <tr key={dc.id} className="border-b border-border-subtle/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-3 py-3 text-text-primary font-medium">{dc.name}</td>
                      <td className="px-3 py-3 text-text-secondary">{dc.provider}</td>
                      <td className="px-3 py-3 text-text-secondary">{dc.city}</td>
                      <td className="px-3 py-3 text-mono-sm text-accent-cyan">{dc.powerCapacity} {dc.powerUnit}</td>
                      <td className="px-3 py-3 text-mono-sm text-text-secondary">{dc.pue}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5 text-mono-sm">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            dc.status === 'operational' ? 'bg-[#22C55E]' :
                            dc.status === 'construction' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                          }`} />
                          {dc.status === 'operational' ? '运营中' :
                           dc.status === 'construction' ? '建设中' : '规划中'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Foundry Fabs List */}
      {data.fabs.length > 0 && (
        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-section text-text-primary">晶圆工厂 ({data.fabs.length})</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">名称</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">公司</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">城市</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">制程</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">产能</th>
                    <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fabs.map((fab) => (
                    <tr key={fab.id} className="border-b border-border-subtle/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-3 py-3 text-text-primary font-medium">{fab.name}</td>
                      <td className="px-3 py-3 text-text-secondary">{fab.company}</td>
                      <td className="px-3 py-3 text-text-secondary">{fab.city}</td>
                      <td className="px-3 py-3 text-mono-sm text-[#00D4FF]">{fab.processNode}</td>
                      <td className="px-3 py-3 text-mono-sm text-text-secondary">{fab.capacity}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5 text-mono-sm">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            fab.status === 'operational' ? 'bg-[#22C55E]' :
                            fab.status === 'construction' ? 'bg-[#F59E0B]' :
                            fab.status === 'expansion' ? 'bg-[#38bdf8]' : 'bg-[#EF4444]'
                          }`} />
                          {fab.status === 'operational' ? '运营中' :
                           fab.status === 'construction' ? '建设中' :
                           fab.status === 'expansion' ? '扩建中' : '规划中'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {data.totalFacilities === 0 && (
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-text-muted text-lg mb-4">
              暂无 {data.countryName} 的设施数据
            </p>
            <p className="text-text-muted text-sm mb-8">
              No facility data available for this country/region yet.
            </p>
            <Link
              to="/map"
              className="px-6 py-3 bg-accent-cyan text-bg-base font-semibold rounded-lg transition-all duration-200 hover:brightness-110"
            >
              返回地图
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
