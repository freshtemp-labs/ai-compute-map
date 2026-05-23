/**
 * @file FoundryUtils.tsx
 * @description 晶圆代工页面工具组件集合。
 *   包含数字递增动画 Hook (useCountUp)、状态徽章 StatusBadge、
 *   关键指标卡片 KpiStat、章节标签 SectionLabel 和 PieChartIcon。
 * @dependencies framer-motion, lucide-react
 */
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

/** 缓出指数动画曲线 */
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** 从下向上淡入的动画变体 */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: easeOutExpo },
  }),
};

/** 纯淡入动画变体 */
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: easeOutExpo } },
};

/* ── 数字递增 Hook ── */
/**
 * 数字递增动画 Hook
 * 当元素进入视口时以缓动动画从 0 递增到目标值
 * @param end - 目标数值
 * @param duration - 动画时长（ms）
 * @returns { ref, value } - 绑定的 ref 和当前动画值
 */
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

/* ── 状态徽章 ── */
/**
 * 设施状态徽章组件
 * 根据状态字符串显示对应颜色和图标
 * @param status - 状态字符串（Active/New/Building/Planned等）
 * @returns 状态徽章
 */
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

/* ── 关键指标卡片 ── */
/**
 * KPI 指标卡片组件
 * 带数字递增动画的数据展示卡片
 * @param label - 指标名称
 * @param value - 指标数值
 * @param prefix - 数值前缀
 * @param suffix - 数值后缀
 * @param index - 动画延迟索引
 * @returns KPI 卡片
 */
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
