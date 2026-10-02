// Record the home story in Chrome and save repeatable review captures.
// Run after `npm run build`: node scripts/record-cinematic.mjs [preview URL]
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';
import { preview } from 'vite';

process.env.PATH = `/opt/homebrew/bin:${process.env.PATH || ''}`;
const output = resolve('.impeccable/review');
await mkdir(output, { recursive: true });
const server = process.argv[2] ? null : await preview({ logLevel: 'silent' });
const base = process.argv[2] || server.resolvedUrls.local[0];
const origin = new URL(base).origin;
const browser = await puppeteer.launch({ headless: true, channel: process.env.CHROME_PATH ? undefined : 'chrome', executablePath: process.env.CHROME_PATH });
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const roomReady = (page) => page.waitForFunction(() => ['webgl', 'fallback'].includes(document.querySelector('.workspace-environment')?.dataset.render), { timeout: 12_000 });

async function moveTo(page, top, ms = 1800) {
  await page.evaluate(async ({ top, ms }) => {
    const start = scrollY, began = performance.now();
    await new Promise((done) => {
      const frame = (now) => {
        const progress = Math.min(1, (now - began) / ms);
        const eased = progress < 0.5 ? 2 * progress ** 2 : 1 - (-2 * progress + 2) ** 2 / 2;
        scrollTo(0, start + (top - start) * eased);
        if (progress < 1) requestAnimationFrame(frame); else done();
      };
      requestAnimationFrame(frame);
    });
  }, { top, ms });
}

async function capture(view) {
  const { name, width, height, mobile } = view;
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.evaluateOnNewDocument(() => localStorage.setItem('lang', 'en'));
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    if (request.method() !== 'GET' || (/^https?:/.test(url) && new URL(url).origin !== origin)) request.abort();
    else request.continue();
  });
  const video = `${output}/${name}.webm`;
  await page.goto(new URL('/en', base).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await roomReady(page);
  await sleep(1200);
  const recorder = await page.screencast({ path: video, fps: 24, quality: 30, ffmpegPath: '/opt/homebrew/bin/ffmpeg' });
  try {
    await sleep(2500);
    await page.screenshot({ path: `${output}/${name}.png` });
    const range = await page.$eval('.story-track', (track) => {
      const top = track.getBoundingClientRect().top + scrollY, height = track.offsetHeight, viewport = innerHeight;
      const wide = innerWidth >= 1000 && viewport >= 700;
      return [wide ? top - 88 : top - viewport * 0.65, wide ? top + height - viewport : top + height - viewport * 0.45];
    });
    const scene = range[0] + (range[1] - range[0]) * 0.62;
    await moveTo(page, scene, 2600);
    await page.waitForFunction(() => document.querySelector('.tool-theatre')?.dataset.step === '2', { timeout: 5000 });
    const complete = range[0] + (range[1] - range[0]) * 0.94;
    await moveTo(page, complete, 1800);
    await page.waitForFunction(() => document.querySelector('.tool-theatre')?.dataset.step === '3', { timeout: 5000 });
    await sleep(2500);
    await page.screenshot({ path: `${output}/${name}-story.png` });
    const reverse = range[0] + (range[1] - range[0]) * 0.25;
    await moveTo(page, reverse, 2600);
    await page.waitForFunction(() => ['0', '1'].includes(document.querySelector('.tool-theatre')?.dataset.step), { timeout: 5000 });
    const serviceLinkY = await page.$eval('.story-link', (link) => link.getBoundingClientRect().top + scrollY - innerHeight * 0.55);
    await moveTo(page, serviceLinkY, 1300);
    await page.waitForFunction(() => {
      const link = document.querySelector('.story-link');
      if (!link) return false;
      const box = link.getBoundingClientRect();
      return box.top >= 0 && box.bottom <= innerHeight;
    }, { timeout: 5000 });
    await sleep(1300);
    await page.click('.story-link');
    await page.waitForFunction(() => location.pathname === '/en/sales-outreach' && document.querySelector('main h1')?.textContent.includes('AI outreach') && scrollY < 2);
    await sleep(1800);
    if (name === 'desktop') {
      await roomReady(page);
      await page.evaluate(() => new Promise(requestAnimationFrame));
      await page.screenshot({ path: `${output}/outreach.png` });
    }
  } finally {
    await recorder.stop();
  }
  await page.close();
}

try {
  for (const view of [
    { name: 'desktop', width: 1440, height: 900, mobile: false },
    { name: 'mobile', width: 390, height: 844, mobile: true },
  ]) await capture(view);

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.goto(new URL('/en/customer-support', base).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await roomReady(page);
  await page.evaluate(() => new Promise(requestAnimationFrame));
  await sleep(700);
  await page.screenshot({ path: `${output}/agents.png` });
  await page.$eval('.story-interaction', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForFunction(() => [...document.querySelectorAll('.ch-w')].every((el) => getComputedStyle(el).visibility === 'visible'), { timeout: 5000 });
  await page.waitForFunction(() => [...document.querySelectorAll('.ch-act')].every((el) => getComputedStyle(el).visibility === 'visible'), { timeout: 5000 });
  await sleep(400);
  await page.screenshot({ path: `${output}/agent-action.png` });
  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await mobile.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await mobile.goto(new URL('/en/customer-support', base).href, { waitUntil: 'networkidle0' });
  await mobile.evaluate(() => document.fonts.ready);
  await mobile.$eval('.ch-panel', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await mobile.waitForFunction(() => [...document.querySelectorAll('.ch-w, .ch-act')].every((el) => getComputedStyle(el).visibility === 'visible'), { timeout: 5000 });
  await sleep(300);
  await mobile.screenshot({ path: `${output}/mobileagent-action.png` });
  await mobile.close();
  await page.goto(new URL('/en/contact', base).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await sleep(250);
  await page.screenshot({ path: `${output}/contact.png` });
  await page.close();

  const home = await browser.newPage();
  await home.setViewport({ width: 1470, height: 830 });
  await home.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await home.goto(new URL('/en', base).href, { waitUntil: 'networkidle0' });
  await home.evaluate(() => document.fonts.ready);
  await roomReady(home);
  await home.evaluate(() => new Promise(requestAnimationFrame));
  await home.screenshot({ path: `${output}/user-1470.png` });
  await home.close();
  console.log(`Saved desktop/mobile recordings and captures in ${output}`);
} finally {
  await browser.close();
  await server?.close();
}
