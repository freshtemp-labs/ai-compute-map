# Situational Awareness LP：公开披露与 AI 算力观察框架

更新日期：2026-08-02
用途：为 AI Compute Map 增加可验证的硬件与算力观察项；不构成投资建议。

## 结论

Situational Awareness LP 是 Leopold Aschenbrenner 在 2024 年围绕 AGI/超智能叙事成立的全球股票长短仓基金，而不是硬件 VC 或基础设施运营商。公开持仓呈现的核心观点是：AI 的稀缺资源不只是前沿模型和 GPU，还包括 **可并网的可靠电力、可上线的高密度算力园区、HBM/存储、光互连，以及把矿场或土地改造成 AI/HPC 容量的执行能力**。

其 13F 不能被理解为完整组合或净敞口。它披露的是特定报告期的美国上市多头证券和列示期权；现金、空头、掉期/多数衍生品、私募、非美证券及报告期后的交易均不在其中。项目只把它当作研究线索，绝不把证券市值当作工厂产能或数据中心 MW。

## 公开可验证的基金信息

- 创始人/投资负责人：Leopold Aschenbrenner，前 OpenAI Superalignment 研究员；基金名称来自其 2024 年文章 *Situational Awareness: The Decade Ahead*。
- 结构：其官网将其描述为 2024 年 9 月成立、投资受 AI 正负影响公司的投资顾问；SEC Form D/A 将境内载体列为 `Pooled Investment Fund / Hedge Fund`，而非 VC/PE。Core Scientific 的 13D/A 文件显示 Leopold 为管理合伙人/控制人、Carl Shulman 为共同投资组合经理，且 SAF AI GP LP 为基金 GP。
- 募资披露：截至 2026-03-10 的 Form D/A 显示，境内基金累计售出 LP interests $1.762B（93 位投资者），离岸基金累计 $198M（15 位投资者）。这是证券销售额，不是 AUM，也不可与 13F 表值相加。
- 策略：公开报道将其描述为以 AGI 为主题、在流动性公开市场表达观点的长短仓基金；重点覆盖半导体、算力基础设施和电力，并可能对可能落后的行业进行对冲。
- 已报道的支持者与研究团队：Fortune 报道的早期支持者包括 Nat Friedman、Daniel Gross、Patrick Collison 和 John Collison；Carl Shulman 任研究负责人。此类人物和 AUM 信息来自媒体报道，不是 SEC 13F 的披露项。
- 主文观点：该文章的核心假设是模型能力会继续随训练算力、数据和算法推进快速扩张，AGI/超智能将使计算资源、资本、能源和地缘安全成为战略变量。其时间表与预测是作者观点，不是事实或本项目预测。

## 13F 轨迹：公开组合增长，而非 AUM

下表为 SEC 信息表的 `tableEntryTotal` 与 `tableValueTotal`，每个季度为报告期末快照。最后一列是信息表总值，不等同基金 AUM、保证金后的净资产或净敞口。

| 报告期末 | 信息表行数 | 信息表总值 | 官方申报 |
| --- | ---: | ---: | --- |
| 2024-12-31 | 6 | $254.8M | [13F-HR](https://www.sec.gov/Archives/edgar/data/2045724/000093583625000120/xslForm13F_X02/primary_doc.xml) |
| 2025-03-31 | 12 | $1.01B | [13F-HR](https://www.sec.gov/Archives/edgar/data/2045724/000204572425000002/0002045724-25-000002-index.html) |
| 2025-06-30 | 9 | $2.12B | [13F-HR](https://www.sec.gov/Archives/edgar/data/2045724/000204572425000006/0002045724-25-000006-index.html) |
| 2025-09-30 | 28 | $4.14B | [13F-HR](https://www.sec.gov/Archives/edgar/data/2045724/000204572425000008/0002045724-25-000008-index.html) |
| 2025-12-31 | 29 | $5.52B | [13F-HR](https://www.sec.gov/Archives/edgar/data/2045724/000204572426000002/0002045724-26-000002-index.html) |
| 2026-03-31 | 42 | $13.68B | [13F-HR](https://www.sec.gov/Archives/edgar/data/2045724/000204572426000008/0002045724-26-000008-index.html) |

## 最新可用快照：2026 Q1

截至本研究日期，最新报告期为 2026-03-31、于 2026-05-18 提交的 [SEC 13F-HR](https://www.sec.gov/Archives/edgar/data/2045724/000204572426000008/0002045724-26-000008-index.html)。它含 42 条信息表记录、29 个不同发行人、合计 $13,676,657,577 的报告表值。完整的逐行证券、数量、期权标记和报告值见 [官方信息表](https://www.sec.gov/Archives/edgar/data/2045724/000204572426000008/salp13fq1xml.xml)。

其中非期权证券 26 行、报告值约 $3.856B；call 5 行、约 $1.362B；put 11 行、约 $8.459B。13F 中的期权 `value` 既不是权利金也不是 delta 调整后的净敞口，不能据此断言基金“净做空”某一行业；只能确认该报告期末持有列示的期权。

按物理产业链归纳，所有 29 个发行人如下（同一发行人可能同时出现普通股、call 与 put）：

| 主题 | 披露发行人 | 读法 |
| --- | --- | --- |
| AI 云、HPC 与矿场改造 | Applied Digital、Bitdeer、Bitfarms、CleanSpark、Core Scientific、CoreWeave、HIVE Digital、IREN、Riot Platforms、SharonAI、WhiteFiber | 关注已并网电力、园区、GPU 云和矿场转 AI/HPC 的执行能力。 |
| 供电与能源设备/服务 | Bloom Energy、Babcock & Wilcox、Power Solutions International、ProPetro、Solaris Energy Infrastructure、T1 Energy | 关注现场/分布式发电、能源设备和供能建设链，而非仅全国平均电价。 |
| 存储与互连 | Micron、SanDisk、Corning | HBM/存储与光纤互连是 GPU 可交付和集群可扩展的必要条件。 |
| 半导体与制造 | AMD、ASML、Broadcom、Intel、NVIDIA、Taiwan Semiconductor、VanEck Semiconductor ETF | 同时出现普通股、call 或 put；应把它解读为含期权的风险表达，不能等同方向性现货多头。 |
| 云/IT 对冲相关 | Oracle、Infosys | Q1 信息表含 put；13F 仍不能确认完整空头或净风险。 |

### 报告期后状态

Axios 于 2026-07-30 报道 SALP 已向 Citadel 出售其全部公开股票组合。此为报告期后的媒体信息，未由新的 13F 替代或逐项确认；因此产品将 2026 Q1 13F 标为**历史信号快照**，不能表示当前持仓或当前设施容量。

### 私募与报告期后重大持股信号

- Anthropic 的 [Series H 公告](https://www.anthropic.com/news/series-h) 将 SALP 列为 significant investor；金额、持股和算力采购均未披露。
- TechCrunch 报道 SALP 与 Jane Street 领投 [MatX $500M Series B](https://techcrunch.com/2026/02/24/nvidia-challenger-ai-chip-startup-matx-raised-500m/)。MatX 是自定义 AI 加速器线索，应追踪 tape-out 至量产，而非把融资额当作供给。
- [Nebius 13G](https://www.sec.gov/Archives/edgar/data/2045724/000093583626000303/primary_doc.xml) 披露 SALP 于 2026-05-19 报告的 5.6% 持股；[SharonAI 13G](https://www.sec.gov/Archives/edgar/data/2045724/000093583626000334/primary_doc.xml) 披露 2026-06-29 的 19.9% 持股（含受上限约束的认股权证）。二者均应记录为报告期后重大持股，不应推断为当前仓位或已投运容量。

## 本项目新增的观察项

| 观察域 | 需要采集的核心字段 | 为何优先 |
| --- | --- | --- |
| 加速器供给 | 型号、已/待交付数量、交期、ASP、出口许可、绑定的晶圆/HBM/封装 | MW 不能直接代表可用 AI 加速器。 |
| HBM 与存储 | HBM 月度堆叠产能、良率、客户分配、交期、企业级 NAND/SSD | 直接限制加速器交付、训练吞吐和检查点成本。 |
| 先进封装/基板 | CoWoS/SoIC/InFO、2.5D/3D、OSAT、ABF、良率、投产日 | 把先进晶圆和 HBM 变成 AI 系统的汇合瓶颈。 |
| 网络/光互连 | 800G/1.6T 端口、NIC/DPU、光模块、GPU 网络配比、fabric | 集群扩展受网络而非单颗 GPU 限制。 |
| 服务器/机架 | GPU 服务器交期、机架密度、PDU/UPS/busbar、验收周期 | 填补芯片与数据中心之间的实体集成层。 |
| Neocloud/矿场转 AI | 已并网/可用/已签约 MW、改造 MW、GPU 利用率、客户合同、债务 | “拥有矿场”不等于能交付 AI 算力。 |
| 电力/并网 | firm MW、并网状态、energization、变压器/输电、现场发电、PPA | 规划容量和真实 IT Load 的差异主要在这里。 |
| 冷却/用水 | 液冷比例、CDU/冷却塔交期、WUE、取水许可、气候风险 | 高密度 AI 机架使 PUE 单指标失真。 |
| 政策/资本风险 | 产品×原产地×目的地规则、客户集中度、CAPEX、债务、许可 | 决定供给能否合法、按时、可融资地变现。 |

这些条目已作为带来源链接的 `ObservationItem` 在供应链页展示，并明确标注为“缺失/需扩展覆盖”。后续在拥有设施级一手资料后，再把可定位、物理口径明确的条目写入地图节点；13F 的报告值不会进入地图点大小或产能字段。

## 来源与边界

1. [Situational Awareness LP — official site](https://situationalawarenesslp.com/)
2. [SEC — Situational Awareness LP filing index](https://www.sec.gov/edgar/browse/?CIK=2045724)
3. [SEC — 2026 Q1 13F-HR information table](https://www.sec.gov/Archives/edgar/data/2045724/000204572426000008/salp13fq1xml.xml)
4. [SEC — domestic Form D/A](https://www.sec.gov/Archives/edgar/data/2038540/000093583626000153/xslFormDX01/primary_doc.xml) and [offshore Form D/A](https://www.sec.gov/Archives/edgar/data/2048430/000093583626000154/xslFormDX01/primary_doc.xml)
5. [Situational Awareness: The Decade Ahead (author’s paper)](https://situational-awareness.ai/www/wp-content/uploads/2024/06/situationalawareness.pdf?stream=top)
6. [Fortune — fund strategy, public-reporting limitations and 2026 holdings context](https://fortune.com/2026/03/05/leopold-aschenbrenner-ai-hedge-fund-superintelligence-agi-power-companies-crypto-miners/)
7. [Fortune — launch, team and reported backers](https://fortune.com/2025/10/08/leopold-aschenbrenner-openai-ftx-1-5-billion-hedge-fund-situational-awareness/)
8. [Axios — reported July 2026 public-book sale](https://www.axios.com/2026/07/30/ai-hedge-fund-situational-awareness-citadel)

媒体报道用于基金背景；持仓、日期、行数和报告总值以 SEC 原始申报为准。所有基金信号均为研究线索，既不代表对证券的推荐，也不保证未来持仓仍然存在。
