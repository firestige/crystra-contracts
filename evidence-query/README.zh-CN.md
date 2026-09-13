# Evidence Query 契约 0.1.0

[English](README.md) | 中文

本目录维护 `evidence.query@0.1.0`、Observation Profile `1.0.0` 和 read-model revision `1.0.0` 的当前机器表示。Registry 精确绑定本仓库中的语义文档及 Observation registry/schema/validator 字节。

Registry 状态为 `CURRENT`，最大 claim 仍为 `VALIDATOR_ONLY`。Schema 验证不构成运行时或跨实现符合性证明。

## Surface

- `registries/evidence-query-0.1.0.json` closed routes、enum、projection ownership、compatibility dimension、expiry owner、policy default 与 exact source digest。
- `schemas/evidence-query-response-0.1.0.schema.json` closed Fact、Trace、envelope、truth、relationship 与 error JSON shape。
- `schemas/evidence-query-internal-1.0.0.schema.json` closed `SnapshotPage`、trace summary、`ExpiryOwner`、`ExpiryRecord`、`ExpiryBatch` 与 `ExpiryResult`。
- `tools/validator.cjs` 检查 JSON Schema 无法表达的 projection tuple、relationship endpoint、expiry compatibility order、trace aggregation、request/error classification、LINK identity、batch selection 与 canonical digest bytes。
- `fixtures/{positive,negative,recovery}` 与 `examples/` 是 executable candidate corpus。
- `publication/publication-candidate-0.1.0.json` 是 immutable qualified RC input，并作为 `published=false` 的历史证据保留。
- `publication/publication-record-0.1.0.json` 绑定 frozen semantic companion、qualified RC、最终 machine inventory、全部六项 gate 与 owner approval。

## 验证

```sh
npm ci
npm test
npm run check
npm test
```

从仓库根目录运行 `node release/cli/qualify.cjs --install` 完成当前资格验证；历史发布记录不重新生成，也不用于证明当前源码通过。

Validator 读取当前本地输入坐标；不暴露 Raw data、SQL/storage shape、credential 或 write interface。
