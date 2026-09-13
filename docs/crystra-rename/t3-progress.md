# T3 单插件合并执行记录

状态：DONE，2026-09-13。DSH 基线 main `117b54cc2711b303bb63b278836ea2c1174f3d34`；实现提交 `044301d`；main 受保护拒绝直接推送，已创建 [PR #33](https://github.com/firestige/wsr-dsh/pull/33)，独立 CI 34762427482 成功；已 squash 合并为 main `b951b9cc2c1560f33bcf1908eb5e1677adc953ff`。

## 已实施

根包统一为 `dsh-crystra@0.1.0`；Execution／Studio 移入 `modules/`，删除独立插件清单、patch 与 bundle，以及 suite 包。根 Host／client 组合两个内部模块，保留 Cordis 生命周期；根 patch 仅注册一个插件。市场清单仅保留此包和目标仓库 `firestige/crystra-dsh`。

Execution 与 UI 为普通依赖，开发期使用 `config/development-inputs.json` 中精确 main 提交和 tgz SHA-256。独立源码重建脚本及 main CI 已接入；不使用旧发布资产或组合工作树。当前 file 依赖不能发布，候选构建器明确拒绝；T5／T6 用新组件精确 GitHub Release URL 替换。

单客户端输出外置 React／ReactDOM，保留固定 DSH Workspace 组合及许可。新 RC 命名空间 `crystra-dsh-v<version>-rc.N`；删除独立 npm 发布脚本／promotion npm 阶段。README 与边界文档说明真实开发状态，不宣称新制品已发布。

## 验证与当前诊断

- 根工具测试 37/37 PASS，根身份回归已先失败后通过，单根归档 inventory PASS。
- 临时 DSH profile 的 clean-profile、lifecycle（add/reload/remove/reinstall/preserveState）、provider-routing 已通过，日志 `/tmp/crystra-dsh-{clean-profile,lifecycle,provider-routing}.log`。
- 真实 Harness 已走通 Host、Delivery、Studio 和时间轴。旧验收查找已移除的可见标题及英文按钮名，与当前 UI 中文可访问名称不符；已对照 UI 源码修正，继续跑完整浏览器流程。日志 `/tmp/crystra-dsh-real-harness.log`。完整流程 PASS，浏览器错误 0；终态 fixture 流程也 PASS，日志 `/tmp/crystra-dsh-terminal-harness.log`。
- 完整测试 169/169 PASS；精确组件归档重建两项 PASS。Execution 的新编译 CLI 默认权限为 0644，而登记归档为 0755；构建前按 package bin 声明归一化权限后 SHA 完全一致。，日志 `/tmp/crystra-dsh-full-final.log`、`/tmp/crystra-dsh-input-rebuild.log`。
- 主机全局 DSH 为 0.1.5-rc.1；资格验证显式使用 `/Users/firestige/Projects/wsr-execution/node_modules/.bin/dsh` 的 0.1.1-rc.2，不改变用户全局安装。

## 恢复与后续

1. PR #33 已合并，CI 成功；以上本地验证已全部完成。
2. 当前从独立 DSH main b951b9c 开始 T4；保护用户 `.gitignore` 的 `.project/`、`project-ops.config`、`.DS_Store`。
3. T4 实现首次 setup／doctor／services；当前根 apply 仍要求 Execution 配置，尚不是默认可直接启用的最终安装闭环。
4. T5／T6 更新坐标、候选工作流和 profile 输入下载。旧 `write-release-qualification.mjs` 无条件写 PASS 必须在发布前改为真实执行证据；当前未运行发布资格写入、未发候选。

旧部署、旧数据和组合仓库子模块均未改动。T7 仍须在 T6 完成后执行一次性备份、校验、隔离和清理。
