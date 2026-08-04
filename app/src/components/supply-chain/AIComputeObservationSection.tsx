/**
 * @file AIComputeObservationSection.tsx
 * @description Source-backed observation framework added after reviewing
 * Situational Awareness LP's public 13F disclosure. It deliberately separates
 * a disclosed security position from the physical metrics the map must collect.
 */
import { Activity, AlertTriangle, ExternalLink, Eye, Layers3 } from 'lucide-react';
import {
  situationalAwarenessObservations,
  situationalAwarenessProfile,
} from '@/data/mockData';
import type { ObservationDomain, ObservationItem } from '@/types';

const DOMAIN_LABELS: Record<ObservationDomain, string> = {
  accelerator: 'Accelerators',
  memory: 'HBM & memory',
  packaging: 'Advanced packaging',
  networking: 'Networking & optical',
  'server-rack': 'Servers & racks',
  'compute-campus': 'Compute campuses',
  'power-cooling': 'Power & cooling',
  materials: 'Materials & enablers',
  policy: 'Policy & capital risk',
};

const DOMAIN_COLORS: Record<ObservationDomain, string> = {
  accelerator: 'border-violet-400/25 bg-violet-500/10 text-violet-200',
  memory: 'border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-200',
  packaging: 'border-amber-400/25 bg-amber-500/10 text-amber-200',
  networking: 'border-cyan-400/25 bg-cyan-500/10 text-cyan-200',
  'server-rack': 'border-blue-400/25 bg-blue-500/10 text-blue-200',
  'compute-campus': 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200',
  'power-cooling': 'border-orange-400/25 bg-orange-500/10 text-orange-200',
  materials: 'border-lime-400/25 bg-lime-500/10 text-lime-200',
  policy: 'border-rose-400/25 bg-rose-500/10 text-rose-200',
};

const EVIDENCE_LABELS: Record<ObservationItem['evidenceLevel'], string> = {
  '13F position': '13F position',
  '13G/13D stake': '13G/13D stake',
  'company-confirmed private investment': 'Company-confirmed private investment',
  'reported private investment': 'Reported private investment',
  'thesis inference': 'Thesis inference',
};

function formatUsd(value: number): string {
  return `$${(value / 1_000_000_000).toFixed(2)}B`;
}

function ObservationCard({ item }: { item: ObservationItem }) {
  const isCritical = item.priority === 'critical';

  return (
    <article className="rounded-xl border border-border-subtle bg-[rgba(255,255,255,0.018)] p-5 transition-colors hover:border-border-active">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide ${DOMAIN_COLORS[item.domain]}`}>
              {DOMAIN_LABELS[item.domain]}
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide ${isCritical ? 'text-amber-300' : 'text-text-muted'}`}>
              {isCritical ? <AlertTriangle size={12} aria-hidden="true" /> : <Activity size={12} aria-hidden="true" />}
              {item.priority}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wide text-text-muted">{EVIDENCE_LABELS[item.evidenceLevel]}</span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-text-primary">{item.title}</h3>
        </div>
        <span className="rounded border border-border-subtle px-2 py-1 text-[10px] font-mono text-text-muted">
          {item.coverage === 'missing' ? 'NEW COVERAGE' : 'EXPAND COVERAGE'}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-text-secondary">{item.rationale}</p>

      <div className="mt-4 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.035] p-3">
        <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide text-accent-cyan">
          <Eye size={12} aria-hidden="true" />
          Public-filing signal
        </p>
        <p className="mt-1.5 text-xs leading-5 text-text-secondary">{item.fundSignal}</p>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Track as structured metrics</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.watchMetrics.map((metric) => (
            <span key={metric} className="rounded border border-border-subtle bg-bg-base px-2 py-1 text-[11px] text-text-secondary">
              {metric}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-3">
        <p className="text-[11px] text-text-muted">Entities: {item.entities.join(' · ')}</p>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-accent-cyan transition-colors hover:text-cyan-200"
          aria-label={`Open source for ${item.title}`}
        >
          Source <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

/**
 * Displays a research framework rather than an investable portfolio. The source
 * is linked at the card level and the disclosure limitation is always visible.
 */
export default function AIComputeObservationSection() {
  const criticalCount = situationalAwarenessObservations.filter((item) => item.priority === 'critical').length;

  return (
    <section className="px-6 py-8" aria-labelledby="ai-compute-observations-title">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(0,212,255,0.09),rgba(168,85,247,0.055)_48%,rgba(255,255,255,0.015))] p-5 md:p-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-accent-cyan">
                <Layers3 size={18} aria-hidden="true" />
                <span className="text-[11px] font-mono uppercase tracking-[0.14em]">Research overlay</span>
              </div>
              <h2 id="ai-compute-observations-title" className="mt-3 text-section text-text-primary">
                AI 真实算力观察项 / AI Compute Observation Framework
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Situational Awareness LP 的公开 13F 信号把关注点从芯片价格延伸到可交付算力：HBM、封装、网络、AI 云园区、电力与冷却。
                下列项目是本地图此前未结构化覆盖或覆盖不足的采集清单，并非投资建议。
              </p>
            </div>
            <a
              href={situationalAwarenessProfile.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100 transition-colors hover:bg-cyan-400/20"
            >
              View SEC 13F <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-border-subtle bg-bg-base/50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Report period</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{situationalAwarenessProfile.periodEnd}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-bg-base/50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">13F rows / issuers</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{situationalAwarenessProfile.reportedRows} / {situationalAwarenessProfile.distinctIssuers}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-bg-base/50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Reported table value</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{formatUsd(situationalAwarenessProfile.reportedTableValueUsd)}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-bg-base/50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Critical additions</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{criticalCount} observation areas</p>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-text-muted">Disclosure limit: {situationalAwarenessProfile.disclosureLimit}</p>
          {situationalAwarenessProfile.statusNote && situationalAwarenessProfile.statusSourceUrl && (
            <p className="mt-2 text-[11px] leading-5 text-amber-200/80">
              Post-period status: {situationalAwarenessProfile.statusNote}{' '}
              <a href={situationalAwarenessProfile.statusSourceUrl} target="_blank" rel="noreferrer" className="underline decoration-amber-200/50 underline-offset-2 hover:text-amber-100">Source</a>
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {situationalAwarenessObservations.map((item) => <ObservationCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
