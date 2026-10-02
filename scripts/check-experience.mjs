// npm run build && node scripts/check-experience.mjs [optional preview URL]
// Focused interaction regression. The full screen-size sweep lives in check-layout.mjs.
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { preview } from 'vite';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const root = fileURLToPath(new URL('..', import.meta.url));
const shellDir = `${homedir()}/.cache/puppeteer/chrome-headless-shell`;
const shell = (existsSync(shellDir) ? readdirSync(shellDir).sort().reverse() : [])
  .flatMap((version) => readdirSync(`${shellDir}/${version}`).map((folder) => `${shellDir}/${version}/${folder}/chrome-headless-shell`))
  .find(existsSync);
const chrome = process.env.CHROME_PATH || shell;
let server, browser;

// Executed inside Chrome. Off-screen content counts as readable; hidden content does not.
function readable(selector) {
  const elements = [...document.querySelectorAll(selector)];
  return elements.length > 0 && elements.every((el) => {
    if (!el.getBoundingClientRect().width || !el.getBoundingClientRect().height) return false;
    for (let node = el; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (Number(style.opacity) < 0.99 || style.visibility !== 'visible' || style.display === 'none') return false;
    }
    return true;
  });
}

async function clickVisible(page, selector) {
  for (const element of await page.$$(selector)) {
    if (await element.boundingBox()) { await element.click(); return; }
  }
  throw new Error(`No visible control: ${selector}`);
}

async function checkIndex(page, checkpoint) {
  // Native instant scrolling changes geometry before ScrollTrigger's next animation frame.
  await page.waitForFunction(() => {
    const section = document.querySelector('#systems');
    const middle = innerHeight * 0.55;
    let current = null;
    section.querySelectorAll('[data-system]').forEach((article) => {
      if (article.getBoundingClientRect().top <= middle) current = article.dataset.system;
    });
    if (section.querySelector('[data-note]').getBoundingClientRect().top <= middle) current = null;
    return [...section.querySelectorAll('[data-index]')].every((item) => {
      const expected = item.dataset.index === current;
      return item.classList.contains('is-active') === expected
        && item.querySelector('a').getAttribute('aria-current') === String(expected);
    });
  }, { timeout: 1000 }).catch(() => {
    throw new Error(`service index is stale or disagrees with the visible service (${checkpoint})`);
  });
}

async function checkLanding(page, id, source = 'service link') {
  await page.waitForFunction((service) => {
    const article = document.getElementById(`system-${service}`);
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)
      + (parseFloat(getComputedStyle(article).scrollMarginTop) || 0);
    return Math.abs(article.getBoundingClientRect().top - offset) < 2;
  }, { timeout: 6000 }, id);
  const covered = await page.evaluate((service) => {
    const heading = document.querySelector(`#system-${service} h3`).getBoundingClientRect();
    const overlays = [...document.querySelectorAll('header, #systems nav')]
      .map((el) => el.getBoundingClientRect()).filter((rect) => rect.width && rect.top <= heading.top);
    return heading.top < Math.max(...overlays.map((rect) => rect.bottom)) - 1;
  }, id);
  assert.equal(covered, false, `${id} heading is covered by navigation`);
  await checkIndex(page, `${source} to ${id}`);
}

async function checkCircuit(page, reduced) {
  // The illuminated edge must stay in view, not simply animate somewhere off-screen.
  await page.waitForFunction((reducedMotion) => [...document.querySelectorAll('.circuit-reveal')].every((rect) => {
    const height = Number(rect.getAttribute('height'));
    if (reducedMotion) return height === 1440;
    const rail = rect.ownerSVGElement.getBoundingClientRect();
    return Math.abs(rail.top + height / 1440 * rail.height - innerHeight * 0.65) < 20;
  }), { timeout: 1500 }, reduced);
  const guttersClear = await page.evaluate(() => {
    const page = document.querySelector('.hero-section .page');
    const box = page.getBoundingClientRect();
    const style = getComputedStyle(page);
    const rails = [...document.querySelectorAll('.circuit-rail')].map((el) => el.getBoundingClientRect());
    return rails.length === 2 && rails[0].right <= box.left + parseFloat(style.paddingLeft) - 7
      && rails[1].left >= box.right - parseFloat(style.paddingRight) + 7;
  });
  assert(guttersClear, 'circuit traces cross the reading area');
  return page.$eval('.circuit-reveal', (rect) => Number(rect.getAttribute('height')));
}

async function check(page, base, width, lang, reduced) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewport({ width, height: width < 500 ? 844 : 900, isMobile: width < 500, hasTouch: width < 500 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }]);
  await page.evaluateOnNewDocument((language) => localStorage.setItem('lang', language), lang);
  await page.goto(base, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await sleep(1500);
  assert.equal(await page.$$eval('.circuit-active', (paths) => paths.length), 4, 'circuit traces are missing');
  await checkCircuit(page, reduced);

  const opening = await page.$eval('h1', (el) => el.closest('section').textContent);
  assert.match(opening, lang === 'en' ? /automation agency/i : /agenzia.*automaz/is, 'opening must identify the AI automation agency');
  const services = await page.$$eval('[data-system]', (articles) => articles.map((article) => ({
    id: article.id, name: article.querySelector('h3')?.textContent.trim(),
  })));
  assert.deepEqual(services.map((service) => service.id), ['system-outbound', 'system-support']);
  assert.deepEqual(services.map((service) => service.name), ['AI outreach', 'AI agent']);
  assert(await page.evaluate(readable, '[data-system] h3'), 'both service headings must remain visible');

  if (reduced) {
    assert(await page.evaluate(readable, 'main h1, main h2, main h3, .ib-row, .ib-draft, .ib-btns, .ch-user, .ch-agent, .ch-act'),
      'reduced motion hides content or an illustration');
  } else {
    for (const [id, final] of [['outbound', '.ib-sent, .ib-row, .ib-draft'], ['support', '.ch-agent, .ch-act']]) {
      await page.$eval(`#system-${id} [data-stage]`, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction(readable, { timeout: 3000 }, final);
    }
  }

  // Exercise the actual links in both directions, including the sticky mobile service navigation.
  const illumination = [];
  for (const id of ['outbound', 'support', 'outbound']) {
    await clickVisible(page, `[data-index="${id}"] a`);
    await checkLanding(page, id);
    assert.equal(new URL(page.url()).hash, `#system-${id}`);
    illumination.push(await checkCircuit(page, reduced));
  }
  if (!reduced) assert(illumination[1] > illumination[0] && illumination[2] < illumination[1],
    'circuit illumination must advance down the page and rewind on upward scroll');

  // Switch while midway down the page, where stale ScrollTrigger callbacks used to be easy to miss.
  const next = lang === 'en' ? 'it' : 'en';
  if (width < 1280) await clickVisible(page, 'button[aria-controls="mobile-menu"]');
  await clickVisible(page, `button[lang="${next}"]`);
  if (width < 1280) await clickVisible(page, 'button[aria-controls="mobile-menu"]');
  await page.waitForFunction((language) => document.documentElement.lang === language, {}, next);
  await sleep(500);
  assert(await page.evaluate(readable, '[data-system] h3'), 'language switch hides service headings');
  await checkIndex(page, `language switched to ${next}`);
  await clickVisible(page, '[data-index="outbound"] a');
  await checkLanding(page, 'outbound', 'link after language switch');
  await checkCircuit(page, reduced);

  // A shared link must also work when opened directly, without clicking through the home page first.
  await page.goto(new URL('#system-support', base).href, { waitUntil: 'load' });
  await checkLanding(page, 'support', 'direct URL');
  assert.equal(await page.$$eval('.pin-spacer', (els) => els.length), 0, 'an animation pins the page');
  assert.deepEqual(errors, [], 'uncaught browser errors');
}

try {
  let base = process.argv[2];
  if (!base) {
    assert(existsSync(`${root}dist/index.html`), 'Run npm run build first');
    server = await preview({ root, logLevel: 'silent' });
    base = server.resolvedUrls.local[0];
  }
  browser = await puppeteer.launch({ headless: true, executablePath: chrome, channel: chrome ? undefined : 'chrome' });
  for (const width of [1440, 390]) for (const lang of ['en', 'it']) for (const reduced of [false, true]) {
    const page = await browser.newPage();
    const label = `${width}px ${lang} ${reduced ? 'reduced' : 'normal'} motion`;
    try {
      await page.bringToFront();
      await check(page, base, width, lang, reduced);
      console.log(`ok ${label}`);
    } catch (error) {
      console.error(`FAIL ${label}: ${error.message}`);
      process.exitCode = 1;
    } finally { await page.close(); }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await browser?.close();
  await server?.close();
}
