# Crystra 命名映射表

日期：2026-09-13。配套 [分析报告](analysis-report.md) 与 [文件证据](file-inventory.md)。机器可读版本：[naming-map.json](naming-map.json)。

“已确定”来自本次用户约束；“命名方案／建议落定”是待实施采用的具体拼写；“待定”不阻止分析交付。仓库唯一入口与插件包名的方向相反：**仓库 crystra-dsh，插件 dsh-crystra**。目标坐标已在 T0 检查，见 [T0 决策](t0-decisions.md)；八仓库远端更名已完成且 ID 不变，见 [读回记录](repository-renames.json)；发布权限仍待配置，本地目录尚未移动。

本表不是全局替换脚本。多对一归并必须先于一般前缀规则；仓库 URL、npm 包、内部插件 ID、普通功能名属于不同上下文。保留字段／概念不因为包含 execution 或 workflow 就改名。新制品必须重新构建，不对旧归档换壳。

命名规则：品牌 Crystra；技术前缀 crystra；环境变量 CRYSTRA；Python 模块 crystra_*；JS 符号按原大小写结构替换。未经确认不引入新域名，不假设 npm scope 已有权限。


补充：[LoopX 安装对照](installation-comparison.md)。单插件不要求单内部 Loader 行；用户已确认优先取消独立安装器；内部实现已由 [T0 决策](t0-decisions.md)落定。

## 仓库

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N001 | firestige/workflow-self-recursive | firestige/crystra | rename-repository | 远端已更名；本地路径待协调 | 原仓库 ID 保持不变，origin 已更新；组件独立 main 开发，crystra 负责组合发布。 |
| N002 | firestige/wsr-contracts | firestige/crystra-contracts | rename-repository | 远端已更名；本地路径待协调 | 原仓库 ID 保持不变，origin 已更新；组件独立 main 开发，crystra 负责组合发布。 |
| N003 | firestige/wsr-execution | firestige/crystra-execution | rename-repository | 远端已更名；本地路径待协调 | 原仓库 ID 保持不变，origin 已更新；组件独立 main 开发，crystra 负责组合发布。 |
| N004 | firestige/wsr-evidence | firestige/crystra-evidence | rename-repository | 远端已更名；本地路径待协调 | 原仓库 ID 保持不变，origin 已更新；组件独立 main 开发，crystra 负责组合发布。 |
| N005 | firestige/wsr-evolution | firestige/crystra-evolution | rename-repository | 远端已更名；本地路径待协调 | 原仓库 ID 保持不变，origin 已更新；组件独立 main 开发，crystra 负责组合发布。 |
| N006 | firestige/wsr-dsh | firestige/crystra-dsh | rename-repository | 远端已更名；本地路径待协调 | 原仓库 ID 保持不变，origin 已更新；组件独立 main 开发，crystra 负责组合发布。 |
| N007 | firestige/wsr-ui | firestige/crystra-ui | rename-repository | 远端已更名；本地路径待协调 | 原仓库 ID 保持不变，origin 已更新；组件独立 main 开发，crystra 负责组合发布。 |
| N008 | firestige/wsr-workflow-package | firestige/crystra-workflow-package | rename-repository | 远端已更名；本地路径待协调 | 原仓库 ID 保持不变，origin 已更新；组件独立 main 开发，crystra 负责组合发布。 |

## 品牌

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N009 | WSR / Workflow Self-Recursive / workflow-self-recursive | Crystra | rewrite | 已确定 | 用于当前产品称谓；README 定位需重写，不宣称已实现自主递归优化。 |
| N010 | WSR Studio / WSR BI | Crystra Studio / Crystra BI | rename-display | 建议落定 | 可保留为功能视图名，不代表独立插件。 |

## DSH 插件

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N011 | dsh-wsr-execution | dsh-crystra | merge | 已确定 | 一个公开发布包；旧包停止分发，无别名；Intake 独有功能需先核对。 |
| N012 | dsh-wsr-studio | dsh-crystra | merge | 已确定 | 一个公开发布包；旧包停止分发，无别名；Intake 独有功能需先核对。 |
| N013 | dsh-wsr | dsh-crystra | merge | 已确定 | 一个公开发布包；旧包停止分发，无别名；Intake 独有功能需先核对。 |
| N014 | wsr-dsh-intake | dsh-crystra | merge | 已确定 | 一个公开发布包；旧包停止分发，无别名；Intake 独有功能需先核对。 |
| N015 | wsr-dsh 与 wsr-execution 的 dsh-plugin Topic | 仅 firestige/crystra-dsh 保留 dsh-plugin | single-registration | GitHub Topics 已验证 | 仅 crystra-dsh 保留 dsh-plugin，见 repository-discovery.json；T8 再核实最终可安装市场状态。 |
| N016 | marketplace/packages.json 的三个条目 | 一个 dsh-crystra 条目 | merge | 已确定 | 只注册 crystra-dsh 仓库；displayName 建议 Crystra。 |
| N017 | wsr-dsh-monorepo 根包 + 三个 workspace | 根包 dsh-crystra + 内部功能目录 | restructure | 建议落定 | 建议根包直接发布；原 suite 不再是空壳，内部模块不单独发布。 |
| N018 | Cordis id: wsr-execution / wsr-studio | crystra-* 内部节点；name 仅用 dsh-crystra 或其子路径 | unify-package | 建议落定 | 一个包可有多个 Cordis 行；无需硬合成一个节点。旧 workspace UI 替换只生效一次。 |
| N019 | 服务端 name: workflow-execution / wsr-studio | crystra-* 包内功能名 | internalize | 建议落定 | 允许多个内部 apply／inject；都从唯一公开包导出，生命周期正确。 |
| N020 | ModuleLoader id: dsh-wsr-execution / dsh-wsr-studio | dsh-crystra 包内浏览器装配 | unify-package | 建议落定 | 不要求所有代码手工合成一个浏览器模块；以 DSH 包发现和构建机制验证。 |
| N021 | 客户端 name: wsr-execution-client / wsr-studio-client | 客户端 name: crystra-client | merge | 建议落定 | 依赖注入取并集，slot、timer、disposer 合并。 |
| N022 | /wsr 命令 | /crystra | rename-command | 建议落定 | 帮助、提示词、消息 source.workflowCommand、命令解析和测试一起修改。 |
| N023 | workflow_execution_intake 工具 | crystra_workflow | rename-tool | 建议落定 | 建议消除对外 Intake 身份；保留原操作语义，所有提示词／调用方一起改。 |
| N024 | skills/workflow-execution 与 /workflow-execution 指令 | skills/crystra-workflow 与 /crystra-workflow | rename-skill | 建议落定 | 建议名称；只在插件安装的此 Skill 与调用方中修改，不全局改技术词。 |
| N025 | installation.dshMode: execution \| studio \| suite | 移除 dshMode；固定单插件坐标 | remove-mode | 建议落定 | 功能降级按服务状态处理，不再作为安装插件选择。 |
| N026 | compatibility.packages.{execution,studio,suite} | compatibility.plugin: dsh-crystra@<version> | reshape-manifest | 建议落定 | 建议字段；producer、installer、validator、fixtures 同步修改。 |
| N027 | 两个平级配置 overlay | dsh-crystra 内部模块的配置装配 | reshape-config | 建议落定 | 允许多个内部节点或统一外层；每个模块接收自己 schema 支持的字段。 |
| N028 | dsh plugin add 核心库坐标 + 所选插件 | 只选择 dsh-crystra；核心库为精确普通依赖 | reshape-install | 建议落定 | 禁止把核心库宣传／注册为第二个插件；依赖包数量不要求为一。 |

## 包与模块

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N029 | @wsr/product-operations | 取消独立分发；必要代码作为插件内部模块 | rename-package | T0 已落定 | 建议取消面向 DSH 用户的独立安装入口；可移除独立分发或转内部库，不先机械更名发布。 |
| N030 | wsr-execution | crystra-execution | rename-package | 建议落定 | 独立普通运行时库，不是 DSH 插件。 |
| N031 | wsr-ui-core | crystra-ui-core | rename-package | 建议落定 | 独立普通 UI 库，不是 DSH 插件。 |
| N032 | wsr-ui 根 workspace | crystra-ui | rename-workspace | 建议落定 | 同步 npm --workspace、构建、lockfile。 |
| N033 | @workflow-self-recursive/* | @crystra/* | rename-scope | 建议落定 | 名称可用性／scope 权限待核实；保持各契约后缀。 |

## 契约包

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N034 | @workflow-self-recursive/delivery-admission-contract | @crystra/delivery-admission-contract | rename-package | 建议落定 | 保持原契约语义；candidate 不因更名自动变为稳定契约。 |
| N035 | @workflow-self-recursive/evaluation-contract | @crystra/evaluation-contract | rename-package | 建议落定 | 保持原契约语义；candidate 不因更名自动变为稳定契约。 |
| N036 | @workflow-self-recursive/evidence-query-contract | @crystra/evidence-query-contract | rename-package | 建议落定 | 保持原契约语义；candidate 不因更名自动变为稳定契约。 |
| N037 | @workflow-self-recursive/evidence-task-query-candidate | @crystra/evidence-task-query-candidate | rename-package | 建议落定 | 保持原契约语义；candidate 不因更名自动变为稳定契约。 |
| N038 | @workflow-self-recursive/execution-provider-binding-candidate | @crystra/execution-provider-binding-candidate | rename-package | 建议落定 | 保持原契约语义；candidate 不因更名自动变为稳定契约。 |
| N039 | @workflow-self-recursive/observation-task-binding-candidate | @crystra/observation-task-binding-candidate | rename-package | 建议落定 | 保持原契约语义；candidate 不因更名自动变为稳定契约。 |
| N040 | @workflow-self-recursive/observation-contract | @crystra/observation-contract | rename-package | 建议落定 | 保持原契约语义；candidate 不因更名自动变为稳定契约。 |
| N041 | @workflow-self-recursive/task-binding-contract | @crystra/task-binding-contract | rename-package | 建议落定 | 保持原契约语义；candidate 不因更名自动变为稳定契约。 |
| N042 | @workflow-self-recursive/workflow-dsl-contract | @crystra/workflow-dsl-contract | rename-package | 建议落定 | 保持原契约语义；candidate 不因更名自动变为稳定契约。 |

## Python

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N043 | wsr-evidence | crystra-evidence | rename-distribution | 建议落定 | 同步 pyproject、entry point、import、Dockerfile、部署和测试；不移动旧环境。 |
| N044 | wsr-evolution | crystra-evolution | rename-distribution | 建议落定 | 同步 pyproject、entry point、import、Dockerfile、部署和测试；不移动旧环境。 |
| N045 | wsr_evidence | crystra_evidence | rename-module | 建议落定 | 同步 pyproject、entry point、import、Dockerfile、部署和测试；不移动旧环境。 |
| N046 | wsr_evolution | crystra_evolution | rename-module | 建议落定 | 同步 pyproject、entry point、import、Dockerfile、部署和测试；不移动旧环境。 |

## CLI

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N047 | wsr / product-operations/bin/wsr.mjs | crystra / product-operations/bin/crystra.mjs | rename-command | 优先取消独立入口；内部实现待定 | 若取消独立安装器，可不保留该公开 CLI；初始化／诊断能力归插件内部。 |
| N048 | wsr-compose / wsr-host-preflight.mjs | crystra-compose / crystra-host-preflight.mjs | rename-command | 建议落定 | 修改模板源与生成引用，不迁移旧生成包。 |
| N049 | execution-config | execution-config | keep | 保留 | 当前不含旧品牌，保持领域 CLI；若统一公共 CLI 属于额外产品设计。 |

## 配置与状态

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N050 | WSR_* 环境变量 | CRYSTRA_* | rename-family | 建议落定 | 配置、部署、Actions、测试变量和文档同步；不双读旧名称。 |
| N051 | .wsr/role-provider-bindings.json | .crystra/role-provider-bindings.json | rename-path | 建议落定 | 新安装读写新目录；旧数据不自动导入。 |
| N052 | ~/Library/Application Support/WSR | ~/Library/Application Support/Crystra | rename-path | 建议落定 | 仅创建新路径。 |
| N053 | ~/.config/wsr 与 ~/.local/state/wsr | ~/.config/crystra 与 ~/.local/state/crystra | rename-path | 建议落定 | 保持 XDG 根目录覆盖语义。 |
| N054 | Windows APPDATA/WSR 与 LOCALAPPDATA/WSR | Windows APPDATA/Crystra 与 LOCALAPPDATA/Crystra | rename-path | 建议落定 | 保持平台目录选择，不做旧路径扫描迁移。 |
| N055 | wsr.* 浏览器存储键 / wsrBiParent | crystra.* / crystraBiParent | rename-state | 建议落定 | sessionStorage、localStorage、history 生产／读取双方同步，新会话开始。 |
| N056 | wsr_evidence 数据库及 _admin/_runtime/_backup 角色 | crystra_evidence 及对应角色 | rename-database | 建议落定 | 新实例初始化、备份／恢复脚本同步；不迁移旧 DB。 |
| N057 | wsr-* Compose 项目、volume、服务标识 | crystra-* 对应标识 | rename-deployment | 建议落定 | 不重命名或接管旧卷；普通 postgres 等第三方服务名不改。 |
| N058 | io.wsr.state-identity / .wsr-state-identity | io.crystra.state-identity / .crystra-state-identity | rename-state | 建议落定 | 标签写入与资源所有权检查一致。 |

## 协议与内部标识

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N059 | wsr.compatibility@1.0.0 | crystra.compatibility@1.0.0 | new-schema | 建议落定 | 建议从新 namespace 起步；移除三模式字段，必须配套新 schema 定义。 |
| N060 | wsr.global-config@1.0.0 | crystra.global-config@1.0.0 | new-schema | 建议落定 | 只支持新配置格式；字段结构见统一插件建议。 |
| N061 | wsr.presentation@<revision> | crystra.presentation@<revision> | rename-schema | 建议落定 | revision 不机械重置；先审查仍使用的格式，所有消费者同步。 |
| N062 | 其它现行 wsr.* schema namespace | crystra.* | rename-family | 建议落定 | 排除历史证据；DSH、产品运维、UI release namespace 一起处理。 |
| N063 | urn:wsr:* | urn:crystra:* | rename-schema-id | 建议落定 | 保留具体领域和版本后缀，更新引用与校验。 |
| N064 | workflow-self-recursive.dev schema IDs | urn:crystra:<domain>:<contract>:<version> | replace-schema-id | 建议落定 | 建议使用 URN；新域名所有权未知，不假设 crystra.dev 可用；配套逐个 $ref 更新。 |
| N065 | firestige/system-contracts 等更早仓库 schema URLs | firestige/crystra-contracts 对应 schema 地址或明确 URN | normalize-legacy-coordinate | 建议落定 | 旧名称不一定含 wsr，需额外扫描旧仓库别名。 |
| N066 | /wsr-studio RPC | /crystra-studio RPC | rename-channel | 建议落定 | 内部功能 channel 不等于独立插件；保留 loopback 与 allowlist。 |
| N067 | wsr-* CSS 类／--wsr-* 变量／品牌 DOM ID | crystra-* / --crystra-* | rename-family | 建议落定 | 跨 UI 和 DSH 同步；生成 bundle 从源码重建。 |
| N068 | Wsr／wsr 品牌代码符号与 WSR_* 错误码 | Crystra／crystra 与 CRYSTRA_* | rename-symbols | 建议落定 | 如 parseWsrCommand；错误码和消费者同步，不误改第三方或无关技术概念。 |

## 发布资产

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N069 | wsr-product-operations-<version>.tgz[.sha256] | crystra-product-operations-<version>.tgz[.sha256] | new-artifact | 建议落定 | 新构建与新摘要；方括号表示可选 checksum 后缀。 |
| N070 | wsr-product-<version>.release.json / .config.example.json | crystra-product-<version>.release.json / .config.example.json | new-artifact | 建议落定 | 重建新组合清单与新配置样例。 |
| N071 | wsr-services-<version>.tar.gz / .release.json | crystra-services-<version>.tar.gz / .release.json | new-artifact | 建议落定 | 全新 Compose 包，精确引用新镜像。 |
| N072 | wsr-execution-<version>.tgz / wsr-ui-core-<version>.tgz | crystra-execution-<version>.tgz / crystra-ui-core-<version>.tgz | new-artifact | 建议落定 | 独立组件普通制品，插件安装透明依赖。 |
| N073 | 三个 dsh-wsr* 插件 tarball | dsh-crystra-<version>.tgz | merge-artifact | 已确定 | 发布验证只期待一个插件 tarball；metadata／SBOM 可另行存在。 |
| N074 | wsr_evidence-* / wsr_evolution-* wheel、sdist | crystra_evidence-* / crystra_evolution-* | new-artifact | 建议落定 | Python 工具生成规范文件名，不手工改旧归档。 |
| N075 | ghcr.io/firestige/wsr-evidence / wsr-evolution | ghcr.io/firestige/crystra-evidence / crystra-evolution | new-image | 建议落定 | 新镜像、新 digest、source label 和分发权限。 |
| N076 | wsr-ui-bi:local | crystra-ui-bi:local | rename-build-target | 建议落定 | 本地构建与 smoke 脚本同步。 |
| N077 | 旧 product-* tag 与组件旧版本 | <新仓库名>-v0.1.0[-rc.N]；以后独立版本 | new-release | T0 已落定 | 全新发行 epoch；契约 revision 不重置；未打 tag 或发布。 |

## 发布配置

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N078 | WSR_RELEASE_CLIENT_ID / WSR_RELEASE_APP_PRIVATE_KEY | CRYSTRA_RELEASE_CLIENT_ID / CRYSTRA_RELEASE_APP_PRIVATE_KEY | rename-setting | 建议落定 | 只改配置键及引用；实际外部权限另核实，不读取或复制 secret 值。 |
| N079 | authority_ref + 主仓库 gitlink 决定组件源码 | 组件 main 上选定的精确源码提交 | decouple | 职责已确定，机制建议 | 组件发布自身选择；组合侧后选可用制品，不隐式追随 latest。 |
| N080 | UI push: iter5/implementation；Execution／Workflow 无 push main | 各组件 CI 覆盖 main | change-trigger | 职责已确定，机制建议 | main 开发不等于 main push 自动公开发布。 |
| N081 | release/next 候选渠道 | 可保留，从组件 main 选定提交 | keep-or-adjust | 待实现选择 | 不把保留发布分支误写为违反 main 开发。 |

## 本地路径与文档

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N082 | 独立 checkout 名称 wsr-* | 对应 crystra-* | rename-local-path | 建议落定 | 实施时更新脚本引用；不操作本轮工作树。 |
| N083 | 主仓库 submodule path: wsr-dsh / wsr-ui | crystra-dsh / crystra-ui | rename-gitlink-path | 建议落定 | 如继续保留子模块则更名；忽略当前子模块未提交变化。 |
| N084 | workflow-package / execution-system / evidence-system / evolution-system / system-contracts 子模块路径 | 可保留这些无品牌功能路径 | keep | 建议保留 | 只要求 URL 跟随仓库更名，不为名称整齐扩大路径迁移。 |
| N085 | project-ops.config requirements.repository 旧主仓库坐标 | firestige/crystra | rename-coordinate | 建议落定 | 只跟随仓库更名；是否迁移 Issue authority 待定。 |
| N086 | 主仓库当前 docs/contracts 与 docs/systems 开发依据 | 对应组件的现行文档／独立契约输入 | relocate-current-docs | 建议落定 | 按责任归属逐项落定；组合仓库保留安装／组合／产品入口；不整理历史归档。 |

## 视觉

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N087 | Marketplace icon.svg 的 WSR 标题和 W 图形 | Crystra 标题和新品牌图形 | replace-current-visual | 建议落定 | 需要设计或选择新品牌图形；只改 SVG title 不够。 |
| N088 | 现用 banner、architecture、social-preview 与演示图 | 当前 Crystra 版本 | replace-current-visual | 建议落定 | 文件名可保留通用名称；更新画面、alt、引用；历史验收截图排除。 |

## 保留与排除

| ID | 当前名称／结构 | 目标 | 操作 | 状态 | 说明 |
|---|---|---|---|---|---|
| N089 | Crystra tokens／geometry／theme 已有文件名 | 保持现名，审查内部 wsr 引用 | keep-name-update-content | 保留 | 不用再次重命名已经正确的资产。 |
| N090 | Workflow / Execution / Evidence / Delivery / Runner 等领域词 | 保持 | keep | 保留 | 单插件不等于取消组件边界；Evolution 是否改领域名不在本次范围。 |
| N091 | @deepseek-ai/*、第三方产品、通用 recursive 调用 | 保持 | keep | 保留 | 不修改第三方命名及递归技术操作。 |
| N092 | 旧制品／Release／历史清单／provenance／截图 | 不迁移、不改写 | exclude | 已确定 | 移除现行代码对旧输入的依赖，但本轮不实际删除旧资产。 |
## 实施时的残留检查

1. 对现行文本和文件名扫描 wsr、Wsr、WSR、workflow-self-recursive 及其空格写法；结果逐项解释。
2. 额外扫描 dsh-wsr*、wsr-dsh-intake、workflow-execution、dshMode、旧 firestige/system-contracts 坐标和 .dev schema ID。
3. 在旧名已消失后仍检查三个包数量断言、双入口初始化、返回 disposer、主仓库先行 pin、main CI 等结构性约束。
4. 只注册 crystra-dsh：检查 GitHub Topics、Marketplace、npm 元数据及可访问的实际插件发现入口；不能仅看 package.json。
5. 历史白名单只豁免历史内容；当前代码对旧清单、旧 tgz、旧 publication 的依赖必须替换。
6. 不运行旧系统升级测试；执行全新安装和 Crystra 自身生命周期验证。
