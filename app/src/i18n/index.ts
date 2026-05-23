/**
 * @file i18n/index.ts
 * @description i18next 国际化配置，支持 4 种语言（zh, en, ja, ko）
 * 9 个命名空间（common, home, map, supplyChain, foundries, datacenters,
 * sources, history, developers, settings）。默认语言为中文（zh）。
 *
 * @dependencies i18next, react-i18next, i18next-browser-languagedetector
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ─── 中文（默认语言）───
import zhCommon from './locales/zh/common.json';
import zhHome from './locales/zh/home.json';
import zhMap from './locales/zh/map.json';
import zhSupplyChain from './locales/zh/supplyChain.json';
import zhFoundries from './locales/zh/foundries.json';
import zhDatacenters from './locales/zh/datacenters.json';
import zhSources from './locales/zh/sources.json';
import zhHistory from './locales/zh/history.json';
import zhDevelopers from './locales/zh/developers.json';
import zhSettings from './locales/zh/settings.json';

// ─── 英文 ───
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enMap from './locales/en/map.json';
import enSupplyChain from './locales/en/supplyChain.json';
import enFoundries from './locales/en/foundries.json';
import enDatacenters from './locales/en/datacenters.json';
import enSources from './locales/en/sources.json';
import enHistory from './locales/en/history.json';
import enDevelopers from './locales/en/developers.json';
import enSettings from './locales/en/settings.json';

// ─── 日文 ───
import jaCommon from './locales/ja/common.json';
import jaHome from './locales/ja/home.json';
import jaMap from './locales/ja/map.json';
import jaSupplyChain from './locales/ja/supplyChain.json';
import jaFoundries from './locales/ja/foundries.json';
import jaDatacenters from './locales/ja/datacenters.json';
import jaSources from './locales/ja/sources.json';
import jaHistory from './locales/ja/history.json';
import jaDevelopers from './locales/ja/developers.json';
import jaSettings from './locales/ja/settings.json';

// ─── 韩文 ───
import koCommon from './locales/ko/common.json';
import koHome from './locales/ko/home.json';
import koMap from './locales/ko/map.json';
import koSupplyChain from './locales/ko/supplyChain.json';
import koFoundries from './locales/ko/foundries.json';
import koDatacenters from './locales/ko/datacenters.json';
import koSources from './locales/ko/sources.json';
import koHistory from './locales/ko/history.json';
import koDevelopers from './locales/ko/developers.json';
import koSettings from './locales/ko/settings.json';

/** i18next 资源对象，按语言和命名空间组织翻译资源 */
const resources = {
  /** 中文资源 */
  zh: {
    common: zhCommon,
    home: zhHome,
    map: zhMap,
    supplyChain: zhSupplyChain,
    foundries: zhFoundries,
    datacenters: zhDatacenters,
    sources: zhSources,
    history: zhHistory,
    developers: zhDevelopers,
    settings: zhSettings,
  },
  /** 英文资源 */
  en: {
    common: enCommon,
    home: enHome,
    map: enMap,
    supplyChain: enSupplyChain,
    foundries: enFoundries,
    datacenters: enDatacenters,
    sources: enSources,
    history: enHistory,
    developers: enDevelopers,
    settings: enSettings,
  },
  /** 日文资源 */
  ja: {
    common: jaCommon,
    home: jaHome,
    map: jaMap,
    supplyChain: jaSupplyChain,
    foundries: jaFoundries,
    datacenters: jaDatacenters,
    sources: jaSources,
    history: jaHistory,
    developers: jaDevelopers,
    settings: jaSettings,
  },
  /** 韩文资源 */
  ko: {
    common: koCommon,
    home: koHome,
    map: koMap,
    supplyChain: koSupplyChain,
    foundries: koFoundries,
    datacenters: koDatacenters,
    sources: koSources,
    history: koHistory,
    developers: koDevelopers,
    settings: koSettings,
  },
};

/** 初始化 i18next，配置语言检测和回退策略 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    /** 回退语言：中文 */
    fallbackLng: 'zh',
    /** 默认语言：中文 */
    lng: 'zh',
    /** 语言检测配置 */
    detection: {
      /** 检测顺序：先查 localStorage，再查浏览器 navigator */
      order: ['localStorage', 'navigator'],
      /** 语言缓存位置 */
      caches: ['localStorage'],
    },
    /** 插值配置 */
    interpolation: {
      /** 不转义 HTML 值（React 已处理 XSS） */
      escapeValue: false,
    },
    /** 命名空间列表 */
    ns: ['common', 'home', 'map', 'supplyChain', 'foundries', 'datacenters', 'sources', 'history', 'developers', 'settings'],
    /** 默认命名空间 */
    defaultNS: 'common',
  });

export default i18n;
