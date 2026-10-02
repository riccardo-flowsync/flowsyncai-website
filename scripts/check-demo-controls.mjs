// Run after npm run build: node scripts/check-demo-controls.mjs [preview URL]
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { preview } from 'vite';

const server = process.argv[2] ? null : await preview({ logLevel: 'silent' });
const base = process.argv[2] || server.resolvedUrls.local[0];
const browser = await puppeteer.launch({ channel: process.env.CHROME_PATH ? undefined : 'chrome', executablePath: process.env.CHROME_PATH, headless: true });
let fallbackBrowser;
try {
  fallbackBrowser = await puppeteer.launch({ channel: process.env.CHROME_PATH ? undefined : 'chrome', executablePath: process.env.CHROME_PATH, headless: true, args: ['--disable-webgl', '--disable-gpu', '--disable-software-rasterizer'] });
  const failedWebGL = await fallbackBrowser.newPage();
  await failedWebGL.setViewport({ width: 1440, height: 900 });
  await failedWebGL.goto(new URL('/en', base).href, { waitUntil: 'networkidle0' });
  await failedWebGL.waitForFunction(() => document.querySelector('.workspace-environment')?.dataset.render === 'fallback', { timeout: 5000 });
  assert.deepEqual(await failedWebGL.$$eval('.hero-line', (lines) => lines.map((line) => line.textContent.trim())), ['AI that gets', 'work done.']);
  assert(await failedWebGL.$('.tool-theatre .tool-question'), 'Stories remain readable when WebGL is unavailable');
  await failedWebGL.close();

  for (const reduced of [false, true]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }]);
    await page.evaluateOnNewDocument(() => localStorage.setItem('lang', 'en'));
    const writes = [];
    page.on('request', (req) => { if (req.method() !== 'GET') writes.push(req.url()); });
    await page.goto(new URL('/en/sales-outreach', base).href, { waitUntil: 'networkidle0' });
    const initialStep = reduced ? '3' : '0';
    await page.waitForFunction((step) => [...document.querySelectorAll('.tool-theatre')].every((scene) => scene.dataset.step === step), { timeout: 5000 }, initialStep);
    assert.equal(await page.$$eval('.tool-theatre', (scenes, step) => scenes.every((scene) => scene.dataset.step === step), initialStep), true, `Story starts at step ${initialStep}`);
    if (!reduced) {
      const range = await page.$eval('.story-track', (track) => {
        const top = track.getBoundingClientRect().top + scrollY;
        return [top - 88, top + track.offsetHeight - innerHeight];
      });
      const positions = [0.18, 0.42, 0.68, 0.92].map((part) => range[0] + (range[1] - range[0]) * part);
      for (const [index, y] of positions.entries()) {
        await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y);
        await page.waitForFunction((step) => Number(document.querySelector('.tool-theatre').dataset.step) === step, { timeout: 2500 }, Math.min(3, index));
      }
      await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), positions[1]);
      await page.waitForFunction(() => Number(document.querySelector('.tool-theatre').dataset.step) < 3, { timeout: 2500 });
      assert.equal(await page.$eval('.tool-theatre', (el) => el.dataset.step), '1', 'Scrolling backwards rewinds the story state');
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await page.waitForFunction(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      assert.equal(await page.$eval('.tool-question', (el) => getComputedStyle(el).visibility === 'visible' && el.textContent.trim().length > 0), true, 'Story content stays readable after resizing to a phone');
      await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
      await page.waitForFunction(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await page.waitForFunction(() => document.querySelector('.tool-theatre')?.dataset.step === '3', { timeout: 2500 });
      assert.equal(await page.$eval('.tool-result strong', (el) => getComputedStyle(el).visibility === 'visible' && el.textContent.trim().length > 0), true, 'Reduced motion completes the scene mid-session');
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    }
    await page.$eval('.ib-panel', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    // Both illustrations should be readable in under 2.5 seconds, independent of scrolling.
    await page.waitForFunction(() => [...document.querySelectorAll('.ib-w')].every((el) => getComputedStyle(el).visibility === 'visible'), { timeout: 2500 });
    assert.equal(await page.$eval('.ib-approve', (el) => el.disabled), false, 'Approval must wait for the visitor');
    assert.equal(await page.$eval('.ib-approve', (el) => !!el.closest('[aria-hidden="true"]')), false, 'Control must be accessible');
    await page.focus('.ib-approve');
    await page.keyboard.press('Enter');
    assert.equal(await page.$eval('.ib-approve', (el) => el.disabled), true);
    assert.equal(await page.$eval('.ib-panel [role="status"]', (el) => el.textContent), 'Reply approved and sent');
    await page.click('header button[aria-label="Italiano"]');
    await page.waitForFunction(() => document.documentElement.lang === 'it');
    assert.equal(await page.$eval('.ib-panel [role="status"]', (el) => el.textContent), 'Risposta approvata e inviata');
    if (!reduced) {
      await page.click('.ib-panel .demo-replay');
      assert.equal(await page.$eval('.ib-approve', (el) => el.disabled), false, 'Replay must reset approval');
      assert.equal(await page.$eval('.ib-panel [role="status"]', (el) => el.textContent), '');
      // Approval during replay must immediately show the complete draft, without a queued animation undoing it.
      await page.click('.ib-approve');
      assert.equal(await page.$$eval('.ib-w', (els) => els.every((el) => getComputedStyle(el).visibility === 'visible')), true);
      await page.goto(new URL('/it/customer-support', base).href, { waitUntil: 'networkidle0' });
      await page.$eval('.ch-panel', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction(() => [...document.querySelectorAll('.ch-w')].every((el) => getComputedStyle(el).visibility === 'visible'), { timeout: 2500 });
      await page.click('.ch-panel .demo-replay');
      await page.waitForFunction(() => [...document.querySelectorAll('.ch-w')].every((el) => getComputedStyle(el).visibility === 'visible'), { timeout: 2500 });
    } else {
      await page.click('.ib-panel .demo-replay');
      assert.equal(await page.$eval('.ib-approve', (el) => el.disabled), false, 'Reduced motion must still allow resetting approval');
      assert.equal(await page.$$eval('.ib-w', (els) => els.every((el) => getComputedStyle(el).visibility === 'visible')), true);
    }
    assert.deepEqual(writes, [], 'Example controls must never send network writes');
    console.log(`${reduced ? 'Reduced' : 'Normal'} motion: approval, language switch, replay, and local-only behavior passed.`);
    await page.close();
  }
} finally {
  await fallbackBrowser?.close();
  await browser.close();
  await server?.close();
}
