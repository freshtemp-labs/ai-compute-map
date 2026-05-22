import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin as MapPinIcon, ExternalLink, Crosshair, Database, GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { MapPin } from './useMapData';
import { supplyChainData, fabricationFacilities, dataCenters } from '@/data/mockData';

interface DetailPanelProps {
  pin: MapPin | null;
  onClose: () => void;
  color: string;
}

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Supply chain relationship map
interface Relation {
  type: 'upstream' | 'downstream' | 'peer';
  name: string;
  description: string;
  layer: string;
}

function getSupplyChainRelations(pin: MapPin): Relation[] {
  const relations: Relation[] = [];

  if (pin.layer === 'supply') {
    // Supply chain -> foundry (downstream)
    const category = pin.category?.toLowerCase() || '';
    if (category.includes('rare earth') || category.includes('silicon wafer') || category.includes('photoresist')) {
      relations.push({ type: 'downstream', name: 'TSMC Fabs (Hsinchu, Tainan)', description: 'Primary foundry consumer', layer: 'foundry' });
      relations.push({ type: 'downstream', name: 'Samsung Foundry (Hwaseong)', description: 'Major foundry customer', layer: 'foundry' });
    }
    if (category.includes('lithography') || category.includes('etch') || category.includes('deposition')) {
      relations.push({ type: 'downstream', name: 'All 300mm Fabs Globally', description: 'Equipment deployed across 100+ fabs', layer: 'foundry' });
    }
    if (category.includes('eda') || category.includes('ip') || category.includes('design') || category.includes('isa')) {
      relations.push({ type: 'downstream', name: 'Chip Design → TSMC/Samsung/Intel', description: 'Design IP used in fabrication', layer: 'foundry' });
    }
    if (category.includes('packaging') || category.includes('osat') || category.includes('substrate')) {
      relations.push({ type: 'upstream', name: 'Foundry Wafer Output', description: 'Packaging receives wafers from fabs', layer: 'foundry' });
      relations.push({ type: 'downstream', name: 'AI Data Centers', description: 'Packaged chips shipped to cloud providers', layer: 'datacenter' });
    }
    // Peers
    const peers = supplyChainData.filter(
      (s) => s.category === pin.category && s.id !== pin.id
    ).slice(0, 2);
    peers.forEach((p) => {
      relations.push({ type: 'peer', name: p.name, description: `Same category: ${p.category}`, layer: 'supply' });
    });
  }

  if (pin.layer === 'foundry') {
    // Foundry -> upstream suppliers
    relations.push({ type: 'upstream', name: 'ASML (EUV Lithography)', description: 'Critical equipment supplier', layer: 'supply' });
    relations.push({ type: 'upstream', name: 'Shin-Etsu / SUMCO (Wafers)', description: 'Silicon wafer supplier', layer: 'supply' });
    relations.push({ type: 'upstream', name: 'JSR / TOK (Photoresist)', description: 'Chemical materials supplier', layer: 'supply' });
    // Foundry -> downstream (data centers)
    relations.push({ type: 'downstream', name: 'AWS / Azure / Google Cloud', description: 'Major chip buyers', layer: 'datacenter' });
    relations.push({ type: 'downstream', name: 'NVIDIA / AMD / Apple', description: 'Fabless design houses', layer: 'datacenter' });
    // Peer fabs
    const peers = fabricationFacilities.filter(
      (f) => f.company === pin.company && f.id !== pin.id
    ).slice(0, 2);
    peers.forEach((p) => {
      relations.push({ type: 'peer', name: p.name, description: `${p.city}, ${p.country} · ${p.processNode || ''}`, layer: 'foundry' });
    });
  }

  if (pin.layer === 'datacenter') {
    // Data center -> upstream foundry
    relations.push({ type: 'upstream', name: 'TSMC / Samsung / Intel', description: 'GPU & chip suppliers', layer: 'foundry' });
    relations.push({ type: 'upstream', name: 'NVIDIA (GPU clusters)', description: 'AI accelerator supplier', layer: 'supply' });
    // Data center peers
    const dcProvider = pin.provider || '';
    const peerDCs = dataCenters.filter(
      (dc) => dc.provider === dcProvider && dc.name !== pin.name
    ).slice(0, 2);
    peerDCs.forEach((p) => {
      relations.push({ type: 'peer', name: p.name, description: `${p.city}, ${p.country} · ${p.powerCapacity}MW`, layer: 'datacenter' });
    });
  }

  return relations;
}

export default function DetailPanel({ pin, onClose, color }: DetailPanelProps) {
  const { t } = useTranslation('map');
  const navigate = useNavigate();

  const relations = useMemo(() => pin ? getSupplyChainRelations(pin) : [], [pin]);

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
      className="absolute top-0 right-0 bottom-0 w-[400px] sm:w-[420px] bg-[#111118] border-l border-[#1E1E28] z-30 flex flex-col overflow-hidden"
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
            <span className="text-[11px] font-mono uppercase text-[#6B6B80] tracking-wider">{t('map:facility.category')}</span>
            <p className="text-body-md text-[#E8E8EC] mt-1">{pin.category}</p>
          </div>
        )}

        {pin.status && (
          <div className="bg-[#181820] rounded-lg p-3 border border-[#1E1E28]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#6B6B80] tracking-wider">{t('map:facility.status')}</span>
              <StatusBadge status={pin.status} />
            </div>
          </div>
        )}

        {/* Provider / Company */}
        {(pin.provider || pin.company) && (
          <div className="bg-[#181820] rounded-lg p-3 border border-[#1E1E28]">
            <span className="text-[11px] font-mono uppercase text-[#6B6B80] tracking-wider">
              {pin.layer === 'datacenter' ? t('map:facility.provider') : t('map:facility.company')}
            </span>
            <p className="text-body-md text-[#E8E8EC] mt-1">{pin.provider || pin.company}</p>
          </div>
        )}

        {/* Supply Chain Relationships */}
        {relations.length > 0 && (
          <div className="bg-[#181820] rounded-lg p-3 border border-[#1E1E28]">
            <div className="flex items-center gap-1.5 mb-3">
              <GitBranch size={13} className="text-[#6B6B80]" />
              <span className="text-[11px] font-mono uppercase text-[#6B6B80] tracking-wider">
                {t('map:facility.supplyChain', 'Supply Chain Relations')}
              </span>
            </div>
            <div className="space-y-2.5">
              {relations.map((rel, i) => {
                const relColor = rel.type === 'upstream' ? '#FFB84D' : rel.type === 'downstream' ? '#00D4FF' : '#9A9AAF';
                const relLabel = rel.type === 'upstream' ? t('map:facility.upstream', 'UPSTREAM') : rel.type === 'downstream' ? t('map:facility.downstream', 'DOWNSTREAM') : t('map:facility.peer', 'PEER');
                return (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0"
                      style={{ color: relColor, backgroundColor: relColor + '15', border: `1px solid ${relColor}30` }}
                    >
                      {relLabel}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#E8E8EC] truncate">{rel.name}</p>
                      <p className="text-[10px] text-[#6B6B80]">{rel.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Source Info */}
        <div className="bg-[#181820] rounded-lg p-3 border border-[#1E1E28] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#6B6B80] tracking-wider">{t('map:facility.dataSource')}</span>
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
            <span>{t('map:facility.updatedLabel')} {pin.lastUpdated}</span>
          </div>
          <button
            className="flex items-center gap-1.5 mt-1 text-[12px] font-medium transition-colors duration-200 hover:opacity-80 cursor-pointer"
            style={{ color }}
            onClick={() => {
              if (pin.sourceName) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(pin.sourceName)}`, '_blank');
              }
            }}
          >
            <Crosshair size={12} />
            {t('map:facility.crossVerify')}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-[#1E1E28] bg-[#111118]">
        <div className="flex items-center justify-between">
          <span className="text-mono-sm text-[#6B6B80]">
            {pin.sourceTier ? `${pin.sourceTier} source${pin.sourceTier > 1 ? 's' : ''}` : t('map:facility.unknownSources')}
          </span>
          <button
            onClick={() => {
              const route = pin.layer === 'supply' ? '/supply-chain' : pin.layer === 'foundry' ? '/foundries' : '/datacenters';
              navigate(route);
            }}
            className="flex items-center gap-1 text-[11px] font-mono text-[#9A9AAF] hover:text-[#00D4FF] transition-colors duration-200 cursor-pointer"
          >
            {t('map:facility.viewFullPage')}
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
  const { t } = useTranslation('map');
  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    operational: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: t('map:status.operational') },
    construction: { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: t('map:status.construction') },
    planned: { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: t('map:status.planned') },
    expansion: { color: '#A855F7', bg: 'rgba(168,85,247,0.15)', label: t('map:status.expansion') },
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
