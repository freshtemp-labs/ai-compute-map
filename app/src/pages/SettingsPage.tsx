/**
 * @file SettingsPage.tsx
 * @description User preferences page with settings for default zoom,
 * active layers, language, and theme. Uses localStorage for persistence.
 *
 * @dependencies react-i18next, @/context/SettingsContext, lucide-react
 */
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Settings, RotateCcw, Globe, Layers, Monitor, ZoomIn } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import type { LayerType } from '@/types';
import { LAYER_COLORS } from '@/constants/layerColors';

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
  const { t, i18n } = useTranslation(['common']);

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
            <span className="text-text-secondary">设置</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-accent-cyan" size={28} />
            <h1 className="text-title text-text-primary">用户偏好设置</h1>
          </div>
          <p className="text-body text-text-secondary mt-2">
            配置地图默认视图、图层显示和界面偏好。设置将自动保存到本地浏览器。
          </p>
        </div>
      </header>

      <main className="px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Default Zoom Level */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center gap-3 mb-4">
              <ZoomIn size={18} className="text-accent-cyan" />
              <h2 className="text-lg font-semibold text-text-primary">默认地图缩放级别</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              设置地图页面加载时的默认缩放级别（1-10）
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
              <h2 className="text-lg font-semibold text-text-primary">默认显示图层</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              选择地图加载时默认显示的图层
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
              <h2 className="text-lg font-semibold text-text-primary">语言偏好</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              选择界面显示语言
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
              <h2 className="text-lg font-semibold text-text-primary">主题模式</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              选择界面颜色主题
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'dark' as const, label: '深色模式', icon: '🌙' },
                { value: 'light' as const, label: '浅色模式', icon: '☀️' },
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

          {/* Reset */}
          <section className="p-6 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">重置设置</h2>
                <p className="text-sm text-text-secondary mt-1">
                  将所有设置恢复为默认值
                </p>
              </div>
              <button
                onClick={resetSettings}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#F87171]/30 text-[#F87171] hover:bg-[#F87171]/10 transition-all duration-200 cursor-pointer text-sm"
              >
                <RotateCcw size={14} />
                重置
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
