# 单插件与安装入口：LoopX 对照补充

日期：2026-09-13。只读检查，未安装 LoopX，未修改产品实现。基于 LoopX main `6b337bcbde8457bc3268ec7d2780367ace3c6147` 的官方 README、package.json、cordis.patch.yml、init-command.ts 和 managed-runtime.ts。

## 结论

建议取消面向 DSH 用户的独立 Crystra 安装器入口，由 DSH 安装 dsh-crystra，插件负责首次初始化和诊断修复。用户已确认优先取消独立安装器；按此默认方案实施，具体服务就绪机制先在 T0 落定。不能把“取消独立安装入口”理解成删掉全部安装、服务管理和组合校验代码。

同时纠正原报告的一项过度约束：一个公开插件包、一个注册仓库，不要求只有一个内部 Cordis／Loader 行、apply 或浏览器模块。保持内部 init／execution／studio 模块是可选的低改动方案；它们全部由 dsh-crystra 的 patch 装配，不单独发布和安装。生命周期必须正确，但不必为了一个包把所有生命周期代码手工压成一个函数。

## LoopX 官方安装方式

官方推荐安装预构建 GitHub Release tgz：

```bash
dsh plugin --profile web add \
  "https://github.com/huangruiteng/loopx/releases/download/dsh-loopx-plugin-v0.1.1-beta.5/dsh-loopx-plugin-0.1.1-beta.5.tgz"
```

上述版本是本次官方 README 的固定安装示例，未额外下载或验证该 Release 资产。网上目录的通用根仓库安装命令不是本次推荐依据。

首次启动 DSH 时，init 模块检查兼容的 LoopX CLI；需要安装时使用 Python 3.11+ 与 pip，将 CLI 安装到 `$DSH_AGENTS_HOME/runtime/dsh-loopx-plugin`（默认 `~/.agents/runtime/dsh-loopx-plugin`），然后安装 Skills。初始化失败会报告诊断，保留 `/loopx-init` 修复入口，不要求普通用户预先单独安装 LoopX。

运行时源码使用 `pip install --upgrade --target ... loopx>=0.5.4`；这是最低版本策略，不是我们已经采用的精确制品绑定。Crystra 可借鉴安装体验，继续使用自己的精确组合版本与摘要策略。

源码开发另有 install.sh 负责构建、打包、调用 DSH 安装，不是普通用户必走的独立安装产品。卸载 DSH 插件会移除插件功能，但保留 CLI、Skills 和状态，清理由独立步骤处理。

README 开头称三个 Loader 行；当前 patch 实际包含 Host、init、driver 和默认关闭的 observer 四个自有行，以及对宿主启动依赖的补充。准确结论是“一个包承载多个内部模块”，不是固定三行。

来源：[官方安装与 bootstrap 文档](https://github.com/huangruiteng/loopx/blob/6b337bcbde8457bc3268ec7d2780367ace3c6147/packages/dsh-loopx-plugin/README.md)、[实际 Cordis patch](https://github.com/huangruiteng/loopx/blob/6b337bcbde8457bc3268ec7d2780367ace3c6147/packages/dsh-loopx-plugin/cordis.patch.yml)、[初始化实现](https://github.com/huangruiteng/loopx/blob/6b337bcbde8457bc3268ec7d2780367ace3c6147/packages/dsh-loopx-plugin/src/init-command.ts)、[私有运行时解析](https://github.com/huangruiteng/loopx/blob/6b337bcbde8457bc3268ec7d2780367ace3c6147/packages/dsh-loopx-plugin/src/managed-runtime.ts)。

## Crystra 仍需承担的职责

| 工作 | 建议归属 |
|---|---|
| 插件包安装、更新、移除 | DSH 自身插件管理 |
| Execution／UI 普通依赖 | dsh-crystra 的精确包依赖与构建分发 |
| 配置、状态目录、首次检查 | 插件内部 bootstrap，可提供修复／诊断命令 |
| PostgreSQL、Evidence、Evolution | 插件引导的本地服务准备与管理，或连接用户已配置服务；部署方式待定 |
| 精确可用组合、制品摘要 | crystra 组合仓库与发布流水线 |
| 旧 WSR 脏数据 | 本次更名中人工盘点、备份、校验、隔离；不开发清理工具 |

当前 Compose 仍包含 PostgreSQL、数据库初始化／迁移、Evidence 和 Evolution 服务。仅合并 npm 插件不会让这些服务变成 npm 依赖，也不会自动取消 Docker／Python 等前置条件。若要完全取消外部服务，这是另一个架构决策，不能作为更名的隐含改动。

建议安装旅程：DSH 安装唯一插件 → 插件完成轻量配置与依赖检查 → 界面显示就绪／缺失项 → 首次配置所需服务 → 使用。首次拉镜像、初始化数据库等重操作应有可见进度和明确状态，不阻塞整个 DSH 启动；后台分析服务故障只降级相关功能。无需再要求用户先安装独立 product-operations CLI，再用它安装 DSH 插件。

该方案会减少安装选择和公开 CLI 工作，但保留必要的初始化、服务生命周期和诊断工作。是否淘汰 @crystra/product-operations 的独立分发，还是将其逻辑保留为内部库，待安装旅程确定后选择。

## 补充：旧数据隔离在范围内

用户已明确要求至少先打包隔离，并确认只需在此次更名中人工清理，不需要程序化。实施工作包应包含：按归属盘点旧配置／状态／下载缓存／DSH 旧插件与 patch／容器卷；停止相关写入或使用数据库一致性备份；记录原位置、归属和摘要；校验备份；将旧内容移出有效路径。隔离档案不输入 Crystra，不用于旧制品升级迁移。

共享 profile 中其它插件、归属不明资源、用户工作文件以及主仓库子模块未提交变化不自动清理。远端历史 Release 清理另列；本轮没有执行打包、停服务或删除。此工作应在首次本地 Crystra 验收之前完成。

最新实施顺序见 [实施计划](implementation-plan.md)。
