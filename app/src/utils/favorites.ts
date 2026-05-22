/**
 * @file favorites.ts
 * @description Favorites management with localStorage persistence.
 * Users can favorite facilities and data centers for quick access.
 */

const STORAGE_KEY = 'ai-compute-map-favorites';

export function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

export function saveFavorites(favorites: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch { /* ignore */ }
}

export function toggleFavorite(id: string, current: string[]): string[] {
  const idx = current.indexOf(id);
  const next = idx >= 0
    ? current.filter((f) => f !== id)
    : [...current, id];
  saveFavorites(next);
  return next;
}

export function isFavorite(id: string, favorites: string[]): boolean {
  return favorites.includes(id);
}
