/**
 * @file GaugeDashboard.tsx
 * @description Dashboard with gauge charts showing key AI compute indicators.
 * Uses ECharts gauge series.
 */
import ReactECharts from 'echarts-for-react';

interface GaugeItem {
  name: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}

interface GaugeDashboardProps {
  gauges?: GaugeItem[];
}

const DEFAULT_GAUGES: GaugeItem[] = [
  { name: '全球数据中心能耗', value: 485, max: 1000, unit: 'TWh', color: '#A855F7' },
  { name: 'EUV 光刻机部署量', value: 418, max: 600, unit: '台', color: '#00D4FF' },
  { name: '先进制程产能利用率', value: 87, max: 100, unit: '%', color: '#34D399' },
  { name: '可再生能源占比', value: 42, max: 100, unit: '%', color: '#FFB84D' },
];

export default function GaugeDashboard({ gauges = DEFAULT_GAUGES }: GaugeDashboardProps) {
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
