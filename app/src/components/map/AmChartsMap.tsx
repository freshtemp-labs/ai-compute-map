import { useEffect, useRef, useCallback } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import type { MapPin } from './useMapData';
import type { LayerType } from '@/types';
import { LAYER_COLORS } from '@/constants/layerColors';

// ── Cluster data structure ─────────────────────────────────────────
interface ClusterData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  count: number;
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  isCluster: true;
  layer: LayerType;
}

// ── Component props ────────────────────────────────────────────────
interface AmChartsMapProps {
  pins: MapPin[];
  activeLayers: Record<LayerType, boolean>;
  onPinClick: (pin: MapPin) => void;
  selectedPin: MapPin | null;
  highlightedPinId?: string | null;
  onMapReady?: (chart: am5map.MapChart) => void;
}

// ── Grid-based clustering algorithm ────────────────────────────────
function calculateClusters(visiblePins: MapPin[], zoomLevel: number): (MapPin | ClusterData)[] {
  if (zoomLevel >= 4) return visiblePins;

  const gridSize = 50 / Math.pow(zoomLevel, 0.8);
  const grid = new Map<string, MapPin[]>();

  for (const pin of visiblePins) {
    const cellX = Math.floor(pin.lng / gridSize);
    const cellY = Math.floor(pin.lat / gridSize);
    const key = `${cellX}:${cellY}`;
    const cell = grid.get(key);
    if (cell) {
      cell.push(pin);
    } else {
      grid.set(key, [pin]);
    }
  }

  const result: (MapPin | ClusterData)[] = [];
  for (const pinsInCell of grid.values()) {
    if (pinsInCell.length <= 1) {
      result.push(...pinsInCell);
    } else {
      const avgLat = pinsInCell.reduce((s, p) => s + p.lat, 0) / pinsInCell.length;
      const avgLng = pinsInCell.reduce((s, p) => s + p.lng, 0) / pinsInCell.length;
      result.push({
        id: `cluster-${avgLat.toFixed(2)}-${avgLng.toFixed(2)}`,
        name: `${pinsInCell.length} facilities`,
        lat: avgLat,
        lng: avgLng,
        count: pinsInCell.length,
        bounds: {
          minLat: Math.min(...pinsInCell.map((p) => p.lat)),
          maxLat: Math.max(...pinsInCell.map((p) => p.lat)),
          minLng: Math.min(...pinsInCell.map((p) => p.lng)),
          maxLng: Math.max(...pinsInCell.map((p) => p.lng)),
        },
        isCluster: true,
        layer: pinsInCell[0].layer,
      });
    }
  }
  return result;
}

// ── Main component ─────────────────────────────────────────────────
export default function AmChartsMap({ pins, activeLayers, onPinClick, selectedPin, highlightedPinId, onMapReady }: AmChartsMapProps) {
  const chartRef = useRef<am5map.MapChart | null>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const seriesRef = useRef<am5map.MapPointSeries | null>(null);
  const polygonSeriesRef = useRef<am5map.MapPolygonSeries | null>(null);
  const onPinClickRef = useRef(onPinClick);
  const onMapReadyRef = useRef(onMapReady);
  const zoomLevelRef = useRef(1.1);
  const currentDataRef = useRef<(MapPin | ClusterData)[]>([]);

  // Keep refs in sync with latest props
  useEffect(() => { onPinClickRef.current = onPinClick; }, [onPinClick]);
  useEffect(() => { onMapReadyRef.current = onMapReady; }, [onMapReady]);

  // Initialize chart once
  useEffect(() => {
    const root = am5.Root.new('map-container');
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
        maxZoomLevel: 20,
        minZoomLevel: 1,
        zoomLevel: 1.1,
        wheelY: 'zoom',
        panX: 'rotateX',
        panY: 'translateY',
        background: am5.Rectangle.new(root, {
          fill: am5.color(0x0A0A0F),
          fillOpacity: 1,
        }),
      })
    );
    chartRef.current = chart;

    // Zoom Control
    const zoomControl = am5map.ZoomControl.new(root, {});
    zoomControl.homeButton.set('visible', true);
    chart.set('zoomControl', zoomControl);

    // Style zoom control buttons
    zoomControl.plusButton.get('background')!.setAll({
      fill: am5.color(0x111118),
      stroke: am5.color(0x2A2A3A),
    });
    zoomControl.minusButton.get('background')!.setAll({
      fill: am5.color(0x111118),
      stroke: am5.color(0x2A2A3A),
    });
    zoomControl.homeButton!.get('background')!.setAll({
      fill: am5.color(0x111118),
      stroke: am5.color(0x2A2A3A),
    });

    // Country polygons
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
      })
    );
    polygonSeriesRef.current = polygonSeries;

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x181820),
      fillOpacity: 0.4,
      stroke: am5.color(0x2A2A3A),
      strokeOpacity: 0.3,
      strokeWidth: 0.5,
      tooltipText: '{name}',
    });

    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: am5.color(0x22222E),
      fillOpacity: 0.6,
    });

    // Graticule series
    const graticuleSeries = chart.series.push(
      am5map.GraticuleSeries.new(root, { step: 30 })
    );
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0x1E1E28),
      strokeOpacity: 0.3,
      strokeWidth: 0.3,
    });

    // Point series for pins & clusters
    const pointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: 'lat',
        longitudeField: 'lng',
      })
    );
    seriesRef.current = pointSeries;

    // Bullet rendering (clusters + individual pins)
    pointSeries.bullets.push((_root: am5.Root, _series: unknown, dataItem: am5.DataItem<am5map.IMapPointSeriesDataItem>) => {
      const data = dataItem.dataContext as unknown as MapPin | ClusterData;
      if (!data) return null as unknown as am5.Bullet;

      const container = am5.Container.new(_root, {
        centerX: am5.percent(50),
        centerY: am5.percent(50),
      });

      // ── Cluster rendering ────────────────────────────────────────
      if ('isCluster' in data && data.isCluster) {
        const cluster = data as ClusterData;
        const mainColor = LAYER_COLORS[cluster.layer] || '#FFFFFF';
        const baseRadius = Math.min(18, 8 + Math.sqrt(cluster.count) * 3);

        // Glow ring
        const glow = am5.Circle.new(_root, {
          radius: baseRadius + 6,
          fill: am5.color(mainColor),
          fillOpacity: 0.08,
          centerX: am5.percent(50),
          centerY: am5.percent(50),
        });
        glow.animate({
          key: 'fillOpacity',
          from: 0.08,
          to: 0.18,
          duration: 1500,
          loops: Infinity,
          easing: am5.ease.inOut(am5.ease.sine),
        });
        container.children.push(glow);

        // Main circle
        const circle = am5.Circle.new(_root, {
          radius: baseRadius,
          fill: am5.color(0x111118),
          fillOpacity: 0.92,
          stroke: am5.color(mainColor),
          strokeWidth: 2,
          strokeOpacity: 0.8,
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          tooltipText: `${cluster.name}`,
          cursorOverStyle: 'pointer',
        });
        container.children.push(circle);

        // Count label
        const label = am5.Label.new(_root, {
          text: String(cluster.count),
          fill: am5.color(mainColor),
          fontSize: baseRadius > 12 ? 13 : 11,
          fontWeight: 'bold',
          fontFamily: 'JetBrains Mono, monospace',
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          populateText: false,
        });
        container.children.push(label);

        // Click → zoom to cluster bounds
        container.events.on('click', () => {
          const chart = chartRef.current;
          if (!chart) return;
          const padding = 5;
          chart.zoomToGeoBounds({
            left: cluster.bounds.minLng - padding,
            right: cluster.bounds.maxLng + padding,
            top: cluster.bounds.maxLat + padding,
            bottom: cluster.bounds.minLat - padding,
          });
        });

        return am5.Bullet.new(_root, { sprite: container });
      }

      // ── Individual pin rendering ─────────────────────────────────
      const pin = data as MapPin;
      const color = LAYER_COLORS[pin.layer] || '#FFFFFF';
      const size = getPinSize(pin);
      const isHighlighted = pin._highlighted;
      const isSelected = pin._selected;

      container.set('width', size * 3);
      container.set('height', size * 3);

      // Pulse ring
      const pulseRing = am5.Circle.new(_root, {
        radius: size,
        fill: am5.color(color),
        fillOpacity: 0,
        stroke: am5.color(color),
        strokeWidth: isHighlighted ? 2.5 : 1,
        strokeOpacity: isHighlighted ? 0.8 : 0.3,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
      });
      pulseRing.animate({
        key: 'radius',
        from: size * 0.5,
        to: isHighlighted ? size * 3.5 : size * 2,
        duration: isHighlighted ? 1000 : 2500,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.sine),
      });
      pulseRing.animate({
        key: 'strokeOpacity',
        from: isHighlighted ? 0.9 : 0.4,
        to: 0,
        duration: isHighlighted ? 1000 : 2500,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.sine),
      });
      container.children.push(pulseRing);

      // Extra highlight ring for search results
      if (isHighlighted) {
        const highlightRing = am5.Circle.new(_root, {
          radius: size * 1.8,
          fill: am5.color(color),
          fillOpacity: 0,
          stroke: am5.color(0xFFFFFF),
          strokeWidth: 1.5,
          strokeOpacity: 0.6,
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          strokeDasharray: [3, 3],
        });
        highlightRing.animate({
          key: 'rotation',
          from: 0,
          to: 360,
          duration: 3000,
          loops: Infinity,
          easing: am5.ease.linear,
        });
        container.children.push(highlightRing);
      }

      // Main pin shape
      let pinShape: am5.Circle | am5.RoundedRectangle;
      const actualSize = isHighlighted ? size * 1.4 : size;

      if (pin.layer === 'datacenter') {
        pinShape = am5.Circle.new(_root, {
          radius: actualSize,
          fill: am5.color(color),
          fillOpacity: isHighlighted ? 1 : 0.85,
          stroke: am5.color(isSelected ? 0xFFFFFF : am5.Color.fromString(color).toCSSHex() as unknown as number),
          strokeWidth: isHighlighted ? 3 : isSelected ? 2.5 : 1.5,
          strokeOpacity: isHighlighted ? 1 : 0.5,
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          tooltipText: formatTooltip(pin),
        });
      } else if (pin.layer === 'foundry') {
        pinShape = am5.RoundedRectangle.new(_root, {
          width: actualSize * 2,
          height: actualSize * 2,
          fill: am5.color(color),
          fillOpacity: isHighlighted ? 1 : 0.85,
          stroke: am5.color(isSelected ? 0xFFFFFF : am5.Color.fromString(color).toCSSHex() as unknown as number),
          strokeWidth: isHighlighted ? 3 : isSelected ? 2.5 : 1.5,
          strokeOpacity: isHighlighted ? 1 : 0.5,
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          tooltipText: formatTooltip(pin),
        });
      } else {
        // Supply chain - diamond shape
        pinShape = am5.RoundedRectangle.new(_root, {
          width: actualSize * 1.6,
          height: actualSize * 1.6,
          fill: am5.color(color),
          fillOpacity: isHighlighted ? 1 : 0.85,
          stroke: am5.color(isSelected ? 0xFFFFFF : am5.Color.fromString(color).toCSSHex() as unknown as number),
          strokeWidth: isHighlighted ? 3 : isSelected ? 2.5 : 1.5,
          strokeOpacity: isHighlighted ? 1 : 0.5,
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          rotation: 45,
          tooltipText: formatTooltip(pin),
        });
      }

      // Hover state
      pinShape.states.create('hover', {
        scale: 1.4,
        strokeWidth: 2.5,
        strokeOpacity: 0.8,
      });

      container.children.push(pinShape);

      // Click handler on container
      container.events.on('click', () => {
        onPinClickRef.current(pin);
      });

      // Cursor style
      container.set('cursorOverStyle', 'pointer');

      return am5.Bullet.new(_root, { sprite: container });
    });

    // Tooltip styling
    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 16,
      paddingRight: 16,
    });
    tooltip.get('background')!.setAll({
      fill: am5.color(0x111118),
      fillOpacity: 1,
      stroke: am5.color(0x2A2A3A),
      strokeWidth: 1,
    });
    pointSeries.set('tooltip', tooltip);

    // Track zoom level changes for clustering recalculation
    chart.on('zoomLevel', () => {
      const zl = chart.get('zoomLevel') ?? 1;
      if (Math.abs(zl - zoomLevelRef.current) > 0.3) {
        zoomLevelRef.current = zl;
        updateData();
      }
    });

    onMapReadyRef.current?.(chart);

    return () => {
      root.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update data when pins or active layers change
  const updateData = useCallback(() => {
    if (!seriesRef.current) return;

    const visiblePins = pins.filter((pin) => activeLayers[pin.layer]);
    const processedData = calculateClusters(visiblePins, zoomLevelRef.current);
    currentDataRef.current = processedData;

    seriesRef.current.data.setAll(
      processedData.map((item) => ({
        ...item,
        _highlighted: 'isCluster' in item ? false : (item as MapPin).id === highlightedPinId,
        _selected: 'isCluster' in item ? false : (item as MapPin).id === selectedPin?.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [item.lng, item.lat],
        },
      }))
    );
  }, [pins, activeLayers, highlightedPinId, selectedPin]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  return <div id="map-container" style={{ width: '100%', height: '100%' }} />;
}

// ── Helpers ────────────────────────────────────────────────────────

function getPinSize(pin: MapPin): number {
  const importance = getPinImportance(pin);
  return 4 + importance * 8; // Range from 4 to 12
}

function getPinImportance(pin: MapPin): number {
  switch (pin.layer) {
    case 'supply':
      if (typeof pin.value === 'number') return Math.min(pin.value / 30000, 1);
      return 0.5;
    case 'foundry':
      return pin.company === 'TSMC' ? 1 : pin.company === 'Samsung Foundry' ? 0.8 : 0.5;
    case 'datacenter':
      return (pin.powerCapacity || 0) > 300 ? 1 : (pin.powerCapacity || 0) > 100 ? 0.7 : 0.4;
    default:
      return 0.5;
  }
}

function formatTooltip(pin: MapPin): string {
  const layerLabel = pin.layer === 'supply' ? 'Supply Chain' : pin.layer === 'foundry' ? 'Foundry' : 'Data Center';
  const color = LAYER_COLORS[pin.layer];
  const valueStr = typeof pin.value === 'number'
    ? pin.value >= 1000 ? `${(pin.value / 1000).toFixed(1)}K ${pin.unit || ''}` : `${pin.value} ${pin.unit || ''}`
    : `${pin.value} ${pin.unit || ''}`;
  const location = [pin.city, pin.country].filter(Boolean).join(', ');

  return `[fontFamily:Space Grotesk][fontSize:13px][bold][#E8E8EC]${pin.name}[/][/][/]\\n`
    + `[fontFamily:JetBrains Mono][fontSize:10px][#${color?.replace('#', '') || 'FFFFFF'}]${layerLabel}[/][/]\\n`
    + `[#6B6B80]${location}[/]\\n`
    + `[#9A9AAF]${pin.category || pin.provider || pin.company || ''}[/]\\n`
    + `[#E8E8EC][bold]${valueStr}[/][/]`;
}
