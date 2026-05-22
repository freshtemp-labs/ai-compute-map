/**
 * @file DataQualityDashboard.tsx
 * @description Data quality monitoring dashboard showing completeness,
 * consistency, timeliness scores, source distribution, and missing fields.
 */
import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { supplyChainData, fabricationFacilities, dataCenters, sourcesTableData } from '@/data/mockData';
import {
  computeQualityScore,
  computeSourceDistribution,
  computeMissingFields,
  computeSourceEntryDistribution,
} from '@/utils/dataQuality';

function ScoreRing({ label, score, color }: { label: string; score: number; color: string }) {
  const ringOption = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'pie',
        radius: ['65%', '85%'],
        center: ['50%', '50%'],
        startAngle: 90,
        silent: true,
        label: { show: false },
        data: [
          { value: score, itemStyle: { color } },
          { value: 100 - score, itemStyle: { color: 'rgba(255,255,255,0.04)' } },
        ],
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: `${score}`,
          fontSize: 22,
          fontWeight: 700,
          fill: color,
          textAlign: 'center',
        },
      },
    ],
  };

  return (
    <div className="flex flex-col items-center">
      <ReactECharts option={ringOption} style={{ width: 120, height: 120 }} opts={{ renderer: 'svg' }} />
      <span className="text-xs text-text-secondary mt-1">{label}</span>
    </div>
  );
}

export default function DataQualityDashboard() {
  const scores = useMemo(
    () => computeQualityScore(supplyChainData, fabricationFacilities, dataCenters),
    [],
  );
  const sourceDist = useMemo(
    () => computeSourceDistribution(supplyChainData, fabricationFacilities, dataCenters),
    [],
  );
  const sourceEntryDist = useMemo(() => computeSourceEntryDistribution(sourcesTableData), []);
  const missingFields = useMemo(
    () => computeMissingFields(supplyChainData, fabricationFacilities, dataCenters),
    [],
  );

  const sourcePieOption = {
    backgroundColor: 'transparent',
    title: { text: '数据来源层级分布', left: 'center', textStyle: { color: '#E0E0E8', fontSize: 13 } },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(20,20,30,0.9)',
      borderColor: '#333',
      textStyle: { color: '#E0E0E8' },
    },
    legend: {
      bottom: 5,
      textStyle: { color: '#999', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '65%'],
        center: ['50%', '45%'],
        label: { color: '#ccc', fontSize: 11 },
        data: [
          { name: '一级来源 (Tier 1)', value: sourceDist.tier1, itemStyle: { color: '#34D399' } },
          { name: '二级来源 (Tier 2)', value: sourceDist.tier2, itemStyle: { color: '#FFB84D' } },
          { name: '三级来源 (Tier 3)', value: sourceDist.tier3, itemStyle: { color: '#F87171' } },
        ],
      },
    ],
  };

  const missingBarOption = {
    backgroundColor: 'transparent',
    title: { text: '缺失数据字段统计', left: 'center', textStyle: { color: '#E0E0E8', fontSize: 13 } },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20,20,30,0.9)',
      borderColor: '#333',
      textStyle: { color: '#E0E0E8' },
    },
    grid: { left: 110, right: 30, top: 40, bottom: 20 },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { color: '#999', formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    yAxis: {
      type: 'category',
      data: missingFields.map((f) => f.field),
      axisLabel: { color: '#ccc', fontSize: 11 },
      axisLine: { lineStyle: { color: '#333' } },
    },
    series: [
      {
        type: 'bar',
        data: missingFields.map((f) => ({
          value: f.percent,
          itemStyle: {
            color: f.percent > 20 ? '#F87171' : f.percent > 10 ? '#FFB84D' : '#34D399',
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: 16,
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          color: '#999',
          fontSize: 10,
        },
      },
    ],
  };

  const statusPieOption = {
    backgroundColor: 'transparent',
    title: { text: '来源条目状态分布', left: 'center', textStyle: { color: '#E0E0E8', fontSize: 13 } },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(20,20,30,0.9)',
      borderColor: '#333',
      textStyle: { color: '#E0E0E8' },
    },
    legend: {
      bottom: 5,
      textStyle: { color: '#999', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '65%'],
        center: ['50%', '45%'],
        label: { color: '#ccc', fontSize: 11 },
        data: [
          { name: 'Tier 1 (一级)', value: sourceEntryDist.tier1, itemStyle: { color: '#34D399' } },
          { name: 'Tier 2 (二级)', value: sourceEntryDist.tier2, itemStyle: { color: '#FFB84D' } },
          { name: 'Tier 3 (三级)', value: sourceEntryDist.tier3, itemStyle: { color: '#F87171' } },
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Overall score banner */}
      <div className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
        <h3 className="text-lg font-semibold text-text-primary mb-4">数据质量总览</h3>
        <div className="flex items-center justify-around flex-wrap gap-4">
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-2"
              style={{
                color: scores.overall >= 80 ? '#34D399' : scores.overall >= 60 ? '#FFB84D' : '#F87171',
                borderColor: scores.overall >= 80 ? '#34D399' : scores.overall >= 60 ? '#FFB84D' : '#F87171',
              }}
            >
              {scores.overall}
            </div>
            <span className="text-xs text-text-secondary mt-2">综合评分</span>
          </div>
          <ScoreRing label="数据完整性" score={scores.completeness} color="#00D4FF" />
          <ScoreRing label="数据一致性" score={scores.consistency} color="#A855F7" />
          <ScoreRing label="数据时效性" score={scores.timeliness} color="#FFB84D" />
        </div>
      </div>

      {/* Source distribution and missing fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.02)] p-4">
          <ReactECharts option={sourcePieOption} style={{ height: 280 }} />
        </div>
        <div className="rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.02)] p-4">
          <ReactECharts option={statusPieOption} style={{ height: 280 }} />
        </div>
        <div className="rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.02)] p-4">
          <ReactECharts option={missingBarOption} style={{ height: 280 }} />
        </div>
      </div>
    </div>
  );
}
