# AI算力布局地图 — 自动化数据更新架构方案

## 当前状态（前端静态站点）

当前部署的是**纯前端静态网站**，所有数据来自 `mockData.ts` 中的硬编码数据。
- ❌ 无法实现真正的API定期自动更新
- ❌ 需要手动修改代码 → 重新构建 → 重新部署
- ✅ 前端已具备每5分钟刷新UI的动画效果，但数据本身是静态的

---

## 目标架构：三层数据管道系统

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA SOURCE LAYER                          │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│  官方API     │  网页抓取    │  手动录入    │  模型估算          │
│  ASML财报    │  TrendForce  │  编辑审核    │  稀土配额预测      │
│  IEA报告     │  公司官网    │  政府公告    │  用电量预测        │
│  USGS数据    │  新闻发布    │  卫星图像    │  产能利用率        │
└──────┬───────┴──────┬───────┴──────┬───────┴──────────┬─────────┘
       │              │              │                  │
       ▼              ▼              ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   INGESTION PIPELINE                            │
│              (Apache Airflow / Temporal.io)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ API抓取  │  │ 爬虫任务 │  │ 人工审核 │  │ 模型计算     │   │
│  │ 5分钟/次 │  │ 1小时/次 │  │ 按需触发 │  │ 每日/每周    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       └──────────────┴──────────────┴───────────────┘           │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              VALIDATION & CROSS-VERIFICATION            │   │
│  │  - 多源数据比对  - 异常值检测  - 可信度评分             │   │
│  │  - 历史趋势校验  - 地理坐标验证  - 时间戳标记           │   │
│  └──────────────────────────┬──────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STORAGE LAYER                                │
├─────────────────────┬───────────────────────────────────────────┤
│  Time-Series DB     │  PostgreSQL + TimescaleDB                 │
│  - 历史数据快照      │  - 设施信息、企业信息                      │
│  - 趋势分析         │  - 关系型查询                              │
├─────────────────────┼───────────────────────────────────────────┤
│  Cache Layer        │  Redis Cluster                            │
│  - 热点数据缓存      │  - 5分钟TTL                               │
│  - 实时查询加速      │  - 地理空间索引                            │
├─────────────────────┼───────────────────────────────────────────┤
│  Object Storage     │  S3/MinIO                                 │
│  - 原始文档存档      │  - 财报PDF、政府文件                       │
│  - 历史快照备份      │  - 审计日志                                │
└─────────────────────┴───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY                                 │
│              (Kong / AWS API Gateway)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ REST API │  │GraphQL   │  │WebSocket │  │  Export API  │   │
│  │ 读/查询  │  │灵活查询  │  │实时推送  │  │ CSV/JSON     │   │
│  │ 限流保护 │  │字段选择  │  │数据更新  │  │ 历史数据     │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
└───────┼──────────────┼──────────────┼───────────────┼───────────┘
        │              │              │               │
        ▼              ▼              ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND CLIENT                              │
│              (React + Mapbox/ECharts)                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Auto-Refresh Engine                                      │ │
│  │  - 每5分钟轮询API更新数据                                  │ │
│  │  - WebSocket接收实时推送                                   │ │
│  │  - 本地缓存 + 增量更新                                     │ │
│  │  - 离线模式支持                                            │ │
│  │  - 数据版本控制（对比历史快照）                             │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 核心更新频率设计

| 数据类别 | 更新频率 | 更新方式 | 触发条件 |
|----------|----------|----------|----------|
| 算力中心状态 | 每5分钟 | API轮询 + WebSocket | 定时器 + 事件推送 |
| 企业财报数据 | 每季度 | 手动触发 + API抓取 | 财报发布日期 |
| 政策文件 | 实时 | WebSocket推送 | 政府发布事件 |
| 稀土配额 | 每年 | 手动审核后更新 | 官方公告 |
| 用电量数据 | 每月 | API抓取 | IEA/USGS月度发布 |
| 地图坐标 | 按需 | 人工验证后更新 | 新设施确认 |
| 历史快照 | 每24小时 | 自动归档 | 定时任务 |

---

## 前端自动刷新实现

```typescript
// src/hooks/useAutoRefresh.ts
import { useEffect, useRef, useState } from 'react';

interface UseAutoRefreshOptions {
  intervalMs?: number;      // 默认5分钟
  onUpdate?: (data: any) => void;
  enableWebSocket?: boolean;
}

export function useAutoRefresh<T>(
  fetchFn: () => Promise<T>,
  options: UseAutoRefreshOptions = {}
) {
  const { intervalMs = 300000, onUpdate, enableWebSocket = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // REST API 轮询
  useEffect(() => {
    const refresh = async () => {
      setIsLoading(true);
      try {
        const result = await fetchFn();
        setData(result);
        setLastUpdated(new Date());
        setNextRefresh(new Date(Date.now() + intervalMs));
        onUpdate?.(result);
      } catch (err) {
        console.error('Refresh failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    refresh(); // 首次加载
    timerRef.current = setInterval(refresh, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [intervalMs]);

  // WebSocket 实时推送
  useEffect(() => {
    if (!enableWebSocket) return;
    
    const ws = new WebSocket('wss://api.aicomputemap.org/v1/ws');
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.type === 'DATA_UPDATE') {
        setData(update.payload);
        setLastUpdated(new Date());
        onUpdate?.(update.payload);
      }
    };
    wsRef.current = ws;
    return () => ws.close();
  }, [enableWebSocket]);

  return { data, lastUpdated, nextRefresh, isLoading };
}
```

---

## 增量更新策略

```typescript
// src/utils/incrementalUpdate.ts

interface DataVersion {
  version: string;      // 语义化版本 v1.2.3
  timestamp: string;    // ISO 8601
  checksum: string;     // SHA-256
  changes: ChangeLog[];
}

interface ChangeLog {
  entity: string;       // 'datacenter' | 'foundry' | 'supply'
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  fields: string[];     // 变更字段列表
  before?: any;
  after?: any;
}

// 增量更新：只拉取变更，而非全量数据
export async function fetchIncrementalUpdate(
  lastVersion: string
): Promise<{ version: DataVersion; patches: ChangeLog[] }> {
  const response = await fetch(
    `https://api.aicomputemap.org/v1/sync?since=${lastVersion}`
  );
  return response.json();
}

// 本地缓存 + 增量合并
export function mergeChanges(
  localData: Map<string, any>,
  patches: ChangeLog[]
): Map<string, any> {
  const merged = new Map(localData);
  for (const patch of patches) {
    switch (patch.action) {
      case 'CREATE':
      case 'UPDATE':
        merged.set(patch.id, patch.after);
        break;
      case 'DELETE':
        merged.delete(patch.id);
        break;
    }
  }
  return merged;
}
```

---

## 数据可信度评分系统

```typescript
// src/utils/credibilityScore.ts

interface CredibilityFactors {
  sourceTier: 1 | 2 | 3;           // 来源层级
  verificationCount: number;        // 交叉验证次数
  ageHours: number;                 // 数据年龄
  sourceDiversity: number;          // 来源多样性 (1-3)
  historicalConsistency: number;    // 历史一致性 (0-1)
}

export function calculateCredibilityScore(factors: CredibilityFactors): number {
  const weights = {
    sourceTier: 0.30,
    verificationCount: 0.20,
    ageHours: 0.15,
    sourceDiversity: 0.15,
    historicalConsistency: 0.20,
  };

  const sourceScore = factors.sourceTier === 1 ? 1.0 : 
                       factors.sourceTier === 2 ? 0.7 : 0.4;
  const verificationScore = Math.min(factors.verificationCount / 3, 1.0);
  const ageScore = Math.max(0, 1 - factors.ageHours / (30 * 24)); // 30天衰减
  const diversityScore = factors.sourceDiversity / 3;

  return Math.round(
    (sourceScore * weights.sourceTier +
     verificationScore * weights.verificationCount +
     ageScore * weights.ageHours +
     diversityScore * weights.sourceDiversity +
     factors.historicalConsistency * weights.historicalConsistency) * 100
  );
}

// 数据可信度颜色标识
export function getCredibilityColor(score: number): string {
  if (score >= 90) return '#22C55E'; // 绿色 - 高度可信
  if (score >= 70) return '#3B82F6'; // 蓝色 - 基本可信
  if (score >= 50) return '#F59E0B'; // 橙色 - 仅供参考
  return '#EF4444';                   // 红色 - 可信度低
}
```

---

## 开源部署方案（最小可行架构）

### 方案A：Serverless（低成本起步）

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 前端：静态托管
  frontend:
    image: nginx:alpine
    volumes:
      - ./dist:/usr/share/nginx/html
    ports:
      - "80:80"

  # API服务
  api:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/aicomputemap
      - REDIS_URL=redis://cache:6379
    ports:
      - "3001:3001"

  # 数据管道
  pipeline:
    build: ./pipeline
    environment:
      - API_ENDPOINT=http://api:3001
      - SCHEDULE=*/5 * * * *  # 每5分钟
    depends_on:
      - api
      - db

  # 数据库
  db:
    image: timescale/timescaledb:latest-pg15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=aicomputemap

  # 缓存
  cache:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  # 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl

volumes:
  postgres_data:
  redis_data:
```

### 方案B：纯GitHub Actions（零成本）

```yaml
# .github/workflows/data-update.yml
name: Daily Data Update

on:
  schedule:
    - cron: '*/5 * * * *'  # 每5分钟
  workflow_dispatch:        # 手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run data scrapers
        run: |
          pip install -r scripts/requirements.txt
          python scripts/update_data.py
      
      - name: Run validation
        run: python scripts/validate_data.py
      
      - name: Build and deploy
        run: |
          npm ci
          npm run build
          npm run deploy
```

---

## 开发者可参与的模块

| 模块 | 技术栈 | 难度 | 说明 |
|------|--------|------|------|
| 数据抓取器 | Python + Scrapy | 中级 | 各数据源定制爬虫 |
| 数据验证器 | Python + Pandas | 初级 | 数据质量检查 |
| API服务 | Node.js/Go + PostgreSQL | 高级 | RESTful/GraphQL/WebSocket |
| 前端实时组件 | React + SWR | 中级 | 自动刷新 + 增量更新 |
| 可信度引擎 | Python + ML | 高级 | 数据可信度评分模型 |
| 历史归档 | TimescaleDB | 中级 | 时间序列数据管理 |
| 可视化地图 | Mapbox GL | 中级 | 3D地图 + 热力图 |
| 贡献审核 | React + Workflow | 初级 | 社区贡献审核流程 |

---

## 实施路线图

```
Phase 1 (立即):  前端静态数据 + GitHub Actions定时更新
Phase 2 (1-2月): 后端API服务 + 数据库 + 自动抓取
Phase 3 (2-3月): WebSocket实时推送 + 增量更新
Phase 4 (3-6月): 社区贡献系统 + 可信度引擎
Phase 5 (6-12月): AI预测模型 + 全球覆盖
```
