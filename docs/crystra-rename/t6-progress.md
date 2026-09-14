# T6 新制品资格恢复记录

状态：IN_PROGRESS。发行配置已经完成，见 release-configuration.json。GA 仍由人决定；本阶段不清理旧部署。

| 对象 | 状态 | 证据／下一步 |
|---|---|---|
| Contracts | RC 远端验证 PASS | crystra-contracts-v0.1.0-rc.1；来源 13adf4df2a5abb755cf583f2c10972584e63eec3；239 个文件 |
| Execution、UI、Workflow、Evidence、Evolution | 待各自新候选资格 | 冻结独立 main 的精确制品，先验证本地输入，再进入候选分支；不消费旧 WSR 资产 |
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
