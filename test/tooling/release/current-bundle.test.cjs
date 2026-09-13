const assert = require("node:assert/strict");
const { mkdtemp, mkdir, readFile, writeFile, rm, symlink } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { buildCurrentBundle, verifyCurrentBundle } = require("../../../release/cli/current-bundle.cjs");

async function fixture(t) {
  const parent = await mkdtemp(path.join(tmpdir(), "crystra-contracts-"));
  t.after(() => rm(parent, { recursive: true, force: true }));
  const root = path.join(parent, "standalone");
  const output = path.join(parent, "bundle");
  for (const dir of ["release/config", "docs/contracts", "workflow-dsl/schemas", "workflow-dsl/publication"]) {
    await mkdir(path.join(root, dir), { recursive: true });
  }
  await writeFile(path.join(root, "release/config/current-resources.json"), JSON.stringify({
    schemaVersion: "crystra.contract-resources@1.0.0",
    resources: [{ id: "workflow-dsl", directory: "workflow-dsl", semantic: ["docs/contracts/workflow.md"] }],
  }));
  await writeFile(path.join(root, "workflow-dsl/package.json"), JSON.stringify({ name: "@crystra/workflow-dsl-contract", private: true }));
  await writeFile(path.join(root, "workflow-dsl/schemas/workflow.json"), '{"type":"object"}\n');
  await writeFile(path.join(root, "docs/contracts/workflow.md"), "# Workflow contract\n");
  await writeFile(path.join(root, "workflow-dsl/publication/old.json"), '{"status":"PUBLISHED"}');
  return { root, output };
}

test("exports current schemas and local semantics without old publication or sibling repositories", async (t) => {
  const { root, output } = await fixture(t);
  await buildCurrentBundle(root, output, "a".repeat(40));
  const manifest = JSON.parse(await readFile(path.join(output, "release-metadata.json")));
  assert.equal(manifest.schemaVersion, "crystra.contract-bundle@1.0.0");
  assert.equal(manifest.repository, "firestige/crystra-contracts");
  assert.equal(manifest.revision, "a".repeat(40));
  assert.ok(manifest.files.some((entry) => entry.path === "workflow-dsl/schemas/workflow.json"));
  assert.ok(manifest.files.some((entry) => entry.path === "docs/contracts/workflow.md"));
  assert.equal(manifest.files.some((entry) => entry.path.includes("publication/")), false);
  assert.equal(JSON.stringify(manifest).includes('"status":"PASS"'), false);
  assert.equal(await verifyCurrentBundle(output), manifest.files.length);
});

test("missing semantic input fails before a bundle becomes available", async (t) => {
  const { root, output } = await fixture(t);
  await rm(path.join(root, "docs/contracts/workflow.md"));
  await assert.rejects(buildCurrentBundle(root, output, "a".repeat(40)), /CONTRACT_SEMANTIC_MISSING/);
  await assert.rejects(readFile(path.join(output, "release-metadata.json")), { code: "ENOENT" });
});

test("verification rejects modified or extra resource bytes", async (t) => {
  const { root, output } = await fixture(t);
  await buildCurrentBundle(root, output, "a".repeat(40));
  const schema = path.join(output, "workflow-dsl/schemas/workflow.json");
  const original = await readFile(schema);
  await writeFile(schema, "tampered");
  await assert.rejects(verifyCurrentBundle(output), /CONTRACT_DIGEST_MISMATCH/);
  await writeFile(schema, original);
  await writeFile(path.join(output, "workflow-dsl/extra.json"), "{}");
  await assert.rejects(verifyCurrentBundle(output), /CONTRACT_FILE_SET_MISMATCH/);
});

test("untrusted inventory paths cannot read outside the bundle", async (t) => {
  const { root, output } = await fixture(t);
  await buildCurrentBundle(root, output, "a".repeat(40));
  const file = path.join(output, "release-metadata.json");
  const manifest = JSON.parse(await readFile(file));
  manifest.files[0].path = "../outside";
  await writeFile(file, JSON.stringify(manifest));
  await assert.rejects(verifyCurrentBundle(output), /CONTRACT_PATH_INVALID/);
});

test("resources cannot smuggle symlinks", async (t) => {
  const { root, output } = await fixture(t);
  await symlink(path.join(root, "docs/contracts/workflow.md"), path.join(root, "workflow-dsl/leak"));
  await assert.rejects(buildCurrentBundle(root, output, "a".repeat(40)), /CONTRACT_SYMLINK_FORBIDDEN/);
});

test("build refuses an existing output and a destination inside its source", async (t) => {
  const { root, output } = await fixture(t);
  await mkdir(output);
  await writeFile(path.join(output, "keep"), "user file");
  await assert.rejects(buildCurrentBundle(root, output, "a".repeat(40)), /CONTRACT_OUTPUT_EXISTS/);
  assert.equal(await readFile(path.join(output, "keep"), "utf8"), "user file");
  await assert.rejects(buildCurrentBundle(root, path.join(root, "new-output"), "a".repeat(40)), /CONTRACT_OUTPUT_INSIDE_SOURCE/);
});
