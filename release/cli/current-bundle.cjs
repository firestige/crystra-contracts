const { createHash } = require("node:crypto");
const { lstat, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, writeFile } = require("node:fs/promises");
const path = require("node:path");

const SCHEMA = "crystra.contract-bundle@1.0.0";
const CATALOG_SCHEMA = "crystra.contract-resources@1.0.0";
const EXCLUDED = new Set(["node_modules", "publication", ".git", ".DS_Store", ".gitignore"]);
const hash = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const fail = (code) => { throw new Error(code); };

function safePath(value) {
  if (typeof value !== "string" || value.length === 0 || value.includes("\\")
    || value.split("/").some((part) => !/^[A-Za-z0-9_.-]+$/.test(part) || part === "." || part === "..")) {
    fail("CONTRACT_PATH_INVALID");
  }
  return value;
}

async function regularPath(root, relative) {
  const parts = safePath(relative).split("/");
  let current = root;
  for (const part of parts) {
    current = path.join(current, part);
    if ((await lstat(current)).isSymbolicLink()) fail("CONTRACT_SYMLINK_FORBIDDEN");
  }
  return current;
}

async function walk(root, relative = "", exclude = false) {
  const result = [];
  for (const entry of (await readdir(path.join(root, relative), { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    if (exclude && EXCLUDED.has(entry.name)) continue;
    const name = relative ? `${relative}/${entry.name}` : entry.name;
    safePath(name);
    if (entry.isSymbolicLink()) fail("CONTRACT_SYMLINK_FORBIDDEN");
    if (entry.isDirectory()) result.push(...await walk(root, name, exclude));
    else if (entry.isFile()) result.push(name);
    else fail("CONTRACT_FILE_INVALID");
  }
  return result;
}

function catalogValid(catalog) {
  if (catalog?.schemaVersion !== CATALOG_SCHEMA || !Array.isArray(catalog.resources) || catalog.resources.length === 0) fail("CONTRACT_CATALOG_INVALID");
  const ids = new Set();
  const directories = new Set();
  for (const resource of catalog.resources) {
    if (!/^[a-z][a-z0-9-]*$/.test(resource?.id ?? "") || ids.has(resource.id)
      || !Array.isArray(resource.semantic) || resource.semantic.length === 0) fail("CONTRACT_CATALOG_INVALID");
    safePath(resource.directory);
    if (directories.has(resource.directory)) fail("CONTRACT_CATALOG_INVALID");
    for (const file of resource.semantic) safePath(file);
    ids.add(resource.id);
    directories.add(resource.directory);
  }
}

async function buildCurrentBundle(repository, destination, revision) {
  if (!/^[a-f0-9]{40}$/.test(revision)) fail("CONTRACT_REVISION_INVALID");
  const root = await realpath(repository);
  const output = path.resolve(destination);
  await mkdir(path.dirname(output), { recursive: true });
  const resolvedOutput = path.join(await realpath(path.dirname(output)), path.basename(output));
  if (resolvedOutput === root || resolvedOutput.startsWith(`${root}${path.sep}`)) fail("CONTRACT_OUTPUT_INSIDE_SOURCE");
  try { await lstat(output); fail("CONTRACT_OUTPUT_EXISTS"); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  const catalogPath = await regularPath(root, "release/config/current-resources.json");
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  catalogValid(catalog);
  const selected = new Set(["release/config/current-resources.json"]);
  for (const resource of catalog.resources) {
    await regularPath(root, `${resource.directory}/package.json`);
    for (const file of await walk(root, resource.directory, true)) selected.add(file);
    for (const semantic of resource.semantic) {
      try {
        const file = await regularPath(root, semantic);
        if (!(await lstat(file)).isFile()) fail("CONTRACT_SEMANTIC_MISSING");
      } catch (error) {
        if (error.code === "ENOENT") fail("CONTRACT_SEMANTIC_MISSING");
        throw error;
      }
      selected.add(semantic);
    }
  }
  const temporary = await mkdtemp(path.join(path.dirname(output), ".crystra-contracts-"));
  try {
    const files = [];
    for (const relative of [...selected].sort()) {
      const bytes = await readFile(await regularPath(root, relative));
      const target = path.join(temporary, relative);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, bytes);
      files.push({ path: relative, bytes: bytes.length, sha256: hash(bytes) });
    }
    const manifest = { schemaVersion: SCHEMA, repository: "firestige/crystra-contracts", revision, resources: catalog.resources, files };
    await writeFile(path.join(temporary, "release-metadata.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    await verifyCurrentBundle(temporary);
    await rename(temporary, output);
    return { fileCount: files.length, resourceCount: catalog.resources.length };
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

async function verifyCurrentBundle(destination) {
  const root = await realpath(destination);
  const manifest = JSON.parse(await readFile(await regularPath(root, "release-metadata.json"), "utf8"));
  if (manifest?.schemaVersion !== SCHEMA || manifest.repository !== "firestige/crystra-contracts"
    || !/^[a-f0-9]{40}$/.test(manifest.revision) || !Array.isArray(manifest.files) || manifest.files.length === 0) fail("CONTRACT_METADATA_INVALID");
  catalogValid({ schemaVersion: CATALOG_SCHEMA, resources: manifest.resources });
  const seen = new Set();
  for (const entry of manifest.files) {
    safePath(entry.path);
    if (entry.path === "release-metadata.json" || seen.has(entry.path)
      || !Number.isSafeInteger(entry.bytes) || entry.bytes < 0 || !/^sha256:[a-f0-9]{64}$/.test(entry.sha256)) fail("CONTRACT_METADATA_INVALID");
    seen.add(entry.path);
    const bytes = await readFile(await regularPath(root, entry.path));
    if (bytes.length !== entry.bytes || hash(bytes) !== entry.sha256) fail("CONTRACT_DIGEST_MISMATCH");
  }
  const actual = await walk(root);
  if (actual.length !== seen.size + 1 || actual.some((name) => name !== "release-metadata.json" && !seen.has(name))) fail("CONTRACT_FILE_SET_MISMATCH");
  const catalog = JSON.parse(await readFile(path.join(root, "release/config/current-resources.json"), "utf8"));
  catalogValid(catalog);
  if (JSON.stringify(catalog.resources) !== JSON.stringify(manifest.resources)) fail("CONTRACT_CATALOG_MISMATCH");
  for (const resource of manifest.resources) {
    for (const file of [`${resource.directory}/package.json`, ...resource.semantic]) {
      if (!seen.has(file)) fail("CONTRACT_RESOURCE_MISSING");
    }
  }
  return seen.size;
}

module.exports = { buildCurrentBundle, verifyCurrentBundle };

if (require.main === module) {
  const [command, destination, revision] = process.argv.slice(2);
  const run = async () => {
    if (!destination) fail("CONTRACT_BUNDLE_USAGE");
    if (command === "build") return buildCurrentBundle(path.resolve(__dirname, "../.."), destination, revision);
    if (command === "verify") return { fileCount: await verifyCurrentBundle(destination) };
    fail("CONTRACT_BUNDLE_USAGE");
  };
  run().then((result) => process.stdout.write(`${JSON.stringify(result)}\n`)).catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
