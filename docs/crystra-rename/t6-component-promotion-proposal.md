# T6 底层组件晋级提案

状态：WITHDRAWN（2026-09-14 用户纠正）。本文的提前 GA 执行要求已撤回，不应按下表触发发布。六组件 RC 资格证据仍有效。

当前仅推进 RC 与联调，不以 GA 为前置。以下保留旧提案作为决策历史，不能覆盖 execution-plan.md 的 C026。

原提案：本提案仅涵盖底层组件，服务、插件和最终组合尚未发布完成。

## 原因与边界

后续服务包和 dsh-crystra 的 GA 必须引用稳定的底层坐标。仓库 release-rules.md 要求 GA 不含 prerelease 制品，且晋级不得修改嵌套依赖坐标或重新构建。因此先晋级下表已核验的组件，再以稳定 URL/digest 冻结服务与插件候选，避免在上层晋级时改包。

Workflow 普通 GitHub source 发现包级 scoped tag；此次聚合 RC 已通过解包契约验证，但不等于普通来源发现已验证。Workflow 晋级产生下表三个包级稳定 Release 后，再做实际发现与执行验收。

## 精确晋级范围

各仓库在 GitHub Actions 的 `release-promote.yml`，选择 main；仅使用下列输入。由用户触发，Agent 不 dispatch。

| 仓库 | candidate_tag | final_tag 输入 | 已通过候选作业 |
|---|---|---|---|
| crystra-contracts | crystra-contracts-v0.1.0-rc.1 | crystra-contracts-v0.1.0 | [34798564767](https://github.com/firestige/crystra-contracts/actions/runs/34798564767) |
| crystra-workflow-package | crystra-workflow-package-v0.1.0-rc.1 | 无此输入，按候选元数据发布三个包 | [34800526283](https://github.com/firestige/crystra-workflow-package/actions/runs/34800526283) |
| crystra-ui | crystra-ui-v0.1.0-rc.1 | 无此输入，自动取 crystra-ui-v0.1.0 | [34800528688](https://github.com/firestige/crystra-ui/actions/runs/34800528688) |
| crystra-execution | crystra-execution-v0.1.0-rc.1 | crystra-execution-v0.1.0 | [34801187270](https://github.com/firestige/crystra-execution/actions/runs/34801187270) |
| crystra-evidence | crystra-evidence-v0.1.0-rc.1 | crystra-evidence-v0.1.0 | [34800958905](https://github.com/firestige/crystra-evidence/actions/runs/34800958905) |
| crystra-evolution | crystra-evolution-v0.1.0-rc.1 | crystra-evolution-v0.1.0 | [34800959153](https://github.com/firestige/crystra-evolution/actions/runs/34800959153) |

Workflow 目标为 `crystra-workflow-package/hello-world-workflow/v0.2.0`、`crystra-workflow-package/implementation-workflow/v0.4.12`、`crystra-workflow-package/system-design-workflow/v0.4.10`。不创建一个替代这三个包的聚合稳定版本。

## 原始字节与证据

来源提交、测试范围和临时目录见 [T6 恢复记录](t6-progress.md)。永久摘要／回执索引：

- [Contracts](evidence/t6-contracts-remote-verification.json)
- [Workflow](evidence/t6-workflow-remote-verification.json)：远端归档与本地解压 tar 字节一致，gzip OS 标记不同；只晋级远端原始字节。
- [UI](evidence/t6-ui-remote-verification.json)：tgz SHA-256 `da095799c375300900135dbdfd72497ae93079093a20b0d0629dd25996822792`。
- [Execution](evidence/t6-execution-remote-verification.json)：tgz SHA-256 `bcaa1400dd601450abe3b494474cd9b6a9e590552c8421e0784a4f5d614a3b35`，本地冻结包与远端原始字节一致。
- [Evidence](evidence/t6-evidence-remote-verification.json)：OCI `sha256:e65bb3d68e9f08862a54407dc927bf702ff32ec8845c2733cbb967970a84010b`。
- [Evolution](evidence/t6-evolution-remote-verification.json)：OCI `sha256:fdc1e3a800c2851d4b468e92b717d290a6408d3ab4d8575901d02f535ffdddb2`。

两个镜像均读回 linux/amd64、linux/arm64 与 provenance/config，源码绑定验证通过。发行过程保留同一镜像 digest，不重建。正式晋级后仍须重新下载稳定资产，核对 RC/GA 字节与 tag 提交，然后准备服务、插件、最终组合候选。

本步骤不授权或执行旧部署清理、生产切换、插件市场发布、组合 GA。

## 执行边界来源

当前适用的 [release-discipline SKILL.md](/Users/firestige/.agents/skills/release-discipline/SKILL.md) 明确要求：“Produce a proposal — what would be promoted, from which candidate, and the evidence supporting it — then **stop**.” 本文提供具体候选及证据；用户负责触发上述晋级 workflow。八仓库 App 配置授权已经完成，不需要重复授权凭据。这里的暂停仅针对正式晋级门槛，不表示需要重新批准更名方案。
