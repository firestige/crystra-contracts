# Input 与隔离会话装配核对

状态：DRAFT，2026-09-14，C045。继承 C044 用户裁定，未形成正式组件契约或新 RC。

## 已核对的实现

- 固定 0.1.1-rc.2 的 ui-conversation/client 公开 apply、ConversationController 及类型。实际组件由 apply 注册至 slots，不是可直接传 messages/onSend 的独立 Composer 导出。
- ConversationController 依赖按 Session scope 寻址的 SessionFace、输入状态机、队列与 RPC。只替换会话列表不能实现独立会话。
- runtime SessionRuntime 管理 list.current、scope、输入 provide 和事件窗口。可以复用其实现，不要求与另一个 DSH 实例共享对象。
- 本机实际工具依赖 dsh-base/cordis.patch.yml 为 session-persistence-jsonl 配置 dshHomePath('sessions')；dsh-web-app 为 storage-json 配置 dshHomePath('storages')。默认会话全文查询为内存、openAt: never。自定义 patch 覆盖仍须检查。
- 已有开发实例 3082 使用 /tmp/crystra-v8-dsh-home；lsof 确认进程打开该目录下 profile 与 settings。workspace.json 为独立空工作区表，浏览器原生会话树显示“暂无会话”。这些证明实例装配与空列表，不证明全部跨实例拒绝访问测试完成。

## 当前实施候选

优先复用完整 DSH 组件/Session/RPC 实现，在 Crystra 专属运行实例中装配；使用独立 home、连接端点及浏览器 origin。已有 3082 开发隔离实例可供验证，不增加独立安装器，不修改实际 3080。原生 UI 组件在专属实例内服务 Crystra 会话，而不是从用户原生实例读取会话。

这不是将两个普通页面切换称为会话隔离：必须核对会话日志、附件、索引、workspace/storage 路由、事件订阅与历史读取。Crystra 的 Evidence/Task 领域列表与 Input Session 列表属于不同数据来源，当前真实 Task list 不自动构成该 Task 与空 Session 的绑定。

## 本次浏览器结果与剩余检查

3082 的“新建任务”仍调用 navigation.openHarness + ctx.sessions.clear，呈现整张原生界面，尚不是 v8 新建页。已确认未发送提示词、未配置 API Key、未创建会话。点击选择工作区及添加工作区未在浏览器呈现菜单，console errors 为空。固定版本 native directory picker 源码是 renderless flow，调用 ctx.workspaces.pickDirectory 并在宿主显示选择器；因此不能将无网页菜单直接定性为失效。读取 Finder 窗口的工具约 743 秒后返回普通 Projects 窗口，没有找到 picker，未操作文件。

下一步：

1. 检查实际组合的目录选择 provider 与宿主调用结果，或在隔离验收配置使用现成 browse provider 验证目录创建链路；不改用户实例。
2. 在两个一次性专属实例创建无 LLM 测试会话，验证互不列出、跨端点精确历史读取失败、事件不串流；同时核对附件及持久化路径。不要只验证 ID 前缀。
3. 将专属实例的原生 Input 排入 v8 Task/Workflow 几何，保留组件内部样式和交互；独立 Analysis/Browser 切换不泄漏隐藏输入焦点。
4. 验证 Crystra 内部草稿/附件/subject 连续性与 Task 精确绑定，再进入组件与组合 RC。

未验证：上述双实例隔离、完整 Input 挂载、发送/审批/附件链路。当前不存在需用户先批准 fork 的阻塞。

## C046 实际验证与新建页接入

两次性固定 0.1.1-rc.2 实例：3083=/tmp/crystra-session-isolation-a，3084=/tmp/crystra-session-isolation-b。真实 RPC 从空列表分别创建无提示词会话，验证本端历史成功、列表仅本端会话、异端精确 history 和 rename 均返回 session-not-found。两边真实 WebSocket /api/events.host 在新增会话后均收到本端 ID，1500ms 观察窗口中没有异端 ID。最初错误使用 SSE 收到 426，修正为源码规定的 WebSocket；rename 不属于 host/session-added，最终用新增会话作正向事件对照。日志文件分别位于两个 home 的 sessions 下。结构化结果见 [证据](evidence/c046-session-isolation.json)。未覆盖附件跨实例读取、恶意直连另一个端点或共享 OS 账号的文件访问，不能称安全租户隔离。

DSH 新增 new-task 产品路由；点击新建任务清空当前选择并留在 Crystra，既不创建业务 Task identity，也不主动创建 Session/Agent。外层 native-input-layout 适配在该页为原生 Conversation 分配侧栏右侧空间，仅修改 ui-layout 外层几何，不复制 Composer、不移动 DOM、不注册第二个 root。依赖布局字节 SHA256 16f001f89a9bc19c54cfa90e37cf52e191113af0abe5efd593e57d7ab30060ad，新增测试绑定该固定基线。它是有版本前提的布局适配，不宣称公共 slot 契约。

3082 浏览器实测：Crystra 侧栏与完整原生 hero Input 同屏；新建页隐藏原生 Sidebar/Details/拖拽柄；测试工作区通过现有 workspace.create 注册 /tmp/crystra-input-acceptance，原生选择菜单正常展示；填写未发送草稿，切到本专属实例的原生布局再返回，内容保留且仅一个输入框。测试草稿已清空，没有发送 LLM 请求或更改 API Key。Analysis 页隐藏底层原生 Input 与原生会话树，可访问角色查询均为零。实际 3080 未操作。

验证：Node 全套 216/216，通过日志 /tmp/crystra-c046-tests.log。最初默认 npm cache 下 pack 测试失败，使用可写 /tmp/crystra-npm-cache 后整套通过。当前正式 lib/client.js 尚未重建，3082 仍是开发 bundle，Analysis 仍为显式设计样本探索；不是新 RC 资格。

剩余：Task/Workflow 精确会话绑定与工作面布局、Crystra 页内返回导航的草稿连续性、附件/审批/发送真实链路、品牌 hero 与 v8 完整页面接入、组件 RC 与组合重新资格验证。新建页成功不等于这些已完成。

实现提交：DSH 72725a6。一次性 3083/3084 验证进程已停止，测试目录与结果保留；3082 开发实例继续运行。
