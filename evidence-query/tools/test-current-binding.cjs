const assert = require('node:assert/strict');
const test = require('node:test');
const { mkdtempSync, mkdirSync, cpSync, rmSync, appendFileSync, unlinkSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { verifyManifestBinding } = require('./validator.cjs');
const repository = join(__dirname, '../..');
function isolated(t) {
  const root = mkdtempSync(join(tmpdir(), 'crystra-query-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const relative of ['docs/contracts/evidence-query', 'observation']) {
    mkdirSync(join(root, relative, '..'), { recursive: true });
    cpSync(join(repository, relative), join(root, relative), { recursive: true, filter: p => !p.includes('node_modules') });
  }
  return root;
}
test('current binding validates in an isolated repository without old publication or parent manifest', t => {
  assert.deepEqual(verifyManifestBinding(isolated(t)), { valid: true, errors: [] });
});
test('current binding rejects changed semantic bytes and upstream machine bytes', t => {
  for (const relative of ['docs/contracts/evidence-query/evidence-query.md', 'docs/contracts/evidence-query/evidence-query.zh-CN.md', 'observation/tools/validator.cjs']) {
    const root = isolated(t);
    appendFileSync(join(root, relative), '\nchanged\n');
    const result = verifyManifestBinding(root);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(error => error.includes(relative)), result.errors.join('\n'));
  }
});
test('current binding reports missing inputs without falling back to another checkout', t => {
  const root = isolated(t);
  unlinkSync(join(root, 'observation/schemas/observation-record-1.0.0.schema.json'));
  assert.equal(verifyManifestBinding(root).valid, false);
});
