/**
 * @file i18n/index.ts
 * @description i18next configuration supporting 4 languages (zh, en, ja, ko)
 * with 9 namespaces (common, home, map, supplyChain, foundries, datacenters,
 * sources, history, developers). Default language is Chinese (zh).
 *
 * @dependencies i18next, react-i18next, i18next-browser-languagedetector
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Chinese (default)
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

// English
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

// Japanese
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

// Korean
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

const resources = {
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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    lng: 'zh',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'home', 'map', 'supplyChain', 'foundries', 'datacenters', 'sources', 'history', 'developers', 'settings'],
    defaultNS: 'common',
  });

export default i18n;
