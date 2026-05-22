/**
 * @file FavoritesContext.tsx
 * @description Favorites context with localStorage persistence.
 * Users can favorite facilities and data centers for quick access.
 */
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { loadFavorites, saveFavorites, toggleFavorite as toggle } from '@/utils/favorites';

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => toggle(id, prev));
  }, []);

  const checkFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    saveFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite: checkFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
