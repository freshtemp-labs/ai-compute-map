/**
 * @file FoundryCharts.tsx
 * @description 晶圆代工数据可视化图表组件集合。
 *   包含市场占比环形图、营收趋势图、产能预测图、GAA 制程对比雷达图。
 *   所有图表使用 ECharts 渲染，memo 优化防止重复渲染。
 * @dependencies echarts-for-react, memo (react), ./data
 */
import { memo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import { foundryMarketData, revenueTrendData } from './data';

/* ── 市场占比环形图 ── */
/** 晶圆代工市场份额环形图，中央显示总市场规模 */
export const DonutChart = memo(function DonutChart() {
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
});

/* ── 营收趋势图 ── */
/** 主要代工厂商历年营收趋势折线图（TSMC, Samsung, Intel, SMIC） */
export const RevenueTrendChart = memo(function RevenueTrendChart() {
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
});

/* ── 产能预测图 ── */
/** 先进制程产能堆叠面积图，含 2024-2030 年预测 */
export const CapacityProjectionChart = memo(function CapacityProjectionChart() {
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
});

/* ── GAA 对比雷达图 ── */
/** Samsung 3nm GAA 与 TSMC 3nm FinFET 五维对比雷达图 */
export const GaaComparisonChart = memo(function GaaComparisonChart() {
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
});
