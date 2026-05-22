# AI 算力地图 (AI Compute Map)

一个交互式的全球 AI 算力基础设施可视化平台，追踪从稀土矿产到数据中心的完整半导体供应链。

## 🌐 项目简介

AI 算力地图提供全球半导体供应链的全景视图，覆盖三大核心层级：

- **供应链层 (Supply Chain)** — 稀土元素、光刻设备、芯片设计公司
- **封装工厂层 (Foundry)** — TSMC、Samsung、Intel、SMIC 等晶圆代工厂
- **算力中心层 (Data Center)** — 全球 AI 计算集群与云数据中心

## 🛠 技术栈

- **前端框架**: React 19 + TypeScript 5.9
- **构建工具**: Vite 7
- **样式方案**: Tailwind CSS 3 + CSS Variables (自定义暗色主题)
- **图表库**: ECharts 5 + Recharts 2
- **地图**: amCharts 5
- **动画**: Framer Motion
- **路由**: React Router 7
- **国际化**: i18next (支持中/英文)
- **UI 组件**: Radix UI + shadcn/ui

## ✨ 功能列表

- 🗺 交互式世界地图，标注全球算力设施位置
- 📊 实时数据仪表盘（KPI、趋势图、市场份额）
- 🏭 半导体代工厂对比矩阵（制程节点、产能、营收）
- ⚡ 供应链追踪（稀土、光刻、设计、能源）
- 📈 数据中心能耗与增长预测
- 🔍 全文搜索与多维筛选（国家、类型、层级）
- 📥 支持 CSV / JSON 数据导出
- 🌍 中英文双语界面

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/freshtemp-labs/ai-compute-map.git
cd ai-compute-map/app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
npm run preview  # 预览构建结果
```

## 🧪 测试

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch
```

## 📁 项目结构

```
app/
├── src/
│   ├── components/
│   │   ├── foundries/     # 代工厂子组件
│   │   ├── map/           # 地图组件
│   │   ├── supply-chain/  # 供应链组件
│   │   └── ui/            # 通用 UI 组件 (shadcn/ui)
│   ├── data/
│   │   └── mockData.ts    # 数据源（单一数据真相源）
│   ├── hooks/             # 自定义 Hooks
│   ├── i18n/              # 国际化配置
│   ├── pages/             # 页面组件
│   ├── types/             # TypeScript 类型定义
│   └── main.tsx           # 入口文件
├── public/                # 静态资源
└── package.json
```

## 🚢 部署

本项目为纯前端应用，可部署到任意静态托管服务：

```bash
npm run build
# 将 dist/ 目录部署到 Vercel / Netlify / GitHub Pages
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/your-feature`
3. 提交更改: `git commit -m 'feat: add your feature'`
4. 推送分支: `git push origin feature/your-feature`
5. 提交 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式组件 + Hooks
- 数据统一维护在 `mockData.ts`

## 📄 许可证

MIT License
