import { motion } from 'framer-motion';
import { X, MapPin as MapPinIcon, ExternalLink, Crosshair, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { MapPin } from './useMapData';

interface DetailPanelProps {
  pin: MapPin | null;
  onClose: () => void;
  color: string;
}

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function DetailPanel({ pin, onClose, color }: DetailPanelProps) {
  const { t } = useTranslation('map');
  function getTierBadge(tier: number) {
    const colors: Record<number, string> = {
      1: '#22C55E',
      2: '#3B82F6',
      3: '#F59E0B',
    };
    return { label: `${t('map:facility.tier')} ${tier}`, color: colors[tier] || '#6B6B80' };
  }
  if (!pin) return null;

  const tier = getTierBadge(pin.sourceTier);
  const layerLabel = pin.layer === 'supply' ? t('map:layerToggle.supplyChain') : pin.layer === 'foundry' ? t('map:layerToggle.foundry') : t('map:layerToggle.dataCenter');

  return (
    <motion.div
      key={pin.id}
      initial={{ x: 420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 420, opacity: 0 }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      className="absolute top-0 right-0 bottom-0 w-[380px] sm:w-[400px] bg-[#111118] border-l border-[#1E1E28] z-30 flex flex-col overflow-hidden"
      style={{ boxShadow: '-8px 0 32px rgba(0,0,0,0.4)' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-5 border-b border-[#1E1E28]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color }}>
              {layerLabel}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#6B6B80] hover:text-[#E8E8EC] hover:bg-[#181820] transition-colors duration-200 cursor-pointer"
            title={t('map:keyboard.close')}
          >
            <X size={18} />
          </button>
        </div>
        <h2 className="text-heading-md text-[#E8E8EC] font-display mt-3 pr-6">{pin.name}</h2>
        <div className="flex items-center gap-1.5 mt-1.5 text-body-sm text-[#9A9AAF]">
          <MapPinIcon size={13} className="text-[#6B6B80] flex-shrink-0" />
          <span>
            {[pin.city, pin.country].filter(Boolean).join(', ') || t('map:detailPanel.location')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label={pin.layer === 'datacenter' ? t('map:facility.powerCapacity') : pin.layer === 'foundry' ? t('map:facility.capacity') : t('map:facility.production')}
            value={typeof pin.value === 'number' ? pin.value.toLocaleString() : String(pin.value)}
            unit={pin.unit || ''}
            color={color}
          />
          {pin.pue && (
            <MetricCard label={t('map:facility.pue')} value={String(pin.pue)} color={color} />
          )}
          {pin.processNode && (
            <MetricCard label={t('map:facility.processNode')} value={pin.processNode} color={color} />
          )}
          {pin.powerCapacity && (
            <MetricCard label={t('map:facility.powerMW')} value={String(pin.powerCapacity)} color={color} />
          )}
          {pin.yearEstablished && (
            <MetricCard label={t('map:facility.yearEst')} value={String(pin.yearEstablished)} color={color} />
          )}
          {pin.yearOperational && (
            <MetricCard label={t('map:facility.yearOper')} value={String(pin.yearOperational)} color={color} />
          )}
          {pin.employees && (
            <MetricCard label={t('map:facility.employees')} value={pin.employees.toLocaleString()} color={color} />
          )}
          <MetricCard
            label={t('map:facility.confidence')}
            value={pin.confidence ? `${(pin.confidence * 100).toFixed(0)}%` : 'N/A'}
            color={color}
          />
        </div>

        {/* Category / Type */}
        {pin.category && (
          <div className="bg-[#181820] rounded-lg p-3 border border-[#1E1E28]">
            <span className="text-[11px] font-mono uppercase text-[#6B6B80] tracking-wider">Category</span>
            <p className="text-body-md text-[#E8E8EC] mt-1">{pin.category}</p>
          </div>
        )}

        {pin.status && (
          <div className="bg-[#181820] rounded-lg p-3 border border-[#1E1E28]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#6B6B80] tracking-wider">Status</span>
              <StatusBadge status={pin.status} />
            </div>
          </div>
        )}

        {/* Provider / Company */}
        {(pin.provider || pin.company) && (
          <div className="bg-[#181820] rounded-lg p-3 border border-[#1E1E28]">
            <span className="text-[11px] font-mono uppercase text-[#6B6B80] tracking-wider">
              {pin.layer === 'datacenter' ? 'Provider' : 'Company'}
            </span>
            <p className="text-body-md text-[#E8E8EC] mt-1">{pin.provider || pin.company}</p>
          </div>
        )}

        {/* Source Info */}
        <div className="bg-[#181820] rounded-lg p-3 border border-[#1E1E28] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#6B6B80] tracking-wider">Data Source</span>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
              style={{ color: tier.color, borderColor: tier.color }}
            >
              {tier.label}
            </span>
          </div>
          <p className="text-body-sm text-[#9A9AAF]">{pin.sourceName}</p>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6B6B80]">
            <Database size={11} />
            <span>Updated: {pin.lastUpdated}</span>
          </div>
          <button
            className="flex items-center gap-1.5 mt-1 text-[12px] font-medium transition-colors duration-200 hover:opacity-80 cursor-pointer"
            style={{ color }}
          >
            <Crosshair size={12} />
            Cross-verify sources
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-[#1E1E28] bg-[#111118]">
        <div className="flex items-center justify-between">
          <span className="text-mono-sm text-[#6B6B80]">
            {pin.sourceTier ? `${pin.sourceTier} source${pin.sourceTier > 1 ? 's' : ''}` : 'Unknown sources'}
          </span>
          <button className="flex items-center gap-1 text-[11px] font-mono text-[#9A9AAF] hover:text-[#00D4FF] transition-colors duration-200 cursor-pointer">
            View Full Page
            <ExternalLink size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, unit, color }: { label: string; value: string; unit?: string; color: string }) {
  return (
    <div className="bg-[#181820] rounded-lg p-3 border border-[#1E1E28]">
      <span className="text-[10px] font-mono uppercase text-[#6B6B80] tracking-wider block">{label}</span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-data-md font-mono" style={{ color }}>{value}</span>
        {unit && <span className="text-[10px] text-[#6B6B80] font-mono">{unit}</span>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    operational: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'Operational' },
    construction: { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: 'Construction' },
    planned: { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: 'Planned' },
    expansion: { color: '#A855F7', bg: 'rgba(168,85,247,0.15)', label: 'Expansion' },
  };
  const cfg = statusConfig[status] || { color: '#6B6B80', bg: 'rgba(107,107,128,0.15)', label: status };
  return (
    <span
      className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}
