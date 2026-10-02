// Run after build. All form responses are stubbed; no lead or booking is created.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import puppeteer from 'puppeteer';
import { preview } from 'vite';
import { PAGES, ORIGIN, localizedPath } from '../src/lib/routes.js';

const server = await preview({ logLevel: 'silent' });
const base = server.resolvedUrls.local[0];
const browser = await puppeteer.launch({ headless: true, channel: process.env.CHROME_PATH ? undefined : 'chrome', executablePath: process.env.CHROME_PATH });
const errors = [];
const page = await browser.newPage();
page.on('pageerror', (error) => errors.push(error.message));
const external = [], posts = [];
let formStatus = 502;
await page.setRequestInterception(true);
page.on('request', (req) => {
  if (new URL(req.url()).origin !== new URL(base).origin && /^https?:/.test(req.url())) { external.push(req.url()); req.abort(); }
  else if (req.url().endsWith('/api/lead')) { posts.push(JSON.parse(req.postData())); req.respond({ status: formStatus, contentType: 'application/json', body: '{}' }); }
  else if (req.method() !== 'GET') { req.abort(); }
  else if (req.url().includes('/assets/CalendarEmbed-')) req.abort(); // exercise the existing calendar fallback
  else req.continue();
});
const click = async (text, selector = 'button') => {
  const handles = await page.$$(selector);
  for (const handle of handles) if ((await handle.evaluate((el) => el.textContent.trim())) === text) { await handle.click(); return; }
  throw new Error(`Missing control: ${text}`);
};
// Static content appears before React attaches handlers. Exercise the live controls.
const ready = () => page.waitForFunction(() => !!document.querySelector('header button')?.onclick);
const go = async (path, interactive = true) => { await page.goto(new URL(path, base).href, { waitUntil: 'networkidle0' }); await page.waitForSelector('main h1'); if (interactive) await ready(); };
try {
  const titles = new Set();
  for (const lang of ['en', 'it']) for (const path of Object.keys(PAGES)) {
    const url = localizedPath(path, lang);
    const response = await fetch(new URL(url, base));
    const html = await response.text();
    assert.equal(response.status, 200, url);
    assert(html.includes(`<html lang="${lang}">`), `${url}: language in initial response`);
    assert.equal((html.match(/<title>/g) || []).length, 1, `${url}: one title`);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert(!titles.has(title) || path === '/privacy', `${url}: distinct page title`);
    titles.add(title);
    assert(html.includes(`rel="canonical" href="${ORIGIN}${url}"`), `${url}: canonical in initial response`);
    assert(html.includes('hreflang="en"') && html.includes('hreflang="it"'), `${url}: alternate languages`);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${url}: complete content before JavaScript`);
    assert(!html.includes('Loading the page') && !html.includes('Caricamento della pagina'), `${url}: no placeholder in static content`);
    assert(html.includes('P.IVA 18068831009'), `${url}: legal footer`);
  }
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, 12);
  for (const path of Object.keys(PAGES)) {
    const legacy = await fetch(new URL(path, base));
    assert((await legacy.text()).includes('<h1'), `${path}: legacy page has content`);
  }
  await page.setJavaScriptEnabled(false);
  await go('/it/customer-support', false);
  assert.match(await page.$eval('h1', (el) => el.textContent), /Agenti AI/);
  assert.equal(await page.$$eval('.tool-theatre', (els) => els.every((e) => e.dataset.step === '3')), true, 'No-JS stories show their completed state');
  assert.equal(await page.$eval('h1', (el) => getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).opacity !== '0'), true, 'No-JS service headline stays readable');
  await go('/en', false);
  assert.equal(await page.$$eval('.hero-line', (els) => els.length === 2 && els.every((el) => getComputedStyle(el).visibility !== 'hidden')), true, 'No-JS home headline stays readable');
  await page.setJavaScriptEnabled(true);

  await page.setViewport({ width: 1440, height: 900 });
  await go('/en');
  // Height-only resizes must not leave a larger headline inside old line masks.
  for (const height of [680, 900]) {
    await page.setViewport({ width: 1440, height });
    await page.waitForFunction(() => [...document.querySelectorAll('.hero-line')].every((line) => {
      const node = line.firstChild;
      if (!node || node.nodeType !== 3) return true;
      const text = node.textContent;
      const range = document.createRange();
      range.setStart(node, text.length - text.trimStart().length);
      range.setEnd(node, text.trimEnd().length);
      return range.getBoundingClientRect().width <= line.clientWidth + 1;
    }), { timeout: 3500 });
  }
  const services = await page.$('header button[aria-controls="services-menu"]');
  await services.focus();
  await page.keyboard.press('ArrowDown');
  await page.waitForSelector('#services-menu a');
  assert.deepEqual(await page.$$eval('#services-menu a', (links) => links.map((a) => a.textContent.trim())), ['AI outreach', 'AI agents'], 'Services menu contains only the two services');
  await page.waitForFunction(() => document.activeElement?.textContent.trim() === 'AI outreach');
  assert.equal(await page.evaluate(() => document.activeElement?.textContent.trim()), 'AI outreach', 'ArrowDown opens and focuses the first service');
  await page.keyboard.press('Escape');
  assert.equal(await page.$('#services-menu'), null, 'Escape closes the services menu');
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-controls')), 'services-menu', 'Escape returns focus to the services button');
  await services.focus();
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => document.activeElement?.textContent.trim() === 'AI outreach');
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => document.activeElement?.textContent.trim() === 'AI agents');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.ch-panel');
  assert.equal(await page.$eval('main', (el) => document.activeElement === el), true, 'New page receives focus');
  await page.$eval('.ch-panel', (el) => el.scrollIntoView({ block: 'center' }));
  for (const [choice, text] of [['A routine question', 'returns policy'], ['A case for the team', 'already shipped'], ['Order and return', '4821']]) {
    await click(choice);
    await page.waitForFunction((part) => document.querySelector('.ch-agent').textContent.includes(part) && [...document.querySelectorAll('.ch-w')].every((el) => getComputedStyle(el).visibility === 'visible'), { timeout: 3500 }, text);
  }
  await page.$eval('#results', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForSelector('.sup-card');
  assert.equal(await page.$('.res-chart'), null, 'Support page embeds support results only');
  await go('/en/sales-outreach');
  await page.waitForSelector('.res-chart');
  assert.equal(await page.$('.sup-card'), null, 'Sales page embeds sales results only');
  await page.goto(new URL('/en/results?view=support', base).href, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => location.pathname === '/en/customer-support' && location.hash === '#results');
  await page.goto(new URL('/en/results?view=outbound', base).href, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => location.pathname === '/en/sales-outreach' && location.hash === '#results');
  await page.goto(new URL('/en/results', base).href, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => /^\/en\/?$/.test(location.pathname) && location.hash === '#systems');
  await page.goto(new URL('/en/how-we-work', base).href, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => /^\/en\/?$/.test(location.pathname) && location.hash === '#process');
  await go('/en/customer-support');
  await page.click('header button[aria-label="Italiano"]');
  await page.waitForFunction(() => location.pathname === '/it/customer-support' && document.documentElement.lang === 'it');
  await page.reload({ waitUntil: 'networkidle0' });
  await ready();
  assert.match(await page.$eval('h1', (el) => el.textContent), /Agenti AI/);

  await go('/it/sales-outreach');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.$eval('#results', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await click('Dettagli delle campagne', 'summary');
  const campaignRows = await page.$$eval('.res-li', (rows) => rows.map((row) => row.textContent));
  assert.match(campaignRows[1], /Appuntamenti: non rilevato/, 'Missing meeting count is explicit on phones');
  assert.match(campaignRows[3], /Interessati: non rilevato/, 'Missing interested count is explicit on phones');
  await page.setViewport({ width: 320, height: 568, isMobile: true, hasTouch: true });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, 'Expanded campaign records fit a small phone');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.click('header button[aria-label="Menu"]');
  await page.waitForFunction(() => document.querySelector('main').inert);
  assert.equal(await page.$eval('main', (el) => el.inert), true);
  assert.equal(await page.$$eval('#mobile-menu ul a', (links) => links.length), 2, 'Mobile services group contains exactly two services');
  await click('AI outreach', '#mobile-menu a');
  await page.waitForSelector('.ib-panel');
  assert.equal(await page.$('#mobile-menu'), null);
  assert.equal(await page.$eval('main', (el) => el.inert), false);
  await click('Prenota una call', 'main a');
  await page.waitForSelector('form');
  assert.equal(await page.$eval('form', (el) => !!el.closest('[hidden]')), true, 'Booking prioritizes the calendar');
  assert.deepEqual(external, [], 'No third-party services load before choosing the calendar');
  await click('Invia un messaggio');
  await page.type('input[name="name"]', 'Preview Check');
  await page.type('input[name="email"]', 'preview-check@example.com');
  await page.type('textarea[name="message"]', 'Local verification only.');
  await click('Invia il messaggio');
  await page.waitForSelector('[role="alert"]');
  assert.equal(await page.$eval('input[name="name"]', (el) => el.value), 'Preview Check', 'Failure keeps the draft');
  formStatus = 200;
  await click('Invia il messaggio');
  await page.waitForSelector('main [role="status"]');
  assert.match(await page.$eval('main [role="status"]', (el) => el.textContent), /Grazie, Preview/);
  assert.equal(posts.length, 2);
  assert(posts.every((post) => post.lang === 'it' && post.page === '/it/contact'));
  await click('Vedi gli orari disponibili');
  await page.waitForSelector(`main a[href^="https://cal.com/"]`);
  assert.deepEqual(external, [], 'Calendar failure uses its link without sending external data');

  await go('/en#systems');
  assert(await page.$('#systems'));
  await go('/en/not-a-page');
  assert.equal(await page.$eval('meta[name="robots"]', (el) => el.content), 'noindex,follow');
  assert.deepEqual(errors, []);
  console.log('Static pages, language URLs, service navigation, examples, embedded results, redirects, booking privacy, form retry and calendar fallback passed.');
} finally {
  await browser.close();
  await server.close();
}
