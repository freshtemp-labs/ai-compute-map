/**
 * @file HeatmapLayer.tsx
 * @description ECharts-based heatmap overlay that shows compute density by country.
 * Aggregates pin counts per country and renders a choropleth map with a
 * blue-to-red gradient (low → high density). Shown as an alternative to the
 * standard AmCharts pin view.
 *
 * @dependencies echarts, echarts-for-react, @/components/map/useMapData
 */
import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { MapPin } from './useMapData';
import type { LayerType } from '@/types';

interface HeatmapLayerProps {
  pins: MapPin[];
  activeLayers: Record<LayerType, boolean>;
  onCountryClick?: (country: string, count: number) => void;
}

// ISO-3166 short name → common name mapping for ECharts geo
const COUNTRY_NAME_MAP: Record<string, string> = {
  'United States': 'United States of America',
  'South Korea': 'Korea',
  'North Korea': 'Dem. Rep. Korea',
  'Czech Republic': 'Czech Rep.',
  'Dominican Republic': 'Dominican Rep.',
  'Central African Republic': 'Central African Rep.',
  'South Sudan': 'S. Sudan',
  'Equatorial Guinea': 'Eq. Guinea',
  'Western Sahara': 'W. Sahara',
  'Solomon Is.': 'Solomon Islands',
};

/** Aggregate pins into country-level counts */
function aggregateByCountry(
  pins: MapPin[],
  activeLayers: Record<LayerType, boolean>
): { name: string; value: number }[] {
  const counts = new Map<string, number>();

  for (const pin of pins) {
    if (!activeLayers[pin.layer]) continue;
    const country = pin.country;
    if (!country) continue;
    counts.set(country, (counts.get(country) || 0) + 1);
  }

  return Array.from(counts.entries()).map(([name, value]) => ({
    name: COUNTRY_NAME_MAP[name] || name,
    value,
  }));
}

export default function HeatmapLayer({
  pins,
  activeLayers,
  onCountryClick,
}: HeatmapLayerProps) {
  const data = useMemo(
    () => aggregateByCountry(pins, activeLayers),
    [pins, activeLayers]
  );

  const maxValue = useMemo(
    () => Math.max(1, ...data.map((d) => d.value)),
    [data]
  );

  const option: EChartsOption = useMemo(
    () => ({
      backgroundColor: '#0A0A0F',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#111118',
        borderColor: '#2A2A3A',
        textStyle: { color: '#E8E8EC', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const val = typeof params.value === 'number' ? params.value : 0;
          if (val === 0) {
            return `<b>${params.name}</b><br/>No data`;
          }
          return `<b>${params.name}</b><br/>Facilities: <span style="color:#00D4FF">${val}</span>`;
        },
      },
      visualMap: {
        min: 0,
        max: maxValue,
        left: 20,
        bottom: 30,
        text: ['High', 'Low'],
        textStyle: {
          color: '#9A9AAF',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
        },
        inRange: {
          color: ['#0D1B3E', '#1B3A6B', '#2E6B9E', '#4FA3C8', '#7FCEAC', '#C4E87A', '#F5D442', '#F28E2B', '#E15759', '#B22234'],
        },
        calculable: true,
        realtime: false,
        itemWidth: 14,
        itemHeight: 120,
      },
      series: [
        {
          name: 'AI Compute Density',
          type: 'map',
          map: 'world',
          roam: true,
          emphasis: {
            label: { show: true, color: '#E8E8EC', fontSize: 12 },
            itemStyle: {
              areaColor: '#2A2A3A',
              borderColor: '#E8E8EC',
              borderWidth: 1,
            },
          },
          itemStyle: {
            areaColor: '#181820',
            borderColor: '#2A2A3A',
            borderWidth: 0.5,
          },
          label: { show: false },
          data,
        },
      ],
    }),
    [data, maxValue]
  );

  const onEvents = useMemo(
    () => ({
      click: (params: { name: string; data?: { value: number } }) => {
        if (onCountryClick && params.data) {
          onCountryClick(params.name, params.data.value);
        }
      },
    }),
    [onCountryClick]
  );

  return (
    <div
      className="absolute inset-0 z-10"
      role="img"
      aria-label={`Heatmap showing AI compute facility density across ${data.length} countries. Maximum density: ${maxValue} facilities.`}
    >
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
        onEvents={onEvents}
        notMerge
      />
    </div>
  );
}

