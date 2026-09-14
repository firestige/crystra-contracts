# T8 实际安装与收尾

状态：IN_PROGRESS。Mac 已解锁；实际 setup、doctor 和 Studio 读取已验证，继续任务联调。

- 组合：crystra-v0.1.0-rc.1，远端与本地合格文件相同。
- 实际插件：~/.dsh/profiles/web 中唯一 dsh-crystra，RC2；419 个归档文件与已发布字节相同。
- 精确 CLI：`/Users/firestige/Library/Application Support/Crystra/tools/node_modules/.bin/dsh`，0.1.1-rc.2；普通 pnpm 依赖安装，无新增产品安装器，未改全局 CLI。
- 本机 better-sqlite3 构建完成。现有 DSH PID 40455、3080 端口及 LAN trustedHosts／认证配置保持原状。直接 localhost 返回 401，因此未绕过认证、未抢占当前会话。
- CUA getState 返回 Mac locked，自动解锁失败。实际浏览器 setup/doctor、工作区角色绑定及 UI 验收仍待解锁；不把隔离 Harness 的 PASS 等同于这里的验收。
- GitHub topic 读回只含 firestige/crystra-dsh。公开安装文档已更新为精确 RC；组合 #277、DSH #38 仍需正常合并。

安装日志：/tmp/crystra-t8-install-frozen.log；CLI 依赖日志：/tmp/crystra-t8-host-runtime.log；安装读回：[证据](evidence/t8-installation.json)。首次 npm exec 重复解析耗时，已停止本次进程并复用已验证 CLI 安装，随后通过 pnpm 保存固定运行时。

## 解锁后实际验收

固定 DSH 0.1.1-rc.2 在 http://127.0.0.1:3081 启动，DSH_HOME 为 `~/Library/Application Support/Crystra/acceptance-dsh`，profile 的 node_modules 链接到已核验的实际安装。旧 3080 进程保持运行，未重启。

浏览器插件列表确认 crystra 已挂载。通过正常 API 创建 `/tmp/crystra-rc-acceptance-workspace` 后，在浏览器发送 `/crystra setup`，实际启动 namespace `crystra_services_d2951050567f` 三个健康容器。setup 与 doctor 均准确报告 `CRYSTRA_ROLE_BINDINGS_REQUIRED`；这不是 READY 或真实 LLM 执行通过。Studio 可打开并从真实 Evidence 读取空任务列表。继续重放 T6 确定性 provider fixture 至实际服务，验证 UI；不改用户认证。

实际服务重放已完成执行、Facts、Trace 和 12 指标评估。浏览器验证任务列表、100% terminal outcome、Evidence 下钻及精确 Trace `aed6fbb2d3ce5d2a902c74af06f89bb8`（324 ms）。Workflow AVAILABLE 断言失败：容器直查 GitHub 发布 API 返回 HTTP 403、remaining=0，约 08:51 UTC 恢复；属于外部匿名额度限制。待恢复后只重验已有任务评估，不重复生成任务，不扩大凭据访问。证据：[实际 UI 验收](evidence/t8-ui-acceptance.json)。

## 验收纠正

当前界面验证仅覆盖旧页面的更名后运行。用户指出的新 UI 和路由接入缺失已确认，见 [缺口分析](t8-ui-integration-gap.md)。T8 尚未完成；限流不是新 UI 未生效的原因。


## 新 Shell 开发验证（C037）

3082 独立开发实例已经显示新 Shell、读取真实 Task，并验证 Harness 往返保留精确任务身份。UI 2fa2b98、DSH 1a1e1ed 为本地源码检查点；205 项 DSH 回归通过。开发 bundle 通过本地 UI alias 构建，未更新已发布 RC、真实安装或组合；完整 v8 页面尚未完成。详细恢复路径、已修复错误与未完成项见 [接入记录](t8-ui-integration-gap.md#c037-实际开发实例挂载)。


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


## C040：按 v8 效果纠正实施顺序

用户指出当前页面视觉与 v8 相差很大，已通过实际截图确认；优先恢复完整页面组合，暂停新增草案字段。首轮仅修正 Shell 响应宽度、品牌/按钮/导航、行内共享搜索及主题覆盖；主内容仍明显不符定稿。详细差异与下一步见 [C040 对照](t8-ui-integration-gap.md#c040-v8-视觉与交互纠正)。3082 开发 bundle 已更新，3080 不改。


## C041：完整 Analysis 组合与显式探索数据

UI `0a54cd8` 将原 AnalysisObservationStudy 的完整组合移入公共 AnalysisWorkspace，保留 v8 日期范围、刷新周期、布局编辑/导入导出、Widget 网格、DeliveryDirectory、Trace toolbar 与对比分析插槽。原 Study 成为样本与静态页面路由适配器；公共组件不自行读写 location/history，也不订阅全局导航 DOM。布局默认值改用已有 PRESET_LAYOUTS，去除 layout codec/editor 的 dashboard fixture 运行依赖。relative date 改为宿主显式 referenceDate，不把 2026-09-09 样本时间当实际今天。

生产端口暂时包含 tasks/samples/roles/workflows/deliveries/searchFields、sources/queries/trace 和 renderComparison。它们是 UI 适配接口，不是新正式服务协议。对比分析完整样本仍由 renderComparison 显式注入；其业务统计/设置持久化还没有正式化。旧简化页与真实数据桥仍保留供继续接线，不能视为最终页面。

3082 本轮显式运行完整 Analysis **探索模式**，右下角标明“草案探索 · v8 设计样本，非真实运行数据”。总览 112.04 等值、42 条目录、版本费用图均为定稿 fixture，不能写成真实服务指标。Shell 的真实 Task list 与样本分析范围不是领域绑定；跨两者的 Task/Delivery 深链尚未接入，禁止混用。实际 3080 和固定 RC 3081 未改。

恢复：UI clone `npm run build`；`node scripts/build-analysis-exploration.mjs /tmp/crystra-analysis-exploration` 构建仅供探索的独立 bundle。DSH clone 的临时 scripts/.v8-dev-build.mjs 支持 CRYSTRA_ANALYSIS_EXPLORATION=1，先按本计划 source-lock 复验原设计文件，再覆盖 Analysis factory；不设置该变量则回到现有真实数据开发桥。仅将输出 /tmp/crystra-v8-client.js 复制到 /tmp/crystra-v8-dsh-home/profiles/web/node_modules/dsh-crystra/lib/client.js。临时 helper 不进入正式制品，发布不得带此开关和本地路径。

验证：394 Vitest + 34 Node 通过；原 28 浏览器测试通过；新增完整组合浏览器用例验证编辑状态跨页保持、目录展开和 Tree 切换；真实 DSH 浏览器确认完整总览与对比分析三列设置编辑器可打开。lint/type/build/format/deps 通过；新增构建脚本单独验证。已发现并修正 Header 图标垂直堆叠（恢复已接受的 identity flex 组合）。仍需最终同尺寸截图复验、完整主页面接入和实际数据联调，T8 不变。
