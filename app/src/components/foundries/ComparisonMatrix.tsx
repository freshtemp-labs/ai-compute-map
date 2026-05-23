/**
 * @file ComparisonMatrix.tsx
 * @description 晶圆代工厂商对比矩阵组件。支持按多列排序的可排序表格，
 *   包含公司、营收、市场份额、先进节点、全球各区域晶圆厂数量和产能等维度。
 *   使用 framer-motion 实现入场动画。
 * @dependencies framer-motion, lucide-react, ./data
 */
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { comparisonData, type SortKey } from './data';

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

/**
 * 代工厂商对比矩阵组件
 * 可排序表格，点击列头切换升序/降序
 * @returns 对比矩阵表格
 */
export function ComparisonMatrix() {
  const [sortKey, setSortKey] = useState<SortKey>('company');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }, [sortKey, sortAsc]);

  const sorted = [...comparisonData].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const headers: { key: SortKey; label: string }[] = [
    { key: 'company', label: 'Company' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'share', label: 'Share' },
    { key: 'node', label: 'Advanced Node' },
    { key: 'fabs', label: 'Fabs' },
    { key: 'usaFabs', label: 'USA Fabs' },
    { key: 'chinaFabs', label: 'China Fabs' },
    { key: 'europeFabs', label: 'Europe Fabs' },
    { key: 'capacity', label: 'Capacity/mo' },
    { key: 'customers', label: 'Key Customers' },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-surface">
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => handleSort(h.key)}
                  className="text-left text-mono-sm text-text-muted uppercase tracking-[0.04em] px-4 py-3 cursor-pointer select-none hover:text-text-primary transition-colors whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {h.label}
                    {sortKey === h.key && (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <motion.tr
                key={row.company}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3, ease: easeOutExpo }}
                viewport={{ once: true }}
                className="border-t border-border-subtle hover:bg-bg-surface transition-all duration-200 group cursor-default"
                style={{ borderLeft: '2px solid transparent' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = '#00D4FF'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent'; }}
              >
                <td className="px-4 py-3 text-body-md font-semibold text-text-primary">{row.company}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary font-mono">{row.revenue}</td>
                <td className="px-4 py-3 text-body-md text-accent-cyan font-mono">{row.share}</td>
                <td className="px-4 py-3 text-body-md text-text-primary">{row.node}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary text-center">{row.fabs}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary">{row.usaFabs}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary">{row.chinaFabs}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary">{row.europeFabs}</td>
                <td className="px-4 py-3 text-body-md text-text-secondary font-mono">{row.capacity}</td>
                <td className="px-4 py-3 text-body-sm text-text-secondary">{row.customers}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
