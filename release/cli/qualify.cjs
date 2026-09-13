const { readFile } = require('node:fs/promises');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

async function qualify(repository, { install = false } = {}) {
  const catalog = JSON.parse(await readFile(path.join(repository, 'release/config/current-resources.json'), 'utf8'));
  if (!Array.isArray(catalog.resources) || !catalog.resources.length) throw new Error('QUALIFICATION_CATALOG_INVALID');
  const commands = [];
  for (const resource of catalog.resources) {
    if (!/^[a-z][a-z0-9-]*$/.test(resource.directory)) throw new Error('QUALIFICATION_DIRECTORY_INVALID');
    const cwd = path.join(repository, resource.directory);
    const pkg = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
    if (!pkg.scripts?.test) throw new Error(`QUALIFICATION_TEST_MISSING: ${resource.id}`);
    const run = (script, args) => {
      const result = spawnSync('npm', args, { cwd, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024 });
      if (result.error || result.status !== 0) throw new Error(`QUALIFICATION_FAILED: ${resource.id} ${script}\n${result.error || ''}\n${result.stdout || ''}\n${result.stderr || ''}`);
      commands.push({ resource: resource.id, script, exitCode: result.status });
    };
    if (install && (pkg.dependencies || pkg.devDependencies)) run('ci', ['ci', '--ignore-scripts', '--no-audit', '--no-fund']);
    for (const script of ['build:binding', 'test', 'check', 'check:minimal', 'test:corpus', 'check:example']) {
      if (pkg.scripts[script]) run(script, ['run', script]);
    }
  }
  return { schemaVersion: 'crystra.contract-qualification@1.0.0', status: 'PASS', commands };
}
module.exports = { qualify };
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--install')) throw new Error('QUALIFICATION_USAGE');
  qualify(path.resolve(__dirname, '../..'), { install: args.includes('--install') })
    .then(result => process.stdout.write(JSON.stringify(result, null, 2) + '\n'))
    .catch(error => { process.stderr.write(error.message + '\n'); process.exitCode = 1; });
}
