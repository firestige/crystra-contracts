# T8 新 UI 与宿主接入缺口

用户于 2026-09-14 指出实际页面仍为旧布局。核查确认，不能以品牌文本及旧链路通过代替新 UI 接入验收。

| 层次 | 已核验事实 | 尚缺内容 |
|---|---|---|
| UI 版本 | 远端 main 482f6f175052bf770efbbbfe0b8ef54a6c365c45，与 UI RC1 来源相同；包含 #7 新组件与设计资产 | 更新依赖版本本身不能完成页面集成 |
| UI 包入口 | packages/bi/src/public.ts 导出共享基础组件、BI、Trace；新版工作台入口 workbench-preview.tsx 为独立预览，含 fixture/原型上下文 | 将可生产复用的页面组件与所需样式导出，分离 fixture，定义宿主数据端口 |
| DSH 页面 | modules/studio/src/client/browser-entry.js 仍消费旧 Bi/Metric/Trace 组合；studio.js 为 Evaluate/receipt/facts/trace，保留 Statistics | 按已接受设计接入 Task/Workflow 浏览与工作台、Analysis 导航；保留宿主 workspace、Task 精确身份与返回上下文 |
| DSH Shell | modules/execution/src/client/delivery-inventory/sidebar.js 仍为 Workspace + Delivery；未接入新 Shell 信息架构 | 新页面入口和宿主路由接入；不是浏览器缓存问题 |
| 当前证明 | 已发布 RC 字节一致、旧业务链路可运行，实际 setup/doctor/Evidence/Trace 可用 | 不能证明新组件页面、路由、返回恢复已生效 |

设计依据：workflow-self-recursive/tmp/20260907/Crystra-ui-design/foundations/navigation.md。该文档明确逻辑路由不是已发布 URL/API；不能把示例路径直接作为生产契约。Analysis Trace 只保留 Waterfall/Tree，统计回 Overview。页面原型不能冒充真实业务写入。

后续实施顺序：先建立设计入口→UI 公共导出→DSH 挂载/路由→真实数据端口的逐项映射；补接入及缺失状态；验证刷新/返回/切换和精确对象上下文；发布新的 UI/DSH RC 并重新固定组合。现有 RC 不覆写。涉及尚未发布的业务语义或生产写接口时，显式列出契约缺口，不用 fixture 补假功能。

GitHub 匿名限流仍是已有链路的独立复验项，不是新 UI 未生效的原因。T8 不得关闭；旧链路证据继续有效，但必须标注范围。

## 用户确认后的实施检查点

用户确认 PR #7 已合入 UI 主线，并授权参考定稿 v8 系列 HTML 完成接入。以五份 v8 HTML 的视觉与交互为基准，复用 React 组件；不重新设计，也不把原型的示例 IR/数据接入真实业务。

| 子步骤 | 状态 | 工作／证据 |
|---|---|---|
| v8 区域清单 | 完成 | evidence/t8-v8-sections.json：Task Work 342 个、其余各 83–84 个稳定区域标识 |
| Analysis Trace 消费侧纠正 | 已实现、未发布 | /tmp/crystra-dsh-t6：去掉 Statistics，向 Waterfall/Tree 传 showSummary=false；针对性 RED→GREEN；全套 199 项通过 |
| PR #7 Directory 公共导出 | 已实现、未发布 | /tmp/crystra-ui-host-integration，codex/crystra-host-ui-integration：导出 DeliveryDirectory 和数据类型；精确身份选择／真实空结果测试；格式/lint/types/test/build/deps 及 26 项浏览器回归通过 |
| 新 Shell / 页面导航及恢复 | 部分实现，开发浏览器已挂载 | 按 v8 的 Task、Workflow、Analysis 入口和品牌切换接入 DSH，不保留旧入口作为最终页面 |
| 新页面真实数据接入 | 待实现 | WorkflowMapWorkbench 当前默认 samples、AnalysisObservationStudy 当前 observation fixture 都不能直接作为生产数据；需拆出宿主数据输入与明确缺失状态 |
| 新 RC 及实际页面复验 | 待前述完成 | 不覆写旧候选，不以当前局部修正标记 T8 完成 |

UI 原工作树 .gitignore 等用户更改未动；使用从 main 建立的隔离 clone。DSH 修正基于已有候选分支继续，尚未发布新字节。浏览器最终验收必须覆盖 v8 入口、页面切换和返回状态，不只看品牌或底层服务。

本地恢复提交：UI `97b3c04`，DSH `8635a72`。均未发布新 RC；下一项是 v8 Shell 与宿主路由接入。

### Shell 与导航实现续记

- UI 隔离分支新增 `CrystraShell` 组合组件，复用 PR #7 的基础组件及 v8 区域标识；仍需逐项补齐 v8 视觉/交互一致性，不能称已定稿接入。
- DSH 新增 `product-navigation.js`：精确对象路由、Harness/Crystra 切换、返回历史、允许字段的每页上下文恢复；不把输入草稿放入路由。
- DSH 新增 `product-surface.js` 宿主桥接工厂，使用 `shell.overlay` 和 `sidebar.footer.action`；不替换 root/conversation。**尚未接到 root client，因此当前实际安装不受影响。**
- Task Browser 桥接只读取现有 Evidence task list；Task/Workflow 工作面尚未接完，显示未接入状态。不要把这些占位状态作为最终实现交付。
- 新增导航/挂载边界 5 项测试通过（含 Workflow 精确 revision 恢复）；UI Shell 操作、Directory 精确选择与空结果 3 项针对性测试通过。完整 UI 回归本轮另记日志。
- 下一动作：补齐 v8 Shell 折叠/搜索/视图设置及主内容页面，建立真实数据端口，接到 root client 后再做实际 DSH 验收。不能只把现有旧 Studio 包在新 Shell 内就宣称完成。

恢复提交：UI `c1a9182`，DSH `3c61f5a`；源分支本轮改动仅本地提交，未发布候选。UI lint/types/test/build 已通过，Shell 定稿视觉对照与实际 DSH 激活尚未验证。


### C037 实际开发实例挂载

恢复提交：UI `2fa2b98`（/tmp/crystra-ui-host-integration），DSH `1a1e1ed`（/tmp/crystra-dsh-t6）。DSH root client 现已注册内部 product 模块，公开插件仍只有 dsh-crystra。

开发实例为 http://127.0.0.1:3082，DSH_HOME=/tmp/crystra-v8-dsh-home；使用固定 DSH 0.1.1-rc.2。该 profile 复制 dsh-crystra，仅用 /tmp/crystra-v8-client.js 覆盖本实例 client bundle，其他依赖链接原 profile。浏览器无需模型密钥即可检验任务读取。现有 3080 用户会话和 3081 RC 验收实例保留。

浏览器首先复现 `TypeError: props.renderSlot is not a function`：shell.overlay 不提供子插槽渲染器。新增回归先失败，再修复为返回 Harness 设置入口；尚未实现一键打开设置。BiSurface 的 style 属性会被组件覆盖，因此宿主全屏定位改为专用 CSS 类，同时显式传入接受组件要求的 data-crystra-theme=dark。最终截图确认新主题与完整覆盖层生效。

已验证：从 Evidence 读取真实 task-5f9ecaae-8f06-42f9-93bd-22ac3a551bc7；选择任务；品牌切回 Harness；由 Crystra 按钮返回同一精确 Task。未验证草稿或滚动恢复。Task 详情目前仍为明确缺口提示；Analysis 三入口仍共用旧 Studio，Workflow 无真实目录输入。当前效果不符合完整 v8 验收，不可作为完成交付。

验证日志：/tmp/crystra-product-root-tests.log，205/205 通过；其中导航及 overlay 6 项通过。此套测试的生成 lib/client.js 仍是原已提交版本，因此不代表新正式 bundle 资格。新的浏览器证明来自明确标注的开发 bundle。

开发构建恢复：先在 UI clone 运行 npm run build；随后在 DSH clone 运行 node scripts/.v8-dev-build.mjs（临时 helper，不进入发布），其 alias 指向 UI clone 的 packages/bi/dist/index.js 与 styles.css，输出 /tmp/crystra-v8-client.js。仅复制到上述开发 profile 的 dsh-crystra/lib/client.js 后刷新 3082。不得覆盖实际 ~/.dsh 安装或把本地路径写入发布依赖。正式 lib/client.js 必须在新 UI RC 被固定后重建和资格验证。

下一步：按 v8 补齐 Shell 展开搜索/视图设置，完成 Task Browser 与 Task 工作面、Workflow 目录/精确版本工作面、Analysis 独立页面的数据适配；已有 Gateway 仅暴露 tasks/list 等查询，不能假定存在 tasks/get 或 Workflow 编辑写入契约。需逐项核对后接入，缺失契约单独列明。之后新 UI/DSH RC、组合重固定及真实页面验收。

C037 同轮续记：UI 最新提交 `b4214dc`，Shell 改用 PR #7 ExpandableSearchField，验证点击展开、任务过滤和 Esc 清空；导航箭头改用共享 Icon。387 个 Vitest 和 34 个 Node 测试通过，lint/types/build 通过（日志 /tmp/crystra-shell-search-*.log）。已重建 3082 开发 bundle；完整页面、视图选项、折叠布局与正式 RC 仍未完成。


## Analysis 与新建空白态（C038）

源码检查点：UI `bca3552`，DSH `8a42836`，均为隔离 clone 本地提交，尚未发布。3082 已重建开发 bundle；3080 用户实例和已部署 RC 未改。

- 新 Analysis 三页框架使用定稿布局与组件，总览调用现有评估控制器，Trace 使用正式解码器、分页加载器与 Waterfall/Tree（showSummary=false）。研究报表没有生产接口，明确显示缺口。
- 修复正式 Trace 查询解码：注册字段应为 C01/C02 等 ID，而不是原始 agentops 名；拒绝未知 ID、重复/乱序字段。Facts 解码兼容性尚未在新工作面验证。
- Trace 查询处理错误、absent、partial、分页与竞态；错误时移除旧图。保留空目录 aside，修复定稿网格将主图压入零宽列的问题。
- 实际 3082 验证真实 task-5f9ecaae-8f06-42f9-93bd-22ac3a551bc7 的 12 指标、100% terminal outcome；Trace aed6fbb2d3ce5d2a902c74af06f89bb8（324 ms），Waterfall/Tree 切换、页面往返保留结果和视图，非法 ID 清除旧图。未声称刷新后恢复查询。
- 宿主 startSession 会经 connectWorkspace 调用 sessions.create，创建完整 Session+Agent；新建 Task 改用 sessions.clear 进入空白 Harness。回归先失败后修复；3082 点击后显示空白页且会话目录仍为空。工作区选择后的持久化时机仍需按宿主契约单独检查。
- UI format/lint/type/build/deps 通过，391 Vitest + 34 Node + 27 浏览器用例通过。DSH 宿主完整回归 209/209 通过（允许 localhost 监听），日志 /tmp/crystra-analysis-dsh-tests.log；沙箱 EPERM 不是逻辑测试失败。UI clone 缓存位于自身 node_modules，不修改原 UI 工作树。

仍未完成：完整 Task Browser/工作面、Workflow 目录/版本页、Trace 可搜索目录和 Evidence 下钻、Overview 定稿配置能力、设置与覆盖层焦点管理、新 UI/DSH RC 和组合重固定。当前开发 bundle 通过本地 UI alias，正式 lib/client.js 尚未重建，不能用本轮结果宣称发布资格。

范围边界：定稿 handoff/decisions-and-open-questions.md 的 O01、O10、C07 尚未定义 Task IR、Plan/Wave/Gate、readiness、持久化事务等领域接口。是否扩大本次范围定义后端契约的问题已提出，尚无明确选择；后续“继续”按现有 UI 接入授权执行，不视为扩大领域范围。下一步先处理现有能力的接入，禁止以 fixture 填补生产数据。


## C039：条件化草案授权与实现入口

用户授权已解除 C038 的领域范围待确认项：优先使用指定设计目录中的现成结论，不足则按 UI 提出最小契约；全部保留草案身份、前提不满足即作废。正式语义未被改写。见 [草案与映射表](drafts/README.md) 和 [精确来源锁](drafts/source-lock.json)。

DSH `e0aaf82` 实现 `src/client/draft-projection.js`：仅 exploration + draft.1，绑定来源摘要、适配器、Task 与目标/计划 revision，权限/过期/来源变化拒绝，fixture 必须显式启用；无效结果不携带旧 projection。5 项新增回归及 DSH 214 项全量通过。该模块目前没有挂入正式数据入口，只验证 envelope，不验证 value 的业务语义，也不授予执行权。待接入 UI 时必须在过期与上下文变化时重新准入。

UI `14f8fa0`、DSH `388c040` 另修正 D21 后续确认的“对比分析”名称；UI 5 项相关测试、1 项页面往返浏览器回归与 build 通过。开发 3082 bundle 已更新；正式依赖、RC 与用户 3080 实例未改。

下一动作：为五工作面定义并验证最小 value，接隔离 adapter 的读取和明确的探索来源；复用已接受组件展示效果。之后再实现隔离 authoring CAS 与恢复，不把 fixture、结构通过或草案保存当正式业务效果。Task 生命周期、正式领域映射和 RC 资格仍需各自证据。


## C040 v8 视觉与交互纠正

用户指出当前浏览器页面远离定稿，判断成立。此前实现优先建立数据桥，结果形成了另一套简化页面；C037–C039 的功能证明不能作为完整 v8 接入证明。草案用于支撑既有页面，不是重新设计或降级页面的理由。本轮暂停新增草案字段。

只读对照服务：4185，目录为指定设计资产原件；进程日志由本任务管理。3082 仍是隔离开发实例，3080 用户页面不改。当前原型和生产事实分别展示，绝不把源 HTML 样例替换进去后宣称真实数据接入。

| 区域 | 已核实差距 | 后续修正 |
|---|---|---|
| Shell | 248px 不符 v8 220/260；品牌居中无标志；标题和搜索拆行；无导航图标和明确选中背景 | 本轮恢复响应宽度、标题行内共享检索、左对齐品牌/图标、新建按钮、分析导航与 footer；折叠 rail、视图菜单、品牌精确矢量和恢复仍待完成 |
| Overview | 原型系统级、日期范围、刷新/布局编辑、资源/运行质量 Widget；开发是单 Task 指标列表 | 复用完整 Analysis 组件结构，移除简化表单替代，按草案补数据适配，不伪造指标 |
| Trace | 原型搜索 Delivery 目录、全局范围、目录展开、中文切换；开发是手输 Trace ID | 复用 DeliveryDirectory 与完整 Header/toolbar，将真实精确 Trace 读取接选择结果 |
| 对比分析 | 原型观察设置与图形映射已确认；开发只有缺口提示 | 复用已审核设置/图表组合，草案覆盖数据选择及持久化缺口 |
| Task / Workflow | 开发工作面仍是占位 | 按 v8 原 HTML 布局完整移植，复用共享组件；先固定页面与交互，随后填条件化草案 |

回归新增 1280px 下侧栏 220px、标题/检索同行及选中导航检查，修改前失败、修改后 2 项浏览器测试通过；UI 391 Vitest + 34 Node、lint/type/build 通过。当前只修复 Shell 的一部分，不能称页面已达到 v8。后续同时比较相同页面、尺寸、状态，缺少真实数据时用明确隔离的探索样本验证布局。


## C041：完整 Analysis 组合与显式探索数据

UI `0a54cd8` 将原 AnalysisObservationStudy 的完整组合移入公共 AnalysisWorkspace，保留 v8 日期范围、刷新周期、布局编辑/导入导出、Widget 网格、DeliveryDirectory、Trace toolbar 与对比分析插槽。原 Study 成为样本与静态页面路由适配器；公共组件不自行读写 location/history，也不订阅全局导航 DOM。布局默认值改用已有 PRESET_LAYOUTS，去除 layout codec/editor 的 dashboard fixture 运行依赖。relative date 改为宿主显式 referenceDate，不把 2026-09-09 样本时间当实际今天。

生产端口暂时包含 tasks/samples/roles/workflows/deliveries/searchFields、sources/queries/trace 和 renderComparison。它们是 UI 适配接口，不是新正式服务协议。对比分析完整样本仍由 renderComparison 显式注入；其业务统计/设置持久化还没有正式化。旧简化页与真实数据桥仍保留供继续接线，不能视为最终页面。

3082 本轮显式运行完整 Analysis **探索模式**，右下角标明“草案探索 · v8 设计样本，非真实运行数据”。总览 112.04 等值、42 条目录、版本费用图均为定稿 fixture，不能写成真实服务指标。Shell 的真实 Task list 与样本分析范围不是领域绑定；跨两者的 Task/Delivery 深链尚未接入，禁止混用。实际 3080 和固定 RC 3081 未改。

恢复：UI clone `npm run build`；`node scripts/build-analysis-exploration.mjs /tmp/crystra-analysis-exploration` 构建仅供探索的独立 bundle。DSH clone 的临时 scripts/.v8-dev-build.mjs 支持 CRYSTRA_ANALYSIS_EXPLORATION=1，先按本计划 source-lock 复验原设计文件，再覆盖 Analysis factory；不设置该变量则回到现有真实数据开发桥。仅将输出 /tmp/crystra-v8-client.js 复制到 /tmp/crystra-v8-dsh-home/profiles/web/node_modules/dsh-crystra/lib/client.js。临时 helper 不进入正式制品，发布不得带此开关和本地路径。

验证：394 Vitest + 34 Node 通过；原 28 浏览器测试通过；新增完整组合浏览器用例验证编辑状态跨页保持、目录展开和 Tree 切换；真实 DSH 浏览器确认完整总览与对比分析三列设置编辑器可打开。lint/type/build/format/deps 通过；新增构建脚本单独验证。已发现并修正 Header 图标垂直堆叠（恢复已接受的 identity flex 组合）。仍需最终同尺寸截图复验、完整主页面接入和实际数据联调，T8 不变。


## C042：Task frame 与实际 Input 的宿主边界

TaskWorkbench 已按 v8 Header、38:62 分栏、Input 最小 360 / Control 最小 680 和五工作面导航抽取为公共组合。Input 为必传 ReactNode，切换 bench 不卸载；systemFocus 独立于所选页面。五工作面的具体内容尚未移植。单元测试与 1920×1080 浏览器验证输入节点/草稿保持和布局；395 Vitest + 34 Node、lint/type/build 通过。测试中的 textarea 明确是隔离替身，不声称真实 DSH Composer 接通。

读取实际 DSH SlotRegistry/AppFrame 后，确认 ctx.renderSlot 仅能渲染 root、其它 seat 只能由 owner 的子 renderer 使用；当前 overlay 没有 Conversation 子 seat，root 不允许插件再次注册。为满足同一 Input 和定稿布局，需要扩展 DSH ui-layout 的受支持布局/产品 seat。已准备[具体草案](drafts/dsh-host-layout.md)，新增宿主组件修改或受控 fork 的范围尚需用户明确授权；没有改宿主源码、私有 CSS 或另造 Composer 来绕过。

UI 工作树包含完整 Analysis 和 Task frame；DSH 正式源码仍 388c040，3082 仅启用了有明确样本标识的 Analysis 探索。真实 Task/Workflow Input 接入在上述范围决定前暂停；其它页面组件化与数据适配不受影响。T8 仍 IN_PROGRESS。

## C043 · overlay 路线复核

C042 的“需要扩展宿主”结论过早，现撤回必需性判断。shell.overlay 在当前 rc.2 仍可用；缺少 props.renderSlot 不等于不能与原生 Conversation 并排布局。dsh-macos-desktop 实际通过 overlay + 宿主外层 CSS 定位实现。尚未实测其在固定 rc.2 的完整兼容性，也没有版本回归证据；先在隔离环境验证外层适配，宿主扩展保留为备选。详见 drafts/dsh-host-layout.md 的 C043 更正。

## C044 · 复用 Input 与会话隔离

用户明确复用原生 Input 的组件和交互，不要求共用原生 DSH Session 管理器，并倾向互不可见。取消 C042 对跨 Harness/Crystra 同一 Conversation 实例的必要性。输入连续性以 Crystra 自身导航范围为准。下一步检查组件、scope、输入状态机、Session 服务与 RPC 装配，优先复用实现并隔离会话，不能只隐藏原生会话列表就宣称完成。详见 drafts/dsh-host-layout.md C044。


## C049 Task 工作面与只读上下文

UI fc463a1：TaskPlanPanel 提供摘要/文档/完整 DAG 三层只读组合；TaskExecutionPanel 区分 Plan Run 与 Wave 内部 Workflow Run，分析回调只接显式 identity；TaskEvidenceContext 提供审核证据检查和返回。计划/执行图从定稿 v8 SVG 静态提取为 test-harness/task-design-graphs.json，未执行 HTML 内脚本；源 SHA256 b5eefc9739ab1d995e4c10cbb0e90c8dcb2fa099cc4b707ec47a574a46b2af87。样本仍仅用于显式探索，正式组件不加载它们。

UI 401 Vitest + 34 Node 通过；计划/执行新增层级时整套 33 浏览器通过，随后新增审核证据检查的四项专项浏览器通过；type/lint/build/format 通过。不是最终 PR/RC 资格声明。DSH 2de5bf1 为 inventory 和 session read 加请求顺序保护；两项回归先复现旧响应覆盖新状态，再修复，全套 228/228 通过。

3082 实测：唯一原生 Input 旁展示五工作面探索内容；点击 Wave 1B 进入指定 Workflow Run，原始未发送草稿使用键盘事件删除后重载仍为空。native 3080 未操作。开发 helper 增加 automatic JSX 与测试样式显式注入；不进入制品。

仍未完成：完整 DAG minimap/分支折叠、运行观测扩展与动效、Gate 到 Plan/Analysis 的精确跨页关联、五工作面 value validator 和持续失效处理、真实端口联调、Workflow 页面、侧栏余项及 RC。不能把本节的设计样本当运行事实，也不能把组件已渲染当全量 v8 已对齐。下一项 C050 侧栏折叠与原生几何联动正在实施。


## C050 侧栏折叠与原生几何

侧栏使用定稿 24px 晶体矢量和 19px 品牌字、64px rail、原有分组浮出导航、Escape/外部点击关闭；UI 不自行读取宿主存储，初始偏好及保存回调由 DSH 提供。DSH 070933e 将 Task 与 new-task 原生区域统一使用侧栏宽度变量，折叠偏好保存在本实例浏览器 sessionStorage。

3082 的 1280×720 实测先复现折叠后原生 left220 而目标 left64；修复后两者均 left64/top112/width462.078125/height608。重载保留折叠且 Input 仍为空。通用按钮样式曾覆盖隐藏与矢量尺寸，导致折叠 logo 被挤为 1px；修复后实测24px，收起按钮隐藏。UI 402 Vitest +34 Node、type/lint/format/build 通过，最终整套浏览器34项通过。品牌字号旧测试22px已按定稿19px修正。

DSH 首轮并行负载下冷启动登记既有测试超时；单独复验17ms通过，单独重跑整套229/229通过（/tmp/crystra-c050-dsh-tests-rerun.log）。未修改这项既有运行逻辑或放宽超时。不存在用户决策阻塞；C051 继续按定稿 Task Browser 接真实列表和明确未知字段。


## C051 Task Browser 接入中

工作副本 /tmp/crystra-ui-host-integration 新增 TaskBrowser、task-browser-model，复用定稿 CSS 并限定到本页，复用已有 ToggleSwitch 与本地 Tabler 图标。Gallery 按容器宽度计算列数/卡宽并通过内容区 observer 追加，List 分页；选择与打开分开，Gallery 折叠在切换视图/查询时保留。归档/缩略图/改名/Pin 只有显式 callback 才可调用，普通入口无这些适配器。当前尚未补齐跨页面偏好恢复、排序完整键盘菜单与写探索。

DSH product-surface 已改为消费 Core.TaskBrowser。projectEvidenceTasks 只映射正式 tasks/list 的 task_id/display_name，其他字段保持未知；复用 next_cursor 读取后续页，新建任务与 Sidebar 共用先离开绑定再 clear 的行为。当前改动未提交。UI 407 Vitest+34 Node、type/lint/format/deps 通过，两项 Browser 专项通过；完整 Browser 与 DSH 最终检查进行中。

3082 当前已关闭 CRYSTRA_INPUT_GEOMETRY_TEST，保留 CRYSTRA_ANALYSIS_EXPLORATION=1：Task 列表与 Browser 是真实 Evidence 来源，Analysis 仍为独立标记的样本。实测读到 task-5f9ecaae-8f06-42f9-93bd-22ac3a551bc7；Gallery/List 切换、未知字段和精确打开正常。该 Task 不属于当前本地会话，Input 不显示且不借用测试 Session。修复宿主默认标题边距/按钮背景后，Header height=88.6953125，分组透明；用户3080未改。

恢复时先核对当前开发模式，不把样本 Task 与真实 Task 混淆。当前页面在真实 Task 详情；此前测试草稿已清空。下一项继续 Browser 返回恢复与菜单，再接 Workflow；五工作面真实数据/草案持续失效与 RC 仍未完成。


C051 保存提交：UI 71ab3ca，DSH 961c493。最终 UI 407+34 单测、36 浏览器、type/lint/format/build/deps 通过，DSH230/230通过；日志 /tmp/crystra-c051-*.log。3082 当前为真实 Task 详情，Task Browser 的旧本地浏览状态在跨页返回时尚未持久化，C052 正在补这一点及菜单；不要将这些门槛称作整个 T8 完成。


## C052 目录返回与菜单

UI 45569e5 / DSH 82c4d88：Task Browser 保存经过白名单验证的查询、筛选、排序、Gallery/List、分组、页码/页长及精确 anchorId 到原有 navigation context.view；先保存再打开 Task，过期组件回调不能覆盖当前 Task 上下文。返回重新挂载时恢复列表或 Gallery 条目，不保存业务事实或选择权限。分组折叠仍仅在 Browser 挂载期跨查询/视图保留。

共享 Menu 支持图标触发、menuitemradio、上下方向及 auto 放置，复用键盘焦点、Escape/外部关闭。React refs 静态检查发现排序回调间接读取滚动 ref，已移到查询变更 effect；不关闭规则。UI409 Vitest+34 Node、38浏览器、lint/type/format/build/deps通过；DSH231/231通过。日志 /tmp/crystra-c052-*.log。

3082 当前仍为真实 Task 来源、Analysis 显式探索；实测 List 搜索 5f9ecaae → 打开精确 task-5f9ecaae-8f06-42f9-93bd-22ac3a551bc7 → 侧栏全部任务，保留 List 与查询；排序菜单在宿主正确定位。没有操作3080，没有发送消息，没有发布新RC。接着 C053 Workflow Explorer：先复用定稿资源浏览配方，精确 definition+revision，最新项在筛选前确定且不回退；真实目录未知能力必须明确，不能混入样本。


## C053 Workflow Explorer

UI349bb6a / DSH bb3fd07：WorkflowExplorer 复用已接受 Task Browser 布局配方；ResourceGalleryGroup 抽取为两页共用。目录类型只定义消费者需求，精确 definitionId/revision、显式 isLatest；最新项先确定再筛选，不根据字符串、时间或状态猜最新；冲突最新不选。Gallery/List、最新/全部版本、状态过滤、排序、分页、独立选择、精确打开已实现。无 owner callback 的新建/改名/归档等保持禁用。跨页面 Workflow 视图恢复和正式目录/资源管理通路尚缺。

UI414+34单测、39整套浏览器、type/lint/format/build/deps通过；DSH232/232通过。3082从侧栏进入完整 Workflow Explorer Header 与缺口提示，当前没有正式目录接口，不显示伪造的0项集合，不加载测试工作流。48定义×3revision的独立样本只在 workflow-explorer-test.html，验证筛选不回退、版本模式清选、跨视图选择及精确r1打开。没有RC发布。继续C054共享工作台Header/分栏/Input连续性，再接已合入组件；不得把历史样本的window全局对话/假写入直接当正式宿主。


## C054 Workflow 共享工作台

UI d675e74 / DSH6395d13：WorkflowWorkbench使用原page-header组合、三页签和显式Input插槽；Tabs新增显式panelContainer，挂载到共享右栏，ARIA关联保持完整。分栏360px下限、可用宽度一半上限、方向键16px、Home/End、指针拖动和720px最小工作区通过浏览器检查；切页保留Input节点和未发送草稿。测试页原生body8px边距造成可用宽度1264，已为独立harness重置，不改变真实宽度计算。

DSH工作台携带精确definition/revision并按其key重挂载，未知页签回流程设计，不借用Task或Harness Session。未关联时显示包工作区/会话缺口。UI416+34单测、40浏览器、type/lint/format/build/deps通过；DSH233/233通过。3082此时仍是C053 bundle、Workflow Explorer缺口页，C054尚未重新装入开发实例。

C055进行中：原WorkflowMapWorkbench直接加载样本、querySelector外部对话、替换conversation-feed并截获Enter，还有本地保存/发布演示。拆为显式定义/布局/Header/引用回调的只读Viewer，原独立设计包装器保留探索行为；不能将这些样本行为部署成正式Input链路。五工作面数据/Workflow真实目录、草案验证、事务和RC仍未完成。


## C055 宿主中立活动图与定稿布局

UI86945a7：WorkflowMapViewer公开入口强制关闭exploration；初始定义、布局resolver、Header目标、对象引用回调均显式提供。不查询宿主Input、不替换conversation-feed、不截获Enter，不开启本地样本保存/发布/验证台。原WorkflowMapWorkbench成为独立设计包装器，继续保留已有演示。引用提供选中对象ID，正式提案/保存通路仍缺。定义/revision变更须由宿主以精确key重挂载；布局失败不将旧坐标绘到新定义。

定稿 assets/workflow-map-candidate.js SHA256=2eecd430380f6a68620fb712e8ff779b4bc78779c0d484ca768bb059f5102cac。用TypeScript AST读取其中data字面量为test-harness/workflow-map-design.json，未执行原脚本。预生成3套样本的精确匹配/展开掩码/分段关系转换沿源实现；不声称支持任意新定义。修复缩略图使用语义edge.id导致同关系分段重复key，改为已有segmentKey；回归先失败再通过。真实DSH旧React忽略JSX布尔inert，已在commit ref设置DOM inert并增加aria-hidden，实测收起width0、inert=true。

UI417+34单测、41浏览器、type/lint/format/build/deps通过，日志/tmp/crystra-c055-final-*.log。独立预览初次高度不足是BiSurface测试容器尺寸声明未落地，改为显式harness class height100vh；工作面移除原Tabs的12px内容间距，实际窗口铺满。

3082当前模式：CRYSTRA_ANALYSIS_EXPLORATION=1、CRYSTRA_WORKFLOW_EXPLORATION=1，INPUT_GEOMETRY_TEST未设置。Task列表仍是真实Evidence，Analysis与Workflow为显式样本。Workflow入口是draft-workflow-implementation@v8-2eecd430，页面与目录描述标明草案；左侧明确未关联包工作区/会话，不制造Session或代替原生Composer。实测从目录精确打开和展开理解与设计。资源/结晶仍缺口页。

恢复：UI build后在DSH clone运行上述两个探索开关的scripts/.v8-dev-build.mjs；该helper先核对布局源hash，再覆盖仅开发的product-surface，将产物复制到3082专用home。helper仍untracked，不进入正式包；忽略裸CSS导入的警告由已合入Core dist/styles.css覆盖。取消WORKFLOW_EXPLORATION则恢复正式目录unavailable。没有操作3080、没有发消息、没有发布RC。独立4191预览进程用于视觉复核。C056继续资源Viewer，随后结晶/真实数据及草案失效。
