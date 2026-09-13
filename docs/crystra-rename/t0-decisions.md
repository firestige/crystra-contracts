# T0：命名、分发与安装闭环决策

日期：2026-09-13。执行入口：[execution-plan.md](execution-plan.md)。本文落定实施输入，不记录平行任务状态。

## 检查结果

- 在线刷新 8 个 main，均与分析基线一致；本地 Execution main 仍落后 6 提交，进入该组件实施前只做保留现有修改的 fast-forward。
- 8 个旧仓库当前账号都有 admin／push 权限；对应新目标仓库名均返回 404，未发现占用，T5 切换前仍需重查。
- dsh-crystra、crystra-execution、crystra-ui-core 及抽查的 @crystra 契约包返回 npm 404；这不证明名称归属。当前 npm whoami 不可用，因此首轮不把 npm 发布设为前置。
- 7 个组件存在旧 release App secret 和变量键；主仓库没有列出 Actions secrets／variables。读的是名称，未导出 secret 值。T5 须配置实际新发布权限；现有键存在不代表新流程已可发布。
- 本机发现 WSR macOS 配置／state、Linux 风格 credentials 目录，以及多组旧 WSR 容器／卷，部分仍运行；T7 需逐项确认归属。只扫描了 DSH profile 根依赖清单，未发现旧包不等于所有 profile 已无旧注册。

证据：[坐标与权限](evidence/t0-coordinate-check.json)、[旧部署只读盘点](evidence/t0-local-deployment-inventory.json)。没有停服务、安装或删除。

## A. 命名和分发

1. 8 个仓库采用 naming-map 中的 crystra／crystra-* 名称，唯一插件仓库 crystra-dsh、唯一公开插件包 dsh-crystra。
2. Execution 与 UI 是普通依赖，分别命名 crystra-execution、crystra-ui-core；Contracts 的 @crystra/* 保持 private:true，不要求创建 npm scope。Python distributions/modules 使用 crystra-*／crystra_*。
3. 首轮正式分发使用 GitHub Release 上预构建的精确 tgz、wheel／sdist、契约资源与服务组合资产；镜像使用新 GHCR 坐标。插件通过 DSH 安装精确 tgz URL。可发现仓库的注册不等于用户必须从源码构建。
4. 新包的普通依赖固定到新制品 URL或已构建入包的静态 UI 产物，不依赖尚不存在的 npm 包，也不读取旧 WSR 制品。第三方依赖继续用其原本 registry。
5. 新发行 epoch 的组件版本从 0.1.0 起步，之后各自独立演进。为不碰撞已有旧 tag，GitHub tag 使用 `<新仓库名>-v<version>[-rc.N]`，例如 crystra-contracts-v0.1.0-rc.1、crystra-dsh-v0.1.0-rc.1、crystra-v0.1.0-rc.1。这是发布方案，尚未 bump、打 tag 或发布。
6. 契约 revision／DSL／API 版本不随组件发行 epoch 重置；只在必要的品牌 namespace 上变更。新 publication 不伪装成旧版本审批或复用旧 digest。
7. 无品牌的领域 CLI／字段／协议保持现意；不要全局替换 agentops、Workflow、Delivery 等技术词。Schema 新命名使用 urn:crystra:* 或新仓库地址，不假设拥有 crystra.dev。

## B. 安装职责拆解

| 当前实现／职责 | 处理 | 新负责者 |
|---|---|---|
| bin/wsr.mjs 的二级安装、dshMode 选择 | 移除公开入口与三模式 | DSH plugin add/remove 管唯一插件 |
| published-adapters 的 dshAdapter 安装、启动／停止 DSH、root 包维护 | 不迁入插件，避免宿主管理自身 | DSH 本身 |
| platform-paths 的平台目录、global-config 的校验 | 复用后改为插件自己的配置格式；去除 installation.dshMode | crystra-dsh 内部 bootstrap/config |
| setup 中 Execution 配置、role binding、host endpoints 生成 | 复用成模块，分开各配置 schema；新目录 .crystra | crystra-dsh 内部初始化 |
| servicesAdapter 的精确下载、digest 校验、Compose 准备 | 复用；命令固定、输出限界、进度可见 | crystra-dsh 内部 services 模块 |
| Compose templates、数据库角色初始化 | 按服务职责维护，组合发布选择；不重新设计数据库 | Evidence 服务与组合发布资源 |
| operations 的原子写入、操作日志与幂等恢复 | 只保留新服务准备所需部分；不复制整个旧产品命令矩阵 | 插件内部服务生命周期 |
| compatibility-manifest 与 version-facts 的精确版本校验 | 保留目标与已应用状态的区分，采用新 bundle 格式 | 组合制品 + 插件读取层 |
| workflowAdapter 的 Source 配置 | 生成默认 Source；精确解析／绑定仍由 Execution 拥有 | 插件配置 + Execution |
| providerAdapter 的前置检查 | 显示能力／登录缺失，不读取模型凭据或替用户认证 | 插件诊断 + 既有 Provider |
| installation-maintenance 的旧根识别、旧 patch 扫描／cleanup | 不迁入新产品 | T7 此次人工清理 |
| fixture-adapter、发布 qualification／build-bundle | 留在开发／发布验证；不成为用户安装入口 | 各组件 CI + crystra 组合验证 |

不公开发布 @crystra/product-operations 安装器，也不要求全局 crystra 安装 CLI。若复用其逻辑，放在插件内部普通模块；是否抽内部库由实际重复使用决定，不另造对外组件。

## C. 单插件初始化与服务就绪

- DSH patch 装配 init／execution／studio 等内部模块；每个模块自己的 config/inject/disposer 正确保留。
- 首次加载只做轻量检测、配置创建与状态呈现，不在宿主启动路径同步拉镜像或等待数据库。
- 用户在 Crystra 的设置／状态入口完成首次服务准备；提供显式 ` /crystra setup `、` /crystra doctor `、` /crystra services start|stop|status ` 操作作为首轮可测试入口，UI 可以调用同一内部接口。命令是确定性处理，不交给 LLM 解释执行。
- 初始状态：NEEDS_CONFIGURATION → PREPARING → READY；执行已可用而分析服务未就绪时显示 DEGRADED；可恢复故障显示 FAILED 与具体重试动作。状态来自真实检查，不由模型判断。
- Execution／UI 普通依赖由插件包闭包提供；外部 Provider 授权仍使用既有宿主／Provider 入口。可配置模型和角色路由；缺失必要绑定时报告配置错误，不选取不明旧配置。
- 首轮后台服务沿用 Docker Compose（PostgreSQL／migrate／Evidence／Evolution），Docker 可用性作为前置检测，不自动安装系统 Docker。不额外要求宿主安装 Python；Python 位于服务镜像中。
- 插件包携带或精确绑定服务版本描述及 digest；完整产品组合清单由组合仓库在插件制品之后汇总，避免“插件依赖尚未发布的包含自身的组合清单”循环。服务组资源先产出，插件绑定它，最终组合再绑定插件和服务组。
- 下载核实摘要后再启用；配置／状态原子写入。失败重试绑定同一描述，不偷偷换 latest；并发 setup 需要防重入。首次重操作完成后才写 applied 状态。
- DSH 停止／插件卸载时解除自身 timer、RPC、hook 与 UI；普通卸载不删除数据库卷和用户配置。服务如继续运行，状态界面与文档明确告知并提供显式停止操作，不让 dispose 在后台执行数据删除。
- 升级使用 DSH 插件管理；跨版本服务格式不兼容必须明确报告，不能自动套用旧 WSR 或建立跨品牌迁移器。

## D. 配置与路径

- 默认 macOS 根 `~/Library/Application Support/Crystra`；Linux XDG config/state 对应 crystra；Windows APPDATA／LOCALAPPDATA 对应 Crystra。插件可显式配置独立 state root 供隔离验收。
- 新插件配置字段：stateRoot（可选）、execution（绑定／配置文件入口）、services（Compose 设置与就绪状态配置）；Studio 从统一内部服务描述得到 endpoint，不再要求用户选择 execution/studio/suite。
- `services` 的用户配置只覆盖允许的端口／路径等参数，不允许静默覆盖发布镜像 digest。实际 JSON schema 由 T4 实现并验证。
- 工作区角色绑定使用 `.crystra/role-provider-bindings.json`。不自动读取 `.wsr`。
- runtime/service 日志和数据库密码保留在本地私有目录；公开文档只记录缺失项和路径职责，不暴露凭据内容。

## E. 文档与生成输入归属

| 输入 | 归属 |
|---|---|
| 当前 docs/contracts/**、契约生成与 conformance 规范 | crystra-contracts |
| Execution 系统／Runner 设计与源码约束 | crystra-execution |
| Evidence 服务／投影／保留配置 | crystra-evidence |
| Evolution 计算接口与实现约束 | crystra-evolution |
| UI 组件／交互实现文档 | crystra-ui；DSH 装配／安装文档在 crystra-dsh |
| Workflow 当前定义、资源与作者说明 | crystra-workflow-package |
| 产品入口、组合清单、组合安装验收与发布说明 | crystra |

跨域概念仅保留必要的产品概览；组件校验不能隐式爬到主仓库目录。已冻结历史 publication 可留作历史，不再作为新发布资产集；新的自包含资源必须真实生成与验证。

## T0 退出核对

命名／权限路径已检查；缺少 npm 身份通过 GitHub 制品分发方案解除。新 App／GHCR 实际发布绑定在 T5 检查，不能因当前 admin=true 就宣称发布已就绪。T0 不要求先建立尚未更名仓库的发布绑定。

安装职责、就绪流程、普通卸载、服务绑定、文档归属和旧部署盘点已落定，可进入 T1。具体代码结构和自动化测试在所属实施任务中落实；本附件不声称功能已经完成。
