/**
 * @file SupplyChainSankey.tsx
 * @description Sankey diagram showing supply chain flows from
 * raw materials → foundries → data centers. Uses ECharts sankey series.
 *
 * @dependencies echarts, echarts-for-react
 */
import ReactECharts from 'echarts-for-react';

const SANKEY_COLORS = {
  source: '#FFB84D',
  foundry: '#00D4FF',
  datacenter: '#A855F7',
};

interface SankeyNode {
  name: string;
  itemStyle?: { color: string };
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export default function SupplyChainSankey() {
  const nodes: SankeyNode[] = [
    // Raw materials / sources
    { name: '稀土 (中国)', itemStyle: { color: SANKEY_COLORS.source } },
    { name: '稀土 (澳大利亚)', itemStyle: { color: SANKEY_COLORS.source } },
    { name: '稀土 (美国)', itemStyle: { color: SANKEY_COLORS.source } },
    { name: '稀土 (缅甸)', itemStyle: { color: SANKEY_COLORS.source } },
    { name: '光刻机 (ASML)', itemStyle: { color: SANKEY_COLORS.source } },
    { name: '光刻机 (Nikon/Canon)', itemStyle: { color: SANKEY_COLORS.source } },
    { name: 'EDA 设计工具', itemStyle: { color: SANKEY_COLORS.source } },
    // Foundries
    { name: 'TSMC', itemStyle: { color: SANKEY_COLORS.foundry } },
    { name: 'Samsung', itemStyle: { color: SANKEY_COLORS.foundry } },
    { name: 'Intel', itemStyle: { color: SANKEY_COLORS.foundry } },
    { name: 'SMIC', itemStyle: { color: SANKEY_COLORS.foundry } },
    // Data centers
    { name: 'AWS 数据中心', itemStyle: { color: SANKEY_COLORS.datacenter } },
    { name: 'Azure 数据中心', itemStyle: { color: SANKEY_COLORS.datacenter } },
    { name: 'Google Cloud', itemStyle: { color: SANKEY_COLORS.datacenter } },
    { name: '中国算力中心', itemStyle: { color: SANKEY_COLORS.datacenter } },
  ];

  const links: SankeyLink[] = [
    // Rare earth → Foundries
    { source: '稀土 (中国)', target: 'TSMC', value: 120 },
    { source: '稀土 (中国)', target: 'Samsung', value: 80 },
    { source: '稀土 (中国)', target: 'Intel', value: 60 },
    { source: '稀土 (中国)', target: 'SMIC', value: 90 },
    { source: '稀土 (澳大利亚)', target: 'TSMC', value: 40 },
    { source: '稀土 (澳大利亚)', target: 'Samsung', value: 30 },
    { source: '稀土 (美国)', target: 'Intel', value: 50 },
    { source: '稀土 (缅甸)', target: 'TSMC', value: 35 },
    { source: '稀土 (缅甸)', target: 'SMIC', value: 25 },
    // Lithography → Foundries
    { source: '光刻机 (ASML)', target: 'TSMC', value: 100 },
    { source: '光刻机 (ASML)', target: 'Samsung', value: 70 },
    { source: '光刻机 (ASML)', target: 'Intel', value: 55 },
    { source: '光刻机 (ASML)', target: 'SMIC', value: 15 },
    { source: '光刻机 (Nikon/Canon)', target: 'SMIC', value: 30 },
    { source: '光刻机 (Nikon/Canon)', target: 'Samsung', value: 20 },
    // EDA → Foundries
    { source: 'EDA 设计工具', target: 'TSMC', value: 60 },
    { source: 'EDA 设计工具', target: 'Samsung', value: 40 },
    { source: 'EDA 设计工具', target: 'Intel', value: 45 },
    { source: 'EDA 设计工具', target: 'SMIC', value: 20 },
    // Foundries → Data centers
    { source: 'TSMC', target: 'AWS 数据中心', value: 150 },
    { source: 'TSMC', target: 'Azure 数据中心', value: 120 },
    { source: 'TSMC', target: 'Google Cloud', value: 110 },
    { source: 'Samsung', target: 'AWS 数据中心', value: 80 },
    { source: 'Samsung', target: 'Azure 数据中心', value: 60 },
    { source: 'Samsung', target: 'Google Cloud', value: 50 },
    { source: 'Intel', target: 'AWS 数据中心', value: 40 },
    { source: 'Intel', target: 'Azure 数据中心', value: 55 },
    { source: 'Intel', target: 'Google Cloud', value: 35 },
    { source: 'SMIC', target: '中国算力中心', value: 120 },
    { source: 'TSMC', target: '中国算力中心', value: 30 },
  ];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: 'rgba(10,10,15,0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      textStyle: { color: '#f0f0f0', fontSize: 12 },
      formatter: (params: { name?: string; data?: { source?: string; target?: string; value?: number } }) => {
        if (params.data?.source) {
          return `<strong>${params.data.source}</strong> → <strong>${params.data.target}</strong><br/>流量: ${params.data.value}`;
        }
        return `<strong>${params.name}</strong>`;
      },
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency',
        },
        nodeAlign: 'left',
        orient: 'horizontal',
        nodeWidth: 20,
        nodeGap: 12,
        draggable: true,
        label: {
          color: '#E8E8EC',
          fontSize: 11,
          fontFamily: 'monospace',
        },
        lineStyle: {
          color: 'gradient',
          opacity: 0.35,
          curveness: 0.5,
        },
        itemStyle: {
          borderWidth: 0,
        },
        data: nodes,
        links,
      },
    ],
  };

  return (
    <div className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle p-5">
      <h3 className="text-sm font-medium text-text-primary mb-2">
        供应链流向桑基图 — Supply Chain Sankey
      </h3>
      <p className="text-mono-sm text-text-muted mb-4">
        稀土/光刻机 → 封装工厂 → 算力中心 | 点击节点查看详情
      </p>
      <ReactECharts
        option={option}
        style={{ height: 420, width: '100%' }}
        opts={{ renderer: 'canvas' }}
        onEvents={{
          click: (params: { name?: string; data?: { source?: string; target?: string } }) => {
            if (params.name) {
              console.log('Sankey node clicked:', params.name);
            }
          },
        }}
      />
    </div>
  );
}
