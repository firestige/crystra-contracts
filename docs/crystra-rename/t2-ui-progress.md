# T2-UI 完成记录

日期：2026-09-13。独立 main 提交 `482f6f175052bf770efbbbfe0b8ef54a6c365c45`，已推送。

- 组件名 `crystra-ui`，普通依赖 `crystra-ui-core@0.1.0`；不是 DSH 插件。
- 包身份、CSS 前缀、导出符号、当前资源与测试引用已统一；main CI 已启用。
- 候选构建不再依赖组合仓库 pin；tag 为 `crystra-ui-v0.1.0-rc.N`。分发采用 GitHub 精确 tgz，删除独立 npm 发布步骤；新 App 配置待 T5。
- 包身份回归先失败再通过；383 项组件测试、34 项脚本测试、26 项浏览器测试通过。格式、lint、类型、构建、依赖清单、React 18 隔离消费和 Docker 代理烟测通过。
- Docker 干净安装曾捕获批量替换误改第三方完整性值；已从原锁文件恢复第三方条目，仅改本项目名称，并逐项核对第三方元数据完全一致。重新干净安装及 Docker 验证通过。
- [真实 main CI](https://github.com/firestige/wsr-ui/actions/runs/34758649497)的 verify 与 docker-build 两项均成功。
- 本地 dev tgz `/tmp/crystra-ui-dev-D2vP6H/crystra-ui-core-0.1.0.tgz`，配套 release 元数据与摘要通过 `release/cli/release.mjs verify`。该目录只是本地验证输出，不是已发布 RC。
- 原有 `.gitignore` 的 `.project/` 改动及未跟踪配置保持原样，未提交；历史 benchmark evidence 未改写。

T2-UI 已 DONE，后续从执行台账恢复。T3 需要更新 DSH 消费者的 `crystra-ui-core` 导入、`.crystra-bi` 及改名导出符号，不保留旧 WSR 别名。
