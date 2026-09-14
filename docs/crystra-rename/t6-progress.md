# T6 新制品资格恢复记录

状态：IN_PROGRESS。发行配置已经完成，见 release-configuration.json。GA 仍由人决定；本阶段不清理旧部署。

| 对象 | 状态 | 证据／下一步 |
|---|---|---|
| Contracts | RC 远端验证 PASS | crystra-contracts-v0.1.0-rc.1；来源 13adf4df2a5abb755cf583f2c10972584e63eec3；239 个文件 |
| Workflow | RC 下载重放 PASS | 34800526283；3 包、12 资产；普通运行时 scoped tag 发现尚未验收 |
| UI | RC 下载验证 PASS | 34800528688；本地与远端 tgz、元数据、说明逐字节一致 |
| Evidence | 远端资格 PASS | 34800958905；数据库集成与备份恢复通过 |
| Evolution | 远端资格 PASS | 34800959153；191 测试与本地容器 healthz 通过 |
| Execution | 远端资格 PASS | 34801187270；736 测试及覆盖率、类型、构建、生成物、Harness、制品验证通过 |
| 服务归档 | 待组件镜像 | 必须具备双平台精确镜像摘要，执行真实 Compose 生命周期资格 |
| dsh-crystra | 待依赖与服务资源 | 固定已发布的 Execution/UI 依赖和 service-descriptor，资格实际打包的插件 |
| 最终组合 | 待以上各项 | 核对组件、服务、插件字节与原始资格回执；空白环境验收后才能进入 T7 |

## Contracts 精确证据

- 干净克隆：/tmp/crystra-contracts-t6；源码为已合并 main 13adf4df2a5abb755cf583f2c10972584e63eec3。
- 本地领域资格：25 项命令均 exitCode 0；发行工具测试 14/14，通过后才冻结资产。
- 本地资产：/tmp/crystra-contracts-t6-local-assets；下载资产：/tmp/crystra-contracts-t6-remote-assets。
- 归档：crystra-contracts.tgz；SHA-256 9aef1649fe1554e2be090c7911b29bbf93a8305ec377435d4c1e0823d119f0bd。
- [候选 workflow 34798564767](https://github.com/firestige/crystra-contracts/actions/runs/34798564767) 成功；仅通过 release/next 推送触发，无 workflow_dispatch。
- [RC 发布](https://github.com/firestige/crystra-contracts/releases/tag/crystra-contracts-v0.1.0-rc.1) 的归档与 release-metadata.json 已下载并逐字节匹配本地冻结集。重新解包验证 239 个文件成功。
- release-qualification.json 的 tag、commit、元数据 SHA-256、全部本地命令和远端 PASS 已核对。
- 持久化证据：[本地资格](evidence/t6-contracts-local-qualification.json)、[冻结元数据](evidence/t6-contracts-local-metadata.json)、[远端核验](evidence/t6-contracts-remote-verification.json)。临时目录缺失时从精确 RC 重新下载，不能以当前 main 重建替代。

release/next 此前指向旧 evidence-query 历史，快进预检拒绝。确认旧提交保留在远端稳定 tag 后，以精确 lease 从 dc8a50e92eebfc35bd706579ff2bf5e9beb57782 切换至上述源码提交。旧 tag 和资产未修改。

## C025 组件候选波次（2026-09-14）

以下均为独立 main 克隆，原组合子模块未修改。Contracts 固定输入 f2d373a 与已发布 13adf4d 的资源比较仅 Evaluation 中两份 README 链接改变，未改变 schema、validator 或语义文档。

| 组件 | 精确提交 | 资格目录 |
|---|---|---|
| Workflow | 2fc61f057ca712deacfed504f70601ed916c0fb3 | /tmp/crystra-workflow-package-t6 |
| UI | 482f6f175052bf770efbbbfe0b8ef54a6c365c45 | /tmp/crystra-ui-t6 |
| Execution | 0a708b59250cccda43ff6054000cb3af380d6906 | /tmp/crystra-t6-components/execution |
| Evidence | 84bb3152162dee4d448f4c8227f34a686af008d6 | /tmp/crystra-evidence-t6 |
| Evolution | 984a0dcf2d9388812136b789b5d0bc487c146d56 | /tmp/crystra-evolution-t6 |

Workflow 三包 DSL、发行测试与 CLI 检查通过后本地打包。远端 RC 已重新下载并通过 `release.cjs qualify`。macOS 与 Linux gzip 第 10 字节 OS 标记不同（19/3），解压后的 tar 完全相同；因此不宣称跨平台压缩包摘要相同。后续晋级仅使用远端已核验原始字节及其对应 descriptor/provenance。摘要与回执见 [Workflow 下载核验](evidence/t6-workflow-remote-verification.json)。普通 Execution GitHub source 消费包级 scoped tag，当前聚合候选 tag 的发现不在上述验证范围；最终组合仍需解决并验证这一分发步骤。

UI 本地 format/lint/type/test/package/react18/deps、26 浏览器测试和 Docker smoke 均通过。远端全部本地冻结文件逐字节一致，含 tgz SHA-256 da095799c375300900135dbdfd72497ae93079093a20b0d0629dd25996822792；[UI 下载核验](evidence/t6-ui-remote-verification.json)。

Evidence make check、Query 契约、16 项 PostgreSQL 集成和部署备份恢复通过。外部 Contracts 克隆按 CI 布局放在 /tmp/crystra-evidence-contracts-t6，避免 Ruff 扫描非本仓库 Python。测试容器及卷由自身脚本清理，未操作旧部署。

Evolution make check 的 191 测试、wheel/sdist 与带精确 revision 的本地镜像构建通过，镜像 sha256:394d8492e21caa8fc263d2f9bf91a9b26743344c0b456152c676e60cf89d6d14，实际容器 healthz 通过。该检查不等于连接真实 Evidence 完成领域计算；双平台远端镜像及组合联调仍待完成。

Execution 本机 native npm 下载失败后，确认锁文件相同，以只读 reflink 复制原组件已安装依赖到临时目录。pnpm 本地运行设置 verify-deps-before-run=false 避免迁移缓存路径自动重装；没有改动锁文件、源码、测试或远端安装步骤。最初临时目录过浅使 Harness workspace 覆盖状态目录，触发 CONFIG_PATH_OUT_OF_SCOPE；移至上表独立目录后交互测试通过。全量覆盖率 736 测试通过，行覆盖率 95.13%；类型、构建、生成物检查及 static/feasibility Harness、发行包验证均通过。曾遗漏 Harness phase 的调用失败仅属命令错误，已按 CI 的两个明确 phase 重跑。

Workflow/UI/Evidence 的旧 release/next 在精确 lease 替换前保存在各仓库 codex/crystra-pre-rename-release-next；Evolution 新建候选分支。所有推送使用单仓库短期 bot token，已撤销；未修改旧 tag，未触发 GA。源 main 均未修改。

Evidence/Evolution 候选均已成功，随后重新下载资产并从 GHCR 读取精确 digest 的 manifest/provenance/image config，验证两平台及源码绑定通过。Evidence wheel/sdist 与元数据摘要通过；[Evidence 证据](evidence/t6-evidence-remote-verification.json)、[Evolution 证据](evidence/t6-evolution-remote-verification.json)。Execution 候选作业 34801187270，独立 test:full 最终 736/736 通过后才推送。

本地完整日志位置与摘要见 [日志索引](evidence/t6-component-local-log-index.json)。目标稳定 tag 与 Release 已逐个只读检查，2026-09-14 均未占用。下一阶段边界见 [底层晋级提案](t6-component-promotion-proposal.md)。

Execution 34801187270 已成功，重新下载后制品验证通过，tgz、publication、metadata、notes 全部与本地冻结文件逐字节一致；回执源码／tag／元数据摘要与 PASS 绑定核验通过，见 [Execution 证据](evidence/t6-execution-remote-verification.json)。六个底层组件 RC 完成，进入已写明范围的人工晋级门槛；服务、插件、组合与 T7/T8 尚未完成。
