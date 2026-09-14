# T6 发布凭据配置的待授权操作

状态：用户于 2026-09-14 明确授权，配置已完成。执行后证据见 [release-configuration.json](release-configuration.json)；执行前只读结果见 [release-readiness.json](release-readiness.json)。这份清单不含 secret 值。

八个目标仓库：firestige/crystra、crystra-contracts、crystra-execution、crystra-evidence、crystra-evolution、crystra-ui、crystra-workflow-package、crystra-dsh。

- 八仓库均缺少 CRYSTRA_RELEASE_CLIENT_ID 与 CRYSTRA_RELEASE_APP_PRIVATE_KEY。
- 七个组件仓库仍有 WSR_RELEASE_CLIENT_ID、WSR_RELEASE_APP_ID 和 WSR_RELEASE_APP_PRIVATE_KEY；组合仓库没有对应配置。
- 新发布 workflow 已改用 CRYSTRA_RELEASE_CLIENT_ID 与 CRYSTRA_RELEASE_APP_PRIVATE_KEY。仓库更名和 PR 合并不会自动补齐这两个输入。

## 已授权操作范围

1. 使用既有发行 App（wsr-release）的本地凭据，仅为上述八仓库配置 CRYSTRA_RELEASE_CLIENT_ID 与 CRYSTRA_RELEASE_APP_PRIVATE_KEY；不写入源码、文档、日志或公共制品。
2. 核对现有发行 App 的安装清单；若八仓库中有未被选中的仓库，仅补入缺失的项目仓库，保留原有其他授权项。不扩大为全部仓库、不增加 App 全局权限。
3. 只读回配置名称、更新时间、App 所选仓库和权限，不读回或打印 secret 值。原 WSR 配置暂保留到新路径验证结束，避免在资格验证前删除现有凭据入口。

此前自动审批拒绝的操作现已获得用户单独明确授权。用户要求优先复用已有资产，并自行将发行 App 改名为 crystra-release；App ID 4716644、Client ID Iv23liIS3BZCeQOUWhDX 均不变。复用原本地私钥配置八仓库；现有安装已包含全部目标仓库，所以未修改安装范围或全局权限。

八仓库的新 Client ID 变量值均已与现有 App 核对；Secret 上传成功并读回名称和更新时间。GitHub 不返回 Secret 明文，未宣称读回了加密值。旧 WSR 配置保持原样。

这不授权人工 GA、生产切换或旧部署清理。完成配置后按计划推进 T6 新候选资格；T7 仍须以通过的新制品作为前置条件。
