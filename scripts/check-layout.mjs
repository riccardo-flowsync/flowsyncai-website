// Responsive layout check. Run from the repo root:
//   npm run build && node scripts/check-layout.mjs
//   node scripts/check-layout.mjs https://example.com    (audit a live URL instead of dist/)
// Opens the home page at 16 screen sizes in English and Italian, plus a reduced-motion pass, and prints
// one line each: "ok" or "FAIL <what is wrong>". Takes 2-4 minutes. Exit code: 0 all ok, 1 something
// failed, 2 could not start (no dist/, no Chrome). Uses the installed Google Chrome; CHROME_PATH overrides.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { preview } from 'vite';

const SIZES = [
  [320, 568], [360, 740], [375, 812], [390, 844], [414, 896], // phones, portrait
  [667, 375], [844, 390], [932, 430], // phones, landscape
  [768, 1024], [820, 1180], [1024, 768], [1180, 820], // tablets
  [1280, 800], [1440, 900], [1920, 1080], [2560, 1440], // desktops
];
const REDUCED_SIZES = [[390, 844], [1440, 900]];
const LANGS = ['en', 'it']; // Italian copy is longer, it has to fit too
const RUN_TIMEOUT = 90_000; // per size + language, so one stuck page cannot hang the whole check
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- This function runs INSIDE the browser page (Puppeteer serialises it): no outside variables ----
// Returns problems: a string, or [message, items] for a list.
async function pageChecks({ reduced, portraitPhone, lang, w, h }) { // w x h: the screen size we asked for
  const problems = [];
  const root = document.documentElement;
  if (root.lang !== lang) problems.push(`page did not switch to ${lang === 'it' ? 'Italian' : 'English'} (html lang="${root.lang}")`);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const px = (n) => `${Math.round(n)}px`;
  const text = (e) => (e.textContent || '').replace(/\s+/g, ' ').trim();
  const section = (e) => {
    const s = e.closest('section[id], header, main, footer');
    return s ? (s.id ? `#${s.id}` : s.tagName.toLowerCase()) : 'page';
  };
  const label = (e) => `<${e.tagName.toLowerCase()}> ${text(e) ? `"${text(e).slice(0, 30)}"` : (e.getAttribute('class') || '').slice(0, 30)} in ${section(e)}`;

  if (reduced) {
    // Reduced motion: no scroll pinning, and nothing may stay invisible waiting for an animation
    const pins = document.querySelectorAll('.pin-spacer').length;
    if (pins) problems.push(`scroll pinning is still on (${pins} .pin-spacer)`);
    const main = document.querySelector('main');
    if (!main) return [...problems, 'no <main> found'];
    const invisible = (e) => { const s = getComputedStyle(e); return s.opacity === '0' || s.visibility === 'hidden'; };
    const fixed = (e) => { for (let a = e; a; a = a.parentElement) if (getComputedStyle(a).position === 'fixed') return true; return false; };
    const suspects = [main, ...main.querySelectorAll('*')].filter((e) => {
      const r = e.getBoundingClientRect(); // hidden on purpose: tiny boxes (honeypots), closed panels, fixed overlays (closed menus)
      return invisible(e) && (e === main || !invisible(e.parentElement)) && r.width > 2 && r.height > 2 && !e.closest('details:not([open])') && !fixed(e);
    }).slice(0, 50);
    const stuck = [];
    for (const e of suspects) {
      e.scrollIntoView({ block: 'center', behavior: 'instant' });
      await sleep(120);
      const r = e.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && invisible(e)) stuck.push(label(e));
    }
    if (stuck.length) problems.push(['stays invisible without animation', stuck]);
    return problems;
  }

  // Top bar: the fixed <header> (the old design only has a <nav>)
  const bar = document.querySelector('header, nav');
  const barBottom = () => bar.getBoundingClientRect().bottom;

  // 2. The headline starts below the fixed header
  const h1 = document.querySelector('h1');
  if (!bar || !h1) problems.push(`no ${bar ? '<h1>' : '<header>'} found`);
  else if (h1.getBoundingClientRect().top < barBottom()) problems.push(`headline sits under the header (starts ${px(h1.getBoundingClientRect().top)}, header ends ${px(barBottom())})`);

  // 3. Portrait phones: the main button is fully visible without scrolling
  if (portraitPhone) {
    const btn = document.querySelector('main .btn-primary');
    const r = btn?.getBoundingClientRect();
    if (!btn) problems.push('no .btn-primary found inside <main>');
    else if (r.top < 0 || r.left < 0 || r.bottom > h || r.right > w) problems.push(`button "${text(btn)}" is not fully on the first screen (bottom ${px(r.bottom)}, screen ${h}px)`);
  }

  // 1. No sideways overflow at any scroll position. Instant scrolling: smooth scrolling skews the numbers.
  let worst = 0, at = 0, culprits = [];
  for (let y = 0, n = 0; y <= root.scrollHeight && n < 300; y += Math.round(h * 0.6), n++) {
    scrollTo({ top: y, behavior: 'instant' });
    await sleep(120);
    if (root.scrollWidth - root.clientWidth <= worst) continue;
    worst = root.scrollWidth - root.clientWidth;
    at = y;
    const cw = root.clientWidth;
    // ignore fixed parts (they never widen the page) and parts a scroll/clip container that fits on screen already cuts off
    const harmless = (e) => {
      if (getComputedStyle(e).position === 'fixed') return true;
      for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (s.position === 'fixed' || (s.overflowX !== 'visible' && a.getBoundingClientRect().right <= cw + 0.5)) return true;
      }
      return false;
    };
    culprits = [...document.querySelectorAll('body *')]
      .filter((e) => e.getBoundingClientRect().right > cw + 0.5 && !harmless(e))
      .sort((a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right)
      .slice(0, 2).map((e) => `${label(e)}, right edge ${px(e.getBoundingClientRect().right)} vs screen ${px(cw)}`);
  }
  scrollTo({ top: 0, behavior: 'instant' });
  if (worst) problems.push([`page scrolls sideways (${px(worst)} too wide at ${px(at)} down), culprit`, culprits.length ? culprits : ['not found']]);

  // 4. No clipped text: a hidden-overflow box that is too small for the text it holds directly
  const cut = [];
  for (const e of document.querySelectorAll('body *')) {
    const s = getComputedStyle(e);
    if (!/hidden|clip/.test(s.overflowX + s.overflowY) || s.visibility === 'hidden') continue;
    if (e.clientWidth < 3 || e.clientHeight < 3) continue; // 1px boxes are the screen-reader-only trick
    if (e.scrollHeight <= e.clientHeight + 1 && e.scrollWidth <= e.clientWidth + 1) continue;
    if (e.closest('[aria-hidden="true"]') || /(^|\s)(split|mask)/i.test(e.getAttribute('class') || '')) continue; // GSAP SplitText
    const own = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    const box = e.getBoundingClientRect();
    const spills = own.some((n) => { // the text itself pokes out (a box a bit narrower than its padding needs is fine)
      const range = document.createRange();
      range.selectNodeContents(n);
      const t = range.getBoundingClientRect();
      return t.right > box.right + 1 || t.bottom > box.bottom + 1 || t.left < box.left - 1 || t.top < box.top - 1;
    });
    if (spills) cut.push(`"${own.map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim().slice(0, 40)}" in ${section(e)}`);
  }
  if (cut.length) problems.push(['text cut off', cut]);

  // 5. Every in-page header link lands with its section heading below the header
  const hashes = new Set();
  for (const a of bar?.querySelectorAll('a[href*="#"]') ?? []) if (a.pathname === location.pathname && a.hash.length > 1) hashes.add(a.hash);
  const missing = [], under = [];
  for (const hash of hashes) {
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) { missing.push(hash); continue; }
    el.scrollIntoView({ behavior: 'instant', block: 'start' });
    await sleep(150);
    const top = (el.querySelector('h1, h2, h3, h4, h5, h6') || el).getBoundingClientRect().top;
    if (top < barBottom() - 0.5) under.push(`${hash} (heading at ${px(top)}, header ends ${px(barBottom())})`);
  }
  if (missing.length) problems.push(['header links to sections that do not exist', missing]);
  if (under.length) problems.push(['header links land with the heading under the header', under]);
  return problems;
}

// ---- Node side ----
const say = (p) => (Array.isArray(p) ? `${p[0]}: ${p[1].slice(0, 3).join(', ')}${p[1].length > 3 ? ` (+${p[1].length - 3} more)` : ''}` : p);

async function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`took longer than ${ms / 1000}s`)), ms); });
  try { return await Promise.race([promise, timeout]); } finally { clearTimeout(timer); }
}

async function check(page, base, [w, h], lang, reduced) {
  await page.bringToFront(); // background tabs get no animation frames, so GSAP would never run; hence one page at a time
  const phone = Math.min(w, h) <= 430;
  await page.setViewport({ width: w, height: h, isMobile: phone, hasTouch: phone || w <= 1180, isLandscape: w > h });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument((l) => { try { localStorage.setItem('lang', l); } catch { /* storage blocked */ } }, lang);
  await page.goto(base, { waitUntil: 'load', timeout: 30_000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await sleep(1600); // intro animations
  return page.evaluate(pageChecks, { reduced, lang, w, h, portraitPhone: w < 500 && h > w });
}

const root = fileURLToPath(new URL('..', import.meta.url));
let server, base = process.argv[2];
if (!base) {
  if (!existsSync(`${root}dist/index.html`)) { console.error('No dist/ folder yet. Run `npm run build` first.'); process.exit(2); }
  server = await preview({ root, logLevel: 'silent' });
  base = server.resolvedUrls.local[0];
}

let browser;
try {
  browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined, channel: process.env.CHROME_PATH ? undefined : 'chrome' });
} catch (e) {
  console.error(`Could not start Chrome (${e.message.split('\n')[0]}).\nInstall Google Chrome, or set CHROME_PATH to a Chrome binary.`);
  await server?.close();
  process.exit(2);
}

const t0 = Date.now();
let ok = 0, failed = 0;
console.log(`Layout check of ${base}`);
for (const [title, sizes, reduced] of [['Normal motion', SIZES, false], ['Reduced motion (prefers-reduced-motion: reduce)', REDUCED_SIZES, true]]) {
  console.log(`\n${title}`);
  for (const size of sizes) {
    for (const lang of LANGS) {
      let page, problems;
      try {
        page = await browser.newPage();
        problems = await withTimeout(check(page, base, size, lang, reduced), RUN_TIMEOUT);
      } catch (e) { problems = [`could not run: ${e.message.split('\n')[0]}`]; }
      await page?.close().catch(() => {});
      problems.length ? failed++ : ok++;
      console.log(`  ${size.join('x').padEnd(9)} ${lang}  ${problems.length ? `FAIL ${problems.map(say).join('; ')}` : 'ok'}`);
    }
  }
}
await browser.close().catch(() => {});
await server?.close();
console.log(`\n${ok} ok, ${failed} FAIL, of ${ok + failed} runs (${Math.round((Date.now() - t0) / 1000)}s)`);
process.exit(failed ? 1 : 0);
