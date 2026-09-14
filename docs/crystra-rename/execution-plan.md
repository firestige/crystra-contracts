# Crystra 更名执行计划与恢复记录

- 计划 ID：CRYSTRA-RENAME-20260913
- 文档版本：2
- 最后更新：2026-09-14
- 总体状态：IN_PROGRESS（T0–T7 完成，T8 进行中）
- 当前执行任务：T8
- 当前执行者：本任务 Codex；T8
- 下一步：先恢复定稿 v8 的完整页面组合与交互，草案作为数据端口；视觉及真实链路分别验收后才发布 RC

## 1. 本文的作用与优先级

**本文是此次更名工作的执行状态与恢复入口。** 后续开始工作、改变任务状态、遇到阻塞或结束一次工作，都应更新本文。不能只在对话、Agent 记忆、终端或另一份清单里记录进度。

当前用户明确指令优先于本文；收到范围变更时先同步这里，再同步命名／分析文档。本文负责执行顺序、状态、决策和证据索引；[实施顺序说明](implementation-plan.md)负责各任务详细范围与验收说明；[命名映射表](naming-map.md)负责具体命名。分析报告与 LoopX 对照是背景证据，不可覆盖后来已确认的约束。

尚未创建对应 GitHub Issue。若后续建立 Issue／PR，在任务记录中链接并同步外部真实状态；遇到冲突应核实并记录，不能根据本文旧快照宣称外部操作已完成。不得自动把创建本文理解为创建 Issue、发布或清理的指令。

当前存放位置：`/Users/firestige/Projects/wsr-contracts/docs/crystra-rename/execution-plan.md`。相对路径 `docs/crystra-rename/execution-plan.md` 是此计划的稳定入口。T5 若将本地目录改为 crystra-contracts，必须先记录新绝对路径并更新入口链接，保留计划 ID；不另建一份独立状态台账。

## 2. 已确认约束

| ID | 决策 | 实施含义 |
|---|---|---|
| D01 | 品牌 Crystra | 当前品牌、文档、仓库与资产采用新名；能力描述区分当前实现与产品方向 |
| D02 | 唯一公开插件 dsh-crystra | 只注册 firestige/crystra-dsh；不独立发布 Intake／Execution／Studio／Suite 插件 |
| D03 | 可拆分内部模块和普通依赖 | 不要求单 Loader 行、单 apply 或单源文件；仍需正确装配和生命周期 |
| D04 | 优先取消独立安装器 | 默认由 DSH 安装，插件负责配置／就绪／诊断；必要运维逻辑可作内部模块，不默认更名后重新公开一个安装器 |
| D05 | 组件各自在自身 main 演进 | 不在组合仓库子模块推进开发；组件发布不要求先修改组合 gitlink |
| D06 | 主仓库只发布可用组合 | 记录精确制品／版本／摘要；不让已发布组合随组件 main 漂移 |
| D07 | 不迁移旧制品与历史资产 | 不做旧包别名、旧制品升级、WSR 到 Crystra 的数据迁移或跨品牌回滚 |
| D08 | 旧部署在此次更名中人工清理 | 先盘点、打包校验、隔离，再清理有效入口；不开发清理工具或长期迁移机制 |
| D09 | 忽略主仓库子模块未提交变化 | 不重置、不清空、不把它们当成此次待修复项；其它用户改动也应保护 |
| D10 | 先验证新候选，再清理真实旧部署 | T6 在隔离空白环境验证，T7 人工清理，T8 实际切换 |
| D11 | 保留当前领域与服务架构 | 不因单插件或更名隐式更换数据库／合并领域职责；必要配置可在插件引导 |
| D13 | 本次更名仅要求可用 RC 组合，不要求 GA | RC 自动由候选分支触发，不要求人工 GA 前置；RC 证明内容未被破坏并有可用组合，即满足此次发行验收；GA 不属于更名完成条件 |
| D14 | 缺失契约允许条件化草案探索 | 优先复用指定设计目录已有结论；不足时按 UI 提出最小契约。草案不是正式版本，前提不满足即作废；不得提升现有正式契约权威 |
| D12 | 优先复用现有发行资产 | 用户将发行 App 改名为 crystra-release；沿用原 App ID、Client ID 和私钥，不新建 App。八仓库配置范围已明确授权 |

T0 已落定具体实现选择，见 [T0 决策](t0-decisions.md)。新坐标的实际发布权限配置仍属 T5；不把只读可用性检查写成可发布。

## 3. 状态规则

- PENDING：未开始，或尚有前置任务未完成；不等于发生阻塞。
- READY：前置满足，可开始。
- IN_PROGRESS：已有实际工作；填写执行者、开始时间、当前操作和下一步。
- BLOCKED：发生具体障碍；必须记录证据、影响、解除条件及可继续的独立工作。
- DONE：退出条件全部满足，并记录验证、提交／文件或制品证据。实现完成但未验证不能标 DONE。
- SKIPPED：经已记录的范围决定不再需要；记录原因，不冒充完成。

状态表是唯一任务状态台账；下方日志只记录事件。T2 为聚合任务，五个子任务均完成才为 DONE。子任务可依明确依赖先行；不得等待整个 T2 才允许启动只依赖 Execution／UI 的 T3。任务已经完成后若新变化使原证据失效，记录原因并重新打开受影响任务，保留旧证据。

## 4. 任务状态台账

| ID | 工作项 | 前置／就绪条件 | 状态 | 当前执行者 | 完成证据／阻塞 |
|---|---|---|---|---|---|
| T0 | 固定命名与新安装闭环 | 无 | DONE | 本任务 Codex | [决策与检查](t0-decisions.md) |
| T1 | Contracts 更名、自包含验证与 CI 解耦 | T0 DONE | DONE | 本任务 Codex | main `f2d373a`；[CI 成功](https://github.com/firestige/wsr-contracts/actions/runs/34758259364)；[实现与验证](t1-progress.md) |
| T2 | 普通组件与 Workflow 的聚合任务 | 按下列子任务分别推进 | DONE | 本任务 Codex | 五组件 main、独立 CI 与本地制品验证全部通过 |
| T2-EX | Execution 更名与 CI／发布解耦 | T1 DONE | DONE | 本任务 Codex | [完成证据](t2-execution-progress.md)；main cd7f178；CI 34759925679 成功 |
| T2-UI | UI 库更名与 main CI | T0 DONE；如引入契约依赖须显式登记 | DONE | 本任务 Codex | main `482f6f1`；[验证与 CI](t2-ui-progress.md) |
| T2-EV | Evidence 更名与服务配置 | T1 DONE | DONE | 本任务 Codex | main 3345e82；[本地与 CI 完成证据](t2-evidence-progress.md) |
| T2-EO | Evolution 更名与发布解耦 | T1 DONE | DONE | 本任务 Codex | main e22920e；[完成证据与 CI](t2-evolution-progress.md) |
| T2-WP | Workflow 资源更名与 main CI | T1 DONE | DONE | 本任务 Codex | main 8746d18；[验证记录与 CI](t2-workflow-progress.md) |
| T3 | 统一 dsh-crystra 包与模块装配 | T2-EX、T2-UI DONE | DONE | 本任务 Codex | main b951b9c；PR #33、CI 34762427482 成功；[恢复记录](t3-progress.md) |
| T4 | 插件初始化、取消独立安装步骤 | T3 DONE；完整服务验收需 T2-EV、T2-EO、T2-WP DONE | DONE | 本任务 Codex | PR #34；CI 34764469211；195 测试、空白浏览器和真实服务通过；[恢复记录](t4-progress.md) |
| T5 | 当前品牌收尾与外部坐标切换 | 准备可在 T0 后；实际切换需 T1–T4 DONE | DONE | 本任务 Codex | 配置复用与读回见 release-configuration.json；发布和文档 PR #275/#276、DSH #37 已合并 |
| T6 | 新组件候选与隔离环境组合验证 | T5 DONE | DONE | 本任务 Codex | crystra-v0.1.0-rc.1，34816139862 成功；远端字节一致及真实服务联调通过；[最终证据](evidence/t6-final-combination.json) |
| T7 | 一次性人工清理实际旧部署 | T6 DONE；只读盘点可在 T0 开始 | DONE | 本任务 Codex | 17 归档校验、59 旧／夹具容器移除、15 卷离线保留；旧运行目录已隔离；[清理记录](evidence/t7-cleanup.json) |
| T8 | 实际 RC 安装验收与更名收尾 | T7 DONE；使用 T6 验证制品 | IN_PROGRESS | 本任务 Codex | Mac 已解锁；实际 RC setup 启动三项健康服务，doctor 正确报告缺少工作区绑定；Studio 可读取 Evidence；[安装证据](evidence/t8-installation.json) |

详细范围见 [T0–T8 实施说明](implementation-plan.md)。允许独立推进不表示已启动其它 Agent、创建其它任务或进行了分支切换。

## 5. T0 完成记录与 T1 入口

T0 已完成，见 [T0 决策](t0-decisions.md)。当前任务以第 4 节台账为准；下列 T0 清单保留为完成记录。T1 从 [首批实现与剩余项](t1-progress.md)继续，不重复 T0 职责拆解。

### 输入

- [分析报告](analysis-report.md)：DSH 包结构、安装器三模式、CI／发布依赖主仓库的证据。
- [安装方式对照](installation-comparison.md)：LoopX 单包、多内部模块和首次初始化经验。
- [命名表](naming-map.md)及 [JSON](naming-map.json)：92 项命名规则和结构性变更建议。
- 主仓库 `product-operations/src/`、`deployment/published/`；DSH 的 package、patch、配置与发布脚本。路径为当前旧名，T5 前仍有效。

### T0 已完成项

- [x] 刷新各独立仓库 main、当前工作树和远端坐标；记录本轮使用的具体 SHA。忽略组合工作树子模块脏内容。
- [x] 核实目标仓库／包名与发布权限；落定首轮版本、tag 和新 namespace。
- [x] 建立安装职责表：DSH 接管项、插件内部复用项、组合发布项、删除项。
- [x] 落定单插件的配置／依赖／服务版本绑定、首次就绪、失败重试、诊断与普通卸载流程。
- [x] 确定仍在演进的组件文档和生成依据归属；不重新整理历史归档。
- [x] 列出真实旧部署的已知位置与归属，作为 T7 输入；未知项明确标记，不执行清理。
- [x] 回填命名表中的相关建议，记录决策和退出条件验证；将 T0 标 DONE，解锁 T1、T2-UI。

T0 产出必须链接在本文中，可以建立同目录的决策附件；不得另建一份状态台账。若某选择需要用户判断，记录具体问题和已准备的选项；不重问 D01–D11。

## 6. 完成证据要求

| 任务 | 标 DONE 必需的证据 |
|---|---|
| T0 | 命名／安装职责／服务绑定决策及权限检查结果；更新过的具体映射 |
| T1 | 新契约资源、独立生成／校验结果、main 集成提交和 CI 证据 |
| T2-* | 对应仓库提交、必要构建／测试、独立 CI 和可消费新制品；不能只列改名文件 |
| T3 | 单一可安装包、内部装配清单、干净 profile 与卸载／重载验证；普通依赖不误算成插件 |
| T4 | 从 DSH 安装到首次就绪的完整操作记录；诊断与失败行为验证；无需独立安装器 |
| T5 | 8 仓库新坐标核对、当前文档／资产、权限与插件发现身份读回；本计划的新位置如有变化 |
| T6 | 精确候选来源、版本、URL、摘要及远端下载后的隔离环境组合验收 |
| T7 | 归属清单、隔离包位置及摘要、备份可读性／数据库一致性记录、清理前后有效入口读回 |
| T8 | 实际环境验收、精确制品与 GA／市场状态的真实链接；未生效的外部登记不写已完成 |

本地工作尚未进入组件 main 时应记录实际分支／工作树与未提交文件，不把“本地实现”写成“main 已完成”。远端发布、注册和清理完成后必须读回核实；操作返回不确定时先检查实际状态，不盲目重试。

证据可存放在同目录的 evidence/ 或已有稳定产物位置，并在此链接；记录命令、工作目录、时间、结果与必要日志位置。不得把凭据值、数据库备份内容或用户私有数据写进可提交的计划。隔离包放在适当本地位置，本文只留定位信息。

## 7. 会话恢复流程

1. 读取本文的状态表、第 8 节恢复检查点和最新执行日志；再读当前任务详细范围。不要重新从头扫描全部历史。
2. 找到当前仓库实际路径；T5 后优先使用已记录的新路径。核对分支、HEAD、未提交文件与记录是否一致，不自动 reset／stash／clean。
3. 验证检查点提到的进程、制品、CI、PR／Release 状态；记录缺失与偏差。旧扫描快照和旧测试不能证明当前状态。
4. 若发现上次中断于外部动作，先读回已发生的效果。尤其检查仓库更名、上传资产、插件装卸和服务清理，避免重复执行。
5. 从检查点“下一条动作”继续；更新执行者和状态。没有检查点时，从首个 READY 且依赖满足的任务开始。
6. 结束前填写本次变更、验证、剩余工作和下一条动作，更新状态表与恢复检查点。

若当前动作会使本文路径不可用（例如移动 Contracts checkout），先在本文登记目标路径，并把本目录一并保留。若本文尚未提交，不得因整理工作树丢弃这些文档。后续提交时记录提交号；当前未承诺远端已有执行计划副本。

## 8. 最新恢复检查点

| 字段 | 当前值 |
|---|---|
| 检查点 | C047：新建页原生 Input 与双实例隔离已验证；精确 Task 会话解析完成，尚未接页面；220 测试通过 |
| 当前任务 | T0–T7 DONE；T8 IN_PROGRESS |
| 已完成 | 更名／配置复用；crystra-v0.1.0-rc.1 远端六文件与本地相同；真实执行、入库、Trace、评估及 Workflow AVAILABLE；旧部署备份隔离完成 |
| 未完成 | 实际 DSH 安装验收与公开安装入口收尾；bot PR #277、DSH #38、Execution #46、Evolution #10、Contracts #18 尚需按审批规则合并 |
| 工作路径 | 新 UI /tmp/crystra-ui-host-integration `97df006`；新宿主 /tmp/crystra-dsh-t6 `426f3ed`（未发布）。原组合 /tmp/crystra-combination-stage 1593f589；/tmp/crystra-dsh-t6 产品候选 9a9777d、另有 test-only 742e1de；实际 ~/.dsh/profiles/web；台账 /Users/firestige/Projects/wsr-contracts |
| 活跃进程／作业 | 本次安装／归档命令完成；现有 DSH PID 40455（全局 web，3080）保留。精确 DSH 0.1.1-rc.2 已作为普通依赖安装于 ~/Library/Application Support/Crystra/tools，未降级全局 CLI |
| 隔离档案 | /Users/firestige/Library/Application Support/Crystra-quarantine/20260914-wsr；17 个校验归档、旧运行目录原件、15 个无容器引用的离线卷 |
| 已知阻塞 | Input 复用与会话隔离的装配方案待验证，不是待用户批准共享会话或 fork；见 drafts/dsh-host-layout.md C044。旧 Workflow 匿名额度 403 仅为此前证据，当前未复验，不按旧恢复时刻推定仍被限流。无 GA 门槛 |
| 下一条动作 | 优先核对 Input 组件与 Session/scope/RPC 依赖，形成复用实现、隔离会话的装配方案；继续处理[新 UI 接入缺口](t8-ui-integration-gap.md)，再发布新 RC；原 UI 验收仅证明旧链路可运行。限流为独立复验项。公开 RC 安装入口已更新至 #277/#38，PR 保持 bot／非 Draft，等待正常合并 |
| 禁止误恢复项 | 不重做更名；不删除 ~/.config/wsr/credentials 复用私钥；不动原组合子模块脏内容；不消费旧档案；不自动合并／发 GA |



每次推进后直接更新此表，不追加第二份“最新”检查点；旧事件保留在日志。终端会话 ID 仅供定位，跨会话必须验证是否仍有效。

## 9. 分析基线（历史快照，T0 必须刷新）

以下为 2026-09-13 分析时在线核实的远端 main，不代表恢复时仍为最新。报告以独立仓库快照检查，未扫描组合子模块工作树。

| 仓库 | 分析时远端 main |
|---|---|
| workflow-self-recursive | `3fc8aef3142bda61f63174ad9998c41c4b42c4bb` |
| wsr-contracts | `b4b6ab8f89aa2467e09d40f68766e7e40e6a6763` |
| wsr-dsh | `117b54cc2711b303bb63b278836ea2c1174f3d34` |
| wsr-evidence | `1557a38b863be50e24b037796b7dbfa73af4b2f8` |
| wsr-evolution | `da2ffeddfeadaa659883bccfe380aefe1b5b6d7c` |
| wsr-execution | `dbec4ec441f384ec83788890e5ed614a7c405dec` |
| wsr-ui | `666a5506ffab723ebf54660c899900eaebda22e0` |
| wsr-workflow-package | `14ceea87f08ee4e468b2782c9beecfd5c136fe65` |

旧本地 Execution main 当时比远端少 6 个提交；此为历史观察，恢复时重查。此前 816 个命中文件、628 个非历史候选仅用于范围初筛，不是已修改文件数或进度分母。

## 10. 外部动作与一次性清理记录

八仓库已完成远端更名与 origin 更新，见 [读回台账](repository-renames.json)。发布凭据尚未复制，旧部署尚未清理。开始其它 T5–T8 动作前，在日志中记录具体目标和状态；出现不确定结果时补记读回结果。按当时适用的仓库／发布规则处理实际操作，不把本文中的任务条目当作已经完成的批准或执行结果。

人工清理记录模板（T7 使用，当前未执行）：

| 项目 | 原位置／归属 | 备份／隔离位置与摘要 | 验证 | 实际清理动作／时间 | 结果 |
|---|---|---|---|---|---|
| 尚无条目 | 待现场盘点 | 未打包 | 未验证 | 未执行 | PENDING |

共享 profile 的其它插件、归属不明资源和用户工作文件不自动清理。远端历史资产批量删除未纳入本计划。隔离档案不作为 Crystra 输入，也不构成跨品牌回滚机制。

## 11. 决策变更与执行日志

| 记录 | 日期 | 任务／范围 | 事件与证据 | 下一步 |
|---|---|---|---|---|
| L000 | 2026-09-13 | 计划建立 | 用户认可实施顺序并要求以文档推进／恢复；固化 D01–D11，建立 T0–T8 台账；未启动实施 | T0 职责拆解 |
| L001 | 2026-09-13 | T0 → IN_PROGRESS | 用户授权按计划开始；已读取恢复入口，开始基线／权限和职责检查 | 产出 T0 决策附件 |
| L002 | 2026-09-13 | T0 DONE；T1 IN_PROGRESS | [T0 决策](t0-decisions.md)与两份检查证据；旧部署只读盘点，未清理 | T1 自包含资源与验证 |

| L003 | 2026-09-13 | T1 IN_PROGRESS | 新增自包含工具、目录和当前文档；发布工具测试 10/10，通过真实 11 资源／241 文件打包校验；全部为本地未提交，见 [T1 记录](t1-progress.md) | 领域校验解耦与 CI |

| L004 | 2026-09-13 | T1 IN_PROGRESS | 11 私有包改名；当前领域绑定与 CI 解耦；全领域资格通过；发布归档独立重建与验证。用户明确计划内连续推进，无需重复请示 | main 集成与 CI |

| L005 | 2026-09-13 | T1 DONE；T2-UI IN_PROGRESS | Contracts main f2d373a 已推送，独立 CI 34758259364 成功；精确提交归档 239 文件校验通过。UI 包身份新名回归先失败，开始实施 | UI 更名与验证 |

| L006 | 2026-09-13 | T2-UI DONE；T2-EX IN_PROGRESS | UI main 482f6f1 与 CI 34758649497 成功；Execution main FF dbec4ec，准备精确 Contracts／Workflow 测试输入，无组合仓库改动 | Execution 独立资格与更名 |

| L007 | 2026-09-13 | T2-EX DONE；T2-WP IN_PROGRESS | Execution main cd7f178、736 测试及独立 CI 34759925679 全部通过；Workflow main 8746d18、3 包契约／9 发行／23 CLI 测试通过 | 读取 Workflow CI |

| L008 | 2026-09-13 | T2-WP DONE；T2-EV IN_PROGRESS | Workflow main 8746d18 与 CI 34760157407 成功；开始 Evidence uv 依赖及新配置回归 | Evidence 更名／验证 |

| L009 | 2026-09-13 | T2-EV DONE；T2-EO IN_PROGRESS | Evidence main 3345e82、CI 34760537286 成功；164 单元／16 PostgreSQL、部署备份恢复与新 wheel 消费通过 | Evolution 组件输入解耦 |

| L010 | 2026-09-13 | T2 DONE；T3 IN_PROGRESS | Evolution main e22920e、CI 34760877941 成功；191 测试与镜像内真实校验通过，五组件完成 | 单根 dsh-crystra 包与内部模块合并 |

| L011 | 2026-09-13 | T3 IN_PROGRESS | 单根包／单客户端／单注册已实施，37 工具测试及隔离安装生命周期通过；真实 Harness／终态场景通过，独立输入重建摘要一致；044301d 经 PR #33 集成；[详细恢复点](t3-progress.md) | 完整 Harness、独立输入重建与 main CI |

| L012 | 2026-09-13 | T3 DONE；T4 IN_PROGRESS | PR #33 CI 34762427482 成功，squash main b951b9c；开始首次初始化模块 | 配置／命令／服务就绪 |

| L013 | 2026-09-13 | T4 IN_PROGRESS | 新增配置／服务生命周期／归档／Compose 内部模块；186 全量测试及后续 17 重点回归通过；未接入根 Host、未提交 | [T4 恢复点](t4-progress.md) |

| L014 | 2026-09-13 | T4 IN_PROGRESS | 根命令／轻量启动／状态卡／取消已接入；空白浏览器和真实服务协调器通过，development-only 服务输入与 T6 候选区分记录 | 最终检查及 PR |

| L015 | 2026-09-13 | T4 DONE；T5 IN_PROGRESS | PR #34 CI 34764469211 成功，195 测试与真实初始化通过；八个新名未占用且 admin=true，现有发布 App 身份验证成功 | 协调仓库改名并持久化读回证据 |

后续日志至少记录：任务 ID、状态变化、修改范围／仓库、实际分支或提交、验证结果／证据位置、阻塞及下一步。范围变化还需说明它替代哪条决策，并同步相关附件。没有变化时不堆积“继续等待”日志。

## 12. 全项目结束条件

- 所有必要任务 DONE；任何 SKIPPED 有明确范围依据。
- 只有 dsh-crystra 一个公开插件入口和 crystra-dsh 一个注册仓库；内部依赖可以拆分。
- 正常安装无需独立产品安装器；必要后台服务和配置有可用的就绪／诊断流程。
- 组件 main 可独立演进，组合仓库能发布固定且经过验证的新制品组合。
- 实际旧 WSR 部署已人工打包隔离清理；不迁移旧历史制品。
- 真实环境 RC 组合验收及更名状态均有可核查证据，未决事项已关闭或明确移出范围；GA 不作为本次完成条件。
- 本文更新为 DONE，最终检查点记录实际新路径、交付版本和证据索引。

T0 已完成附件：[t0-decisions.md](t0-decisions.md)。新首轮分发采用 GitHub 精确制品，Contracts scope 保持 private；T5 发布权限仍需实配。


| L016 | 2026-09-13 | T5 IN_PROGRESS | 八仓库 ID 校验更名；新 Workflow tag 消费／发行一致，三个组件 CI 成功；凭据操作被自动审批拒绝并等待明确授权 | 独立推进 DSH 输入与组合发布收尾 |

| L019 | 2026-09-13 | T5 IN_PROGRESS | DSH #35/#36 main 集成；GitHub 唯一插件 Topic 读回；组合 #271 CI 通过待审核；#272 草稿 9569df79、46 测试通过，发布接线待完成 | 按 C019 继续；不绕过两个明确门槛 |

| L025 | 2026-09-14 | T6 IN_PROGRESS | 六个底层 RC 均完成远端资格及下载核验；服务镜像两平台来源绑定通过；本地环境问题已解决，源码未改；[晋级提案](t6-component-promotion-proposal.md) READY | 用户正式晋级，随后继续服务／插件／组合；未清理旧部署 |

| L026 | 2026-09-14 | T6 IN_PROGRESS | 用户明确当前只发 RC、继续联调；撤回 C025 的提前 GA 暂停及晋级提案执行要求，保留六组件有效资格证据 | 自动推进服务、插件、组合 RC |

| L027 | 2026-09-14 | T6 IN_PROGRESS | 服务 RC 34802450361 与插件 RC 34803216172 均成功并下载复验；bot PR #277/#38 非 Draft，CI 均通过；修复 pnpm URL 子依赖安装障碍 | 组合 RC、Workflow 候选发现与真实交付联调；不发 GA |

| L028 | 2026-09-14 | T6 IN_PROGRESS | 用户明确本次更名不要求 GA，只需 RC 证明更名未破坏内容并形成可用组合；同步 T8／结束条件 | 修复候选发现并完成组合联调 |

| L029 | 2026-09-14 | T6 IN_PROGRESS | Execution 757 测试／Evolution 195 测试通过；bot PR #46/#10；RC2 作业 34813625789/34813559700 成功，下载摘要及 OCI 来源绑定通过；两消费端都验证了 3 个真实 Workflow RC 包，见 [证据](evidence/t6-workflow-rc-source.json) | 服务 RC2 本地资格通过，继续跨服务联调与新插件组合 |

| L030 | 2026-09-14 | T6 IN_PROGRESS | 真实交付成功并入库，评估发现生产 Workflow 302 缺口；已补回归并修复 c5aa85e，196 测试与开发容器生产下载通过，Evolution rc.3 自动资格中 | 更新服务 rc.3 并重跑严格完整链路 |

| L031 | 2026-09-14 | T6 IN_PROGRESS | Evolution rc.3 镜像复验 PASS；服务 rc.3 本地完整执行→入库→Trace→评估通过，Workflow AVAILABLE、任务 COMPLETED，见 [真实链路证据](evidence/t6-real-service-chain.json)；自动发布 34815338639 | 插件 rc.2 全套资格与最终组合 rc.1 |

| L032 | 2026-09-14 | T6 IN_PROGRESS | 服务 rc.3 34815338639 成功、远端七文件字节相同；插件 rc.2 9a9777d 六项本地资格通过，34815768299 运行；组合 1593f589 清单与 gitlink 固定，50 测试通过 | 下载插件 rc.2、核验并发布组合 rc.1 |

| L033 | 2026-09-14 | T6/T7 DONE；T8 IN_PROGRESS | 组合 RC1 34816139862 成功、六文件原字节复验；旧部署 17 归档校验并隔离，59 容器移除、15 卷离线保留、私钥及共享服务保留 | 实际 DSH 插件安装与收尾 |

| L034 | 2026-09-14 | T8 BLOCKED | 实际 web profile 安装 dsh-crystra rc.2，419 文件与发布归档相同、单激活、精确 DSH runtime 0.1.1-rc.2 已就位；唯一 dsh-plugin topic 仓库读回 crystra-dsh；CUA 报 Mac 锁屏，实际 UI 验收不能继续 | 解锁后继续；已有共享 DSH 进程和认证配置保留 |

| L035 | 2026-09-14 | T8 IN_PROGRESS | 用户解锁；3081 固定运行时复用已安装 RC，Crystra 已挂载；实际 setup 三服务健康、doctor 明确报告角色绑定缺失，Studio Load tasks 正常返回空列表；共享 3080 保留 | 实际服务任务与 Studio 联调 |

| L036 | 2026-09-14 | T8 部分验证完成 | 实际任务执行入库，Studio 12 指标、Evidence、Recorded Trace 验证通过；Workflow 来源受 GitHub 匿名额度 403 阻挡，未宣称 T8 DONE；五份 bot PR 当前均 OPEN／非 Draft／CI SUCCESS | 额度恢复后仅重验已有任务评估；正常合并仍由用户执行 |

| L037 | 2026-09-14 | T8 验收范围纠正 | 用户指出新组件和路由未生效；远端 UI main 与 RC 来源一致，但新工作台仍为预览入口，DSH 继续旧 Shell/Evaluate 页面。不能以更名及旧链路通过宣称新界面完成 | 见 t8-ui-integration-gap.md；补真实宿主接入与新 RC 资格验证 |

| L038 | 2026-09-14 | T8 新 UI 接入进行中 | 用户确认 PR #7 主线资产并授权依照定稿 v8；完成区域清单、Trace 消费侧纠正、Directory 公共导出与针对性测试；DSH 199 项通过。源代码尚未发布，不宣称新 Shell 完成 | 依 t8-ui-integration-gap.md 子步骤继续 Shell/路由、数据端口、新 RC 与实际验收 |

| L039 | 2026-09-14 | T8 Shell/导航实现中 | 新增 UI Shell 组合、精确路由/返回恢复、DSH additive overlay 桥接工厂；5 项导航/挂载测试通过。尚未激活到 root client，当前安装保持旧 RC | 补 v8 一致性、页面/数据端口后接 root client，不以占位页面交付 |

| L040 | 2026-09-14 | T8 新 Shell 实际挂载 | 3082 独立开发实例挂载 root client；修复 overlay 无 renderSlot 异常及主题/定位；真实 Task 选择、Harness 往返身份保持通过；DSH 205 项回归通过。开发 bundle 使用本地 UI alias，不是已发布 RC 字节 | 补完整页面、Shell 交互和真实数据端口；新 UI RC 固定后才更新正式生成 bundle |

| L041 | 2026-09-14 | T8 Analysis 接入 | UI bca3552、DSH 8a42836；独立 Analysis 总览/Trace 连接真实接口；修复 Trace 注册字段 ID 解码、零宽图布局及新建 Task 提前创建 Session。UI 391+34 单测、27 浏览器测试、DSH 209 项通过；完整 v8 和新 RC 未完成 | 见 C038 接入记录；继续现有接口可支持的 UI，O01/O10/C07 领域扩展待用户确认 |

| L042 | 2026-09-14 | T8 草案范围获授权 | 用户允许优先复用设计结论，其次提出 UI 最小契约，全部标记草案并绑定生效/作废前提；替代 C038 的领域扩展待确认状态。见 [草案入口](drafts/README.md) | 先实现可撤销的只读投影准入，再接工作面；正式 authority 与发行门禁保持 |

| L043 | 2026-09-14 | T8 草案基础完成 | 草案来源锁覆盖 12 份设计文档；DSH e0aaf82 增加条件化 envelope 准入，5 项新回归及全量 214 项通过。UI 14f8fa0 / DSH 388c040 同步 D21 的对比分析命名；尚未接草案读取和持久化，不能声称五工作面完成 | 接各工作面 value 校验与隔离 adapter；正式化不得由 RC 隐式触发 |

| L044 | 2026-09-14 | T8 实施方向纠正 | 用户指出实际 Chrome 页与 v8 差距很大；在 3082 与只读 4185 原 HTML 同尺寸对照确认 Shell/页面结构差异，不能以数据读取或单测通过替代 v8 验收。暂停新增草案字段，先对齐视觉与交互 | 见 [C040](t8-ui-integration-gap.md#c040-v8-视觉与交互纠正) |

| L045 | 2026-09-14 | T8 Analysis 完整组合 | UI 0a54cd8 抽取 AnalysisWorkspace，保留日期/布局/目录/Trace/对比分析插槽，生产入口不默认引入样本或改宿主 URL；394 Vitest+34 Node、28 原浏览器回归及 1 新完整页面回归通过。3082 显式启用 v8 设计样本探索并标注；不代表真实数据接入或 RC | 继续同尺寸视觉与交互检查、Task/Workflow 组件化、真实/草案端口接入 |

| L046 | 2026-09-14 | T8 Task frame 与宿主边界 | TaskWorkbench 容器完成，395 Vitest+34 Node、1920×1080 浏览器切页/输入保持通过；不是五工作面内容完成。固定 DSH overlay 无 Conversation 子插槽且 root 禁止插件重新注册，实际 Input 接入需要新增 ui-layout 修改/受控 fork 范围 | [可审核宿主扩展草案](drafts/dsh-host-layout.md)；该项待用户授权，其它页面/端口工作可独立继续 |

| L047 | 2026-09-14 | T8 宿主判断纠正 | 当前 rc.2 明确支持 shell.overlay；此前 TypeError 仅证明 overlay 未提供 props.renderSlot。重新读取 dsh-macos-desktop 源码，实际以 overlay 加外层 CSS 布局保留原生 Conversation，未证明该方法因版本升级失效。撤回 L046 中必须扩展/fork 的结论 | 先在隔离环境验证布局适配与输入连续性；宿主扩展仅为未启用备选 |

| L048 | 2026-09-14 | T8 Input 复用边界裁定 | 用户明确复用组件和交互即可，不要求与原生 DSH 共用 Session 管理器，倾向互不可见；撤销共享原 Harness Conversation 节点与会话的前提 | 先核对组件与服务装配，优先复用实现并隔离会话；Crystra 内部导航连续性仍需验证 |

| L049 | 2026-09-14 | T8 隔离装配核对 | 确认 Input 按 Session scope 依赖输入状态机与 RPC；默认会话与工作区存储归 DSH_HOME。3082 独立 home、空会话列表已核对；native picker 无网页菜单不能直接定性为故障，原生窗口检查工具长时返回仍未找到 picker | [装配核对与验证顺序](drafts/input-session-assembly.md)；继续专属实例隔离及 v8 Input 组合验证，无 fork 授权阻塞 |

| L050 | 2026-09-14 | T8 Input 接入与隔离实证 | 两个一次性实例通过会话读写和新增事件隔离；3082 新建任务保留 Crystra Shell，原生菜单与未发送草稿往返通过，Analysis 隐藏底层输入；216/216 Node 通过 | drafts/input-session-assembly.md C046；继续 Task/Workflow 精确绑定与完整工作面，不代表新 RC |

| L051 | 2026-09-14 | T8 Task 会话解析 | DSH 426f3ed：按正式 Task identity / sessionCorrelation 与当前实例成员解析，零关联不绑定、多候选不猜测、foreign+local 仍歧义、失效来源拒绝；新增 4 回归，完整 220/220 通过 | 解析器尚未接 Task 页面，不代表已有 Task Input 可用；下一步接当前实例的实时成员、control-plane 与页面状态 |
