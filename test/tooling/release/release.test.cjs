const assert = require('node:assert/strict');
const { mkdtemp, readFile, writeFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { assertConfiguration, buildReleaseAssets, verifyReleaseAssets, validateRequest } = require('../../../release/cli/release.cjs');
const root = path.resolve(__dirname, '../../..');
test('release adapter distributes current resources with no historic publication dependency', async () => {
 const config = JSON.parse(await readFile(path.join(root,'release/config/component.json')));
 assert.doesNotThrow(()=>assertConfiguration(config));
 assert.equal(config.assetMode,'current-contract-resources');
 assert.equal(config.repository,'firestige/crystra-contracts');
});
test('release assets reproduce exactly and reject altered archive bytes', async t => {
 const temporary = await mkdtemp(path.join(tmpdir(),'crystra-assets-'));
 t.after(()=>rm(temporary,{recursive:true,force:true}));
 const first=path.join(temporary,'first'), second=path.join(temporary,'second');
 await buildReleaseAssets(root,first,'a'.repeat(40));
 await buildReleaseAssets(root,second,'a'.repeat(40));
 const meta=JSON.parse(await readFile(path.join(first,'release-metadata.json')));
 assert.equal(meta.schemaVersion,'crystra.contract-release@1.0.0');
 assert.equal(meta.revision,'a'.repeat(40));
 assert.deepEqual(await readFile(path.join(first,meta.artifact.name)),await readFile(path.join(second,meta.artifact.name)));
 assert.ok((await verifyReleaseAssets(first)).fileCount>100);
 await writeFile(path.join(first,'release-metadata.json'),JSON.stringify({...meta,revision:'b'.repeat(40)}));
 await assert.rejects(()=>verifyReleaseAssets(first),/RELEASE_REVISION_MISMATCH/);
 await writeFile(path.join(first,'release-metadata.json'),JSON.stringify(meta));
 await writeFile(path.join(first,meta.artifact.name),'changed');
 await assert.rejects(()=>verifyReleaseAssets(first),/RELEASE_ARTIFACT_DIGEST_MISMATCH/);
});
test('release request accepts only the new component RC coordinate',()=>{
 assert.equal(validateRequest({candidate_tag:'crystra-contracts-v0.1.0-rc.1'}),'crystra-contracts-v0.1.0-rc.1');
 for(const value of [{candidate_tag:'evidence-query-0.1.0-rc.1'},{candidate_tag:'crystra-contracts-v0.1.0'},{candidate_tag:'x\nkey=value'},{candidate_tag:'crystra-contracts-v0.1.0-rc.1',authority_ref:'a'.repeat(40)}]) assert.throws(()=>validateRequest(value),/RELEASE_REQUEST_INVALID/);
});
test('qualification and candidate workflows use only this component; promotion keeps the human entry point', async()=>{
 const ci=await readFile(path.join(root,'.github/workflows/ci.yml'),'utf8');
 const candidate=await readFile(path.join(root,'.github/workflows/release-candidate.yml'),'utf8');
 const promote=await readFile(path.join(root,'.github/workflows/release-promote.yml'),'utf8');
 for(const workflow of [ci,candidate]) {
  assert.equal(workflow.includes('repository: firestige/workflow-self-recursive'),false);
  assert.equal(workflow.includes('path: system-contracts'),false);
  assert.ok(workflow.includes('node release/cli/qualify.cjs --install'));
 }
 assert.ok(candidate.includes('push:'));
 assert.equal(candidate.includes('workflow_dispatch:'),false);
 assert.equal(candidate.includes('RELEASE_APP_PRIVATE_KEY'),false);
 assert.ok(promote.includes('workflow_dispatch:'));
 assert.equal(promote.includes('\n  push:'),false);
 assert.ok(promote.includes('CRYSTRA_RELEASE_APP_PRIVATE_KEY'));
 assert.ok(promote.includes('repositories: crystra-contracts'));
});

test('archive extraction rejects traversal and links even when an outer digest matches', async t => {
 const {execFileSync} = require('node:child_process');
 const {createHash} = require('node:crypto');
 const temporary = await mkdtemp(path.join(tmpdir(),'crystra-unsafe-'));
 t.after(()=>rm(temporary,{recursive:true,force:true}));
 const file=path.join(temporary,'crystra-contracts.tgz');
 for(const kind of ['traversal','symlink']) {
  execFileSync('python3',['-c',`import io,sys,tarfile
with tarfile.open(sys.argv[1],'w:gz') as t:
 i=tarfile.TarInfo('../escape' if sys.argv[2]=='traversal' else 'link')
 if sys.argv[2]=='symlink':
  i.type=tarfile.SYMTYPE
  i.linkname='../escape'
 t.addfile(i,io.BytesIO(b''))`,file,kind]);
  const bytes=await readFile(file);
  await writeFile(path.join(temporary,'release-metadata.json'),JSON.stringify({schemaVersion:'crystra.contract-release@1.0.0',repository:'firestige/crystra-contracts',revision:'a'.repeat(40),artifact:{name:'crystra-contracts.tgz',bytes:bytes.length,sha256:'sha256:'+createHash('sha256').update(bytes).digest('hex')}}));
  await assert.rejects(()=>verifyReleaseAssets(temporary),/RELEASE_ARCHIVE_MEMBER_INVALID/);
 }
});
