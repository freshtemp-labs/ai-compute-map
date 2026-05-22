import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HistoryPage() {
  const { t } = useTranslation(['history', 'common']);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">{t('common:breadcrumb.home')}</Link>
            <span>/</span>
            <span className="text-text-secondary">{t('history:pageTitle')}</span>
          </nav>

          <h1 className="text-title text-text-primary">{t('history:pageTitle')}</h1>
          <p className="text-body text-text-secondary mt-3 max-w-2xl">
            {t('history:pageSubtitle')}
          </p>
        </div>
      </header>

      {/* Coming Soon */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[rgba(0,229,176,0.06)] border border-accent-cyan/20 mb-8">
            <svg className="w-10 h-10 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">{t('history:comingSoon')}</h2>
          <p className="text-body text-text-secondary max-w-lg mx-auto">
            The history module is under development. Soon you will be able to browse historical snapshots,
            compare time periods, and export bulk historical data.
          </p>
        </div>
      </section>
    </div>
  );
}
