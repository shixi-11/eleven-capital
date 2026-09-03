"""Prepare OFL-licensed Noto subsets after building the site's HTML.

Requires fonttools[woff]. Pass NotoSans/Serif{SC,TC,JP,KR}-VF.ttf through
--source-dir and Inter.ttf, SourceSerif4.ttf, NotoSansArabic.ttf and
NotoNaskhArabic.ttf through --latin-source-dir.
Font sources are never copied into the public directory.
"""
import argparse
import hashlib
import html
import json
import re
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser()
parser.add_argument('--source-dir', type=Path, required=True)
parser.add_argument('--latin-source-dir', type=Path, required=True,
                    help='Directory with Inter, Source Serif 4, Noto Sans Arabic and Noto Naskh Arabic source TTFs')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
target = root / 'public/assets/fonts'
pages = list((root / 'dist').rglob('*.html'))
region_languages = {'SC': ['zh-Hans'], 'TC': ['zh-Hant'], 'Latin': ['en', 'es', 'fr', 'de'],
                    'JP': ['ja'], 'KR': ['ko'], 'Arabic': ['ar']}
region_text = {region: '' for region in region_languages}
for page in pages:
    markup = page.read_text('utf-8')
    language = re.search(r'<html\s+lang="([^"]+)"', markup).group(1)
    markup = re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', markup)
    text = html.unescape(re.sub('<[^>]+>', '', markup))
    for region, languages in region_languages.items():
        if language in languages:
            region_text[region] += text
common = ''.join(chr(n) for n in range(32, 127)) + '©＋⌄↗↘→↑繁简語言语言首頁首页完整經歷完整经历'
manifest = {'license': 'SIL Open Font License 1.1', 'fonts': []}
for kind in ('Sans', 'Serif'):
    for region in region_languages:
        characters = sorted(set(region_text[region] + common))
        filename = ('Inter.ttf' if kind == 'Sans' else 'SourceSerif4.ttf') if region == 'Latin' else ('NotoSansArabic.ttf' if kind == 'Sans' else 'NotoNaskhArabic.ttf') if region == 'Arabic' else f'Noto{kind}{region}-VF.ttf'
        source = (args.latin_source_dir if region in ('Latin', 'Arabic') else args.source_dir) / filename
        font = TTFont(source)
        names = font['name']
        source_family = names.getDebugName(1)
        version = names.getDebugName(5)
        copyright = names.getDebugName(0)
        license_text = names.getDebugName(13)
        if not license_text or 'Open Font License' not in license_text:
            raise RuntimeError(f'{filename}: missing OFL license in font metadata')
        family = f'Eleven {kind} {region}'
        # Rename variable-instance/PostScript names as well as the family name.
        # Copyright, license, attribution and upstream URL records stay intact.
        for record in names.names:
            if record.nameID not in (3, 6, 25) and record.nameID < 256:
                continue
            value = record.toUnicode()
            for original in ('SourceSerif4', 'NotoSansSC', 'NotoSansTC',
                             'NotoSerifSC', 'NotoSerifTC', 'NotoSansJP', 'NotoSerifJP',
                             'NotoSansKR', 'NotoSerifKR', 'NotoSansArabic', 'NotoNaskhArabic', 'Inter'):
                value = value.replace(original, family.replace(' ', ''))
            record.string = value.encode(record.getEncoding(), errors='replace')
        for name_id, value in [(1, family), (2, 'Regular'), (4, family),
                               (6, family.replace(' ', '')), (16, family), (17, 'Regular')]:
            for platform, encoding, language in [(3, 1, 0x409), (1, 0, 0)]:
                names.setName(value, name_id, platform, encoding, language)
        cmap = font.getBestCmap()
        options = subset.Options()
        options.flavor = 'woff2'
        options.name_IDs = ['*']
        options.name_legacy = True
        options.name_languages = ['*']
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(text=''.join(characters))
        subsetter.subset(font)
        font.flavor = 'woff2'
        output = target / f'{kind.lower()}-{region.lower()}.woff2'
        font.save(output)
        manifest['fonts'].append({
            'file': output.name, 'family': family, 'sourceFamily': source_family,
            'version': version, 'copyright': copyright,
            'source': 'https://github.com/google/fonts/tree/main/ofl/' + (('inter' if kind == 'Sans' else 'sourceserif4') if region == 'Latin' else ('notosansarabic' if kind == 'Sans' else 'notonaskharabic') if region == 'Arabic' else f'noto{kind.lower()}{region.lower()}'),
            'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'sha256': hashlib.sha256(output.read_bytes()).hexdigest(),
            'bytes': output.stat().st_size,
            'characters': ''.join(c for c in characters if ord(c) in cmap),
        })
        print(f'{output.name}: {output.stat().st_size:,} bytes; {source_family}; {version}')
(target / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', 'utf-8')
