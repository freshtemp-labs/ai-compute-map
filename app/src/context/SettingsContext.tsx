/**
 * @file SettingsContext.tsx
 * @description User preferences context with localStorage persistence.
 * Stores default map zoom, active layers, language, and theme.
 *
 * @dependencies react
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { LayerType } from '@/types';

export interface UserSettings {
  defaultZoom: number;
  defaultLayers: Record<LayerType, boolean>;
  language: string;
  theme: 'dark' | 'light';
}

const STORAGE_KEY = 'ai-compute-map-settings';

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

function saveSettings(settings: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

interface SettingsContextValue {
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);

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

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
