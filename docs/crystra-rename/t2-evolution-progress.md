# T2-EO 完成记录

2026-09-13。main `e22920e5463cdee94550ba248fd4343f7b6d123d` 已推送，[CI 34760877941](https://github.com/firestige/wsr-evolution/actions/runs/34760877941) 成功。

- Python 包／模块为 crystra-evolution@0.1.0／crystra_evolution，配置入口 CRYSTRA_EVOLUTION_CONFIG。领域 runtime／Metric revision 保留；无数据库驱动。
- Docker 从组件根及 `.crystra-inputs/contracts` 构建，输入 config/development-contract.json 固定 Contracts f2d373a；不再要求组合根。
- 新配置回归先失败后通过。191 测试全部通过，包括原先缺少组合目录会跳过的两个真实归档／异步校验用例；无跳过。Ruff／格式／mypy 通过。
- wheel／sdist 位于 `/tmp/crystra-evolution-dev-20260913`。镜像 `crystra-evolution-dev:20260913` 构建通过；一次性容器内健康检查及内置真实 Contract 校验 PASS，容器退出清理。日志 `/tmp/crystra-evolution-{unit-final,docker,smoke,build}.log`。
- 候选绑定组件 SHA 与相同来源的工具，qualification／provenance authority 改为组件本身；保留双平台、镜像摘要、SBOM、人工稳定晋升。新 tag crystra-evolution-v0.1.0-rc.1；未发布。
- .gitignore 只提交 .crystra-inputs/；用户 .project/ 与其它原有文件保留未提交。
