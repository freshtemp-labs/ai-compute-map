import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.5, ease: easeOutExpo },
  }),
};

interface EnergyRow {
  country: string;
  energyIndex: number;
  laborCostIndex: number;
  gridStability: 'High' | 'Medium' | 'Low';
  policyScore: number;
  energyCost: string;
  highlights: string;
}

const energyData: EnergyRow[] = [
  { country: 'Iceland', energyIndex: 98, laborCostIndex: 72, gridStability: 'High', policyScore: 85, energyCost: '$0.04/kWh', highlights: 'Geothermal surplus' },
  { country: 'Norway', energyIndex: 95, laborCostIndex: 88, gridStability: 'High', policyScore: 80, energyCost: '$0.05/kWh', highlights: 'Hydroelectric dominated' },
  { country: 'USA (Texas)', energyIndex: 88, laborCostIndex: 65, gridStability: 'Medium', policyScore: 78, energyCost: '$0.06/kWh', highlights: 'Solar/wind expansion' },
  { country: 'USA (Virginia)', energyIndex: 82, laborCostIndex: 70, gridStability: 'High', policyScore: 82, energyCost: '$0.08/kWh', highlights: 'Data center hub' },
  { country: 'Taiwan', energyIndex: 68, laborCostIndex: 58, gridStability: 'High', policyScore: 90, energyCost: '$0.09/kWh', highlights: 'Semiconductor ecosystem' },
  { country: 'South Korea', energyIndex: 72, laborCostIndex: 62, gridStability: 'High', policyScore: 88, energyCost: '$0.10/kWh', highlights: 'Government subsidies' },
  { country: 'Singapore', energyIndex: 45, laborCostIndex: 92, gridStability: 'High', policyScore: 85, energyCost: '$0.15/kWh', highlights: 'Strategic location' },
  { country: 'Germany', energyIndex: 38, laborCostIndex: 85, gridStability: 'High', policyScore: 75, energyCost: '$0.40/kWh', highlights: 'Green energy transition' },
  { country: 'China', energyIndex: 65, laborCostIndex: 35, gridStability: 'Medium', policyScore: 72, energyCost: '$0.08/kWh', highlights: 'Massive capacity' },
  { country: 'India', energyIndex: 55, laborCostIndex: 22, gridStability: 'Low', policyScore: 65, energyCost: '$0.07/kWh', highlights: 'Growing labor pool' },
  { country: 'Japan', energyIndex: 50, laborCostIndex: 90, gridStability: 'High', policyScore: 82, energyCost: '$0.22/kWh', highlights: 'Advanced grid tech' },
  { country: 'Malaysia', energyIndex: 60, laborCostIndex: 28, gridStability: 'Medium', policyScore: 68, energyCost: '$0.06/kWh', highlights: 'Emerging fab hub' },
];

type SortKey = 'country' | 'energyIndex' | 'laborCostIndex' | 'gridStability' | 'policyScore';

const gridColor = (s: string) => {
  if (s === 'High') return 'text-success';
  if (s === 'Medium') return 'text-warning';
  return 'text-danger';
};

const gridDot = (s: string) => {
  if (s === 'High') return '#22C55E';
  if (s === 'Medium') return '#F59E0B';
  return '#EF4444';
};

export default function EnergyLaborSection() {
  const [sortKey, setSortKey] = useState<SortKey>('energyIndex');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir(key === 'country' ? 'asc' : 'desc');
      return key;
    });
  }, []);

  const sorted = [...energyData].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'country') return a.country.localeCompare(b.country) * mul;
    if (sortKey === 'gridStability') {
      const order = { High: 3, Medium: 2, Low: 1 };
      return (order[a.gridStability] - order[b.gridStability]) * mul;
    }
    return ((a[sortKey] as number) - (b[sortKey] as number)) * mul;
  });

  const headers: { key: SortKey; label: string }[] = [
    { key: 'country', label: 'Country / Region' },
    { key: 'energyIndex', label: 'Energy Supply Index' },
    { key: 'laborCostIndex', label: 'Labor Cost Index' },
    { key: 'gridStability', label: 'Grid Stability' },
    { key: 'policyScore', label: 'Policy Score' },
  ];

  return (
    <section id="energy-labor" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-bg-base">
      <motion.div
        initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="max-w-[1440px] mx-auto mb-8"
      >
        <h2 className="text-heading-md text-text-primary font-display mb-2">Energy &amp; Labor Supply Index</h2>
        <p className="text-body-md text-text-secondary max-w-2xl">
          Key metrics for semiconductor manufacturing locations. Energy supply index reflects availability and cost of electricity. Labor cost index is relative to global average.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="max-w-[1440px] mx-auto bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-surface">
                {headers.map((h) => (
                  <th key={h.key}
                    onClick={() => handleSort(h.key)}
                    className="px-4 py-3 text-body-sm uppercase text-text-muted tracking-[0.04em] font-medium border-b border-border-subtle cursor-pointer hover:text-accent-amber select-none transition-colors duration-150"
                  >
                    <span className="flex items-center gap-1">
                      {h.label}
                      {sortKey === h.key && (
                        <span className="text-accent-amber">{sortDir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-body-sm uppercase text-text-muted tracking-[0.04em] font-medium border-b border-border-subtle">
                  Avg. Energy Cost
                </th>
                <th className="px-4 py-3 text-body-sm uppercase text-text-muted tracking-[0.04em] font-medium border-b border-border-subtle">
                  Highlights
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <motion.tr key={row.country} custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }}
                  className="border-b border-border-subtle last:border-0 bg-bg-base hover:bg-bg-elevated transition-all duration-200 group"
                >
                  <td className="px-4 py-3 relative">
                    <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-amber opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="font-medium text-text-primary">{row.country}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden max-w-[80px]">
                        <div
                          className="h-full rounded-full transition-all duration-600"
                          style={{
                            width: `${row.energyIndex}%`,
                            background: row.energyIndex >= 80 ? '#22C55E' : row.energyIndex >= 60 ? '#FFB84D' : '#EF4444',
                          }}
                        />
                      </div>
                      <span className="text-body-md text-text-primary font-mono">{row.energyIndex}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden max-w-[80px]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.laborCostIndex}%`,
                            background: row.laborCostIndex <= 40 ? '#22C55E' : row.laborCostIndex <= 70 ? '#FFB84D' : '#EF4444',
                          }}
                        />
                      </div>
                      <span className="text-body-md text-text-primary font-mono">{row.laborCostIndex}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: gridDot(row.gridStability) }} />
                      <span className={`text-body-md ${gridColor(row.gridStability)}`}>{row.gridStability}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-body-md text-accent-amber font-mono">{row.policyScore}</span>
                  </td>
                  <td className="px-4 py-3 text-body-md text-text-secondary font-mono">{row.energyCost}</td>
                  <td className="px-4 py-3 text-body-sm text-text-secondary">{row.highlights}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
