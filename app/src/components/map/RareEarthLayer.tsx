/**
 * @file RareEarthLayer.tsx
 * @description Map overlay component that visualizes rare earth mining and processing
 * facilities on an AmCharts 5 map. Shows facility markers as diamonds (#FFB84D)
 * with flow lines connecting mining → processing → refining stages.
 *
 * @dependencies @amcharts/amcharts5, @amcharts/amcharts5-geodata, react
 */
import { useEffect, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

/** Rare earth facility data structure from rare-earth.json */
interface RareEarthFacility {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  city?: string;
  reservesMt?: number;
  globalShare?: number;
  productionKt?: number;
  quota2024Kt?: number;
  lightReKt?: number;
  heavyReKt?: number;
  smeltingShare?: number;
  layer: string;
  category: string;
  exportControl?: boolean;
  sourceTier: number;
  lastUpdated: string;
  sourceRef: string;
}

/** Color constants */
const SUPPLY_CHAIN_COLOR = '#FFB84D';
const FLOW_LINE_COLOR = '#FFB84D';
const PROCESSING_COLOR = '#00D4FF';

/**
 * Predefined processing/refining stage coordinates.
 * These represent downstream processing facilities connected to mining sites.
 */
const PROCESSING_FACILITIES: { id: string; name: string; lat: number; lng: number; stage: 'processing' | 'refining' }[] = [
  { id: 'proc-cn', name: 'China Processing Hub', lat: 31.2, lng: 121.5, stage: 'processing' },
  { id: 'proc-us', name: 'MP Materials Processing', lat: 35.0, lng: -117.0, stage: 'processing' },
  { id: 'proc-au', name: 'Lynas Processing', lat: -31.9, lng: 115.9, stage: 'processing' },
  { id: 'ref-cn', name: 'China Refining', lat: 39.9, lng: 116.4, stage: 'refining' },
  { id: 'ref-est', name: 'Estonia Refining (Neo)', lat: 59.4, lng: 24.7, stage: 'refining' },
];

/** Mapping from mining facility to processing stage */
const MINING_TO_PROCESSING: Record<string, string> = {
  re1: 'proc-cn',  // China mining → China processing
  re2: 'proc-cn',  // Brazil → China processing
  re4: 'proc-au',  // Australia → Lynas processing
  re5: 'proc-us',  // USA → MP Materials
};

/** Mapping from processing to refining */
const PROCESSING_TO_REFINING: Record<string, string> = {
  'proc-cn': 'ref-cn',
  'proc-us': 'ref-cn',
  'proc-au': 'ref-est',
};

/**
 * RareEarthLayer component props
 */
interface RareEarthLayerProps {
  /** Height of the map container */
  height?: string;
}

/**
 * Rare Earth supply chain map layer
 * Displays rare earth mining facilities and flow lines to processing/refining stages.
 * @param height - CSS height for the map container
 */
export default function RareEarthLayer({ height = '500px' }: RareEarthLayerProps) {
  const chartRef = useRef<am5map.MapChart | null>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const [facilities, setFacilities] = useState<RareEarthFacility[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch rare earth data
  useEffect(() => {
    fetch('/data/rare-earth.json')
      .then((res) => res.json())
      .then((data: RareEarthFacility[]) => {
        setFacilities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Initialize AmCharts map
  useEffect(() => {
    if (loading || facilities.length === 0) return;

    const root = am5.Root.new('rare-earth-map');
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
        maxZoomLevel: 12,
        minZoomLevel: 1,
        zoomLevel: 1.5,
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

    // Zoom control
    const zoomControl = am5map.ZoomControl.new(root, {});
    chart.set('zoomControl', zoomControl);

    // Country polygons
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
      })
    );
    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x181820),
      fillOpacity: 0.4,
      stroke: am5.color(0x2A2A3A),
      strokeOpacity: 0.3,
      strokeWidth: 0.5,
    });

    // ── Mining facility point series ──
    const miningSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: 'lat',
        longitudeField: 'lng',
      })
    );

    miningSeries.bullets.push((_root, _series, dataItem) => {
      const data = dataItem.dataContext as unknown as RareEarthFacility;
      if (!data) return null as unknown as am5.Bullet;

      const container = am5.Container.new(_root, {
        centerX: am5.percent(50),
        centerY: am5.percent(50),
      });

      // Pulse ring
      const pulseRing = am5.Circle.new(_root, {
        radius: 8,
        fill: am5.color(SUPPLY_CHAIN_COLOR),
        fillOpacity: 0,
        stroke: am5.color(SUPPLY_CHAIN_COLOR),
        strokeWidth: 1,
        strokeOpacity: 0.3,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
      });
      pulseRing.animate({
        key: 'radius',
        from: 5,
        to: 18,
        duration: 2000,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.sine),
      });
      pulseRing.animate({
        key: 'strokeOpacity',
        from: 0.4,
        to: 0,
        duration: 2000,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.sine),
      });
      container.children.push(pulseRing);

      // Diamond marker (supply chain style)
      const size = Math.max(5, Math.min(14, (data.reservesMt || 1) * 0.4));
      const diamond = am5.RoundedRectangle.new(_root, {
        width: size * 1.6,
        height: size * 1.6,
        fill: am5.color(SUPPLY_CHAIN_COLOR),
        fillOpacity: 0.9,
        stroke: am5.color(0xFFFFFF),
        strokeWidth: 1,
        strokeOpacity: 0.3,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        rotation: 45,
        tooltipText: `[bold]{name}[/]\nCountry: {country}\nReserves: {reservesMt} Mt\nGlobal Share: {globalShare}%\nProduction: {productionKt} kt\nSource: {sourceRef}`,
      });
      diamond.states.create('hover', {
        scale: 1.5,
        strokeWidth: 2,
        strokeOpacity: 0.8,
      });
      container.children.push(diamond);

      return am5.Bullet.new(_root, { sprite: container });
    });

    miningSeries.data.setAll(
      facilities.map((f) => ({
        ...f,
        geometry: { type: 'Point' as const, coordinates: [f.lng, f.lat] },
      }))
    );

    // ── Processing/Refining facility point series ──
    const processingSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: 'lat',
        longitudeField: 'lng',
      })
    );

    processingSeries.bullets.push((_root, _series, dataItem) => {
      const data = dataItem.dataContext as unknown as typeof PROCESSING_FACILITIES[0];
      if (!data) return null as unknown as am5.Bullet;

      const color = data.stage === 'processing' ? SUPPLY_CHAIN_COLOR : PROCESSING_COLOR;
      const container = am5.Container.new(_root, {
        centerX: am5.percent(50),
        centerY: am5.percent(50),
      });

      // Rounded rect for processing
      const shape = am5.RoundedRectangle.new(_root, {
        width: 10,
        height: 10,
        fill: am5.color(color),
        fillOpacity: 0.85,
        stroke: am5.color(0xFFFFFF),
        strokeWidth: 1,
        strokeOpacity: 0.3,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        cornerRadiusTL: 2,
        cornerRadiusTR: 2,
        cornerRadiusBL: 2,
        cornerRadiusBR: 2,
        tooltipText: `[bold]{name}[/]\nStage: {stage}`,
      });
      shape.states.create('hover', {
        scale: 1.4,
      });
      container.children.push(shape);

      return am5.Bullet.new(_root, { sprite: container });
    });

    processingSeries.data.setAll(
      PROCESSING_FACILITIES.map((f) => ({
        ...f,
        geometry: { type: 'Point' as const, coordinates: [f.lng, f.lat] },
      }))
    );

    // ── Flow lines series (mining → processing) ──
    const lineSeries = chart.series.push(
      am5map.MapLineSeries.new(root, {})
    );
    lineSeries.mapLines.template.setAll({
      stroke: am5.color(FLOW_LINE_COLOR),
      strokeWidth: 1.5,
      strokeOpacity: 0.4,
      strokeDasharray: [4, 4],
    });

    // Create flow lines from mining → processing
    const flowLines: { geometry: { type: string; coordinates: [number, number][] } }[] = [];
    for (const facility of facilities) {
      const procId = MINING_TO_PROCESSING[facility.id];
      if (!procId) continue;
      const procFacility = PROCESSING_FACILITIES.find((p) => p.id === procId);
      if (!procFacility) continue;
      flowLines.push({
        geometry: {
          type: 'LineString',
          coordinates: [
            [facility.lng, facility.lat],
            [procFacility.lng, procFacility.lat],
          ],
        },
      });
    }

    // Create flow lines from processing → refining
    for (const [procId, refId] of Object.entries(PROCESSING_TO_REFINING)) {
      const procFacility = PROCESSING_FACILITIES.find((p) => p.id === procId);
      const refFacility = PROCESSING_FACILITIES.find((p) => p.id === refId);
      if (!procFacility || !refFacility) continue;
      flowLines.push({
        geometry: {
          type: 'LineString',
          coordinates: [
            [procFacility.lng, procFacility.lat],
            [refFacility.lng, refFacility.lat],
          ],
        },
      });
    }

    lineSeries.data.setAll(flowLines);

    // Tooltip styling
    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 14,
      paddingRight: 14,
    });
    tooltip.get('background')!.setAll({
      fill: am5.color(0x111118),
      fillOpacity: 1,
      stroke: am5.color(0x2A2A3A),
      strokeWidth: 1,
    });
    miningSeries.set('tooltip', tooltip);
    processingSeries.set('tooltip', tooltip);

    return () => {
      root.dispose();
    };
  }, [facilities, loading]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle"
        style={{ height }}
      >
        <span className="text-text-muted text-sm">Loading rare earth data...</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border-subtle">
      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 bg-[#111118] border-b border-[#1E1E28]">
        <span className="text-[11px] text-[#6B6B80] font-mono uppercase tracking-wide">Rare Earth Layer</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rotate-45" style={{ backgroundColor: SUPPLY_CHAIN_COLOR }} />
          <span className="text-[11px] text-text-secondary">Mining</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: SUPPLY_CHAIN_COLOR }} />
          <span className="text-[11px] text-text-secondary">Processing</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: PROCESSING_COLOR }} />
          <span className="text-[11px] text-text-secondary">Refining</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0 border-t border-dashed" style={{ borderColor: FLOW_LINE_COLOR, opacity: 0.4 }} />
          <span className="text-[11px] text-text-secondary">Flow</span>
        </div>
      </div>
      <div id="rare-earth-map" style={{ width: '100%', height }} />
    </div>
  );
}
