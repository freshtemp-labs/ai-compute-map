/**
 * @file TrendChart.tsx
 * @description 趋势折线图组件，展示全球数据中心装机容量随时间的变化趋势。
 * 支持实际数据与预测数据的混合展示，使用 ECharts 渲染。
 *
 * @dependencies echarts-for-react
 */
import ReactECharts from 'echarts-for-react';

/** 趋势数据点 */
interface TrendDataPoint {
  /** 年份标签 */
  year: string;
  /** 装机容量 */
  capacity: number;
  /** 是否为预测值 */
  projected?: boolean;
}

/** 趋势图组件属性 */
interface TrendChartProps {
  /** 图表标题 */
  title?: string;
  /** 趋势数据数组 */
  data?: TrendDataPoint[];
  /** 数据单位 */
  unit?: string;
  /** 折线颜色 */
  color?: string;
}

/** 默认趋势数据：2020-2030年全球数据中心装机容量（TWh），含预测值(E标记) */
const DEFAULT_DATA: TrendDataPoint[] = [
  { year: '2020', capacity: 250 },
  { year: '2021', capacity: 290 },
  { year: '2022', capacity: 320 },
  { year: '2023', capacity: 370 },
  { year: '2024', capacity: 430 },
  { year: '2025', capacity: 485 },
  { year: '2026E', capacity: 550, projected: true },
  { year: '2027E', capacity: 630, projected: true },
  { year: '2028E', capacity: 720, projected: true },
  { year: '2029E', capacity: 830, projected: true },
  { year: '2030E', capacity: 945, projected: true },
];

/**
 * TrendChart 装机容量趋势折线图组件
 * 展示历史数据与预测数据，含最大值标注与均值参考线
 */
export default function TrendChart({
  title = '全球数据中心装机容量趋势',
  data = DEFAULT_DATA,
  unit = 'TWh',
  color = '#A855F7',
}: TrendChartProps) {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      left: 'center',
      textStyle: { color: '#E0E0E8', fontSize: 14, fontWeight: 600 },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20,20,30,0.9)',
      borderColor: '#333',
      textStyle: { color: '#E0E0E8' },
      formatter: (params: { name: string; value: number; seriesName: string }[]) => {
        const p = params[0];
        return `<b>${p.name}</b><br/>${p.seriesName}: ${p.value} ${unit}`;
      },
    },
    grid: { left: 60, right: 30, top: 50, bottom: 40 },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.year),
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#999' },
    },
    yAxis: {
      type: 'value',
      name: unit,
      nameTextStyle: { color: '#999' },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: '#999' },
    },
    series: [
      {
        name: title,
        type: 'line',
        data: data.map((d) => d.capacity),
        smooth: true,
        lineStyle: { color, width: 2 },
        itemStyle: { color },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: color + '40' },
              { offset: 1, color: color + '05' },
            ],
          },
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
          ],
          itemStyle: { color },
        },
        markLine: {
          data: [{ type: 'average', name: 'Average' }],
          lineStyle: { color: '#666', type: 'dashed' },
          label: { color: '#999' },
        },
      },
    ],
  };

  return (
    <div className="rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.02)] p-4">
      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
}
