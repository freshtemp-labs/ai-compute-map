import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin as MapPinIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { MapPin } from './useMapData';

interface SearchOverlayProps {
  pins: MapPin[];
  onSelect: (pin: MapPin) => void;
  isOpen: boolean;
  onClose: () => void;
}

const layerColors: Record<string, string> = {
  supply: '#FFB84D',
  foundry: '#00D4FF',
  datacenter: '#A855F7',
};

export default function SearchOverlay({ pins, onSelect, isOpen, onClose }: SearchOverlayProps) {
  const { t } = useTranslation('map');
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return pins.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.city?.toLowerCase() || '').includes(q) ||
        (p.country?.toLowerCase() || '').includes(q) ||
        (p.category?.toLowerCase() || '').includes(q) ||
        (p.company?.toLowerCase() || '').includes(q) ||
        (p.provider?.toLowerCase() || '').includes(q)
    ).slice(0, 12);
  }, [query, pins]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      onSelect(results[activeIndex]);
      setQuery('');
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (pin: MapPin) => {
    onSelect(pin);
    setQuery('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[600px] px-4 z-[61]"
          >
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-lg shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 h-12 border-b border-[#1E1E28]">
                <Search size={18} className="text-[#6B6B80] flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('map:search.placeholder')}
                  className="flex-1 bg-transparent text-body-md text-[#E8E8EC] placeholder-[#6B6B80] outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                    className="p-1 rounded text-[#6B6B80] hover:text-[#E8E8EC] transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
                <kbd className="hidden sm:inline-block text-[10px] font-mono text-[#6B6B80] bg-[#181820] px-1.5 py-0.5 rounded border border-[#1E1E28]">
                  ESC
                </kbd>
              </div>
              {/* Results */}
              {query.trim() && (
                <div ref={resultsRef} className="max-h-[360px] overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="px-4 py-8 text-center text-body-sm text-[#6B6B80]">
                      {t('map:facility.noResults', 'No results found')} for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    results.map((pin, index) => {
                      const isActive = index === activeIndex;
                      const color = layerColors[pin.layer] || '#6B6B80';
                      return (
                        <button
                          key={pin.id}
                          onClick={() => handleSelect(pin)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-100 cursor-pointer ${
                            isActive ? 'bg-[#181820]' : 'hover:bg-[#181820]/50'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-body-md text-[#E8E8EC] truncate">{pin.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <MapPinIcon size={11} className="text-[#6B6B80] flex-shrink-0" />
                              <span className="text-[11px] font-mono text-[#6B6B80] truncate">
                                {[pin.city, pin.country].filter(Boolean).join(', ') || 'Unknown'}
                              </span>
                            </div>
                          </div>
                          <span
                            className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ color, backgroundColor: `${color}26` }}
                          >
                            {pin.layer}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
              {/* Hint */}
              {query.trim() === '' && (
                <div className="px-4 py-6 text-center text-[12px] text-[#6B6B80] font-mono">
                  Type to search across {pins.length} data points
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
