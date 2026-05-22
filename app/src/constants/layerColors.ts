/**
 * @file layerColors.ts
 * @description Color constants for each map layer type.
 * Used consistently across map pins, charts, legends, and UI elements.
 */
import type { LayerType } from '@/types';

/** Hex color mapping for each visualization layer */
export const LAYER_COLORS: Record<LayerType, string> = {
  supply: '#FFB84D',
  foundry: '#00D4FF',
  datacenter: '#A855F7',
};
