import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { layers, kpis, supplyChainData, fabricationFacilities, dataCenters } from '@/data/mockData';
import { ShieldCheck, SquareStack, Archive } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

function usePageTranslation() {
  return useTranslation(['home', 'common']);
}

/* ================================================================
   Section 1: Hero
   ================================================================ */
function HeroSection() {
  const { t } = usePageTranslation();
  const [timeAgo, setTimeAgo] = useState({ minutes: 2, seconds: 34 });
  const [progress, setProgress] = useState(62);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo((prev) => {
        let { minutes, seconds } = prev;
        seconds += 1;
        if (seconds >= 60) {
          seconds = 0;
          minutes += 1;
        }
        return { minutes, seconds };
      });
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 40%, #0A0A0F 100%)' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url(/hero-grid-bg.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '512px 512px',
        }}
      />
      {/* Wireframe globe */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: easeOutExpo }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <img
          src="/earth-wireframe.png"
          alt=""
          className="w-[600px] h-[600px] object-contain animate-globe-rotate opacity-60"
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 px-3 py-1 rounded-full border border-border-active text-mono-sm text-text-muted"
        >
          {t('home:hero.betaBadge')}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
          className="font-display text-display-xl text-text-primary tracking-[-0.03em] mb-6"
        >
          {t('home:hero.title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: easeOutExpo }}
          className="text-body-lg text-text-secondary max-w-[560px] mb-8"
        >
          {t('home:hero.subtitle')}
        </motion.p>

        {/* Data freshness bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center gap-2 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live-pulse opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-live-pulse" />
          </span>
          <span className="text-mono-sm text-text-muted">
            Last synced: {timeAgo.minutes} min {timeAgo.seconds} sec ago &middot; Next refresh in {5 - timeAgo.minutes % 5} min {60 - timeAgo.seconds} sec
          </span>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="w-64 h-1 bg-bg-surface rounded-full mb-10 overflow-hidden"
        >
          <motion.div
            className="h-full bg-accent-cyan rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: easeOutExpo }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/map"
            className="px-8 py-3.5 bg-accent-cyan text-bg-base font-semibold rounded-lg text-body-md transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
          >
            {t('common:actions.explore')}
          </Link>
          <Link
            to="/developers"
            className="px-8 py-3.5 bg-transparent text-text-secondary border border-border-active rounded-lg text-body-md transition-all duration-200 hover:text-text-primary hover:border-accent-cyan"
          >
            {t('common:actions.viewDocs')} &rarr;
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <div className="relative w-px h-10 bg-text-muted/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-text-muted/40 rounded-full animate-scroll-dot" />
        </div>
      </motion.div>
    </section>
  );
}

/* ================================================================
   Section 2: Global KPI Dashboard
   ================================================================ */
function useCountUp(target: number, duration: number = 800, inView: boolean = false) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return value;
}

function formatKPIValue(val: number, unit: string): string {
  if (unit === 'TWh') return val.toFixed(1);
  if (unit === 'tonnes') return val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val.toFixed(0);
  if (unit === '$B') return val.toFixed(1);
  return val.toFixed(0);
}

function KPIBlock({ kpi, index }: { kpi: typeof kpis[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const count = useCountUp(kpi.value, 800, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: easeOutExpo }}
      className="flex flex-col items-center text-center"
    >
      <span className="text-data-lg" style={{ color: kpi.accentColor }}>
        {kpi.unit === '$B' ? `$${formatKPIValue(count, kpi.unit)}B` : `${formatKPIValue(count, kpi.unit)} ${kpi.unit}`}
      </span>
      <span className="text-body-sm text-text-muted uppercase tracking-[0.04em] mt-1">
        {kpi.label}
      </span>
      <span className="text-body-sm text-success mt-1 flex items-center gap-1">
        {kpi.deltaType === 'positive' && <span>&#9650;</span>}
        {kpi.deltaType === 'negative' && <span>&#9660;</span>}
        {kpi.delta}
      </span>
      <div className="w-full mt-3 h-1 bg-bg-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: kpi.accentColor }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${kpi.progressPercent}%` } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.3, ease: easeOutExpo }}
        />
      </div>
    </motion.div>
  );
}

function KPIDashboard() {
  const { t } = usePageTranslation();

  // Dynamically compute KPIs from mockData
  const dynamicKpis = useMemo(() => {
    const totalSupply = supplyChainData.length;
    const totalFoundry = fabricationFacilities.length;
    const totalDataCenters = dataCenters.length;
    const totalPins = totalSupply + totalFoundry + totalDataCenters;
    const totalPowerMW = dataCenters.reduce((sum, dc) => sum + (dc.powerCapacity || 0), 0);
    const operationalDCs = dataCenters.filter((dc) => dc.status === 'operational').length;
    const constructionDCs = dataCenters.filter((dc) => dc.status === 'construction').length;

    return [
      { label: t('home:kpi.totalPins', 'Total Data Points'), value: totalPins, unit: 'pts', color: '#00D4FF', icon: '📍' },
      { label: t('home:kpi.supplyNodes', 'Supply Chain Nodes'), value: totalSupply, unit: '', color: '#FFB84D', icon: '⛓' },
      { label: t('home:kpi.foundryFabs', 'Foundry Fabs'), value: totalFoundry, unit: '', color: '#00D4FF', icon: '🏭' },
      { label: t('home:kpi.dataCenters', 'Data Centers'), value: totalDataCenters, unit: '', color: '#A855F7', icon: '🖥' },
      { label: t('home:kpi.totalPower', 'Total DC Power'), value: totalPowerMW, unit: 'MW', color: '#22C55E', icon: '⚡' },
      { label: t('home:kpi.operational', 'Operational DCs'), value: operationalDCs, unit: '', color: '#22C55E', icon: '✅' },
      { label: t('home:kpi.construction', 'Under Construction'), value: constructionDCs, unit: '', color: '#F59E0B', icon: '🔨' },
    ];
  }, [t]);

  // Region distribution for chart
  const regionChartOption = useMemo(() => {
    const regionMap: Record<string, number> = {};
    dataCenters.forEach((dc) => {
      regionMap[dc.region] = (regionMap[dc.region] || 0) + 1;
    });
    const regionColors: Record<string, string> = {
      'North America': '#00D4FF',
      'Europe': '#FFB84D',
      'Asia Pacific': '#A855F7',
      'Middle East': '#22C55E',
      'South America': '#F59E0B',
      'Africa': '#EF4444',
    };

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#111118',
        borderColor: '#2A2A3A',
        textStyle: { color: '#E8E8EC', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
      },
      series: [{
        type: 'pie',
        radius: ['40%', '68%'],
        center: ['50%', '50%'],
        data: Object.entries(regionMap).map(([name, value]) => ({
          name,
          value,
          itemStyle: { color: regionColors[name] || '#6B6B80' },
        })),
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c}',
          color: '#9A9AAF',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
        },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
      }],
    };
  }, []);

  // Category distribution bar chart
  const categoryChartOption = useMemo(() => {
    const catMap: Record<string, number> = {};
    supplyChainData.forEach((item) => {
      catMap[item.category] = (catMap[item.category] || 0) + 1;
    });
    const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#111118',
        borderColor: '#2A2A3A',
        textStyle: { color: '#E8E8EC', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
      },
      grid: { left: 10, right: 10, top: 10, bottom: 24, containLabel: true },
      xAxis: {
        type: 'category' as const,
        data: sorted.map(([k]) => k),
        axisLine: { lineStyle: { color: '#2A2A3A' } },
        axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, rotate: 30 },
      },
      yAxis: {
        type: 'value' as const,
        axisLine: { show: false },
        axisLabel: { color: '#6B6B80', fontFamily: 'JetBrains Mono, monospace', fontSize: 9 },
        splitLine: { lineStyle: { color: '#1E1E28', type: 'dashed' as const } },
      },
      series: [{
        type: 'bar',
        data: sorted.map(([, v]) => v),
        barWidth: '60%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#FFB84D' },
            { offset: 1, color: '#FFB84D33' },
          ]),
          borderRadius: [3, 3, 0, 0],
        },
      }],
    };
  }, []);

  return (
    <section className="bg-bg-base py-space-24">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Original KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-space-16 border-b border-border-subtle">
          {kpis.map((kpi, i) => (
            <KPIBlock key={kpi.id} kpi={kpi} index={i} />
          ))}
        </div>

        {/* Dynamic Stats from mockData */}
        <div className="pt-space-12">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.5 }}
            className="text-heading-sm text-text-primary text-center mb-8"
          >
            {t('home:dashboard.title', 'Live Data Overview')}
          </motion.h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-10">
            {dynamicKpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-[#111118] border border-[#1E1E28] rounded-lg p-4 text-center"
              >
                <span className="text-2xl block mb-1">{kpi.icon}</span>
                <span className="text-data-md font-mono block" style={{ color: kpi.color }}>
                  {kpi.value.toLocaleString()}{kpi.unit ? ` ${kpi.unit}` : ''}
                </span>
                <span className="text-[10px] font-mono text-[#6B6B80] uppercase tracking-wider block mt-1">{kpi.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#111118] border border-[#1E1E28] rounded-lg p-5"
            >
              <h4 className="text-mono-sm text-[#6B6B80] uppercase tracking-wider mb-3">
                {t('home:dashboard.regionDist', 'Data Center Distribution by Region')}
              </h4>
              <div style={{ height: 260 }}>
                <ReactECharts option={regionChartOption} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'canvas' }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#111118] border border-[#1E1E28] rounded-lg p-5"
            >
              <h4 className="text-mono-sm text-[#6B6B80] uppercase tracking-wider mb-3">
                {t('home:dashboard.categoryDist', 'Supply Chain by Category')}
              </h4>
              <div style={{ height: 260 }}>
                <ReactECharts option={categoryChartOption} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'canvas' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Section 3: Three Layers Overview
   ================================================================ */
function SparklineChart({ color, data }: { color: string; data: number[] }) {
  const option = useMemo(() => ({
    grid: { left: 0, right: 0, top: 2, bottom: 2 },
    xAxis: { type: 'category' as const, show: false, data: Array.from({ length: data.length }, (_, i) => i) },
    yAxis: { type: 'value' as const, show: false },
    series: [{
      type: 'line' as const,
      data,
      smooth: true,
      symbol: 'none',
      lineStyle: { color, width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: color + '33' },
          { offset: 1, color: color + '00' },
        ]),
      },
    }],
  }), [color, data]);

  return <ReactECharts option={option} style={{ width: 120, height: 40 }} opts={{ renderer: 'svg' }} />;
}

function LayerCard({ layer, index }: { layer: typeof layers[0]; index: number }) {
  const { t } = usePageTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  const sparkData = useMemo(() => {
    const base = [42, 48, 45, 52, 58, 55, 62, 68, 65, 72, 78, 85];
    // Deterministic pseudo-random based on layer index (no Math.random)
    const seed = (index + 1) * 7;
    return base.map((v, i) => v + ((seed * (i + 3) * 17) % 10) - 5);
  }, [index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: easeOutExpo }}
      className="group relative rounded-lg border border-border-subtle p-space-6 transition-all duration-200 hover:border-opacity-50"
      style={{
        borderTopWidth: '3px',
        borderTopColor: layer.accentColor,
        background: 'linear-gradient(180deg, #111118 0%, #161620 100%)',
      }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ background: layer.glowGradient }}
      />
      <div className="relative z-10">
        <img src={layer.icon} alt={layer.title} className="w-12 h-12 mb-4" />
        <h3 className="text-heading-md text-text-primary">{layer.title}</h3>
        <span className="text-mono-sm" style={{ color: layer.accentColor }}>
          {layer.chineseLabel}
        </span>
        <p className="text-body-md text-text-secondary mt-3 leading-relaxed">
          {layer.description}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <SparklineChart color={layer.accentColor} data={sparkData} />
          <span className="text-body-sm text-text-muted">{layer.dataPointCount} {t('home:kpi.dataPoints', 'data points')}</span>
        </div>
        <Link
          to={layer.route}
          className="inline-block mt-4 text-body-md font-medium transition-all duration-200 hover:underline"
          style={{ color: layer.accentColor }}
        >
          {t('common:actions.explore')} &rarr;
        </Link>
      </div>
    </motion.div>
  );
}

function ThreeLayersSection() {
  const { t } = usePageTranslation();
  return (
    <section
      className="py-space-24"
      style={{ background: 'linear-gradient(180deg, #111118 0%, #161620 100%)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-space-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-heading-lg text-text-primary"
          >
            {t('home:layers.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
            className="text-body-md text-text-secondary mt-3 max-w-[480px] mx-auto"
          >
            From raw materials to the chips that power the world&apos;s AI
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-6">
          {layers.map((layer, i) => (
            <LayerCard key={layer.type} layer={layer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Section 4: Live Data Preview (Mini Map)
   ================================================================ */
function MiniMapSection() {
  const { t } = usePageTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  const mapOption = useMemo(() => {
    const pinData = [
      // Supply chain pins (amber)
      { name: 'Bayan Obo', value: [109.9833, 41.7667], itemStyle: { color: '#FFB84D' } },
      { name: 'Mountain Pass', value: [-115.5333, 35.4667], itemStyle: { color: '#FFB84D' } },
      { name: 'Mount Weld', value: [122.2667, -28.7667], itemStyle: { color: '#FFB84D' } },
      { name: 'ASML HQ', value: [5.3833, 51.4167], itemStyle: { color: '#FFB84D' } },
      { name: 'Shin-Etsu', value: [138.1833, 36.65], itemStyle: { color: '#FFB84D' } },
      { name: 'Applied Materials', value: [-121.9552, 37.3541], itemStyle: { color: '#FFB84D' } },
      // Foundry pins (cyan)
      { name: 'TSMC Hsinchu', value: [121.0043, 24.9714], itemStyle: { color: '#00D4FF' } },
      { name: 'TSMC Tainan', value: [120.2555, 23.0789], itemStyle: { color: '#00D4FF' } },
      { name: 'Samsung Hwaseong', value: [126.8, 37.2], itemStyle: { color: '#00D4FF' } },
      { name: 'Intel Oregon', value: [-122.6784, 45.5152], itemStyle: { color: '#00D4FF' } },
      { name: 'SMIC Shanghai', value: [121.4737, 31.2304], itemStyle: { color: '#00D4FF' } },
      { name: 'GF Malta', value: [-73.85, 42.9833], itemStyle: { color: '#00D4FF' } },
      // Data center pins (violet)
      { name: 'AWS N. Virginia', value: [-77.4481, 38.9517], itemStyle: { color: '#A855F7' } },
      { name: 'AWS Oregon', value: [-122.5951, 45.5898], itemStyle: { color: '#A855F7' } },
      { name: 'Google Belgium', value: [3.8252, 50.4712], itemStyle: { color: '#A855F7' } },
      { name: 'Google Finland', value: [27.1878, 60.5693], itemStyle: { color: '#A855F7' } },
      { name: 'Microsoft Dublin', value: [-6.2603, 53.3498], itemStyle: { color: '#A855F7' } },
      { name: 'AWS Singapore', value: [103.8198, 1.3521], itemStyle: { color: '#A855F7' } },
      { name: 'AWS Tokyo', value: [139.6503, 35.6762], itemStyle: { color: '#A855F7' } },
      { name: 'AWS Frankfurt', value: [8.6821, 50.1109], itemStyle: { color: '#A855F7' } },
    ];

    return {
      backgroundColor: 'transparent',
      geo: {
        map: 'world',
        roam: false,
        silent: true,
        itemStyle: {
          areaColor: '#181820',
          borderColor: '#2A2A3A',
          borderWidth: 0.5,
        },
        emphasis: { disabled: true },
        zoom: 1.1,
      },
      series: [{
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: pinData,
        symbolSize: 8,
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 4,
        },
        itemStyle: {
          opacity: 0.8,
        },
      }],
    };
  }, []);

  return (
    <section ref={ref} className="bg-bg-base py-space-24">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="lg:col-span-2"
          >
            <h2 className="text-heading-lg text-text-primary mb-4">{t('home:livePreview.title')}</h2>
            <p className="text-body-md text-text-secondary max-w-[400px] leading-relaxed mb-6">
              {t('home:livePreview.description')}
            </p>
            <ul className="space-y-3 mb-6">
              {[
                { text: t('home:livePreview.point1', '470+ geolocated data points'), color: '#FFB84D' },
                { text: t('home:livePreview.point2', 'Cross-verified against 3+ sources each'), color: '#00D4FF' },
                { text: t('home:livePreview.point3', 'Historical data back to 2019'), color: '#A855F7' },
                { text: t('home:livePreview.point4', 'Open API for researchers and developers'), color: '#E8E8EC' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-body-md text-text-secondary">{item.text}</span>
                </li>
              ))}
            </ul>
            <Link to="/map" className="text-body-md text-accent-cyan hover:underline transition-all duration-200">
              {t('common:actions.explore')} &rarr;
            </Link>
          </motion.div>

          {/* Right column - Mini Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: easeOutExpo }}
            className="lg:col-span-3 relative"
          >
            <div className="relative rounded-lg border border-border-subtle overflow-hidden bg-bg-elevated aspect-video">
              <ReactECharts
                option={mapOption}
                style={{ width: '100%', height: '100%' }}
                opts={{ renderer: 'canvas' }}
                onEvents={{
                  click: () => { /* Prevent interaction */ },
                }}
              />
              {/* Scan line overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 bottom-0 w-px bg-white/10 animate-scan-line" />
              </div>
              <div className="absolute bottom-3 right-3 text-mono-sm text-text-muted">
                {t('common:actions.explore')} &rarr;
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Section 5: Data Quality & Verification
   ================================================================ */
function DataQualitySection() {
  const { t } = usePageTranslation();
  const verificationColumns = [
    {
      icon: ShieldCheck,
      title: t('home:verification.tierTitle', '3-Tier Source System'),
      body: t('home:verification.tierBody', 'Tier 1: Official reports (ASML, USGS, IEA). Tier 2: Industry analysis (Gartner, TrendForce). Tier 3: Modeled estimates with confidence intervals.'),
      stat: t('home:verification.tierStat', '87% Tier 1 sources'),
      color: '#22C55E',
    },
    {
      icon: SquareStack,
      title: t('home:verification.crossTitle', 'Cross-Verification Engine'),
      body: 'Every data point is checked against 2+ independent sources. Discrepancies are flagged, documented, and resolved via our open review process.',
      stat: '3.2 avg sources per point',
      color: '#00D4FF',
    },
    {
      icon: Archive,
      title: 'Time-Series Archive',
      body: 'All data is snapshotted at each refresh. Compare any time period, visualize trends, and export historical datasets for your own analysis.',
      stat: 'Since 2019',
      color: '#A855F7',
    },
  ];
  return (
    <section className="bg-bg-elevated py-space-24">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-space-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-heading-lg text-text-primary"
          >
            Verified. Cross-Referenced. Transparent.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
            className="text-body-md text-text-secondary mt-3"
          >
            Every metric traces back to its original source. Our methodology is open for peer review.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-6">
          {verificationColumns.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: easeOutExpo }}
              className="flex flex-col items-center text-center p-space-6"
            >
              <col.icon size={32} color={col.color} strokeWidth={1.5} />
              <h3 className="text-heading-sm text-text-primary mt-4 mb-2">{col.title}</h3>
              <p className="text-body-md text-text-secondary leading-relaxed">{col.body}</p>
              <span className="text-data-md mt-4" style={{ color: col.color }}>
                {col.stat}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Section 6: Open Source CTA
   ================================================================ */
function OpenSourceCTASection() {
  return (
    <section
      className="py-space-24"
      style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 40%, #0A0A0F 100%)' }}
    >
      <div className="max-w-[700px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.3 }}
          className="inline-block mb-6 px-3 py-1 rounded-full border border-border-active text-mono-sm text-text-muted"
        >
          OPEN SOURCE &middot; CC BY-SA 4.0
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
          className="text-heading-lg text-text-primary mb-4"
        >
          Built for Developers, by Developers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-body-md text-text-secondary leading-relaxed mb-8"
        >
          This project welcomes both human and AI contributors. Our API is RESTful, documented in OpenAPI 3.0, and our data schema is fully typed in TypeScript. Fork the repo, submit a PR, or use our data to build your own analysis tools.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.4, delay: 0.5, ease: easeOutExpo }}
          className="flex flex-wrap items-center justify-center gap-4 mb-6"
        >
          <Link
            to="/developers"
            className="px-8 py-3.5 bg-accent-cyan text-bg-base font-semibold rounded-lg text-body-md transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
          >
            Read the Docs
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-3.5 bg-bg-elevated text-text-primary border border-border-active rounded-lg text-body-md transition-all duration-200 hover:border-accent-cyan"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Star on GitHub &#9733;
          </a>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="text-body-sm text-text-muted"
        >
          Join 200+ contributors &middot; Available in 6 languages
        </motion.p>
      </div>
    </section>
  );
}

/* ================================================================
   Section 7: Footer Stats Bar
   ================================================================ */
function FooterStatsBar() {
  return (
    <div className="bg-bg-base py-space-8 border-b border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-6 text-center">
        <p className="text-mono-sm text-text-muted">
          485.4 TWh &middot; 418 EUV &middot; 270K tonnes RE &middot; 62% TSMC
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   Home Page
   ================================================================ */
export default function Home() {
  return (
    <div className="bg-bg-base">
      <HeroSection />
      <KPIDashboard />
      <ThreeLayersSection />
      <MiniMapSection />
      <DataQualitySection />
      <OpenSourceCTASection />
      <FooterStatsBar />
    </div>
  );
}
