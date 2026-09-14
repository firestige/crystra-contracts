# T8 实际安装与收尾

状态：IN_PROGRESS。Mac 已解锁；实际 setup、doctor 和 Studio 读取已验证，继续任务联调。

- 组合：crystra-v0.1.0-rc.1，远端与本地合格文件相同。
- 实际插件：~/.dsh/profiles/web 中唯一 dsh-crystra，RC2；419 个归档文件与已发布字节相同。
- 精确 CLI：`/Users/firestige/Library/Application Support/Crystra/tools/node_modules/.bin/dsh`，0.1.1-rc.2；普通 pnpm 依赖安装，无新增产品安装器，未改全局 CLI。
- 本机 better-sqlite3 构建完成。现有 DSH PID 40455、3080 端口及 LAN trustedHosts／认证配置保持原状。直接 localhost 返回 401，因此未绕过认证、未抢占当前会话。
- CUA getState 返回 Mac locked，自动解锁失败。实际浏览器 setup/doctor、工作区角色绑定及 UI 验收仍待解锁；不把隔离 Harness 的 PASS 等同于这里的验收。
- GitHub topic 读回只含 firestige/crystra-dsh。公开安装文档已更新为精确 RC；组合 #277、DSH #38 仍需正常合并。

安装日志：/tmp/crystra-t8-install-frozen.log；CLI 依赖日志：/tmp/crystra-t8-host-runtime.log；安装读回：[证据](evidence/t8-installation.json)。首次 npm exec 重复解析耗时，已停止本次进程并复用已验证 CLI 安装，随后通过 pnpm 保存固定运行时。

## 解锁后实际验收

固定 DSH 0.1.1-rc.2 在 http://127.0.0.1:3081 启动，DSH_HOME 为 `~/Library/Application Support/Crystra/acceptance-dsh`，profile 的 node_modules 链接到已核验的实际安装。旧 3080 进程保持运行，未重启。

浏览器插件列表确认 crystra 已挂载。通过正常 API 创建 `/tmp/crystra-rc-acceptance-workspace` 后，在浏览器发送 `/crystra setup`，实际启动 namespace `crystra_services_d2951050567f` 三个健康容器。setup 与 doctor 均准确报告 `CRYSTRA_ROLE_BINDINGS_REQUIRED`；这不是 READY 或真实 LLM 执行通过。Studio 可打开并从真实 Evidence 读取空任务列表。继续重放 T6 确定性 provider fixture 至实际服务，验证 UI；不改用户认证。

实际服务重放已完成执行、Facts、Trace 和 12 指标评估。浏览器验证任务列表、100% terminal outcome、Evidence 下钻及精确 Trace `aed6fbb2d3ce5d2a902c74af06f89bb8`（324 ms）。Workflow AVAILABLE 断言失败：容器直查 GitHub 发布 API 返回 HTTP 403、remaining=0，约 08:51 UTC 恢复；属于外部匿名额度限制。待恢复后只重验已有任务评估，不重复生成任务，不扩大凭据访问。证据：[实际 UI 验收](evidence/t8-ui-acceptance.json)。

## 验收纠正

当前界面验证仅覆盖旧页面的更名后运行。用户指出的新 UI 和路由接入缺失已确认，见 [缺口分析](t8-ui-integration-gap.md)。T8 尚未完成；限流不是新 UI 未生效的原因。
