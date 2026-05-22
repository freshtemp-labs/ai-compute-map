/**
 * @file Legend.tsx
 * @description Map legend component showing layer colors and counts with expand/collapse.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LegendProps {
  counts: { supply: number; foundry: number; datacenter: number };
}

const layers = [
  {
    key: 'supply' as const,
    labelKey: 'map:layerToggle.supplyChain',
    color: '#FFB84D',
    shape: 'diamond',
    descKey: 'map:legend.supplyDesc',
    defaultDesc: 'Rare earth, lithography, materials, design IP',
  },
  {
    key: 'foundry' as const,
    labelKey: 'map:layerToggle.foundry',
    color: '#00D4FF',
    shape: 'square',
    descKey: 'map:legend.foundryDesc',
    defaultDesc: 'TSMC, Samsung, Intel, SMIC, GlobalFoundries',
  },
  {
    key: 'datacenter' as const,
    labelKey: 'map:layerToggle.dataCenter',
    color: '#A855F7',
    shape: 'circle',
    descKey: 'map:legend.dcDesc',
    defaultDesc: 'Cloud DCs, colocation, hyperscale facilities',
  },
];

const statusItems = [
  { label: 'Operational', color: '#22C55E' },
  { label: 'Construction', color: '#F59E0B' },
  { label: 'Planned', color: '#3B82F6' },
];

const tierItems = [
  { label: 'Tier 1', desc: 'Official reports', color: '#22C55E' },
  { label: 'Tier 2', desc: 'Industry analysis', color: '#3B82F6' },
  { label: 'Tier 3', desc: 'Modeled estimates', color: '#F59E0B' },
];

export default function Legend({ counts }: LegendProps) {
  const { t } = useTranslation('map');
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#111118] border border-[#1E1E28] rounded-lg overflow-hidden shadow-lg" style={{ minWidth: collapsed ? 120 : 240 }} role="region" aria-label={t('map:legend.title')}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-[#6B6B80] hover:text-[#E8E8EC] transition-colors cursor-pointer"
        aria-expanded={!collapsed}
        aria-controls="legend-content"
      >
        <span>{t('map:legend.title')}</span>
        {collapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {layers.map(({ key, labelKey, color, shape, descKey, defaultDesc }) => (
                <div key={key}>
                  <div className="flex items-center gap-2.5">
                    <ShapeDot color={color} shape={shape} />
                    <span className="text-[11px] text-[#9A9AAF] font-mono flex-1">{t(labelKey)}</span>
                    <span className="text-[11px] text-[#6B6B80] font-mono">{counts[key]} {t('map:facility.dataPoints', 'pts')}</span>
                  </div>
                  <p className="text-[9px] text-[#4A4A60] font-mono ml-5 mt-0.5">
                    {t(descKey, defaultDesc)}
                  </p>
                </div>
              ))}

              {/* Expandable section */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-left text-[10px] font-mono text-[#6B6B80] hover:text-[#9A9AAF] transition-colors pt-1 cursor-pointer"
              >
                {expanded ? '▾ Hide details' : '▸ Status & Tiers'}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden space-y-2"
                  >
                    {/* Status colors */}
                    <div className="border-t border-[#1E1E28] pt-2">
                      <span className="text-[9px] font-mono text-[#4A4A60] uppercase tracking-wider">Status</span>
                      <div className="flex items-center gap-3 mt-1">
                        {statusItems.map((s) => (
                          <div key={s.label} className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-[9px] font-mono text-[#6B6B80]">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Source Tiers */}
                    <div>
                      <span className="text-[9px] font-mono text-[#4A4A60] uppercase tracking-wider">Source Tiers</span>
                      <div className="space-y-1 mt-1">
                        {tierItems.map((tier) => (
                          <div key={tier.label} className="flex items-center gap-2">
                            <span className="text-[9px] font-mono px-1 rounded" style={{ color: tier.color, border: `1px solid ${tier.color}40` }}>
                              {tier.label}
                            </span>
                            <span className="text-[9px] font-mono text-[#6B6B80]">{tier.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-t border-[#1E1E28] pt-2 mt-1">
                <p className="text-[10px] text-[#6B6B80] font-mono">
                  {t('map:legend.pinSize')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShapeDot({ color, shape }: { color: string; shape: string }) {
  if (shape === 'diamond') {
    return (
      <span
        className="w-2 h-2 flex-shrink-0 rotate-45"
        style={{ backgroundColor: color }}
      />
    );
  }
  if (shape === 'square') {
    return (
      <span
        className="w-2 h-2 rounded-[1px] flex-shrink-0"
        style={{ backgroundColor: color }}
      />
    );
  }
  return (
    <span
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}
