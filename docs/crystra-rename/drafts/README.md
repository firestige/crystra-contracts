# Crystra UI 接入探索草案

状态：**DRAFT · draft.1**。本目录不属于正式契约清单，不加入 `release/config/current-resources.json`，不发行正式协议版本。用户于 2026-09-14 授权按以下顺序探索缺失契约：先复用指定设计目录结论，再提出满足 UI 的最小契约；前提不满足时草案作废。

本目录的“必须”仅约束本草案实验，不能反向覆盖正式 Task Binding、Delivery Admission、Manifest、Evidence 或执行协议。已确认的 UI 设计继续保持原级别；其尚未正式确定的数据/事务结论作为草案复用。设计样本不是运行事实。检验结构通过也不证明来源真实、判断正确或用户已经授权。

## 来源与缺口映射

来源根：`/Users/firestige/Projects/workflow-self-recursive/tmp/20260907/Crystra-ui-design`。精确原字节摘要见 [source-lock.json](source-lock.json)。下表路径均相对该根，结论只在其原适用范围内复用。

| 缺口 | 已有结论及来源 | 草案补充；非正式结论 |
|---|---|---|
| Task IR / Grilling | `pages/task-detail/{README,grilling}.md`：五工作面只读、Brief 区分推测/确认、争议不得丢失 | Task projection 按 taskId + goalRevision + snapshotRevision 提供各工作面，不把聊天摘要提升为 Brief |
| Plan / Wave | `pages/task-detail/plan.md` D10：语义修订升版；候选不是提交版本 | planRevision 使用 opaque string，Wave 使用显式稳定 ID；不得从数组下标/名称推导身份 |
| Plan Run → 执行映射 | `pages/task-detail/execution.md`、C06/C08：身份轴不同，禁止自动一一对应 | 显式 binding 记录 planRevision / planRunId / waveId / workflowRunId / deliveryId / traceId；缺任一必需值则关闭相应深链 |
| Gate / subject / 确认 | `pages/task-detail/gate.md` D08/D09：只展示已触发且需人工项、AI 理解不算确认、当前 Gate 原子更新 | Gate read snapshot 带 gateId/revision 与确认对象、范围、原文及核验来源；subject 绑定精确对象，不解析“同意”自动批准 |
| 当前 readiness | `pages/task-detail/delivery.md`、C07/O10：Task 当前判断不同于一次 Delivery 终态；目标变化失效 | readiness 对 goalRevision + planRevision + artifactRevision 集合绑定；未实现算法时 unavailable，禁止从执行成功率推算 |
| Task Browser | `pages/task-browser.md`：Gallery/List、未知关注不等于零、Task 无 Workflow 绑定字段 | 查询返回明确 known/unknown 的状态/时间/费用/Workspace/关注；已有 task list 只填 taskId/displayName，不补猜测字段 |
| 新建 / 写事务 | `pages/new-task.md`：点击和 Workspace 暂选不落 Task/Session；正式 admission 不可绕过 | 草案先允许隔离 authoring store 的 CAS 提案；首条消息与正式 Session 创建适配须另验宿主，不用草案替换 admission |
| Workflow Studio | `pages/workflow-studio-contracts.md`：JSONIR 0.2、资源语义身份、一致性提交和可靠事件 | 复用现有 parser；存储 workspaceId/resourceId/baseRevision；设计 IR 不直译执行 DSL，发布能力 unavailable 直到正式映射成立 |
| Analysis | `pages/analysis-audit.md`、D21–D23：总览/Trace/对比分析、配置与数据分离 | 复用正式查询及 metric result；观察设置只描述选择/图形映射，不新增统计口径或自动结晶方案 |
| 导航与恢复 | `foundations/navigation.md`、O02 | view state 与语义 revision 分离；精确身份失效显示不可定位，禁止回退最新 Run |

## 生效前提与失效处理

1. 使用方显式选择 `draftId=crystra-ui-exploration`、`revision=draft.1`，环境标记为 `exploration`。普通正式入口不得因为缺数据自动启用草案。
2. 草案来源锁与使用方审核的来源锁一致；权威设计/正式契约变化后，先重新审查与修订草案，不能自行更新 hash 使旧草案继续有效。
3. 当前 Task、目标/计划 revision 与读取结果一致；读取权限成立；数据由已绑定 adapter 提供。快照有效期未过，时间由适配器固定格式给出。
4. 正式运行事实只能经正式服务读取；探索 fixture 单独标记 `fixture`，不可混入正式事实、确认记录或 RC 正式链路验收。
5. 草案不得驱动执行、批准 Gate、冻结 Manifest、发布 Workflow 或晋升 GA。必要写探索只进入隔离 authoring store，不接真实 effect 接口。

任一前提失败，当前草案投影为 `invalid`，清除旧的有效内容，显示失败原因并保留用户输入与来源引用。依赖该投影的深链/写操作停止。权限变化、正式定义冲突、来源变化均不得继续使用旧绿色判断。修订草案须新 revision 和重新验证，不悄悄把失效草案恢复为正式版本。

## 最小读取契约（本轮可执行部分）

传入 `read(context)`；context 是宿主可信边界提供的 expected binding，不取自待验证 response。字段：draftId、revision、sourceLockDigest、environment、taskId、goalRevision、planRevision（允许 null）、accessAllowed、adapterId。adapterId 是显式选择的适配器身份，不靠 response 自报建立信任。

response 具有相同 binding，并带 `snapshotRevision`、`expiresAt`（UTC ISO）、`provenance`（`service` 或 `fixture`）、`surfaces`。每个工作面为 `{state:'available', value}` 或 `{state:'unavailable', reason}`；五个 key 固定为 grilling/plan/execution/gate/delivery。缺 key 不是无内容，属于格式错误。value 已增加五工作面结构校验（C059）：grilling/plan/execution/delivery 分别对应现有只读 UI projection；gate 为 `{gates: TaskGateProjection[]}`。必需字段、嵌套列表、稳定 ID 唯一性、完整运行引用和允许字段均检查；未知命令字段拒绝。结构通过仍不声称验证业务语义、确认真实性或正式来源。

生产查询的旧 task list 可作为 Browser 部分字段输入；不能为了填满五工作面将 taskId 变成 Plan/Gate 内容。不同 goal/plan revision 的内容不合并。`expiresAt` 到期必须重新读取；C058 controller 提供定时失效、上下文变化清空、撤权拒绝、乱序丢弃与销毁处理；UI 挂载后的持续失效仍须接入验收，不能以 controller 单测代替。

## 最小写探索草案（C063 存储基础已实现，尚未接实际写入口）

提案带 proposalId、task/workspace/resource identity、baseRevision、candidateRevision、完整候选及 source refs。隔离 store 在一个事务中核对 baseRevision、结构/引用、适用授权，再保存不可变新版本和待通知事件；同 proposalId+相同内容幂等，不同内容冲突；失败不得留下半份新版本。权限与 authority 在提交时再次核验。Input 为 Task 唯一写入口，Workflow 按其后续已确认裁定提供资源写入口。草案提交成功不是正式计划批准或执行授权。

C063 隔离 store 实现了单资源流内的基线比较、不可变版本、proposal 幂等、读取/提交时上下文复核、候选校验隔离副本，以及新版本和 pending 事件的同文件原子替换。并发 writer 拒绝 STORE_BUSY；进程异常遗留 lock 不自动抢占。C067已接显式资源UI测试端口；尚未接Agent写入或事件投递，不宣称跨服务事务或通知成功。首条消息持久化、subject 原子更新、确认记录的语义核验、Task 指标算法、DSL 映射、可靠事件投递逐项验证前均为 unavailable。草案可渲染性与正式运行链路分别验收。

## 推进顺序

1. 来源锁与 envelope 失效规则；测试错版本、错身份、过期、权限撤销和 fixture 边界。
2. 复用现有 UI 组件接只读 Task/Workflow 工作面，分开 fixture 探索和正式服务事实；补 value validator。
3. 隔离写事务与跨页恢复探索，验证冲突和失败回退。
4. 记录效果、反例和仍不成立的前提；决定保留/修订/作废草案。正式化需要单独承认，不能因进入 RC 自动发生。

执行状态继续只在 [执行计划](../execution-plan.md) 中维护。

C067资源端口按声明的resourceId/path和精确文件版本工作，外部异步保存必须更新快照后再确认。当前存储是独立候选，不修改源包；编辑后旧语义关系和引用暂停。开发4192桥不进入制品。

C072 为隔离资源 store 增加 `readRevision(resourceId, path, revision)`：显式读取源版本或不可变草案版本；不存在的版本拒绝，不把 latest 当作精确坐标，授权/来源锁仍在读取时复核。已验证新版本保存后旧版本读取稳定及撤权拒绝。该接口供后续事件消费者读取候选，尚未注入 Agent 上下文或确认可靠投递。

C073 的可选 `exploration` 配置将 Task 文件 adapter 纳入插件：绝对路径 taskFile/sourceLockFile、sourceLockDigest 和显式 allowFixtures；`crystra-task-file@1` 保存独立 selection 与 projection。默认关闭，调用者不能指定文件路径，来源锁/来源字节/绑定/expiry逐次复核。客户端5秒刷新，10秒读取租期或快照expiry先到则清空，不以卡住的请求延长旧内容。正式Task身份优先，未提供的Plan图/全文/证据不可用。3083实际归档读取及撤销恢复已验；不是正式领域契约，也不接 Agent 通知。

C076 将 Workflow 三工作面接入显式文件读取，范围与失效前提见 [Workflow 文件投影条件草案](workflow-file-projection.md)。生产包不包含设计 fixture 或开发源码别名；设计数据仅由隔离配置提供。当前不增加写入、发布或 Agent 消费权限。

- [Task 文档与图投影草案](task-rich-projection.md)：C082 精确身份绑定的计划文档、摘要/DAG 与运行图；条件有效，未升级为正式契约。
