# Crystra Contracts

[English](README.md) | 中文

Crystra 将可重复的工作流决策固化为确定性执行，目标是用更少的 agent 和 LLM 调用做好 workflow。本仓库负责共享的、技术中立的契约及其可执行验证工具，不实现运行时服务，也不替服务宣称生产符合性。

组件在各自的 `main` 演进。Crystra 组合仓库只发布已验证的精确组件组合，开发本仓库不需要检出组合仓库。

## 开发

使用独立 checkout。目标仓库为 `firestige/crystra-contracts`；统一更名前仍使用现有的 `firestige/wsr-contracts` 地址。

```sh
node release/cli/qualify.cjs --install
node --test test/tooling/release/*.test.cjs
```

资格验证覆盖 11 组资源及其语料检查；缺少本地语义输入会失败。包名采用 private 的 `@crystra` scope，不表示已公开到 npm。领域协议修订与分发版本分别管理。

## 当前资源

明确清单见 [current-resources.json](release/config/current-resources.json)。英文规范及中文配套文档位于 [docs/contracts](docs/contracts/)。各模块提供 Workflow、Observation、Evaluation、Evidence Query、Delivery Admission 和 Task／Provider Binding 的 schema、registry、示例与验证器；候选主版本继续保持候选身份。

新的[打包工具](release/cli/current-bundle.cjs)收集当前输入并验证精确字节。历史 `publication/` 记录不进入新资源包，也不再用于证明当前源码通过。旧发布记录生成器不属于支持的开发命令。制品完整性、领域验证通过和发布批准是不同证据。

更名状态、尚未完成的发布集成和恢复步骤见[执行计划](docs/crystra-rename/execution-plan.md)。
