const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const repository = path.resolve(__dirname,'../..');
function checkout(t) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'crystra-evaluation-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 for(const directory of ['evaluation','observation','docs/contracts']) {
  const dest=path.join(root,directory);fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.cpSync(path.join(repository,directory),dest,{recursive:true,filter:p=>!p.includes('/publication')});
 }
 return root;
}
function check(root){return spawnSync(process.execPath,[path.join(root,'evaluation/tools/check-catalog.cjs'),path.join(root,'evaluation/examples/metric-catalog-1.0.0.json')],{encoding:'utf8'});}
test('Evaluation resolves its exact current Observation inputs without historical releases',t=>{
 const result=check(checkout(t));assert.equal(result.status,0,result.stderr);
});
test('Evaluation rejects changed current Observation input bytes',t=>{
 const root=checkout(t);fs.appendFileSync(path.join(root,'observation/registries/observation-profile-1.0.0.json'),'\n');
 const result=check(root);assert.notEqual(result.status,0);assert.match(result.stderr,/current input digest mismatch/);
});
