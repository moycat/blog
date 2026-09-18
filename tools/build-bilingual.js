'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const yaml = require('js-yaml');
const fm = require('hexo-front-matter');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'source');
const catalog = yaml.load(fs.readFileSync(path.join(root, '_i18n.yml'), 'utf8'));

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
function read(file) { return fm.parse(fs.readFileSync(file, 'utf8')); }
function mapTerms(value, kind, terms = catalog) {
  if (Array.isArray(value)) return value.map(v => mapTerms(v, kind, terms));
  if (!value) return value;
  const entry = terms[kind][value];
  if (!entry || !entry.ca) throw new Error(`Missing ${kind} translation in _i18n.yml: ${value}`);
  return entry.ca;
}
function checkPairs(sourceRoot = source) {
  const posts = files(path.join(sourceRoot, '_posts')).filter(p => p.endsWith('.md'));
  for (const file of posts) {
    const ca = file.endsWith('-ca.md');
    const peer = ca ? file.replace(/-ca\.md$/, '.md') : file.replace(/\.md$/, '-ca.md');
    if (!fs.existsSync(peer)) throw new Error(`Missing paired article: ${path.relative(root, peer)}`);
    if (ca) continue;
    const original = read(file), translated = read(peer);
    if (!translated.title || !translated._content.trim()) throw new Error(`Empty translation: ${peer}`);
    if (String(original.date) !== String(translated.date)) throw new Error(`Publication date differs: ${peer}`);
    for (const kind of ['categories', 'tags']) {
      // Both sources use the Chinese term as the stable identity; labels are mapped at build time.
      if (JSON.stringify(original[kind] || []) !== JSON.stringify(translated[kind] || [])) {
        throw new Error(`Mismatched ${kind}: ${peer}`);
      }
      mapTerms(original[kind], kind);
    }
  }
  for (const kind of ['categories', 'tags']) {
    const labels = new Set(), slugs = new Set();
    for (const [name, entry] of Object.entries(catalog[kind])) {
      if (!entry.ca || !entry.slug || labels.has(entry.ca) || slugs.has(entry.slug)) {
        throw new Error(`Invalid or duplicate ${kind} mapping: ${name}`);
      }
      labels.add(entry.ca); slugs.add(entry.slug);
    }
  }
  return posts.length / 2;
}

async function main() {
  const count = checkPairs();
  if (process.argv.includes('--check')) {
    console.log(`Validated ${count} article pairs and taxonomy mappings.`);
    return;
  }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'moycat-bilingual-'));
  try {
    const baseConfig = yaml.load(fs.readFileSync(path.join(root, '_config.yml'), 'utf8'));
    for (const lang of ['zh-Hans', 'ca']) {
      const ca = lang === 'ca';
      const work = path.join(temporary, lang);
      const stagedSource = path.join(work, 'source');
      fs.mkdirSync(stagedSource, { recursive: true });
      // Hexo derives post asset IDs from base_dir, so sources must live inside it.
      for (const name of ['node_modules', 'themes', 'scripts', 'package.json', '_config.yml', '_i18n.yml']) {
        fs.symlinkSync(path.join(root, name), path.join(work, name));
      }
      for (const file of files(source)) {
        let relative = path.relative(source, file);
        let content = fs.readFileSync(file);
        if (relative.startsWith('_posts' + path.sep) && relative.endsWith('.md')) {
          if (file.endsWith('-ca.md') !== ca) continue;
          if (ca) relative = relative.replace(/-ca\.md$/, '.md');
          const data = read(file);
          data.lang = lang;
          if (ca) {
            for (const kind of ['categories', 'tags']) data[kind] = mapTerms(data[kind], kind);
            // Keep the original slug and resource directory in both languages.
            const original = read(file.replace(/-ca\.md$/, '.md'));
            if (original.slug) data.slug = original.slug;
            else delete data.slug;
            if (original.permalink) data.permalink = original.permalink;
          }
          content = '---\n' + fm.stringify(data);
        } else if (relative.endsWith('.md')) {
          const data = read(file);
          if (relative !== '404.md') {
            data.bilingual = true;
            data.lang = lang;
            if (ca) {
              const translation = (data.i18n || {}).ca || {};
              data.title = translation.title || catalog.ca.pages[data.layout] || data.title;
              for (const field of ['description', 'excerpt', 'keywords']) {
                if (translation[field] !== undefined) data[field] = translation[field];
              }
              if (data._content.trim() && typeof translation.content !== 'string') {
                throw new Error(`Missing i18n.ca.content for page: ${relative}`);
              }
              if (translation.content !== undefined) data._content = translation.content;
            }
            delete data.i18n;
            content = '---\n' + fm.stringify(data);
          } else if (ca) continue; // The shared 404 exists only at the original URL.
        }
        const dest = path.join(stagedSource, relative);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, content);
        const stat = fs.statSync(file);
        fs.utimesSync(dest, stat.atime, stat.mtime);
      }
      // Tag overview is supported even before any article has tags.
      const tagDir = path.join(stagedSource, 'all-tags');
      if (!fs.existsSync(tagDir)) {
        fs.mkdirSync(tagDir);
        fs.writeFileSync(path.join(tagDir, 'index.md'), `---\ntitle: ${ca ? 'Etiquetes' : '标签'}\nlayout: all-tags\nbilingual: true\ncomments: false\n---\n`);
      }
      const config = { ...baseConfig, source_dir: stagedSource,
        public_dir: path.join(temporary, 'output', ca ? 'ca' : ''),
        url: baseConfig.url.replace(/\/$/, '') + (ca ? '/ca' : ''), root: ca ? '/ca/' : '/',
        language: lang };
      if (ca) {
        Object.assign(config, catalog.ca.site);
        config.default_category = mapTerms(baseConfig.default_category, 'categories');
        for (const [kind, key] of [['categories', 'category_map'], ['tags', 'tag_map']]) {
          config[key] = Object.fromEntries(Object.values(catalog[kind]).map(e => [e.ca, e.slug]));
        }
        config.theme_config = { ...baseConfig.theme_config, author: catalog.ca.author };
      }
      const configFile = path.join(work, 'config.yml');
      fs.writeFileSync(configFile, yaml.dump(config));
      const result = spawnSync(process.execPath, [path.join(__dirname, 'generate-language.js'), configFile, work], { cwd: root, stdio: 'inherit' });
      if (result.status !== 0) throw new Error(`${lang} generation failed`);
    }
    const output = path.join(root, baseConfig.public_dir);
    fs.rmSync(output, { recursive: true, force: true });
    fs.cpSync(path.join(temporary, 'output'), output, { recursive: true });
    console.log(`Built ${count} Chinese + ${count} Catalan articles into ${output}`);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
module.exports = { checkPairs, mapTerms };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
