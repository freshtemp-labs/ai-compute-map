import { describe, it, expect } from 'vitest';
import {
  supplyChainData,
  fabricationFacilities,
  dataCenters,
  sourceReferences,
  facilitiesData,
  supplyChainTableData,
  sourcesTableData,
  layers,
  kpis,
  companies,
  situationalAwarenessObservations,
  situationalAwarenessProfile,
  comparableFundProfiles,
  comparativeFundMonitoring,
} from '@/data/mockData';

// ── helpers ──────────────────────────────────────────────────────
function assertUniqueIds(items: { id: string | number }[], label: string) {
  const ids = items.map((i) => i.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length > 0) {
    throw new Error(`${label}: duplicate ids found: ${dupes.join(', ')}`);
  }
}

function assertLatInRange(lat: number, label: string) {
  if (lat < -90 || lat > 90) {
    throw new Error(`${label}: lat ${lat} out of range [-90, 90]`);
  }
}

function assertLngInRange(lng: number, label: string) {
  if (lng < -180 || lng > 180) {
    throw new Error(`${label}: lng ${lng} out of range [-180, 180]`);
  }
}

// ── Tests ────────────────────────────────────────────────────────

describe('Data arrays are non-empty', () => {
  const cases: [string, unknown[]][] = [
    ['supplyChainData', supplyChainData],
    ['fabricationFacilities', fabricationFacilities],
    ['dataCenters', dataCenters],
    ['sourceReferences', sourceReferences],
    ['facilitiesData', facilitiesData],
    ['supplyChainTableData', supplyChainTableData],
    ['sourcesTableData', sourcesTableData],
    ['layers', layers],
    ['kpis', kpis],
    ['companies', companies],
    ['situationalAwarenessObservations', situationalAwarenessObservations],
    ['comparableFundProfiles', comparableFundProfiles],
    ['comparativeFundMonitoring', comparativeFundMonitoring],
  ];

  for (const [name, arr] of cases) {
    it(`${name} should not be empty`, () => {
      expect(arr.length).toBeGreaterThan(0);
    });
  }
});

// ── supplyChainData ──────────────────────────────────────────────
describe('supplyChainData integrity', () => {
  it('every entry has required fields', () => {
    for (const d of supplyChainData) {
      expect(d.id).toBeTruthy();
      expect(d.name).toBeTruthy();
      expect(d.lat).toBeDefined();
      expect(d.lng).toBeDefined();
      expect(d.layer).toBe('supply');
    }
  });

  it('ids are unique', () => {
    assertUniqueIds(supplyChainData, 'supplyChainData');
  });

  it('lat/lng in valid range', () => {
    for (const d of supplyChainData) {
      assertLatInRange(d.lat, `sc id=${d.id}`);
      assertLngInRange(d.lng, `sc id=${d.id}`);
    }
  });
});

// ── fabricationFacilities ────────────────────────────────────────
describe('fabricationFacilities integrity', () => {
  it('every entry has required fields', () => {
    for (const f of fabricationFacilities) {
      expect(f.id).toBeTruthy();
      expect(f.name).toBeTruthy();
      expect(f.company).toBeTruthy();
      expect(f.lat).toBeDefined();
      expect(f.lng).toBeDefined();
      expect(f.layer).toBe('foundry');
    }
  });

  it('ids are unique', () => {
    assertUniqueIds(fabricationFacilities, 'fabricationFacilities');
  });

  it('lat/lng in valid range', () => {
    for (const f of fabricationFacilities) {
      assertLatInRange(f.lat, `fab id=${f.id}`);
      assertLngInRange(f.lng, `fab id=${f.id}`);
    }
  });
});

// ── dataCenters ──────────────────────────────────────────────────
describe('dataCenters integrity', () => {
  it('every entry has required fields', () => {
    for (const dc of dataCenters) {
      expect(dc.id).toBeTruthy();
      expect(dc.name).toBeTruthy();
      expect(dc.provider).toBeTruthy();
      expect(dc.lat).toBeDefined();
      expect(dc.lng).toBeDefined();
      // DataCenter type doesn't define layer, but check provider/region
      expect(dc.region).toBeTruthy();
    }
  });

  it('ids are unique', () => {
    assertUniqueIds(dataCenters, 'dataCenters');
  });

  it('lat/lng in valid range', () => {
    for (const dc of dataCenters) {
      assertLatInRange(dc.lat, `dc id=${dc.id}`);
      assertLngInRange(dc.lng, `dc id=${dc.id}`);
    }
  });
});

// ── sourceReferences ─────────────────────────────────────────────
describe('sourceReferences integrity', () => {
  it('every entry has required fields', () => {
    for (const s of sourceReferences) {
      expect(s.id).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.tier).toBeDefined();
      expect(s.lastUpdated).toBeTruthy();
    }
  });

  it('ids are unique', () => {
    assertUniqueIds(sourceReferences, 'sourceReferences');
  });
});

// ── facilitiesData ───────────────────────────────────────────────
describe('facilitiesData integrity', () => {
  it('every entry has required fields', () => {
    for (const f of facilitiesData) {
      expect(f.id).toBeDefined();
      expect(f.name).toBeTruthy();
      expect(f.provider).toBeTruthy();
      expect(f.country).toBeTruthy();
    }
  });

  it('ids are unique', () => {
    assertUniqueIds(facilitiesData, 'facilitiesData');
  });
});

// ── supplyChainTableData ─────────────────────────────────────────
describe('supplyChainTableData integrity', () => {
  it('every entry has required fields', () => {
    for (const s of supplyChainTableData) {
      expect(s.id).toBeDefined();
      expect(s.name).toBeTruthy();
      expect(s.type).toBeTruthy();
    }
  });

  it('ids are unique', () => {
    assertUniqueIds(supplyChainTableData, 'supplyChainTableData');
  });
});

// ── sourcesTableData ─────────────────────────────────────────────
describe('sourcesTableData integrity', () => {
  it('every entry has required fields', () => {
    for (const s of sourcesTableData) {
      expect(s.id).toBeDefined();
      expect(s.name).toBeTruthy();
      expect(s.tier).toBeTruthy();
    }
  });

  it('ids are unique', () => {
    assertUniqueIds(sourcesTableData, 'sourcesTableData');
  });
});

// ── layers & kpis ────────────────────────────────────────────────
describe('layers & kpis', () => {
  it('layers have valid types', () => {
    const validTypes = ['supply', 'foundry', 'datacenter'];
    for (const l of layers) {
      expect(validTypes).toContain(l.type);
      expect(l.route).toBeTruthy();
    }
  });

  it('kpis have valid structure', () => {
    for (const k of kpis) {
      expect(k.id).toBeTruthy();
      expect(k.label).toBeTruthy();
      expect(typeof k.value).toBe('number');
      expect(k.progressPercent).toBeGreaterThanOrEqual(0);
      expect(k.progressPercent).toBeLessThanOrEqual(100);
    }
  });
});

// ── companies ────────────────────────────────────────────────────
describe('companies integrity', () => {
  it('every entry has required fields', () => {
    for (const c of companies) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.country).toBeTruthy();
    }
  });

  it('ids are unique', () => {
    assertUniqueIds(companies, 'companies');
  });
});

// ── Situational Awareness LP observation framework ──────────────
describe('Situational Awareness observation framework', () => {
  it('has an auditable current 13F snapshot', () => {
    expect(situationalAwarenessProfile.filingType).toBe('SEC Form 13F-HR');
    expect(situationalAwarenessProfile.periodEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(situationalAwarenessProfile.filingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(situationalAwarenessProfile.reportedRows).toBeGreaterThan(0);
    expect(situationalAwarenessProfile.distinctIssuers).toBeGreaterThan(0);
    expect(situationalAwarenessProfile.reportedTableValueUsd).toBeGreaterThan(0);
    expect(situationalAwarenessProfile.sourceUrl).toMatch(/^https:\/\//);
    expect(situationalAwarenessProfile.disclosureLimit).toBeTruthy();
    expect(situationalAwarenessProfile.statusNote).toBeTruthy();
    expect(situationalAwarenessProfile.statusSourceUrl).toMatch(/^https:\/\//);
  });

  it('defines complete, source-linked observation items without duplicate ids', () => {
    expect(situationalAwarenessObservations.length).toBeGreaterThanOrEqual(8);
    assertUniqueIds(situationalAwarenessObservations, 'situationalAwarenessObservations');

    for (const item of situationalAwarenessObservations) {
      expect(item.title).toBeTruthy();
      expect(['critical', 'high']).toContain(item.priority);
      expect(['missing', 'partial']).toContain(item.coverage);
      expect(['13F position', '13G/13D stake', 'company-confirmed private investment', 'reported private investment', 'thesis inference']).toContain(item.evidenceLevel);
      expect(item.rationale).toBeTruthy();
      expect(item.fundSignal).toBeTruthy();
      expect(item.watchMetrics.length).toBeGreaterThanOrEqual(3);
      expect(item.entities.length).toBeGreaterThan(0);
      expect(item.sourceName).toBeTruthy();
      expect(item.sourceUrl).toMatch(/^https:\/\//);
      expect(item.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

// ── Comparable AI infrastructure fund framework ────────────────
describe('Comparable fund monitoring framework', () => {
  it('defines public, source-linked fund proxies with explicit non-overlap areas', () => {
    expect(comparableFundProfiles.length).toBeGreaterThanOrEqual(4);
    assertUniqueIds(comparableFundProfiles, 'comparableFundProfiles');

    for (const fund of comparableFundProfiles) {
      expect(fund.name).toBeTruthy();
      expect(fund.vehicle).toBeTruthy();
      expect(fund.comparability).toBeTruthy();
      expect(fund.thesis).toBeTruthy();
      expect(fund.overlapAreas.length).toBeGreaterThan(0);
      expect(fund.nonOverlapAreas.length).toBeGreaterThan(0);
      expect(fund.reportTitle).toBeTruthy();
      expect(fund.reportUrl).toMatch(/^https:\/\//);
      expect(fund.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('turns both consensus and non-overlap signals into auditable monitoring items', () => {
    expect(comparativeFundMonitoring.length).toBeGreaterThanOrEqual(5);
    assertUniqueIds(comparativeFundMonitoring, 'comparativeFundMonitoring');
    expect(comparativeFundMonitoring.some((item) => item.relation === 'overlap')).toBe(true);
    expect(comparativeFundMonitoring.some((item) => item.relation === 'non-overlap')).toBe(true);

    const fundIds = new Set(comparableFundProfiles.map((fund) => fund.id));
    for (const item of comparativeFundMonitoring) {
      expect(item.title).toBeTruthy();
      expect(['overlap', 'non-overlap']).toContain(item.relation);
      expect(['critical', 'high']).toContain(item.priority);
      expect(['missing', 'partial']).toContain(item.coverage);
      expect(item.fundIds.length).toBeGreaterThan(0);
      for (const fundId of item.fundIds) expect(fundIds.has(fundId)).toBe(true);
      expect(item.fundSignal).toBeTruthy();
      expect(item.watchMetrics.length).toBeGreaterThanOrEqual(3);
      expect(item.sourceUrl).toMatch(/^https:\/\//);
      expect(item.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
