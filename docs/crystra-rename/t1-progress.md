# T1 首批实现与恢复说明

日期：2026-09-13。状态以 [执行计划](execution-plan.md) 为准，当前为 IN_PROGRESS。

## 本轮已实现

- `release/config/current-resources.json`：显式声明 11 组当前契约资源及其本仓库语义文件。
- `release/cli/current-bundle.cjs`：从独立 Contracts checkout 收集资源，生成 `crystra.contract-bundle@1.0.0` 清单；记录逐文件大小与 SHA-256，校验完整文件集合、资源目录和语义输入。拒绝路径越界、符号链接、缺失语义、额外文件和覆盖已有输出。
- `docs/contracts/`：从已核实的组合仓库 main 快照复制 20 份当前 Markdown；来源及适用边界见 `docs/contracts/source-baseline.md`。没有复制历史审批／发布绑定 JSON，也没有宣称旧审批适用于 Crystra。
- `test/tooling/release/current-bundle.test.cjs`：6 项新回归。先运行得到缺失实现的失败，再实现至通过；现有 4 项发布工具测试仍通过。

工具是新增的本地打包能力，尚未接入发布工作流。旧发布 CLI、领域包命名与运行行为本轮未替换。资源中仍有旧工具与命名，不能作为新品牌候选发布。

## 验证证据

工作目录：`/Users/firestige/Projects/wsr-contracts`，本地分支 `main`，基线 HEAD `b4b6ab8f89aa2467e09d40f68766e7e40e6a6763`；本轮新增文件未提交。

1. `node --test test/tooling/release/*.test.cjs`：10 项通过、0 失败、0 跳过。覆盖新增打包完整性及原有发布工具回归，不代表全部领域测试通过。
2. 对实际工作树调用 `buildCurrentBundle`，随后 `verifyCurrentBundle`：11 组资源、241 文件通过。机器可读结果见 [本地打包证据](evidence/t1-local-bundle-check.json)。临时输出不作为长期证据或候选制品，恢复时可重新生成。
3. 输出来自含未提交新增文件的工作树；传入 revision 仅为基线定位，当前工具不证明工作树与 revision 一致。发布接入必须另外约束精确干净来源，并以实际资格验证结果生成证据，不能把清单完整性检查写成领域 PASS 或发布批准。

## 下一次动作

先阅读 `evidence-query/tools/validator.cjs` 的 `verifyManifestBinding()` 与 `evidence-query/tools/test-contract.cjs` 中冻结 publication 断言。它们目前依赖父目录内的组合仓库文档／历史 manifest；需要为当前资源建立独立输入边界，同时保留领域语义及失败场景验证。不要通过跳过整个领域测试解决这个问题。

之后依次完成：

1. 检查 Observation、Evaluation、Workflow 及 candidate 生成器的父目录读取与历史审批生成路径；将当前生成／校验输入归入组件，历史记录不再参与新发布资格判定。
2. 更新当前包 scope、仓库身份与文档链接；保留领域协议版本含义，不因分发版本重置而改变协议修订。
3. 建立从独立 checkout 运行的资格验证入口，实际运行必要领域测试和生成一致性检查；目前尚未安装这些领域工具依赖或执行其完整测试集。
4. 将 main CI 和候选发布接入新入口、新资源包及精确来源验证；移除组件构建对组合 gitlink 的前置要求。执行发布操作前阅读适用发布规则。
5. 完成本地提交、main 集成和远端 CI 读回，记录真实提交与链接后才能将 T1 标 DONE。

## 工作树保护

只将本任务新增文档、资源清单、工具和测试计入此次变更。不要覆盖或提交现有 `.gitignore`、`.DS_Store`、`project-ops.config`，不要清理组合仓库子模块。没有执行远端更名、候选发布、安装或旧部署清理。

## 第二批实现（2026-09-13）

- 11 个 private 包已改为 `@crystra`；当前 schema 身份及候选语义坐标改为 Crystra。领域协议修订不重置。Workflow 示意资源坐标改名后用现有 `refresh-minimal.cjs` 重建 Package／Snapshot 摘要。
- Evidence Query 改为精确绑定仓库内语义和 Observation 输入；隔离测试覆盖无父仓库、缺失文件及字节变化。Registry 为 CURRENT，历史批准不延续。
- Observation／Evaluation 的本地语义检查不再跳过；历史记录只验证自身记录身份，不再与当前文件逐字节比较。
- Evaluation 的原运行验证仍读取旧 Observation publication，已用排除历史记录的副本复现失败并修复：新分发依赖元数据采用 `observation-profile@1.0.0` 和 `current-input-binding.json` 的摘要，删除旧 publication hash／gitlink 依赖。14 项指标、覆盖率及输入语义不变。T2 消费者必须采用新绑定，不能继续读取旧 publication 字段。
- 新增统一资格入口 `release/cli/qualify.cjs`，覆盖 11 个模块的 18 条构建／测试／语料命令。失败立即拒绝资格，不生成 PASS 报告。
- main CI 与候选工作流只 checkout 本组件，不再依赖组合仓库和 Workflow 消费仓库。候选发布改为确定性 `crystra-contracts.tgz`，移除 6 个旧发布记录生成器及 npm 入口。
- 发布 CLI 从精确 HEAD 的 Git archive 构建，拒绝 tracked 变更／revision 不一致；验证外层摘要、归档路径及每个内部文件。新候选 tag 和 promotion 校验保持同基础版本、精确字节。新 CRYSTRA App 配置尚待 T5，未触发候选或 GA。

当前领域验证结果见 [T1 资格记录](evidence/t1-domain-qualification.json)。发布工具新增路径／链接恶意归档、内外 revision 不一致、重复构建一致性和失败资格测试。之前的 241 文件检查仅是第一批历史快照，不能作为当前制品清单。

**当前恢复动作覆盖前文“下一次动作”：** 完成此次本地提交、从精确提交验证资源构建，再推送组件 main 并读回 CI；若 CI 失败修复实际诊断。T1 尚不能标 DONE。T5 才切换远端仓库与配置，T6 才产出正式候选。

## T1 完成证据

- main 提交：`f2d373a1eaea945dc8ca0b9a66ff383f2b0117ce`，已推送。
- [独立 CI 成功](https://github.com/firestige/wsr-contracts/actions/runs/34758259364)：全部模块资格、14 项发布工具测试及生成／资源检查通过。
- 从该提交执行发布 CLI 构建并校验：239 文件，归档 SHA-256 `cf0ae2ab8d794050b5f47421f6998b1305366d603b9303777f7625751b28adc4`。本地产物 `/tmp/crystra-exact-source-taHcJP/release` 是 dev 验证输出，不是已发布候选。
- T1 已 DONE；前文的待集成说明作为过程记录保留，后续从执行计划的 T2 状态继续。
