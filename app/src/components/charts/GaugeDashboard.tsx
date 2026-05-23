/**
 * @file GaugeDashboard.tsx
 * @description 仪表盘组件，展示 AI 算力关键指标（数据中心能耗、EUV部署量、产能利用率、可再生能源占比）。
 * 使用 ECharts gauge 系列实现半圆进度仪表。
 *
 * @dependencies echarts-for-react
 */
import ReactECharts from 'echarts-for-react';

/** 仪表盘数据项 */
interface GaugeItem {
  /** 指标名称 */
  name: string;
  /** 当前值 */
  value: number;
  /** 最大值 */
  max: number;
  /** 单位 */
  unit: string;
  /** 指示颜色 */
  color: string;
}

/** 仪表盘组件属性 */
interface GaugeDashboardProps {
  /** 仪表数据数组 */
  gauges?: GaugeItem[];
}

/** 默认仪表数据：全球数据中心能耗、EUV部署量、产能利用率、可再生能源占比 */
const DEFAULT_GAUGES: GaugeItem[] = [
  { name: '全球数据中心能耗', value: 485, max: 1000, unit: 'TWh', color: '#A855F7' },
  { name: 'EUV 光刻机部署量', value: 418, max: 600, unit: '台', color: '#00D4FF' },
  { name: '先进制程产能利用率', value: 87, max: 100, unit: '%', color: '#34D399' },
  { name: '可再生能源占比', value: 42, max: 100, unit: '%', color: '#FFB84D' },
];

/**
 * GaugeDashboard AI算力关键指标仪表盘组件
 * 以2x4网格展示多个半圆进度仪表
 */
export default function GaugeDashboard({ gauges = DEFAULT_GAUGES }: GaugeDashboardProps) {
  /** 生成单个仪表图 ECharts 配置 */
  const makeGaugeOption = (item: GaugeItem) => ({
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '80%',
        min: 0,
        max: item.max,
        startAngle: 200,
        endAngle: -20,
        progress: {
          show: true,
          width: 14,
          itemStyle: { color: item.color },
        },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, 'rgba(255,255,255,0.06)']],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        title: {
          show: true,
          offsetCenter: [0, '30%'],
          fontSize: 11,
          color: '#999',
        },
        detail: {
          valueAnimation: true,
          fontSize: 20,
          fontWeight: 700,
          color: item.color,
          offsetCenter: [0, '5%'],
          formatter: `{value} ${item.unit}`,
        },
        data: [{ value: item.value, name: item.name }],
      },
    ],
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {gauges.map((g) => (
        <div
          key={g.name}
          className="rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.02)] p-3"
        >
          <ReactECharts
            option={makeGaugeOption(g)}
            style={{ height: 200 }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      ))}
    </div>
  );
}
