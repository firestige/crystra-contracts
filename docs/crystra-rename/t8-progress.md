# T8 实际安装与收尾

状态：BLOCKED，仅实际浏览器验收受 Mac 锁屏阻挡；T6 合格组合与 T7 隔离已经完成。

- 组合：crystra-v0.1.0-rc.1，远端与本地合格文件相同。
- 实际插件：~/.dsh/profiles/web 中唯一 dsh-crystra，RC2；419 个归档文件与已发布字节相同。
- 精确 CLI：`/Users/firestige/Library/Application Support/Crystra/tools/node_modules/.bin/dsh`，0.1.1-rc.2；普通 pnpm 依赖安装，无新增产品安装器，未改全局 CLI。
- 本机 better-sqlite3 构建完成。现有 DSH PID 40455、3080 端口及 LAN trustedHosts／认证配置保持原状。直接 localhost 返回 401，因此未绕过认证、未抢占当前会话。
- CUA getState 返回 Mac locked，自动解锁失败。实际浏览器 setup/doctor、工作区角色绑定及 UI 验收仍待解锁；不把隔离 Harness 的 PASS 等同于这里的验收。
- GitHub topic 读回只含 firestige/crystra-dsh。公开安装文档已更新为精确 RC；组合 #277、DSH #38 仍需正常合并。

安装日志：/tmp/crystra-t8-install-frozen.log；CLI 依赖日志：/tmp/crystra-t8-host-runtime.log；安装读回：[证据](evidence/t8-installation.json)。首次 npm exec 重复解析耗时，已停止本次进程并复用已验证 CLI 安装，随后通过 pnpm 保存固定运行时。
