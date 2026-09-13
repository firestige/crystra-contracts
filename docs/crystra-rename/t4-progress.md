# T4 初始化与服务闭环恢复记录

状态：DONE。工作基线为 DSH 独立 main `b951b9cc2c1560f33bcf1908eb5e1677adc953ff`；main CI 34762515441 成功。T4 已接入根 Host／client 和单根归档；实现提交 fece841 经 PR #34 集成；独立 CI 34764469211 成功。

## 已完成的内部模块

位置 `/Users/firestige/Projects/wsr-dsh/modules/initialization/`。

- `configuration.js`：Crystra 平台配置／状态路径、显式隔离根、严格配置字段及端口检查；首次私有 JSON 通过临时文件加独占 link 发布，避免并发覆盖用户配置。
- `service-lifecycle.js`：跨实例目录锁、PREPARING／READY／FAILED／DEGRADED、真实检查后才记录 applied、摘要身份绑定、失败可重试；doctor 不以无 applied 的其它健康服务宣称 READY。dispose 只中断进行中操作，不停止服务或删除卷。
- `service-bundle.js`：精确 GitHub 服务资源 URL、SHA-256 校验、64 MiB 下载／展开上限、拒绝链接和非法归档路径；每次独立解包，不覆盖运行中服务所用目录。普通 tar 依赖显式锁定 7.5.21。
- `compose-adapter.js`：固定命令参数、基于真实路径的独立 Compose／volume 名、现有容器归属检查、prepare 路径绑定、迁移退出码及三服务健康状态、两个真实 endpoint 的健康响应检查；显式 stop 无删卷参数。

## 已验证

17 项新增回归按失败到通过推进。覆盖平台路径、配置保护、并发准备、失败重试、摘要及归档链接拒绝、伪就绪拒绝、服务身份变化拒绝、保留卷、Compose readiness 及 `/tmp`／`/private/tmp` 真实路径归一化。

完整 suite 186/186 PASS，日志 `/tmp/crystra-dsh-t4-full.log`；之后 Compose 真实路径修正重新执行初始化模块全部 17 项 PASS。T3 的真实 DSH 浏览器和独立 CI 证据仍见 t3-progress.md；不要将 T3 的通过误写为 T4 实际初始化已完成。

## 根 Host 与真实验收（本轮新增）

- 根 `/crystra` 统一路由管理命令和 Execution；根持有一个 RPC 注册，未初始化时返回明确不可用状态，激活后委派领域 read model，避免 HTTP 405 与重复注册。
- 默认加载不要求 Execution 已配置、不启动 Docker。setup 生成私有 Execution 配置并激活内部模块；administrative command 有独立 Crystra 状态卡，拦截模型执行。
- doctor 复用 Execution 公共角色绑定校验器，针对当前会话工作区报告缺失绑定及路径；不猜测 Provider、模型或凭据。
- 增加命令取消与卸载清理；卸载保留运行中的服务、数据库卷和配置。
- service-group 模板从组合仓库提交内容复用到本插件内部 `services/`，未复制子模块脏文件或领域实现。构建器仍强制发布镜像摘要及来源；去掉 purge／旧兼容动作。
- 新包 inventory 和 source boundary 包含 initialization 模块；tar 依赖为 7.5.21。

已通过：完整真实 Host/浏览器 Workflow／Delivery／Studio 流程；空白 profile 的 doctor、setup、重复 setup 保留配置、浏览器刷新恢复，错误数 0；真实 Host 协调器加 PostgreSQL/Evidence/Evolution 的 setup、doctor、stop、保留卷、start、dispose 后仍运行。真实服务使用本机新组件 image ID，明确为 development-only；不是发布候选或多平台证据。

最新验证日志：

- `/tmp/crystra-t4-full-final.log`：全量测试。
- `/tmp/crystra-t4-full-harness-final.log`：完整真实浏览器。
- `/tmp/crystra-t4-initialization-final.log`：空白初始化、重复 setup、恢复。
- `/tmp/crystra-t4-host-services-final.log`：真实服务协调器。
- `/tmp/crystra-t4-build-final.log`、`/tmp/crystra-t4-pack-final.log`：构建／单包库存。

## 下一步（必须继续）

1. 最终 195 测试、单根打包、完整及初始化浏览器、真实服务协调器均 PASS；PR #34 已经独立 CI 通过并 squash 集成。
2. 完成 T4 台账后进入 T5。新服务组资源先发布，再把精确 URL／SHA-256 写入包内 `modules/initialization/src/service-descriptor.json`，最后汇总组合；当前缺少该描述时明确 DEGRADED，不宣称安装完成。T6 才验证正式候选、注册表和跨平台字节。
3. 发布前修复旧资格生成器无条件写 PASS；绑定实际执行回执。T5 继续仓库名、文档品牌、发布 App／GHCR 权限和组件精确坐标更新。

说明文档见 DSH `docs/initialization.md`。用户 `.gitignore` 的 `.project/`、`project-ops.config`、组合子模块与旧部署均保持不变。T4 当前新增目录、services/、根入口及 package/lock 改动由本任务创建；恢复时不要当作外部脏状态丢弃。
