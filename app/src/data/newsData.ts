/**
 * @file data/newsData.ts
 * @description AI算力基础设施相关的静态新闻/动态数据。
 * 每条数据包含标题(中英文)、日期、来源、摘要(中英文)和标签用于分类筛选。
 *
 * @dependencies 无外部依赖
 */

/** 新闻条目数据结构 */
export interface NewsItem {
  /** 唯一标识 */
  id: string;
  /** 英文标题 */
  title: string;
  /** 中文标题 */
  titleZh: string;
  /** 发布日期 */
  date: string;
  /** 来源媒体 */
  source: string;
  /** 英文摘要 */
  summary: string;
  /** 中文摘要 */
  summaryZh: string;
  /** 分类标签 */
  tags: string[];
  /** 原文链接 */
  url?: string;
}

/** 新闻筛选标签常量（全部/数据中心/晶圆代工/供应链/政策/投资/能源/AI芯片/光刻/稀土） */
export const NEWS_TAGS = [
  '全部',
  '数据中心',
  '晶圆代工',
  '供应链',
  '政策',
  '投资',
  '能源',
  'AI芯片',
  '光刻',
  '稀土',
] as const;

/** 新闻标签类型 */
export type NewsTag = typeof NEWS_TAGS[number];

/** AI算力基础设施新闻数据集（15条，2024-12至2025-05） */
export const newsData: NewsItem[] = [
  {
    id: 'n1',
    title: 'xAI Colossus Supercluster Reaches 100,000 NVIDIA H100 GPUs',
    titleZh: 'xAI Colossus 超级集群达到 100,000 块 NVIDIA H100 GPU',
    date: '2025-05-15',
    source: 'Reuters',
    summary: 'Elon Musk\'s xAI has completed the buildout of its Memphis-based Colossus supercomputer, now running 100,000 NVIDIA H100 GPUs with a total power capacity of 150 MW, making it one of the largest AI training clusters in the world.',
    summaryZh: '马斯克旗下 xAI 已完成位于孟菲斯的 Colossus 超级计算机建设，目前运行 100,000 块 NVIDIA H100 GPU，总功率容量达 150 MW，成为全球最大的 AI 训练集群之一。',
    tags: ['数据中心', 'AI芯片', '投资'],
    url: 'https://www.reuters.com',
  },
  {
    id: 'n2',
    title: 'TSMC Begins 2nm Mass Production at Kaohsiung Fab',
    titleZh: '台积电高雄厂启动 2nm 量产',
    date: '2025-05-10',
    source: 'Nikkei Asia',
    summary: 'TSMC has officially started mass production of its 2nm (N2) process node at Fab 18 in Kaohsiung, Taiwan. The new node promises 10-15% speed improvement and 25-30% power reduction over 3nm.',
    summaryZh: '台积电已正式在台湾高雄 Fab 18 启动 2nm (N2) 制程节点的量产。新节点相比 3nm 可提升 10-15% 速度、降低 25-30% 功耗。',
    tags: ['晶圆代工', 'AI芯片'],
    url: 'https://asia.nikkei.com',
  },
  {
    id: 'n3',
    title: 'China Sets 2025 Rare Earth Export Quota at 270,000 Tonnes',
    titleZh: '中国 2025 年稀土出口配额设定为 27 万吨',
    date: '2025-04-28',
    source: 'South China Morning Post',
    summary: 'China\'s Ministry of Industry and Information Technology has announced the 2025 rare earth mining quota at 270,000 tonnes, a 6.36% increase for light rare earths. The quota affects global semiconductor supply chains.',
    summaryZh: '中国工信部宣布 2025 年稀土开采配额为 27 万吨，轻稀土增长 6.36%。该配额影响全球半导体供应链。',
    tags: ['稀土', '供应链', '政策'],
    url: 'https://www.scmp.com',
  },
  {
    id: 'n4',
    title: 'Microsoft Announces $80B AI Data Center Investment for FY2025',
    titleZh: '微软宣布 2025 财年 800 亿美元 AI 数据中心投资',
    date: '2025-04-15',
    source: 'Microsoft Blog',
    summary: 'Microsoft plans to invest $80 billion in AI-enabled data centers in fiscal year 2025, with over half of the spending in the United States. Key expansion sites include Boydton (VA), San Antonio (TX), and new facilities in the Midwest.',
    summaryZh: '微软计划在 2025 财年投资 800 亿美元建设 AI 数据中心，其中超过一半用于美国。主要扩建地点包括弗吉尼亚州博伊顿、德克萨斯州圣安东尼奥及中西部新设施。',
    tags: ['数据中心', '投资', '能源'],
    url: 'https://blogs.microsoft.com',
  },
  {
    id: 'n5',
    title: 'ASML Reports Record Q1 2025 EUV System Shipments',
    titleZh: 'ASML 报告 2025 年第一季度 EUV 系统出货量创纪录',
    date: '2025-04-10',
    source: 'ASML Press Release',
    summary: 'ASML shipped a record number of EUV lithography systems in Q1 2025, driven by demand from TSMC, Samsung, and Intel for advanced node fabrication. Total Q1 revenue reached €7.7 billion.',
    summaryZh: '受台积电、三星和英特尔先进制程需求推动，ASML 在 2025 年第一季度 EUV 光刻系统出货量创纪录。第一季度总收入达 77 亿欧元。',
    tags: ['光刻', '晶圆代工', '供应链'],
    url: 'https://www.asml.com',
  },
  {
    id: 'n6',
    title: 'Google Breaks Ground on 200MW Data Center in UK',
    titleZh: '谷歌在英国破土动工 200MW 数据中心',
    date: '2025-03-28',
    source: 'Data Center Dynamics',
    summary: 'Google has begun construction on a new 200MW data center at Waltham Cross, UK. The facility will be powered by 100% renewable energy and is expected to be operational by mid-2026.',
    summaryZh: '谷歌已在英国 Waltham Cross 开始建设新的 200MW 数据中心。该设施将使用 100% 可再生能源，预计 2026 年中投入运营。',
    tags: ['数据中心', '能源', '投资'],
    url: 'https://www.datacenterdynamics.com',
  },
  {
    id: 'n7',
    title: 'NVIDIA Blackwell B200 GPU Enters Volume Production',
    titleZh: 'NVIDIA Blackwell B200 GPU 进入量产阶段',
    date: '2025-03-20',
    source: 'AnandTech',
    summary: 'NVIDIA\'s Blackwell B200 GPU is now in volume production at TSMC\'s 4nm process node. The chip features 208 billion transistors and delivers up to 20 PFLOPS of FP4 AI inference performance.',
    summaryZh: 'NVIDIA Blackwell B200 GPU 已在台积电 4nm 制程节点进入量产。该芯片拥有 2080 亿个晶体管，AI FP4 推理性能最高可达 20 PFLOPS。',
    tags: ['AI芯片', '晶圆代工'],
    url: 'https://www.anandtech.com',
  },
  {
    id: 'n8',
    title: 'EU Chips Act: €43B Committed, 10 New Fabs Planned',
    titleZh: '欧盟芯片法案：430 亿欧元已承诺，规划 10 座新晶圆厂',
    date: '2025-03-12',
    source: 'European Commission',
    summary: 'The European Commission reports that €43 billion in public and private investment has been committed under the EU Chips Act. Ten new semiconductor fabrication facilities are planned across Germany, France, Italy, and Spain.',
    summaryZh: '欧盟委员会报告称，欧盟芯片法案已吸引 430 亿欧元公共和私人投资。德国、法国、意大利和西班牙计划新建 10 座半导体制造工厂。',
    tags: ['政策', '晶圆代工', '投资'],
    url: 'https://ec.europa.eu',
  },
  {
    id: 'n9',
    title: 'IEA: Data Center Power Demand to Reach 945 TWh by 2030',
    titleZh: 'IEA：数据中心电力需求将在 2030 年达到 945 TWh',
    date: '2025-03-01',
    source: 'International Energy Agency',
    summary: 'The IEA\'s latest Global Energy Review projects data center electricity consumption will nearly double from 485 TWh in 2025 to 945 TWh by 2030, driven primarily by AI workloads. Nuclear and renewable energy are increasingly critical.',
    summaryZh: 'IEA 最新全球能源展望预测，受 AI 工作负载推动，数据中心电力消耗将从 2025 年的 485 TWh 翻倍至 2030 年的 945 TWh。核能和可再生能源日益关键。',
    tags: ['能源', '数据中心'],
    url: 'https://www.iea.org',
  },
  {
    id: 'n10',
    title: 'Samsung Announces $28B Taylor TX Fab Expansion',
    titleZh: '三星宣布 280 亿美元德克萨斯州泰勒工厂扩建计划',
    date: '2025-02-20',
    source: 'Samsung Newsroom',
    summary: 'Samsung Foundry has announced an additional $28 billion investment in its Taylor, Texas fabrication facility, expanding capacity for 2nm and 3nm process nodes. The expansion is expected to create 6,000 direct jobs.',
    summaryZh: '三星晶圆代工宣布在德克萨斯州泰勒制造工厂追加 280 亿美元投资，扩大 2nm 和 3nm 制程节点产能。预计此次扩建将创造 6,000 个直接就业岗位。',
    tags: ['晶圆代工', '投资', 'AI芯片'],
    url: 'https://news.samsung.com',
  },
  {
    id: 'n11',
    title: 'Lynas Rare Earths Secures $200M US DoD Contract',
    titleZh: 'Lynas 稀土获得 2 亿美元美国国防部合同',
    date: '2025-02-10',
    source: 'Australian Financial Review',
    summary: 'Australia\'s Lynas Rare Earths has secured a $200 million contract from the US Department of Defense to build a rare earth processing facility in Texas, reducing dependence on Chinese rare earth supplies.',
    summaryZh: '澳大利亚 Lynas 稀土公司获得美国国防部 2 亿美元合同，将在德克萨斯州建设稀土加工厂，减少对中国稀土供应的依赖。',
    tags: ['稀土', '供应链', '政策'],
    url: 'https://www.afr.com',
  },
  {
    id: 'n12',
    title: 'SMIC Achieves 5nm Yield Breakthrough Using DUV Multi-Patterning',
    titleZh: '中芯国际使用 DUV 多重图案化实现 5nm 良率突破',
    date: '2025-01-25',
    source: 'TrendForce',
    summary: 'SMIC has reportedly achieved improved yield rates for its 5nm process using deep ultraviolet (DUV) lithography with multi-patterning techniques, circumventing EUV restrictions. Industry analysts estimate yield at 50-60%.',
    summaryZh: '据报道，中芯国际利用深紫外 (DUV) 光刻多重图案化技术实现了 5nm 制程良率提升，绕过了 EUV 限制。业内分析师估计良率为 50-60%。',
    tags: ['晶圆代工', '光刻', '政策'],
    url: 'https://www.trendforce.com',
  },
  {
    id: 'n13',
    title: 'Meta Plans 1GW AI Data Center Campus in Louisiana',
    titleZh: 'Meta 计划在路易斯安那州建设 1GW AI 数据中心园区',
    date: '2025-01-18',
    source: 'The Information',
    summary: 'Meta is planning a massive 1GW AI data center campus in Richland Parish, Louisiana. The $10 billion project would be one of the largest single-site data center developments in history.',
    summaryZh: 'Meta 计划在路易斯安那州 Richland Parish 建设 1GW 大型 AI 数据中心园区。这个 100 亿美元的项目将成为历史上最大的单站点数据中心开发项目之一。',
    tags: ['数据中心', '投资', '能源'],
    url: 'https://www.theinformation.com',
  },
  {
    id: 'n14',
    title: 'Intel Foundry Secures Microsoft as Lead 18A Customer',
    titleZh: '英特尔代工获得微软作为 18A 首发客户',
    date: '2025-01-10',
    source: 'Bloomberg',
    summary: 'Intel has confirmed Microsoft as the lead customer for its Intel 18A process node. The deal is worth an estimated $15 billion over multiple years and validates Intel\'s foundry services strategy.',
    summaryZh: '英特尔已确认微软为其 Intel 18A 制程节点的首发客户。该交易估计价值 150 亿美元，验证了英特尔的代工服务战略。',
    tags: ['晶圆代工', 'AI芯片', '投资'],
    url: 'https://www.bloomberg.com',
  },
  {
    id: 'n15',
    title: 'AWS Announces $100B AI Infrastructure Investment Over Next Decade',
    titleZh: 'AWS 宣布未来十年 1000 亿美元 AI 基础设施投资',
    date: '2024-12-15',
    source: 'Amazon Blog',
    summary: 'Amazon Web Services announced plans to invest over $100 billion in AI infrastructure over the next decade, including new data centers with custom AI chips (Trainium and Inferentia) and expanded renewable energy procurement.',
    summaryZh: '亚马逊 AWS 宣布计划未来十年在 AI 基础设施上投资超过 1000 亿美元，包括配备定制 AI 芯片（Trainium 和 Inferentia）的新数据中心及扩大可再生能源采购。',
    tags: ['数据中心', '投资', 'AI芯片', '能源'],
    url: 'https://aws.amazon.com',
  },
];
