// Run after npm run build: node scripts/check-demo-controls.mjs [preview URL]
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { preview } from 'vite';

const server = process.argv[2] ? null : await preview({ logLevel: 'silent' });
const base = process.argv[2] || server.resolvedUrls.local[0];
const browser = await puppeteer.launch({ channel: process.env.CHROME_PATH ? undefined : 'chrome', executablePath: process.env.CHROME_PATH, headless: true });
try {
  for (const reduced of [false, true]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }]);
    await page.evaluateOnNewDocument(() => localStorage.setItem('lang', 'en'));
    const writes = [];
    page.on('request', (req) => { if (req.method() !== 'GET') writes.push(req.url()); });
    await page.goto(new URL('/en/sales-outreach', base).href, { waitUntil: 'networkidle0' });
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
  await browser.close();
  await server?.close();
}
