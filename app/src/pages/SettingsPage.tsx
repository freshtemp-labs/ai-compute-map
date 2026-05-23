/**
 * @file SettingsPage.tsx
 * @description User preferences page with settings for default zoom,
 * active layers, language, and theme. Uses localStorage for persistence.
 * Includes data cache status and performance monitoring display.
 *
 * @dependencies react-i18next, @/context/SettingsContext, lucide-react
 */
// ===== 依赖导入：React、国际化、路由、图标库、上下文、工具函数 =====
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

// ===== 常量定义 =====

/** 图层类型对应的中英文标签映射 */
const LAYER_LABELS: Record<LayerType, { zh: string; en: string }> = {
  supply: { zh: '供应链层', en: 'Supply Chain' },
  foundry: { zh: '封装工厂层', en: 'Foundries' },
  datacenter: { zh: '算力中心层', en: 'Data Centers' },
};

/** 支持的语言列表 */
const LANGUAGES = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

/**
 * 用户偏好设置页面组件
 * 管理默认缩放、可见图层、语言和主题，含缓存状态和性能监控
 */
export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { t, i18n } = useTranslation(['common', 'settings']);

  // ===== 本地状态：缓存和性能统计数据 =====

  /** 本地状态：缓存统计信息，通过 getCacheStats() 获取 */
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  /** 本地状态：性能监控统计信息，通过 getPerformanceStats() 获取 */
  const [perfStats, setPerfStats] = useState<PerformanceStats | null>(null);

  /**
   * 刷新缓存统计数据
   * 调用 dataCache 工具函数获取最新的缓存条目数量、大小和命中率
   */
  const refreshCacheStats = useCallback(() => {
    setCacheStats(getCacheStats());
  }, []);

  /**
   * 刷新性能监控数据
   * 调用 performanceMonitor 工具函数获取页面加载、FCP、LCP 等指标
   */
  const refreshPerfStats = useCallback(() => {
    setPerfStats(getPerformanceStats());
  }, []);

  /**
   * 组件挂载时加载初始统计数据
   * 首次渲染后自动获取缓存和性能的当前状态
   */
  useEffect(() => {
    refreshCacheStats();
    refreshPerfStats();
  }, [refreshCacheStats, refreshPerfStats]);

  // ===== 事件处理函数 =====

  /** 清除缓存并刷新统计 */
  const handleClearCache = () => {
    clearAllCache();
    refreshCacheStats();
  };

  /** 清除性能指标并刷新统计 */
  const handleClearMetrics = () => {
    clearMetrics();
    refreshPerfStats();
  };

  /** 切换语言并持久化 */
  const handleLanguageChange = (lang: string) => {
    updateSettings({ language: lang });
    i18n.changeLanguage(lang);
  };

  /**
   * 切换图层的可见性
   * 反转指定图层的 defaultLayers 布尔值，保留其他图层状态不变
   */
  const handleLayerToggle = (layer: LayerType) => {
    updateSettings({
      defaultLayers: {
        ...settings.defaultLayers,
        [layer]: !settings.defaultLayers[layer],
      },
    });
  };

  /**
   * 渲染：页面布局从上到下依次为 — 面包屑 → 缩放 → 图层 → 语言 → 主题 → 缓存 → 性能 → 数据质量 → 重置
   */
  return (
    <div className="min-h-screen">
      <header className="pt-28 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          {/* 面包屑导航：首页 > 设置 */}
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">{t('common:breadcrumb.home')}</Link>
            <span>/</span>
            <span className="text-text-secondary">{t('settings:breadcrumb')}</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-accent-cyan" size={28} />
            <h1 className="text-title text-text-primary">{t('settings:pageTitle')}</h1>
          </div>
          {/* 副标题：设置页面的引导说明 */}
          <p className="text-body text-text-secondary mt-2">
            {t('settings:pageSubtitle')}
          </p>
        </div>
      </header>

      <main className="px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ===== 地图设置区：缩放级别 ===== */}
          {/* Default Zoom Level */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center gap-3 mb-4">
              <ZoomIn size={18} className="text-accent-cyan" />
              <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.zoom')}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('settings:sections.zoomDesc')}
            </p>
            {/* 缩放级别滑块：范围 1-10，步长 1，实时显示当前值 */}
            <div className="flex items-center gap-4">
              {/* HTML range 输入，min=1 max=10 step=1，value 绑定 settings.defaultZoom */}
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
            {/* 图层切换列表：每个图层显示彩色圆点 + 名称 + 自定义开关 */}
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
            {/* 语言切换按钮：2x2 网格布局，当前选中语言高亮显示 */}
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
            {/* 主题切换按钮：深色/浅色两个选项，当前选中主题高亮 */}
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
          {/* ===== 数据缓存区：缓存统计与条目明细 ===== */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-accent-cyan" />
                <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.cache')}</h2>
              </div>
              <div className="flex items-center gap-2">
                {/* 刷新缓存统计按钮 */}
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
              /* 缓存统计概览：总条目数 / 总大小 / 命中率 三列卡片 */
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                  <div className="text-lg font-bold text-accent-cyan">{cacheStats.totalEntries}</div>
                  <div className="text-xs text-text-muted mt-1">{t('settings:cache.entries')}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                  <div className="text-lg font-bold text-accent-cyan">{formatBytes(cacheStats.totalSize)}</div>
                  <div className="text-xs text-text-muted mt-1">{t('settings:cache.size')}</div>
                </div>
                {/* 命中率百分比显示 */}
                <div className="p-3 rounded-lg bg-[#1E1E28] text-center">
                  <div className="text-lg font-bold text-accent-cyan">{(cacheStats.hitRate * 100).toFixed(0)}%</div>
                  <div className="text-xs text-text-muted mt-1">{t('settings:cache.hitRate')}</div>
                </div>
              </div>
            )}
            {/* 缓存条目明细列表：key / 大小 / 已存活时间 / 总 TTL */}
            {cacheStats && cacheStats.entries.length > 0 && (
              <div className="mt-4 space-y-2">
                {cacheStats.entries.map((entry) => (
                  /* 每行显示：缓存键名 | 大小 | 存活时间 / TTL */
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
          {/* ===== 性能监控区：Web 性能指标与自定义指标 ===== */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-accent-cyan" />
                <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.performance')}</h2>
              </div>
              <div className="flex items-center gap-2">
                {/* 刷新性能数据按钮 */}
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
                {/* 性能指标概览：页面加载时间 / DOM 就绪 / FCP / LCP 四列卡片 */}
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
                {/* 自定义指标列表：最近 10 条，倒序显示，包含名称、耗时、时间戳 */}
                {perfStats.customMetrics.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-text-muted font-medium mb-1">{t('settings:performance.customMetrics')}</div>
                    {perfStats.customMetrics.slice(-10).reverse().map((metric, idx) => (
                      /* 每行显示：指标名称 | 耗时 | 时间戳 */
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
          {/* ===== 数据质量区：数据完整性校验仪表盘 ===== */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={18} className="text-accent-cyan" />
              <h2 className="text-lg font-semibold text-text-primary">{t('settings:sections.dataQuality')}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {t('settings:sections.dataQualityDesc')}
            </p>
            {/* 数据质量仪表盘子组件：展示校验规则和完整性评分 */}
            <DataQualityDashboard />
          </section>

          {/* Reset */}
          {/* ===== 重置区：恢复默认设置 ===== */}
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
                {/* 重置为默认设置标签 */}
                {t('settings:actions.reset')}
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
