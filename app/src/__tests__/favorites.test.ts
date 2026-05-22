import { describe, it, expect, beforeEach } from 'vitest';
import { loadFavorites, saveFavorites, toggleFavorite, isFavorite } from '@/utils/favorites';

beforeEach(() => {
  localStorage.clear();
});

describe('favorites utilities', () => {
  it('loadFavorites returns empty array when nothing stored', () => {
    expect(loadFavorites()).toEqual([]);
  });

  it('saveFavorites and loadFavorites round-trip', () => {
    saveFavorites(['dc-1', 'dc-5']);
    expect(loadFavorites()).toEqual(['dc-1', 'dc-5']);
  });

  it('toggleFavorite adds when not present', () => {
    const result = toggleFavorite('dc-3', []);
    expect(result).toEqual(['dc-3']);
  });

  it('toggleFavorite removes when present', () => {
    const result = toggleFavorite('dc-3', ['dc-1', 'dc-3', 'dc-5']);
    expect(result).toEqual(['dc-1', 'dc-5']);
  });

  it('isFavorite returns true for favorited items', () => {
    expect(isFavorite('dc-1', ['dc-1', 'dc-2'])).toBe(true);
  });

  it('isFavorite returns false for non-favorited items', () => {
    expect(isFavorite('dc-3', ['dc-1', 'dc-2'])).toBe(false);
  });
});
