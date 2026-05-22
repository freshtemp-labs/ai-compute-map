import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.resolve(__dirname, '../i18n/locales');

// Helper: recursively collect all leaf keys from a nested object
function getLeafKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...getLeafKeys(v as Record<string, unknown>, full));
    } else {
      keys.push(full);
    }
  }
  return keys.sort();
}

// ── Tests ────────────────────────────────────────────────
function findEmptyValues(obj: Record<string, unknown>, prefix = ''): string[] {
  const empty: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      empty.push(...findEmptyValues(v as Record<string, unknown>, full));
    } else if (typeof v === 'string' && v.trim() === '') {
      empty.push(full);
    }
  }
  return empty;
}

const languages = fs.readdirSync(LOCALES_DIR).filter((f) =>
  fs.statSync(path.join(LOCALES_DIR, f)).isDirectory(),
);

const namespaces = fs
  .readdirSync(path.join(LOCALES_DIR, 'zh'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace('.json', ''));

// ── Key consistency between zh and en ────────────────────────────

describe('i18n: all languages key parity (vs zh reference)', () => {
  for (const ns of namespaces) {
    it(`${ns}.json: all languages have the same keys as zh`, () => {
      const zhData = JSON.parse(
        fs.readFileSync(path.join(LOCALES_DIR, 'zh', `${ns}.json`), 'utf-8'),
      );
      const zhKeys = getLeafKeys(zhData);

      for (const lang of languages.filter((l) => l !== 'zh')) {
        const langData = JSON.parse(
          fs.readFileSync(path.join(LOCALES_DIR, lang, `${ns}.json`), 'utf-8'),
        );
        const langKeys = getLeafKeys(langData);

        const missingInLang = zhKeys.filter((k) => !langKeys.includes(k));
        const missingInZh = langKeys.filter((k) => !zhKeys.includes(k));

        if (missingInLang.length > 0) {
          throw new Error(`Keys in zh but missing in ${lang}: ${missingInLang.join(', ')}`);
        }
        if (missingInZh.length > 0) {
          throw new Error(`Keys in ${lang} but missing in zh: ${missingInZh.join(', ')}`);
        }
        expect(zhKeys).toEqual(langKeys);
      }
    });
  }
});

// ── No empty values ──────────────────────────────────────────────

describe('i18n: no empty values', () => {
  for (const lang of languages) {
    for (const ns of namespaces) {
      it(`${lang}/${ns}.json should have no empty string values`, () => {
        const data = JSON.parse(
          fs.readFileSync(path.join(LOCALES_DIR, lang, `${ns}.json`), 'utf-8'),
        );
        const empties = findEmptyValues(data);
        expect(empties).toEqual([]);
      });
    }
  }
});

// ── All locale dirs have the same namespaces ─────────────────────

describe('i18n: all languages have the same namespace files', () => {
  const expectedNs = namespaces.slice().sort();

  for (const lang of languages) {
    it(`${lang} has all expected namespace files`, () => {
      const actualNs = fs
        .readdirSync(path.join(LOCALES_DIR, lang))
        .filter((f) => f.endsWith('.json'))
        .map((f) => f.replace('.json', ''))
        .sort();
      expect(actualNs).toEqual(expectedNs);
    });
  }
});
