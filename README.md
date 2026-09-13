# Crystra Contracts

English | [中文](README.zh-CN.md)

Crystra turns repeatable workflow decisions into deterministic execution, aiming to use fewer agents and fewer LLM calls. This repository owns the shared, technology-neutral contracts and their executable validation tools. It does not implement the runtime services or claim production conformance for them.

Components evolve on their own `main`. The Crystra combination repository publishes verified exact component combinations; it is not a prerequisite checkout for developing these contracts.

## Development

Use a standalone checkout. The repository is `firestige/crystra-contracts`.

```sh
node release/cli/qualify.cjs --install
node --test test/tooling/release/*.test.cjs
```

Qualification runs all 11 resource groups and their declared corpus checks. Missing local semantic inputs fail qualification. Package names use the private `@crystra` scope; this does not imply public npm availability. Domain protocol revisions retain their meanings independently of distribution versions.

## Current resources

The explicit inventory is [current-resources.json](release/config/current-resources.json). Normative English semantics and Chinese companions live under [docs/contracts](docs/contracts/). Modules contain schemas, registries, examples and validators for Workflow, Observation, Evaluation, Evidence Query, Delivery Admission and task/provider bindings. Candidate major versions remain candidates.

The new [current bundle tool](release/cli/current-bundle.cjs) collects current inputs and verifies their exact bytes. Historical `publication/` records are excluded and do not qualify current source. Old publication generators are not part of the supported development commands. Artifact integrity is distinct from successful domain validation or release approval.

See the [execution plan](docs/crystra-rename/execution-plan.md) for rename state, remaining release integration work and recovery instructions.
