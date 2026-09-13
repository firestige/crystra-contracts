const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { mkdir, mkdtemp, readFile, readdir, rm, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { buildCurrentBundle, verifyCurrentBundle } = require('./current-bundle.cjs');
const sha256 = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const ARCHIVE = 'crystra-contracts.tgz';
const REPOSITORY = 'firestige/crystra-contracts';
const fail = code => { throw new Error(code); };
function archive(command, source, destination) {
  execFileSync('python3', [path.join(__dirname,'archive.py'),command,source,destination], {stdio:'pipe'});
}
function assertConfiguration(config) {
  if (config?.schemaVersion !== 'crystra.release-component@1.0.0' || config.repository !== REPOSITORY
    || config.assetMode !== 'current-contract-resources' || config.releaseBranch !== 'main'
    || config.triggerBranch !== 'release/next' || config.publisherAdapter !== 'current-contracts+github-release'
    || config.stablePolicy !== 'qualified-candidate-exact-assets') fail('RELEASE_CONFIGURATION_INVALID');
}
function validateRequest(request) {
  if (!request || Object.keys(request).join(',') !== 'candidate_tag'
    || !/^crystra-contracts-v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)-rc\.[1-9][0-9]*$/.test(request.candidate_tag)) fail('RELEASE_REQUEST_INVALID');
  return request.candidate_tag;
}
async function buildReleaseAssets(repository, destination, revision) {
  const temporary = await mkdtemp(path.join(tmpdir(),'crystra-release-'));
  try {
    const bundle = path.join(temporary,'bundle');
    await buildCurrentBundle(repository,bundle,revision);
    await mkdir(destination); // Existing output is never overwritten.
    archive('pack',bundle,path.join(destination,ARCHIVE));
    const bytes = await readFile(path.join(destination,ARCHIVE));
    const metadata = {schemaVersion:'crystra.contract-release@1.0.0',repository:REPOSITORY,revision,artifact:{name:ARCHIVE,bytes:bytes.length,sha256:sha256(bytes)}};
    await writeFile(path.join(destination,'release-metadata.json'),JSON.stringify(metadata,null,2)+'\n');
    return await verifyReleaseAssets(destination);
  } finally { await rm(temporary,{recursive:true,force:true}); }
}
async function verifyReleaseAssets(destination) {
  const metadata = JSON.parse(await readFile(path.join(destination,'release-metadata.json'),'utf8'));
  const artifact = metadata.artifact;
  if (metadata.schemaVersion !== 'crystra.contract-release@1.0.0' || metadata.repository !== REPOSITORY
    || !/^[a-f0-9]{40}$/.test(metadata.revision) || artifact?.name !== ARCHIVE
    || !Number.isSafeInteger(artifact.bytes) || artifact.bytes < 1 || !/^sha256:[a-f0-9]{64}$/.test(artifact.sha256)) fail('RELEASE_METADATA_INVALID');
  const names = await readdir(destination);
  if (names.some(name=> ![ARCHIVE,'release-metadata.json','release-qualification.json'].includes(name))) fail('RELEASE_ARTIFACT_SET_INVALID');
  const bytes = await readFile(path.join(destination,ARCHIVE));
  if (bytes.length !== artifact.bytes || sha256(bytes) !== artifact.sha256) fail('RELEASE_ARTIFACT_DIGEST_MISMATCH');
  const temporary = await mkdtemp(path.join(tmpdir(),'crystra-verify-'));
  try {
    const bundle = path.join(temporary,'bundle');
    archive('unpack',path.resolve(destination,ARCHIVE),bundle);
    const fileCount = await verifyCurrentBundle(bundle);
    const inner = JSON.parse(await readFile(path.join(bundle,'release-metadata.json'),'utf8'));
    if (inner.revision !== metadata.revision) fail('RELEASE_REVISION_MISMATCH');
    return {fileCount,revision:metadata.revision,artifactSha256:artifact.sha256};
  } finally { await rm(temporary,{recursive:true,force:true}); }
}
async function run() {
  const [command,destination,revision] = process.argv.slice(2);
  const root = path.resolve(__dirname,'../..');
  if (command === 'config') { assertConfiguration(JSON.parse(await readFile(path.join(root,'release/config/component.json'),'utf8'))); return {status:'PASS'}; }
  if (command === 'request') return {candidate_tag:validateRequest(JSON.parse(await readFile(path.join(root,'release/request.json'),'utf8')))};
  if (command === 'verify' && destination) return verifyReleaseAssets(path.resolve(destination));
  if (command === 'build' && destination && revision) {
    // Release builds use the committed tree, not ignored/untracked files in the checkout.
    if (execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim() !== revision) fail('RELEASE_SOURCE_REVISION_MISMATCH');
    execFileSync('git',['diff','--exit-code','HEAD','--'],{cwd:root,stdio:'pipe'});
    const temp = await mkdtemp(path.join(tmpdir(),'crystra-source-'));
    try {
      const sourceArchive = path.join(temp,'source.tar');
      execFileSync('git',['archive','--format=tar',`--output=${sourceArchive}`,revision],{cwd:root,stdio:'pipe'});
      // git archive includes directory entries; extract our trusted local git tree with git's tar consumer.
      const source = path.join(temp,'source');
      await mkdir(source);
      execFileSync('tar',['-xf',sourceArchive,'-C',source],{stdio:'pipe'});
      return await buildReleaseAssets(source,path.resolve(destination),revision);
    } finally { await rm(temp,{recursive:true,force:true}); }
  }
  fail('RELEASE_CLI_USAGE_INVALID');
}
module.exports = {assertConfiguration,buildReleaseAssets,verifyReleaseAssets,validateRequest};
if (require.main === module) run().then(value=>process.stdout.write(JSON.stringify(value)+'\n')).catch(error=>{process.stderr.write(error.message+'\n');process.exitCode=1;});
