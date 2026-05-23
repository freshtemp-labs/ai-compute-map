/**
 * @file FunnelChart.tsx
 * @description 漏斗图组件，展示晶圆代工厂制程节点产能占比分布。
 * 使用 ECharts funnel 系列从先进制程到成熟制程逐级展示。
 *
 * @dependencies echarts-for-react
 */
import ReactECharts from 'echarts-for-react';

/** 漏斗图数据项 */
interface FunnelDataItem {
  /** 制程节点名称 */
  name: string;
  /** 产能占比值 */
  value: number;
}

/** 漏斗图组件属性 */
interface FunnelChartProps {
  /** 图表标题 */
  title?: string;
  /** 漏斗数据数组 */
  data?: FunnelDataItem[];
}

/** 默认制程节点分布数据（产能占比%） */
const DEFAULT_DATA: FunnelDataItem[] = [
  { name: '3nm 及以下', value: 15 },
  { name: '5nm', value: 25 },
  { name: '7nm', value: 35 },
  { name: '10-14nm', value: 50 },
  { name: '16-28nm', value: 65 },
  { name: '40-65nm', value: 45 },
  { name: '90nm+', value: 30 },
];

/** 漏斗图各层级色板（从先进到成熟制程） */
const FUNNEL_COLORS = ['#A855F7', '#818CF8', '#00D4FF', '#34D399', '#FFB84D', '#F87171', '#6B6B80'];

/**
 * FunnelChart 制程节点漏斗图组件
 * 按产能占比从先进到成熟制程逐级展示晶圆厂产能分布
 */
export default function FunnelChart({
  title = '制程节点分布（产能占比）',
  data = DEFAULT_DATA,
}: FunnelChartProps) {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      left: 'center',
      textStyle: { color: '#E0E0E8', fontSize: 14, fontWeight: 600 },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(20,20,30,0.9)',
      borderColor: '#333',
      textStyle: { color: '#E0E0E8' },
      formatter: '{b}: {c}%',
    },
    series: [
      {
        type: 'funnel',
        left: '10%',
        top: 50,
        bottom: 20,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '10%',
        maxSize: '100%',
        sort: 'descending',
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 12,
          fontWeight: 500,
        },
        itemStyle: {
          borderColor: 'rgba(0,0,0,0.3)',
          borderWidth: 1,
        },
        data: data.map((d, i) => ({
          ...d,
          itemStyle: { color: FUNNEL_COLORS[i % FUNNEL_COLORS.length] },
        })),
      },
    ],
  };

  return (
    <div className="rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.02)] p-4">
      <ReactECharts option={option} style={{ height: 360 }} />
    </div>
  );
}
