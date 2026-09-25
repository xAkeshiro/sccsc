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

const sparkle =
  '<svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c.9 6.4 4.6 10.2 12 12-7.4 1.8-11.1 5.6-12 12-.9-6.4-4.6-10.2-12-12C7.4 10.2 11.1 6.4 12 0Z"/></svg>';

const wave = (tone: string, direction: "up" | "down", extra = "") =>
  `<div aria-hidden="true" class="v4-wave v4-wave--${tone} v4-wave--${direction}${extra ? ` ${extra}` : ""}"></div>`;

// Each phrase comes from the page's own copy (welcome, programs and mission sections).
const activities = [
  "Before & after school",
  "Project-based learning",
  "Reading tutors",
  "Youth development",
  "Workforce training",
  "College & career readiness",
  "Health education",
  "Family support",
  "Community partnerships",
];
const ribbonItems = () =>
  [...activities, ...activities]
    .map((a) => `<li><span>${a.replace("&", "&amp;")}</span>${sparkle}</li>`)
    .join("");
const ribbon = `<div class="v4-ribbon" role="region" aria-label="What we do"><div class="v4-ribbon__band"><div class="v4-ribbon__track"><ul>${ribbonItems()}</ul><ul aria-hidden="true">${ribbonItems()}</ul></div></div></div>`;

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
  '>Serving With <span class="v4-word-sun">Heart</span>, Growing With <span class="v4-word-squiggle">Purpose</span></h1>',
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

// Wave edges and the activity ribbon between sections.
const section = (id: string) => `<div class="elementor-element elementor-element-${id} `;
edit(section("95ee5d7"), `${wave("cream", "up", "v4-wave--overlap")}${ribbon}${section("95ee5d7")}`);
edit(section("5006684"), `${wave("sun", "up")}${section("5006684")}`);
edit(section("bcf2712"), `${wave("sun", "down")}${section("bcf2712")}`);
edit(section("591ced0"), `${wave("lake", "up")}${section("591ced0")}`);
edit(section("1030bb4"), `${wave("lake", "down")}${section("1030bb4")}`);
edit(section("2762c03"), `<div aria-hidden="true" class="v4-stripe"></div>${section("2762c03")}`);

mkdirSync("public/v4", { recursive: true });
writeFileSync(TARGET, html);
console.log(`✓ Wrote ${TARGET} (${Math.round(html.length / 1024)} KB)`);
