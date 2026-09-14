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
| 新 Shell / 页面导航及恢复 | 待实现 | 按 v8 的 Task、Workflow、Analysis 入口和品牌切换接入 DSH，不保留旧入口作为最终页面 |
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
