# T6 新制品资格恢复记录

状态：IN_PROGRESS。发行配置已经完成，见 release-configuration.json。GA 仍由人决定；本阶段不清理旧部署。

| 对象 | 状态 | 证据／下一步 |
|---|---|---|
| Contracts | RC 远端验证 PASS | crystra-contracts-v0.1.0-rc.1；来源 13adf4df2a5abb755cf583f2c10972584e63eec3；239 个文件 |
| Workflow | RC 下载重放 PASS | 34800526283；3 包、12 资产；普通运行时 scoped tag 发现尚未验收 |
| UI | RC 下载验证 PASS | 34800528688；本地与远端 tgz、元数据、说明逐字节一致 |
| Evidence | 远端资格 PASS | 34800958905；数据库集成与备份恢复通过 |
| Evolution | 远端资格 PASS | 34800959153；191 测试与本地容器 healthz 通过 |
| Execution | 远端资格 PASS | 34801187270；736 测试及覆盖率、类型、构建、生成物、Harness、制品验证通过 |
| 服务归档 | RC 远端资格 PASS | crystra-services-v0.1.0-rc.1；34802450361；真实生命周期通过，全部下载字节与本地一致 |
| dsh-crystra | RC 远端资格 PASS | 34803216172；归档原始字节与本地一致；六项日志／回执绑定复验通过 |
| 最终组合 | 待以上各项 | 核对组件、服务、插件字节与原始资格回执；空白环境验收后才能进入 T7 |

## Contracts 精确证据

- 干净克隆：/tmp/crystra-contracts-t6；源码为已合并 main 13adf4df2a5abb755cf583f2c10972584e63eec3。
- 本地领域资格：25 项命令均 exitCode 0；发行工具测试 14/14，通过后才冻结资产。
- 本地资产：/tmp/crystra-contracts-t6-local-assets；下载资产：/tmp/crystra-contracts-t6-remote-assets。
- 归档：crystra-contracts.tgz；SHA-256 9aef1649fe1554e2be090c7911b29bbf93a8305ec377435d4c1e0823d119f0bd。
- [候选 workflow 34798564767](https://github.com/firestige/crystra-contracts/actions/runs/34798564767) 成功；仅通过 release/next 推送触发，无 workflow_dispatch。
- [RC 发布](https://github.com/firestige/crystra-contracts/releases/tag/crystra-contracts-v0.1.0-rc.1) 的归档与 release-metadata.json 已下载并逐字节匹配本地冻结集。重新解包验证 239 个文件成功。
- release-qualification.json 的 tag、commit、元数据 SHA-256、全部本地命令和远端 PASS 已核对。
- 持久化证据：[本地资格](evidence/t6-contracts-local-qualification.json)、[冻结元数据](evidence/t6-contracts-local-metadata.json)、[远端核验](evidence/t6-contracts-remote-verification.json)。临时目录缺失时从精确 RC 重新下载，不能以当前 main 重建替代。

release/next 此前指向旧 evidence-query 历史，快进预检拒绝。确认旧提交保留在远端稳定 tag 后，以精确 lease 从 dc8a50e92eebfc35bd706579ff2bf5e9beb57782 切换至上述源码提交。旧 tag 和资产未修改。

## C025 组件候选波次（2026-09-14）

以下均为独立 main 克隆，原组合子模块未修改。Contracts 固定输入 f2d373a 与已发布 13adf4d 的资源比较仅 Evaluation 中两份 README 链接改变，未改变 schema、validator 或语义文档。

| 组件 | 精确提交 | 资格目录 |
|---|---|---|
| Workflow | 2fc61f057ca712deacfed504f70601ed916c0fb3 | /tmp/crystra-workflow-package-t6 |
| UI | 482f6f175052bf770efbbbfe0b8ef54a6c365c45 | /tmp/crystra-ui-t6 |
| Execution | 0a708b59250cccda43ff6054000cb3af380d6906 | /tmp/crystra-t6-components/execution |
| Evidence | 84bb3152162dee4d448f4c8227f34a686af008d6 | /tmp/crystra-evidence-t6 |
| Evolution | 984a0dcf2d9388812136b789b5d0bc487c146d56 | /tmp/crystra-evolution-t6 |

Workflow 三包 DSL、发行测试与 CLI 检查通过后本地打包。远端 RC 已重新下载并通过 `release.cjs qualify`。macOS 与 Linux gzip 第 10 字节 OS 标记不同（19/3），解压后的 tar 完全相同；因此不宣称跨平台压缩包摘要相同。后续晋级仅使用远端已核验原始字节及其对应 descriptor/provenance。摘要与回执见 [Workflow 下载核验](evidence/t6-workflow-remote-verification.json)。普通 Execution GitHub source 消费包级 scoped tag，当前聚合候选 tag 的发现不在上述验证范围；最终组合仍需解决并验证这一分发步骤。

UI 本地 format/lint/type/test/package/react18/deps、26 浏览器测试和 Docker smoke 均通过。远端全部本地冻结文件逐字节一致，含 tgz SHA-256 da095799c375300900135dbdfd72497ae93079093a20b0d0629dd25996822792；[UI 下载核验](evidence/t6-ui-remote-verification.json)。

Evidence make check、Query 契约、16 项 PostgreSQL 集成和部署备份恢复通过。外部 Contracts 克隆按 CI 布局放在 /tmp/crystra-evidence-contracts-t6，避免 Ruff 扫描非本仓库 Python。测试容器及卷由自身脚本清理，未操作旧部署。

Evolution make check 的 191 测试、wheel/sdist 与带精确 revision 的本地镜像构建通过，镜像 sha256:394d8492e21caa8fc263d2f9bf91a9b26743344c0b456152c676e60cf89d6d14，实际容器 healthz 通过。该检查不等于连接真实 Evidence 完成领域计算；双平台远端镜像及组合联调仍待完成。

Execution 本机 native npm 下载失败后，确认锁文件相同，以只读 reflink 复制原组件已安装依赖到临时目录。pnpm 本地运行设置 verify-deps-before-run=false 避免迁移缓存路径自动重装；没有改动锁文件、源码、测试或远端安装步骤。最初临时目录过浅使 Harness workspace 覆盖状态目录，触发 CONFIG_PATH_OUT_OF_SCOPE；移至上表独立目录后交互测试通过。全量覆盖率 736 测试通过，行覆盖率 95.13%；类型、构建、生成物检查及 static/feasibility Harness、发行包验证均通过。曾遗漏 Harness phase 的调用失败仅属命令错误，已按 CI 的两个明确 phase 重跑。

Workflow/UI/Evidence 的旧 release/next 在精确 lease 替换前保存在各仓库 codex/crystra-pre-rename-release-next；Evolution 新建候选分支。所有推送使用单仓库短期 bot token，已撤销；未修改旧 tag，未触发 GA。源 main 均未修改。

Evidence/Evolution 候选均已成功，随后重新下载资产并从 GHCR 读取精确 digest 的 manifest/provenance/image config，验证两平台及源码绑定通过。Evidence wheel/sdist 与元数据摘要通过；[Evidence 证据](evidence/t6-evidence-remote-verification.json)、[Evolution 证据](evidence/t6-evolution-remote-verification.json)。Execution 候选作业 34801187270，独立 test:full 最终 736/736 通过后才推送。

本地完整日志位置与摘要见 [日志索引](evidence/t6-component-local-log-index.json)。目标稳定 tag 与 Release 已逐个只读检查，2026-09-14 均未占用。下一阶段边界见 [底层晋级提案](t6-component-promotion-proposal.md)。

Execution 34801187270 已成功，重新下载后制品验证通过，tgz、publication、metadata、notes 全部与本地冻结文件逐字节一致；回执源码／tag／元数据摘要与 PASS 绑定核验通过，见 [Execution 证据](evidence/t6-execution-remote-verification.json)。六个底层组件 RC 完成，进入已写明范围的人工晋级门槛；服务、插件、组合与 T7/T8 尚未完成。

## C026：继续 RC 与联调

用户明确当前不发 GA。撤回上一检查点的人工晋级暂停；已发布 RC 可作为服务和插件候选的精确输入。服务、插件、组合 RC 均由候选分支自动发布，先完成真实联调。未来正式晋级仍需对具体 RC 与其依赖执行资格检查，不能因此要求现在提前 GA。

服务 RC 来源 43b6fb5d9f8b9f956f83eb707d1ce99f621b4e57，组合 bot PR #277，非 Draft、CI 通过。候选分支自动发布作业 34802450361 成功；下载后七个文件与本地全部逐字节一致，见 [服务证据](evidence/t6-services-remote-verification.json)。插件独立资格目录 /tmp/crystra-dsh-t6，分支 codex/crystra-published-rc-inputs；已接 Execution/UI RC URL 与该服务描述，修正三个开发态测试夹具后正在全量资格。

插件 RC 真实安装复现 pnpm 11 `ERR_PNPM_EXOTIC_SUBDEP`：默认禁止 URL 子依赖。开发 profile 的本地 overrides 没有覆盖该发布场景。修复在 /tmp/crystra-dsh-t6，0074c86：发行包使用 npm bundled dependencies，仅纳入经摘要验证的 Execution/UI 原始归档；其余 registry 依赖提升为根依赖由宿主按平台解析。隔离打包目录不含本机第三方／原生依赖，避免 macOS 二进制进入 Linux 包。新增归档回归先失败后通过；199 测试、build、pack 校验与锁定 DSH 0.1.1-rc.2 的 clean profile 安装通过。候选归档 /tmp/crystra-dsh-t6-bundled-local-assets 正在执行完整资格，尚未发布插件 RC。

先前初始化测试意外启动的本次 crystra-host-init-x8XsUr 容器、网络、卷已通过 Compose 标签和临时路径确认后精确清理；旧 WSR 容器未动。开发态测试现已显式注入缺失 descriptor 夹具，不再读取真实发布服务描述启动容器。

插件实际归档六项资格全部 PASS，见 [本地回执](evidence/t6-dsh-local-qualification.json)。插件 RC 作业 34803216172 已自动触发，来源 0074c86；bot PR #38 后续仅更新验证工作流至 e04982d，改为消费已发布 RC 字节，避免将重建开发包误作同一发行归档。该 CI 修正的发行回归测试通过。

插件 RC `crystra-dsh-v0.1.0-rc.1` 已发布，34803216172 成功。下载插件 tgz、兼容矩阵、provenance、metadata 与本地冻结字节相同；插件 tgz SHA-256 `97196ad715f3ff4e162b4ae2b1f7a07456dc3f27c21dceaffbc3d07573d493be`。远端日志、资格回执和 SBOM 时间独立生成，未宣称它们与本地相同；全部 SHA256SUMS 和六组 receipt/log 摘要绑定已复验通过，见 [插件远端核验](evidence/t6-dsh-remote-verification.json)。PR #38 的最新 e04982d CI 34803316628 通过；尚待 main 集成，候选来源仍精确保持 0074c86，二者仅相差验证 CI 修正。

下一步：从上述精确 RC 构建组合候选，继续实际 Workflow 发现和跨服务交付联调。现有普通 GitHub Workflow source 仅发现包级 scoped tag，尚不能直接消费聚合 Workflow RC；这是真实待解决项，不通过提前 GA 绕过，也不将已经通过的服务／插件资格误写为完整交付联调完成。T6 保持 IN_PROGRESS，T7/T8 未启动。

## C028：真实链路与生产重定向修复

Execution rc.2（82a88ea）与 Evolution rc.2（b7163f2）自动发布、下载及来源绑定通过。Execution 757 测试、Evolution 195 测试，三种真实 Workflow RC 都经过两消费端验证。服务 rc.2 来源 e02ce314、自动作业 34814548507 成功。插件 #38 本地精确 Execution 输入已更新，199 测试和构建通过，尚未提交新输入。

真实 Execution 归档运行 hello-world-workflow 0.2.0，两个确定性 Provider 角色成功；真实 PostgreSQL/Evidence 记录任务、交付终态与 Trace；Evolution 返回 12 个指标，终态及耗时可用。该夹具不产生真实 LLM token/cost，不能将相关指标缺输入写成完整覆盖。

容器联调揭示生产 Workflow HTTP 客户端未跟随 GitHub Release 302，导致 workflow_resolutions=UNAVAILABLE/SOURCE_UNAVAILABLE；先前源码验证脚本的 follow_redirects=True 掩盖了此配置缺口。本地失败回归确认 302；修复后 196 测试、格式、类型及构建通过。开发镜像 93ccfa2a06cdcc3869db0235dacbf5c781133faadb08740cfcf35701f236dced 用生产配置真实下载并契约校验成功。修复提交 c5aa85ec25781d11df31354b076764fa900754a7，沿用 Evolution bot PR #10，rc.3 正在自动生成。最终组合必须使用后续服务候选，不能把 rc.2 的领域解析缺口标记通过。

恢复脚本：/tmp/crystra-real-chain.mjs（已增加 Workflow AVAILABLE 断言）、/tmp/crystra-qualify-real-chain.mjs（隔离容器且 finally 清理，仅 /tmp 测试工具）；远端输入部分草案 /tmp/crystra-combination-partial-inputs.json。最新失败／部分通过日志 /tmp/crystra-real-chain.log 与 /tmp/crystra-real-chain-proof.json；它们不代表最终资格。

下一步：核验 Evolution rc.3；生成服务 rc.3；真实链路全部通过后更新 DSH 服务描述并生成插件 rc.2，再冻结组合 rc.1。T7/T8 尚未进行，无需 GA 或人工发布 RC。

## C030：最终候选组合冻结

服务 rc.3 作业 34815338639 成功，七个下载文件与本地逐字节一致。插件 rc.2 源码 9a9777d6fc8d2d104dc8f18ccffe9660239b21a4，199 测试、构建、归档／来源验证和六项精确制品资格全部通过，自动 RC 作业 34815768299。本地制品 /tmp/crystra-dsh-rc2-local-assets；日志 /tmp/crystra-dsh-rc2-qualification.log。

组合隔离仓库提交 1593f589，清单 release/combinations/0.1.0-rc.1.json 固定 Contracts rc.1、Execution rc.2、UI rc.1、Evidence rc.1、Evolution rc.3、Workflow rc.1、DSH rc.2、services rc.3，并固定对应 gitlink。50 项组合回归通过。等待插件远端原字节核验后，运行 build-combination-candidate / qualify-combination-candidate / finalize-combination-candidate，再沿 release/next 自动生成 crystra-v0.1.0-rc.1。组合 PR #277 将更新为整个最终 RC 组合，保持 bot／非 Draft。

T7 仅新增只读盘点：旧 WSR 56 个容器、12 个运行、14 个专用数据库卷，来源绑定保存在 /tmp/crystra-t7-containers.json。未停止或删除任何旧资源。原 ~/.config/wsr/credentials 私钥仍由改名后的发行 App 复用，不得随旧部署清理删除。
