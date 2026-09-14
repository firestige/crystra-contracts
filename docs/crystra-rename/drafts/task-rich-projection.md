# Task 文档与图投影草案（C082）

状态：条件草案；不构成正式领域契约。沿用 `crystra-task-file@1` 配置及 `crystra-ui-exploration/draft.1` 来源锁、精确选择、环境、有效期和 fixture 开关。前提失效即撤回整个投影。设计样本不是运行事实。

在现有五工作面信封中新增可选 `assets`：

- `plan`：`identity` 必须等于可用 plan 工作面的 identity；提供 `summary`、`dag` 和 `documentMarkdown`。文档上限 500000 字符，由原生 MarkdownText 展示；缺失不生成替代计划。
- `execution`：`plan` 图；`selections` 为 `{nodeId,waveId}` 数组；`waves` 为 `{id,identity,diagram}` 数组。每项必须匹配 execution 工作面的已提供 Wave ID 和完整 `planRun/wave/workflow/workflowRun/traceRoot`，拒绝 latest、重复和身份漂移。
- 图采用 UI RC4 公开 `TaskDiagramNode` 受限 SVG 树。拒绝脚本、HTML、事件属性、远端图引用；限制深度、节点数和字符量。执行图只允许明确且唯一的节点映射选择对应 Wave，选择不会启动执行。

宿主在来源读取和客户端准入处验证资源；回调重新检查当前信封和快照。缺少资源时保留明确不可用状态。轮询得到相同投影时保留对象身份，避免重置当前图视图。组件只提供搜索、缩放、平移、精确选择，不新增审批、采纳、发布或模型权限。

探索使用既有 source-lock.json 锁定的 v8 HTML：摘要图已恢复为真正的 760×250 图；全文与 DAG 来自相同锁定来源。转换资产只在隔离预览文件中，生产代码不导入 test-harness。fixture 中关于权限的文本只是展示内容，不是宿主授权。

C082 实际3083验收：计划摘要、原生Markdown正文、DAG键盘选择、计划运行图→Wave运行图通过；故意改变workflowRun后整页撤回，恢复精确身份后重载恢复。UI RC4作业34890155457成功，下载包SHA256为cbd99f087fbc4bf4e4990ebc916ccb67be2f50cff90c5551a7ea65743a31acc3，已验证提交01fc070及资格摘要。DSH/组合新RC尚未发布。

## C083 原生 Input 关联

可选 `inputBinding` 只接受 `{workspaceId,packageRoot,sessionId}`。投影先经精确来源/身份/有效期准入；本地工作区列表必须就绪、路径一致、会话属于该工作区且未归档，当前会话确认后才显示原生 Input。Task 草案不混入正式 Delivery inventory；出现同 ID owner Task 时由正式来源优先，来源撤销不得回退到旧草案绑定。

隔离验收会话 `/tmp/crystra-c083-session.json`，独立于 Workflow C077 会话；未配置 API Key、未调用模型。304项全量回归/build/boundaries通过；实际3083打开Task原生Input、切Workflow空白会话、返回Task保留草稿、Analysis隐藏Input、foreign-session拒绝均通过。测试草稿已清空。DSH ae74ed9六项本地RC资格通过，远端RC4作业34891888318成功，组合RC3作业34892523368成功且六资产下载相同。

C084在Task原生Input提交只读`/crystra doctor`，回显NEEDS_CONFIGURATION（本隔离home尚未setup），非空原生对话页头装配正常，未回落LLM。[命令证据](evidence/c084-task-native-command.json)。这不是模型/审批或真实Task执行成功证据。

C084最终正常安装：3083单插件RC4，554文件逐字节匹配发布归档；Task会话/计划图、Workflow独立会话及C080候选在升级后均恢复。安装初次因pnpm忽略原生构建未完成，限定许可并补建better-sqlite3后普通安装成功；未关闭其他构建限制。

## C085 审核证据上下文（开发中）

可选 `assets.gateContexts`：每项为 `{gateId,evidenceId,context}`，必须对应当前可用 Gate 的已声明证据项，且 `context.id` 与 `evidenceId` 相等。重复配对、跨 Gate 配对、非文本或额外导航字段均拒绝。`context` 使用公开 `TaskEvidenceContextProjection` 的 kind/title/summary/sections/references，正文只作为文本展示，不成为授权、执行指令或自动打开 URL。

审核页可以打开上下文并返回原问题；未提供的精确计划/Trace等关联明确显示不可用。前提撤回时旧上下文随整页撤回。使用锁定 v8 已有的11项静态结论，不把样本回执当真实证据。306项回归/build/boundaries通过；实际开发实例3084验收进行中，3083保留未改的RC4。

C085浏览器已验证双栏签名差异、返回审核和缺失Trace关联的不可用提示。发现共用UI细节：从长审核页打开上下文后沿用滚动位置，返回按钮可能位于tabpanel裁剪区上方；C086先修复此显示问题，再收尾上下文验收。该修复不改变来源或审批契约。

C086 最终3084实测：审核面板top196，返回按钮top235.5/bottom267.5，scrollTop0；返回当前审核问题成功。使用精确UI RC5制品，未滚动原生Input或共享页面。
