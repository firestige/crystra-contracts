# T2-EV 完成记录

2026-09-13。main `3345e82fd6aaed6fa9fbf83071dc04ec5bd04ab6` 已推送，[CI 34760537286](https://github.com/firestige/wsr-evidence/actions/runs/34760537286) 全部成功，包括 Python 3.13／3.14、质量构建、PostgreSQL 与容器。

- `crystra-evidence@0.1.0`、`crystra_evidence` 模块、CRYSTRA_EVIDENCE_*、DB 用户及容器身份已改名，PostgreSQL 架构／领域 revision 保留。
- 新配置回归先失败后通过；164 单元／发布测试、Ruff、格式和 mypy 通过。第三方 uv.lock 坐标／摘要不变。
- 新隔离 PostgreSQL：16 项集成测试通过；容器部署、OTLP、保留期及备份恢复完整脚本 exit 0；测试资源已清理，旧 WSR 资源未动。
- 新 wheel／sdist `/tmp/crystra-evidence-dev-20260913` 构建成功；独立 `/tmp/crystra-evidence-consumer-20260913` 安装 wheel 并导入配置 PASS。
- 候选改用组件 github.sha、精确 Contracts f2d373a 的当前 Evidence Query binding、tests／corpus；不再读取组合 manifest／历史 publication。保留 OCI provenance、双平台、精确 RC 重读和人工 GA。未发布候选。
- 日志位于 `/tmp/crystra-evidence-{unit-final,integration,deployment,build,consumer}.log`。原有 .gitignore 的 .project/、.DS_Store、project-ops.config 均保留未提交。

后续 T5 实配新仓库和 App；最终组合及实际部署仍按 T6–T8 完成。
