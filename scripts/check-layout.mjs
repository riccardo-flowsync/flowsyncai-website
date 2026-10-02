// Responsive layout check. Run from the repo root:
//   npm run build && node scripts/check-layout.mjs
//   node scripts/check-layout.mjs https://example.com    (audit a live URL instead of dist/)
// Opens the four main pages at 19 screen sizes in English and Italian, plus a reduced-motion pass, and prints
// one line each: "ok" or "FAIL <what is wrong>". Checks several pages at once, one Chrome per worker, and prints the
// lines in the usual order. Takes 2-4 minutes on 8 cores (about 13 with --concurrency=1). Exit code: 0 all
// ok, 1 something failed, 2 could not start (no dist/, no Chrome, bad option). Uses Puppeteer's separate test browser
// (chrome-headless-shell in ~/.cache/puppeteer; npx @puppeteer/browsers install chrome-headless-shell) so it never
// opens your everyday Chrome; without it, the installed Google Chrome. CHROME_PATH overrides both. Options (default: everything):
//   --concurrency=N        pages checked at once (default: the CPU count)
//   --only=WxH[,WxH...]    check only these sizes, in both the normal and the reduced-motion pass; any size works,
//                          not only the listed ones (e.g. --only=1470x830 checks it with and without reduced motion)
//   --lang=en|it           check one language only
// No screen may have pinned scenes (.pin-spacer): animations must never hold the page in place.
import { existsSync, readdirSync } from 'node:fs';
import { availableParallelism, homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { preview } from 'vite';
import { localizedPath } from '../src/lib/routes.js';

const SIZES = [
  [320, 568], [360, 740], [375, 812], [390, 844], [414, 896], // phones, portrait
  [667, 375], [844, 390], [932, 430], // phones, landscape
  [768, 1024], [820, 1180], [1024, 768], [1180, 820], // tablets
  [1280, 680], [1440, 780], [1470, 830], // laptops
  [1280, 800], [1440, 900], [1920, 1080], [2560, 1440], // desktops
];
const REDUCED_SIZES = [[390, 844], [1440, 900]];
const LANGS = ['en', 'it']; // Italian copy is longer, it has to fit too
const RUN_TIMEOUT = 90_000; // per size + language, so one stuck page cannot hang the whole check
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- This function runs INSIDE the browser page (Puppeteer serialises it): no outside variables ----
// Returns problems: a string, or [message, items] for a list.
async function pageChecks({ reduced, touch, portraitPhone, lang, w, h }) { // w x h: the screen size we asked for
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
    for (const scene of main.querySelectorAll('.tool-theatre')) {
      if (scene.dataset.step !== '3') problems.push(`reduced-motion story is not complete (step ${scene.dataset.step})`);
    }
    const invisible = (e) => { const s = getComputedStyle(e); return s.opacity === '0' || s.visibility === 'hidden'; };
    const fixed = (e) => { for (let a = e; a; a = a.parentElement) if (getComputedStyle(a).position === 'fixed') return true; return false; };
    const suspects = [main, ...main.querySelectorAll('*')].filter((e) => {
      const r = e.getBoundingClientRect(); // hidden on purpose: tiny boxes (honeypots), closed panels, fixed overlays (closed menus)
      // data-motion-only: a state that only exists inside an animation (a chip lighting up, a label that swaps), not content
      return invisible(e) && (e === main || !invisible(e.parentElement)) && r.width > 2 && r.height > 2 && !e.closest('details:not([open])') && !e.closest('[data-motion-only], [aria-hidden="true"]') && !fixed(e);
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

  // A hidden-overflow box that is too small for the text it holds directly (used at rest and inside every held scene)
  const clippedText = () => {
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
    return cut;
  };

  // Top bar: the fixed <header> (the old design only has a <nav>)
  const bar = document.querySelector('header, nav');
  const barBottom = () => bar.getBoundingClientRect().bottom;
  if (w >= 1000 && h >= 700) {
    for (const track of document.querySelectorAll('.story-track')) {
      if (getComputedStyle(track.querySelector('.story-stage')).position !== 'sticky') problems.push('desktop story stage is not sticky');
      if (track.getBoundingClientRect().height < h * 1.4 || track.getBoundingClientRect().height > h * 1.7) problems.push('desktop story must have a short readable scroll hold');
    }
  }

  // 2. The headline starts below the fixed header
  const h1 = document.querySelector('h1');
  if (!bar || !h1) problems.push(`no ${bar ? '<h1>' : '<header>'} found`);
  else if (h1.getBoundingClientRect().top < barBottom()) problems.push(`headline sits under the header (starts ${px(h1.getBoundingClientRect().top)}, header ends ${px(barBottom())})`);

  // SplitText masks must fit their finished lines, including after a cold font load.
  for (const line of h1?.querySelectorAll('[aria-hidden] > [aria-hidden]') || []) {
    if (line.children.length || !line.textContent.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(line);
    if (line.firstChild?.nodeType === 3) {
      const value = line.firstChild.textContent;
      range.setStart(line.firstChild, value.length - value.trimStart().length);
      range.setEnd(line.firstChild, value.trimEnd().length);
    }
    const box = line.parentElement.getBoundingClientRect();
    if (range.getBoundingClientRect().width > box.width + 1) problems.push(`headline line is clipped: ${text(line)}`);
  }

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

  // 4. No clipped text
  const cut = clippedText();
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

  // The page must always move freely. Catch a future animation that adds a scroll hold on any screen.
  const spacers = document.querySelectorAll('.pin-spacer');
  if (spacers.length) problems.push(`scroll pinning blocks the page (${spacers.length} .pin-spacer)`);
  return problems;
}

// ---- Node side ----
const say = (p) => (Array.isArray(p) ? `${p[0]}: ${p[1].slice(0, 3).join(', ')}${p[1].length > 3 ? ` (+${p[1].length - 3} more)` : ''}` : p);

async function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`took longer than ${ms / 1000}s`)), ms); });
  try { return await Promise.race([promise, timeout]); } finally { clearTimeout(timer); }
}

async function check(page, base, path, [w, h], lang, reduced) {
  await page.bringToFront(); // background tabs get no animation frames, so GSAP would never run; hence one page per browser
  const phone = Math.min(w, h) <= 430;
  await page.setViewport({ width: w, height: h, isMobile: phone, hasTouch: phone || w <= 1180, isLandscape: w > h });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument((l) => { try { localStorage.setItem('lang', l); } catch { /* storage blocked */ } }, lang);
  await page.goto(new URL(localizedPath(path, lang), base).href, { waitUntil: 'load', timeout: 30_000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await sleep(1600); // intro animations
  return page.evaluate(pageChecks, { reduced, lang, w, h, touch: phone || w <= 1180, portraitPhone: w < 500 && h > w });
}

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const only = opt.only?.split(',').map((s) => s.split('x').map(Number));
const langs = opt.lang ? [opt.lang] : LANGS;
const concurrency = Number(opt.concurrency ?? Math.min(availableParallelism(), 4));
const paths = opt.pages?.split(',') || ['/', '/sales-outreach', '/customer-support', '/contact'];
if (Object.entries(opt).some(([k, v]) => v === undefined || !['only', 'lang', 'concurrency', 'pages'].includes(k)) || only?.some((s) => s.length !== 2 || !s.every((n) => n > 0))
  || !paths.every((p) => p.startsWith('/') && !p.includes('..')) || !langs.every((l) => LANGS.includes(l)) || !(Number.isInteger(concurrency) && concurrency > 0)) {
  console.error('Usage: node scripts/check-layout.mjs [url] [--concurrency=N] [--only=WxH[,WxH...]] [--lang=en|it] [--pages=/,/results]');
  process.exit(2);
}

const root = fileURLToPath(new URL('..', import.meta.url));
let server, base = args.find((a) => !a.startsWith('--'));
if (!base) {
  if (!existsSync(`${root}dist/index.html`)) { console.error('No dist/ folder yet. Run `npm run build` first.'); process.exit(2); }
  server = await preview({ root, logLevel: 'silent' });
  base = server.resolvedUrls.local[0];
}

// The output in its usual order: header lines, plus one slot (null until done) per size + language run.
const out = [`Layout check of ${base}`];
const jobs = [];
for (const [title, sizes, reduced] of [['Normal motion', SIZES, false], ['Reduced motion (prefers-reduced-motion: reduce)', REDUCED_SIZES, true]]) {
  out.push(`\n${title}`);
  for (const path of paths) {
    out.push(`  Page ${path}`);
    for (const size of only || sizes) for (const lang of langs) jobs.push({ at: out.push(null) - 1, path, size, lang, reduced });
  }
}

// The newest chrome-headless-shell Puppeteer has downloaded, if any
const testShell = () => {
  const dir = `${homedir()}/.cache/puppeteer/chrome-headless-shell`;
  for (const v of existsSync(dir) ? readdirSync(dir).sort().reverse() : []) {
    for (const sub of readdirSync(`${dir}/${v}`)) if (existsSync(`${dir}/${v}/${sub}/chrome-headless-shell`)) return `${dir}/${v}/${sub}/chrome-headless-shell`;
  }
  return undefined;
};
const chrome = process.env.CHROME_PATH || testShell();

// One browser per worker, one page at a time in each: that page is in front, so its animation frames keep running.
let browsers;
try {
  const launch = () => puppeteer.launch({ headless: true, executablePath: chrome, channel: chrome ? undefined : 'chrome' });
  browsers = await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, launch));
} catch (e) {
  console.error(`Could not start Chrome (${e.message.split('\n')[0]}).\nInstall Google Chrome, or set CHROME_PATH to a Chrome binary.`);
  await server?.close();
  process.exit(2);
}

const t0 = Date.now();
let ok = 0, failed = 0, printed = 0, next = 0;
const flush = () => { while (printed < out.length && out[printed] !== null) console.log(out[printed++]); };
flush();
await Promise.all(browsers.map(async (browser) => {
  while (next < jobs.length) {
    const { at, path, size, lang, reduced } = jobs[next++];
    let page, problems;
    try {
      page = await browser.newPage();
      problems = await withTimeout(check(page, base, path, size, lang, reduced), RUN_TIMEOUT);
    } catch (e) { problems = [`could not run: ${e.message.split('\n')[0]}`]; }
    await page?.close().catch(() => {});
    problems.length ? failed++ : ok++;
    out[at] = `  ${size.join('x').padEnd(9)} ${lang}  ${problems.length ? `FAIL ${problems.map(say).join('; ')}` : 'ok'}`;
    flush();
  }
}));
await Promise.all(browsers.map((b) => b.close().catch(() => {})));
await server?.close();
console.log(`\n${ok} ok, ${failed} FAIL, of ${ok + failed} runs (${Math.round((Date.now() - t0) / 1000)}s)`);
process.exit(failed ? 1 : 0);
