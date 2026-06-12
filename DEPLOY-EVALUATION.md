# AI算力地图 — 替代部署方案评估

**评估日期:** 2026-06-08
**项目:** AI算力布局地图 (React/TypeScript/Vite)
**当前状态:** Cloudflare Pages 配置就绪，但因缺少 CLOUDFLARE_API_TOKEN 未部署
**构建产物:** ~13MB dist/，8种语言，阿拉伯语RTL支持

---

## 三方平台对比

### 1. Cloudflare Pages（当前方案）

| 指标 | 数值 |
|------|------|
| **月费** | 免费（无限带宽！） |
| **构建限制** | 500次/月，并发1个，超时20分钟 |
| **文件限制** | 20,000个文件，单文件25MB |
| **自定义域名** | 免费100个 |
| **带宽** | ⭐ 无限（免费计划无带宽限制） |
| **SPA支持** | ✅ 需配置 _redirects 或 wrangler.toml |
| **全球CDN** | ✅ Cloudflare 全球边缘网络 |
| **HTTPS** | ✅ 自动 |
| **预览部署** | ✅ 无限 |
| **CLI工具** | `wrangler` (npm) |
| **部署速度** | 快（~30秒构建+部署） |
| **Git集成** | ✅ GitHub/GitLab 自动部署 |

**优势:**
- 唯一真正无限免费带宽的平台
- CDN 质量全球顶级（Cloudflare 自有网络）
- 构建超快（项目仅9秒）
- Workers/Future Functions 可扩展
- 适合流量不可预测的项目

**劣势:**
- 需要 API Token（当前阻塞点）
- CLI 部署需要额外配置
- 不支持 serverless functions（需用 Workers，学习曲线略高）
- 阿拉伯语 RTL 问题已修复（CSS overrides 已就绪）

**部署命令:**
```bash
# 方式1: Git 集成（推荐）
# 在 Cloudflare Dashboard 连接 GitHub repo，自动部署

# 方式2: Wrangler CLI
export CLOUDFLARE_API_TOKEN=your_token
npm run deploy --prefix app
```

---

### 2. Vercel

| 指标 | 数值 |
|------|------|
| **月费** | 免费 Hobby 计划 |
| **构建限制** | 6,000分钟/月，45分钟/次超时 |
| **文件限制** | 源文件100MB上传限制，无输出文件硬限制 |
| **自定义域名** | 免费50个 |
| **带宽** | 100GB/月（超出后无法使用免费计划） |
| **SPA支持** | ✅ 原生支持，零配置 |
| **全球CDN** | ✅ Vercel Edge Network |
| **HTTPS** | ✅ 自动 |
| **预览部署** | ✅ 每PR自动生成预览链接 |
| **CLI工具** | `vercel` (npm) |
| **部署速度** | 快（~15-30秒） |
| **Git集成** | ✅ GitHub/GitLab/Bitbucket 自动部署 |

**优势:**
- **零配置部署** — Vite 项目自动检测，无需任何配置文件
- Preview 部署体验最佳（每 PR 一个链接）
- 对 React/Vite 项目原生支持最好
- 不需要额外 API Token（GitHub OAuth 即可）
- 构建速度快，缓存智能
- 不限制并发构建（Hobby 限1个）

**劣势:**
- ⚠️ **100GB/月带宽限制** — 超出后自动停服务
- Hobby 计划禁止商业用途（ToS 限制）
- 隐藏费用多（Edge Requests、ISR、图片优化等）
- 超出免费额度后必须升级到 $20/月
- 超出带宽后无警告直接暂停，风险高

**部署命令:**
```bash
# 方式1: Git 推送自动部署（连接 GitHub repo）
# 方式2: CLI 部署
npm i -g vercel
cd app && vercel --prod
```

**适配工作量:** ⭐ 最小 — 只需删除 wrangler.toml，Vercel 自动识别 Vite

---

### 3. Netlify

| 指标 | 数值 |
|------|------|
| **月费** | 免费 Starter 计划 |
| **构建限制** | 300分钟/月 |
| **文件限制** | 每站点无硬限制（但有部署大小限制） |
| **自定义域名** | 免费无限 |
| **带宽** | 100GB/月 |
| **SPA支持** | ✅ 自动检测，零配置 |
| **全球CDN** | ✅ Netlify CDN |
| **HTTPS** | ✅ 自动 |
| **预览部署** | ✅ 无限 |
| **CLI工具** | `netlify-cli` (npm) |
| **部署速度** | 中等（~30-60秒） |
| **Git集成** | ✅ GitHub/GitLab/Bitbucket |

**优势:**
- **部署体验最成熟** — Netlify Drop 拖拽部署
- 自定义域名免费无限
- Form 处理内置（静态表单无需后端）
- Split Testing（A/B测试）内置
- 社区最大，文档最全

**劣势:**
- ⚠️ **构建分钟数最少**（300分钟/月）
- 100GB/月带宽限制（超出自动扣费 $20/100GB）
- **超出免费额度会自动扣费**（不会暂停服务！这是最大风险）
- 2026年9月后新用户采用信用额度模型，计费更复杂
- CDN 质量不如 Cloudflare/Vercel

**部署命令:**
```bash
# 方式1: Git 连接自动部署
# 方式2: CLI 部署
npm i -g netlify-cli
cd app && netlify deploy --prod --dir=dist
```

**适配工作量:** ⭐ 最小 — 只需删除 wrangler.toml

---

## 综合对比表

| 维度 | Cloudflare Pages | Vercel | Netlify |
|------|-----------------|--------|---------|
| **免费带宽** | ⭐ 无限 | 100GB/月 | 100GB/月 |
| **构建限制** | 500次/月 | 6000分钟/月 | 300分钟/月 |
| **部署速度** | 快（~30s） | 最快（~15s） | 中等（~60s） |
| **配置复杂度** | 需要 API Token | 零配置 | 零配置 |
| **SPA支持** | 需配置 | 原生 | 原生 |
| **CDN质量** | ⭐ 全球顶级 | 优秀 | 良好 |
| **超出额度** | 不收费 | 暂停服务 | 自动扣费 ⚠️ |
| **Preview部署** | ✅ 无限 | ✅ 每PR | ✅ 无限 |
| **自定义域名** | 100个 | 50个 | 无限 |
| **serverless** | Workers（另学） | Functions（内置） | Functions（内置） |
| **社区/文档** | 好 | 最好 | 最好 |
| **风险等级** | 低 | 中（超量暂停） | 高（超量扣费） |

---

## 推荐方案

### 🏆 推荐：保持 Cloudflare Pages

**理由：**
1. **无限免费带宽** — AI算力地图含大量JSON数据和图片，流量不可预测，100GB限制可能不够
2. **CDN质量最好** — Cloudflare 全球边缘网络，全球访问速度最快
3. **零费用风险** — 超出额度不会暂停也不会扣费
4. **配置已完成** — wrangler.toml、RTL CSS、部署脚本全部就绪
5. **项目规模适中** — 13MB构建产物，远低于25MB/文件和20000文件限制

**阻塞点解决：**
```
获取 Cloudflare API Token 的步骤：
1. 登录 https://dash.cloudflare.com/profile/api-tokens
2. 创建 Token → 选择 "Cloudflare Pages: Edit" 模板
3. 设置权限：Account > Cloudflare Pages > Edit
4. 将 token 告诉我或设置为环境变量
```

### 🥈 备选：Vercel

**适用场景：**
- 如果不想注册 Cloudflare 账号
- 如果只需要短期演示/原型展示
- 如果预期月流量 < 50GB

**迁移工作量：** ~15分钟
1. 删除 `app/wrangler.toml`
2. 修改 `vite.config.ts` 的 `base` 为 `'/'`（Vercel 部署在根路径）
3. 连接 GitHub repo → 自动部署

### 🥉 不推荐：Netlify

**原因：**
- 构建分钟数最少（300分钟/月），对我们9秒的构建够用但余量小
- **超出额度会自动扣费** — 这是最不友好的政策
- CDN 质量最差

---

## 迁移方案（如果选 Vercel）

```bash
# 1. 修改 vite.config.ts — base 改为 '/'
# （Vercel 部署在根路径，不需要 /ai-compute-map/ 前缀）

# 2. 删除 wrangler.toml

# 3. 修改 package.json deploy 脚本
# 移除 wrangler 相关，改为 vercel

# 4. 连接 GitHub
# 在 vercel.com 导入 freshtemp-labs/ai-compute-map 仓库
# 自动检测 Vite，零配置部署
```

**注意事项：**
- Vercel Hobby 计划禁止商业用途
- 如果未来项目需要盈利，必须升级到 Pro ($20/月)
- 带宽超 100GB 会被暂停，无警告

---

## 最终建议

**获取 Cloudflare API Token 是最小阻力路径。** 所有代码已就绪，只需一个 token 就能完成部署。Vercel 虽然零配置但带宽限制是隐患。Netlify 的自动扣费政策对个人项目不友好。

如果老板同意 Cloudflare 方案，只需：
1. 创建 Cloudflare 账号（免费）
2. 生成 API Token
3. 运行 `npm run deploy --prefix app` 即可上线

**预计总耗时：5分钟。**
