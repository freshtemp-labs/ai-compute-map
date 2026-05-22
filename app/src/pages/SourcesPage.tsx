import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sourcesTableData } from '@/data/mockData';
import type { SourceEntry } from '@/types';

// ─── Constants ─────────────────────────────────────────────────

const SOURCES_DATA = sourcesTableData;

const VERIFICATION_LOG = [
  { id: 1, dataPoint: 'TSMC Q4 2024 Revenue', sources: ['TSMC IR', 'TrendForce'], result: 'Verified', time: '2 min ago' },
  { id: 2, dataPoint: 'ASML EUV Shipments 2024', sources: ['ASML Report', 'SEMI'], result: 'Verified', time: '5 min ago' },
  { id: 3, dataPoint: 'China RE Quota 2025', sources: ['MIIT', 'Customs Data'], result: 'Discrepancy', time: '12 min ago' },
  { id: 4, dataPoint: 'AWS Power Virginia', sources: ['Equinix', 'EIA'], result: 'Verified', time: '18 min ago' },
  { id: 5, dataPoint: 'Samsung 3nm Yield', sources: ['Industry Sources'], result: 'Pending', time: '25 min ago' },
];

const TIER_COLORS = {
  tier1: 'bg-emerald-500/10 text-emerald-400',
  tier2: 'bg-sky-500/10 text-sky-400',
  tier3: 'bg-text-muted/10 text-text-muted',
};

const STATUS_COLORS = {
  active: 'bg-emerald-500/10 text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-400',
  stale: 'bg-rose-500/10 text-rose-400',
};

// ─── Component ─────────────────────────────────────────────────

export default function SourcesPage() {
  const { t } = useTranslation(['sources', 'common']);
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSources, setFilteredSources] = useState<SourceEntry[]>(SOURCES_DATA);

  useEffect(() => {
    let data = SOURCES_DATA;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
      );
    }
    if (tierFilter !== 'all') {
      data = data.filter((d) => d.tier === tierFilter);
    }
    if (statusFilter !== 'all') {
      data = data.filter((d) => d.status === statusFilter);
    }
    setFilteredSources(data);
  }, [searchQuery, tierFilter, statusFilter]);

  const tierCounts = {
    tier1: SOURCES_DATA.filter((s) => s.tier === 'tier1').length,
    tier2: SOURCES_DATA.filter((s) => s.tier === 'tier2').length,
    tier3: SOURCES_DATA.filter((s) => s.tier === 'tier3').length,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">{t('common:breadcrumb.home')}</Link>
            <span>/</span>
            <span className="text-text-secondary">{t('sources:breadcrumb')}</span>
          </nav>

          <h1 className="text-title text-text-primary">{t('sources:pageTitle')}</h1>
          <p className="text-body text-text-secondary mt-3 max-w-2xl">
            {t('sources:pageSubtitle')}
          </p>

          {/* Trust Stats */}
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { value: tierCounts.tier1, label: t('sources:trustStats.tier1') },
              { value: '3.4×', label: t('sources:trustStats.avgSources') },
              { value: t('sources:trustStats.timestamped'), label: '' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <span className="text-mono-lg text-accent-cyan">{stat.value}</span>
                {stat.label && <span className="text-mono-sm text-text-secondary">{stat.label}</span>}
              </div>
            ))}
          </div>

          {/* Live Badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live-pulse opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-live-pulse" />
            </span>
            <span className="text-mono-sm text-accent-cyan">{t('sources:liveBadge')}</span>
          </div>
        </div>
      </header>

      {/* Source Catalog */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('sources:sections.sourceCatalog')}</h2>

          {/* Tier Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { tier: 'tier1' as const, label: t('sources:sections.tier1Label'), desc: t('sources:sections.tier1Desc'), count: tierCounts.tier1, color: 'border-emerald-500/30' },
              { tier: 'tier2' as const, label: t('sources:sections.tier2Label'), desc: t('sources:sections.tier2Desc'), count: tierCounts.tier2, color: 'border-sky-500/30' },
              { tier: 'tier3' as const, label: t('sources:sections.tier3Label'), desc: t('sources:sections.tier3Desc'), count: tierCounts.tier3, color: 'border-text-muted/30' },
            ].map((tier) => (
              <div key={tier.tier} className={`p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border ${tier.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex px-2 py-0.5 rounded text-mono-sm ${TIER_COLORS[tier.tier]}`}>{tier.label}</span>
                  <span className="text-mono-lg text-accent-cyan">{tier.count}</span>
                </div>
                <p className="text-sm text-text-secondary">{tier.desc}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mt-6 mb-4">
            <input
              type="text"
              placeholder={t('sources:sections.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan"
            />
            <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary">
              <option value="all">{t('sources:sections.allTiers')}</option>
              <option value="tier1">{t('sources:sections.tier1Label')}</option>
              <option value="tier2">{t('sources:sections.tier2Label')}</option>
              <option value="tier3">{t('sources:sections.tier3Label')}</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary">
              <option value="all">{t('sources:sections.allStatus')}</option>
              <option value="active">{t('sources:sections.active')}</option>
              <option value="pending">{t('sources:sections.pending')}</option>
              <option value="stale">{t('sources:sections.stale')}</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('sources:sections.tableHeaders.name')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('sources:sections.tableHeaders.category')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('sources:sections.tableHeaders.tier')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('sources:sections.tableHeaders.layer')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('sources:sections.tableHeaders.dataPoints')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('sources:sections.tableHeaders.lastUpdated')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('sources:sections.tableHeaders.status')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSources.map((source) => (
                  <tr key={source.id} className="border-b border-border-subtle/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-3 py-3">
                      <p className="text-text-primary font-medium">{source.name}</p>
                      {source.description && <p className="text-mono-sm text-text-muted">{source.description}</p>}
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{source.category}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-mono-sm ${TIER_COLORS[source.tier]}`}>{source.tier}</span>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{source.layer}</td>
                    <td className="px-3 py-3 text-mono-sm text-accent-cyan">{source.dataPoints}</td>
                    <td className="px-3 py-3 text-mono-sm text-text-muted">{source.lastUpdated}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-mono-sm ${STATUS_COLORS[source.status]}`}>{source.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">No sources match your filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cross-Verification Engine */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('sources:sections.crossVerification')}</h2>
          <p className="text-sm text-text-secondary mt-2">Automated multi-source verification pipeline</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: t('sources:sections.steps.ingestion'), icon: '↓', desc: 'Sources ingested' },
              { step: t('sources:sections.steps.sourceMatching'), icon: '⇄', desc: 'Cross-referenced' },
              { step: t('sources:sections.steps.discrepancy'), icon: '⚠', desc: 'Discrepancies flagged' },
              { step: t('sources:sections.steps.publication'), icon: '✓', desc: 'Data published' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle text-center">
                <span className="text-2xl text-accent-cyan">{s.icon}</span>
                <p className="text-sm text-text-primary mt-2">{s.step}</p>
                <p className="text-mono-sm text-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Verification Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '1,247', label: t('sources:sections.verificationStats.pointsVerified') },
              { value: '23', label: t('sources:sections.verificationStats.pendingReview') },
              { value: '4', label: t('sources:sections.verificationStats.discrepancies') },
              { value: '< 2min', label: t('sources:sections.verificationStats.avgTime') },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <p className="text-mono-lg text-accent-cyan">{stat.value}</p>
                <p className="text-mono-sm text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Verifications */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-text-primary mb-4">{t('sources:sections.recentVerifications')}</h3>
            <div className="space-y-2">
              {VERIFICATION_LOG.map((log) => (
                <div key={log.id} className="flex items-center gap-4 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                  <span className={`w-2 h-2 rounded-full ${log.result === 'Verified' ? 'bg-emerald-400' : log.result === 'Discrepancy' ? 'bg-amber-400' : 'bg-sky-400'}`} />
                  <span className="flex-1 text-sm text-text-primary">{log.dataPoint}</span>
                  <span className="text-mono-sm text-text-muted">{log.sources.join(', ')}</span>
                  <span className={`text-mono-sm ${log.result === 'Verified' ? 'text-emerald-400' : log.result === 'Discrepancy' ? 'text-amber-400' : 'text-sky-400'}`}>{log.result}</span>
                  <span className="text-mono-sm text-text-muted">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('sources:sections.methodology')}</h2>
          <p className="text-sm text-text-secondary mt-2">How we collect, verify, and score data</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              t('sources:sections.sectionsM.powerConsumption'),
              t('sources:sections.sectionsM.marketShare'),
              t('sources:sections.sectionsM.geolocation'),
              t('sources:sections.sectionsM.capacityUtilization'),
              t('sources:sections.sectionsM.currencyConversion'),
              t('sources:sections.sectionsM.confidenceScoring'),
            ].map((m) => (
              <div key={m} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle flex items-center gap-3">
                <svg className="w-5 h-5 text-accent-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm text-text-secondary">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Data */}
      <section className="px-6 py-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('sources:sections.historicalData')}</h2>
          <p className="text-sm text-text-secondary mt-2">Archive of historical data snapshots for trend analysis</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '2024-01-01', label: t('sources:sections.archiveStats.firstSnapshot') },
              { value: '156', label: t('sources:sections.archiveStats.totalSnapshots') },
              { value: '45,000+', label: t('sources:sections.archiveStats.dataPointsTracked') },
              { value: '2.3 GB', label: t('sources:sections.archiveStats.storageSize') },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <p className="text-mono-lg text-accent-cyan">{stat.value}</p>
                <p className="text-mono-sm text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: t('sources:sections.accessOptions.timeMachine'), path: '/history' },
              { label: t('sources:sections.accessOptions.comparePeriods'), path: '/history' },
              { label: t('sources:sections.accessOptions.bulkExport'), path: '/developers' },
            ].map((opt) => (
              <Link
                key={opt.label}
                to={opt.path}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border-subtle rounded text-sm text-text-secondary hover:border-accent-cyan hover:text-text-primary transition-colors"
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
