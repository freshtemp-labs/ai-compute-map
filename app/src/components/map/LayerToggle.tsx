/**
 * @file LayerToggle.tsx
 * @description Toggle buttons for showing/hiding supply chain, foundry,
 * and data center layers on the map.
 *
 * @dependencies framer-motion, react-i18next, @/types, @/constants/layerColors
 */
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { LayerType } from '@/types';

interface LayerToggleProps {
  activeLayers: Record<LayerType, boolean>;
  onToggle: (layer: LayerType) => void;
}

const layerConfig: { key: LayerType; color: string }[] = [
  { key: 'supply', color: '#FFB84D' },
  { key: 'foundry', color: '#00D4FF' },
  { key: 'datacenter', color: '#A855F7' },
];

const layerLabels: Record<LayerType, string> = {
  supply: 'map:layerToggle.supplyChain',
  foundry: 'map:layerToggle.foundry',
  datacenter: 'map:layerToggle.dataCenter',
};

export default function LayerToggle({ activeLayers, onToggle }: LayerToggleProps) {
  const { t } = useTranslation('map');
  return (
    <div className="flex items-center gap-1 bg-[#111118] border border-[#1E1E28] rounded-full px-2 py-1.5 shadow-lg" role="group" aria-label="Map layer toggles">
      <span className="text-[11px] text-[#6B6B80] font-medium tracking-wide px-2 hidden sm:inline font-mono uppercase">
        Layers
      </span>
      {layerConfig.map(({ key, color }) => {
        const label = t(layerLabels[key]);
        const isActive = activeLayers[key];
        return (
          <motion.button
            key={key}
            onClick={() => onToggle(key)}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 cursor-pointer"
            aria-pressed={isActive}
            aria-label={`${label} layer toggle`}
            style={{
              backgroundColor: isActive ? `${color}26` : 'transparent',
              border: `1px solid ${isActive ? color : 'transparent'}`,
              color: isActive ? '#E8E8EC' : '#6B6B80',
            }}
            title={`${t('map:keyboard.layer')} ${label}`}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="hidden md:inline">{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
