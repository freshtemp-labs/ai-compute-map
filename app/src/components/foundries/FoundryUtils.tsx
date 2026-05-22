import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: easeOutExpo },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: easeOutExpo } },
};

/* ── Count-up hook ── */
function useCountUp(end: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView || triggered.current) return;
    triggered.current = true;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return { ref, value };
}

/* ── StatusBadge ── */
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: 'border-success text-success',
    New: 'border-accent-cyan text-accent-cyan',
    Building: 'border-warning text-warning',
    Planned: 'border-text-muted text-text-muted',
    'Risk production 2025': 'border-warning text-warning',
    'Mass production': 'border-success text-success',
    Mature: 'border-info text-info',
    Stable: 'border-info text-info',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-mono-sm ${styles[status] || 'border-text-muted text-text-muted'}`}>
      {status === 'Active' && <CheckCircle2 size={10} />}
      {status === 'Building' && <Clock size={10} />}
      {status === 'Planned' && <AlertCircle size={10} />}
      {status}
    </span>
  );
}

/* ── KPI Stat ── */
export function KpiStat({ label, value, prefix = '', suffix = '', index }: { label: string; value: number; prefix?: string; suffix?: string; index: number }) {
  const { ref, value: animated } = useCountUp(value);
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center"
      ref={ref}
    >
      <div className="text-data-md text-accent-cyan font-mono">
        {prefix}{animated.toLocaleString()}{suffix}
      </div>
      <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em] mt-1">{label}</div>
    </motion.div>
  );
}

/* ── Section Label ── */
export function SectionLabel({ text }: { text: string }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-center gap-2 mb-4"
    >
      <span className="w-2 h-2 rounded-full bg-accent-cyan" />
      <span className="text-mono-sm text-accent-cyan tracking-[0.04em] uppercase">{text}</span>
    </motion.div>
  );
}

/* ── Inline PieChartIcon (to avoid tree-shake issues) ── */
export function PieChartIcon({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

export { easeOutExpo, fadeUp, fadeIn };
