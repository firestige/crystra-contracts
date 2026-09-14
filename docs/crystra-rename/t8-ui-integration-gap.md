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
