'use strict';

const https = require('https');

const DEFAULT_API_BASE = 'https://index.moy.cat';

function decodeHtmlEntities(input) {
  const named = {
    nbsp: ' ',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'"
  };

  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity[0] === '#') {
      const isHex = entity[1] && entity[1].toLowerCase() === 'x';
      const codePoint = parseInt(isHex ? entity.slice(2) : entity.slice(1), isHex ? 16 : 10);
      if (!isNaN(codePoint)) {
        return String.fromCodePoint(codePoint);
      }
      return match;
    }

    const key = entity.toLowerCase();
    return Object.prototype.hasOwnProperty.call(named, key) ? named[key] : match;
  });
}

function htmlToPlainText(html) {
  if (!html) {
    return '';
  }

  let text = String(html)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<img\b[^>]*>/gi, ' ')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|article|h[1-6]|ul|ol|blockquote|pre|table|tr|figure|figcaption)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  text = decodeHtmlEntities(text)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text;
}

function requestJson(url, method, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: method,
      headers: headers
    }, (res) => {
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        raw += chunk;
      });
      res.on('end', () => {
        let parsed = {};
        if (raw) {
          try {
            parsed = JSON.parse(raw);
          }
          catch (error) {
            return reject(new Error('Invalid JSON response from index API'));
          }
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          const message = parsed && parsed.error && parsed.error.message ? parsed.error.message :
            'Index API request failed with status ' + res.statusCode;
          return reject(new Error(message));
        }

        resolve(parsed);
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

hexo.extend.console.register('index', 'Upload all posts to index service', function(args) {
  const token = process.env.INDEX_TOKEN;
  const apiBase = (process.env.INDEX_API_BASE || DEFAULT_API_BASE).replace(/\/$/, '');
  const dryRun = !!(args && (args['dry-run'] || args.dryRun));

  if (!token && !dryRun) {
    throw new Error('INDEX_TOKEN is required. Example: INDEX_TOKEN=... npm run index');
  }

  return this.load().then(() => {
    const postsCollection = this.locals.get('posts');
    const posts = postsCollection.toArray().map((post) => {
      return {
        title: post.title || '',
        url: post.permalink,
        content: htmlToPlainText(post.content),
        published_at: Math.floor(post.date.valueOf() / 1000)
      };
    });

    if (dryRun) {
      console.log('[index] dry-run enabled, skip upload');
      console.log('[index] posts to upload:', posts.length);
      return;
    }

    const payload = JSON.stringify({ posts: posts });

    return requestJson(apiBase + '/v1/index', 'POST', {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': 'Bearer ' + token
    }, payload)
      .then((data) => {
        console.log('[index] upload success');
        if (typeof data.post_count !== 'undefined') {
          console.log('[index] indexed posts:', data.post_count);
        }
      });
  });
});


