import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { content, partners } from "../src/content.mjs";
for (const c of Object.values(content)) {
  const html = await readFile(`dist${c.path}index.html`, "utf8");
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
  for (const [name, url] of partners)
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
}
console.log(
  "All three languages: content exclusions, anchors, assets, partners and metadata passed.",
);
