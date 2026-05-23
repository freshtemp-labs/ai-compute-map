/**
 * @file MapPage.tsx
 * @description Interactive map page using AmCharts 5 for rendering supply chain,
 * foundry, and data center pins on a world map. Features layer toggles,
 * search overlay, keyboard shortcuts, and detail panel for selected pins.
 *
 * @dependencies @amcharts/amcharts5, @/components/map/*, react-i18next
 */
import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  Home,
  Search,
  HelpCircle,
  Globe,
  Map,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LayerType } from '@/types';
import { LAYER_COLORS } from '@/constants/layerColors';
import { useMapData } from '@/components/map/useMapData';
import type { MapPin } from '@/components/map/useMapData';
import LayerToggle from '@/components/map/LayerToggle';
import DetailPanel from '@/components/map/DetailPanel';
import SearchOverlay from '@/components/map/SearchOverlay';
import Legend from '@/components/map/Legend';
import KeyboardHelp from '@/components/map/KeyboardHelp';
import AmChartsMap from '@/components/map/AmChartsMap';
import HeatmapLayer from '@/components/map/HeatmapLayer';
import ScreenReaderDataTable from '@/components/map/ScreenReaderDataTable';
import ExportPngButton from '@/components/ExportPngButton';
import { MapPageSkeleton } from '@/components/PageSkeleton';

const GlobeView = lazy(() => import('@/components/map/GlobeView'));

type ViewMode = 'markers' | 'heatmap';

/**
 * 交互地图页面组件
 * 使用AmCharts 5渲染全球供应链、芯片厂和数据中心标记点
 * 支持图层切换、搜索、键盘快捷键和3D地球视图
 */
export default function MapPage() {
  const { t } = useTranslation('map');
  const { pins } = useMapData();
  const [mapLoading, setMapLoading] = useState(true);
  const [activeLayers, setActiveLayers] = useState<Record<LayerType, boolean>>({
    supply: true,
    foundry: true,
    datacenter: true,
  });
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [highlightedPinId, setHighlightedPinId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
  const [is3DView, setIs3DView] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('markers');
  const chartRef = useRef<unknown>(null);

  // Pin counts per layer
  const counts = useMemo(() => ({
    supply: pins.filter((p) => p.layer === 'supply').length,
    foundry: pins.filter((p) => p.layer === 'foundry').length,
    datacenter: pins.filter((p) => p.layer === 'datacenter').length,
  }), [pins]);

  // 切换图层可见性
  const toggleLayer = useCallback((layer: LayerType) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  // 处理标记点点击：选中并清除搜索高亮
  const handlePinClick = useCallback((pin: MapPin) => {
    setSelectedPin(pin);
    setHighlightedPinId(null); // Clear search highlight when clicking
  }, []);

  // Close panel
  const closePanel = useCallback(() => {
    setSelectedPin(null);
  }, []);

  // 搜索结果选择：飞行到位置并高亮6秒
  const handleSearchSelect = useCallback((pin: MapPin) => {
    setSelectedPin(pin);
    setHighlightedPinId(pin.id); // Highlight with blink animation
    // Fly to location
    if (chartRef.current) {
      const chart = chartRef.current as { zoomToGeoPoint?: (point: { latitude: number; longitude: number }, level: number) => void };
      if (chart.zoomToGeoPoint) {
        chart.zoomToGeoPoint(
          { latitude: pin.lat, longitude: pin.lng },
          8
        );
      }
    }
    // Clear highlight after 6 seconds
    setTimeout(() => {
      setHighlightedPinId((current) => current === pin.id ? null : current);
    }, 6000);
  }, []);

  // 键盘快捷键处理器
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 搜索框打开时不触发快捷键(除Escape外)
      if (searchOpen && e.key !== 'Escape') return;

      // 输入框/文本域内不触发快捷键
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      // ? 键切换键盘帮助面板
      if (e.key === '?') {
        e.preventDefault();
        setKeyboardHelpOpen((prev) => !prev);
        return;
      }

      // Escape关闭面板/搜索
      if (e.key === 'Escape') {
        setKeyboardHelpOpen(false);
        if (searchOpen) {
          setSearchOpen(false);
          return;
        }
        if (selectedPin) {
          setSelectedPin(null);
          return;
        }
      }

      // 数字键1/2/3切换图层
      if (e.key === '1') {
        toggleLayer('supply');
      } else if (e.key === '2') {
        toggleLayer('foundry');
      } else if (e.key === '3') {
        toggleLayer('datacenter');
      }

      // +/-缩放, 0重置视图
      if (e.key === '+' || e.key === '=') {
        const chart = chartRef.current as Record<string, unknown> | null;
        if (chart?.zoomIn) (chart.zoomIn as () => void)();
      }
      if (e.key === '-') {
        const chart = chartRef.current as Record<string, unknown> | null;
        if (chart?.zoomOut) (chart.zoomOut as () => void)();
      }
      if (e.key === '0') {
        const chart = chartRef.current as Record<string, unknown> | null;
        if (chart?.goHome) (chart.goHome as () => void)();
      }

      // Cmd+K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLayer, searchOpen, selectedPin]);

  const selectedPinColor = selectedPin ? LAYER_COLORS[selectedPin.layer] : '#00D4FF';

  return (
    <div className="relative w-full" style={{ height: 'calc(100dvh - 3.5rem)', minHeight: 'calc(100dvh - 3.5rem)' }}>
      {/* Screen-reader-only data table */}
      <ScreenReaderDataTable pins={pins} />

      {/* Map Canvas */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: '#0A0A0F' }}
        role="application"
        aria-label={t('map:a11y.mapRegion', 'Interactive world map showing AI compute infrastructure')}
      >
        {is3DView ? (
          <Suspense fallback={<MapPageSkeleton />}>
            <GlobeView
              pins={pins}
              activeLayers={activeLayers}
              onPinClick={handlePinClick}
            />
          </Suspense>
        ) : viewMode === 'heatmap' ? (
          <HeatmapLayer
            pins={pins}
            activeLayers={activeLayers}
          />
        ) : (
          <AmChartsMap
            pins={pins}
            activeLayers={activeLayers}
            onPinClick={handlePinClick}
            selectedPin={selectedPin}
            highlightedPinId={highlightedPinId}
            onMapReady={(chart) => {
              chartRef.current = chart as unknown as Record<string, unknown>;
              setMapLoading(false);
            }}
          />
        )}
        {mapLoading && !is3DView && <MapPageSkeleton />}
      </div>

      {/* Search Bar - Floating at top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#111118] border border-[#1E1E28] rounded-full text-[#6B6B80] hover:text-[#E8E8EC] hover:border-[#2A2A3A] transition-all duration-200 shadow-lg cursor-pointer min-w-[280px]"
        >
          <Search size={15} />
          <span className="text-body-sm flex-1 text-left">{t('search.placeholder')}</span>
          <kbd className="text-[10px] font-mono text-[#6B6B80] bg-[#181820] px-1.5 py-0.5 rounded border border-[#1E1E28] hidden sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Layer Toggle - Bottom left, floating */}
      <div className="absolute bottom-6 left-6 z-20">
        <LayerToggle activeLayers={activeLayers} onToggle={toggleLayer} />
      </div>

      {/* Legend - Bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <Legend counts={counts} />
      </div>

      {/* Zoom Controls - Bottom right */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-1" role="toolbar" aria-label={t('map:a11y.mapControls', 'Map controls')}>
        {/* 3D View Toggle */}
        <ZoomButton
          onClick={() => { setIs3DView(!is3DView); if (!is3DView) setViewMode('markers'); }}
          title={is3DView ? t('map:a11y.switchTo2D', 'Switch to 2D map') : t('map:a11y.switchTo3D', 'Switch to 3D globe')}
          aria-pressed={is3DView}
          aria-label={is3DView ? t('map:a11y.switchTo2D', 'Switch to 2D map') : t('map:a11y.switchTo3D', 'Switch to 3D globe')}
        >
          {is3DView ? <Map size={16} /> : <Globe size={16} />}
        </ZoomButton>
        {/* Heatmap Toggle */}
        <ZoomButton
          onClick={() => { setViewMode(viewMode === 'heatmap' ? 'markers' : 'heatmap'); setIs3DView(false); }}
          title={viewMode === 'heatmap' ? t('map:a11y.switchToMarkers', 'Switch to markers view') : t('map:a11y.switchToHeatmap', 'Switch to heatmap view')}
          aria-pressed={viewMode === 'heatmap'}
          aria-label={viewMode === 'heatmap' ? t('map:a11y.switchToMarkers', 'Switch to markers view') : t('map:a11y.switchToHeatmap', 'Switch to heatmap view')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="6" height="6" rx="1" />
            <rect x="9" y="2" width="6" height="6" rx="1" opacity="0.6" />
            <rect x="16" y="2" width="6" height="6" rx="1" opacity="0.3" />
            <rect x="2" y="9" width="6" height="6" rx="1" opacity="0.4" />
            <rect x="9" y="9" width="6" height="6" rx="1" opacity="0.8" />
            <rect x="16" y="9" width="6" height="6" rx="1" opacity="0.5" />
            <rect x="2" y="16" width="6" height="6" rx="1" opacity="0.2" />
            <rect x="9" y="16" width="6" height="6" rx="1" opacity="0.6" />
            <rect x="16" y="16" width="6" height="6" rx="1" />
          </svg>
        </ZoomButton>
        <div className="h-1" />
        <ZoomButton onClick={() => {
          const chart = chartRef.current as Record<string, unknown> | null;
          if (chart?.zoomIn) (chart.zoomIn as () => void)();
        }} title="Zoom in">
          <Plus size={16} />
        </ZoomButton>
        <ZoomButton onClick={() => {
          const chart = chartRef.current as Record<string, unknown> | null;
          if (chart?.zoomOut) (chart.zoomOut as () => void)();
        }} title="Zoom out">
          <Minus size={16} />
        </ZoomButton>
        <ZoomButton onClick={() => {
          const chart = chartRef.current as Record<string, unknown> | null;
          if (chart?.goHome) (chart.goHome as () => void)();
        }} title="Reset view">
          <Home size={14} />
        </ZoomButton>
        <div className="mt-2">
          <ZoomButton onClick={() => setSearchOpen(true)} title="Search (⌘K)">
            <Search size={14} />
          </ZoomButton>
          <ZoomButton onClick={() => setKeyboardHelpOpen(true)} title="Keyboard shortcuts (?)">
            <HelpCircle size={14} />
          </ZoomButton>
        </div>
      </div>

      {/* Help Button - Top right */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-1.5">
        <ExportPngButton />
        <button
          onClick={() => setKeyboardHelpOpen(true)}
          className="w-9 h-9 flex items-center justify-center bg-[#111118] border border-[#1E1E28] rounded-lg text-[#6B6B80] hover:text-[#E8E8EC] hover:border-[#2A2A3A] transition-all duration-200 shadow-lg cursor-pointer"
          title="Keyboard shortcuts (?)"
          aria-label={t('map:a11y.keyboardHelp', 'Keyboard shortcuts')}>
          <HelpCircle size={15} />
        </button>
      </div>

      {/* Highlight Indicator - shows when a pin is highlighted from search */}
      {highlightedPinId && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111118]/90 border border-[#00D4FF]/40 rounded-full backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF]" />
            </span>
            <span className="text-[11px] font-mono text-[#00D4FF]">
              {t('map:search.highlighted', 'Location highlighted on map')}
            </span>
            <button
              onClick={() => setHighlightedPinId(null)}
              className="text-[#6B6B80] hover:text-[#E8E8EC] transition-colors cursor-pointer ml-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Side Detail Panel */}
      <AnimatePresence>
        {selectedPin && (
          <DetailPanel
            pin={selectedPin}
            onClose={closePanel}
            color={selectedPinColor}
          />
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay
        pins={pins}
        onSelect={handleSearchSelect}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Keyboard Help Overlay */}
      <KeyboardHelp isOpen={keyboardHelpOpen} onClose={() => setKeyboardHelpOpen(false)} />
    </div>
  );
}

function ZoomButton({ children, onClick, title, ...rest }: { children: React.ReactNode; onClick: () => void; title: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center bg-[#111118] border border-[#1E1E28] rounded-lg text-[#9A9AAF] hover:text-[#E8E8EC] hover:bg-[#181820] hover:border-[#2A2A3A] transition-all duration-200 shadow-md cursor-pointer"
      title={title}
      {...rest}
    >
      {children}
    </button>
  );
}
