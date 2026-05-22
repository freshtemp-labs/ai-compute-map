/**
 * @file GlobeView.tsx
 * @description 3D Globe view using ECharts GL to render facility points
 * on an interactive rotating earth. Supports click on points for details.
 *
 * @dependencies echarts, echarts-gl, @/components/map/useMapData
 */
import { useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';
import type { MapPin } from '@/components/map/useMapData';
import { LAYER_COLORS } from '@/constants/layerColors';

interface GlobeViewProps {
  pins: MapPin[];
  activeLayers: Record<string, boolean>;
  onPinClick?: (pin: MapPin) => void;
}

export default function GlobeView({ pins, activeLayers, onPinClick }: GlobeViewProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const pinsMapRef = useRef<Map<string, MapPin>>(new Map());

  const initChart = useCallback(() => {
    if (!chartRef.current) return;

    if (instanceRef.current) {
      instanceRef.current.dispose();
    }

    const chart = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
    instanceRef.current = chart;

    const filteredPins = pins.filter((pin) => activeLayers[pin.layer]);

    // Build a lookup map for click handling
    const pinMap = new Map<string, MapPin>();
    filteredPins.forEach((p) => pinMap.set(p.id, p));
    pinsMapRef.current = pinMap;

    const seriesData = filteredPins.map((pin) => ({
      name: pin.name,
      value: [pin.lng, pin.lat, typeof pin.value === 'number' ? pin.value : 1],
      _pinId: pin.id,
      itemStyle: {
        color: LAYER_COLORS[pin.layer],
      },
    }));

    // Use `as any` to bypass TS restrictions for echarts-gl 3D series types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const option: any = {
      backgroundColor: '#0A0A0F',
      globe: {
        globeRadius: 80,
        globeOuterRadius: 82,
        environment: '#0A0A0F',
        baseColor: '#0A0A0F',
        shading: 'color',
        light: {
          main: {
            intensity: 0.8,
            shadow: false,
          },
          ambient: {
            intensity: 0.4,
          },
        },
        atmosphere: {
          show: true,
          color: '#00D4FF',
          offset: 4,
        },
        viewControl: {
          autoRotate: true,
          autoRotateSpeed: 3,
          autoRotateAfterStill: 3,
          distance: 200,
          alpha: 30,
          beta: 40,
          rotateSensitivity: 2,
          zoomSensitivity: 1.5,
          panSensitivity: 1,
          damping: 0.9,
          animationDurationUpdate: 1000,
          animationEasingUpdate: 'cubicInOut',
        },
      },
      series: [
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          data: seriesData,
          symbolSize: (val: number[]) => {
            const v = val[2] || 1;
            if (typeof v === 'number' && v > 100) return Math.min(Math.log(v) * 4, 20);
            return 6;
          },
          itemStyle: {
            opacity: 0.9,
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              borderWidth: 2,
              borderColor: '#fff',
            },
            label: {
              show: true,
              formatter: '{b}',
              textStyle: {
                color: '#fff',
                fontSize: 12,
              },
            },
          },
          label: {
            show: false,
          },
        },
      ],
    };

    chart.setOption(option);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chart.on('click', (params: any) => {
      const pinId = params.data?._pinId;
      if (pinId && onPinClick) {
        const pin = pinsMapRef.current.get(pinId);
        if (pin) onPinClick(pin);
      }
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pins, activeLayers, onPinClick]);

  useEffect(() => {
    const cleanup = initChart();
    return () => {
      cleanup?.();
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [initChart]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
