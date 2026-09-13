# Evidence Query Contract 0.1.0

English | [中文](README.zh-CN.md)

This directory contains the current machine representation of `evidence.query@0.1.0`, Observation Profile `1.0.0` and read-model revision `1.0.0`. Its registry binds local semantic companions and the exact Observation registry/schema/validator bytes inside this repository.

Registry status is `CURRENT`; the maximum claim remains `VALIDATOR_ONLY`. Schema validation does not establish runtime or cross-implementation conformance.

## Surface

- `registries/evidence-query-0.1.0.json` closes routes, enums, projection ownership, compatibility dimensions, expiry owners, policy defaults, and all exact source digests.
- `schemas/evidence-query-response-0.1.0.schema.json` closes Fact, Trace, envelope, truth, relationship, and error JSON shapes.
- `schemas/evidence-query-internal-1.0.0.schema.json` closes `SnapshotPage`, trace summaries, `ExpiryOwner`, `ExpiryRecord`, `ExpiryBatch`, and `ExpiryResult` values.
- `tools/validator.cjs` enforces cross-field semantics that JSON Schema cannot express: projection tuples, relationship endpoints, expiry compatibility order, trace aggregation, request/error classification, exact LINK identity behavior, batch selection, and canonical digest bytes.
- `fixtures/{positive,negative,recovery}` and `examples/` are the executable candidate corpus.
- `publication/publication-candidate-0.1.0.json` is the immutable qualified RC input and remains `published=false` historical evidence.
- `publication/publication-record-0.1.0.json` binds the frozen semantic companions, qualified RC, final machine inventory, all six gates, and owner approval.

## Validation

```sh
npm ci
npm test
npm run check
npm test
```

Current qualification uses `node release/cli/qualify.cjs --install` from the repository root. Historical publication records are not regenerated or used to qualify current source.

The validator reads current local input coordinates and does not expose Raw data, SQL/storage shapes, credentials, or a write interface.
