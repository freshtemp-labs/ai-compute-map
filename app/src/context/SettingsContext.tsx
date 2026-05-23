/**
 * @file SettingsContext.tsx
 * @description 用户偏好设置上下文，支持 localStorage 持久化。
 * 存储默认地图缩放级别、活动图层、语言和主题。
 *
 * @dependencies react, @/types
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { LayerType } from '@/types';

/** 用户设置类型 */
export interface UserSettings {
  /** 默认地图缩放级别 */
  defaultZoom: number;
  /** 各图层默认显示开关 */
  defaultLayers: Record<LayerType, boolean>;
  /** 界面语言 */
  language: string;
  /** 界面主题（深色/浅色） */
  theme: 'dark' | 'light';
}

/** localStorage 存储键名 */
const STORAGE_KEY = 'ai-compute-map-settings';

/** 用户默认设置 */
const defaultSettings: UserSettings = {
  defaultZoom: 3,
  defaultLayers: {
    supply: true,
    foundry: true,
    datacenter: true,
  },
  language: 'zh',
  theme: 'dark',
};

/**
 * 从 localStorage 加载用户设置
 * 若读取失败或不存在则返回默认设置
 */
function loadSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultSettings;
}

/** 将用户设置保存到 localStorage */
function saveSettings(settings: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

/** 设置 Context 值类型 */
interface SettingsContextValue {
  /** 当前用户设置 */
  settings: UserSettings;
  /** 部分更新设置（浅合并） */
  updateSettings: (patch: Partial<UserSettings>) => void;
  /** 重置为默认设置 */
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

/**
 * 设置 Context Provider 组件
 * 管理用户偏好设置，变更自动同步 localStorage
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);

  /** 设置变更时自动保存到 localStorage */
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * 使用设置功能的 Hook
 * 必须在 SettingsProvider 内部使用，否则抛出异常
 */
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
