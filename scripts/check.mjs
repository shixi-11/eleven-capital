import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { content, partners, languages } from "../src/content.mjs";
import { processCopy } from '../src/processes.mjs';
assert.equal(content.zh.founderRole, '創始人兼董事長');
assert.equal(content.en.founderRole, 'Founder & Chair');
assert.deepEqual(Object.keys(processCopy).sort(),languages.map(l=>l.lang).sort());
for(const copy of Object.values(processCopy)) for(const key of ['ai','capital']) {
  assert.equal(copy[key].length,4);
  assert(copy[key+'Title']);
  for(const step of copy[key]) assert(step.length===2 && step.every(value=>typeof value==='string' && value.trim()));
}
assert.equal(content.en.path, "/", "English must be the default homepage");
assert.equal(content.zh.path, "/zh-hant/", "Traditional Chinese needs its own route");
const sections = ["", "about/", "services/", "founder/", "partners/"];
assert.deepEqual(languages.map(l => l.lang), ['zh-Hans','zh-Hant','en','ja','ko','es','fr','de','ar']);
assert.equal(Object.keys(content).length, languages.length);
function checkShape(source, target, path) {
  assert.equal(Array.isArray(target), Array.isArray(source), path);
  if (Array.isArray(source)) {
    assert.equal(target.length, source.length, `Incomplete translation: ${path}`);
    source.forEach((value, i) => checkShape(value, target[i], `${path}.${i}`));
  } else if (source && typeof source === 'object') {
    assert.deepEqual(Object.keys(target).sort(), Object.keys(source).sort(), `Translation keys: ${path}`);
    for (const key of Object.keys(source)) checkShape(source[key], target[key], `${path}.${key}`);
  } else {
    assert.equal(typeof target, typeof source, path);
    if (typeof source === 'string' && source.trim()) assert(target.trim(), `Empty translation: ${path}`);
  }
}
for (const lang of ['ja','ko','ar','fr','de','es']) {
  const c = content[lang];
  checkShape(content.zh, c, lang);
  assert.deepEqual(c.services.map(s => s.id), content.zh.services.map(s => s.id));
  assert.deepEqual(c.pillars.map(p => p[0]), content.zh.pillars.map(p => p[0]));
  assert.deepEqual(c.clients.map(p => p[3]), content.zh.clients.map(p => p[3]));
}
const pages = new Map();
for (const c of Object.values(content)) for (const section of sections) {
  const path = c.path + section;
  pages.set(path, await readFile(`dist${path}index.html`, "utf8"));
}
for (const c of Object.values(content)) for (const section of sections) {
  const path = c.path + section;
  const html = pages.get(path);
  assert(
    !/Dar Andrew|Cayabyab|Chief Advisor|首席顧問|info@concursys|British Virgin|risk-adjusted|Economics/i.test(
      html,
    ),
    "Unapproved content found",
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, "Duplicate IDs");
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert(ids.includes(id), `Broken anchor ${id}`);
  for (const [, src] of html.matchAll(
    /(?:src|href)="(\/[^"#]*\.(?:png|jpg|css|js))"/g,
  ))
    assert((await stat("dist" + src)).isFile(), `Missing ${src}`);
  for (const [name, url] of (!section || section === "partners/" ? partners : []))
    assert(
      html.includes(url) && html.includes(name),
      `Missing partner ${name}`,
    );
  assert(
    html.includes(`lang="${c.lang}"`) &&
      html.includes('hreflang="en"') &&
      html.includes('hreflang="zh-Hant"') &&
      html.includes('hreflang="zh-Hans"'),
  );
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert(html.includes("mailto:info@elevencapital.ltd"));
  assert(html.includes('class="contact-inner"') && html.includes('class="copyright-owner"'));
  const brandTitle = c.lang.startsWith('zh') ? "十一資本 | Eleven Capital" : "Eleven Capital | 十一資本";
  const pageTitle = section ? c.nav[sections.indexOf(section) - 1] + " | " + brandTitle : brandTitle;
  assert(html.includes(`<title>${pageTitle}</title>`), `Wrong title order: ${path}`);
  assert(html.includes(`property="og:title" content="${pageTitle}"`), `Wrong share title: ${path}`);
  assert(html.includes(`lang="${c.lang}" dir="${c.lang === 'ar' ? 'rtl' : 'ltr'}"`), `Wrong reading direction: ${path}`);
  assert.deepEqual([...html.matchAll(/<a data-language href="[^"]+" hreflang="([^"]+)"/g)].map(m=>m[1]), languages.map(l=>l.lang), `Language order: ${path}`);
  if (c.lang === 'ar') assert(html.includes('<bdi dir="ltr">info@elevencapital.ltd</bdi>'));
  assert(/href="\/styles\.[a-f0-9]{12}\.css"/.test(html), "Styles must be versioned");
  assert(/src="\/main\.[a-f0-9]{12}\.js"/.test(html), "Scripts must be versioned");
  const inquiry = html.match(/href="(mailto:[^"]+)"/)[1].replaceAll("&amp;", "&");
  const inquiryUrl = new URL(inquiry);
  assert.equal(inquiryUrl.searchParams.get("subject"), c.inquirySubject);
  assert.equal(inquiryUrl.searchParams.get("body"), c.inquiryBody);
  if (!section) {
    assert(html.includes('class="client-grid"') && html.includes(c.projectCta));
    for (const [title] of c.clients) assert(html.includes(title));
    assert(html.includes('class="home-process"') && html.includes(`${c.path}services/#engagement`));
  }
  if (!section || section === 'services/') {
    for (const image of ['product-building.png','enterprise-growth.png']) assert(html.includes(`/assets/${image}`), `Missing service illustration: ${path}`);
  }
  if (section === 'about/') assert(html.includes('/assets/hong-kong.png'));
  if (section === 'partners/') assert(html.includes('/assets/enterprise-growth.png'));
  if (section === "services/") {
    assert(html.includes('class="project-faq"'));
    assert.equal((html.match(/class="service-delivery"/g) || []).length, 7);
    for(const id of ['technology-process-title','capital-process-title','engagement']) assert(html.includes(`id="${id}"`));
    for(const key of ['ai','capital']) for(const [title] of processCopy[c.lang][key]) assert(html.includes(title.replaceAll('&','&amp;')));
  }
  if (section === "founder/") assert(html.includes('class="disclosure biography" open'), "Biography must open by default");
  if (section === "about/") assert(html.includes('class="disclosure values" open'), "Values must open by default");
  assert(!html.includes('class="hero-english"') && !html.includes('class="service-en"'), "Remove bilingual subtitles");
  assert(html.includes('class="language-icon"') && html.includes(c.languageLabel), "Language switch needs a visible label");
  if (!section || section === "services/") {
    assert.equal((html.match(/class="service"/g) || []).length, 7, "Keep all seven services");
    assert(html.includes('id="investment"') && html.includes('id="capital"'), "Incubation and capital strategy need separate entries");
  }
  assert(!html.includes('class="contact-label"') && !html.includes('class="partner-list-label"'));
  assert(html.includes(`rel="canonical" href="https://elevencapital.ltd${path}"`));
  assert.equal((html.match(/<h1\b/g) || []).length, (html.match(/<\/h1>/g) || []).length);
  for (const other of Object.values(content)) {
    const destination = other.path + section;
    assert(html.includes(`data-language href="${destination}"`), `Language switch lost section: ${path}`);
    assert(html.includes(`hreflang="${other.lang}" href="https://elevencapital.ltd${destination}"`));
  }
  for (const [index, destination] of sections.slice(1).entries()) {
    assert(html.includes(`href="${c.path + destination}"${destination === section ? ' aria-current="page"' : ''}>${c.nav[index]}</a>`));
  }
  for (const [, href] of html.matchAll(/href="([^" ]+)"/g)) {
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const url = new URL(href, "https://elevencapital.ltd" + path);
    if (url.pathname.endsWith("/")) {
      const destination = pages.get(url.pathname);
      assert(destination, `Missing route ${href} from ${path}`);
      if (url.hash) assert(destination.includes(`id="${url.hash.slice(1)}"`), `Broken anchor ${href}`);
    }
  }
}
const css = await readFile("dist/styles.css", "utf8");
const manifest = JSON.parse(await readFile("public/assets/fonts/manifest.json", "utf8"));
for (const font of manifest.fonts) {
  assert(css.includes(font.file));
  assert((await stat("dist/assets/fonts/" + font.file)).size > 10000);
}
for (const c of Object.values(content)) {
  const suffix = ({en:'latin',es:'latin',fr:'latin',de:'latin','zh-Hant':'tc','zh-Hans':'sc',ja:'jp',ko:'kr',ar:'arabic'})[c.lang];
  const visibleText = sections.map(section => pages.get(c.path + section).replace(/<head\b[^>]*>[\s\S]*?<\/head>/g, "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<div class="language-options">[\s\S]*?<\/div>/g, "").replace(/<[^>]+>/g, "")).join("");
  const required = [...new Set(visibleText.match(/[\p{L}\p{M}\p{N}]/gu) || [])];
  for (const kind of ["sans", "serif"]) {
    const font = manifest.fonts.find(f => f.file === `${kind}-${suffix}.woff2`);
    assert(font, `Missing ${kind} ${suffix} font`);
    const missing = required.filter(character => !font.characters.includes(character));
    assert.equal(missing.length, 0, `Refresh ${font.file}: missing glyphs ${missing.join("")}`);
  }
}
const sitemap = await readFile("dist/sitemap.xml", "utf8");
for (const path of pages.keys()) assert(sitemap.includes(`<loc>https://elevencapital.ltd${path}</loc>`));
console.log(
  `${pages.size} pages passed: translation completeness, routes, reading direction, language order, headings, fonts and assets.`,
);
