'use strict';
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const catalog = yaml.load(fs.readFileSync(path.join(hexo.base_dir, '_i18n.yml'), 'utf8'));
const originalConfig = yaml.load(fs.readFileSync(path.join(hexo.base_dir, '_config.yml'), 'utf8'));

hexo.extend.helper.register('bilingual_page', function() {
  const p = this.page;
  return !!(p.__post || p.__index || p.archive || p.category || p.tag || p.bilingual);
});
hexo.extend.helper.register('language_url', function(lang) {
  let route = decodeURI(this.page.path || '').replace(/index\.html$/, '');
  for (const [kind, dir, configKey] of [['categories', hexo.config.category_dir, 'category_map'], ['tags', hexo.config.tag_dir, 'tag_map']]) {
    if (!route.startsWith(dir + '/')) continue;
    const ca = hexo.config.language === 'ca';
    const pieces = route.slice(dir.length + 1).split('/');
    route = dir + '/' + pieces.map(piece => {
      for (const [name, entry] of Object.entries(catalog[kind])) {
        const zhSlug = (originalConfig[configKey] || {})[name] || name;
        if (piece === (ca ? entry.slug : zhSlug)) return lang === 'ca' ? entry.slug : zhSlug;
      }
      return piece;
    }).join('/');
  }
  return encodeURI((lang === 'ca' ? '/ca/' : '/') + route);
});
hexo.extend.helper.register('navigation_url', function(url) {
  if (hexo.config.language === 'ca' && url === '#search') return '/#search';
  return this.url_for(url);
});

hexo.extend.filter.register('after_init', function() {
  if (hexo.config.language === 'ca') hexo.extend.generator.register('sitemap', () => []);
});
