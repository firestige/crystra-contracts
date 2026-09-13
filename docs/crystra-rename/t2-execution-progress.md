# T2-EX 进行中记录

2026-09-13。当前工作树 `/Users/firestige/Projects/wsr-execution`，main 已从 597a0a6 快进到 `dbec4ec441f384ec83788890e5ed614a7c405dec`。本任务改动未提交。

## 已推进

- 根包改为 `crystra-execution@0.1.0`；源码、配置和当前测试中的品牌／技术前缀已初步更名。旧 release/candidates、历史文档与第三方锁文件摘要未批量改写。
- 私有旧 Intake 工作区暂名 `@crystra/execution-intake-legacy`，依赖改为本地 workspace；它不进入核心发布包，也不新增插件注册。其最终移除／归并属 T3。
- 在 `.crystra-inputs/` 准备独立的精确测试输入，配置为 `config/development-inputs.json`：Contracts f2d373a、Workflow Package 14ceea8。当前本地通过独立仓库 Git archive 导出；CI 使用精确 checkout。T5 才切换这些依赖仓库 URL。
- 生成器从父目录依赖改为本地 `.crystra-inputs/contracts`，新增回归先复现 ENOENT 后通过；已有跨组件测试路径迁入该目录布局。
- main／候选 CI 已初步解除组合 checkout／gitlink 要求；候选从本组件 SHA 构建。候选／GA tag 使用 crystra-execution-v 前缀；对应新策略回归先失败再通过。
- 已移除正常 npm 发布入口，普通 Execution 依赖采用 GitHub 精确 tgz。发布工具／其余旧测试仍待完整跑通，不能认定此部分完成。

## 当前环境问题与下一步

pnpm 安装的 583 个依赖中，两个大型 macOS CLI 原生 tarball 下载失败。已用 npm 下载相同锁定版本到 `/tmp/crystra-native-cache`，逐个验证 SHA-512 与 pnpm-lock 一致，并导入专属 `/tmp/crystra-pnpm-store`。pnpm 仍未还原可选包目录，正在将原始 tarball 解包到其正确虚拟依赖目录后完成离线安装；没有创建 stub，也没有改第三方版本或放宽验证。

恢复时先确认安装实际结果及 `node_modules/.bin`，再运行全量测试、覆盖率、类型、生成一致性、静态 harness 和构建。修复实际失败后才准备 main 集成。新增 node:test 回归需要纳入 CI 的 test:inputs 入口；release-policy-current.test.mjs 可用 tsx loader 运行。

注意 `.gitignore` 同时含用户原有 `.project/` 和本任务新增 `.crystra-inputs/`，提交时只能暂存后者；其它 `.DS_Store`、project-ops.config 不属于本任务。
