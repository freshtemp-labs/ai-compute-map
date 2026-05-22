# 国际化(i18n)实施计划

## 目标
为AI算力布局地图添加完整的多国语言支持，覆盖所有8个页面和所有UI元素。

## 技术方案
- **react-i18next** — React标准i18n库，支持hooks、组件级翻译
- **i18next-browser-languagedetector** — 自动检测浏览器语言
- **i18next-localstorage-backend** — 本地存储语言偏好

## 支持语言
1. 中文 (zh-CN) — 默认
2. 英文 (en) — 全球
3. 日文 (ja) — 日本开发者友好
4. 韩文 (ko) — 韩国半导体行业（三星/海力士）

## 实施步骤

### Stage 1: i18n基础设施
- 安装 i18next, react-i18next, i18next-browser-languagedetector
- 创建 i18n 配置文件
- 创建语言文件目录结构

### Stage 2: 语言文件创建（4种语言）
- common.json — 通用UI（导航、按钮、状态、通用文本）
- home.json — 首页所有文本
- map.json — 地图页面
- supplyChain.json — 基础层
- foundries.json — 封装工厂层
- datacenters.json — 算力中心层
- sources.json — 数据来源
- history.json — 历史数据
- developers.json — 开发者文档

### Stage 3: 组件改造
- 修改 Navbar 添加语言选择器
- 修改所有页面组件使用 useTranslation
- 修改所有数据展示文本

### Stage 4: 构建部署
- 构建验证
- 部署
