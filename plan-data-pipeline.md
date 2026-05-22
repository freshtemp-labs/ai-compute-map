# 数据抓取管道 — 立即实施计划

## 核心原则
"没有抓取能力的5分钟刷新是欺骗用户。必须现在建立。"

## 技术架构（沙箱可运行 + GitHub Actions自动部署）

```
抓取层:     Python + requests + BeautifulSoup
           ├── scripts/fetchers/rare_earth.py  → USGS/中国稀土行业协会
           ├── scripts/fetchers/lithography.py  → ASML/Canon/Nikon财报
           ├── scripts/fetchers/foundry.py      → 台积电/三星/英特尔财报
           ├── scripts/fetchers/datacenter.py   → 云厂商地域节点/东数西算
           └── scripts/fetchers/energy.py       → IEA电力数据

验证层:     scripts/validate.py
           ├── 坐标合理性检查（经纬度范围）
           ├── 数值范围校验（功率>0, PUE>1.0）
           ├── 必填字段检查
           └── 交叉验证（多源数据比对）

存储层:     public/data/
           ├── datacenters.json      （算力中心，自动更新）
           ├── foundries.json        （封装工厂，自动更新）
           ├── supply-chain.json     （供应链，自动更新）
           ├── sources.json          （数据来源，手动维护）
           └── metadata.json        （更新时间戳/版本）

前端层:     src/hooks/useLiveData.ts
           ├── 页面加载时 fetch('/data/xxx.json')
           ├── setInterval 300000ms (5分钟) 重新拉取
           ├── localStorage缓存 + 增量对比
           └── 最后更新时间显示

定时层:     .github/workflows/update-data.yml
           ├── schedule: */5 * * * *（实际设为 daily，5分钟太频繁消耗CI额度）
           ├── 运行所有fetcher
           ├── 运行validate
           ├── git commit + push
           └── 触发pages-build-deploy
```

## Stage 1 — Python抓取基础设施（立即）
## Stage 2 — 各数据源fetcher（并行）
## Stage 3 — 数据验证引擎
## Stage 4 — 前端动态加载改造
## Stage 5 — GitHub Actions工作流
## Stage 6 — 构建部署
