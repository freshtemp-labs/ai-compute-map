import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { facilitiesData } from '@/data/mockData';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend as ReLegend,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';

// ─── Constants ─────────────────────────────────────────────────

const POWER_DATA = [
  { year: '2020', power: 250 },
  { year: '2021', power: 290 },
  { year: '2022', power: 320 },
  { year: '2023', power: 370 },
  { year: '2024', power: 430 },
  { year: '2025', power: 485 },
  { year: '2026E', power: 550 },
  { year: '2027E', power: 630 },
  { year: '2028E', power: 720 },
  { year: '2029E', power: 830 },
  { year: '2030E', power: 945 },
];

const REGIONAL_DATA = [
  { region: 'North America', power: 185, capacity: '18.5 GW', topProvider: 'Microsoft (26 DCs)', keyLocations: 'Virginia, Oregon, Iowa' },
  { region: 'China', power: 165, capacity: '16.5 GW', topProvider: 'BAT + Chindata', keyLocations: 'Guizhou, Inner Mongolia' },
  { region: 'Europe', power: 95, capacity: '9.5 GW', topProvider: 'Equinix + Google', keyLocations: 'Frankfurt, Amsterdam, Dublin' },
  { region: 'Asia Pacific', power: 40, capacity: '4.0 GW', topProvider: 'AWS + Singtel', keyLocations: 'Singapore, Sydney, Tokyo' },
];

const PROVIDER_DATA = [
  { provider: 'Amazon (AWS)', power: 85, facilities: 38, keyRegions: 'US East, EU Central' },
  { provider: 'Microsoft', power: 72, facilities: 26, keyRegions: 'Virginia, Iowa, Amsterdam' },
  { provider: 'Google', power: 48, facilities: 37, keyRegions: 'Iowa, Oregon, Finland' },
  { provider: 'Meta', power: 35, facilities: 24, keyRegions: 'Virginia, Iowa, Sweden' },
  { provider: 'Apple', power: 15, facilities: 12, keyRegions: 'North Carolina, Nevada, Denmark' },
  { provider: 'Alibaba Cloud', power: 28, facilities: 16, keyRegions: 'Hangzhou, Zhangjiakou' },
  { provider: 'Tencent Cloud', power: 22, facilities: 14, keyRegions: 'Guangdong, Shanghai' },
  { provider: 'Equinix', power: 8, facilities: 248, keyRegions: 'Global (colocation)' },
];

const FACILITIES_DATA = facilitiesData;

const STATUS_COLORS = {
  'Operational': '#00e5b0',
  'Under Construction': '#fbbf24',
  'Planned': '#f87171',
};

// ─── Component ─────────────────────────────────────────────────

export default function DataCentersPage() {
  const { t } = useTranslation(['datacenters', 'common']);
  const [regionFilter, setRegionFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFacilities = useMemo(() => {
    let data = FACILITIES_DATA;
    if (regionFilter !== 'all') {
      data = data.filter((d) => d.region.toLowerCase().replace(/\s+/g, '') === regionFilter.toLowerCase());
    }
    if (providerFilter !== 'all') {
      data = data.filter((d) => d.provider === providerFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.provider.toLowerCase().includes(q)
      );
    }
    return data;
  }, [regionFilter, providerFilter, searchQuery]);

  const chartData = useMemo(() => PROVIDER_DATA.map((p) => ({
    name: p.provider,
    power: p.power,
    facilities: p.facilities,
  })), []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">{t('common:breadcrumb.home')}</Link>
            <span>/</span>
            <span className="text-text-secondary">{t('datacenters:breadcrumb')}</span>
          </nav>

          <h1 className="text-title text-text-primary">{t('datacenters:pageTitle')}</h1>
          <p className="text-body text-text-secondary mt-3 max-w-2xl">
            {t('datacenters:pageSubtitle')}
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '200+', label: t('datacenters:stats.facilities') },
              { value: '485.4 TWh', label: t('datacenters:stats.power2025') },
              { value: '945 TWh', label: t('datacenters:stats.projected2030') },
              { value: t('common:status.live'), label: t('datacenters:stats.liveUpdates') },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <p className="text-mono-lg text-accent-cyan">{stat.value}</p>
                <p className="text-mono-sm text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Power Consumption Projection */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('datacenters:sections.powerConsumption')}</h2>
          <p className="text-sm text-text-secondary mt-2">Global data center power consumption — historical and projected to 2030</p>

          <div className="mt-6 p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={POWER_DATA}>
                <defs>
                  <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5b0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00e5b0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#8a8a93" fontSize={12} />
                <YAxis stroke="#8a8a93" fontSize={12} label={{ value: 'TWh', angle: -90, position: 'insideLeft', style: { fill: '#8a8a93', fontSize: 12 } }} />
                <ReTooltip contentStyle={{ backgroundColor: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f0f0f0' }} />
                <Area type="monotone" dataKey="power" stroke="#00e5b0" fill="url(#powerGradient)" strokeWidth={2} name="Power (TWh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Regional Deep Dive */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('datacenters:sections.regionalDeepDive')}</h2>
          <p className="text-sm text-text-secondary mt-2">Capacity, growth, and key providers by region</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {REGIONAL_DATA.map((r) => (
              <div key={r.region} className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-text-primary">{r.region}</h3>
                  <span className="text-mono-lg text-accent-cyan">{r.capacity}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-mono-sm text-text-muted">Power (2025E)</span><span className="text-mono-sm text-text-primary">{r.power} TWh</span></div>
                  <div className="flex justify-between"><span className="text-mono-sm text-text-muted">Top Provider</span><span className="text-mono-sm text-text-primary">{r.topProvider}</span></div>
                  <div className="flex justify-between"><span className="text-mono-sm text-text-muted">Key Locations</span><span className="text-mono-sm text-text-muted text-right">{r.keyLocations}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Power & Sustainability */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('datacenters:sections.powerSustainability')}</h2>
          <p className="text-sm text-text-secondary mt-2">PUE trends, renewable energy adoption, and sustainability metrics</p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-4">{t('datacenters:sections.pue')}</h3>
              <div className="space-y-2">
                {FACILITIES_DATA.slice(0, 10).map((f) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <span className="text-mono-sm text-text-muted w-32 truncate">{f.name}</span>
                    <div className="flex-1 h-4 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-accent-cyan" style={{ width: `${Math.min(100, (f.pue - 1) * 200)}%` }} />
                    </div>
                    <span className="text-mono-sm text-text-secondary w-12 text-right">{f.pue}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-4">{t('datacenters:sections.energyMix')}</h3>
              <div className="space-y-4">
                {[
                  { source: 'Coal / Gas', pct: 48, color: '#f87171' },
                  { source: 'Renewable (Solar / Wind)', pct: 42, color: '#00e5b0' },
                  { source: 'Nuclear', pct: 7, color: '#38bdf8' },
                  { source: 'Other', pct: 3, color: '#a78bfa' },
                ].map((m) => (
                  <div key={m.source}>
                    <div className="flex justify-between mb-1"><span className="text-sm text-text-secondary">{m.source}</span><span className="text-mono-sm text-text-primary">{m.pct}%</span></div>
                    <div className="h-2 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Provider Breakdown */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('datacenters:sections.providerBreakdown')}</h2>
          <p className="text-sm text-text-secondary mt-2">Power consumption and facility count by cloud provider</p>

          <div className="mt-6 p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#8a8a93" fontSize={11} angle={-30} textAnchor="end" height={80} />
                <YAxis stroke="#8a8a93" fontSize={12} />
                <ReTooltip contentStyle={{ backgroundColor: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f0f0f0' }} />
                <ReLegend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="power" fill="#00e5b0" name="Power (MW)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="facilities" fill="#38bdf8" name="Facilities" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Complete Dataset */}
      <section className="px-6 py-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-section text-text-primary">{t('datacenters:sections.dataset')}</h2>
              <p className="text-sm text-text-secondary mt-2">Search and filter the full dataset of global data center facilities</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => {
                const headers = ['id','name','provider','country','region','powerMW','pue','year','status','energyMix'];
                const csv = [headers.join(','), ...filteredFacilities.map((f) =>
                  [f.id, `"${f.name}"`, `"${f.provider}"`, f.country, f.region, f.powerMW, f.pue, f.year, f.status, `"${f.energyMix}"`].join(',')
                )].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'datacenters.csv'; a.click();
              }} className="px-3 py-1.5 text-mono-sm text-text-secondary border border-border-subtle rounded hover:border-accent-cyan transition-colors cursor-pointer">
                {t('datacenters:sections.exportCSV')}
              </button>
              <button onClick={() => {
                const blob = new Blob([JSON.stringify(filteredFacilities, null, 2)], { type: 'application/json' });
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'datacenters.json'; a.click();
              }} className="px-3 py-1.5 text-mono-sm text-text-secondary border border-border-subtle rounded hover:border-accent-cyan transition-colors cursor-pointer">
                {t('datacenters:sections.exportJSON')}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder={t('map:search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan"
            />
            <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary">
              <option value="all">All Regions</option>
              <option value="northamerica">{t('datacenters:regions.na')}</option>
              <option value="china">{t('datacenters:regions.china')}</option>
              <option value="europe">{t('datacenters:regions.europe')}</option>
              <option value="asiapacific">{t('datacenters:regions.apac')}</option>
            </select>
            <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary">
              <option value="all">All Providers</option>
              {Array.from(new Set(FACILITIES_DATA.map((f) => f.provider))).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('datacenters:sections.facility')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('datacenters:sections.provider')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('datacenters:sections.country')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('datacenters:sections.region')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('datacenters:sections.powerMW')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('datacenters:sections.pueLabel')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('datacenters:sections.year')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('datacenters:sections.status')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((f) => (
                  <tr key={f.id} className="border-b border-border-subtle/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-3 py-3 text-text-primary font-medium">{f.name}</td>
                    <td className="px-3 py-3 text-text-secondary">{f.provider}</td>
                    <td className="px-3 py-3 text-text-secondary">{f.country}</td>
                    <td className="px-3 py-3 text-text-secondary">{f.region}</td>
                    <td className="px-3 py-3 text-mono-sm text-accent-cyan">{f.powerMW} MW</td>
                    <td className="px-3 py-3 text-mono-sm text-text-secondary">{f.pue}</td>
                    <td className="px-3 py-3 text-mono-sm text-text-secondary">{f.year}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 text-mono-sm">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[f.status] }} />
                        {f.status === 'Operational' ? t('datacenters:statusLabels.operational') : f.status === 'Under Construction' ? t('datacenters:statusLabels.underConstruction') : t('datacenters:statusLabels.planned')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFacilities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">No facilities match your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
