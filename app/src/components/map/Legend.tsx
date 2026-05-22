import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LegendProps {
  counts: { supply: number; foundry: number; datacenter: number };
}

const layers = [
  { key: 'supply' as const, labelKey: 'map:layerToggle.supplyChain', color: '#FFB84D', shape: 'diamond' },
  { key: 'foundry' as const, labelKey: 'map:layerToggle.foundry', color: '#00D4FF', shape: 'square' },
  { key: 'datacenter' as const, labelKey: 'map:layerToggle.dataCenter', color: '#A855F7', shape: 'circle' },
];

export default function Legend({ counts }: LegendProps) {
  const { t } = useTranslation('map');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-[#111118] border border-[#1E1E28] rounded-lg overflow-hidden shadow-lg">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-[#6B6B80] hover:text-[#E8E8EC] transition-colors cursor-pointer"
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
              {layers.map(({ key, labelKey, color, shape }) => (
                <div key={key} className="flex items-center gap-2.5">
                  <ShapeDot color={color} shape={shape} />
                  <span className="text-[11px] text-[#9A9AAF] font-mono">{t(labelKey)}</span>
                  <span className="text-[11px] text-[#6B6B80] font-mono ml-auto">{counts[key]} {t('map:facility.dataPoints', 'pts')}</span>
                </div>
              ))}
              <div className="border-t border-[#1E1E28] pt-2 mt-2">
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
