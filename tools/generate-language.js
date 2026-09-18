'use strict';
const Hexo = require('hexo');
const hexo = new Hexo(process.argv[3], { config: process.argv[2], silent: true });
(async () => {
  await hexo.init();
  await hexo.call('generate', {});
  await hexo.exit();
})().catch(error => { console.error(error); process.exitCode = 1; });
