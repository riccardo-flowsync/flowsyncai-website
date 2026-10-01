// Run after npm run build: node scripts/check-booking-dots.mjs
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { preview } from 'vite';

const server = await preview({ logLevel: 'silent' });
const browser = await puppeteer.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('lang', 'en');
    window.dotPitches = [];
    const pitchLocations = new WeakSet();
    const getLocation = WebGL2RenderingContext.prototype.getUniformLocation;
    WebGL2RenderingContext.prototype.getUniformLocation = function (program, name) {
      const location = getLocation.call(this, program, name);
      if (name === 'uPitch' && location) pitchLocations.add(location);
      return location;
    };
    const original = WebGL2RenderingContext.prototype.uniform2f;
    WebGL2RenderingContext.prototype.uniform2f = function (location, x, y) {
      if (pitchLocations.has(location)) window.dotPitches.push([x, y]);
      return original.call(this, location, x, y);
    };
  });
  await page.goto(server.resolvedUrls.local[0]);
  assert.equal(await page.$eval('header a[aria-label*="home"]', (el) => el.textContent), 'FlowSync AI Solutions');
  await page.$eval('#book', (el) => el.scrollIntoView());
  await page.waitForFunction(() => window.dotPitches.length > 0);
  const before = await page.evaluate(() => window.dotPitches.length);
  await page.$eval('#book button', (el) => el.parentElement.querySelectorAll('button')[1].click());
  await page.waitForFunction((n) => window.dotPitches.length > n, {}, before);
  await new Promise((resolve) => setTimeout(resolve, 700));
  const pitches = await page.evaluate(() => window.dotPitches);
  assert(pitches.every(([x, y]) => x > 0 && y > 0), 'Hidden calendar collapsed the dot spacing');
  console.log('Full name visible; dot spacing stays positive after opening the message form.');
} finally {
  await browser.close();
  await server.close();
}
