# Crystra current contract distribution

The supported development entry is `node release/cli/qualify.cjs --install`. It runs every catalog resource's tests and corpus checks. `node --test test/tooling/release/*.test.cjs` exercises distribution integrity and failure cases. Node.js 24.12.0 and Python 3 are build-tool prerequisites; Python is used only for deterministic tar/gzip creation and constrained extraction.

The component owns current semantics in `docs/contracts/`. `observation/current-input-binding.json` pins the current semantic and machine inputs. Regenerate it with `npm --prefix observation run build:binding`; any input change also requires an explicit reviewed consumer binding update. Evaluation's Crystra dependency metadata now names the current input binding instead of an old publication hash and superproject gitlink. The metric definitions, coverage rules and domain revision remain unchanged.

`release/cli/release.cjs build <new-output-directory> <HEAD-SHA>` exports the exact committed tree. It rejects tracked source changes and revision mismatch; ignored and untracked files never enter the release. It emits `crystra-contracts.tgz` plus `release-metadata.json`. `verify <directory>` checks the outer digest, extracts regular files only, verifies every inner file and compares source revisions. The lower-level current-bundle API can inspect a development working tree; that use does not attest a commit.

The resource archive excludes historical `publication/` records and their unsupported generators have been removed. Historical record tests in the source checkout only check recorded identity; they do not compare current source to old release bytes. A consumer loads current schemas and validators and must establish its own runtime conformance.

Candidate creation is triggered only by a push to `release/next` with `release/request.json` containing `candidate_tag` in the form `crystra-contracts-v0.1.0-rc.1`. No superproject SHA, consumer checkout or gitlink update is needed. Qualification uses this component alone and reads back exact uploaded bytes. The archive integrity result does not itself prove runtime conformance of downstream services.

Promotion remains the separate human-triggered workflow. It uses the same qualified bytes, requires the same base version and uses the new `CRYSTRA_RELEASE_*` App configuration. Repository rename and credentials are T5 prerequisites, so the new publishing paths are not yet operational. Do not create candidates merely to debug development failures.
