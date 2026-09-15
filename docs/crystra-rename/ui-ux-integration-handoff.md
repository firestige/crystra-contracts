# UI/UX 集成接续说明

2026-09-15 用户确认更名任务完成；剩余 UI/UX 集成独立推进，不重新打开更名计划。

本文路径均相对于明确标注的仓库根目录。仅记录代码来源、版本、制品和验证结论；机器目录、进程、端口、会话及日志位置由执行者在本地发现，不随文档上传。

## 设计边界

- v8 HTML/CSS/JS/TS 是已核验的实现定稿。Sidebar 快照位于 `crystra-ui` 仓库的 `design/v8/sidebar.source.html`，摘要见 `design/v8/provenance.json`。
- 完整设计包名为 `Crystra-ui-design`；组件映射使用包内相对路径。它是审查设计来源所需的输入，不是某台机器的安装位置，也不是组件构建对外部目录的依赖。缺少完整设计包时，先核实可取得的版本。
- 仅页面外层 layout 可因宿主调整；Composer/Chat 复用 DSH，其余组件复用 v8 及已有 components。mock 只能由真实数据端口同义替换。
- 保留语义 token、配方、配置选择器和覆盖/继承关系。测试测量值不得固化为组件尺寸或颜色。
- Crystra 与 DSH 会话隔离；banner 进入 Crystra；未确认领域契约只能作为有生效前提的草案。

## 代码与制品

| 仓库 | 分支 | 功能提交 / PR |
|---|---|---|
| crystra-ui | `codex/crystra-sidebar-v8` | `9baf454`；PR #9 |
| crystra-dsh | `codex/crystra-banner-navigation` | `c67cbcc`；PR #39；发布依赖仍指向 UI RC6 |
| crystra-contracts | `codex/crystra-banner-acceptance` | PR #20；关闭与接续文档所在分支 |

PR 在本轮核验时均为 OPEN、非 Draft。提交保存不等于 main 已包含修复，也不等于完整 UI 验收完成。

C096 验收使用本地开发包 `dsh-crystra-c096-development.tgz`，不是新发布 RC。包 SHA256 为 `2c5c8d4fef0f17c33141b1045e031ccc822d8d65dc054040c2cb6c13fbd38924`，客户端文件 SHA256 为 `27028dda2c904140214b959992d69dcf858692f1754d0ec95530da79dffa1a2b`。这些摘要校验的是制品内容，不是机器或硬件身份。DSH 软件版本为 `0.1.1-rc.2`。

该包以 DSH `c67cbcc` 加 UI `9baf454` 组装，更新了 `config/development-inputs.json`、`package.json`、lock 和 `lib/client.js`；与 PR #39 的发布依赖坐标不同。下一轮应通过源码重新构建，或在本地找到留存包并核验摘要，不能仅 checkout PR #39 就宣称复现。包内历史调试记录只作为本地材料，不应原样转存远端。

## 验证结果与未完成项

- C096：434 项 UI 单元测试、34 项脚本测试、3 项 Sidebar 浏览器测试、typecheck/build 通过。
- 安装后的任务/工作流搜索、视图、全部按钮 hover 背景/颜色/圆角一致，中心偏差为 0；标题无重复高亮，搜索可展开覆盖操作组并关闭。
- C095 隔离宿主的设置弹窗、banner 切换、会话隔离和未发送草稿保留通过。
- 断言发布 UI RC6 坐标的资格测试不适用于 file 依赖开发包，本地通过项不构成新 RC 资格。
- 下游服务在 UI 验收时不可用，恢复工作时检查服务健康；本轮未变更下游生命周期。

证据：[C096](evidence/c096-search-hover.json)、[C095](evidence/c095-installed-sidebar.json)、[来源映射](v8-component-reuse-map.md)、[交互审计](sidebar-interaction-audit.md)。

## 后续顺序

1. 核实 PR/main、安装制品及服务健康，保留人工验收数据。
2. 固化 Sidebar 提取生成链，审查语义继承、样式作用域、StrictMode/lifecycle、未知字段和精确 revision。
3. 按来源映射完成 Task Browser、Workflow Explorer、Task 工作面、Workflow 和 Analysis 集成，避免近似重写。
4. 验证原生 Composer/Chat 与 Sidebar 动画的外层布局、hover/focus、搜索/抽屉和真实数据端口。
5. 完整门禁及宿主浏览器对照后再制作新 RC；不自动合并或发布 GA。

## 文档与证据规则

仓库内路径使用仓库相对路径；跨仓库来源使用仓库标识加相对路径，并说明必要性。项目外路径、PID、临时会话和现场日志不上传。软件版本、测试 viewport 和制品摘要可以作为可复现条件；密钥、认证材料和硬件指纹不得进入文档或提交。远端历史中已存在的本机信息不能用后续删除提交宣称已抹除；历史处置另行评估。
