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

async function scrollPage(page, bottom) {
  // Wheel input cooperates with desktop smooth scrolling; touch/reduced motion uses native scrolling.
  const distance = await page.evaluate(() => document.documentElement.scrollHeight);
  if (await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches)) {
    await page.evaluate((end) => scrollTo({ top: end ? document.documentElement.scrollHeight : 0, behavior: 'instant' }), bottom);
  } else await page.mouse.wheel({ deltaY: bottom ? distance : -distance });
  await page.waitForFunction((end) => Math.abs(scrollY - (end
    ? document.documentElement.scrollHeight - innerHeight : 0)) < 2, { timeout: 6000 }, bottom);
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
  assert(await page.$eval('header', (el) => el.getBoundingClientRect().bottom <= 0),
    'the page header must scroll away before the service sections');
  await checkIndex(page, `${source} to ${id}`);
}

async function checkCircuit(page, reduced, checkpoint) {
  // The illuminated edge stays visible and reaches the footer at the page's end.
  await page.waitForFunction((reducedMotion) => {
    const rect = document.querySelector('.circuit-reveal');
    if (!rect) return false;
    const height = Number(rect.getAttribute('height'));
    const fullHeight = rect.ownerSVGElement.viewBox.baseVal.height;
    if (reducedMotion) return height === fullHeight;
    const field = rect.ownerSVGElement.getBoundingClientRect();
    const lightFront = field.top + height / fullHeight * field.height;
    return lightFront >= innerHeight * 0.6 && lightFront <= innerHeight + 2;
  }, { timeout: 1500 }, reduced).catch(() => {
    throw new Error(`circuit illumination is outside the viewport or has no static fallback (${checkpoint})`);
  });
  const coversPage = await page.evaluate(() => {
    const field = document.querySelector('.circuit-field').getBoundingClientRect();
    const main = document.querySelector('main').getBoundingClientRect();
    const footer = document.querySelector('footer').getBoundingClientRect();
    return Math.abs(field.left) < 2 && Math.abs(field.right - innerWidth) < 2
      && field.top <= main.top + 2 && field.bottom >= footer.bottom - 2;
  });
  assert(coversPage, 'circuit background must span the full width from the opening through the footer');
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
  assert(await page.$$eval('.circuit-active', (paths) => paths.length > 0), 'circuit traces are missing');
  await checkCircuit(page, reduced, 'opening');

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
    illumination.push(await checkCircuit(page, reduced, `service ${id}`));
  }
  if (!reduced) assert(illumination[1] > illumination[0] && illumination[2] < illumination[1],
    'circuit illumination must advance down the page and rewind on upward scroll');

  await scrollPage(page, true);
  await page.waitForFunction(() => {
    const rect = document.querySelector('.circuit-reveal');
    const svg = rect.ownerSVGElement;
    // Phone scroll limits round fractional layout pixels. Measure the undrawn part in rendered pixels.
    const remaining = 1 - Number(rect.getAttribute('height')) / svg.viewBox.baseVal.height;
    return remaining * svg.getBoundingClientRect().height <= 2;
  }, { timeout: 1500 }).catch(() => {
    throw new Error('circuit traces do not finish illuminating at the footer');
  });
  await checkCircuit(page, reduced, 'footer');

  // The header belongs to the page: return to the top to switch language, then revisit a service.
  await scrollPage(page, false);
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
  await checkCircuit(page, reduced, 'language change');

  // A shared link must also work when opened directly, without clicking through the home page first.
  await page.goto(new URL('#system-support', base).href, { waitUntil: 'load' });
  await checkLanding(page, 'support', 'direct URL');
  assert.equal(await page.$$eval('.pin-spacer', (els) => els.length), 0, 'an animation pins the page');

  // Route changes remove the home backdrop and restore it without leaking an old animation.
  await clickVisible(page, 'footer a[href="/privacy"]');
  await page.waitForFunction(() => location.pathname === '/privacy' && !document.querySelector('.circuit-field'));
  assert.equal(await page.$$eval('.circuit-field', (els) => els.length), 0, 'home backdrop remains on the privacy page');
  await clickVisible(page, 'header a[href="/"]');
  await page.waitForFunction(() => location.pathname === '/' && document.querySelector('.circuit-field'));
  await checkCircuit(page, reduced, 'return from privacy page');
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
