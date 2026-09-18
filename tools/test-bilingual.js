'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { checkPairs, mapTerms } = require('./build-bilingual');
const terms = { categories: { Parent: { ca: 'Pare' }, Child: { ca: 'Fill' }, Other: { ca: 'Altre' } } };
assert.deepEqual(mapTerms([['Parent', 'Child'], ['Other']], 'categories', terms), [['Pare', 'Fill'], ['Altre']]);
assert.throws(() => mapTerms('Missing', 'categories', terms), /Missing categories translation/);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-pairs-test-'));
try {
  fs.mkdirSync(path.join(dir, '_posts'));
  const original = path.join(dir, '_posts', 'sample.md');
  const ca = path.join(dir, '_posts', 'sample-ca.md');
  const contents = '---\ntitle: Example\ndate: 2020-01-01 12:00:00\n---\nA paragraph.\n';
  fs.writeFileSync(original, contents);
  assert.throws(() => checkPairs(dir), /Missing paired article/);
  fs.writeFileSync(ca, contents);
  assert.equal(checkPairs(dir), 1);
  fs.writeFileSync(ca, contents.replace('2020-01-01', '2021-01-01'));
  assert.throws(() => checkPairs(dir), /Publication date differs/);
  fs.writeFileSync(ca, contents.replace('A paragraph.', ''));
  assert.throws(() => checkPairs(dir), /Empty translation/);
  fs.writeFileSync(ca, contents.replace('title: Example', 'title: Example\ntags: [new]'));
  assert.throws(() => checkPairs(dir), /Mismatched tags/);
  fs.unlinkSync(original);
  assert.throws(() => checkPairs(dir), /Missing paired article/);
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
console.log('Article pairing, missing/empty/mismatched translation, nested taxonomy checks passed.');

// Exercise the real index command against a cache containing both languages.
const vm = require('vm');
let indexCommand;
const logs = [];
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../scripts/index.js'), 'utf8'), {
  require, process: { env: {} }, Buffer,
  console: { log: (...args) => logs.push(args) },
  hexo: { extend: { console: { register: (_name, _description, fn) => { indexCommand = fn; } } } }
});
const example = { title: 'Original', source: '_posts/sample.md', path: '2020/01/01/sample/', content: '<p>Body</p>', date: new Date('2020-01-01'), permalink: 'https://blog.moy.cat/2020/01/01/sample/' };
indexCommand.call({
  load: () => Promise.resolve(),
  locals: { get: () => ({ toArray: () => [example, { ...example, lang: 'ca' }, { ...example, source: '_posts/sample-ca.md' }, { ...example, path: 'ca/2020/01/01/sample/' }] }) }
}, { 'dry-run': true }).then(() => {
  assert.equal(logs.find(entry => entry[0] === '[index] posts to upload:')[1], 1);
  console.log('Search indexing excludes translations even in a mixed cached database.');
}).catch(error => { console.error(error); process.exitCode = 1; });
