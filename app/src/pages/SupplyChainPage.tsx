/**
 * @file SupplyChainPage.tsx
 * @description Supply chain analysis page showing rare earth, lithography,
 * design firms, energy/labor data with interactive tables and charts.
 *
 * @dependencies react-i18next, echarts-for-react, @/data/mockData,
 *               @/components/supply-chain/*
 */
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supplyChainTableData } from '@/data/mockData';
import SupplyChainSankey from '@/components/supply-chain/SupplyChainSankey';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// ─── Data ──────────────────────────────────────────────────────

/**
 * 稀土生产配额数据
 * 各国2023/2024年稀土开采配额及全球产量占比，含主要矿区和加工能力详情
 */
const RARE_EARTH_DATA = [
  { name: 'China', quota2023: '240,000', quota2024: '270,000', percent: 61, details: { mining: 'Bayan Obo (Inner Mongolia)', processing: '85% global processing', military: 'Strategic reserve' } },
  { name: 'USA', quota2023: '42,000', quota2024: '50,000', percent: 12, details: { mining: 'Mountain Pass (California)', processing: 'MP Materials (building)', military: 'Pentagon priority' } },
  { name: 'Australia', quota2023: '30,000', quota2024: '35,000', percent: 8, details: { mining: 'Mount Weld (Lynas)', processing: 'Lynas Corp', military: 'AUKUS alignment' } },
  { name: 'Myanmar', quota2023: '35,000', quota2024: '38,000', percent: 9, details: { mining: 'Kachin State', processing: 'Chinese investment', military: 'Conflict minerals concern' } },
  { name: 'Others', quota2023: '38,000', quota2024: '42,000', percent: 10, details: { mining: 'Various', processing: 'Limited', military: 'Various' } },
];

/**
 * 光刻设备供应商数据
 * 全球主要光刻机厂商的市场份额、核心产品、营收及客户信息
 * 光刻是半导体制造的关键瓶颈，当前仅 ASML 具备 EUV 生产能力
 */
const LITHOGRAPHY_DATA = [
  { company: 'ASML', units: 'NA', marketShare: 'EUV monopoly', keyProducts: 'EUV, DUV immersion', revenue2024: '$27.6B', customers: 'TSMC, Samsung, Intel', note: 'Only EUV supplier globally' },
  { company: 'Nikon', units: 'NA', marketShare: 'ArF i-line niche', keyProducts: 'ArF, i-line, NSR-S635E', revenue2024: '$5.2B (total)', customers: 'Specialty fabs', note: 'Focus on mature nodes, inspection' },
  { company: 'Canon', units: 'NA', marketShare: 'i-line, KrF', keyProducts: 'i-line, KrF, nanoimprint', revenue2024: '$28.5B (total)', customers: 'Memory, specialty', note: 'Nanoimprint for memory applications' },
  { company: 'Shanghai Micro', units: 'NA', marketShare: '<1%', keyProducts: 'SSA600/20, 90nm demo', revenue2024: 'Private', customers: 'SMIC (testing)', note: '90nm demo; 28nm under development' },
];

/** 饼图颜色调色板 — 用于稀土产量占比可视化的各扇区颜色序列 */
const PIE_COLORS = ['#00e5b0', '#38bdf8', '#fbbf24', '#f87171', '#a78bfa', '#fb923c'];

/** 供应链完整数据集 — 从 mockData 导入，用于表格展示和搜索过滤 */
const SUPPLY_CHAIN_DATA = supplyChainTableData;

// ─── Components ────────────────────────────────────────────────

/**
 * 供应链分析页面组件
 * 展示稀土配额、光刻设备、设计公司和供应链流向桑基图
 */
export default function SupplyChainPage() {
  const { t } = useTranslation(['supplyChain', 'common']);
  // 搜索/过滤状态：搜索关键词、供应链类型、目标国家
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  /**
   * 按搜索/类型/国家三重过滤
   * 使用 useMemo 缓存过滤结果，仅在 searchQuery / typeFilter / selectedCountry
   * 变化时重新计算，避免每次渲染都遍历整个数据集
   */
  const filteredData = useMemo(() => {
    let data = SUPPLY_CHAIN_DATA;
    // 第一步：按搜索关键词在名称、国家、类型、指标中模糊匹配
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.keyMetric.toLowerCase().includes(q)
      );
    }
    // 第二步：按供应链类型筛选（稀土/光刻/设计/能源）
    if (typeFilter !== 'all') {
      data = data.filter((d) => d.type === typeFilter);
    }
    // 第三步：按国家筛选
    if (selectedCountry !== 'all') {
      data = data.filter((d) => d.country === selectedCountry);
    }
    return data;
  }, [searchQuery, typeFilter, selectedCountry]);

  // 将稀土数据转换为饼图所需格式：提取名称和百分比作为数据键
  const pieData = RARE_EARTH_DATA.map((c) => ({ name: c.name, value: c.percent }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">{t('common:breadcrumb.home')}</Link>
            <span>/</span>
            <span className="text-text-secondary">{t('supplyChain:breadcrumb')}</span>
          </nav>

          <h1 className="text-title text-text-primary">{t('supplyChain:pageTitle')}</h1>
          <p className="text-body text-text-secondary mt-3 max-w-2xl">
            {t('supplyChain:pageSubtitle')}
          </p>

          {/* 顶部统计卡片：数据点数量、覆盖国家、Tier-1 数据来源占比、数据时效 */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '1,200+', label: t('supplyChain:stats.dataPoints') },
              { value: '50+', label: t('supplyChain:stats.countries') },
              { value: '67%', label: t('supplyChain:stats.tier1Sources') },
              { value: '2 min', label: t('supplyChain:stats.lastUpdated') },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <p className="text-mono-lg text-accent-cyan">{stat.value}</p>
                <p className="text-mono-sm text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Rare Earth Dashboard */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('supplyChain:sections.rareEarth')}</h2>
          <p className="text-sm text-text-secondary mt-2">2025 global rare earth production quotas and reserves</p>

          {/* 稀土产量饼图 + 各国详情对比（左图右表布局） */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-4">Global Rare Earth Production Share (2025)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f0f0f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Country Details */}
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-4">Country Breakdown</h3>
              <div className="space-y-4">
                {RARE_EARTH_DATA.map((c) => (
                  <div key={c.name} className="flex items-start gap-4 p-3 rounded bg-[rgba(255,255,255,0.02)]">
                    <div className="flex-shrink-0">
                      <p className="text-mono-lg text-accent-cyan">{c.percent}%</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{c.name}</p>
                      <p className="text-mono-sm text-text-muted">2023: {c.quota2023}t | 2024: {c.quota2024}t</p>
                      <p className="text-mono-sm text-text-muted mt-1">{c.details.mining}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supply Chain Sankey Diagram */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">供应链流向 — Supply Chain Flow</h2>
          <p className="text-sm text-text-secondary mt-2">
            可视化从原材料到最终算力中心的完整供应链路径
          </p>
          <div className="mt-6">
            {/* 桑基图组件：展示从原材料→制造→算力中心的供应链流向 */}
            <SupplyChainSankey />
          </div>
        </div>
      </section>

      {/* Lithography Equipment */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('supplyChain:sections.lithography')}</h2>
          <p className="text-sm text-text-secondary mt-2">Advanced lithography systems — the critical chokepoint of semiconductor manufacturing</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {LITHOGRAPHY_DATA.map((l) => (
              <div key={l.company} className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-text-primary">{l.company}</h3>
                  <span className="px-2 py-1 rounded text-mono-sm bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">{l.marketShare}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-mono-sm text-text-muted">Key Products</span><span className="text-mono-sm text-text-primary">{l.keyProducts}</span></div>
                  <div className="flex justify-between"><span className="text-mono-sm text-text-muted">2024 Revenue</span><span className="text-mono-sm text-text-primary">{l.revenue2024}</span></div>
                  <div className="flex justify-between"><span className="text-mono-sm text-text-muted">Key Customers</span><span className="text-mono-sm text-text-primary">{l.customers}</span></div>
                </div>
                <p className="text-mono-sm text-text-muted mt-3 italic">{l.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Firms */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('supplyChain:sections.designFirms')}</h2>
          <p className="text-sm text-text-secondary mt-2">Fabless semiconductor companies and EDA tool vendors</p>

          {/* 芯片设计公司卡片网格：展示各公司市场定位、营收和总部信息 */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'NVIDIA', market: 'GPU / AI', revenue: '$60.9B', hq: 'USA', share: '80% AI training' },
              { name: 'AMD', market: 'CPU / GPU / FPGA', revenue: '$25.8B', hq: 'USA', share: 'Data center growth' },
              { name: 'Broadcom', market: 'Networking / Custom ASIC', revenue: '$51.6B', hq: 'USA', share: 'Custom AI chips' },
              { name: 'Qualcomm', market: 'Mobile / Edge AI', revenue: '$39.1B', hq: 'USA', share: 'Mobile AI' },
              { name: 'MediaTek', market: 'Mobile / IoT', revenue: '$14.6B', hq: 'Taiwan', share: 'Dimensity for AI' },
              { name: 'Huawei HiSilicon', market: 'Mobile / AI (domestic)', revenue: 'N/A', hq: 'China', share: 'Ascend 910B' },
            ].map((firm) => (
              <div key={firm.name} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <h3 className="text-sm font-semibold text-text-primary">{firm.name}</h3>
                <p className="text-mono-sm text-text-muted mt-1">{firm.market}</p>
                <p className="text-mono-sm text-accent-cyan mt-2">{firm.revenue} (2024)</p>
                <p className="text-mono-sm text-text-muted">{firm.hq} | {firm.share}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Energy & Labor */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section text-text-primary">{t('supplyChain:sections.energyLabor')}</h2>
          <p className="text-sm text-text-secondary mt-2">Power infrastructure and skilled labor supporting the AI supply chain</p>

          {/* 能源与人力数据面板：数据中心电力消耗 + 芯片行业人才储备 */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-3">Electricity for AI Infrastructure</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-text-muted">Global DC Power (2025)</span><span className="text-mono-sm text-accent-cyan">485.4 TWh</span></div>
                <div className="flex justify-between"><span className="text-sm text-text-muted">Projected DC Power (2030)</span><span className="text-mono-sm text-accent-cyan">945 TWh</span></div>
                <div className="flex justify-between"><span className="text-sm text-text-muted">Growth Rate (CAGR)</span><span className="text-mono-sm text-accent-cyan">14.2%</span></div>
                <div className="flex justify-between"><span className="text-sm text-text-muted">Renewable Share</span><span className="text-mono-sm text-accent-cyan">42% (target 2030: 60%)</span></div>
              </div>
            </div>
            <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-3">Skilled Labor</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-text-muted">TSMC R&D Engineers</span><span className="text-mono-sm text-accent-cyan">8,500+</span></div>
                <div className="flex justify-between"><span className="text-sm text-text-muted">ASML Talent Pool</span><span className="text-mono-sm text-accent-cyan">42,000+</span></div>
                <div className="flex justify-between"><span className="text-sm text-text-muted">China Chip Workforce</span><span className="text-mono-sm text-accent-cyan">300,000+</span></div>
                <div className="flex justify-between"><span className="text-sm text-text-muted">Global Shortage</span><span className="text-mono-sm text-accent-cyan">1M+ gap by 2030</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Dataset */}
      <section className="px-6 py-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-section text-text-primary">{t('supplyChain:dataset.title')}</h2>
              <p className="text-sm text-text-secondary mt-2">{t('supplyChain:dataset.subtitle')}</p>
            </div>
            <div className="flex gap-2">
              {/* 导出 CSV：将过滤后的数据转为逗号分隔文件并通过 Blob 触发浏览器下载 */}
              <button onClick={() => {
                // 构建 CSV 列头
                const headers = ['id','name','type','country','keyMetric','value','source','tier','updated'];
                const csv = [headers.join(','), ...filteredData.map((e) =>
                  [e.id, `"${e.name}"`, e.type, e.country, `"${e.keyMetric}"`, `"${e.value}"`, `"${e.source}"`, e.tier, e.updated].join(',')
                )].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'supply-chain.csv'; a.click();
              }} className="px-3 py-1.5 text-mono-sm text-text-secondary border border-border-subtle rounded hover:border-accent-cyan transition-colors cursor-pointer">
                {t('supplyChain:dataset.exportCSV')}
              </button>
              {/* 导出 JSON：将过滤后的数据格式化为 JSON 并通过 Blob 触发浏览器下载 */}
              <button onClick={() => {
                const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: 'application/json' });
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'supply-chain.json'; a.click();
              }} className="px-3 py-1.5 text-mono-sm text-text-secondary border border-border-subtle rounded hover:border-accent-cyan transition-colors cursor-pointer">
                {t('supplyChain:dataset.exportJSON')}
              </button>
            </div>
          </div>

          {/* 过滤器栏：搜索框 + 类型下拉 + 国家下拉，组合过滤表格数据 */}
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder={t('supplyChain:dataset.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary"
            >
              <option value="all">{t('supplyChain:dataset.typeAll')}</option>
              <option value="rare-earth">{t('supplyChain:dataset.typeRareEarth')}</option>
              <option value="lithography">{t('supplyChain:dataset.typeLithography')}</option>
              <option value="design">{t('supplyChain:dataset.typeDesign')}</option>
              <option value="energy">{t('supplyChain:dataset.typeEnergy')}</option>
            </select>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary"
            >
              <option value="all">{t('supplyChain:dataset.countryAll')}</option>
              <option value="China">China</option>
              <option value="USA">USA</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Japan">Japan</option>
              <option value="Australia">Australia</option>
              <option value="Taiwan">Taiwan</option>
              <option value="UK">UK</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Global">Global</option>
            </select>
          </div>

          {/* 数据表格：展示过滤后的供应链条目，含类型和层级颜色标签 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('supplyChain:dataset.tableHeaders.entity')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('supplyChain:dataset.tableHeaders.type')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('supplyChain:dataset.tableHeaders.country')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('supplyChain:dataset.tableHeaders.keyMetric')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('supplyChain:dataset.tableHeaders.value')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('supplyChain:dataset.tableHeaders.source')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('supplyChain:dataset.tableHeaders.tier')}</th>
                  <th className="text-left px-3 py-3 text-mono-sm text-text-muted font-medium">{t('supplyChain:dataset.tableHeaders.updated')}</th>
                </tr>
              </thead>
              <tbody>
                {/* 遍历过滤后的数据，为每个条目渲染一行，含类型和层级颜色标签 */}
                {filteredData.map((entry) => (
                  <tr key={entry.id} className="border-b border-border-subtle/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-3 py-3 text-text-primary font-medium">{entry.name}</td>
                    <td className="px-3 py-3">
                      {/* 根据数据类型渲染对应颜色标签：稀土-琥珀色、光刻-天蓝、设计-祖母绿、能源-玫红 */}
                      <span className={`inline-flex px-2 py-0.5 rounded text-mono-sm ${
                        entry.type === 'rare-earth' ? 'bg-amber-500/10 text-amber-400' :
                        entry.type === 'lithography' ? 'bg-sky-500/10 text-sky-400' :
                        entry.type === 'design' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{entry.country}</td>
                    <td className="px-3 py-3 text-text-secondary">{entry.keyMetric}</td>
                    <td className="px-3 py-3 text-mono-sm text-accent-cyan">{entry.value}</td>
                    <td className="px-3 py-3 text-mono-sm text-text-muted">{entry.source}</td>
                    <td className="px-3 py-3">
                      {/* 根据数据层级渲染颜色标签：tier1 绿色（高可信度）、tier2 蓝色、其他灰色 */}
                      <span className={`inline-flex px-2 py-0.5 rounded text-mono-sm ${
                        entry.tier === 'tier1' ? 'bg-emerald-500/10 text-emerald-400' :
                        entry.tier === 'tier2' ? 'bg-sky-500/10 text-sky-400' :
                        'bg-text-muted/10 text-text-muted'
                      }`}>
                        {entry.tier}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-mono-sm text-text-muted">{entry.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 空状态提示：过滤结果为零时展示搜索关键词和匹配数 */}
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">{t('common:actions.search')} &ldquo;{searchQuery}&rdquo; — 0 {t('common:data.dataPoints')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
