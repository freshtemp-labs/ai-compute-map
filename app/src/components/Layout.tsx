/**
 * @file Layout.tsx
 * @description Root layout component that wraps all pages with a consistent
 * Navbar, Footer, and animated page transitions. Uses Framer Motion for
 * smooth enter/exit animations between routes.
 *
 * @dependencies react-router-dom, framer-motion, Navbar, Footer
 */
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import SkipToContent from './SkipToContent';
import OfflineBanner from './OfflineBanner';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg-base">
      <OfflineBanner />
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="flex-1 pt-14" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            {...pageTransition}
            className="min-h-[calc(100dvh-3.5rem)]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
