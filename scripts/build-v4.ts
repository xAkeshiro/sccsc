/**
 * Builds the site's home page ("v4"): the original WordPress home page (kept at
 * public/original/index.html, from the Simply Static export, and viewable at /original) with more
 * color. This script copies it to public/index.html, links public/v4/v4.css (where nearly all of
 * the restyling lives) and makes a few markup additions a stylesheet can't. Re-run it after
 * editing v4 or refreshing the export (copy the new export's index.html to public/original/ first):
 *
 *   npm run v4:build
 */
import { readFileSync, writeFileSync } from "node:fs";

const SOURCE = "public/original/index.html";
const TARGET = "public/index.html";

let html = readFileSync(SOURCE, "utf8");

/** Replaces `find` (a string or regex), insisting it matches exactly `count` times so a changed export fails loudly. */
function edit(find: string | RegExp, replace: string | ((match: string, ...groups: string[]) => string), count = 1) {
  const pattern =
    typeof find === "string"
      ? new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
      : new RegExp(find.source, find.flags.includes("g") ? find.flags : `${find.flags}g`);
  const found = html.match(pattern)?.length ?? 0;
  if (found !== count) throw new Error(`Expected ${count} match(es) for ${pattern}, found ${found}`);
  html = typeof replace === "string" ? html.replace(pattern, replace) : html.replace(pattern, replace);
}

const wave = (tone: string, direction: "up", extra = "") =>
  `<div aria-hidden="true" class="v4-wave v4-wave--${tone} v4-wave--${direction}${extra ? ` ${extra}` : ""}"></div>`;

// The original copy is kept out of search; the live home page isn't.
edit(/<meta name="robots" content="noindex, nofollow">/, '<meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large">');

// <head>: load the v4 styles (and fonts) last so they win.
edit(
  "</head>",
  '<link rel="preload" href="/v4/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>' +
    '<link rel="stylesheet" href="/v4/v4.css">\n</head>',
);

// <body>: a class to scope the styles.
edit(/<body class="/, '<body class="v4 ');

// Hero heading: color two words.
edit(
  ">Serving With Heart, Growing With Purpose</h1>",
  '>Serving With <span class="v4-word-sun">Heart</span>, Growing With <span class="v4-word-highlight">Purpose</span></h1>',
);

// A wavy edge under the hero.
const section = (id: string) => `<div class="elementor-element elementor-element-${id} `;
edit(section("95ee5d7"), `${wave("cream", "up", "v4-wave--overlap")}${section("95ee5d7")}`);
edit(section("2762c03"), `<div aria-hidden="true" class="v4-stripe"></div>${section("2762c03")}`);

// Scroll effects (see public/v4/v4.js).
edit("</body>", '<script src="/v4/v4.js" defer></script>\n</body>');

writeFileSync(TARGET, html);
console.log(`✓ Wrote ${TARGET} (${Math.round(html.length / 1024)} KB)`);
