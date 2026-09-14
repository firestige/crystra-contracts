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

## C077 可选原生输入绑定

projection 可显式提供 `inputBinding:{workspaceId,packageRoot,sessionId}`。这里的 workspaceId 是专属 DSH 实例的工作区身份，独立于 selection 中的逻辑工作区身份；packageRoot 必须是绝对路径。客户端要求工作区列表和会话列表均 ready、精确路径与成员归属一致、未归档，并只在当前 Workflow 的精确 revision 上选中该会话。不创建会话、不传递凭据、不发送消息。来源撤销、换页或成员失效时隐藏输入。

DSH 4624028，287项回归/build/boundaries通过。3083 实测复用原生 Composer；切工作面及 Analysis 往返保留未发送草稿，Analysis 可访问输入数0；foreign-session身份使输入撤下，恢复原精确身份后草稿仍在。测试会话与用户3080分离。测试草稿已用键盘清空，重载确认仍为空，发送按钮disabled。原生输入接通不等于已实现对象引用、候选读取或 Agent 通知。

## C078 精确资源读取及对话引用

DSH f5e10e6，288项完整回归/build/boundaries通过。loopback `workflow/resource/read` 接受 selection 三字段 + resourceId/path/resourceRevision；只读已准入目录内的完整文件，拒绝 latest、越出目录、截断内容和来源失效。文件无独立 revision 时以明确的 projection.snapshotRevision 作为设计快照版本。artifact-lifecycle.md 实际读取12170 bytes，SHA256 `890ca34e1d05e7b0e541e25b22b2966277658e3107c9da397a5ea88adf3d282d`，与指定设计内容相同。

资源讨论、活动与结晶引用接入原生 Input facade。引用回调要求当前投影仍相同且输入绑定active，只追加草案身份与对象精确坐标，不发送、不替换原草稿、不授权执行。3083资源讨论实测保留原文字并追加resourceId/path/resourceRevision，测试草稿随后键盘清空。Agent读取工具C079正在实现，尚不能宣称端到端模型消费或事件投递成功。

## C079 绑定 Agent 的读取工具

DSH be5957f 提供 `crystra_workflow_draft_read`，仅在显式 workflowFile 配置时注册。参数为 definitionId/definitionRevision/resourceId/path/resourceRevision 和可选 offset；先核验真实 Agent 身份、canonical 工作区及会话成员，再核验投影的原生 inputBinding。每次重新验证来源及expiry，只读请求的精确版本；最多10000字符，返回全文SHA256、totalCharacters和nextOffset。工具不是自动通知、写入或采用授权。

290项完整回归/build/boundaries通过。3083真实 tools.execute 管线（无LLM）成功返回 artifact-lifecycle.md，9422字符，全文摘要与C078相同。随后改变inputBinding会话，原Agent调用返回 DRAFT_SESSION_UNAVAILABLE，不含文件内容。正/反例证据 `/tmp/crystra-c079-tool-result.json`、`/tmp/crystra-c079-tool-denied.json`。临时测试插件只安装在专属测试profile，没有进入产品源码/归档；完成后从patch移除并重启实例。当前资源候选的持久化、精确读取已有store实现，但配置式Workflow端口尚未整合编辑/保存/待消费事件。

## C080 配置式资源保存与候选精确读取

DSH 38998b7：新增显式 resourceDraftRoot 和 allowResourceWrites；默认无写权限。每个精确来源快照使用独立候选命名空间。保存通过原不可变store，写入前后异步复核来源、绑定与expiry；不会写设计源文件。前端校验完整回执，失配/迟到响应不更新当前workspace；丢失回执后重试复用proposalId。同步getContext仍受支持，异步初始化来源失败不会产生未处理Promise拒绝。

`workflow/resources/read` 返回当前候选列表；`workflow/resources/save` 接受 selection + proposal。Agent读取仍按resourceRevision精确选择源版本或不可变候选，不跟随latest。UI保存后讨论引用使用候选draft-sha256版本。

298项完整回归/build/boundaries通过。3083实际编辑、保存、重载成功；源artifact-lifecycle.md摘要仍为C078值。保存候选 `draft-sha256:48e27ead12f2006854090d15c88b49b339be1fb8bbf5835219bd5514fa6f8939`，内容摘要 `378cc357f36d2e3a0b68d8160cbe70ec26dae1791295573f8c422cbd583b5adc`。真实DSH工具管线读回相同候选及摘要（9450字符），无模型请求。证据 `/tmp/crystra-c080-save-evidence.json` 与 `/tmp/crystra-c080-tool-result.json`；事件仍pending，不宣称可靠通知或Agent采用。临时测试入口移除并重启后POST回405，已不是验证处理器。

当前3083 session4519，显式候选目录 `/tmp/crystra-c080-resource-candidates`，保留测试候选供恢复；原生输入中的测试引用已键盘清空。源包、用户3080和旧RC3081未改动。C076–80尚未发布新RC。

## C087 资源关联图（开发中）

复用公开ResourceRelationGraph，只消费已通过条件信封准入的workspace节点、边和文件，不查询“最新资源”。检查节点唯一性、边端点、文件引用、展示字段和隐藏中间节点遍历预算。图与当前文件集合、内容、版本、internal/truncated标志必须一致；任何已保存候选变化均使旧图不可用，保留的旧打开回调也必须重新检查。打开目标只允许当前声明且可展示的文件。

这只是来源快照的关系探索，不能证明运行调用、引用有效性或候选被Agent采用。未保存修改继续服从现有编辑导航确认；保存后的图须等待新的精确投影，不推测重建。UI公开端口和宿主实现验证进行中，3083保持RC4。

C087 宿主提交82ce38b消费已发布UI RC5 e3246e1，313项回归/build/boundaries通过。3084实测关系图、跨轮询节点详情保持及声明文件跳转；保存composition-conformance.md隔离候选后旧图显示来源不一致。候选位于/tmp/crystra-c087-resource-candidates，源包未改。DSH RC5自动作业34896020077进行中，尚不把本地验证当作已发布资格。
