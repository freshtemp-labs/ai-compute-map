/**
 * @file DesignFirmsSection.tsx
 * @description 半导体设计公司与 EDA 工具展示区域。
 * 展示 NVIDIA 等重点企业的营收、产品和供应链依赖关系。
 *
 * @dependencies framer-motion
 */
import { motion } from 'framer-motion';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** 淡入上升动画变体配置 */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: easeOutExpo },
  }),
};

/** 半导体设计公司数据：包含营收、产品线、供应链依赖等信息 */
const designFirms = [
  {
    name: 'NVIDIA', hq: 'Santa Clara, USA', revenue: '$60.9B', segment: 'GPU / AI Accelerator',
    products: ['H100/H200 GPUs', 'Blackwell Architecture', 'CUDA Platform', 'DGX Systems'],
    color: '#A855F7',
    highlight: true,
    stats: [
      { label: 'Data Center Revenue', value: '$47.5B' },
      { label: 'GPU Architecture', value: 'Blackwell' },
      { label: 'Market Cap', value: '~$3.2T' },
      { label: 'H100/H200 Shipments', value: '500K+' },
    ],
    dependency: 'Supply chain dependency: TSMC (N4P/N3E), Samsung (HBM3E), SK Hynix (HBM)',
  },
  {
    name: 'AMD', hq: 'Santa Clara, USA', revenue: '$25.8B', segment: 'CPU / GPU / FPGA',
    products: ['EPYC Processors', 'Instinct MI300', 'Ryzen CPUs', 'Versal Adaptive SoCs'],
    color: '#A855F7', highlight: false,
  },
  {
    name: 'Broadcom', hq: 'San Jose, USA', revenue: '$30.2B', segment: 'Custom Silicon / Networking',
    products: ['AI XPUs', 'Tomahawk Switch', 'Trident Switch', 'Jericho3-PE'],
    color: '#A855F7', highlight: false,
  },
  {
    name: 'Qualcomm', hq: 'San Diego, USA', revenue: '$38.9B', segment: 'Mobile / Edge AI / 5G',
    products: ['Snapdragon 8 Gen 4', 'Hexagon NPU', 'Cloud AI Inference', '5G Modems'],
    color: '#A855F7', highlight: false,
  },
  {
    name: 'ARM Holdings', hq: 'Cambridge, UK', revenue: '$2.9B', segment: 'IP Cores / Architecture',
    products: ['ARMv9 Architecture', 'Neoverse Cores', 'Ethos NPU IP', 'Cortex-M Series'],
    color: '#A855F7', highlight: false,
  },
  {
    name: 'Synopsys', hq: 'Mountain View, USA', revenue: '$5.8B', segment: 'EDA / Design IP',
    products: ['Design Compiler', 'IC Validator', 'PrimeTime STA', 'AI-Driven DSO.ai'],
    color: '#A855F7', highlight: false,
  },
  {
    name: 'Cadence', hq: 'San Jose, USA', revenue: '$4.0B', segment: 'EDA / System Design',
    products: ['Genus Synthesis', 'Innovus PnR', 'Spectre X', 'Cerebrus AI'],
    color: '#A855F7', highlight: false,
  },
  {
    name: 'MediaTek', hq: 'Hsinchu, Taiwan', revenue: '$14.1B', segment: 'Mobile SoC / Edge AI',
    products: ['Dimensity 9400', 'NeuroPilot AI', '5G Modem IP', 'Genio Edge AI'],
    color: '#A855F7', highlight: false,
  },
];

/**
 * 设计公司展示区域组件
 * 展示全球主要半导体设计公司和 EDA 工具供应商信息，
 * NVIDIA 作为重点企业展示详细信息，其余公司以卡片网格排列
 * @returns 设计公司展示区域 JSX 元素
 */
export default function DesignFirmsSection() {
  const nvidia = designFirms.find((f) => f.name === 'NVIDIA')!;
  const others = designFirms.filter((f) => f.name !== 'NVIDIA');

  return (
    <section id="design-firms" className="w-full py-16 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(180deg, #111118 0%, #161620 100%)' }}>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="max-w-[1440px] mx-auto mb-8"
      >
        <span className="text-mono-sm text-accent-violet tracking-[0.06em] uppercase">Chip Design</span>
      </motion.div>

      <div className="max-w-[1440px] mx-auto">
        {/* NVIDIA Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="rounded-lg p-6 md:p-8 border mb-8"
          style={{ background: 'rgba(168,85,247,0.06)', borderColor: '#A855F7' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center font-display text-xl font-bold"
                  style={{ background: 'rgba(168,85,247,0.15)', color: '#A855F7' }}>
                  NV
                </div>
                <div>
                  <h3 className="text-heading-lg font-display text-text-primary">{nvidia.name}</h3>
                  <p className="text-body-sm text-text-muted">{nvidia.hq}</p>
                </div>
              </div>
              <div className="text-data-lg font-mono mb-2" style={{ color: '#A855F7' }}>{nvidia.revenue}</div>
              <p className="text-body-md text-text-secondary mb-4">{nvidia.segment}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {nvidia.products.map((p) => (
                  <span key={p} className="px-2.5 py-1 text-body-sm rounded-full border"
                    style={{ background: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.2)', color: '#E8E8EC' }}>
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-body-sm text-text-secondary">{nvidia.dependency}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {nvidia.stats!.map((s, i) => (
                <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-bg-base bg-opacity-50 rounded-lg p-4 border border-border-subtle"
                >
                  <div className="text-mono-sm text-text-muted mb-1">{s.label}</div>
                  <div className="text-data-md font-mono text-text-primary">{s.value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Other design firms grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {others.map((firm, i) => (
            <motion.div
              key={firm.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-5 hover:border-border-active transition-all duration-300 group"
              style={{ '--hover-glow': '0 0 40px rgba(168,85,247,0.08)' } as React.CSSProperties}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(168,85,247,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display text-sm font-bold"
                  style={{ background: 'rgba(168,85,247,0.1)', color: '#A855F7' }}>
                  {firm.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-heading-sm text-text-primary font-display truncate">{firm.name}</h4>
                  <p className="text-body-sm text-text-muted truncate">{firm.hq}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-data-md font-mono" style={{ color: '#A855F7' }}>{firm.revenue}</span>
                <span className="text-body-sm text-text-muted">/ yr</span>
              </div>
              <p className="text-body-sm text-text-secondary mb-3">{firm.segment}</p>
              <div className="flex flex-wrap gap-1.5">
                {firm.products.map((p) => (
                  <span key={p} className="px-2 py-0.5 text-body-sm rounded border border-border-subtle text-text-secondary bg-bg-surface">
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
