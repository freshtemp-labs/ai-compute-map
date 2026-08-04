/**
 * @file ComparableFundsSection.tsx
 * @description Public AI-infrastructure fund/research comparison and the
 * monitoring lanes added when their disclosed theses do not overlap SALP.
 */
import { Activity, ExternalLink, Layers3, Radar, ShieldCheck } from 'lucide-react';
import {
  comparableFundProfiles,
  comparativeFundMonitoring,
} from '@/data/mockData';
import type { ComparableFundProfile, FundMonitoringItem, ObservationDomain } from '@/types';

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

const EVIDENCE_LABELS: Record<FundMonitoringItem['evidenceLevel'], string> = {
  'fund prospectus': 'Fund prospectus',
  'fund commentary': 'Fund commentary',
  'public research report': 'Public research report',
  'index methodology': 'Index methodology',
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

function FundCard({ fund }: { fund: ComparableFundProfile }) {
  return (
    <article className="rounded-xl border border-border-subtle bg-[rgba(255,255,255,0.018)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wide text-accent-cyan">
            {fund.ticker ? `${fund.ticker} · ` : ''}{fund.vehicle}
          </p>
          <h3 className="mt-2 text-base font-semibold text-text-primary">{fund.name}</h3>
        </div>
        <a
          href={fund.reportUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-accent-cyan hover:text-cyan-200"
          aria-label={`Open public report for ${fund.name}`}
        >
          Public material <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>

      <p className="mt-3 text-xs leading-5 text-text-secondary">{fund.comparability}</p>
      <p className="mt-3 text-sm leading-6 text-text-primary">{fund.thesis}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Overlap with SALP</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {fund.overlapAreas.map((area) => (
              <span key={area} className="rounded border border-emerald-400/20 bg-emerald-400/5 px-2 py-1 text-[11px] text-emerald-200">{area}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Non-overlap / expansion</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {fund.nonOverlapAreas.map((area) => (
              <span key={area} className="rounded border border-amber-400/20 bg-amber-400/5 px-2 py-1 text-[11px] text-amber-200">{area}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 border-t border-border-subtle pt-3 text-[11px] text-text-muted">
        {fund.reportTitle} · as of {fund.asOf}
      </p>
    </article>
  );
}

function MonitoringCard({ item }: { item: FundMonitoringItem }) {
  const fundNames = item.fundIds
    .map((id) => comparableFundProfiles.find((fund) => fund.id === id))
    .filter((fund): fund is ComparableFundProfile => Boolean(fund))
    .map((fund) => fund.ticker ?? fund.name)
    .join(' · ');

  return (
    <article className="rounded-xl border border-border-subtle bg-[rgba(255,255,255,0.018)] p-5 transition-colors hover:border-border-active">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide ${DOMAIN_COLORS[item.domain]}`}>
              {DOMAIN_LABELS[item.domain]}
            </span>
            <span className={`text-[10px] font-mono uppercase tracking-wide ${item.relation === 'non-overlap' ? 'text-amber-300' : 'text-emerald-300'}`}>
              {item.relation === 'non-overlap' ? 'NEW LENS' : 'CONSENSUS'}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wide text-text-muted">{EVIDENCE_LABELS[item.evidenceLevel]}</span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-text-primary">{item.title}</h3>
        </div>
        <span className="rounded border border-border-subtle px-2 py-1 text-[10px] font-mono text-text-muted">
          {item.priority} · {item.coverage === 'missing' ? 'NEW COVERAGE' : 'EXPAND COVERAGE'}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-text-secondary">{item.rationale}</p>

      <div className="mt-4 rounded-lg border border-amber-400/10 bg-amber-400/[0.035] p-3">
        <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide text-amber-200">
          <Radar size={12} aria-hidden="true" />
          Public fund signal · {fundNames}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-text-secondary">{item.fundSignal}</p>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Track as structured metrics</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.watchMetrics.map((metric) => (
            <span key={metric} className="rounded border border-border-subtle bg-bg-base px-2 py-1 text-[11px] text-text-secondary">{metric}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-3">
        <p className="text-[11px] text-text-muted">Entities: {item.entities.join(' · ')}</p>
        <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-accent-cyan hover:text-cyan-200">
          Source <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function ComparableFundsSection() {
  const newLensCount = comparativeFundMonitoring.filter((item) => item.relation === 'non-overlap').length;
  const criticalCount = comparativeFundMonitoring.filter((item) => item.priority === 'critical').length;

  return (
    <section className="px-6 py-8" aria-labelledby="comparable-funds-title">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-amber-400/20 bg-[linear-gradient(135deg,rgba(255,184,77,0.08),rgba(0,212,255,0.04)_48%,rgba(255,255,255,0.015))] p-5 md:p-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-amber-300">
                <Layers3 size={18} aria-hidden="true" />
                <span className="text-[11px] font-mono uppercase tracking-[0.14em]">Comparative fund lens</span>
              </div>
              <h2 id="comparable-funds-title" className="mt-3 text-section text-text-primary">
                同类基金对照 / Comparable AI Infrastructure Funds
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                没有足够公开材料把另一只基金与 SALP 的多空、私募和衍生品结构直接等同；这里使用公开 ETF 说明书、季度评论和研究报告作为可审计代理。
                “NEW LENS” 表示该对象带来的关注点在 SALP 当前公开信号中不重合，已转成项目监控项。
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs text-amber-100">
              <ShieldCheck size={14} aria-hidden="true" />
              Research signals, not investment advice
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-border-subtle bg-bg-base/50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Comparable proxies</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{comparableFundProfiles.length}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-bg-base/50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">New lenses</p>
              <p className="mt-1 text-sm font-medium text-amber-200">{newLensCount}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-bg-base/50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Critical items</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{criticalCount}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-bg-base/50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Last reviewed</p>
              <p className="mt-1 text-sm font-medium text-text-primary">2026-08-02</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {comparableFundProfiles.map((fund) => <FundCard key={fund.id} fund={fund} />)}
        </div>

        <div className="mt-8 flex items-center gap-2">
          <Activity size={16} className="text-accent-cyan" aria-hidden="true" />
          <h2 className="text-section text-text-primary">对照后纳入监控 / Added monitoring lanes</h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {comparativeFundMonitoring.map((item) => <MonitoringCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
