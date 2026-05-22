/**
 * @file Navbar.tsx
 * @description Top navigation bar with responsive design, language switcher
 * (zh/en/ja/ko), data freshness status banner, compare badge counter,
 * and mobile hamburger menu. Includes data staleness detection logic.
 *
 * @dependencies react-router-dom, framer-motion, react-i18next, lucide-react,
 *               @/context/CompareContext
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Menu, X, GitCompareArrows, CheckCircle, AlertTriangle, Settings } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';

const languages = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Parse a quarter string like "2024-Q4" into { year, quarter } */
function parseQuarter(qStr: string): { year: number; quarter: number } | null {
  const match = qStr.match(/(\d{4})-Q(\d)/);
  if (!match) return null;
  return { year: parseInt(match[1]), quarter: parseInt(match[2]) };
}

/** Check if the data quarter is "fresh" (within 1 quarter of the current date) */
function isDataFresh(lastUpdateStr: string): boolean {
  const parsed = parseQuarter(lastUpdateStr);
  if (!parsed) return true; // can't parse → assume fresh
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
  const dataMonths = parsed.year * 12 + (parsed.quarter - 1) * 3;
  const currentMonths = currentYear * 12 + (currentQuarter - 1) * 3;
  // Fresh if within 3 months (same quarter) or 6 months (next quarter)
  return (currentMonths - dataMonths) <= 3;
}

export default function Navbar() {
  const location = useLocation();
  const { t, i18n } = useTranslation('common');
  const { comparePins } = useCompare();
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Compute data freshness dynamically
  const dataFresh = useMemo(() => isDataFresh(t('dataStatus.lastUpdate').replace(/.*(\d{4}-Q\d).*/, '$1')), [t]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close lang menu on outside click
  useEffect(() => {
    if (!langMenuOpen) return;
    const handleClick = () => setLangMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [langMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: t('nav.map'), path: '/map' },
    { label: t('nav.supplyChain'), path: '/supply-chain' },
    { label: t('nav.foundries'), path: '/foundries' },
    { label: t('nav.dataCenters'), path: '/datacenters' },
    { label: t('nav.compare'), path: '/compare' },
    { label: t('nav.sources'), path: '/sources' },
    { label: t('nav.history'), path: '/history' },
    { label: t('nav.news'), path: '/news' },
  ];

  const handleLangChange = useCallback((code: string) => {
    i18n.changeLanguage(code);
    setLangMenuOpen(false);
  }, [i18n]);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
        className="fixed top-0 left-0 right-0 z-50 flex flex-col"
        style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      >
        {/* Main nav bar */}
        <div
          className={`h-14 flex items-center justify-between px-4 sm:px-6 transition-all duration-200 ${
            scrolled
              ? 'bg-[rgba(10,10,15,0.95)] border-b border-border-subtle'
              : 'bg-[rgba(10,10,15,0.85)] border-b border-transparent'
          }`}
        >
          {/* Brand */}
          <Link
            to="/"
            className="font-display text-sm font-bold text-accent-cyan tracking-[0.06em] whitespace-nowrap"
          >
            {t('brand')}
          </Link>

          {/* Center Nav Links (desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 text-nav transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.path === '/compare' && <GitCompareArrows size={13} />}
                  {link.label}
                  {link.path === '/compare' && comparePins.length > 0 && (
                    <span className="text-[9px] font-mono bg-[#00D4FF] text-[#0A0A0F] rounded-full w-4 h-4 flex items-center justify-center">
                      {comparePins.length}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent-cyan rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/settings"
              className="hidden sm:flex items-center justify-center w-8 h-8 text-text-secondary hover:text-text-primary transition-colors duration-200"
              title={t('nav.settings')}
            >
              <Settings size={16} />
            </Link>
            <Link
              to="/developers"
              className="hidden sm:flex items-center px-3 py-1.5 text-nav text-text-secondary border border-border-active rounded transition-colors duration-200 hover:text-text-primary hover:border-accent-cyan"
            >
              {t('nav.developers')}
            </Link>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLangMenuOpen(!langMenuOpen);
                }}
                className="flex items-center gap-1 px-2 py-1 text-nav text-text-secondary border border-border-subtle rounded transition-colors duration-200 hover:text-text-primary hover:border-accent-cyan"
              >
                <span className="text-xs">{currentLang.label}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 py-1 w-32 bg-[rgba(20,20,30,0.98)] border border-border-subtle rounded-lg shadow-xl z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangChange(lang.code)}
                        className={`w-full text-left px-3 py-2 text-nav transition-colors duration-150 ${
                          i18n.language === lang.code
                            ? 'text-accent-cyan bg-[rgba(0,229,176,0.08)]'
                            : 'text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.04)]'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Live Status (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live-pulse opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-live-pulse" />
              </span>
              <span className="text-mono-sm text-text-muted">{t('status.live')}</span>
            </div>

            {/* Hamburger Menu Button (mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 text-text-secondary hover:text-text-primary transition-colors"
              aria-label={mobileMenuOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Data Status Banner */}
        {!bannerDismissed && (
          <div className="bg-[#111118] border-b border-[#1E1E28] px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#9A9AAF] min-w-0 overflow-hidden">
              {dataFresh ? (
                <CheckCircle size={12} className="text-[#22C55E] flex-shrink-0" />
              ) : (
                <AlertTriangle size={12} className="text-[#F59E0B] flex-shrink-0" />
              )}
              <span className="truncate">{t('dataStatus.banner')}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                dataFresh
                  ? 'bg-[#22C55E18] text-[#22C55E]'
                  : 'bg-[#F59E0B18] text-[#F59E0B]'
              }`}>
                {dataFresh ? t('dataStatus.fresh') : t('dataStatus.stale')}
              </span>
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-[#6B6B80] hover:text-[#E8E8EC] transition-colors cursor-pointer flex-shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[rgba(10,10,15,0.9)] backdrop-blur-sm" />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-14 right-0 bottom-0 w-72 bg-bg-elevated border-l border-border-subtle overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-body-md transition-colors duration-200 ${
                        isActive
                          ? 'text-accent-cyan bg-[rgba(0,212,255,0.08)] border-l-2 border-accent-cyan'
                          : 'text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.04)]'
                      }`}
                    >
                      {link.path === '/compare' && <GitCompareArrows size={14} />}
                      {link.label}
                      {link.path === '/compare' && comparePins.length > 0 && (
                        <span className="text-[9px] font-mono bg-[#00D4FF] text-[#0A0A0F] rounded-full w-4 h-4 flex items-center justify-center ml-auto">
                          {comparePins.length}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-border-subtle">
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-body-md text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                  >
                    <Settings size={14} />
                    {t('nav.settings')}
                  </Link>
                  <Link
                    to="/developers"
                    className="block px-4 py-3 rounded-lg text-body-md text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                  >
                    {t('nav.developers')}
                  </Link>
                </div>

                {/* Live Status (mobile) */}
                <div className="pt-4 mt-4 border-t border-border-subtle flex items-center gap-2 px-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live-pulse opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-live-pulse" />
                  </span>
                  <span className="text-mono-sm text-text-muted">{t('status.live')}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
