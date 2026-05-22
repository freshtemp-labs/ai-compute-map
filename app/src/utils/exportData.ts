/**
 * @file utils/exportData.ts
 * @description Centralized data export utility supporting CSV, JSON, and Excel formats.
 * Supports custom export scope filtering (all, by region, by layer type).
 *
 * @dependencies xlsx (SheetJS) for Excel export
 */

import * as XLSX from 'xlsx';

// ─── Types ──────────────────────────────────────────────────

export type ExportFormat = 'csv' | 'json' | 'excel';

export type ExportScope = 'all' | 'region' | 'layer';

export interface ExportOptions<T extends Record<string, unknown>> {
  /** Data array to export */
  data: T[];
  /** Output format */
  format: ExportFormat;
  /** Export scope filter */
  scope?: ExportScope;
  /** Filter value (e.g. region name or layer type) */
  scopeValue?: string;
  /** Column/field filter — only include these keys */
  fields?: (keyof T)[];
  /** Output filename (without extension) */
  filename?: string;
  /** Sheet name for Excel exports */
  sheetName?: string;
}

// ─── Scope Filtering ────────────────────────────────────────

/**
 * Filter data by export scope.
 * Supports filtering by 'region' or 'layer' fields on the data objects.
 */
export function filterByScope<T extends Record<string, unknown>>(
  data: T[],
  scope: ExportScope,
  scopeValue?: string,
): T[] {
  if (scope === 'all' || !scopeValue) return data;

  if (scope === 'region') {
    return data.filter((item) => {
      const region = (item.region ?? item.country ?? '') as string;
      return region.toLowerCase().includes(scopeValue.toLowerCase());
    });
  }

  if (scope === 'layer') {
    return data.filter((item) => {
      const layer = (item.layer ?? item.type ?? '') as string;
      return layer.toLowerCase() === scopeValue.toLowerCase();
    });
  }

  return data;
}

// ─── Column Selection ───────────────────────────────────────

/**
 * Select only specified fields from each data object.
 */
export function selectFields<T extends Record<string, unknown>>(
  data: T[],
  fields?: (keyof T)[],
): Record<string, unknown>[] {
  if (!fields || fields.length === 0) return data;
  return data.map((item) => {
    const picked: Record<string, unknown> = {};
    for (const key of fields) {
      picked[key as string] = item[key];
    }
    return picked;
  });
}

// ─── CSV Export ─────────────────────────────────────────────

/**
 * Convert data to CSV string.
 */
export function toCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        // Escape quotes and wrap in quotes if needed
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(','),
  );
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Trigger a CSV file download in the browser.
 */
export function downloadCsv(data: Record<string, unknown>[], filename: string): void {
  const csv = toCsv(data);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `${filename}.csv`);
}

// ─── JSON Export ────────────────────────────────────────────

/**
 * Trigger a JSON file download in the browser.
 */
export function downloadJson(data: Record<string, unknown>[], filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  triggerDownload(blob, `${filename}.json`);
}

// ─── Excel Export ───────────────────────────────────────────

/**
 * Trigger an Excel (.xlsx) file download in the browser.
 */
export function downloadExcel(
  data: Record<string, unknown>[],
  filename: string,
  sheetName = 'Data',
): void {
  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-fit column widths
  const colWidths = Object.keys(data[0] || {}).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...data.map((row) => String(row[key] ?? '').length),
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ─── Unified Export Function ────────────────────────────────

/**
 * Unified export function that handles scope filtering, field selection,
 * and format dispatch.
 */
export function exportData<T extends Record<string, unknown>>(
  options: ExportOptions<T>,
): void {
  const {
    data,
    format,
    scope = 'all',
    scopeValue,
    fields,
    filename = 'ai-compute-map-export',
    sheetName = 'Data',
  } = options;

  // Apply scope filter
  const filtered = filterByScope(data, scope, scopeValue);

  // Apply field selection
  const selected = selectFields(filtered, fields);

  if (selected.length === 0) {
    console.warn('Export: no data after filtering');
    return;
  }

  switch (format) {
    case 'csv':
      downloadCsv(selected, filename);
      break;
    case 'json':
      downloadJson(selected, filename);
      break;
    case 'excel':
      downloadExcel(selected, filename, sheetName);
      break;
  }
}

// ─── Helpers ────────────────────────────────────────────────

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
