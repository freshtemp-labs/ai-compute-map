/**
 * @file ExportPngButton.tsx
 * @description PNG 导出按钮组件，支持下拉菜单选择导出范围。
 *   支持全页导出、仅地图导出、仅图表导出三种模式。
 * @dependencies html2canvas (via @/utils/exportPng), lucide-react, react-i18next
 */
import { useState, useCallback, useRef } from 'react';
import { Download, Camera, Map, BarChart3, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { exportToPng, type ExportScope } from '@/utils/exportPng';

/** ExportPngButton 组件 Props */
interface ExportPngButtonProps {
  /** 地图导出时可额外指定的地图元素 */
  mapElement?: HTMLElement | null;
}

/**
 * PNG 导出按钮组件
 * 支持三种导出范围：整页 fullpage / 仅地图 map-only / 仅图表 charts-only
 * @param mapElement - 地图导出模式下的目标 DOM 元素
 * @returns 带下拉菜单的 PNG 导出按钮
 */
export default function ExportPngButton({ mapElement }: ExportPngButtonProps) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(
    async (scope: ExportScope) => {
      setOpen(false);
      setExporting(true);
      setProgress(0);

      try {
        let element: HTMLElement | null = null;

        if (scope === 'map-only' && mapElement) {
          element = mapElement;
        } else if (scope === 'map-only') {
          // Try to find the map container
          element =
            document.getElementById('map-container')?.parentElement ||
            document.querySelector('.map-canvas') ||
            document.querySelector('[data-export="map"]');
        } else if (scope === 'charts-only') {
          element = document.querySelector('[data-export="charts"]') as HTMLElement;
        } else {
          // fullpage
          element = document.getElementById('root') || document.body;
        }

        if (!element) {
          console.warn(`Export target not found for scope: ${scope}`);
          return;
        }

        await exportToPng({
          element,
          filename: `ai-compute-map-${scope}-${new Date().toISOString().slice(0, 10)}`,
          scale: 2,
          onProgress: setProgress,
        });
      } catch (err) {
        console.error('Export failed:', err);
      } finally {
        setExporting(false);
        setProgress(0);
      }
    },
    [mapElement]
  );

  // Close dropdown on outside click
  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setOpen(false);
    }
  }, []);

  const scopes: { key: ExportScope; icon: React.ReactNode; labelKey: string; defaultLabel: string }[] = [
    { key: 'fullpage', icon: <Camera size={14} />, labelKey: 'export.fullpage', defaultLabel: 'Full Page' },
    { key: 'map-only', icon: <Map size={14} />, labelKey: 'export.mapOnly', defaultLabel: 'Map Only' },
    { key: 'charts-only', icon: <BarChart3 size={14} />, labelKey: 'export.chartsOnly', defaultLabel: 'Charts Only' },
  ];

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={handleBlur}
    >
      <button
        onClick={() => setOpen(!open)}
        disabled={exporting}
        className="w-9 h-9 flex items-center justify-center bg-[#111118] border border-[#1E1E28] rounded-lg text-[#9A9AAF] hover:text-[#E8E8EC] hover:bg-[#181820] hover:border-[#2A2A3A] transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50"
        title={t('export.title', 'Export as PNG')}
        aria-label={t('export.title', 'Export as PNG')}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {exporting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Download size={14} />
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('export.title', 'Export options')}
          className="absolute right-0 mt-1 w-44 bg-[#111118] border border-[#1E1E28] rounded-lg shadow-xl overflow-hidden z-50"
        >
          {scopes.map(({ key, icon, labelKey, defaultLabel }) => (
            <button
              key={key}
              role="menuitem"
              onClick={() => handleExport(key)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] font-mono text-[#9A9AAF] hover:text-[#E8E8EC] hover:bg-[#181820] transition-colors duration-150 cursor-pointer"
            >
              {icon}
              <span>{t(labelKey, defaultLabel)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Progress indicator */}
      {exporting && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#1E1E28] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00D4FF] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
