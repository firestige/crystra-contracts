const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { qualify } = require('../../../release/cli/qualify.cjs');
async function fixture(t, failure = false) {
 const root = await fs.mkdtemp(path.join(os.tmpdir(), 'crystra-qualify-'));
 t.after(() => fs.rm(root, {recursive:true,force:true}));
 await fs.mkdir(path.join(root,'release/config'),{recursive:true});
 await fs.mkdir(path.join(root,'sample'));
 await fs.writeFile(path.join(root,'release/config/current-resources.json'),JSON.stringify({resources:[{id:'sample',directory:'sample'}]}));
 await fs.writeFile(path.join(root,'sample/package.json'),JSON.stringify({scripts:{test:`node -e "process.exit(${failure ? 1:0})"`,check:'node -e "process.exit(0)"'}}));
 return root;
}
test('qualification runs declared domain test and corpus commands and records actual exit results', async t => {
 const root = await fixture(t);
 const report = await qualify(root);
 assert.equal(report.status,'PASS');
 assert.deepEqual(report.commands.map(x=>[x.script,x.exitCode]),[['test',0],['check',0]]);
});
test('failed domain command rejects qualification instead of reporting PASS', async t => {
 const root = await fixture(t,true);
 await assert.rejects(()=>qualify(root), /QUALIFICATION_FAILED: sample test/);
});
test('missing domain test cannot silently qualify an empty package', async t => {
 const root = await fixture(t);
 await fs.writeFile(path.join(root,'sample/package.json'),'{}');
 await assert.rejects(()=>qualify(root), /QUALIFICATION_TEST_MISSING/);
});
