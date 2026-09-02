import { mkdir, cp, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { content, partners, languages } from "../src/content.mjs";

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const arrow = '<span aria-hidden="true">↗</span>';
const version = async (file) => createHash("sha256").update(await readFile(file)).digest("hex").slice(0, 12);
const cssPath = `/styles.${await version("src/styles.css")}.css`;
const jsPath = `/main.${await version("src/main.js")}.js`;
const lines = (a) => a.map((s) => `<span>${esc(s)}</span>`).join("");
const inquiryHref = (c) => "mailto:info@elevencapital.ltd?subject=" + encodeURIComponent(c.inquirySubject) + "&body=" + encodeURIComponent(c.inquiryBody);
const paragraphs = (a) => a.map((s) => `<p>${esc(s)}</p>`).join("");

const sections = ["home", "about", "services", "founder", "partners"];
const navSections = sections.slice(1);
const route = (c, section = "home") => c.path + (section === "home" ? "" : section + "/");
function ui(c) {
  return c.lang === "en" ? { home: "Home", more: "Explore", services: "Explore our services", about: "About Eleven Capital", founder: "Meet our founder", partners: "Our partnerships" } : c.lang === "zh-Hans" ? { home: "首页", more: "了解服务", services: "了解全部服务", about: "了解十一资本", founder: "了解创始人", partners: "了解合作伙伴" } : { home: "首頁", more: "了解服務", services: "了解全部服務", about: "了解十一資本", founder: "了解創始人", partners: "了解合作夥伴" };
}
const more = (c, section, label = ui(c)[section]) => '<a class="text-link" href="' + route(c, section) + '">' + label + arrow + '</a>';
function heroSection(c) { return `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="hero-eyebrow">${c.heroEyebrow}</p><h1 id="hero-title">${lines(c.heroLines)}</h1>${c.heroEnglish ? `<p class="hero-english" lang="en">${c.heroEnglish}</p>` : ""}<p class="hero-intro">${
    esc(c.heroIntro).replace(/[創创][業业][團团][隊队]|成[長长]型企[業业]|多[語语]言官[網网]|AI智能[体體][開开][發发]|[應应]用|持[續续][維维][護护]|[維维][護护][與与]迭代|AI智能[体體]|Web3|Web4/g, (term) => `<span class="phrase">${term}</span>`)
  }</p><div class="hero-actions"><a class="button-outline" href="#contact">${c.projectCta}<span aria-hidden="true">→</span></a><a class="hero-secondary" href="${route(c, "services")}">${c.heroCta}</a></div><p class="hero-location"><span class="location-line" aria-hidden="true"></span>${c.location}</p></div><figure class="hero-image"><img src="/assets/hong-kong.png" alt="${c.photoAlt}" width="1086" height="1448" fetchpriority="high"></figure></section>
`; }
function pillarsSection(c) { return `<nav class="focus-strip" aria-label="${c.focusLabel}">${c.pillars.map(([id, title]) => `<a href="${route(c, "services")}#${id}">${title}<span aria-hidden="true">↘</span></a>`).join("")}</nav>
`; }
function servicesSection(c) { return `<section class="section focus" id="focus" aria-labelledby="focus-title"><div class="section-heading"><p class="section-label">${c.focusLabel}</p><div><h2 id="focus-title">${lines(c.focusTitle)}</h2><p class="section-intro">${c.focusIntro}</p></div></div><div class="service-list">${c.services.map((s, i) => `<article class="service" id="${s.id}"><span class="service-number" aria-hidden="true">0${i + 1}</span><div><h3>${s.title}</h3>${s.en ? `<p class="service-en" lang="en">${s.en}</p>` : ""}<p>${s.text}</p><div class="service-delivery"><h4>${c.deliveryLabel}</h4><p>${c.deliveries[i]}</p></div><ul class="service-examples">${s.examples.map(example => `<li>${esc(example)}</li>`).join("")}</ul></div></article>`).join("")}</div><section class="engagement" aria-labelledby="engagement-title"><p class="section-label">${c.engagementLabel}</p><h3 id="engagement-title">${c.engagementTitle}</h3><p class="engagement-intro">${c.engagementIntro}</p><div class="engagement-steps">${c.engagementSteps.map(([title, text]) => `<div><h4>${title}</h4><p>${text}</p></div>`).join("")}</div></section>${faqSection(c)}</section>
`; }
function aboutSection(c) { return `<section class="section about" id="about" aria-labelledby="about-title"><div class="section-heading"><p class="section-label">${c.aboutLabel}</p><div><h2 id="about-title">${lines(c.aboutTitle)}</h2><div class="prose">${paragraphs(c.about)}</div></div></div><div class="philosophy"><h3>${c.visionTitle}</h3><p>${c.vision}</p></div><div class="mission">${c.mission.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div><details class="disclosure values" open><summary>${c.valuesSummary}<span aria-hidden="true">＋</span></summary><div class="values-grid">${c.values.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></details></section>
`; }
function founderSection(c) { return `<section class="section founder" id="founder" aria-labelledby="founder-title"><figure class="portrait"><img src="/assets/shixi-lin.jpg" width="3500" height="5251" alt="${c.founderAlt}" loading="lazy" decoding="async"><figcaption>${c.founderTitle}<span>${c.founderRole}</span></figcaption></figure><div class="founder-copy"><p class="section-label">${c.founderLabel}</p><h2 id="founder-title">${c.founderTitle}</h2><p class="founder-role">${c.founderRole}</p><p class="founder-lead">${c.founderLead}</p><div class="prose">${paragraphs(c.bio)}</div><details class="disclosure biography" open><summary>${c.bioSummary}<span aria-hidden="true">＋</span></summary><div class="prose">${paragraphs(c.bioMore)}</div></details><div class="social-links"><a href="https://www.linkedin.com/in/shixilin/" target="_blank" rel="noopener noreferrer" aria-label="Shixi Lin — LinkedIn">LinkedIn ${arrow}</a><a href="https://x.com/11Shixi" target="_blank" rel="noopener noreferrer" aria-label="Shixi Lin — X">X ${arrow}</a></div></div></section>
`; }
function partnersSection(c) { return `<section class="section partners" id="partners" aria-labelledby="partners-title"><div class="partner-heading"><div><h2 id="partners-title">${c.partnerLabel}</h2></div><div class="partner-prose"><p class="partner-statement">${c.partnerIntro}</p><p>${c.partnerText}</p></div></div><div class="partner-grid">${partners.map(([name, url, logo, width, height]) => `<a href="${url}" target="_blank" rel="noopener noreferrer" title="${name}" aria-label="${name} — ${c.partnerLink}"><div class="partner-logo-frame"><img class="partner-logo partner-logo--${logo}" src="/assets/partners/${logo}.png" width="${width}" height="${height}" alt="${name}" loading="lazy" decoding="async"></div></a>`).join("")}</div></section>
`; }
function contactSection(c) { return `<section class="contact" id="contact" aria-labelledby="contact-title"><div class="contact-inner"><h2 id="contact-title">${lines(c.contactTitle)}</h2><div class="contact-address"><p>${c.contactText}</p><a class="email-link" href="${esc(inquiryHref(c))}">info@elevencapital.ltd<span aria-hidden="true">↗</span></a></div></div></section>`; }

function clientSection(c) {
  return '<section class="section client-fit" aria-labelledby="client-title"><div class="section-heading"><p class="section-label">' + c.clientLabel + '</p><h2 id="client-title">' + c.clientTitle + '</h2><p class="section-intro">' + c.clientIntro + '</p></div><div class="client-grid">' + c.clients.map(([title, situation, outcome, id, link]) => '<article><h3>' + title + '</h3><p class="client-situation">' + situation + '</p><p>' + outcome + '</p><a class="text-link" href="' + route(c, 'services') + '#' + id + '">' + link + arrow + '</a></article>').join('') + '</div></section>';
}
function faqSection(c) {
  return '<section class="project-faq" aria-labelledby="faq-title"><h2 id="faq-title">' + c.faqTitle + '</h2><div>' + c.faq.map(([question, answer]) => '<article><h3>' + question + '</h3><p>' + answer + '</p></article>').join('') + '</div></section>';
}

function homeSections(c) {
  const services = '<section class="section focus home-services" id="focus" aria-labelledby="focus-title"><div class="section-heading"><p class="section-label">' + c.focusLabel + '</p><h2 id="focus-title">' + lines(c.focusTitle) + '</h2><p class="section-intro">' + c.focusIntro + '</p></div><div class="service-list">' + c.services.map((s, i) => '<article class="service" id="' + s.id + '"><span class="service-number" aria-hidden="true">0' + (i+1) + '</span><h3>' + s.title + '</h3><p>' + s.examples.join(' · ') + '</p><a class="text-link" href="' + route(c, 'services') + '#' + s.id + '">' + ui(c).more + arrow + '</a></article>').join('') + '</div></section>';
  const about = '<section class="section about home-about" id="about" aria-labelledby="about-title"><div class="section-heading"><p class="section-label">' + c.aboutLabel + '</p><h2 id="about-title">' + lines(c.aboutTitle) + '</h2><div class="prose">' + paragraphs(c.about.slice(0,1)) + '</div>' + more(c, 'about') + '</div></section>';
  const founder = founderSection(c).replace(/<details class="disclosure biography"[\s\S]*?<\/details>/, '').replace(/<div class="social-links">[\s\S]*?<\/div>/, more(c, 'founder'));
  const partners = partnersSection(c).replace('<p>' + c.partnerText + '</p>', '').replace('</section>', more(c, 'partners') + '</section>');
  return heroSection(c) + pillarsSection(c) + clientSection(c) + services + about + founder + partners;
}
function mainSections(c, section) {
  if (section === 'home') return homeSections(c);
  const renderers = { about: aboutSection, services: servicesSection, founder: founderSection, partners: partnersSection };
  const headingId = { about: 'about-title', services: 'focus-title', founder: 'founder-title', partners: 'partners-title' }[section];
  const html = renderers[section](c).replace('<h2 id="' + headingId + '">', '<h1 class="page-heading" id="' + headingId + '">');
  const current = c.nav[navSections.indexOf(section)];
  return '<nav class="page-breadcrumb" aria-label="' + ui(c).home + '"><a href="' + c.path + '">' + ui(c).home + '</a><span aria-hidden="true">/</span><span aria-current="page">' + current + '</span></nav>' + html.replace('</h2>', '</h1>');
}

function page(c, section = "home") {
  const nav = c.nav
    .map((n, i) => `<a href="${route(c, navSections[i])}"${section === navSections[i] ? ' aria-current="page"' : ""}>${esc(n)}</a>`)
    .join("");
  const languageMenu =
    '<details class="language-picker"><summary aria-label="' + c.languageLabel + '">' +
    '<svg class="language-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><span>' + c.languageLabel + '</span><span class="language-current">' + languages.find((l) => l.lang === c.lang).short + '</span>' +
    '<span aria-hidden="true">⌄</span></summary><div class="language-options">' +
    languages
      .map(
        (l) =>
          '<a data-language href="' +
          route(l, section) +
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
  const canonical = `https://elevencapital.ltd${route(c, section)}`;
  const brandTitle = "Eleven Capital | 十一資本";
  const title = section === "home" ? brandTitle : c.nav[navSections.indexOf(section)] + " | " + brandTitle;
  const description = ({ about: c.about[0], services: c.focusIntro, founder: c.founderLead, partners: c.partnerIntro })[section] || c.description;
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
<html lang="${c.lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#183f35"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}">${languages.map(l => `<link rel="alternate" hreflang="${l.lang}" href="https://elevencapital.ltd${route(l, section)}">`).join("")}<link rel="alternate" hreflang="x-default" href="https://elevencapital.ltd${route(content.en, section)}"><link rel="icon" href="/assets/favicon.png" type="image/png"><meta property="og:type" content="website"><meta property="og:site_name" content="Eleven Capital"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://elevencapital.ltd/assets/logo.png"><meta property="og:image:width" content="2167"><meta property="og:image:height" content="735"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="${cssPath}"><script defer src="${jsPath}"></script><script type="application/ld+json">${JSON.stringify(schema)}</script></head>
<body id="top"><a class="skip" href="#main">${c.skip}</a>
<header class="site-header"><a class="brand" href="${c.path}" aria-label="Eleven Capital"><img src="/assets/logo.png" width="2167" height="735" alt="${c.legalName}"></a><nav class="desktop-nav" aria-label="${c.menu}">${nav}</nav><div class="header-actions">${languageMenu}<a class="header-contact" href="#contact">${c.contact}${arrow}</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="${c.menu}"><span class="menu-label">${c.menu}</span><span class="menu-symbol" aria-hidden="true">＋</span></button></div><nav class="mobile-nav" id="mobile-menu" aria-label="${c.menu}" hidden>${nav}<a href="#contact">${c.contact}</a></nav></header>
<main id="main" class="${section === "home" ? "home-page" : "detail-page"}">${mainSections(c, section)}${contactSection(c)}</main>
<footer><p class="copyright"><span class="copyright-owner">© ${new Date().getFullYear()} ${c.legalName}${c.lang === "en" ? "." : ""}</span><span>${c.copyright}</span></p><a href="#top">${c.backTop}<span aria-hidden="true">↑</span></a></footer></body></html>`;
}

await mkdir("dist/zh-hant", { recursive: true });
await mkdir("dist/zh-hans", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("src/styles.css", "dist/styles.css");
await cp("src/main.js", "dist/main.js");
await cp("src/styles.css", "dist" + cssPath);
await cp("src/main.js", "dist" + jsPath);
for (const c of Object.values(content)) {
  for (const section of sections) {
    const path = `dist${route(c, section)}`;
    await mkdir(path, { recursive: true });
    await writeFile(`${path}index.html`, page(c, section));
  }
}
await writeFile(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\nSitemap: https://elevencapital.ltd/sitemap.xml\n",
);
await writeFile(
  "dist/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + Object.values(content).flatMap(c => sections.map(section => `<url><loc>https://elevencapital.ltd${route(c, section)}</loc></url>`)).join("") + "</urlset>",
);
await writeFile(
  "dist/404.html",
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Eleven Capital</title><link rel="stylesheet" href="/styles.css"><main class="not-found"><p>404</p><h1>Let’s find your way.</h1><p>The page you are looking for does not exist.</p><a class="button-outline" href="/">Back to home →</a></main></html>',
);
console.log(
  "Built 15 static pages across English, Simplified Chinese and Traditional Chinese.",
);
