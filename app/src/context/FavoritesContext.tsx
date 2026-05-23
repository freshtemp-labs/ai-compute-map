/**
 * @file FavoritesContext.tsx
 * @description 收藏夹上下文，支持 localStorage 持久化。用户可收藏设施和数据中心以便快速访问。
 * @dependencies react, @/utils/favorites
 */
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { loadFavorites, saveFavorites, toggleFavorite as toggle } from '@/utils/favorites';

/** 收藏夹 Context 值类型 */
interface FavoritesContextValue {
  /** 收藏的设施/数据中心 ID 列表 */
  favorites: string[];
  /** 切换指定 ID 的收藏状态（添加/移除） */
  toggleFavorite: (id: string) => void;
  /** 判断指定 ID 是否已收藏 */
  isFavorite: (id: string) => boolean;
  /** 清空所有收藏 */
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * 收藏夹 Context Provider 组件
 * 提供收藏列表的状态管理及 localStorage 自动同步
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  /** 当收藏列表变化时自动持久化到 localStorage */
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

/**
 * 使用收藏夹功能的 Hook
 * 必须在 FavoritesProvider 内部使用，否则抛出异常
 */
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
