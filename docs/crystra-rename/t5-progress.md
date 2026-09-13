# T5 当前坐标切换恢复记录

执行状态以 execution-plan.md 为准。

## 已完成

- 八个远端仓库更名且仓库 ID 不变，完整映射见 repository-renames.json；各独立 checkout 与原组合 checkout 的 origin 已更新。本地目录尚未移动。
- Execution main `0a708b59250cccda43ff6054000cb3af380d6906`：新 Workflow tag 坐标；736 测试与构建通过；CI [34765185802](https://github.com/firestige/crystra-execution/actions/runs/34765185802) 成功。
- Evolution main `984a0dcf2d9388812136b789b5d0bc487c146d56`：新 tag、移除旧聚合制品回退；191 测试、ruff、mypy 通过；CI [34765190604](https://github.com/firestige/crystra-evolution/actions/runs/34765190604) 成功。
- Workflow main `2fc61f057ca712deacfed504f70601ed916c0fb3`：发行新 tag；CI [34765195685](https://github.com/firestige/crystra-workflow-package/actions/runs/34765195685) 成功。
- 组合仓库在 `/tmp/crystra-combination-stage` 的 `codex/crystra-combination` 工作树处理；基线 `3fc8aef3142bda61f63174ad9998c41c4b42c4bb`。原工作树及其子模块内容不改动。

## 正在处理

- DSH T4 main `5f8b9a1b0b1536630896bb861f32002466c939b7` 源码与 CI 已通过，但提交遗漏生成的 lib/client.js。正确生成物在当前工作树，下一 PR 必须提交；已增加 CI 生成后 git diff 检查。没有已发布制品受影响。
- DSH 开发输入仍需从旧 cd7f178 重建为 Execution 0a708b5；不得把现有开发 tgz 当成新候选。
- Contracts 当前 README、Evidence 当前契约 URL、DSH 当前 README／晶体图标待提交。
- 各组件未跟踪 project-ops.config 只更新 requirements.repository 为 firestige/crystra，保留未跟踪状态与其它内容；用户 .gitignore、.DS_Store 保留。
- 组合仓库当前品牌、独立安装器退出、发布流程、精确 gitlink 仍待实施；历史发布记录不迁移。

## 发布权限的局部阻塞

自动审批拒绝将现有发布 App 私钥复制为八仓库 CRYSTRA_RELEASE_APP_PRIVATE_KEY，以及补充必要 App 安装范围。已向用户提出明确授权问题，尚未收到答复；没有执行复制、写变量或修改安装范围。不得在未获答复时重试或绕过。密钥内容不写入台账。继续不涉及凭据的代码与文档工作。

T6 尚未发布候选。T7 尚未清理任何真实旧部署。

## 本轮追加进展

- Contracts 文档 main `d304bcb` 已推送；Evidence 坐标 main `84bb315` 已推送。
- 八仓库当前 GitHub 描述、首页与 Topics 已更新并读回，见 repository-discovery.json。仅 crystra-dsh 保留 dsh-plugin Topic，Execution 不再宣传 Intake 安装。
- DSH [PR #35](https://github.com/firestige/crystra-dsh/pull/35) 已合并，main `208c13d0643abbf849afb142e9c04e4ddf0c621b`；CI 34765769523 成功。Execution 新归档 SHA-256 `cba51e9253a0622c7a316f4e06520318853f40ee59c3a537b22975882e4a1262`，生成客户端已提交且 CI 核对一致。
- 发现发布资格生成器无条件写 PASS，已先复现再修复。DSH [PR #36](https://github.com/firestige/crystra-dsh/pull/36)，分支 codex/crystra-release-evidence，提交 a19023f：要求候选绑定的执行日志与 receipts，缺少服务描述或远端摘要不符时阻断；198 测试通过。本地同一精确归档的 clean profile、真实 Chrome Harness 通过，日志 /tmp/crystra-t5-exact-profile.log 与 /tmp/crystra-t5-exact-harness.log。此为开发夹具验证，不是远端发布候选证据。
- 组合 [PR #271](https://github.com/firestige/crystra/pull/271)：新产品定位、中英文 README／入门入口、gitlink 精确选择与两个品牌挂载名。27322b46 初始提交的治理 CI 通过；旧 Iter3 聚合构建仍引用 wsr-dsh 而失败，314c362b 已换为组合专属治理及发行规则验证，42 个本地发布测试通过，等待新 CI。原组合子模块内容未修改。
- 尚未完成：组合旧安装器与旧发布器退出／新组合发行流程、组件当前设计文档归属收尾、插件候选最终服务绑定、发布凭据权限和 T6–T8。没有发布或清理旧部署。


### C018：已合并与待审核的精确边界

- DSH PR #36 已合并，main `fb8225b5607acdf8e352a22c4cb161b626b63e52`；CI 34766423951 成功。独立 checkout 已同步 main。
- 组合 PR #271 **尚未合并**：head `314c362ba35e4fa5d517e93fac207b583d66807f`，qualify CI 34766463982 与 release-governance CI 34766463937 均通过。正常 squash 被 GitHub 返回 REVIEW_REQUIRED 阻止。
- main 规则集 22282000 要求 1 个批准、Code Owner 审核与最后推送批准；未使用 --admin、未修改规则。后续代码可以准备，合并需要满足这个真实审核门槛。
- 组合后续开发在 `/tmp/crystra-combination-stage` 的 `codex/crystra-combination-publisher`，该分支是 PR #271 的 314c362b 基础，**不是 origin/main**。不要误恢复到仍为 3fc8aef3 的 origin/main 丢掉坐标变更。
- 新组合校验器与构建器正在准备：scripts/lib/combination-release.mjs、scripts/build-combination-candidate.mjs、scripts/release-combination.test.mjs；3 个新测试通过。新增 qualification/service-release 私有工具，准备验证精确候选服务归档；尚未用新远端镜像执行，也未替换当前发布 workflows／删除旧安装器，不能宣称发布器已完成。
- 两个局部阻塞：发布私钥复制／App 安装范围等待明确授权；组合 PR 等待符合仓库规则的审核。独立准备继续，没有请求或执行管理员绕过。


### 草稿已持久化

- 后续工具已提交 `9569df79` 并推送，[Draft PR #272](https://github.com/firestige/crystra/pull/272) 的 base 是 codex/crystra-combination（PR #271），不是 main。工作树干净；源代码、固定工具 lock 与说明均已保存。
- 全量组合发布测试 46/46 通过，日志 `/tmp/crystra-t5-combination-publisher-full.log`；服务源重建夹具在两个独立输出目录产生相同 tar.gz 字节，并拒绝摘要被替换和脏源码输入。夹具未拉取镜像。
- PR #272 仍是草稿：尚未替换 .github/workflows/release-candidate.yml、release-compose-bundle.yml，尚未删除 product-operations 或 deployment 旧发行入口，尚未实施组合端的完整资格与晋升检查。后续不得把当前构建脚本直接接到无资格门槛的发布动作。
- 已向用户提出 PR #271 具体审核／管理员合并授权问题；未获答复前不使用 --admin。发布私钥的明确授权问题同样待答复。
- PR #271 合并后，先读回真实 merge SHA，再将 #272 的新提交从 314c362b 基础协调到 main；不要 reset 原组合工作树或把组件脏内容一起带入。
