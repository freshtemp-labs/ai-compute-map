/**
 * @file Footer.tsx
 * @description Global footer component with quick links, data source links,
 * community links, and license information. Supports i18n for all text.
 *
 * @dependencies react-router-dom, react-i18next
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('common');

  const quickLinks = [
    { label: t('nav.map'), path: '/map' },
    { label: t('nav.supplyChain'), path: '/supply-chain' },
    { label: t('nav.foundries'), path: '/foundries' },
    { label: t('nav.dataCenters'), path: '/datacenters' },
  ];

  const dataSources = [
    { label: t('nav.sources'), path: '/sources' },
    { label: t('nav.history'), path: '/history' },
    { label: t('nav.news'), path: '/news' },
    { label: t('actions.viewAll'), path: '/sources' },
  ];

  return (
    <footer className="mt-24 border-t border-border-subtle bg-[rgba(10,10,15,0.5)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-accent-cyan mb-3">
              {t('brand')}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-secondary hover:text-accent-cyan transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              {t('footer.dataSources')}
            </h4>
            <ul className="space-y-2">
              {dataSources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-secondary hover:text-accent-cyan transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              {t('footer.community')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-accent-cyan transition-colors duration-200"
                >
                  {t('footer.github')}
                </a>
              </li>
              <li>
                <Link
                  to="/developers"
                  className="text-sm text-text-secondary hover:text-accent-cyan transition-colors duration-200"
                >
                  {t('footer.contributors')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-mono-sm text-text-muted">{t('footer.license')}</p>
          <p className="text-mono-sm text-text-muted">
            &copy; {new Date().getFullYear()} {t('brand')}
          </p>
        </div>
      </div>
    </footer>
  );
}
