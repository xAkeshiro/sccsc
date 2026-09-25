/**
 * Builds /v4: the current WordPress home page (public/index.html, from the Simply Static export)
 * with more color. The page itself is untouched; this script copies it to public/v4/index.html,
 * links public/v4/v4.css (where nearly all of the restyling lives) and makes a few markup
 * additions a stylesheet can't. Re-run it after refreshing the export:
 *
 *   npm run v4:build
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const SOURCE = "public/index.html";
const TARGET = "public/v4/index.html";

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

const banner =
  '<div class="v4-banner">Design preview v4: the current sccsc.org home page with more color. Not the official website. ' +
  'Compare the <a href="/">current site</a>, <a href="/demo">v2</a> or <a href="/v3">v3</a>.</div>';

// Home links stay within v4 (before the banner, whose link to the current site must stay).
edit(/href="\/"/g, 'href="/v4"', 8);

// <head>: preview title, keep it out of search, and load the v4 styles (and fonts) last so they win.
edit(/<title>[^<]*<\/title>/, "<title>Home (v4 design preview) | Sacramento Chinese Community Service Center</title>");
edit(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
edit(
  "</head>",
  '<link rel="preload" href="/v4/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>' +
    '<link rel="stylesheet" href="/v4/v4.css">\n</head>',
);

// <body>: a class to scope the styles, and the preview banner.
edit(/<body class="/, '<body class="v4 ');
edit(/(<body[^>]*>)/, `$1\n${banner}`);


// Headings: color a word or two.
edit(
  ">Serving With Heart, Growing With Purpose</h1>",
  '>Serving With <span class="v4-word-sun">Heart</span>, Growing With <span class="v4-word-highlight">Purpose</span></h1>',
);

edit(
  ">Together, We Can Make a Difference</h3>",
  '>Together, We Can Make a <span class="v4-word-squiggle">Difference</span></h3>',
);

// Counters: the export didn't include Elementor's counter script, so the numbers stuck at their
// starting values (30, 0, 1000, 0). Show the real totals.
edit(
  /(<span class="elementor-counter-number"[^>]*data-to-value=")(\d+)("[^>]*data-from-value=")\d+("[^>]*>)[\d,]*(<\/span>)/g,
  (_m, a, to, b, c, d) => `${a}${to}${b}${to}${c}${Number(to).toLocaleString("en-US")}${d}`,
  4,
);

// A wavy edge under the hero.
const section = (id: string) => `<div class="elementor-element elementor-element-${id} `;
edit(section("95ee5d7"), `${wave("cream", "up", "v4-wave--overlap")}${section("95ee5d7")}`);
edit(section("2762c03"), `<div aria-hidden="true" class="v4-stripe"></div>${section("2762c03")}`);

mkdirSync("public/v4", { recursive: true });
writeFileSync(TARGET, html);
console.log(`✓ Wrote ${TARGET} (${Math.round(html.length / 1024)} KB)`);
