/**
 * @file SettingsPage.tsx
 * @description User preferences page with settings for default zoom,
 * active layers, language, and theme. Uses localStorage for persistence.
 * Includes data cache status and performance monitoring display.
 *
 * @dependencies react-i18next, @/context/SettingsContext, lucide-react
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Settings, RotateCcw, Globe, Layers, Monitor, ZoomIn, Database, Activity, Trash2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import type { LayerType } from '@/types';
import { LAYER_COLORS } from '@/constants/layerColors';
import { getCacheStats, clearAllCache, formatBytes, formatAge, type CacheStats } from '@/utils/dataCache';
import { getPerformanceStats, clearMetrics, formatDuration, type PerformanceStats } from '@/utils/performanceMonitor';
import DataQualityDashboard from '@/components/data-quality/DataQualityDashboard';

const LAYER_LABELS: Record<LayerType, { zh: string; en: string }> = {
  supply: { zh: '供应链层', en: 'Supply Chain' },
  foundry: { zh: '封装工厂层', en: 'Foundries' },
  datacenter: { zh: '算力中心层', en: 'Data Centers' },
};

const LANGUAGES = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { t, i18n } = useTranslation(['common', 'settings']);

  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [perfStats, setPerfStats] = useState<PerformanceStats | null>(null);

  const refreshCacheStats = useCallback(() => {
    setCacheStats(getCacheStats());
  }, []);

  const refreshPerfStats = useCallback(() => {
    setPerfStats(getPerformanceStats());
  }, []);

  useEffect(() => {
    refreshCacheStats();
    refreshPerfStats();
  }, [refreshCacheStats, refreshPerfStats]);

  const handleClearCache = () => {
    clearAllCache();
    refreshCacheStats();
  };

  const handleClearMetrics = () => {
    clearMetrics();
    refreshPerfStats();
  };

  const handleLanguageChange = (lang: string) => {
    updateSettings({ language: lang });
    i18n.changeLanguage(lang);
  };

  const handleLayerToggle = (layer: LayerType) => {
    updateSettings({
      defaultLayers: {
        ...settings.defaultLayers,
        [layer]: !settings.defaultLayers[layer],
      },
    });
  };

  return (
    <div className="min-h-screen">
      <header className="pt-28 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">{t('common:breadcrumb.home')}</Link>
            <span>/</span>
            <span className="text-text-secondary">{t('settings:breadcrumb')}</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-accent-cyan" size={28} />
            <h1 className="text-title text-text-primary">{t('settings:pageTitle')}</h1>
          </div>
          <p className="text-body text-text-secondary mt-2">
            {t('settings:pageSubtitle')}
          </p>
        </div>
      </header>

      <main className="px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Default Zoom Level */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center gap-3 mb-4">
              <ZoomIn size={18} className="text-accent-cyan" />
              <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.zoom')}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('settings:sections.zoomDesc')}
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={settings.defaultZoom}
                onChange={(e) => updateSettings({ defaultZoom: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-[#1E1E28] rounded-lg appearance-none cursor-pointer accent-[#00D4FF]"
              />
              <span className="text-mono-lg text-accent-cyan min-w-[2.5rem] text-center">
                {settings.defaultZoom}
              </span>
            </div>
          </section>

          {/* Default Visible Layers */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center gap-3 mb-4">
              <Layers size={18} className="text-accent-cyan" />
              <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.layers')}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('settings:sections.layersDesc')}
            </p>
            <div className="space-y-3">
              {(Object.keys(settings.defaultLayers) as LayerType[]).map((layer) => (
                <button
                  key={layer}
                  onClick={() => handleLayerToggle(layer)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    settings.defaultLayers[layer]
                      ? 'border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.04)]'
                      : 'border-[#1E1E28] bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: LAYER_COLORS[layer] }}
                    />
                    <span className="text-sm text-text-primary">
                      {i18n.language === 'zh' ? LAYER_LABELS[layer].zh : LAYER_LABELS[layer].en}
                    </span>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
                    settings.defaultLayers[layer] ? 'bg-accent-cyan/30' : 'bg-[#1E1E28]'
                  }`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                      settings.defaultLayers[layer]
                        ? 'left-5 bg-accent-cyan'
                        : 'left-0.5 bg-[#6B6B80]'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Language Preference */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center gap-3 mb-4">
              <Globe size={18} className="text-accent-cyan" />
              <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.language')}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('settings:sections.languageDesc')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-4 py-3 rounded-lg border text-sm transition-all duration-200 cursor-pointer ${
                    settings.language === lang.code
                      ? 'border-accent-cyan bg-[rgba(0,212,255,0.08)] text-accent-cyan'
                      : 'border-[#1E1E28] text-text-secondary hover:border-[#2A2A3A] hover:text-text-primary'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </section>

          {/* Theme */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center gap-3 mb-4">
              <Monitor size={18} className="text-accent-cyan" />
              <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.theme')}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('settings:sections.themeDesc')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'dark' as const, label: t('settings:theme.dark'), icon: '🌙' },
                { value: 'light' as const, label: t('settings:theme.light'), icon: '☀️' },
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => updateSettings({ theme: theme.value })}
                  className={`px-4 py-3 rounded-lg border text-sm transition-all duration-200 cursor-pointer ${
                    settings.theme === theme.value
                      ? 'border-accent-cyan bg-[rgba(0,212,255,0.08)] text-accent-cyan'
                      : 'border-[#1E1E28] text-text-secondary hover:border-[#2A2A3A] hover:text-text-primary'
                  }`}
                >
                  <span className="mr-2">{theme.icon}</span>
                  {theme.label}
                </button>
              ))}
            </div>
          </section>

          {/* Data Cache Status */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-accent-cyan" />
                <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.cache')}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshCacheStats}
                  className="p-2 rounded-lg border border-[#1E1E28] text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-200 cursor-pointer"
                  title="刷新缓存状态"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={handleClearCache}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F87171]/30 text-[#F87171] hover:bg-[#F87171]/10 transition-all duration-200 cursor-pointer text-sm"
                >
                  <Trash2 size={14} />
                  {t('settings:actions.clearCache')}
                </button>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('settings:sections.cacheDesc')}
            </p>
            {cacheStats && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                  <div className="text-lg font-bold text-accent-cyan">{cacheStats.totalEntries}</div>
                  <div className="text-xs text-text-muted mt-1">{t('settings:cache.entries')}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                  <div className="text-lg font-bold text-accent-cyan">{formatBytes(cacheStats.totalSize)}</div>
                  <div className="text-xs text-text-muted mt-1">{t('settings:cache.size')}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                  <div className="text-lg font-bold text-accent-cyan">{(cacheStats.hitRate * 100).toFixed(0)}%</div>
                  <div className="text-xs text-text-muted mt-1">{t('settings:cache.hitRate')}</div>
                </div>
              </div>
            )}
            {cacheStats && cacheStats.entries.length > 0 && (
              <div className="mt-4 space-y-2">
                {cacheStats.entries.map((entry) => (
                  <div key={entry.key} className="flex items-center justify-between text-xs text-text-secondary px-3 py-2 rounded bg-[#1E1E28]/50">
                    <span className="truncate mr-2">{entry.key}</span>
                    <span className="flex items-center gap-3 shrink-0">
                      <span>{formatBytes(entry.size)}</span>
                      <span className="text-text-muted">{formatAge(entry.age)} / {formatAge(entry.ttl)}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Performance Monitoring */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-accent-cyan" />
                <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.performance')}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshPerfStats}
                  className="p-2 rounded-lg border border-[#1E1E28] text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-200 cursor-pointer"
                  title="刷新性能数据"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={handleClearMetrics}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F87171]/30 text-[#F87171] hover:bg-[#F87171]/10 transition-all duration-200 cursor-pointer text-sm"
                >
                  <Trash2 size={14} />
                  {t('settings:actions.clearMetrics')}
                </button>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('settings:sections.performanceDesc')}
            </p>
            {perfStats && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                    <div className="text-lg font-bold text-accent-cyan">{formatDuration(perfStats.pageLoadTime)}</div>
                    <div className="text-xs text-text-muted mt-1">{t('settings:performance.pageLoad')}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                    <div className="text-lg font-bold text-accent-cyan">{formatDuration(perfStats.domContentLoaded)}</div>
                    <div className="text-xs text-text-muted mt-1">{t('settings:performance.domLoaded')}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                    <div className="text-lg font-bold text-accent-cyan">{formatDuration(perfStats.firstContentfulPaint)}</div>
                    <div className="text-xs text-text-muted mt-1">{t('settings:performance.fcp')}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                    <div className="text-lg font-bold text-accent-cyan">{formatDuration(perfStats.largestContentfulPaint)}</div>
                    <div className="text-xs text-text-muted mt-1">{t('settings:performance.lcp')}</div>
                  </div>
                </div>
                {perfStats.customMetrics.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-text-muted font-medium mb-1">{t('settings:performance.customMetrics')}</div>
                    {perfStats.customMetrics.slice(-10).reverse().map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-text-secondary px-3 py-2 rounded bg-[#1E1E28]/50">
                        <span className="truncate mr-2">{metric.name}</span>
                        <span className="flex items-center gap-3 shrink-0">
                          <span className="text-accent-cyan font-mono">{formatDuration(metric.duration)}</span>
                          <span className="text-text-muted">{new Date(metric.timestamp).toLocaleTimeString()}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          {/* Data Quality Monitoring */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={18} className="text-accent-cyan" />
              <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.dataQuality')}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('settings:sections.dataQualityDesc')}
            </p>
            <DataQualityDashboard />
          </section>

          {/* Reset */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.reset')}</h2>
                <p className="text-sm text-text-secondary mt-1">
                  {t('settings:sections.resetDesc')}
                </p>
              </div>
              <button
                onClick={resetSettings}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#F87171]/30 text-[#F87171] hover:bg-[#F87171]/10 transition-all duration-200 cursor-pointer text-sm"
              >
                <RotateCcw size={14} />
                {t('settings:actions.reset')}
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
