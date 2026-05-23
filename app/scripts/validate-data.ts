#!/usr/bin/env tsx
/**
 * @file scripts/validate-data.ts
 * @description Data validation script for AI Compute Map.
 * Reads all data arrays from mockData.ts and validates:
 *   - Required fields and their types
 *   - Coordinate validity (lat/lng ranges)
 *   - ID uniqueness within each dataset
 *   - Value ranges (e.g., confidence 0-1, PUE >= 1, progressPercent 0-100)
 *   - Enum validity (e.g., layer, status, tier)
 *
 * Usage: npx tsx scripts/validate-data.ts
 * Also available as: npm run validate-data
 *
 * @dependencies tsx (dev runner), mockData exports, types definitions
 */

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
} from '../src/data/mockData';

// ── Types ────────────────────────────────────────────────────────────

interface ValidationError {
  dataset: string;
  id: string | number;
  field: string;
  message: string;
}

// ── Helpers

const errors: ValidationError[] = [];

function addError(dataset: string, id: string | number, field: string, message: string) {
  errors.push({ dataset, id, field, message });
}

/** Validate that a coordinate is within valid geographic range */
function validateCoordinate(lat: number, lng: number, dataset: string, id: string | number) {
  if (typeof lat !== 'number' || Number.isNaN(lat)) {
    addError(dataset, id, 'lat', `lat is not a valid number: ${lat}`);
  } else if (lat < -90 || lat > 90) {
    addError(dataset, id, 'lat', `lat ${lat} out of range [-90, 90]`);
  }
  if (typeof lng !== 'number' || Number.isNaN(lng)) {
    addError(dataset, id, 'lng', `lng is not a valid number: ${lng}`);
  } else if (lng < -180 || lng > 180) {
    addError(dataset, id, 'lng', `lng ${lng} out of range [-180, 180]`);
  }
}

/** Validate that IDs are unique within a dataset */
function validateUniqueIds(items: { id: string | number }[], dataset: string) {
  const seen = new Set<string | number>();
  for (const item of items) {
    if (seen.has(item.id)) {
      addError(dataset, item.id, 'id', `Duplicate ID: ${item.id}`);
    }
    seen.add(item.id);
  }
}

/** Validate that a string field is non-empty */
function validateRequiredString(value: unknown, field: string, dataset: string, id: string | number) {
  if (typeof value !== 'string' || value.trim() === '') {
    addError(dataset, id, field, `Required string field "${field}" is missing or empty`);
  }
}

/** Validate that a number field exists and is finite */
function validateRequiredNumber(value: unknown, field: string, dataset: string, id: string | number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    addError(dataset, id, field, `Required number field "${field}" is missing or not a finite number: ${value}`);
  }
}

/** Validate a date string is in reasonable format */
function validateDateString(value: unknown, field: string, dataset: string, id: string | number) {
  if (typeof value !== 'string' || value.trim() === '') {
    addError(dataset, id, field, `Required date field "${field}" is missing or empty`);
    return;
  }
  // Accept YYYY-MM-DD, YYYY-MM, and YYYY-Q# formats
  const datePattern = /^\d{4}(-\d{2}(-\d{2})?)?$/;
  const quarterPattern = /^\d{4}-Q[1-4]$/;
  if (!datePattern.test(value) && !quarterPattern.test(value)) {
    addError(dataset, id, field, `Date field "${field}" has unexpected format: ${value}`);
  }
}

// ── Dataset Validators ───────────────────────────────────────────────

function validateSupplyChainData() {
  const dataset = 'supplyChainData';
  validateUniqueIds(supplyChainData, dataset);

  for (const item of supplyChainData) {
    validateRequiredString(item.id, 'id', dataset, item.id);
    validateRequiredString(item.name, 'name', dataset, item.id);
    validateCoordinate(item.lat, item.lng, dataset, item.id);
    validateRequiredString(item.layer, 'layer', dataset, item.id);
    validateRequiredString(item.category, 'category', dataset, item.id);
    validateRequiredString(item.sourceName, 'sourceName', dataset, item.id);
    validateDateString(item.lastUpdated, 'lastUpdated', dataset, item.id);

    // Validate source tier
    if (![1, 2, 3].includes(item.sourceTier)) {
      addError(dataset, item.id, 'sourceTier', `Invalid sourceTier: ${item.sourceTier}`);
    }

    // Validate confidence range (optional field)
    if (item.confidence !== undefined) {
      if (typeof item.confidence !== 'number' || item.confidence < 0 || item.confidence > 1) {
        addError(dataset, item.id, 'confidence', `Confidence must be between 0 and 1: ${item.confidence}`);
      }
    }

    // Validate layer value
    if (item.layer !== 'supply') {
      addError(dataset, item.id, 'layer', `Expected layer "supply", got "${item.layer}"`);
    }
  }
}

function validateFabricationFacilities() {
  const dataset = 'fabricationFacilities';
  validateUniqueIds(fabricationFacilities, dataset);

  const validStatuses = ['operational', 'construction', 'planned', 'expansion'];

  for (const item of fabricationFacilities) {
    validateRequiredString(item.id, 'id', dataset, item.id);
    validateRequiredString(item.name, 'name', dataset, item.id);
    validateRequiredString(item.company, 'company', dataset, item.id);
    validateCoordinate(item.lat, item.lng, dataset, item.id);
    validateRequiredString(item.country, 'country', dataset, item.id);
    validateRequiredString(item.city, 'city', dataset, item.id);
    validateRequiredString(item.type, 'type', dataset, item.id);
    validateDateString(item.lastUpdated, 'lastUpdated', dataset, item.id);

    if (![1, 2, 3].includes(item.sourceTier)) {
      addError(dataset, item.id, 'sourceTier', `Invalid sourceTier: ${item.sourceTier}`);
    }

    if (!validStatuses.includes(item.status)) {
      addError(dataset, item.id, 'status', `Invalid status: ${item.status}`);
    }

    if (item.layer !== 'foundry') {
      addError(dataset, item.id, 'layer', `Expected layer "foundry", got "${item.layer}"`);
    }

    // Validate year if present
    if (item.yearEstablished !== undefined) {
      if (typeof item.yearEstablished !== 'number' || item.yearEstablished < 1950 || item.yearEstablished > 2035) {
        addError(dataset, item.id, 'yearEstablished', `Year out of plausible range: ${item.yearEstablished}`);
      }
    }
  }
}

function validateDataCenters() {
  const dataset = 'dataCenters';
  validateUniqueIds(dataCenters, dataset);

  const validStatuses = ['operational', 'construction', 'planned'];

  for (const item of dataCenters) {
    validateRequiredString(item.id, 'id', dataset, item.id);
    validateRequiredString(item.name, 'name', dataset, item.id);
    validateRequiredString(item.provider, 'provider', dataset, item.id);
    validateCoordinate(item.lat, item.lng, dataset, item.id);
    validateRequiredString(item.country, 'country', dataset, item.id);
    validateRequiredString(item.city, 'city', dataset, item.id);
    validateRequiredString(item.region, 'region', dataset, item.id);
    validateDateString(item.lastUpdated, 'lastUpdated', dataset, item.id);

    if (![1, 2, 3].includes(item.sourceTier)) {
      addError(dataset, item.id, 'sourceTier', `Invalid sourceTier: ${item.sourceTier}`);
    }

    if (!validStatuses.includes(item.status)) {
      addError(dataset, item.id, 'status', `Invalid status: ${item.status}`);
    }

    // Validate PUE (should be >= 1.0)
    if (item.pue !== undefined) {
      if (typeof item.pue !== 'number' || item.pue < 1.0) {
        addError(dataset, item.id, 'pue', `PUE must be >= 1.0: ${item.pue}`);
      }
    }

    // Validate power capacity
    if (item.powerCapacity !== undefined) {
      if (typeof item.powerCapacity !== 'number' || item.powerCapacity < 0) {
        addError(dataset, item.id, 'powerCapacity', `Power capacity must be non-negative: ${item.powerCapacity}`);
      }
    }
  }
}

function validateSourceReferences() {
  const dataset = 'sourceReferences';
  validateUniqueIds(sourceReferences, dataset);

  for (const item of sourceReferences) {
    validateRequiredString(item.id, 'id', dataset, item.id);
    validateRequiredString(item.name, 'name', dataset, item.id);
    validateRequiredString(item.type, 'type', dataset, item.id);
    validateDateString(item.lastUpdated, 'lastUpdated', dataset, item.id);

    if (![1, 2, 3].includes(item.tier)) {
      addError(dataset, item.id, 'tier', `Invalid tier: ${item.tier}`);
    }

    // Validate URL format if present
    if (item.url !== undefined && item.url.trim() !== '') {
      try {
        new URL(item.url);
      } catch {
        addError(dataset, item.id, 'url', `Invalid URL: ${item.url}`);
      }
    }
  }
}

function validateFacilitiesData() {
  const dataset = 'facilitiesData';
  validateUniqueIds(facilitiesData, dataset);

  for (const item of facilitiesData) {
    validateRequiredString(String(item.id), 'id', dataset, item.id);
    validateRequiredString(item.name, 'name', dataset, item.id);
    validateRequiredString(item.provider, 'provider', dataset, item.id);
    validateRequiredString(item.country, 'country', dataset, item.id);
    validateRequiredString(item.region, 'region', dataset, item.id);

    if (typeof item.powerMW !== 'number' || item.powerMW < 0) {
      addError(dataset, item.id, 'powerMW', `powerMW must be non-negative: ${item.powerMW}`);
    }

    if (typeof item.pue !== 'number' || item.pue < 1.0) {
      addError(dataset, item.id, 'pue', `PUE must be >= 1.0: ${item.pue}`);
    }
  }
}

function validateSupplyChainTableData() {
  const dataset = 'supplyChainTableData';
  validateUniqueIds(supplyChainTableData, dataset);

  const validTypes = ['rare-earth', 'lithography', 'design', 'energy'];

  for (const item of supplyChainTableData) {
    validateRequiredString(String(item.id), 'id', dataset, item.id);
    validateRequiredString(item.name, 'name', dataset, item.id);
    validateRequiredString(item.country, 'country', dataset, item.id);
    validateRequiredString(item.keyMetric, 'keyMetric', dataset, item.id);
    validateRequiredString(item.value, 'value', dataset, item.id);
    validateRequiredString(item.source, 'source', dataset, item.id);

    if (!validTypes.includes(item.type)) {
      addError(dataset, item.id, 'type', `Invalid type: ${item.type}`);
    }
  }
}

function validateSourcesTableData() {
  const dataset = 'sourcesTableData';
  validateUniqueIds(sourcesTableData, dataset);

  const validStatuses = ['active', 'pending', 'stale'];

  for (const item of sourcesTableData) {
    validateRequiredString(String(item.id), 'id', dataset, item.id);
    validateRequiredString(item.name, 'name', dataset, item.id);
    validateRequiredString(item.category, 'category', dataset, item.id);
    validateRequiredString(item.tier, 'tier', dataset, item.id);
    validateRequiredString(item.layer, 'layer', dataset, item.id);
    validateRequiredString(item.lastUpdated, 'lastUpdated', dataset, item.id);

    if (typeof item.dataPoints !== 'number' || item.dataPoints < 0) {
      addError(dataset, item.id, 'dataPoints', `dataPoints must be non-negative: ${item.dataPoints}`);
    }

    if (!validStatuses.includes(item.status)) {
      addError(dataset, item.id, 'status', `Invalid status: ${item.status}`);
    }

    if (item.url !== undefined && item.url.trim() !== '') {
      try {
        new URL(item.url);
      } catch {
        addError(dataset, item.id, 'url', `Invalid URL: ${item.url}`);
      }
    }
  }
}

function validateLayers() {
  const dataset = 'layers';
  const validTypes = ['supply', 'foundry', 'datacenter'];

  for (const item of layers) {
    if (!validTypes.includes(item.type)) {
      addError(dataset, item.type, 'type', `Invalid layer type: ${item.type}`);
    }
    validateRequiredString(item.title, 'title', dataset, item.type);
    validateRequiredString(item.route, 'route', dataset, item.type);
    validateRequiredString(item.accentColor, 'accentColor', dataset, item.type);

    // Validate hex color
    if (item.accentColor && !/^#[0-9A-Fa-f]{6}$/.test(item.accentColor)) {
      addError(dataset, item.type, 'accentColor', `Invalid hex color: ${item.accentColor}`);
    }
  }
}

function validateKPIs() {
  const dataset = 'kpis';
  validateUniqueIds(kpis, dataset);

  const validDeltaTypes = ['positive', 'negative', 'neutral'];

  for (const item of kpis) {
    validateRequiredString(item.id, 'id', dataset, item.id);
    validateRequiredString(item.label, 'label', dataset, item.id);
    validateRequiredNumber(item.value, 'value', dataset, item.id);
    validateRequiredString(item.unit, 'unit', dataset, item.id);
    validateRequiredString(item.accentColor, 'accentColor', dataset, item.id);

    if (!validDeltaTypes.includes(item.deltaType)) {
      addError(dataset, item.id, 'deltaType', `Invalid deltaType: ${item.deltaType}`);
    }

    if (item.progressPercent < 0 || item.progressPercent > 100) {
      addError(dataset, item.id, 'progressPercent', `progressPercent must be 0-100: ${item.progressPercent}`);
    }
  }
}

function validateCompanies() {
  const dataset = 'companies';
  validateUniqueIds(companies, dataset);

  for (const item of companies) {
    validateRequiredString(item.id, 'id', dataset, item.id);
    validateRequiredString(item.name, 'name', dataset, item.id);
    validateRequiredString(item.country, 'country', dataset, item.id);

    if (item.marketShare !== undefined) {
      if (typeof item.marketShare !== 'number' || item.marketShare < 0 || item.marketShare > 100) {
        addError(dataset, item.id, 'marketShare', `marketShare must be 0-100: ${item.marketShare}`);
      }
    }
  }
}

// ── Run All Validators ───────────────────────────────────────────────

console.log('🔍 AI Compute Map — Data Validation Report');
console.log('═'.repeat(60));

validateSupplyChainData();
validateFabricationFacilities();
validateDataCenters();
validateSourceReferences();
validateFacilitiesData();
validateSupplyChainTableData();
validateSourcesTableData();
validateLayers();
validateKPIs();
validateCompanies();

// ── Build Report ─────────────────────────────────────────────────────

const datasetSummary: Record<string, { count: number; errors: number }> = {
  supplyChainData: { count: supplyChainData.length, errors: 0 },
  fabricationFacilities: { count: fabricationFacilities.length, errors: 0 },
  dataCenters: { count: dataCenters.length, errors: 0 },
  sourceReferences: { count: sourceReferences.length, errors: 0 },
  facilitiesData: { count: facilitiesData.length, errors: 0 },
  supplyChainTableData: { count: supplyChainTableData.length, errors: 0 },
  sourcesTableData: { count: sourcesTableData.length, errors: 0 },
  layers: { count: layers.length, errors: 0 },
  kpis: { count: kpis.length, errors: 0 },
  companies: { count: companies.length, errors: 0 },
};

for (const err of errors) {
  if (datasetSummary[err.dataset]) {
    datasetSummary[err.dataset].errors++;
  }
}

const totalRecords = Object.values(datasetSummary).reduce((sum, d) => sum + d.count, 0);

// ── Print Report ─────────────────────────────────────────────────────

console.log('');
console.log('📊 Dataset Summary:');
console.log('─'.repeat(60));
for (const [name, data] of Object.entries(datasetSummary)) {
  const status = data.errors === 0 ? '✅' : '❌';
  console.log(`  ${status} ${name.padEnd(28)} ${data.count.toString().padStart(4)} records, ${data.errors} errors`);
}

console.log('');
console.log(`  Total records: ${totalRecords}`);
console.log(`  Total errors:  ${errors.length}`);

if (errors.length > 0) {
  console.log('');
  console.log('❌ Errors:');
  console.log('─'.repeat(60));
  for (const err of errors) {
    console.log(`  [${err.dataset}] id=${err.id} → ${err.field}: ${err.message}`);
  }
  console.log('');
  process.exit(1);
} else {
  console.log('');
  console.log('✅ All data validation checks passed!');
  console.log('');
  process.exit(0);
}
