# T2-EX 完成记录

2026-09-13。当前工作树 `/Users/firestige/Projects/wsr-execution`，main 已从 597a0a6 快进到 `dbec4ec441f384ec83788890e5ed614a7c405dec`。实现已提交并推送为 `cd7f178b4658a23ec992748a9a8b5f47beafd4de`；独立 CI 已成功。

## 已推进

- 根包改为 `crystra-execution@0.1.0`；源码、配置和当前测试中的品牌／技术前缀已初步更名。旧 release/candidates、历史文档与第三方锁文件摘要未批量改写。
- 私有旧 Intake 工作区暂名 `crystra-execution-intake-internal`，依赖改为本地 workspace；它不进入核心发布包，也不新增插件注册。其最终移除／归并属 T3。
- 在 `.crystra-inputs/` 准备独立的精确测试输入，配置为 `config/development-inputs.json`：Contracts f2d373a、Workflow Package 14ceea8。当前本地通过独立仓库 Git archive 导出；CI 使用精确 checkout。T5 才切换这些依赖仓库 URL。
- 生成器从父目录依赖改为本地 `.crystra-inputs/contracts`，新增回归先复现 ENOENT 后通过；已有跨组件测试路径迁入该目录布局。
- main／候选 CI 已初步解除组合 checkout／gitlink 要求；候选从本组件 SHA 构建。候选／GA tag 使用 crystra-execution-v 前缀；对应新策略回归先失败再通过。
- 已移除正常 npm 发布入口，普通 Execution 依赖采用 GitHub 精确 tgz。发布工具／其余旧测试仍待完整跑通，不能认定此部分完成。

## 验证与下一步

- 原生依赖安装已解决：相同锁定版本的原始 tarball 经 SHA-512 对照，完整离线还原；没有 stub、第三方版本变更或用户缓存权限修改。
- `pnpm test:coverage`：82 文件、736 测试全部通过；语句 90.02%、分支 86.10%、函数 93.72%、行 95.13%，保留原门槛。日志 `/tmp/crystra-execution-coverage-host.log`。真实 DSH／HTTP 测试需宿主执行，受限沙箱内会超时。
- 类型、构建、生成一致性、静态 harness、feasibility 12 测试、独立输入／tag 2 测试均通过。发布文案收尾后 19 项发布回归通过。
- 本地新名制品 `/tmp/crystra-execution-dev-20260913/crystra-execution-0.1.0.tgz` 与发布元数据验证通过；在 `/tmp/crystra-execution-consumer-20260913` 以普通 tgz 依赖安装，并成功导入 `DefaultExecutionApplicationFactory`。没有发布候选。
- main CI：[34759925679](https://github.com/firestige/wsr-execution/actions/runs/34759925679)，已成功；T2-EX DONE。

后续工作：T2-WP 已开始；T3 已满足 Execution／UI 前置。T5 仍需切换实际仓库坐标及权限；当前输入文件中的旧仓库 URL 是有意保留的有效读取坐标。

`.gitignore` 中用户原有 `.project/` 保持未暂存；本任务 `.crystra-inputs/` 已单独提交。其它 `.DS_Store`、project-ops.config 均未提交或清理。
