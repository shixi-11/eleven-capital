import { mkdir, cp, writeFile } from "node:fs/promises";
import { content, partners, languages } from "../src/content.mjs";

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const arrow = '<span aria-hidden="true">↗</span>';
const lines = (a) => a.map((s) => `<span>${esc(s)}</span>`).join("");
const paragraphs = (a) => a.map((s) => `<p>${esc(s)}</p>`).join("");
const ids = ["about", "focus", "founder", "partners"];
function page(c) {
  const nav = c.nav
    .map((n, i) => `<a href="#${ids[i]}">${esc(n)}</a>`)
    .join("");
  const languageMenu =
    '<details class="language-picker"><summary aria-label="' + c.languageLabel + '">' +
    '<svg class="language-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><span>' + c.languageLabel + '</span><span class="language-current">' + languages.find((l) => l.lang === c.lang).short + '</span>' +
    '<span aria-hidden="true">⌄</span></summary><div class="language-options">' +
    languages
      .map(
        (l) =>
          '<a data-language href="' +
          l.path +
          '" hreflang="' +
          l.lang +
          '" lang="' +
          l.lang +
          '"' +
          (l.lang === c.lang ? ' aria-current="page"' : "") +
          ">" +
          l.label +
          "</a>",
      )
      .join("") +
    "</div></details>";
  const canonical = `https://elevencapital.ltd${c.path}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Eleven Capital Limited",
    alternateName: "十一資本有限公司",
    url: "https://elevencapital.ltd/",
    logo: "https://elevencapital.ltd/assets/logo.png",
    email: "info@elevencapital.ltd",
    founder: {
      "@type": "Person",
      name: "Shixi Lin",
      jobTitle: "Founder & President",
      sameAs: [
        "https://www.linkedin.com/in/shixilin/",
        "https://x.com/11Shixi",
      ],
    },
  };
  return `<!doctype html>
<html lang="${c.lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#183f35"><title>${esc(c.title)}</title><meta name="description" content="${esc(c.description)}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="zh-Hant" href="https://elevencapital.ltd/zh-hant/"><link rel="alternate" hreflang="zh-Hans" href="https://elevencapital.ltd/zh-hans/"><link rel="alternate" hreflang="en" href="https://elevencapital.ltd/"><link rel="alternate" hreflang="x-default" href="https://elevencapital.ltd/"><link rel="icon" href="/assets/favicon.png" type="image/png"><meta property="og:type" content="website"><meta property="og:site_name" content="Eleven Capital"><meta property="og:title" content="${esc(c.title)}"><meta property="og:description" content="${esc(c.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://elevencapital.ltd/assets/logo.png"><meta property="og:image:width" content="2167"><meta property="og:image:height" content="735"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/styles.css"><script defer src="/main.js"></script><script type="application/ld+json">${JSON.stringify(schema)}</script></head>
<body id="top"><a class="skip" href="#main">${c.skip}</a>
<header class="site-header"><a class="brand" href="${c.path}" aria-label="Eleven Capital"><img src="/assets/logo.png" width="2167" height="735" alt="${c.legalName}"></a><nav class="desktop-nav" aria-label="${c.menu}">${nav}</nav><div class="header-actions">${languageMenu}<a class="header-contact" href="#contact">${c.contact}${arrow}</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="${c.menu}"><span class="menu-label">${c.menu}</span><span class="menu-symbol" aria-hidden="true">＋</span></button></div><nav class="mobile-nav" id="mobile-menu" aria-label="${c.menu}" hidden>${nav}<a href="#contact">${c.contact}</a></nav></header>
<main id="main"><section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="hero-eyebrow">${c.heroEyebrow}</p><h1 id="hero-title">${lines(c.heroLines)}</h1>${c.heroEnglish ? `<p class="hero-english" lang="en">${c.heroEnglish}</p>` : ""}<p class="hero-intro">${
    esc(c.heroIntro).replace(/AI智能[体體]|[产產]品[开開][发發]|[持續续]{2}[维維][护護]|Web3|Web4/g, (term) => `<span class="phrase">${term}</span>`)
  }</p><a class="button-outline" href="#focus">${c.heroCta}<span aria-hidden="true">→</span></a><p class="hero-location"><span class="location-line" aria-hidden="true"></span>${c.location}</p></div><figure class="hero-image"><img src="/assets/hong-kong.png" alt="${c.photoAlt}" width="1086" height="1448" fetchpriority="high"></figure></section>
<nav class="focus-strip" aria-label="${c.focusLabel}">${c.pillars.map(([id, title]) => `<a href="#${id}">${title}<span aria-hidden="true">↘</span></a>`).join("")}</nav>
<section class="section focus" id="focus" aria-labelledby="focus-title"><div class="section-heading"><p class="section-label">${c.focusLabel}</p><div><h2 id="focus-title">${lines(c.focusTitle)}</h2><p class="section-intro">${c.focusIntro}</p></div></div><div class="service-list">${c.services.map((s, i) => `<article class="service" id="${s.id}"><span class="service-number" aria-hidden="true">0${i + 1}</span><div><h3>${s.title}</h3>${s.en ? `<p class="service-en" lang="en">${s.en}</p>` : ""}<p>${s.text}</p><ul class="service-examples">${s.examples.map(example => `<li>${esc(example)}</li>`).join("")}</ul></div></article>`).join("")}</div><section class="engagement" aria-labelledby="engagement-title"><p class="section-label">${c.engagementLabel}</p><h3 id="engagement-title">${c.engagementTitle}</h3><p class="engagement-intro">${c.engagementIntro}</p><div class="engagement-steps">${c.engagementSteps.map(([title, text]) => `<div><h4>${title}</h4><p>${text}</p></div>`).join("")}</div></section></section>
<section class="section about" id="about" aria-labelledby="about-title"><div class="section-heading"><p class="section-label">${c.aboutLabel}</p><div><h2 id="about-title">${lines(c.aboutTitle)}</h2><div class="prose">${paragraphs(c.about)}</div></div></div><div class="philosophy"><h3>${c.visionTitle}</h3><p>${c.vision}</p></div><div class="mission">${c.mission.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div><details class="disclosure values"><summary>${c.valuesSummary}<span aria-hidden="true">＋</span></summary><div class="values-grid">${c.values.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></details></section>
<section class="section founder" id="founder" aria-labelledby="founder-title"><figure class="portrait"><img src="/assets/shixi-lin.jpg" width="3500" height="5251" alt="${c.founderAlt}" loading="lazy" decoding="async"><figcaption>${c.founderTitle}<span>${c.founderRole}</span></figcaption></figure><div class="founder-copy"><p class="section-label">${c.founderLabel}</p><h2 id="founder-title">${c.founderTitle}</h2><p class="founder-role">${c.founderRole}</p><p class="founder-lead">${c.founderLead}</p><div class="prose">${paragraphs(c.bio)}</div><details class="disclosure biography" open><summary>${c.bioSummary}<span aria-hidden="true">＋</span></summary><div class="prose">${paragraphs(c.bioMore)}</div></details><div class="social-links"><a href="https://www.linkedin.com/in/shixilin/" target="_blank" rel="noopener noreferrer" aria-label="Shixi Lin — LinkedIn">LinkedIn ${arrow}</a><a href="https://x.com/11Shixi" target="_blank" rel="noopener noreferrer" aria-label="Shixi Lin — X">X ${arrow}</a></div></div></section>
<section class="section partners" id="partners" aria-labelledby="partners-title"><div class="section-heading"><p class="section-label">${c.partnerLabel}</p><div><h2 id="partners-title">${lines(c.partnerTitle)}</h2><div class="partner-prose">${paragraphs([c.partnerIntro, c.partnerText])}</div></div></div><p class="partner-list-label">${c.partnerListLabel}</p><div class="partner-grid">${partners.map(([name, url, logo, width, height]) => `<a href="${url}" target="_blank" rel="noopener noreferrer" title="${name}" aria-label="${name} — ${c.partnerLink}"><div class="partner-logo-frame"><img class="partner-logo partner-logo--${logo}" src="/assets/partners/${logo}.png" width="${width}" height="${height}" alt="${name}" loading="lazy" decoding="async"></div></a>`).join("")}</div></section>
<section class="contact" id="contact" aria-labelledby="contact-title"><div><h2 id="contact-title">${lines(c.contactTitle)}</h2><p>${c.contactText}</p></div><div class="contact-address"><span class="contact-label">${c.emailLabel}</span><a class="email-link" href="mailto:info@elevencapital.ltd">info@elevencapital.ltd<span aria-hidden="true">↗</span></a><p>${c.legalName}</p></div></section></main>
<footer><p>© ${new Date().getFullYear()} ${c.legalName}${c.lang === "en" ? ". " : "。"}${c.copyright}</p><a href="#top">${c.backTop}<span aria-hidden="true">↑</span></a></footer></body></html>`;
}

await mkdir("dist/zh-hant", { recursive: true });
await mkdir("dist/zh-hans", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("src/styles.css", "dist/styles.css");
await cp("src/main.js", "dist/main.js");
for (const c of Object.values(content))
  await writeFile(`dist${c.path}index.html`, page(c));
await writeFile(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\nSitemap: https://elevencapital.ltd/sitemap.xml\n",
);
await writeFile(
  "dist/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://elevencapital.ltd/</loc></url><url><loc>https://elevencapital.ltd/zh-hant/</loc></url><url><loc>https://elevencapital.ltd/zh-hans/</loc></url></urlset>',
);
await writeFile(
  "dist/404.html",
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Eleven Capital</title><link rel="stylesheet" href="/styles.css"><main class="not-found"><p>404</p><h1>Let’s find your way.</h1><p>The page you are looking for does not exist.</p><a class="button-outline" href="/">Back to home →</a></main></html>',
);
console.log(
  "Built static Simplified Chinese, Traditional Chinese and English pages in dist/.",
);
