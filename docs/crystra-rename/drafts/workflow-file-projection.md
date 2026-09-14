# Workflow 文件投影条件草案（C076）

状态：探索草案，非正式领域契约。依据现有 v8 设计和已发布 UI RC3 的公开组件输入形状。只有下列前提全部成立才可使用；任一前提不满足，目录及当前工作面撤下，不退回缓存或 latest。

- 宿主明确配置 `exploration.workflowFile`、`sourceLockFile` 的绝对路径、来源锁字节 SHA256 `sourceLockDigest`、布尔 `allowFixtures`。
- 来源锁及所列设计文件的内容摘要逐次匹配；调用者不能通过 RPC 选择文件或覆盖权限。
- `draftId=crystra-ui-exploration`、`revision=draft.1`、`environment=exploration`、`adapterId=crystra-workflow-file@1`。
- selection 与 binding 的 `definitionId`、`definitionRevision`、`workspaceId` 精确相等。每个 definitionId 暂只接收一个明确选择的版本，重复身份拒绝，不能猜 latest。
- projection 含 `snapshotRevision`、规范 ISO `expiresAt`、`provenance=fixture|service`；fixture 必须显式启用，界面持续标注设计样本。

文件结构：`{format:'crystra-workflow-file@1',workflows:[{selection,projection}]}`。projection 的 binding 还包含来源锁摘要及上述草案身份。

`entry` 使用公开 WorkflowDefinitionEntry 形状，身份与 selection 一致，status 固定 DRAFT。`studio`、`resources`、`crystallization` 分别为 `{state:'available',value}` 或 `{state:'unavailable',reason}`：

- studio：精确 WorkflowMapIR 0.2、groups 及布局表。布局键为方向 RIGHT/DOWN + 展开位集；只有相同定义和展开集合可以使用对应布局，缺项不可用，不猜坐标。
- resources：公开 ResourceWorkspaceSnapshot 与 WorkflowCatalogResource 列表。仅阅读、导航及 Markdown；不授予编辑、关系推断、对话引用、保存或 Agent 消费权。
- crystallization：公开 CrystallizationProjection；预测与实测独立，布局须匹配其 before/after 定义。没有实测不会用预测填补。

RPC 使用既有 loopback `/crystra-exploration` 下的 `workflow/catalog/read`（空参数）、`workflow/projection/read`（仅 selection 三字段）。配置可仅包含 taskFile、仅 workflowFile 或同时包含二者；未配置的端口返回 DRAFT_DISABLED。

客户端每 5 秒复核。有效读取租期最多 10 秒，并且不超过快照 expiry；卡住的刷新不能延长旧内容。相同投影复用对象，避免轮询重置图布局；来源/绑定失效后清空，之后的新有效读取可恢复。

验证：局部端口/页面测试、侧栏身份及轮询保持修复后的 285 项完整回归、build、boundaries 均通过。3083 本地 DSH 代码 + 已发布 UI RC3 实际呈现三工作面，破坏 binding 后目录及当前结晶内容撤下，恢复后可再读取。这里只证明条件探索投影可用，不宣称正式 Workflow owner、原生会话、资源写入和 Agent 通知已接通。当前 C076 尚未发布，公开基线仍是 DSH RC3 与组合 RC2。
