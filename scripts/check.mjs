import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { content, partners } from "../src/content.mjs";
assert.equal(content.en.path, "/", "English must be the default homepage");
assert.equal(content.zh.path, "/zh-hant/", "Traditional Chinese needs its own route");
const sections = ["", "about/", "services/", "founder/", "partners/"];
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
  if (!section) assert(html.includes('<title>Eleven Capital | 十一資本</title>'));
  assert(/href="\/styles\.[a-f0-9]{12}\.css"/.test(html), "Styles must be versioned");
  assert(/src="\/main\.[a-f0-9]{12}\.js"/.test(html), "Scripts must be versioned");
  const inquiry = html.match(/href="(mailto:[^"]+)"/)[1].replaceAll("&amp;", "&");
  const inquiryUrl = new URL(inquiry);
  assert.equal(inquiryUrl.searchParams.get("subject"), c.inquirySubject);
  assert.equal(inquiryUrl.searchParams.get("body"), c.inquiryBody);
  if (!section) {
    assert(html.includes('class="client-grid"') && html.includes(c.projectCta));
    for (const [title] of c.clients) assert(html.includes(title));
  }
  if (section === "services/") {
    assert(html.includes('class="project-faq"'));
    assert.equal((html.match(/class="service-delivery"/g) || []).length, 6);
  }
  if (section === "founder/") assert(html.includes('class="disclosure biography" open'), "Biography must open by default");
  if (section === "about/") assert(html.includes('class="disclosure values" open'), "Values must open by default");
  assert(!html.includes('class="hero-english"') && !html.includes('class="service-en"'), "Remove bilingual subtitles");
  assert(html.includes('class="language-icon"') && html.includes(c.languageLabel), "Language switch needs a visible label");
  if (!section || section === "services/") assert.equal((html.match(/class="service"/g) || []).length, 6, "Keep all six services");
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
  const suffix = c.lang === "en" ? "latin" : c.lang === "zh-Hant" ? "tc" : "sc";
  const visibleText = sections.map(section => pages.get(c.path + section).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<div class="language-options">[\s\S]*?<\/div>/g, "").replace(/<[^>]+>/g, "")).join("");
  const required = [...new Set(visibleText.match(c.lang === "en" ? /[\x20-\x7E’‘“”]/g : /[\u3400-\u9FFF]/g) || [])];
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
  "15 pages passed: routes, anchors, language continuity, headings, expansions, fonts, assets and exclusions.",
);
