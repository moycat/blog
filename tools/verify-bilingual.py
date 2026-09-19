"""Verify the generated bilingual site without network access."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'

class Document(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.tags = []
        self.source = file.read_text()
        self.feed(self.source)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))
    def matching(self, tag, **attrs):
        return [a for t, a in self.tags if t == tag and all(a.get(k) == v for k, v in attrs.items())]

def resolve(url, origin):
    parts = urlsplit(url)
    if parts.netloc and parts.netloc != 'blog.moy.cat':
        return None
    if parts.scheme and parts.scheme not in ('http', 'https'):
        return None
    if not parts.path:
        return None
    file = PUBLIC / unquote(parts.path).lstrip('/') if parts.path.startswith('/') else origin.parent / unquote(parts.path)
    return file / 'index.html' if file.is_dir() else file

pages = list(PUBLIC.rglob('*.html'))
posts = list(PUBLIC.glob('20*/*/*/*/index.html'))
source_count = len([p for p in (ROOT / 'source/_posts').rglob('*.md') if not p.stem.endswith('-ca')])
assert len(posts) == source_count, len(posts)
assert len(list(PUBLIC.glob('ca/20*/*/*/*/index.html'))) == source_count
assert not (PUBLIC / 'ca/404.html').exists()
assert not (PUBLIC / 'ca/sitemap.xml').exists()
assert '/ca/' not in (PUBLIC / 'sitemap.xml').read_text()
assert 'Disallow: /ca/' in (PUBLIC / 'robots.txt').read_text()

for file in pages:
    doc = Document(file)
    ca = file.is_relative_to(PUBLIC / 'ca')
    assert doc.matching('html', lang='ca' if ca else 'zh-Hans'), file
    noindex = doc.matching('meta', name='robots', content='noindex')
    assert bool(noindex) == ca, file
    switches = [a for a in doc.matching('nav') if 'language-switch' in a.get('class', '')]
    assert len(switches) == (0 if file.name == '404.html' else 1), file
    if switches:
        current = doc.matching('a', **{'aria-current': 'page'})
        assert len(current) == 1 and current[0]['lang'] == ('ca' if ca else 'zh-Hans'), file
        assert resolve(current[0]['href'], file) == file, (file, current)
        for a in doc.matching('a', hreflang='ca') + doc.matching('a', hreflang='zh-Hans'):
            target = resolve(a['href'], file)
            assert target and target.exists(), (file, a)
            peer = Document(target)
            assert any(resolve(link['href'], target) == file for link in peer.matching('a', hreflang='ca') + peer.matching('a', hreflang='zh-Hans')), (file, target)
    if ca:
        assert doc.matching('a', href='/#search'), file
        assert not doc.matching('div', id='open-search-modal'), file
    for tag, attrs in doc.tags:
        # Verify images, stylesheets, scripts, and all internal navigation targets.
        url = attrs.get('src') if tag in ('img', 'script') else attrs.get('href') if tag in ('a', 'link') else None
        if url:
            target = resolve(url, file)
            assert target is None or target.exists(), (file, url)

for original in posts:
    translated = PUBLIC / 'ca' / original.relative_to(PUBLIC)
    zh, ca = Document(original), Document(translated)
    assert len(ca.matching('p', **{'class': 'translation-notice'})) == 1, translated
    assert not zh.matching('p', **{'class': 'translation-notice'}), original
    # Image identities and ordering survive translation, including gallery attachments.
    def images(doc):
        body = doc.source.split('<div class="post-content markdown">', 1)[1].split('<div id="post-footer"', 1)[0]
        return [unquote(urlsplit(src).path).removeprefix('/ca') for src in re.findall(r'<img[^>]*src="([^"]+)"', body)]
    assert images(zh) == images(ca), translated

# Independent feeds retain Hexo's default 20 most recent entries.
ns = {'a': 'http://www.w3.org/2005/Atom'}
for prefix in ('', 'ca/'):
    feed = ET.parse(PUBLIC / prefix / 'atom.xml').getroot()
    entries = feed.findall('a:entry', ns)
    assert len(entries) == min(20, len(posts))
    for entry in entries:
        route = urlsplit(entry.find('a:link', ns).attrib['href']).path
        assert route.startswith('/ca/') == bool(prefix), route

# Each translated collection lists only its own articles, with preserved counts and ordering.
for original in PUBLIC.glob('**/index.html'):
    if original.is_relative_to(PUBLIC / 'ca'):
        continue
    relative = original.relative_to(PUBLIC).as_posix()
    if re.match(r'20\d\d/', relative):
        continue
    doc = Document(original)
    switch = doc.matching('a', hreflang='ca')
    if not switch:
        continue
    ca_file = resolve(switch[0]['href'], original)
    ca = Document(ca_file)
    def article_links(document):
        result = []
        for a in document.matching('a'):
            route = unquote(urlsplit(a.get('href', '')).path)
            if re.match(r'/(?:ca/)?20\d\d/\d\d/\d\d/', route):
                # Chinese search-modal previews are intentionally absent in Catalan.
                if a.get('class') == 'link-unstyled' and 'aria-label' in a:
                    continue
                result.append(route)
        return result
    ca_links = article_links(ca)
    assert all(p.startswith('/ca/') for p in ca_links), ca_file
    assert article_links(doc) == [p.removeprefix('/ca') for p in ca_links], (original, ca_file)

zh_friends = Document(PUBLIC / 'friends/index.html').source
ca_friends = Document(PUBLIC / 'ca/friends/index.html').source
assert 'Viatger, on aniràs?' in ca_friends
assert 'Els trobem a faltar<span class="secondary"> (els seus webs)</span>' in ca_friends
def friend_entries(document):
    content = document.split('<div id="friends">', 1)[1].split('</div>\n</div>', 1)[0]
    return re.sub(r'<h1\b[^>]*>.*?</h1>', '', content, flags=re.S).replace('/ca/assets/', '/assets/')
assert friend_entries(zh_friends) == friend_entries(ca_friends)
assert '<title>Reflexions de Moycat</title>' in (PUBLIC / 'ca/index.html').read_text()
assert 'Reflexions d’una ombra' not in ''.join(file.read_text() for file in (PUBLIC / 'ca').rglob('*.html'))
print(f'Validated {len(pages)} HTML pages, {source_count} paired articles, reciprocal routes, language isolation, images, feeds, noindex, search and shared 404.')
