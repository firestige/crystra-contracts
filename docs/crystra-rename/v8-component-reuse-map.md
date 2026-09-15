# C095 v8 定稿组件复用映射

用户 2026-09-15 明确边界：v8 是已核验的实现定稿。允许调整页面外层 layout；Composer/Chat 接入 DSH；其余具体组件使用 v8 HTML/CSS/JS/TS 及对应现有 components。mock/模拟行为仅允许同义替换，不可重新设计控件或直接使用演示业务数据。

定稿目录：`Crystra-ui-design 设计包（以下 assets/ 路径相对于该包根目录）`。以下记录代码来源，不是完成声明。

语义化迁移约束（用户 2026-09-15 补充）：复用的是原设计的语义 token、组件配方、配置选择器及其级联关系，不是默认配置下的尺寸快照。尺寸、颜色、间隙、排版、图标和动效中已有的语义变量必须保留；不得用 computed style 的像素/颜色结果替换变量。作用域转换必须保持配置继承和覆盖能力，不能把主题或密度配置锁死在组件内部。视觉测量仅是特定配置下的验收证据。

每批验证同时覆盖默认定稿效果及语义配置变更后的响应，检查 token → recipe → component 的引用链、配置选择器、宿主边界和还原行为。原设计仍含固定值的地方先记录来源，不自行发明新的 token 体系；宿主 layout 的必要适配单独记录。

2026-09-15 局部开发验证：Sidebar 四组图标配置与原 v8 的图标和点击区域计算结果一致，见 [配置对照证据](evidence/c095-sidebar-semantic-presets.json)。包装组件已开放原 `data-palette`、`data-typography`、`data-icon-scale`、`data-crystra-theme` 配置属性和语义 custom property 覆盖；新增浏览器测试验证配置切换、尺寸/hover token 覆盖及恢复，组件测试验证重渲染时配置传递。5 项组件测试、1 项浏览器测试及 typecheck 通过。尚未完成全量 token/继承审计、生成链固化和宿主回归；本地实例 尚未安装本批变更。

| 表面/组件 | 定稿实现来源 | 当前情况 / 接入边界 |
|---|---|---|
| 全局 Sidebar | `assets/crystra-task-work-v8-sidebar.html` 的 aside、标题行脚本、drawer/rail/tooltip 脚本与样式；其他 v8 的生成器直接提取同一段 | 当前 `CrystraShell` 重写偏离。应提取复用同一实现，替换 mock 行和宿主导航回调，保留原 DOM、动效、菜单和焦点语义 |
| 公共搜索 | `components/search-field-review.md`、现有 `state-components.tsx` / `expandable-search-field.tsx` / `search-bridge.tsx` / `search-field.css` | v8 通过 `sync-search-components.mjs` 使用相同组件；接入时复用 bridge 和组件，不能另画搜索框 |
| Task Browser | `assets/task-browser-surface.html`、`resource-browser.ts`、`task-browser.ts`、`task-browser.css`；`build-task-browser.mjs` / `build-resource-browser.mjs` | 对照当前 `components/task-browser.tsx`，盘点重复实现；保留定稿浏览交互，仅替换目录/资源操作/精确导航的数据端口 |
| Workflow Explorer | `assets/workflow-explorer-surface.html`、`resource-browser.ts`、`workflow-explorer.ts`、`workflow-explorer.css` | 与 Task Browser 复用同一基础实现；替换定义、精确 revision 和资源端口，不另写不同浏览控件 |
| Browser 视图切换 | 现有 `dist-browser-switch` 对应源组件；生成器复制相同 JS/CSS | 保留共享组件与视觉，不替换为近似按钮组合 |
| Task 五工作面 | `crystra-task-work-v8-sidebar.html` 对应工作面 DOM/样式/脚本及已接受共享组件 | 对照当前 `task-workbench` / `task-*panel` 的改写；保留原组件，真实投影通过既有正式或附条件草案端口接入 |
| Workflow 工作台 | `wsr-ui/packages/bi/src/workbench-preview.tsx`、`workflow-map-workbench`、`workflow-resource-browser`、`workflow-activity-study`；`build-workbench-pages.mjs` 生成 v8 | 拆出已有组件的数据/挂载端口，保留具体组件实现；模拟 Input 模板替换为原生 Chat/Composer |
| Analysis | 同一 `workbench-preview.tsx`、`analysis-observation-study`、既有 TraceWaterfall/TraceTree、Header/Tabs 和目录组件 | 保留原组件及交互；mock Trace/指标替换为真实精确查询，不重新组织面板或简化控件 |
| 图/资源查看器 | 各 v8 已引用的现有组件、`workflow-map-candidate.js`、`workflow-resource-workspaces.js` 及对应正式来源 | 先核对已有组件复用链；保持定稿交互，仅替换模拟读取/保存和 fixture 绑定 |
| Composer / Chat / Settings | DSH 原组件与宿主能力 | Composer/Chat 属于明确替换例外；Settings 复用唯一宿主 owner，Sidebar 内的入口视觉仍以 v8 为准 |

实施顺序：先建立来源快照/摘要与可复现提取；首批替换 Sidebar 并清理其重写 CSS；再逐表面对照上述生成链，复用已有组件，记录必要替换；每批运行定稿和接入后的同场景视觉/交互对照。已有功能测试仅作为回归证据，不等于通过定稿一致性验收。

后续部署进展（2026-09-15）：Sidebar 本地开发包已安装到 本地实例，覆盖了上文“尚未安装”的早期状态。用户本轮明确要求禁止双层 hover，据此增加可追溯修正：工作流操作 hover 使用与 Task 相同的标题背景排他规则；分析标题由外层承载背景，内部 toggle 不再叠加。均无新增尺寸或颜色常量。实际页面核验见 [C095 安装证据](evidence/c095-installed-sidebar.json)。提取链固化、其他页面及 RC 资格仍待完成。

C096：用户进一步要求搜索与相邻操作按钮保持相同 hover。仅收起态搜索触发按钮使用 `--color-interaction-hover` / `--color-text-primary` 和相同的 `rounded-md` 配方，沿用语义动效时长；展开态保留共享搜索组件行为。修复共享组件丢弃 `triggerProps.className` 的问题，使调用方原有配方能透传。已安装到 本地实例 并逐项实测，见 [C096 证据](evidence/c096-search-hover.json)。
