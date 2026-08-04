/**
 * @file types/index.ts
 * @description AI 算力地图应用的核心类型定义。
 * 定义了地图标注点、供应链条目、晶圆厂设施、数据中心、
 * KPI、公司和来源参考等所有数据接口。
 * @dependencies (none - type-only)
 */

/** 地图图层类型：供应链(supply)、晶圆厂(foundry)、数据中心(datacenter) */
export type LayerType = 'supply' | 'foundry' | 'datacenter';

/** 数据来源可信度等级：1=高可信, 2=中等, 3=低可信 */
export type SourceTier = 1 | 2 | 3;

/** 地图数据点（标注点）基础接口 */
export interface DataPoint {
  /** 唯一标识符 */
  id: string;
  /** 数据点名称 */
  name: string;
  /** 所属图层 */
  layer: LayerType;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 数值（字符串或数字） */
  value: string | number;
  /** 数值单位 */
  unit?: string;
  /** 分类 */
  category: string;
  /** 来源可信度等级 */
  sourceTier: SourceTier;
  /** 来源名称 */
  sourceName: string;
  /** 最后更新时间 */
  lastUpdated: string;
  /** 置信度（0-1） */
  confidence?: number;
}

/** 公司信息接口 */
export interface Company {
  /** 唯一标识符 */
  id: string;
  /** 公司名称 */
  name: string;
  /** 股票代码 */
  ticker?: string;
  /** 所属国家/地区 */
  country: string;
  /** 所属图层 */
  layer: LayerType;
  /** 市场份额（百分比） */
  marketShare?: number;
  /** 营收 */
  revenue?: number;
  /** 营收单位 */
  revenueUnit?: string;
  /** 员工数量 */
  employees?: number;
  /** 公司官网 */
  website?: string;
}

/** 晶圆厂/制造设施接口 */
export interface Facility {
  /** 唯一标识符 */
  id: string;
  /** 设施名称 */
  name: string;
  /** 所属公司 */
  company: string;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 所属国家/地区 */
  country: string;
  /** 所在城市 */
  city: string;
  /** 所属图层 */
  layer: LayerType;
  /** 设施类型 */
  type: string;
  /** 运行状态 */
  status: 'operational' | 'construction' | 'planned' | 'expansion';
  /** 产能 */
  capacity?: string;
  /** 制程节点 */
  processNode?: string;
  /** 成立/投产年份 */
  yearEstablished?: number;
  /** 员工数量 */
  employees?: number;
  /** 来源可信度等级 */
  sourceTier: SourceTier;
  /** 最后更新时间 */
  lastUpdated: string;
}

/** 数据中心接口 */
export interface DataCenter {
  /** 唯一标识符 */
  id: string;
  /** 数据中心名称 */
  name: string;
  /** 提供商 */
  provider: string;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 所属国家/地区 */
  country: string;
  /** 所在城市 */
  city: string;
  /** 所在区域 */
  region: string;
  /** 电力容量（MW） */
  powerCapacity?: number;
  /** 电力单位 */
  powerUnit?: string;
  /** 电能使用效率 PUE */
  pue?: number;
  /** 投入运营年份 */
  yearOperational?: number;
  /** 运行状态 */
  status: 'operational' | 'construction' | 'planned';
  /** 云服务提供商列表 */
  cloudProviders?: string[];
  /** 来源可信度等级 */
  sourceTier: SourceTier;
  /** 最后更新时间 */
  lastUpdated: string;
}

/** KPI（关键绩效指标）卡片接口 */
export interface KPI {
  /** 唯一标识符 */
  id: string;
  /** KPI 标签文字 */
  label: string;
  /** KPI 数值 */
  value: number;
  /** 数值单位 */
  unit: string;
  /** 变化量描述（如 "+12%"） */
  delta: string;
  /** 变化类型（正向/负向/中性） */
  deltaType: 'positive' | 'negative' | 'neutral';
  /** 强调色 */
  accentColor: string;
  /** 进度百分比 */
  progressPercent: number;
  /** 所属图层 */
  layer: LayerType;
}

/** 数据来源参考接口 */
export interface SourceReference {
  /** 唯一标识符 */
  id: string;
  /** 来源名称 */
  name: string;
  /** 可信度等级 */
  tier: SourceTier;
  /** 来源类型 */
  type: string;
  /** 来源 URL */
  url?: string;
  /** 最后更新时间 */
  lastUpdated: string;
  /** 来源描述 */
  description?: string;
}

/** 数据中心条目（用于列表展示） */
export interface DataCenterEntry {
  /** 唯一标识符 */
  id: number;
  /** 数据中心名称 */
  name: string;
  /** 提供商 */
  provider: string;
  /** 所属国家/地区 */
  country: string;
  /** 所在区域 */
  region: string;
  /** 电力容量（MW） */
  powerMW: number;
  /** 电能使用效率 PUE */
  pue: number;
  /** 投入运营年份 */
  year: number;
  /** 运行状态 */
  status: 'Operational' | 'Under Construction' | 'Planned';
  /** 能源组合 */
  energyMix: string;
  /** 所属图层 */
  layer: 'dataCenter';
}

/** 供应链条目接口 */
export interface SupplyChainEntry {
  /** 唯一标识符 */
  id: number;
  /** 条目名称 */
  name: string;
  /** 供应链类型 */
  type:
    | 'rare-earth'
    | 'lithography'
    | 'design'
    | 'energy'
    | 'accelerator'
    | 'memory'
    | 'packaging'
    | 'networking'
    | 'server-rack'
    | 'compute-campus'
    | 'power-cooling'
    | 'policy';
  /** 所属国家/地区 */
  country: string;
  /** 关键指标名称 */
  keyMetric: string;
  /** 指标数值 */
  value: string;
  /** 数据来源 */
  source: string;
  /** 层级 */
  tier: 'tier1' | 'tier2' | 'tier3';
  /** 更新时间 */
  updated: string;
}

/** 来源条目接口（用于来源管理页面） */
export interface SourceEntry {
  /** 唯一标识符 */
  id: number;
  /** 来源名称 */
  name: string;
  /** 分类 */
  category: string;
  /** 层级 */
  tier: 'tier1' | 'tier2' | 'tier3';
  /** 所属图层 */
  layer: string;
  /** 数据点数量 */
  dataPoints: number;
  /** 最后更新时间 */
  lastUpdated: string;
  /** 状态（活跃/待审核/过期） */
  status: 'active' | 'pending' | 'stale';
  /** 来源 URL */
  url?: string;
  /** 来源描述 */
  description?: string;
}

/** AI 算力观察项领域。与地图点不同，观察项用于记录尚未形成可定位设施数据的关键瓶颈。 */
export type ObservationDomain =
  | 'accelerator'
  | 'memory'
  | 'packaging'
  | 'networking'
  | 'server-rack'
  | 'compute-campus'
  | 'power-cooling'
  | 'materials'
  | 'policy';

/** AI 算力观察项：记录需要持续采集的指标、基金信号和可审计来源。 */
export interface ObservationItem {
  /** 唯一标识符 */
  id: string;
  /** 观察领域 */
  domain: ObservationDomain;
  /** 展示标题 */
  title: string;
  /** 优先级 */
  priority: 'critical' | 'high';
  /** 当前项目的覆盖状态 */
  coverage: 'missing' | 'partial';
  /** 该基金信号的证据层级，避免将持仓、私募披露与研究推断混为一谈 */
  evidenceLevel: '13F position' | '13G/13D stake' | 'company-confirmed private investment' | 'reported private investment' | 'thesis inference';
  /** 该领域为何影响可用 AI 算力 */
  rationale: string;
  /** Situational Awareness LP 披露所提供的相关信号；明确区分披露事实与推断 */
  fundSignal: string;
  /** 应持续采集的标准化指标 */
  watchMetrics: string[];
  /** 关联的公司、设施或产品 */
  entities: string[];
  /** 证据来源名称 */
  sourceName: string;
  /** 证据来源 URL */
  sourceUrl: string;
  /** 证据快照日期 */
  asOf: string;
}

/** 基金公开披露快照，用于在产品中说明观察框架的来源与局限。 */
export interface FundDisclosureProfile {
  /** 基金名称 */
  name: string;
  /** 申报表类型 */
  filingType: string;
  /** 申报日期 */
  filingDate: string;
  /** 持仓报告期末 */
  periodEnd: string;
  /** 信息表记录数（期权和普通股分别计行） */
  reportedRows: number;
  /** 不同发行人数量 */
  distinctIssuers: number;
  /** 13F 信息表的报告总值（美元） */
  reportedTableValueUsd: number;
  /** 13F 披露范围与局限 */
  disclosureLimit: string;
  /** 13F 报告期后、可能改变公开组合时效性的状态说明 */
  statusNote?: string;
  /** 状态说明的来源链接 */
  statusSourceUrl?: string;
  /** 一手来源链接 */
  sourceUrl: string;
}

/**
 * 可公开审计的 AI 基础设施主题基金/研究代理。
 *
 * 这些对象不与 Situational Awareness LP 的法律结构等同：它们多数是 ETF，
 * 但公开提供了投资说明书、季度评论或研究报告，适合作为监控覆盖的交叉视角。
 */
export interface ComparableFundProfile {
  /** 稳定 ID */
  id: string;
  /** 基金或研究代理名称 */
  name: string;
  /** 交易代码（如适用） */
  ticker?: string;
  /** 产品/载体类型 */
  vehicle: 'active thematic ETF' | 'passive thematic ETF' | 'global UCITS ETF' | 'thematic ETF / research note';
  /** 与 SALP 的可比性说明 */
  comparability: string;
  /** 公开材料归纳出的核心主张 */
  thesis: string;
  /** 与 SALP 公开信号重合的领域 */
  overlapAreas: string[];
  /** SALP 13F/已记录观察项未充分覆盖的领域 */
  nonOverlapAreas: string[];
  /** 作为证据的公开材料名称 */
  reportTitle: string;
  /** 公开材料链接 */
  reportUrl: string;
  /** 记录日期 */
  asOf: string;
}

/**
 * 来自同类基金公开材料的监控项。relation 明确表示它是验证 SALP 共识，
 * 还是因其他基金提供了不同视角而新增的监控覆盖。
 */
export interface FundMonitoringItem {
  id: string;
  relation: 'overlap' | 'non-overlap';
  domain: ObservationDomain;
  title: string;
  priority: 'critical' | 'high';
  coverage: 'missing' | 'partial';
  evidenceLevel: 'fund prospectus' | 'fund commentary' | 'public research report' | 'index methodology';
  fundIds: string[];
  rationale: string;
  fundSignal: string;
  watchMetrics: string[];
  entities: string[];
  sourceName: string;
  sourceUrl: string;
  asOf: string;
}

/** 图层信息接口（用于图层选择 UI） */
export interface LayerInfo {
  /** 图层类型 */
  type: LayerType;
  /** 英文标题 */
  title: string;
  /** 中文标签 */
  chineseLabel: string;
  /** 强调色 */
  accentColor: string;
  /** 发光渐变样式 */
  glowGradient: string;
  /** 图标名称 */
  icon: string;
  /** 图层描述 */
  description: string;
  /** 数据点数量 */
  dataPointCount: number;
  /** 路由路径 */
  route: string;
}
