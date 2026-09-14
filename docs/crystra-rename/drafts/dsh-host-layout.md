# DSH 宿主布局扩展草案

状态：DRAFT · host-layout.draft.1。**本文不是已获准的 DSH 修改，也不改变正式 SlotRegistry 规则。** 草案用于解决 v8 Task/Workflow Input 连续性；数据草案授权仍有效，本项待确认的是增加宿主组件修改/维护范围。

## 当前可复验证据

固定运行时为 @deepseek-ai/dsh 0.1.1-rc.2。检查的是 `/tmp/crystra-dsh-t6/node_modules/@deepseek-ai/` 的实际安装字节：

- `dsh-client-runtime/lib/types/client/slots.d.ts`：root 由 ui-layout 的 AppFrame 占用，明确 “DO NOT register here”；第二个 root 会遮蔽并卸载原框架。
- 同文件 `renderSlot`：ctx 级仅允许 root；其它 seat 必须使用组件 owner 提供的 renderSlot。
- `dsh-client-ui-layout/lib/client.js`：AppFrame 注册 sidebar/root、conversation/session-maybe、details/session、shell.overlay/root。现有 overlay 没有 children 声明，不提供 Conversation 的子插槽 renderer。
- C037 已实际复现 overlay 调用 props.renderSlot 的 TypeError。当前 overlay 对 Analysis 等独立页面有效；不能将这个结论扩大为 Task Input 已接通。
- `dsh-client-ui-conversation` 维护实际会话/Composer，不能把原型 textarea、生成的聊天内容或第二份 Conversation 当作它的替代。

当前可继续的工作：完整页面组件化、草案数据准入、独立 Analysis 数据端口与测试。受影响的是 Task/Workflow 与真实 DSH Input 的组合；T8 完整验收依赖这一项。

## 最小提案

修改范围新增 **DSH 的 ui-layout 宿主组件**，优先形成正式上游变更；若当前发行节奏不能配合，再维护绑定精确基线的临时布局 fork。二者均需把范围加入执行计划，而不是默默替换平台源。

原 AppFrame 继续唯一注册 root。添加产品区域的受支持 seat：产品侧栏、工作区 Header、Control、独立 Browser/Analysis 主面；通过布局模式选择可见区域。最终序列化/API 名称待实现核实，不把本段名称当正式 SlotMap。

| 模式 | 原 Conversation | 产品区域 |
|---|---|---|
| Harness | 原有位置、原有会话 | 隐藏/inert；保留产品导航返回入口 |
| Task / Workflow | **同一 React 节点和 scope**，由原 AppFrame 在指定 Input 栏排布 | 产品侧栏、Header、右侧 Control；Control 只读/写权限按各领域原约束 |
| Browser / Analysis | 保持会话状态，但隐藏且不可聚焦，不新增实例 | 产品主面占用相应空间 |

不把 Conversation ReactNode 从一个父节点移到另一个父节点；不重复调用 conversation renderer；不注册第二个 root；不通过遮罩开孔、私有 CSS class 或移动宿主 DOM 假装完成公共挂载契约。布局变化通过稳定的宿主节点位置和模式样式完成，产品组件不拥有 Session 生命周期。

Task→Session 必须来自正式 Delivery control-plane 的 task.identity / navigation.sessionCorrelation 或后续被承认的绑定；零匹配明确不可用，多匹配显式选择。不得选最近会话，也不能由 Task ID 猜 Session ID。已有输入草稿与具体 Gate subject 的精确恢复另需验证，不能仅以节点不卸载证明全部成立。

## 生效前提与作废条件

1. 用户明确将宿主 ui-layout 扩展/必要受控 fork 加入本次范围；发布坐标、基线摘要和维护位置落定。
2. 宿主维持唯一 root/Conversation、session scope 和输入 authority，不绕过现有 SlotRegistry 守卫。
3. 通过实际宿主测试：切页/切 bench 保持未发送内容、subject 和会话；没有重复 Composer、隐藏输入不可聚焦；卸载产品扩展可恢复 Harness。
4. 若需要 fork，必须绑定精确源摘要与变更记录；上游升级后重新验证，基线漂移即失效，不静默沿用补丁。
5. 最终新的 UI/DSH RC 与组合仍需重新资格验证。草案样本不计入真实链路通过。

任一前提不成立，本提案不得用于宣称 Task/Workflow 的真实 Input 接入完成。可以继续前述独立工作。正式化不由草案、测试或 RC 自动触发。

## 验收清单

- 挂载计数/实际 DOM：始终只有一个 Conversation/Composer，切换不重建当前输入节点。
- 输入草稿、附件、reply subject、焦点和滚动：逐项验证，包含 Gate 来源返回及失败恢复。
- 精确 Session 绑定：零个/多个/失效绑定、离线、Task 切换竞态。
- 原 Harness：Sidebar/Details/会话切换/拖拽布局/插件卸载回归。
- 页面实际截图：1920×1080 基础场景，与定稿 v8 同状态对照。

本草案不承诺当前 DSH 已支持这些能力。执行状态以主计划为准。
