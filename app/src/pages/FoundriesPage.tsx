/**
 * @file FoundriesPage.tsx
 * @description Foundry analysis page showing semiconductor fabrication facilities,
 * process node comparisons, capacity utilization charts, and comparison matrices.
 *
 * @dependencies framer-motion, react-i18next, @/components/foundries/*,
 *               @/data/mockData
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Cpu,
  Globe,
  TrendingUp,
  MapPin,
  Microchip,
  Factory,
  ArrowUpRight,
  Zap,
  Layers,
  BarChart3,
  Activity,
  AlertCircle,
} from 'lucide-react';

import { StatusBadge, KpiStat, SectionLabel, PieChartIcon, easeOutExpo, fadeUp } from '@/components/foundries/FoundryUtils';
import { DonutChart, RevenueTrendChart, CapacityProjectionChart, GaaComparisonChart } from '@/components/foundries/FoundryCharts';
import { ComparisonMatrix } from '@/components/foundries/ComparisonMatrix';
import { tsmcFabs, tsmcNodes, samsungFabs, smicFabs, processTimeline } from '@/components/foundries/data';

/* ═══════════════════════════════════════════════
   MAIN PAGE - 晶圆代工分析主页
   展示全球半导体制造设施、工艺节点比较、产能利用率和对比矩阵
   ═══════════════════════════════════════════════ */

/**
 * FoundriesPage — 晶圆代工分析页面主组件
 *
 * 页面分为六个主要 Section：
 *   1. Page Header       — 面包屑导航 + 页面标题 + 关键统计
 *   2. Market Overview   — 市场份额饼图 + 营收趋势 + KPI 网格
 *   3. TSMC Deep Dive    — 台积电深度分析（晶圆厂位置、工艺节点时间线、产能表、扩张计划）
 *   4. Samsung Foundry   — 三星代工（晶圆厂、GAA vs FinFET 对比）
 *   5. Intel + Others    — 英特尔代工、中芯国际、成熟制程专家（格芯/联电）
 *   6. Comparison Matrix — 代工厂对比矩阵 + 产能预测图
 *
 * 动画策略：所有卡片使用 framer-motion 的 fadeUp variants，配合 whileInView
 * 实现滚动触发渐入效果。列表项使用 index-based delay 实现级联动画。
 *
 * @returns {JSX.Element} 完整的代工厂分析页面
 */
export default function FoundriesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-bg-base">
      {/* ── Section 1: Page Header ── */}
      <section className="relative pt-24 pb-12 px-6 border-b-[3px] border-accent-cyan overflow-hidden">
        {/* 背景层：渐变底色 + 点阵纹理装饰 */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 40%, #0A0A0F 100%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #00D4FF 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-[1440px] mx-auto">
          {/* Breadcrumb — 面包屑导航：使用基础 fade-in 动画，无需 y 位移 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <button onClick={() => navigate('/')} className="text-mono-sm text-text-muted hover:text-text-primary transition-colors">Map</button>
            <span className="text-text-muted">/</span>
            <span className="text-mono-sm text-accent-cyan">Foundry Layer</span>
          </motion.div>

          {/* Layer Badge — 标题弹出动画：y 方向从 10px 上移至原位 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: easeOutExpo }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent-cyan rounded-full mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-accent-cyan" />
            <span className="text-mono-sm text-accent-cyan">封装工厂层 · FOUNDRY</span>
          </motion.div>

          {/* Title — 主标题动画：y 从 30px 滑入，延迟 0.15s */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}
            className="text-heading-lg font-display text-text-primary mb-3"
          >
            Semiconductor Foundry Landscape
          </motion.h1>

          {/* Subtitle — 副标题动画：y 从 20px 滑入，延迟 0.2s */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
            className="text-body-lg text-text-secondary max-w-[640px] mb-8"
          >
            Global fabrication capacity, process node leadership, and expansion dynamics across the world's chip manufacturers.
          </motion.p>

          {/* Stats Row — 关键统计行：KPI 组件使用 index 控制级联动画顺序 */}
          <div className="flex flex-wrap gap-8 items-center">
            <KpiStat label="Fabs Tracked" value={18} index={3} />
            <KpiStat label="TSMC Share" value={62} suffix="%" index={4} />
            <div className="text-center">
              <div className="text-data-md text-text-primary font-mono">$230B+</div>
              <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em] mt-1">Market Size</div>
            </div>
            {/* 实时状态指示器：呼吸灯动画 + 更新时间 */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live-pulse opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-live-pulse" />
              </span>
              <span className="text-mono-sm text-text-muted">Updated 2m ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Market Overview ── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, #111118 0%, #161620 100%)' }}>
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="Market Overview" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Donut Chart — 市场份额环形图：TSMC 62%, Samsung 13%, UMC 6%, GF 6%, SMIC 5%, Others 8% */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <PieChartIcon size={18} className="text-accent-cyan" />
                2024 Foundry Market Share
              </h3>
              <DonutChart />
            </motion.div>

            {/* Revenue Trend — 营收趋势折线图：展示 TSMC/Samsung/Intel 等代工厂历年营收变化 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-accent-cyan" />
                Revenue Trend ($B)
              </h3>
              <RevenueTrendChart />
            </motion.div>
          </div>

          {/* KPI Grid — 四大代工厂营收卡片网格，使用 map 遍历渲染，custom=i 传递 stagger index */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'TSMC Revenue', value: '$90B', color: 'text-accent-cyan', icon: <Zap size={16} /> },
              { label: 'Samsung Foundry', value: '$12B', color: 'text-text-secondary', icon: <Cpu size={16} /> },
              { label: 'Intel Foundry (Target)', value: '$5B', color: 'text-warning', icon: <AlertCircle size={16} /> },
              { label: 'SMIC Revenue', value: '$8B', color: 'text-text-primary', icon: <Activity size={16} /> },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-bg-elevated border border-border-subtle rounded-lg p-5 hover:border-border-active transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 text-text-muted mb-2">{kpi.icon}<span className="text-body-sm">{kpi.label}</span></div>
                <div className={`text-data-md font-mono ${kpi.color}`}>{kpi.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: TSMC Deep Dive ── */}
      <section className="py-16 px-6 bg-bg-base">
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="TSMC · TAIWAN SEMICONDUCTOR" />

          {/* Company Header Card — TSMC 公司概览卡片，左侧青色边框 (#00D4FF) 标识品牌色 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-bg-elevated border border-border-subtle rounded-lg p-6 mb-8 hover:border-border-active transition-all duration-200"
            style={{ borderLeft: '4px solid #00D4FF' }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-heading-md font-display text-text-primary">TSMC</h2>
                  <span className="text-mono-sm text-text-muted">NYSE: TSM</span>
                </div>
                <p className="text-body-md text-text-secondary">Hsinchu, Taiwan · World's largest dedicated independent semiconductor foundry</p>
              </div>
              {/* TSMC 标签徽章：市场领导者、3nm 量产、2nm 2025 */}
              <div className="flex flex-wrap gap-3">
                {['Market Leader', '3nm Shipping', '2nm 2025'].map((badge) => (
                    <span key={badge} className="px-2.5 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded text-mono-sm text-accent-cyan">
                      {badge}
                    </span>
                  ))}
              </div>
            </div>
            {/* TSMC 关键财务与运营指标 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border-subtle">
              {[
                { label: 'Revenue', value: '$90B' },
                { label: 'Net Margin', value: '~40%' },
                { label: 'Market Cap', value: '~$800B' },
                { label: 'Fabs', value: '6 Active' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-data-md text-accent-cyan font-mono">{stat.value}</div>
                  <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Fab Locations + Timeline Row — 左右双栏布局：晶圆厂卡片列表 + 工艺节点时间线 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Fab Cards — 渲染 tsmcFabs 数据，每个卡片含名称、角色、制程节点、产能 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-accent-cyan" />
                Fab Locations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tsmcFabs.map((fab, i) => (
                  <motion.div
                    key={fab.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3, ease: easeOutExpo }}
                    viewport={{ once: true }}
                    className="p-3 bg-bg-surface rounded border border-border-subtle hover:border-accent-cyan/40 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-body-md font-semibold text-text-primary">
                        {fab.nameCn ? `${fab.name} (${fab.nameCn})` : fab.name}
                      </span>
                      <StatusBadge status={fab.status === 'Active' ? 'Active' : fab.status === 'New' ? 'New' : fab.status === 'Building' ? 'Building' : 'Planned'} />
                    </div>
                    <p className="text-body-sm text-text-secondary mb-1">{fab.role}</p>
                    <div className="flex items-center gap-3 text-mono-sm text-text-muted">
                      <span>{fab.nodes}</span>
                      <span>·</span>
                      <span className="text-accent-cyan">{fab.capacity} wfr/mo</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Process Timeline — 渲染 processTimeline 数据，纵向时间线含节点名称和领先厂商 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <Layers size={18} className="text-accent-cyan" />
                Process Node Timeline
              </h3>
              <div className="space-y-3">
                {processTimeline.map((item, i) => (
                  <motion.div
                    key={item.node + item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: easeOutExpo }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-mono-sm text-text-muted w-12 text-right font-mono">{item.year}</span>
                    <div className="relative w-4 h-4 flex-shrink-0">
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{ borderColor: item.color, backgroundColor: item.color }}
                      />
                      {i < processTimeline.length - 1 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-border-subtle" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-body-md font-semibold text-text-primary">{item.node}</span>
                      <span className="text-body-sm text-text-secondary ml-2">— {item.leader}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Capacity by Node Table — 渲染 tsmcNodes 数据表，含节点/地点/产能/状态/营收贡献五列 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden mb-8 hover:border-border-active transition-all duration-200"
          >
            <div className="p-4 border-b border-border-subtle">
              <h3 className="text-heading-sm text-text-primary flex items-center gap-2">
                <BarChart3 size={18} className="text-accent-cyan" />
                Capacity by Node
              </h3>
            </div>
            <div className="overflow-x-auto">
              {/* 表头：固定五列布局，使用 uppercase tracking 样式 */}
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-surface">
                    {['Node', 'Location', 'Capacity (wafers/mo)', 'Status', 'Revenue Contribution'].map((h) => (
                      <th key={h} className="text-left text-mono-sm text-text-muted uppercase tracking-[0.04em] px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                {/* 表体：每行动画 delay 基于 index * 0.04s，实现逐行渐入 */}
                <tbody>
                  {tsmcNodes.map((row, i) => (
                    <motion.tr
                      key={row.node}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease: easeOutExpo }}
                      viewport={{ once: true }}
                      className="border-t border-border-subtle hover:bg-bg-surface transition-colors"
                    >
                      <td className="px-4 py-3 text-body-md font-semibold text-accent-cyan font-mono">{row.node}</td>
                      <td className="px-4 py-3 text-body-md text-text-secondary">{row.location}</td>
                      <td className="px-4 py-3 text-body-md text-text-primary font-mono">{row.capacity}</td>
                      <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                      <td className="px-4 py-3 text-body-md text-accent-cyan font-mono">{row.contribution}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Expansion Plan — TSMC 全球扩张计划：日本熊本、亚利桑那凤凰城、德国德累斯顿、高雄 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-lg p-6 border border-accent-cyan/30"
            style={{ background: 'rgba(0,212,255,0.06)' }}
          >
            <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
              <Globe size={18} className="text-accent-cyan" />
              Global Expansion Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 四大扩张项目数据，每项含 arrow 图标和渐变滑入动画 */}
              {[
                'Kumamoto, Japan (JASM): 28nm/12nm/16nm, operational 2024',
                'Phoenix, Arizona: 4nm/3nm, Phase 1 2025, Phase 2 2028',
                'Dresden, Germany (ESMC): 28nm/22nm, planning stage',
                'Kaohsiung: 28nm/7nm capacity expansion',
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: easeOutExpo }}
                  viewport={{ once: true }}
                  className="flex items-start gap-2"
                >
                  <ArrowUpRight size={14} className="text-accent-cyan mt-1 flex-shrink-0" />
                  <span className="text-body-md text-text-secondary">{plan}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 4: Samsung Foundry ── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, #111118 0%, #161620 100%)' }}>
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="SAMSUNG ELECTRONICS · FOUNDRY" />

          {/* Samsung Header Card — 与 TSMC 布局一致，左侧青色边框；徽章突出 GAA 3nm 和 2nm 路线图 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-bg-elevated border border-border-subtle rounded-lg p-6 mb-8 hover:border-border-active transition-all duration-200"
            style={{ borderLeft: '4px solid #00D4FF' }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-heading-md font-display text-text-primary">Samsung Foundry</h2>
                  <span className="text-mono-sm text-text-muted">KRX: 005930</span>
                </div>
                <p className="text-body-md text-text-secondary">Suwon, South Korea · Integrated device manufacturer with foundry services</p>
              </div>
              {/* Samsung 标签徽章：3nm GAA、2nm 2025、Taylor 工厂建设中 */}
              <div className="flex flex-wrap gap-3">
                {['3nm GAA', '2nm 2025', 'Taylor Fab Under Construction'].map((badge) => (
                  <span key={badge} className="px-2.5 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded text-mono-sm text-accent-cyan">{badge}</span>
                ))}
              </div>
            </div>
            {/* Samsung 代工关键指标：营收 $12B，毛利率 ~15%，市占 13%，GAA 领先 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border-subtle">
              {[
                { label: 'Foundry Revenue', value: '$12B' },
                { label: 'Net Margin', value: '~15%' },
                { label: 'Market Share', value: '13%' },
                { label: 'GAA Lead', value: 'Yes' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-data-md text-accent-cyan font-mono">{stat.value}</div>
                  <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fab Locations — 渲染 samsungFabs 数据，每个 Fab 含名称、角色、状态 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                <Factory size={18} className="text-accent-cyan" />
                Fab Locations
              </h3>
              <div className="space-y-3">
                {/* samsungFabs 数据源，水平滑入动画，delay = i * 0.08s */}
                {samsungFabs.map((fab, i) => (
                  <motion.div
                    key={fab.name}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3, ease: easeOutExpo }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-3 bg-bg-surface rounded border border-border-subtle hover:border-accent-cyan/40 transition-all duration-200"
                  >
                    <div>
                      <div className="text-body-md font-semibold text-text-primary">{fab.name}</div>
                      <div className="text-body-sm text-text-secondary">{fab.role}</div>
                    </div>
                    <StatusBadge status={fab.status === 'Building' ? 'Building' : 'Active'} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* GAA Comparison — GAA vs FinFET 技术对比图，含三星/台积电各自优势说明 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
            >
              <h3 className="text-heading-sm text-text-primary mb-2 flex items-center gap-2">
                <Cpu size={18} className="text-accent-cyan" />
                GAA vs FinFET Comparison
              </h3>
              <p className="text-body-sm text-text-secondary mb-4">
                Samsung is the only foundry shipping GAA (Gate-All-Around) transistors at 3nm, while TSMC uses FinFET at 3nm.
              </p>
              <GaaComparisonChart />
              {/* 对比摘要：三星 GAA 静电控制优势 vs 台积电良率及生态锁定 */}
              <div className="mt-3 p-3 bg-bg-surface rounded border border-border-subtle">
                <div className="text-body-sm text-text-secondary">
                  <span className="text-accent-cyan font-semibold">Samsung advantage:</span> GAA architecture offers better electrostatic control
                </div>
                <div className="text-body-sm text-text-secondary mt-1">
                  <span className="text-info font-semibold">TSMC advantage:</span> Yield maturity and customer ecosystem lock-in
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Intel + Others ── */}
      <section className="py-16 px-6 bg-bg-base">
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="OTHER FOUNDRIES" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Intel Foundry — IDM 2.0 战略转型卡片，左侧黄色边框 (#F59E0B)，含关键指标和全球工厂列表 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-warning/50 transition-all duration-200"
              style={{ borderLeft: '3px solid #F59E0B' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Microchip size={18} className="text-warning" />
                <h3 className="text-heading-sm font-display text-text-primary">Intel Foundry</h3>
              </div>
              <p className="text-body-sm text-text-secondary mb-4">IDM 2.0 strategy — transitioning from internal-only to external foundry services.</p>

              {/* Intel 关键指标：营收目标、领先节点 18A、工厂数量 */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Revenue Target</span>
                  <span className="text-warning font-mono">$5B (2027)</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Leading Node</span>
                  <span className="text-text-primary font-mono">18A</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Fabs</span>
                  <span className="text-text-primary font-mono">7</span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-3 mb-4">
                <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em] mb-2">Key Locations</div>
                <div className="space-y-1">
                  {/* 英特尔全球六大制造基地 */}
                  {['Ocotillo, AZ', 'Ronler Acres, OR', 'New Albany, OH', 'Leixlip, Ireland', 'Kiryat Gat, Israel', 'Magdeburg, Germany'].map((loc) => (
                    <div key={loc} className="flex items-center gap-1.5 text-body-sm text-text-secondary">
                      <MapPin size={10} className="text-warning" />
                      {loc}
                    </div>
                  ))}
                </div>
              </div>

              {/* 节点路线图提示框：20A → 18A (2025) → 14A (2026) */}
              <div className="p-2.5 bg-warning/5 border border-warning/20 rounded">
                <span className="text-mono-sm text-warning">Node Roadmap: 20A → 18A (2025) → 14A (2026)</span>
              </div>
            </motion.div>

            {/* SMIC — 中芯国际卡片，左侧灰色边框，显示制裁背景下的中国市场聚焦 */}
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
              style={{ borderLeft: '3px solid #E8E8EC' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={18} className="text-text-primary" />
                <h3 className="text-heading-sm font-display text-text-primary">SMIC 中芯国际</h3>
              </div>
              <p className="text-body-sm text-text-secondary mb-4">China's largest foundry. Domestic market focus under US sanctions context.</p>

              {/* SMIC 关键指标：营收 $8B，领先节点 7nm (N+2)，市占 5% */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Revenue</span>
                  <span className="text-text-primary font-mono">$8B</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Leading Node</span>
                  <span className="text-text-primary font-mono">7nm (N+2)</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-muted">Market Share</span>
                  <span className="text-text-primary font-mono">5%</span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-3">
                <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em] mb-2">Fab Locations</div>
                <div className="space-y-1">
                  {/* smicFabs 数据源，展示各厂区名称和角色 */}
                  {smicFabs.map((fab) => (
                    <div key={fab.name} className="flex items-center justify-between text-body-sm">
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        <MapPin size={10} className="text-text-muted" />
                        {fab.name}
                      </span>
                      <span className="text-text-muted">{fab.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* GF + UMC — 成熟制程专家卡片，左侧灰色边框 (#9A9AAF)，含格芯和联电两家公司的关键数据 */}
            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
              style={{ borderLeft: '3px solid #9A9AAF' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Factory size={18} className="text-text-secondary" />
                <h3 className="text-heading-sm font-display text-text-primary">Mature Node Specialists</h3>
              </div>

              {/* GlobalFoundries 区块：营收 $7B，Feature-Rich 策略，四大制造基地 */}
              <div className="mb-4">
                <h4 className="text-body-md font-semibold text-text-primary mb-2">GlobalFoundries</h4>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-text-muted">Revenue</span>
                  <span className="text-text-secondary font-mono">$7B</span>
                </div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span className="text-text-muted">Strategy</span>
                  <span className="text-text-secondary">Feature-Rich</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['Malta, NY', 'Burlington, VT', 'Dresden', 'Singapore'].map((loc) => (
                    <span key={loc} className="px-1.5 py-0.5 bg-bg-surface rounded text-mono-sm text-text-muted">{loc}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-border-subtle pt-3">
                {/* UMC 联电区块：营收 $5B，聚焦 22nm/28nm */}
                <h4 className="text-body-md font-semibold text-text-primary mb-2">UMC 联电</h4>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-text-muted">Revenue</span>
                  <span className="text-text-secondary font-mono">$5B</span>
                </div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span className="text-text-muted">Focus</span>
                  <span className="text-text-secondary">22nm/28nm</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['Hsinchu', 'Japan', 'Singapore', 'Suzhou'].map((loc) => (
                    <span key={loc} className="px-1.5 py-0.5 bg-bg-surface rounded text-mono-sm text-text-muted">{loc}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 6: Comparison Matrix ── */}
      {/* 代工厂综合对比矩阵 + 产能预测图 */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, #111118 0%, #161620 100%)' }}>
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel text="COMPARISON MATRIX" />
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-heading-md font-display text-text-primary mb-6"
          >
            Foundry Comparison Matrix
          </motion.h2>

          <ComparisonMatrix />

          {/* Capacity Projection — 产能预测折线图：千片晶圆/月 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 bg-bg-elevated border border-border-subtle rounded-lg p-6 hover:border-border-active transition-all duration-200"
          >
            <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-accent-cyan" />
              Capacity Projection (K Wafers/Month)
            </h3>
            <CapacityProjectionChart />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
