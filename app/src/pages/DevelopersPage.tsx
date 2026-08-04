/**
 * @file DevelopersPage.tsx
 * @description Public roadmap for a possible future API. The current release is
 * a static website and does not expose a callable API service.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PlannedEndpoint {
  method: 'GET';
  path: string;
  description: string;
  params?: string[];
}

const PLANNED_ENDPOINTS: PlannedEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/data-centers',
    description: 'List data center facilities with optional region, provider, and power filters.',
    params: ['region', 'provider', 'min_power', 'limit', 'offset'],
  },
  {
    method: 'GET',
    path: '/api/v1/data-centers/:id',
    description: 'Return the proposed detail representation for one data center.',
    params: ['id'],
  },
  {
    method: 'GET',
    path: '/api/v1/supply-chain',
    description: 'Query the proposed rare-earth, lithography, design, and energy dataset.',
    params: ['type', 'country', 'limit', 'offset'],
  },
  {
    method: 'GET',
    path: '/api/v1/foundries',
    description: 'List proposed foundry capacity, revenue, and process-node fields.',
  },
  {
    method: 'GET',
    path: '/api/v1/market-share',
    description: 'Return a proposed quarterly foundry market-share series.',
  },
  {
    method: 'GET',
    path: '/api/v1/power-consumption',
    description: 'Return proposed data-center power-consumption projections.',
  },
  {
    method: 'GET',
    path: '/api/v1/sources',
    description: 'List source metadata and verification status.',
    params: ['tier', 'status'],
  },
  {
    method: 'GET',
    path: '/api/v1/search',
    description: 'Search across the proposed public data representations.',
    params: ['q', 'layer'],
  },
  {
    method: 'GET',
    path: '/api/v1/export',
    description: 'Describe a possible server-side CSV or JSON export endpoint.',
    params: ['format', 'layer'],
  },
];

const GITHUB_REPOSITORY = 'https://github.com/freshtemp-labs/ai-compute-map';

export default function DevelopersPage() {
  const { t } = useTranslation(['developers', 'common']);

  return (
    <div className="min-h-screen">
      <header className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">
              {t('common:breadcrumb.home')}
            </Link>
            <span>/</span>
            <span className="text-text-secondary">{t('developers:breadcrumb')}</span>
          </nav>

          <h1 className="text-title text-text-primary">{t('developers:pageTitle')}</h1>
          <p className="text-body text-text-secondary mt-3 max-w-2xl">
            {t('developers:pageSubtitle')}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: t('developers:badges.planned'), color: 'border-amber-500/30 text-amber-400' },
              { label: t('developers:badges.schema'), color: 'border-sky-500/30 text-sky-400' },
              { label: t('developers:badges.staticData'), color: 'border-emerald-500/30 text-emerald-400' },
              { label: t('developers:badges.license'), color: 'border-text-muted/30 text-text-muted' },
            ].map((badge) => (
              <span key={badge.label} className={`px-3 py-1.5 rounded border ${badge.color} text-mono-sm`}>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto rounded-lg border border-amber-500/30 bg-amber-500/[0.05] p-6">
          <h2 className="text-section text-text-primary">{t('developers:status.title')}</h2>
          <p className="text-body text-text-secondary mt-3 max-w-3xl">{t('developers:status.body')}</p>
          <p className="text-sm text-amber-300 mt-3">{t('developers:status.availability')}</p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('developers:apiReference.title')}</h2>
          <p className="text-sm text-text-secondary mt-2 max-w-3xl">
            {t('developers:apiReference.description')}
          </p>

          <div className="mt-6 space-y-4">
            {PLANNED_ENDPOINTS.map((endpoint) => (
              <article
                key={endpoint.path}
                className="rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.02)] px-5 py-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-mono-sm font-medium bg-emerald-500/10 text-emerald-400">
                    {endpoint.method}
                  </span>
                  <code className="text-sm text-accent-cyan">{endpoint.path}</code>
                  <span className="text-mono-sm text-amber-400">{t('developers:plannedLabel')}</span>
                </div>
                <p className="text-sm text-text-secondary mt-3">{endpoint.description}</p>
                {endpoint.params && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-mono-sm text-text-muted">{t('developers:proposedParams')}:</span>
                    {endpoint.params.map((param) => (
                      <code key={param} className="px-2 py-0.5 rounded bg-bg-surface text-mono-sm text-text-secondary">
                        {param}
                      </code>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8 pb-16">
        <div className="max-w-6xl mx-auto text-center rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.02)] p-8">
          <h2 className="text-section text-text-primary">{t('developers:contributing.title')}</h2>
          <p className="text-body text-text-secondary mt-3 max-w-2xl mx-auto">
            {t('developers:contributing.subtitle')}
          </p>
          <a
            href={GITHUB_REPOSITORY}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 border border-border-active text-text-primary rounded transition-all duration-200 hover:border-accent-cyan active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {t('developers:viewRepository')}
          </a>
        </div>
      </section>
    </div>
  );
}
