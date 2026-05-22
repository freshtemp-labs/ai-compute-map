import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  Home,
  Search,
  HelpCircle,
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

export default function MapPage() {
  const { t } = useTranslation('map');
  const { pins } = useMapData();
  const [activeLayers, setActiveLayers] = useState<Record<LayerType, boolean>>({
    supply: true,
    foundry: true,
    datacenter: true,
  });
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
  const chartRef = useRef<unknown>(null);

  // Pin counts per layer
  const counts = useMemo(() => ({
    supply: pins.filter((p) => p.layer === 'supply').length,
    foundry: pins.filter((p) => p.layer === 'foundry').length,
    datacenter: pins.filter((p) => p.layer === 'datacenter').length,
  }), [pins]);

  // Toggle layer
  const toggleLayer = useCallback((layer: LayerType) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  // Handle pin click
  const handlePinClick = useCallback((pin: MapPin) => {
    setSelectedPin(pin);
  }, []);

  // Close panel
  const closePanel = useCallback(() => {
    setSelectedPin(null);
  }, []);

  // Handle search result selection - fly to location
  const handleSearchSelect = useCallback((pin: MapPin) => {
    setSelectedPin(pin);
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
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in search
      if (searchOpen && e.key !== 'Escape') return;

      // Don't trigger shortcuts when typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      if (e.key === '?') {
        e.preventDefault();
        setKeyboardHelpOpen((prev) => !prev);
        return;
      }

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

      if (e.key === '1') {
        toggleLayer('supply');
      } else if (e.key === '2') {
        toggleLayer('foundry');
      } else if (e.key === '3') {
        toggleLayer('datacenter');
      }

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
      {/* Map Canvas */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: '#0A0A0F' }}
      >
        <AmChartsMap
          pins={pins}
          activeLayers={activeLayers}
          onPinClick={handlePinClick}
          selectedPin={selectedPin}
          onMapReady={(chart) => {
            chartRef.current = chart as unknown as Record<string, unknown>;
          }}
        />
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
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-1">
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
      <div className="absolute top-4 right-6 z-20">
        <button
          onClick={() => setKeyboardHelpOpen(true)}
          className="w-8 h-8 flex items-center justify-center bg-[#111118] border border-[#1E1E28] rounded-lg text-[#6B6B80] hover:text-[#E8E8EC] hover:border-[#2A2A3A] transition-all duration-200 shadow-lg cursor-pointer"
          title="Keyboard shortcuts (?)">
          <HelpCircle size={15} />
        </button>
      </div>

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

function ZoomButton({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center bg-[#111118] border border-[#1E1E28] rounded-lg text-[#9A9AAF] hover:text-[#E8E8EC] hover:bg-[#181820] hover:border-[#2A2A3A] transition-all duration-200 shadow-md cursor-pointer"
      title={title}
    >
      {children}
    </button>
  );
}
