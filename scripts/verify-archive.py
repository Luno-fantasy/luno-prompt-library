"""Verify protected archive data against a Git ref (default: main)."""
from html.parser import HTMLParser
from pathlib import Path
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
BASE = sys.argv[1] if len(sys.argv) > 1 else 'main'
PAGES = ['birthday', 'weekend', 'seasons', 'sweets', 'idol', 'gothic', 'original']

class Archive(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.items, self.search, self.images, self.links = [], [], [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'data-prompt' in attrs:
            self.items.append(json.loads(attrs['data-prompt']))
            self.search.append(attrs.get('data-search'))
        if tag == 'img' and attrs.get('src'):
            self.images.append(attrs['src'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])

count = 0
images = set()
for page in ['index'] + PAGES:
    filename = page + '.html'
    original = Archive(subprocess.check_output(['git', 'show', f'{BASE}:{filename}'], cwd=ROOT, text=True))
    current = Archive((ROOT / filename).read_text())
    assert current.items == original.items, f'{filename}: prompt data changed'
    assert current.search == original.search, f'{filename}: search data changed'
    count += len(current.items)
    images.update(current.images)
    for item in current.items:
        for field in ['image', 'femaleImage', 'maleImage']:
            if item.get(field):
                images.add(item[field])
    for link in current.links:
        if not link.startswith(('http:', 'https:', '#')):
            assert (ROOT / link.split('#')[0]).is_file(), f'{filename}: missing {link}'
    print(f'{filename}: {len(current.items)} prompts; protected data unchanged')

for image in images:
    assert (ROOT / image).is_file(), f'Missing image: {image}'
assert not subprocess.check_output(['git', 'diff', BASE, '--name-only', '--', 'images/'], cwd=ROOT), 'Image files changed'
print(f'PASS: {count} unchanged prompts, {len(images)} valid image paths, all page links, unchanged image assets.')
