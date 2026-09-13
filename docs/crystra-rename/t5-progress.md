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
