/**
 * Builds every other page of the site in the v4 look: public/original/<page>/index.html (the
 * Simply Static export, viewable at /original/<page>) → public/<page>/index.html.
 * Run with `npm run v4:build` (after build-v4.ts).
 *
 * Unlike the home page, these are themed generically. Each page is tagged from its own styles:
 *   - the photo banner at the top (v4-hero): wavy edge, animated heading (its overlay is unchanged)
 *   - grey panels (v4-panel), white shadowed cards (v4-card) and blog cards: colors and borders
 *   - heart labels above headings (v4-label) and brush-underlined heading words (v4-hl)
 * and styled by public/v4/v4.css (shared with the home page) plus public/v4/v4-pages.css, with
 * scroll reveals from public/v4/v4-pages.js.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const PUBLIC = "public";
const SOURCE = path.join(PUBLIC, "original");
const HEART_PATH = 'd="M9.45731';
const TONES = ["sun", "lake", "coral"] as const;
const LABEL_TONES = ["sun", "coral", "lake", "white"] as const;
const PANEL_BACKGROUNDS = ["#F5F5F5", "#F9F9F9", "#F9F9FA"];

function findPages(dir = SOURCE, found: string[] = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (existsSync(path.join(full, "index.html"))) found.push(path.relative(SOURCE, full));
    findPages(full, found);
  }
  return found.sort();
}

/** The start of an Elementor element's opening tag (not the CSS rules that mention it). */
const tagOf = (id: string) => `class="elementor-element elementor-element-${id} `;

/** Adds classes to the Elementor element with this ID. */
function addClass(html: string, id: string, classes: string) {
  const marker = tagOf(id);
  if (!html.includes(marker)) return html;
  return html.replace(marker, `${marker}${classes} `);
}

/** Start offsets of every top-level Elementor container (class `e-parent`) after `from`. */
function parentStarts(html: string, from: number) {
  const re = /<div class="elementor-element elementor-element-([0-9a-f]{7}) [^"]*\be-parent\b/g;
  re.lastIndex = from;
  const out: { id: string; at: number }[] = [];
  for (let m = re.exec(html); m; m = re.exec(html)) out.push({ id: m[1], at: m.index });
  return out;
}

/** IDs of elements whose Elementor CSS rule (`.elementor-element-<id>…{…}`) matches `test`. */
function idsWithRule(html: string, test: RegExp) {
  const ids = new Set<string>();
  const re = /\.elementor-element-([0-9a-f]{7})(?![0-9a-f])[^{}]*\{([^}]*)\}/g;
  for (let m = re.exec(html); m; m = re.exec(html)) if (test.test(m[2])) ids.add(m[1]);
  return ids;
}

/** Orders IDs by where their elements appear in the page. */
function byPosition(html: string, ids: Iterable<string>) {
  return [...ids]
    .map((id) => ({ id, at: html.indexOf(tagOf(id)) }))
    .filter((x) => x.at >= 0)
    .sort((a, b) => a.at - b.at);
}

function build(page: string) {
  let html = readFileSync(path.join(SOURCE, page, "index.html"), "utf8");

  // The originals are kept out of search; the live pages aren't.
  html = html.replace(
    '<meta name="robots" content="noindex, nofollow">',
    '<meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large">',
  );

  html = html.replace(
    "</head>",
    '<link rel="preload" href="/v4/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>' +
      '<link rel="stylesheet" href="/v4/v4.css"><link rel="stylesheet" href="/v4/v4-pages.css">\n</head>',
  );
  html = html.replace(/<body class="/, '<body class="v4 v4-page ');


  // The page's own content starts at its Elementor document (not the header template).
  const docAt = html.search(/data-elementor-type="(wp-page|wp-post|single-post|single-page|archive)"/);
  const parents = docAt >= 0 ? parentStarts(html, docAt) : [];
  const footerAt = html.indexOf('data-elementor-type="footer"');
  const tops = parents.filter((p) => footerAt < 0 || p.at < footerAt);

  // Photo banner at the top of the page.
  const bannerIds = idsWithRule(html, /background-image:url/);
  const hero = tops[0] && bannerIds.has(tops[0].id) ? tops[0] : null;
  const heroEnd = hero ? (tops[1]?.at ?? html.length) : -1;
  if (hero) {
    // Animate the heading word by word; highlight the last word as on the home page.
    const heroHtml = html.slice(hero.at, heroEnd);
    const h1 = heroHtml.match(/(<h1 class="elementor-heading-title[^"]*">)([^<]+)(<\/h1>)/);
    if (h1) {
      const words = h1[2].trim().split(/\s+/);
      const wrapped = words
        .map((w, i) => {
          const inner =
            i === words.length - 1
              ? words.length > 1
                ? `<span class="v4-word-highlight">${w}</span>`
                : `<span class="v4-word-sun">${w}</span>`
              : w;
          return `<span class="v4-w" style="--i:${i}">${inner}</span>`;
        })
        .join(" ");
      html = html.slice(0, hero.at) + heroHtml.replace(h1[0], `${h1[1]}${wrapped}${h1[3]}`) + html.slice(heroEnd);
    }
    // A wavy edge under the banner, overlapping its bottom.
    const next = tops[1];
    if (next) {
      const nextAt = html.indexOf(`<div ${tagOf(next.id)}`);
      html =
        html.slice(0, nextAt) +
        '<div aria-hidden="true" class="v4-wave v4-wave--cream v4-wave--up v4-wave--overlap"></div>' +
        html.slice(nextAt);
    }
    html = addClass(html, hero.id, "v4-hero");
  }

  // Cards: white boxes with Elementor's thin border or soft shadow.
  const cardIds = idsWithRule(html, /border-color:#014A8E1A|border-color:#E5DFDD|box-shadow:\s*0px (6px 24px|2px 8px|0px 4px)/);
  byPosition(html, cardIds).forEach(({ id }, i) => (html = addClass(html, id, `v4-card v4-card--${TONES[i % 3]}`)));

  // Light grey panels become marigold and sky.
  const panelIds = idsWithRule(html, new RegExp(`background-color:(${PANEL_BACKGROUNDS.join("|")});`));
  for (const id of cardIds) panelIds.delete(id);
  byPosition(html, panelIds).forEach(({ id }, i) => (html = addClass(html, id, `v4-panel v4-panel--${i % 2 ? "lake" : "sun"}`)));

  // Heart labels above section headings (not the one in the banner) become stickers.
  const heroStart = hero ? html.indexOf(tagOf(hero.id)) : -1;
  const waveAt = html.indexOf('class="v4-wave');
  const heroStop = hero ? (waveAt >= 0 ? waveAt : html.indexOf('data-elementor-type="footer"')) : -1;
  let labelIndex = 0;
  const widgetRe = /<div class="elementor-element elementor-element-([0-9a-f]{7}) [^"]*elementor-widget-(icon-list|heading)\b[^"]*"/g;
  const tagged: { id: string; cls: string }[] = [];
  let headingIndex = 0;
  for (let m = widgetRe.exec(html); m; m = widgetRe.exec(html)) {
    const inHero = hero !== null && m.index > heroStart && m.index < heroStop;
    const nextWidget = html.indexOf('<div class="elementor-element ', m.index + 10);
    const body = html.slice(m.index, nextWidget < 0 ? undefined : nextWidget);
    if (m[2] === "icon-list" && !inHero && body.includes(HEART_PATH)) {
      tagged.push({ id: m[1], cls: `v4-label v4-label--${LABEL_TONES[labelIndex++ % LABEL_TONES.length]}` });
    }
    if (m[2] === "heading" && !inHero && /<(h1|h2|h3)[^>]*elementor-heading-title[^>]*>[^<]*<span>/.test(body)) {
      tagged.push({ id: m[1], cls: `v4-hl v4-hl--${TONES[headingIndex++ % 3]}` });
    }
  }
  for (const t of tagged) html = addClass(html, t.id, t.cls);

  // The four-color stripe above the footer, as on the home page.
  const footer = `<div ${tagOf("2762c03")}`;
  if (!html.includes(footer)) throw new Error(`${page}: footer not found`);
  html = html.replace(footer, `<div aria-hidden="true" class="v4-stripe"></div>${footer}`);

  html = html.replace("</body>", '<script src="/v4/v4-pages.js" defer></script>\n</body>');

  const target = path.join(PUBLIC, page, "index.html");
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, html);
  return { hero: Boolean(hero), cards: cardIds.size, panels: panelIds.size, labels: labelIndex, highlights: headingIndex };
}

const pages = findPages();
for (const page of pages) {
  const r = build(page);
  console.log(
    `✓ /${page}  banner:${r.hero ? "yes" : "no"} cards:${r.cards} panels:${r.panels} labels:${r.labels} highlights:${r.highlights}`,
  );
}
