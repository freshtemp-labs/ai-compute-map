/**
 * @file DevelopersPage.tsx
 * @description Developer documentation page with API reference, code examples
 * using Prism.js syntax highlighting, data format specifications, and
 * contribution guidelines.
 *
 * @dependencies react-i18next, react-syntax-highlighter, prismjs
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ─── Types ─────────────────────────────────────────────────────

interface EndpointDoc {
  method: string;
  path: string;
  description: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response?: string;
}

// ─── Constants ─────────────────────────────────────────────────

const ENDPOINTS: EndpointDoc[] = [
  {
    method: 'GET',
    path: '/api/v1/data-centers',
    description: 'List all data center facilities with optional filters',
    params: [
      { name: 'region', type: 'string', required: false, description: 'Filter by region (north-america, europe, asia-pacific, china)' },
      { name: 'provider', type: 'string', required: false, description: 'Filter by cloud provider' },
      { name: 'min_power', type: 'integer', required: false, description: 'Minimum power capacity in MW' },
      { name: 'limit', type: 'integer', required: false, description: 'Maximum number of results (default: 50, max: 500)' },
      { name: 'offset', type: 'integer', required: false, description: 'Pagination offset' },
    ],
    response: `{
  "data": [
    {
      "id": "dc-us-east-1",
      "name": "AWS US-East-1",
      "provider": "Amazon Web Services",
      "location": {
        "country": "USA",
        "region": "North America",
        "coordinates": [38.9, -77.0]
      },
      "power_mw": 180,
      "pue": 1.12,
      "year_operational": 2006,
      "status": "Operational",
      "energy_mix": "50% renewable",
      "last_updated": "2025-01-15T08:30:00Z",
      "data_source": "AWS Sustainability Report 2024",
      "tier": "tier1"
    }
  ],
  "meta": {
    "total": 200,
    "limit": 50,
    "offset": 0,
    "timestamp": "2025-02-09T10:00:00Z"
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/data-centers/:id',
    description: 'Get detailed information about a specific data center',
    params: [
      { name: 'id', type: 'string', required: true, description: 'Data center identifier' },
    ],
    response: `{
  "id": "dc-us-east-1",
  "name": "AWS US-East-1",
  "provider": "Amazon Web Services",
  ...
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/supply-chain',
    description: 'Query supply chain data — rare earth, lithography, design firms',
    params: [
      { name: 'type', type: 'string', required: false, description: 'Entity type (rare-earth, lithography, design, energy)' },
      { name: 'country', type: 'string', required: false, description: 'Filter by country' },
      { name: 'limit', type: 'integer', required: false, description: 'Maximum results' },
      { name: 'offset', type: 'integer', required: false, description: 'Pagination offset' },
    ],
    response: `{
  "data": [...],
  "meta": { "total": 1200, ... }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/foundries',
    description: 'Get foundry data including capacity, revenue, and process nodes',
    response: `{
  "data": [
    {
      "company": "TSMC",
      "revenue_2024_usd": 90100000000,
      "market_share_percent": 67.1,
      "advanced_node": "2nm (2025)",
      "fab_count": 6,
      ...
    }
  ],
  "meta": { "total": 14, ... }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/market-share',
    description: 'Get foundry market share data by quarter',
    response: `{
  "quarters": ["Q1-2023", "Q2-2023", ...],
  "foundries": {
    "TSMC": [56.4, 57.1, ...],
    "Samsung": [11.3, 11.8, ...],
    ...
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/power-consumption',
    description: 'Get global data center power consumption projections',
    response: `{
  "years": [2020, 2021, ..., 2030],
  "power_twh": [250, 290, ..., 945],
  "confidence_intervals": { ... }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/sources',
    description: 'List all data sources with metadata and verification status',
    params: [
      { name: 'tier', type: 'string', required: false, description: 'Filter by source tier (tier1, tier2, tier3)' },
      { name: 'status', type: 'string', required: false, description: 'Filter by status (active, pending, stale)' },
    ],
    response: `{
  "data": [
    {
      "id": 1,
      "name": "TSMC Annual Report 2024",
      "tier": "tier1",
      "status": "active",
      ...
    }
  ]
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/search',
    description: 'Full-text search across all entities',
    params: [
      { name: 'q', type: 'string', required: true, description: 'Search query (min 2 characters)' },
      { name: 'layer', type: 'string', required: false, description: 'Limit to specific layer' },
    ],
    response: `{
  "results": [...],
  "total": 42,
  "query": "TSMC"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/export',
    description: 'Export full dataset in CSV or JSON format',
    params: [
      { name: 'format', type: 'string', required: false, description: 'Export format: csv or json (default: json)' },
      { name: 'layer', type: 'string', required: false, description: 'Filter by layer' },
    ],
    response: `{
  "download_url": "https://api.aicomputemap.org/exports/data-2025-01.json",
  "expires_at": "2025-01-16T10:00:00Z",
  "size_bytes": 12500000
}`,
  },
];

const TS_TYPES = `// ─── Core Types ────────────────────────────────────────────

interface DataCenter {
  id: string;
  name: string;
  provider: string;
  location: {
    country: string;
    region: string;
    coordinates: [number, number];
  };
  power_mw: number;
  pue: number;
  year_operational: number;
  status: 'Operational' | 'Under Construction' | 'Planned';
  energy_mix: string;
  last_updated: string;
  data_source: string;
  tier: 'tier1' | 'tier2' | 'tier3';
}

interface SupplyChainEntity {
  id: number;
  name: string;
  type: 'rare-earth' | 'lithography' | 'design' | 'energy';
  country: string;
  key_metric: string;
  value: string;
  source: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  updated: string;
}

interface Foundry {
  company: string;
  revenue_2024_usd: number;
  market_share_percent: number;
  advanced_node: string;
  fab_count: number;
  usa_fabs: number;
  china_fabs: number;
  europe_fabs: number;
  capacity_monthly_wafers: number;
  key_customers: string[];
}

interface PowerConsumptionProjection {
  years: number[];
  power_twh: number[];
  confidence_intervals: {
    lower: number[];
    upper: number[];
  };
}

interface SourceEntry {
  id: number;
  name: string;
  category: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  layer: string;
  data_points: number;
  last_updated: string;
  status: 'active' | 'pending' | 'stale';
}

interface SearchResult<T> {
  results: T[];
  total: number;
  query: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    timestamp: string;
  };
}

// ─── API Client ─────────────────────────────────────────────

declare const API_BASE: string;

function api<T>(path: string, init?: RequestInit): Promise<T>;

// Usage:
const dcs = await api<PaginatedResponse<DataCenter>>(
  '/api/v1/data-centers?region=north-america&limit=10'
);`;

const PYTHON_EXAMPLE = `import requests

API_BASE = "https://api.aicomputemap.org"

def get_data_centers(region=None, provider=None, limit=50):
    params = {"limit": limit}
    if region:
        params["region"] = region
    if provider:
        params["provider"] = provider

    resp = requests.get(
        f"{API_BASE}/api/v1/data-centers",
        params=params
    )
    resp.raise_for_status()
    return resp.json()

# Get all North American DCs
data = get_data_centers(region="north-america")
for dc in data["data"]:
    print(f"{dc['name']}: {dc['power_mw']} MW")
`;

const JS_EXAMPLE = `const API_BASE = 'https://api.aicomputemap.org';

async function getFoundries() {
  const resp = await fetch(\`\${API_BASE}/api/v1/foundries\`);
  const data = await resp.json();
  return data.data;
}

// Get market share
async function getMarketShare() {
  const resp = await fetch(\`\${API_BASE}/api/v1/market-share\`);
  return await resp.json();
}

// Usage
const foundries = await getFoundries();
console.log(foundries[0].company); // "TSMC"
`;

const CURL_EXAMPLE = `# Get data centers
curl "https://api.aicomputemap.org/api/v1/data-centers?limit=5" \\
  -H "Accept: application/json"

# Get supply chain
curl "https://api.aicomputemap.org/api/v1/supply-chain?type=rare-earth" \\
  -H "Accept: application/json"

# Export CSV
curl "https://api.aicomputemap.org/api/v1/export?format=csv" \\
  -H "Accept: text/csv" \\
  --output data.csv
`;

// ─── Component ─────────────────────────────────────────────────

export default function DevelopersPage() {
  const { t } = useTranslation(['developers', 'common']);
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null);
  const [showTypes, setShowTypes] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">{t('common:breadcrumb.home')}</Link>
            <span>/</span>
            <span className="text-text-secondary">{t('developers:breadcrumb')}</span>
          </nav>

          <h1 className="text-title text-text-primary">{t('developers:pageTitle')}</h1>
          <p className="text-body text-text-secondary mt-3 max-w-2xl">
            {t('developers:pageSubtitle')}
          </p>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: t('developers:badges.openapi'), color: 'border-emerald-500/30 text-emerald-400' },
              { label: t('developers:badges.typescript'), color: 'border-sky-500/30 text-sky-400' },
              { label: t('developers:badges.noKey'), color: 'border-amber-500/30 text-amber-400' },
              { label: t('developers:badges.license'), color: 'border-text-muted/30 text-text-muted' },
            ].map((badge) => (
              <span key={badge.label} className={`px-3 py-1.5 rounded border ${badge.color} text-mono-sm`}>{badge.label}</span>
            ))}
          </div>
        </div>
      </header>

      {/* Getting Started */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('common:actions.learnMore')}</h2>
          <p className="text-sm text-text-secondary mt-2">Start using the API in minutes</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-3">{t('developers:gettingStarted.apiKey')}</h3>
              <p className="text-sm text-accent-cyan">{t('developers:gettingStarted.free')}</p>
              <p className="text-mono-sm text-text-muted mt-2">{t('developers:gettingStarted.rateLimits')}: {t('developers:gettingStarted.perHour')}</p>
            </div>
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-3">{t('developers:gettingStarted.baseUrl')}</h3>
              <code className="text-mono-sm text-accent-cyan">https://api.aicomputemap.org</code>
            </div>
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-3">{t('developers:gettingStarted.auth')}</h3>
              <p className="text-sm text-text-secondary">{t('developers:gettingStarted.bearer')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('developers:apiReference.title')}</h2>
          <p className="text-sm text-text-muted mt-2">{t('developers:apiReference.baseUrl')}: <code className="text-accent-cyan">https://api.aicomputemap.org</code></p>

          <div className="mt-6 space-y-4">
            {ENDPOINTS.map((ep, i) => (
              <div key={i} className="rounded-lg border border-border-subtle overflow-hidden">
                <button
                  onClick={() => setExpandedEndpoint(expandedEndpoint === i ? null : i)}
                  className="w-full flex items-center gap-3 px-5 py-4 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors text-left"
                >
                  <span className={`px-2 py-0.5 rounded text-mono-sm font-medium ${
                    ep.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400' :
                    ep.method === 'POST' ? 'bg-sky-500/10 text-sky-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>{ep.method}</span>
                  <code className="text-sm text-accent-cyan">{ep.path}</code>
                  <span className="flex-1 text-sm text-text-secondary truncate">{ep.description}</span>
                  <svg className={`w-4 h-4 text-text-muted transition-transform ${expandedEndpoint === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedEndpoint === i && (
                  <div className="px-5 py-4 border-t border-border-subtle bg-[rgba(255,255,255,0.01)]">
                    <p className="text-sm text-text-secondary mb-4">{ep.description}</p>

                    {ep.params && ep.params.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t('developers:queryParams')}</h4>
                        <div className="space-y-2">
                          {ep.params.map((p) => (
                            <div key={p.name} className="flex items-start gap-3">
                              <code className="text-mono-sm text-accent-cyan w-24 flex-shrink-0">{p.name}</code>
                              <span className={`text-mono-sm ${p.required ? 'text-rose-400' : 'text-text-muted'}`}>{p.required ? t('developers:required') : t('developers:optional')}</span>
                              <span className="text-mono-sm text-text-muted">{p.type}</span>
                              <span className="text-sm text-text-secondary">{p.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!ep.params || ep.params.length === 0) && (
                      <p className="text-sm text-text-muted mb-4">{t('developers:noParams')}</p>
                    )}

                    {ep.response && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t('developers:response')}</h4>
                        <div className="relative">
                          <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ borderRadius: '8px', fontSize: '13px', background: 'rgba(10,10,15,0.8)' }}>
                            {ep.response}
                          </SyntaxHighlighter>
                          <button
                            onClick={() => copyToClipboard(ep.response!, i)}
                            className="absolute top-2 right-2 px-2 py-1 text-mono-sm text-text-muted hover:text-accent-cyan transition-colors"
                          >
                            {copiedIndex === i ? t('common:actions.copy') + '!' : t('common:actions.copy')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('developers:codeExamples')}</h2>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Python */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">{t('developers:pythonSdk')}</h3>
              <div className="relative">
                <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ borderRadius: '8px', fontSize: '12px', background: 'rgba(10,10,15,0.8)' }}>
                  {PYTHON_EXAMPLE}
                </SyntaxHighlighter>
              </div>
            </div>
            {/* JavaScript */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">{t('developers:jsSdk')}</h3>
              <div className="relative">
                <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ borderRadius: '8px', fontSize: '12px', background: 'rgba(10,10,15,0.8)' }}>
                  {JS_EXAMPLE}
                </SyntaxHighlighter>
              </div>
            </div>
            {/* cURL */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">{t('developers:cliTool')}</h3>
              <div className="relative">
                <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '8px', fontSize: '12px', background: 'rgba(10,10,15,0.8)' }}>
                  {CURL_EXAMPLE}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TypeScript Types */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-section text-text-primary">{t('developers:typescriptTypes')}</h2>
            <button
              onClick={() => setShowTypes(!showTypes)}
              className="px-3 py-1.5 text-mono-sm text-text-secondary border border-border-subtle rounded hover:border-accent-cyan transition-colors"
            >
              {showTypes ? t('developers:hideTypes') : t('developers:showTypes')}
            </button>
          </div>

          {showTypes && (
            <div className="mt-4">
              <SyntaxHighlighter language="typescript" style={vscDarkPlus} customStyle={{ borderRadius: '8px', fontSize: '13px', background: 'rgba(10,10,15,0.8)' }}>
                {TS_TYPES}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </section>

      {/* System Architecture */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('developers:systemArchitecture')}</h2>
          <p className="text-sm text-text-secondary mt-2">{t('developers:architectureDesc')}</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t('developers:components.dataSources'), icon: '📡', color: 'border-amber-500/30' },
              { label: t('developers:components.ingestion'), icon: '↓', color: 'border-sky-500/30' },
              { label: t('developers:components.verification'), icon: '✓', color: 'border-emerald-500/30' },
              { label: t('developers:components.database'), icon: '🗄', color: 'border-accent-cyan/30' },
              { label: t('developers:components.cache'), icon: '⚡', color: 'border-amber-500/30' },
              { label: t('developers:components.apiLayer'), icon: 'API', color: 'border-sky-500/30' },
              { label: t('developers:components.frontend'), icon: '◈', color: 'border-emerald-500/30' },
              { label: t('developers:components.mapEngine'), icon: '🗺', color: 'border-accent-cyan/30' },
              { label: t('developers:components.charts'), icon: '◉', color: 'border-sky-500/30' },
              { label: t('developers:components.export'), icon: '⇣', color: 'border-text-muted/30' },
            ].map((comp) => (
              <div key={comp.label} className={`p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border ${comp.color} text-center`}>
                <span className="text-2xl">{comp.icon}</span>
                <p className="text-sm text-text-secondary mt-2">{comp.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributing */}
      <section className="px-6 py-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('developers:contributing.title')}</h2>
          <p className="text-body text-text-secondary mt-3">{t('developers:contributing.subtitle')}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-3">{t('developers:contributing.prWorkflow')}</h3>
              <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
                <li>Fork the repository</li>
                <li>Create a feature branch</li>
                <li>Make your changes with tests</li>
                <li>Submit a pull request</li>
              </ol>
            </div>
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-3">{t('developers:contributing.waysToContribute')}</h3>
              <div className="space-y-2">
                {[
                  { label: t('developers:contributing.data'), desc: 'Add or verify data sources' },
                  { label: t('developers:contributing.code'), desc: 'Fix bugs or add features' },
                  { label: t('developers:contributing.docs'), desc: 'Improve documentation' },
                  { label: t('developers:contributing.issues'), desc: 'Report bugs or request features' },
                ].map((w) => (
                  <div key={w.label} className="flex items-center gap-3">
                    <span className="text-accent-cyan">{w.label}</span>
                    <span className="text-mono-sm text-text-muted">{w.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://github.com/aicomputemap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border-active text-text-primary rounded transition-all duration-200 hover:border-accent-cyan active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {t('common:footer.github')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
