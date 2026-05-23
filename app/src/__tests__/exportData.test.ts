import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import {
  toCsv,
  filterByScope,
  selectFields,
  exportData,
} from '@/utils/exportData';

// Mock XLSX module
vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({ '!cols': [] })),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

// Provide URL.createObjectURL / revokeObjectURL if missing (jsdom)
beforeAll(() => {
  if (!URL.createObjectURL) {
    URL.createObjectURL = vi.fn(() => 'blob:mock');
  }
  if (!URL.revokeObjectURL) {
    URL.revokeObjectURL = vi.fn();
  }
});

const sampleData = [
  { name: 'Facility A', region: 'North America', layer: 'datacenter', power: 100 },
  { name: 'Facility B', region: 'Europe', layer: 'datacenter', power: 200 },
  { name: 'Facility C', region: 'China', layer: 'foundry', power: 150 },
  { name: 'Facility D', region: 'North America', layer: 'supply', power: 50 },
];

describe('toCsv', () => {
  it('converts data to CSV with headers', () => {
    const csv = toCsv(sampleData);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('name,region,layer,power');
    expect(lines.length).toBe(5);
  });

  it('handles empty array', () => {
    expect(toCsv([])).toBe('');
  });

  it('escapes values with commas', () => {
    const data = [{ name: 'A, B', value: 1 }];
    const csv = toCsv(data);
    expect(csv).toContain('"A, B"');
  });

  it('escapes values with quotes', () => {
    const data = [{ name: 'Say "hello"', value: 1 }];
    const csv = toCsv(data);
    expect(csv).toContain('"Say ""hello"""');
  });

  it('handles null and undefined values', () => {
    const data = [{ name: 'Test', value: null, other: undefined }];
    const csv = toCsv(data);
    const lines = csv.split('\n');
    expect(lines[1]).toBe('Test,,');
  });
});

describe('filterByScope', () => {
  it('returns all data when scope is "all"', () => {
    expect(filterByScope(sampleData, 'all')).toEqual(sampleData);
  });

  it('returns all data when scopeValue is undefined', () => {
    expect(filterByScope(sampleData, 'region')).toEqual(sampleData);
  });

  it('filters by region (partial match)', () => {
    const result = filterByScope(sampleData, 'region', 'north');
    expect(result).toHaveLength(2);
    expect(result.every((d) => d.region.toLowerCase().includes('north'))).toBe(true);
  });

  it('filters by layer (exact match)', () => {
    const result = filterByScope(sampleData, 'layer', 'datacenter');
    expect(result).toHaveLength(2);
  });

  it('returns empty when no match', () => {
    const result = filterByScope(sampleData, 'region', 'Antarctica');
    expect(result).toHaveLength(0);
  });
});

describe('selectFields', () => {
  it('returns all fields when no fields specified', () => {
    const result = selectFields(sampleData);
    expect(result).toEqual(sampleData);
  });

  it('returns only specified fields', () => {
    const result = selectFields(sampleData, ['name', 'power']);
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ name: 'Facility A', power: 100 });
    expect(result[0]).not.toHaveProperty('region');
  });

  it('handles empty fields array', () => {
    const result = selectFields(sampleData, []);
    expect(result).toEqual(sampleData);
  });
});

describe('exportData', () => {
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clickSpy = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      return {
        href: '',
        download: '',
        click: clickSpy,
      } as unknown as HTMLElement;
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as unknown as Node);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as unknown as Node);
  });

  it('exports CSV with scope filtering', () => {
    exportData({
      data: sampleData,
      format: 'csv',
      scope: 'region',
      scopeValue: 'Europe',
      filename: 'test',
    });
    expect(clickSpy).toHaveBeenCalled();
  });

  it('exports JSON with field selection', () => {
    exportData({
      data: sampleData,
      format: 'json',
      fields: ['name', 'power'],
      filename: 'test',
    });
    expect(clickSpy).toHaveBeenCalled();
  });

  it('does not trigger download when filtered data is empty', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    exportData({
      data: sampleData,
      format: 'csv',
      scope: 'region',
      scopeValue: 'NonExistent',
      filename: 'test',
    });
    expect(clickSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Export: no data after filtering');
    consoleSpy.mockRestore();
  });

  it('exports Excel format', async () => {
    const XLSX = await import('xlsx');
    exportData({
      data: sampleData,
      format: 'excel',
      filename: 'test',
      sheetName: 'TestSheet',
    });
    expect(XLSX.writeFile).toHaveBeenCalled();
  });
});
