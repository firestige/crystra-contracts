# Crystra 更名与 DSH 单插件归并：检查报告

日期：2026-09-13。状态：完成静态检查；供实施评审。未修改产品代码、工作流、仓库名称或外部注册，未执行构建、运行时测试、发布或旧资产删除。

本目录暂存跨仓库分析交付物，不表示将产品级规范或发布职责迁入 Contracts。实施命名见 [命名映射表](naming-map.md)，逐文件证据见 [扫描索引](file-inventory.md)／[JSON](file-inventory.json)，在线仓库简介与 Topics 快照见 [repository-metadata.json](repository-metadata.json)。

## 后续补充与修正

用户补充要求旧 WSR 脏数据至少打包隔离；这是新增实施工作，不等于迁移旧资产。本次 LoopX 对照也修正了单包必须单 Loader 节点的过度约束。详见 [安装方式与隔离补充](installation-comparison.md)。用户后续确认优先取消独立安装器、允许内部依赖拆分，旧部署本次人工清理，不开发清理程序；按 [实施计划](implementation-plan.md) 推进。

## 1. 结论与本次确定的范围

Crystra 的方向是优化 Workflow，把稳定工作逐步固化为确定、可测试的执行步骤，减少仍需 Agent／LLM 的部分。自动发现和替换稳定行为属于产品方向，不因更名而成为已经交付的能力。

当前工作分为三类：全新品牌与技术命名；DSH 多插件归并；组件开发／发布与组合发布解耦。复杂度主要来自后两类，不能按字符串替换估算。

本次对话已确定：

1. 产品名为 Crystra；仓库、当前文档与当前资产采用新名称。
2. 各组件在自身仓库的 main 演进；原 workflow-self-recursive 目录以后仅用于发布可用组合。忽略该工作树子模块的未提交变化。
3. 不迁移旧制品、旧 Release、旧镜像、旧兼容清单、旧历史资产；不做 WSR → Crystra 升级、旧状态迁移或旧名称兼容别名。
4. DSH 对外只有一个插件 dsh-crystra，不再单独发布 Intake、Execution、Studio、Suite 插件。
5. DSH 插件只注册 firestige/crystra-dsh 仓库。其它组件可以作为普通库／服务依赖，但不能成为另一个 DSH 插件入口。
6. 本轮只检查和产出文档。旧资产实际删除、仓库更名和发布不在本轮执行。

此前“分别改成 dsh-crystra-execution／dsh-crystra-studio”以及“保留旧制品迁移链路”的方案失效。内部仍可有 execution、studio、intake 等功能模块；它们不再拥有独立公开插件身份。

## 2. 基线与统计口径

通过主机 gh CLI 在线读取 8 个仓库远端 main SHA，再用本地已有 Git 对象导出对应提交的只读快照。不 checkout、不 fetch、不改组件工作树，也不读取主仓库子模块内容。

Execution 本地 main 为 597a0a6a604899cc890a2fb2c2728e3765add3e6，比核实的远端 main 少 6 个提交；报告采用远端 main。主仓库当前工作分支也不是 main；报告采用远端 main，不把本地组合变化算作需要修复的问题。其余 6 个组件的本地 main 与此次远端快照一致。未跟踪的 project-ops.config 作为补充配置单列，不计入提交扫描数。

| 仓库 | 远端 main SHA |
|---|---|
| workflow-self-recursive | `3fc8aef3142bda61f63174ad9998c41c4b42c4bb` |
| wsr-contracts | `b4b6ab8f89aa2467e09d40f68766e7e40e6a6763` |
| wsr-dsh | `117b54cc2711b303bb63b278836ea2c1174f3d34` |
| wsr-evidence | `1557a38b863be50e24b037796b7dbfa73af4b2f8` |
| wsr-evolution | `da2ffeddfeadaa659883bccfe380aefe1b5b6d7c` |
| wsr-execution | `dbec4ec441f384ec83788890e5ed614a7c405dec` |
| wsr-ui | `666a5506ffab723ebf54660c899900eaebda22e0` |
| wsr-workflow-package | `14ceea87f08ee4e468b2782c9beecfd5c136fe65` |

匹配规则：对快照中的文本文件使用不区分大小写的 `wsr|workflow[- ]self[- ]recursive`。一个文件只计一次，一行多次命中仍计一行。未展开 tgz／whl／图片内容，未扫描 node_modules；目录名和 GitHub 外部设置另外检查。

本次共 **816 个文本文件、6,787 个命中行**。上轮 790／6,540 使用当前本地工作树；基线不同，本表取代其作为分析基线，不能把差值理解成新增需求。

| 仓库 | 源码／配置／工具 | 当前文档待审 | 测试待审 | 重生成 | 历史排除 | 总命中 |
|---|---:|---:|---:|---:|---:|---:|
| workflow-self-recursive | 60 | 86 | 9 | 0 | 149 | 304 |
| wsr-contracts | 32 | 6 | 1 | 10 | 6 | 55 |
| wsr-dsh | 50 | 16 | 19 | 3 | 4 | 92 |
| wsr-evidence | 37 | 5 | 20 | 1 | 4 | 67 |
| wsr-evolution | 37 | 2 | 30 | 1 | 0 | 70 |
| wsr-execution | 50 | 10 | 34 | 2 | 19 | 115 |
| wsr-ui | 66 | 8 | 15 | 2 | 6 | 97 |
| wsr-workflow-package | 10 | 5 | 1 | 0 | 0 | 16 |

共 **628 个非历史候选文件**：342 个源码／配置／工具、138 个当前文档候选、129 个测试候选、19 个重生成文件。188 个明确历史路径命中不迁移。

这些是按路径做的可复核初筛，不是最终编辑清单或工时承诺：文档仍可能是历史设计，普通文件也可能含历史段落；tools 下的测试按工具计入。19 个文件通过改源头重生成，不手工批改。无旧名称的 CI 触发器、入口配置、文档权属仍可能需要结构性调整，因此 628 也不是完整实施文件数。

历史排除规则：tmp/、migration/、qualification/、release/candidates/、release/compose/、release/product/、product-operations/manifests/、各 publication/、CHANGELOG.md 和旧 iter6 迁移报告。这里排除的是旧快照迁移，不是删除目录规则；例如 Evidence 的 migrations/ 是数据库初始化代码，仍属于现行代码。

**历史文件不改写；仍在使用它们的脚本必须解除依赖，改用全新生成的 Crystra 输入。** 当前 release/request.json、config/dsh-compatibility.json 即使指向旧制品，也不能按历史文件直接忽略。新的发布证明、checksum、合同 publication 仍须生成。

## 3. DSH 归并检查

### 3.1 当前结构：三个发布包、两个实际插件入口

- packages/execution：dsh-wsr-execution。服务端从 src/index.js 导出 Intake 插件；其 apply 创建 runtime，注册命令 wsr、workflow_execution_intake 工具、agent/pre-step hook 和 Delivery RPC，并在 effect 中解除注册、等待任务和关闭 runtime。[E02]
- packages/studio：dsh-wsr-studio。服务端独立注册 /wsr-studio 网关；浏览器独立注册 Studio conversation.view。[E03][E19][E26]
- packages/suite：dsh-wsr。只是依赖前两个包，patch 插入两个独立节点，没有统一服务端／浏览器入口。把 Suite 改名不能满足单插件要求。[E01][E27]
- Execution 组件仓库仍保留 packages/dsh-intake 和旧本地 E2E 打包／生命周期脚本。应核对独有行为，必要功能收进 crystra-dsh；停止旧插件分发与旧入口验证。不能直接假设整个目录都无用。[E21]

### 3.2 已确认的结构性改动

| 检查项 | 现状与具体影响 | 建议目标 |
|---|---|---|
| npm 发布单元 | package-artifacts、candidate builder、publish-npm-set、foundation policy 明确要求三个包、固定顺序和包数量 | 一个可发布包 dsh-crystra；其它代码为内部模块，不保留“空壳 Suite + 两个公开插件” |
| 服务端入口 | Execution async apply 与 Studio apply 分离 | 一个公开插件包可保留多个内部模块／apply；由统一 patch 装配，正确处理成功、失败和卸载 |
| 配置对象 | Execution profile 严格只接受 configFile、bindingFile 两个键，直接加入 hostConfigFile 会报错 | 统一外层配置，例如 execution:{configFile,bindingFile}, studio:{hostConfigFile}；分派各子对象给内部模块 |
| 注入依赖 | Execution 需要 commands/tools/attachments/agents/workspaceRegistry/connection；Studio 需要 connection | 统一入口声明依赖并集；不能因包装丢失某模块依赖 |
| 生命周期 | Execution 用 ctx.effect；Studio 服务端和浏览器 apply 返回 disposer | 组合入口必须接住返回值；部分初始化失败时撤销已注册资源；卸载后不残留 timer/RPC/hook/slot |
| 浏览器构建 | build-client-bundles 生成两个 ModuleLoader ID；Execution 内嵌固定版本 workspace UI fork | 统一包内的 client 装配；允许内部模块，核对 fork 只初始化一次，工作区替换只生效一次；合并所需注入和样式 |
| Marketplace | packages.json 有三个条目 | 一个 dsh-crystra 条目；品牌显示 Crystra |
| 组件依赖 | Execution owner 制品和摘要写在 config 与 metadata；Studio 依赖 wsr-ui-core | 插件依赖精确的新 crystra-execution／crystra-ui-core；不复制领域执行逻辑 |

证据：[E02][E03][E04][E05][E06][E17][E18][E19][E20][E22][E23]。上述生命周期项是归并后必须满足的要求，不是已证明现行独立插件存在泄漏。

建议在 crystra-dsh 仓库根 package.json 发布 dsh-crystra，保留 src/execution、src/studio 等内部目录。具体目录布局是实施建议，不是用户已指定契约。

### 3.3 安装器必须一起调整

当前 global-config 校验 installation.dshMode 为 execution／studio／suite；安装器按该模式选包，写两种 overlay，并把 executionOwner.coordinate 与所选插件一起传给 dsh plugin add --workspace-root。维护代码也预期核心包出现在根清单内。[E07][E08][E25]

因此需要：

- 删除公开的三模式选择，组合清单只选择一个插件坐标。
- patch 只引用 dsh-crystra 包及其内部子路径；可保留多个功能节点，配置提供执行与 Studio 所需信息。
- 建议将 crystra-execution 作为插件的精确普通运行时依赖；crystra-ui-core 作为普通 UI 库依赖。安装器不再将核心库作为另一个插件入口加入。
- 校验“一个插件”，不要错误断言“node_modules 里只能有一个包”；宿主和普通依赖自然仍存在。
- 重写 root inventory、setup、安装、卸载和清理的预期。保留 Crystra 自身的新安装与卸载能力，不保留旧 WSR 根迁移逻辑。
- Evidence／Evolution 不可用时只影响相关视图，不能因单插件打包而把执行绑定到分析服务可用性。

### 3.4 唯一注册仓库的外部检查

在线 Topics 快照显示 **wsr-dsh 和 wsr-execution 都有 dsh-plugin 标签**；Execution 的 npm keywords 也含 dsh-plugin，其 GitHub 简介仍宣传旧 Intake 安装入口。

目标：crystra-dsh 是唯一带插件发现身份的仓库；Execution 移除该标签、插件关键词和旧安装宣传，README 指向唯一插件仓库。其它组件可以说明 DSH 集成关系，但不能标记自己是可安装插件。

本次核实了 GitHub Topics、仓库简介和本地 marketplace 文件；未读取第三方市场后台或用户机器的实时 DSH 注册表。Topics 不等于所有外部注册机制，不能声称第三方条目已经清理或唯一注册已实现。

## 4. 组件 main 与组合发布职责检查

| 组件 | 当前 CI／发布耦合 | 需要调整 |
|---|---|---|
| Contracts | CI checkout 主仓库作为 frozen semantic authority；publication builder 从主仓库 docs 生成摘要，另有 consumer ref | 将现行契约文档／生成输入归到 Contracts，或固定为明确的独立契约资源；不能继续要求组合工作树承担日常文档权属 |
| Execution | CI 从主仓库 main 递归拉子模块后覆盖 Execution；CI 无 push main；候选发布从主仓库候选清单取 archive commit | 自身候选 SHA 为源码输入；显式固定 Contracts／Workflow 测试依赖；增加 main CI；不要求先 repin 主仓库才能出组件候选 |
| Evidence | main CI 已存在；候选发布通过主仓库候选清单解析产品和 Contract 提交 | 自身源码提交与显式 Contract 版本作为发布输入，组合侧仅消费结果 |
| Evolution | main CI 已存在；发布要求主仓库 Evolution gitlink 等于 product_commit | 去除主仓库先行 gitlink 要求，保持自身提交与制品来源验证 |
| UI | push CI 只匹配 iter5/implementation；发布用主仓库 ls-tree HEAD wsr-ui 决定实际 UI commit | main CI；组件自己的候选提交决定发布源码 |
| DSH | main CI 与自身 release/next 候选流程已存在；不依赖主仓库挑选源码，但依赖精确旧 owner 制品 | 保留组件独立性，换新依赖并将三包验证改为单插件验证 |
| Workflow Package | CI 无 push main；checkout 主仓库文档和固定 Contracts；发布可显式提供 contract_ref | main CI；现行资源和文档归组件；继续显式冻结 Contract，不追随实时浮动 main |

证据：[E09][E10][E11][E12][E13][E14][E15][E16][E28][E29]。

“在 main 演进”不等于“每次 main push 自动公开发布”。现有 release/next 可以保留为从 main 选定提交创建候选的渠道；是否改变触发方式不由本次命名工作自动决定。关键是源码由组件自己选择，且可验证所选提交来自组件 main；组合发布发生在组件可用之后。

建议的依赖顺序：

1. Contracts 发布新的契约资源；Execution、Evidence、Evolution、Workflow Package 使用各自需要的精确依赖。
2. UI 发布普通 UI 库；Execution 发布普通运行时库；DSH 发布依赖它们的单插件。
3. crystra 组合仓库选择经过验证的组件制品，记录明确的坐标、版本、摘要与来源，完成新安装的组合验证。

主仓库的源码子模块可以保留用于组合审计和验证，不作为日常开发工作区；是否彻底删除子模块不在已确定范围。组合发布不要隐式拉所有组件 main 的最新状态。

现行 docs/contracts、docs/systems 仍在主仓库中。如果严格落实“仅发布组合”，需要把仍在演进的组件设计文档与生成依据迁入负责组件，主仓库只保留组合、安装和产品入口文档。这是本次新增的工作量发现，具体文档归属表在实施前逐项确定；不移动历史归档，不扩展成新的架构重写。

## 5. 其它命名面

- 包名与 import：@wsr/product-operations、@workflow-self-recursive/*、wsr-execution、wsr-ui-core、Python distributions／modules；更新锁文件和构建输入。
- 配置与状态：WSR_*、.wsr、各平台 WSR 路径、浏览器状态键、数据库角色、Compose volume/project/label；全新命名，不写旧数据迁移器。
- 协议与 URI：wsr.*、urn:wsr:*、旧仓库或 .dev 域名 schema ID。跨组件生产者、解析器、测试统一修改；建议未拥有新域名时使用 urn:crystra:*，不要假设 crystra.dev 已归用户所有。
- 视觉：现用 Banner、架构图、Marketplace icon、social preview、当前演示截图；architecture.svg 已确认包含旧名称与命令。位图只定位文件，未逐张视觉检查。[E30]
- 发布：全新制品名、包／镜像 namespace、GitHub App 仓库授权、Actions vars/secrets 名称、npm trusted publisher／scope、GHCR 来源信息。未读取 secret 值；外部新名称可用性和权限尚未核实。
- 项目配置：7 个本地未跟踪 project-ops.config 都将 requirements.repository 指向 firestige/workflow-self-recursive。仓库改名后更新该坐标；组件在自己 main 开发不自动表示 Issue authority 从主仓库搬走，Issue 路由是否重组单列待定。

完整映射、例外与待定项见 naming-map.md。非品牌技术词 Workflow、Execution、Evidence、Delivery、Runner、合法 recursive 调用和第三方 @deepseek-ai/* 不做全局替换。

## 6. 更新后的工作包与验收

| 工作包 | 工作量级别 | 交付／验收条件 |
|---|---|---|
| W1 命名与当前文档 | 中 | 8 仓库坐标一致；README 区分当前能力与方向；现行文档归属明确 |
| W2 包、协议、配置命名 | 中～大 | 新包可导入；生产／消费使用同一新标识；仅新路径配置可完成新安装 |
| W3 DSH 单插件 | 中～大（允许内部模块后） | 一个公开包、一个注册仓库；所有现有必要功能可用；无旧插件依赖、无重复注册 |
| W4 组件 CI／发布解耦 | 大 | 组件 main CI 可运行；自身提交可产出候选，不需要先修改组合仓库；依赖可复现 |
| W5 新组合与分发 | 中～大 | 新制品和摘要匹配；只消费新组件；空白环境安装、启动、使用、卸载通过 |
| W7 本地旧数据人工隔离 | 一次性操作；不计清理工具开发 | 备份清单、摘要与可读性校验完成，旧内容退出有效路径，共享资源不受影响 |
| W6 当前视觉与外部元数据 | 中 | 当前展示采用 Crystra；插件发现只指向 crystra-dsh；发布权限通过实际配置核实 |

量级是相对复杂度，不是人日承诺。排除历史迁移需求，可减少需实现的兼容逻辑，但 W3 和 W4 为结构性调整，且文档权属需要配套处理；在完成统一入口实现 spike 前，不给出看似精确的总工时。

实施期至少覆盖：

1. 精确新包的消费测试；不依赖源码兄弟目录或旧下载链接。
2. 干净 DSH profile 安装一个 dsh-crystra 后，命令、附件、Session／Delivery、交互回复、结果、Studio 查询与计算均可用。
3. apply 失败、禁用、重载、卸载后，定时器、RPC、命令、工具、hook、slot 能清理；注册无重复，工作区 UI 不重复替换。
4. 新配置的完整与缺失情况；Execution 两键 profile 不被外层额外配置破坏；分析服务离线不阻断执行。
5. 每个组件从自身选定 main 提交完成检查与候选构建；组合只验证固定的新制品。
6. 当前路径旧名扫描：历史白名单之外，所有残留有具体理由；文件名、元数据和位图分别检查。

本轮没有运行这些实现验证；它们是后续验收条件。只做了在线基线核实、源码／配置／调用链静态检查和文档校验。

## 7. 不纳入与实施前待定

明确不做：旧制品转移、旧数据迁移、旧包别名、WSR 到 Crystra 的升级／回滚、历史证据重新签发、旧资产批量删除、主仓库脏子模块清理、领域功能重写。

仍需在实施时落定（不会阻止当前报告交付）：

- 新包 namespace／scope、仓库目标名的可用性及发布权限。
- 全新发布的起始版本与 tag 命名；本报告用 <version>，不沿用旧发布摘要，也不擅自宣布 0.1.0 已获批准。
- 统一插件目录布局、配置结构和内部 RPC 命名；映射表已提供建议。
- 当前组件文档归属，以及跨组件规范放置；旧文档历史无需整理迁移。
- 第三方 DSH 市场是否另有人工注册记录；当前只核实本地 manifest 和 GitHub Topics。
- Issue 路由是否调整；现有 repository 字段先跟随仓库更名，不隐含迁移 Issue。

最新范围与执行顺序以 implementation-plan.md 为准：优先取消独立安装器，允许包内多模块与依赖，旧部署人工打包隔离清理。

## 8. 文档复核

独立读者仅依据报告和命名表，正确识别了唯一插件／注册仓库、历史不迁移、main 与 release/next 的区别、628 的初筛口径及生命周期风险的推断性质；未发现阻断性矛盾。根据反馈收紧了工作量措辞。另已核对 JSON 统计、92 条映射 ID、相对链接和 30 处固定提交证据位置。该复核不替代实现期测试。

## 9. 证据索引

所有 E 编号链接固定到本次核实的提交，避免工作树或 main 后续变动改变本报告含义。在线仓库元数据为报告日期快照，可变化。

[E01]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/packages/suite/package.json#L23
[E02]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/packages/execution/src/intake/plugin.js#L547
[E03]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/packages/studio/src/index.js#L11
[E04]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/scripts/build-client-bundles.mjs#L8
[E05]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/scripts/lib/package-artifacts.mjs#L7
[E06]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/scripts/publish-npm-set.mjs#L8
[E07]: https://github.com/firestige/workflow-self-recursive/blob/3fc8aef3142bda61f63174ad9998c41c4b42c4bb/product-operations/src/global-config.mjs#L35
[E08]: https://github.com/firestige/workflow-self-recursive/blob/3fc8aef3142bda61f63174ad9998c41c4b42c4bb/product-operations/src/published-adapters.mjs#L343
[E09]: https://github.com/firestige/wsr-execution/blob/dbec4ec441f384ec83788890e5ed614a7c405dec/.github/workflows/ci.yml#L17
[E10]: https://github.com/firestige/wsr-execution/blob/dbec4ec441f384ec83788890e5ed614a7c405dec/.github/workflows/release-candidate.yml#L46
[E11]: https://github.com/firestige/wsr-evidence/blob/1557a38b863be50e24b037796b7dbfa73af4b2f8/.github/workflows/release-candidate.yml#L54
[E12]: https://github.com/firestige/wsr-evolution/blob/da2ffeddfeadaa659883bccfe380aefe1b5b6d7c/.github/workflows/release-candidate.yml#L49
[E13]: https://github.com/firestige/wsr-ui/blob/666a5506ffab723ebf54660c899900eaebda22e0/.github/workflows/release-candidate.yml#L42
[E14]: https://github.com/firestige/wsr-ui/blob/666a5506ffab723ebf54660c899900eaebda22e0/.github/workflows/ci.yml#L7
[E15]: https://github.com/firestige/wsr-contracts/blob/b4b6ab8f89aa2467e09d40f68766e7e40e6a6763/observation/tools/build-publication-record.cjs#L26
[E16]: https://github.com/firestige/wsr-workflow-package/blob/14ceea87f08ee4e468b2782c9beecfd5c136fe65/.github/workflows/ci.yml#L18
[E17]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/config/dsh-compatibility.json#L12
[E18]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/packages/execution/src/client/browser-entry.js#L15
[E19]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/packages/studio/src/client/studio.js#L763
[E20]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/packages/execution/src/intake/plugin.js#L18
[E21]: https://github.com/firestige/wsr-execution/blob/dbec4ec441f384ec83788890e5ed614a7c405dec/scripts/prepare-local-e2e.ts#L110
[E22]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/marketplace/packages.json#L3
[E23]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/scripts/lib/foundation-policy.mjs#L7
[E24]: https://github.com/firestige/workflow-self-recursive/blob/3fc8aef3142bda61f63174ad9998c41c4b42c4bb/product-operations/src/compatibility-manifest.mjs#L33
[E25]: https://github.com/firestige/workflow-self-recursive/blob/3fc8aef3142bda61f63174ad9998c41c4b42c4bb/product-operations/src/installation-maintenance.mjs#L156
[E26]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/packages/studio/src/host/gateway.js#L231
[E27]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/packages/suite/cordis.patch.yml#L6
[E28]: https://github.com/firestige/wsr-contracts/blob/b4b6ab8f89aa2467e09d40f68766e7e40e6a6763/.github/workflows/ci.yml#L18
[E29]: https://github.com/firestige/wsr-dsh/blob/117b54cc2711b303bb63b278836ea2c1174f3d34/.github/workflows/release-candidate.yml#L6
[E30]: https://github.com/firestige/wsr-execution/blob/dbec4ec441f384ec83788890e5ed614a7c405dec/docs/assets/architecture.svg#L27
