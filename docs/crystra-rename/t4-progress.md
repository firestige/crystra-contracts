# T4 初始化与服务闭环恢复记录

状态：IN_PROGRESS。工作基线为 DSH 独立 main `b951b9cc2c1560f33bcf1908eb5e1677adc953ff`；main CI 34762515441 成功。以下 T4 改动尚未提交，也尚未接入根插件运行路径。

## 已完成的内部模块

位置 `/Users/firestige/Projects/wsr-dsh/modules/initialization/`。

- `configuration.js`：Crystra 平台配置／状态路径、显式隔离根、严格配置字段及端口检查；首次私有 JSON 通过临时文件加独占 link 发布，避免并发覆盖用户配置。
- `service-lifecycle.js`：跨实例目录锁、PREPARING／READY／FAILED／DEGRADED、真实检查后才记录 applied、摘要身份绑定、失败可重试；doctor 不以无 applied 的其它健康服务宣称 READY。dispose 只中断进行中操作，不停止服务或删除卷。
- `service-bundle.js`：精确 GitHub 服务资源 URL、SHA-256 校验、64 MiB 下载／展开上限、拒绝链接和非法归档路径；每次独立解包，不覆盖运行中服务所用目录。普通 tar 依赖显式锁定 7.5.21。
- `compose-adapter.js`：固定命令参数、基于真实路径的独立 Compose／volume 名、现有容器归属检查、prepare 路径绑定、迁移退出码及三服务健康状态、两个真实 endpoint 的健康响应检查；显式 stop 无删卷参数。

## 已验证

17 项新增回归按失败到通过推进。覆盖平台路径、配置保护、并发准备、失败重试、摘要及归档链接拒绝、伪就绪拒绝、服务身份变化拒绝、保留卷、Compose readiness 及 `/tmp`／`/private/tmp` 真实路径归一化。

完整 suite 186/186 PASS，日志 `/tmp/crystra-dsh-t4-full.log`；之后 Compose 真实路径修正重新执行初始化模块全部 17 项 PASS。T3 的真实 DSH 浏览器和独立 CI 证据仍见 t3-progress.md；不要将 T3 的通过误写为 T4 实际初始化已完成。

## 下一步（必须继续）

1. 将初始化接入根 plugin；默认加载只做轻量配置／状态，不要求 Execution 配置已存在，不启动 Docker。
2. 根统一 `/crystra` 命令分派 setup／doctor／services start|stop|status，再委派原 Execution 命令；避免双重命令注册，保留取消及 dispose。
3. 复用当前 Execution 配置生成职责；缺少角色／Provider 绑定必须可诊断，不猜测凭据或迁移旧 .wsr。
4. 接入新服务组描述／资源、包装器、配置生成与真实空白 profile 服务验证。当前 Compose adapter 只完成可执行单元测试，还没有使用新服务组跑真实 Docker；不能标 T4 DONE。
5. 将 initialization 目录加入实际 package inventory／source boundary，补齐 Host 首次加载、重载、失败重试和卸载验证；经 PR 集成受保护 main。
6. 发布前修复旧资格生成器无条件写 PASS；绑定实际执行回执。T5 新 URL／权限与 T6 新候选尚未开始。

用户 `.gitignore` 的 `.project/`、`project-ops.config` 与旧部署均保持不变。T4 当前新增目录和 package/lock 改动由本任务创建；恢复时不要当作外部脏状态丢弃。
