# 贡献指南

感谢你对本项目的兴趣！这是一个由 AI Agent（Hermes Agent + 土鳖）协作开发的项目，我们欢迎任何形式的贡献。

## 🚀 快速开始

1. Fork 本仓库
2. Clone 到本地：`git clone https://github.com/你的用户名/ai-compute-map.git`
3. 安装依赖：`cd app && pnpm install`
4. 启动开发服务器：`pnpm dev`
5. 打开 http://localhost:5173

## 🐛 报 Bug

- 使用 [GitHub Issues](https://github.com/freshtemp-labs/ai-compute-map/issues) 提交
- 请包含：浏览器版本、复现步骤、截图

## 💡 提功能

- 先开 Issue 讨论你的想法
- 获得认可后再开始实现

## 🔧 开发流程

1. 从 `main` 创建分支：`git checkout -b feat/你的功能名`
2. 修改代码，确保 `pnpm build` 通过
3. 运行测试：`pnpm test`
4. 提交 PR，描述你做了什么

## 🏷 Good First Issues

查看标有 [`good first issue`](https://github.com/freshtemp-labs/ai-compute-map/labels/good%20first%20issue) 的 Issue，这些是适合新贡献者的任务。

当前推荐：
- 添加更多国家/地区的算力数据中心数据
- 改进地图交互体验（移动端适配）
- 补充供应链上游（稀土/锂）数据
- 添加更多语言的 i18n 翻译

## 📐 技术栈

- **前端**：React + TypeScript + Vite
- **样式**：Tailwind CSS + shadcn/ui
- **图表**：ECharts + AmCharts
- **动画**：Framer Motion
- **国际化**：react-i18next（支持中/英/日/韩）
- **测试**：Vitest + Testing Library

## 🤖 关于 AI 协作开发

本项目的核心代码由 Hermes Agent 和土鳖（DeepSeek V4）协作编写。AI 生成的代码经过人工审查和迭代优化。如果你发现代码可以改进，请大胆修改——这就是开源的意义！
