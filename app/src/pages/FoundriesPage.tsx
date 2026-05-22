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
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function FoundriesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-bg-base">
      {/* ── Section 1: Page Header ── */}
      <section className="relative pt-24 pb-12 px-6 border-b-[3px] border-accent-cyan overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 40%, #0A0A0F 100%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #00D4FF 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-[1440px] mx-auto">
          {/* Breadcrumb */}
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

          {/* Layer Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: easeOutExpo }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent-cyan rounded-full mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-accent-cyan" />
            <span className="text-mono-sm text-accent-cyan">封装工厂层 · FOUNDRY</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}
            className="text-heading-lg font-display text-text-primary mb-3"
          >
            Semiconductor Foundry Landscape
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
            className="text-body-lg text-text-secondary max-w-[640px] mb-8"
          >
            Global fabrication capacity, process node leadership, and expansion dynamics across the world's chip manufacturers.
          </motion.p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8 items-center">
            <KpiStat label="Fabs Tracked" value={18} index={3} />
            <KpiStat label="TSMC Share" value={62} suffix="%" index={4} />
            <div className="text-center">
              <div className="text-data-md text-text-primary font-mono">$230B+</div>
              <div className="text-mono-sm text-text-muted uppercase tracking-[0.04em] mt-1">Market Size</div>
            </div>
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
            {/* Donut Chart */}
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

            {/* Revenue Trend */}
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

          {/* KPI Grid */}
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

          {/* Company Header Card */}
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
              <div className="flex flex-wrap gap-3">
                {['Market Leader', '3nm Shipping', '2nm 2025'].map((badge) => (
                  <span key={badge} className="px-2.5 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded text-mono-sm text-accent-cyan">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
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

          {/* Fab Locations + Timeline Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Fab Cards */}
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

            {/* Process Timeline */}
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

          {/* Capacity by Node Table */}
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
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-surface">
                    {['Node', 'Location', 'Capacity (wafers/mo)', 'Status', 'Revenue Contribution'].map((h) => (
                      <th key={h} className="text-left text-mono-sm text-text-muted uppercase tracking-[0.04em] px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
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

          {/* Expansion Plan */}
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

          {/* Samsung Header Card */}
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
              <div className="flex flex-wrap gap-3">
                {['3nm GAA', '2nm 2025', 'Taylor Fab Under Construction'].map((badge) => (
                  <span key={badge} className="px-2.5 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded text-mono-sm text-accent-cyan">{badge}</span>
                ))}
              </div>
            </div>
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
            {/* Fab Locations */}
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

            {/* GAA Comparison */}
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
            {/* Intel Foundry */}
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
                  {['Ocotillo, AZ', 'Ronler Acres, OR', 'New Albany, OH', 'Leixlip, Ireland', 'Kiryat Gat, Israel', 'Magdeburg, Germany'].map((loc) => (
                    <div key={loc} className="flex items-center gap-1.5 text-body-sm text-text-secondary">
                      <MapPin size={10} className="text-warning" />
                      {loc}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-warning/5 border border-warning/20 rounded">
                <span className="text-mono-sm text-warning">Node Roadmap: 20A → 18A (2025) → 14A (2026)</span>
              </div>
            </motion.div>

            {/* SMIC */}
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

            {/* GF + UMC */}
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

              {/* GlobalFoundries */}
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

          {/* Capacity Projection */}
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
