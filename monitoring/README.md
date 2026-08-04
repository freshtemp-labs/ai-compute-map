# A股 SALP 规则每日监控清单 — Agent 接入指南

版本：1.0.0 · 更新：2026-08-02
面向：Hermes Agent / OpenClaw 或任何可读取 JSON 并执行每日任务的 agent 运行时。
**本清单为主题研究监控工具，不构成投资建议。**

---

## 文件构成

| 文件 | 角色 | 消费方 |
|------|------|--------|
| `ashare-watchlist.json` | 监控主清单：92 只 A 股标的（AAAAA–E 共 25 级）、15 条赛道、10 条 SALP 规则、18 个告警触发器、覆盖频率策略 | agent 每日加载 |
| `salp-monitoring-rules.md` | SALP 投资框架 → 监控规则的人类可读手册（含每日 SOP） | 人 / agent 的 prompt 上下文 |
| `daily-digest.schema.json` | 每日输出契约（JSON Schema） | agent 输出校验 |

## 快速接入（以 OpenClaw / Hermes 为例）

1. **把清单交给 agent**：将 `ashare-watchlist.json` 放入 agent 可读取的工作目录，并在其任务 prompt 中引用：
   ```
   每日 A 股收盘后（15:40 CST 之后）执行监控任务：
   1. 读取 ashare-watchlist.json，遵守其中 salpRules（R1–R10）
   2. 先执行政策源扫描（R9），再按 cadencePolicy 确定当日覆盖集合
   3. 对覆盖标的采集核心字段信号，评估 alertTriggers
   4. 输出严格符合 daily-digest.schema.json 的 digest JSON，
      写入 ./digests/YYYY-MM-DD.json
   ```
2. **定时触发**：在 agent 运行时中配置 cron（建议 `40 7 * * 1-5` UTC，即北京时间 15:40，A 股收盘后；避开整点/半点）。P0 政策事件由触发器即时打断，不依赖定时。
3. **输出校验**：agent 产出 digest 后用 `daily-digest.schema.json` 做 schema 校验，不合格即重跑。

## 覆盖节奏（cadencePolicy）

| 日 | 覆盖集合 | 只数 |
|----|----------|------|
| 每个交易日 | tier A + B | 32 |
| 周一追加 | tier C | +20 |
| 每月首个交易日追加 | tier D | +20 |
| 每季度首月追加 | tier E + 全量层级复核 | +20 |
| 任意时刻 | POL 横切维度（政策事件即时） | 全部 |

## 十条硬性规则（摘要，全文见规则手册）

- **R1 物理口径**：只记 MW/台/端口/吨/交期；股价市值永不为产能信号
- **R2 瓶颈优先**：NET/SRV/CLG/PWR/MEM/PKG 优先分配监控资源
- **R3 电力分级**：planned → secured → interconnected → energized → firm IT load
- **R4 证据分级**：一级公告 > 二级监管/招标 > … > 六级媒体；低等级证据不触发 P0/P1
- **R5 共识提级**：≥2 独立来源同向 → 生成层级复核候选
- **R6 衍生品不解读方向**；**R7 持仓信号一律视为历史快照**
- **R8 训练≠推理**；**R9 政策事件即时触发**；**R10 容量必须交叉验证合同**

## 告警等级与 SLA

| 等级 | 含义 | SLA | 最低证据等级 |
|------|------|-----|--------------|
| P0 | 政策突变 / 重大合同签署或终止 / 出口管制 | 即时 | 一级 |
| P1 | 订单、交期、稼动率、签约 MW 显著异动 | 当日 digest | 二级 |
| P2 | 连续两期同向趋势变化 | 周报 | 三级 |
| P3 | 层级重评候选 | 季度复核 | 多来源共识 |

## 层级体系速查

```
AAAAA AAAA AAA AA A      L1–L5   核心关联（光互连/机架/液冷/加速器/变压器龙头）
BBBBB BBBB BBB BB B      L6–L10  强关联（设备/封装/代工/电源/存储材料）
CCCCC CCCC CCC CC C      L11–L15 中等关联（封测/IDC/电网/备电/温控二线）
DDDDD DDDD DDD DD D      L16–L20 弱关联（核电/稀土/铜缆材料/光刻间接）
EEEEE EEEE EEE EE E      L21–L25 边缘相关（硅片/EDA/FPGA/边缘云/燃料）
```

## 维护

- **标的增删**：新标的加入需先按 `research/ashare-target-25-tier-mapping-2026-08.md` 的方法定级，再写入 manifest 并升 `manifestVersion`。
- **季度复核**：按 `tierReview` 条件处理 digest 中累积的 `tierReviewCandidates`，通过后更新 level/tier 字段。
- **规则变更**：R1–R10 的修订需同步更新 `salp-monitoring-rules.md` 与 manifest 的 `salpRules`，保持 id 稳定。
