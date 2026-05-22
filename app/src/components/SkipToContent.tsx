/**
 * @file SkipToContent.tsx
 * @description Skip-to-content link for keyboard/screen-reader accessibility.
 * Appears on focus (Tab key) and jumps to the main content area.
 * WCAG 2.1 Level A requirement (2.4.1 Bypass Blocks).
 */
import { useTranslation } from 'react-i18next';

export default function SkipToContent() {
  const { t } = useTranslation('common');

  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999]
        focus:px-4 focus:py-2 focus:bg-[#00D4FF] focus:text-[#0A0A0F] focus:font-mono
        focus:text-[13px] focus:font-bold focus:rounded-lg focus:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]
        transition-all duration-150
      "
    >
      {t('a11y.skipToContent', 'Skip to main content')}
    </a>
  );
}
