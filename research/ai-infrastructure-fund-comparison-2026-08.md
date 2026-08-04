# AI 基础设施主题基金对照：SALP 之外的监控盲区

更新日期：2026-08-02
用途：为 AI Compute Map 选择公开可审计的主题基金/研报代理，并把与 Situational Awareness LP（SALP）不重合的关注点加入监控；不构成投资建议。

## 结论

严格按法律结构，没有一只公开材料同样完整的“SALP 替代品”：SALP 是带多空、期权和私募敞口的 AI 主题对冲基金，其 13F 只提供美国上市证券和列示期权的历史快照。相较之下，TCAI、AIPO、IVEP、AINF 和 DTCR 都是公开市场 ETF 或 ETF 研究代理，多数是长-only/指数产品。因此本项目不把它们称为“同类持仓”，而把它们当作**可公开审计的关注点探针**。

对照后，SALP 与这些基金/研报的重合主线是：AI 加速器、HBM/存储、网络、AI 数据中心、可交付电力和矿场转 AI。真正值得补入项目的非重合或弱重合主线有六组：

1. 燃料供应、核电/天然气组合、电网输配电和公用事业监管；
2. 机架级 UPS/PDU/busbar/switchgear、液冷和调试验收；
3. 预租赁、空置率、租金、锚定客户和合同现金流；
4. 推理工作负载的低延迟、城域/边缘节点和互联密度；
5. 全球上市/经营地、币种、本地监管和环境筛选；
6. 铜、铝、特种钢、线缆、变压器及其他电网/数据中心使能材料。

这些条目已作为 `comparativeFundMonitoring` 写入供应链页；`relation=non-overlap` 的卡片会显示为 `NEW LENS`。

## 对照对象与公开材料

| 对象 | 载体 | 公开材料读法 | 与 SALP 的重合 | 主要新增视角 |
| --- | --- | --- | --- | --- |
| [Tortoise AI Infrastructure ETF（TCAI）](https://tortoisecapital.com/wp-content/uploads/2026/07/TCAI-Commentary_2Q2026.pdf) | 主动管理 ETF | 2Q 2026 评论把数字基础设施、数据中心、能源基础设施分开；还讨论天然气、液冷、存储、服务器、连接设备和矿场转 AI。 | 存储、网络、数据中心、电力 | 天然气/燃料链、机架级产品、预租赁与基础设施式现金流 |
| [Defiance AI & Power Infrastructure ETF（AIPO）](https://www.defianceetfs.com/aipo/) | 被动主题 ETF | 公开指数页面将分布式能源、电网、公用事业、建设、数据中心运营和 AI 硬件纳入同一框架，并用收入暴露和季度再平衡表达主题。 | AI 硬件、数据中心、电力 | 现场/分布式发电、公用事业、电网建设和主题暴露规则 |
| [Dan Ives Wedbush AI Power & Infrastructure ETF（IVEP）](https://wedbushfunds.com/wp-content/uploads/2026/04/Summary-Prospectus-IVEP.pdf) | 以研报为基础的主题 ETF | 招募说明书称 AI Power Report 半年发布；范围包括核电基荷、天然气发电/燃料输送、电网、数据中心、 power management、冷却、材料和使能技术。 | 数据中心、供电、冷却 | 核/气燃料链、输配电和材料/使能技术 |
| [iShares AI Infrastructure UCITS ETF（AINF）](https://www.ishares.com/ch/individual/en/products/338777/ishares-ai-infrastructure-ucits-etf?switchLocale=Y) | 全球 UCITS ETF | 以专利和收入暴露识别 AI 基础设施主题，等权、年度再平衡，覆盖半导体、云计算和大数据基础组件。 | 半导体、云、AI 基础组件 | 非美上市/经营地、币种、国家集中度、环境和本地监管 |
| [Global X DTCR 研究：Data Center Operators](https://www.globalxetfs.com/articles/data-center-operators-ai-s-underappreciated-winners) | 数据中心主题 ETF的公开研报代理 | 把已供电、已获许可、已互联并能预租赁的容量视为稀缺资产，并区分训练园区与更看重延迟/邻近性的推理节点。 | 已供电数据中心、长期客户合同 | 推理/边缘、低延迟、互联密度、预租赁、空置率和租金 |

## 分析：哪些是重合，哪些不重合

### 重合：可用来验证 SALP 研究线索

TCAI 的 2Q 2026 评论将组合约 60% 归入数字基础设施、17% 归入数据中心、23% 归入能源基础设施，并列举 Micron、Vertiv、Dell、Sandisk、Ciena、Quanta Services 等代表性暴露。这与 SALP 公开信号中出现的内存/存储、网络、AI 云园区和电力资产高度重合。

AIPO 和 IVEP 也把 AI 硬件、数据中心和电力基础设施放在一个可交易框架内。它们不能证明 SALP 持有同样的证券，但可以作为“多来源主题共识”信号：当多个公开材料同时出现同一供应链层时，项目应提高该层的研究优先级，然后回到公司年报、监管文件、公用事业资料或设施证据验证。

### 非重合：应扩展到物理和商业交付层

**电力不只是 MW。** SALP 已经提示并网和现场发电的重要性，但 IVEP/TCAI 的材料把核电、天然气发电、燃料输送、电网、容量市场和公用事业放到同一链条。项目要进一步区分 `secured power → interconnection → energised → firm IT load`，并记录燃料、费率、输电和许可风险。

**服务器不只是 GPU。** TCAI 的数字基础设施定义包含服务器、连接设备和液冷，AIPO 也把数据中心运营及电力设备作为主题。项目要把 UPS、PDU、busbar、switchgear、机架密度、CDU/冷板、集成、调试和验收从“数据中心功率”中拆出来。

**容量不只是 MW 或 GPU 数量。** Global X 研究强调空置率、预租赁、租金、锚定客户和长期合同；这些指标能回答“拥有容量”是否能变成收入，也能识别把规划容量误当成可售算力的情况。

**训练不等于推理。** Global X 把训练园区和推理节点区分开：推理更依赖用户邻近性、端到端延迟、互联网交换、跨云连接和企业数据。现有 SALP 框架中这条链路很弱，所以新建 `fund-inference-edge-latency` 监控项。

**SALP 的美国 13F 不是全球地图。** AINF 的全球 UCITS、专利/收入筛选和年度再平衡，提示项目把上市地、经营地、收入地、币种、国家集中度、本地数据主权和环境筛选分开记录。报告期后的 Nebius/SharonAI 持股并不能替代这一全球覆盖。

**稀土不覆盖所有“材料”。** IVEP 的 AI Power Report 将材料和使能技术单列，项目需增加铜、铝、特种钢、线缆、变压器和磁性材料，才能观察电网与数据中心设备的长交期和供应集中度。

## 监控落地

| 新监控项 | 当前状态 | 推荐证据 | 触发频率 |
| --- | --- | --- | --- |
| `fund-fuel-grid-regulation` | 扩展覆盖 | 公用事业文件、并网协议、发电商/燃料供应商年报、监管许可 | 月度；重大许可/停机事件即时 |
| `fund-rack-power-thermal` | 扩展覆盖 | OEM/ODM、液冷厂商、数据中心 commissioning 和采购交期披露 | 月度/季度 |
| `fund-contracted-capacity-economics` | 扩展覆盖 | 数据中心运营商年报、租约、预租赁、空置率和客户集中度 | 季度 |
| `fund-inference-edge-latency` | 新增 | 托管运营商、IX、云服务目录、区域容量和延迟数据 | 月度 |
| `fund-global-localization` | 新增 | 全球基金指数规则、公司地域收入、当地监管/数据主权和环境许可 | 季度/规则变更即时 |
| `fund-grid-data-center-materials` | 新增 | 设备商、材料商、海关/产能、变压器和线缆交期 | 月度 |

基金材料只提供主题线索；项目不能用 ETF 持仓、指数权重或报告中的市场预测替代设施级事实，也不能把公开基金的收益或成分股当作投资建议。

## 来源与边界

1. [Tortoise AI Infrastructure ETF — 2Q 2026 Quarterly Commentary](https://tortoisecapital.com/wp-content/uploads/2026/07/TCAI-Commentary_2Q2026.pdf)
2. [Defiance AI & Power Infrastructure ETF — official overview](https://www.defianceetfs.com/aipo/)
3. [Dan Ives Wedbush AI Power & Infrastructure ETF — Summary Prospectus](https://wedbushfunds.com/wp-content/uploads/2026/04/Summary-Prospectus-IVEP.pdf)
4. [iShares AI Infrastructure UCITS ETF — official fund page](https://www.ishares.com/ch/individual/en/products/338777/ishares-ai-infrastructure-ucits-etf?switchLocale=Y)
5. [Global X — Data Center Operators: AI’s Underappreciated Winners](https://www.globalxetfs.com/articles/data-center-operators-ai-s-underappreciated-winners)
6. [Situational Awareness LP — SEC filing index](https://www.sec.gov/edgar/browse/?CIK=2045724)
