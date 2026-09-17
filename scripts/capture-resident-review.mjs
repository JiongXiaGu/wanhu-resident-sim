import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.REVIEW_SCREENSHOT_DIR || 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });

async function open() {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('.resident-panel');
  await page.waitForSelector('.dev-panel');
  await page.waitForTimeout(180);
}

await open();

if ((await page.locator('.resident-summary').count()) !== 0) {
  throw new Error('Resident Panel should not render a standalone recent-summary row.');
}

await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.dev-reopen');
await page.screenshot({ path: `${outDir}/01-player-resident.png` });

await page.getByRole('button', { name: 'DEV', exact: true }).click();
await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.waitForTimeout(80);
await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.life-event-card');
if ((await page.locator('.life-event-prior').count()) < 1) {
  throw new Error('LifeEvent V2 should retain the previous stage as lightweight context after advancing.');
}
await page.screenshot({ path: `${outDir}/02-life-event-continuation.png` });

const historyButton = page.getByRole('button', { name: /人生经历/ });
await historyButton.click();
await page.waitForSelector('.resident-history-mode');
if ((await page.locator('.resident-activity').count()) !== 0) {
  throw new Error('Life history mode must hide the current activity section.');
}
if ((await page.locator('.resident-recent').count()) !== 0) {
  throw new Error('Life history mode must hide the current LifeEvent section.');
}
if ((await page.locator('.resident-routine-section').count()) !== 0) {
  throw new Error('Life history mode must hide routine entries.');
}
if ((await page.locator('.resident-history-hero').count()) !== 1) {
  throw new Error('Life history mode should render a dedicated biography header.');
}
if ((await page.locator('.resident-life-timeline').count()) !== 1) {
  throw new Error('Life history mode should render the life chapter timeline.');
}

const storyChapter = page.locator('.resident-life-chapter.has-story button').first();
if ((await storyChapter.count()) > 0) {
  await storyChapter.click();
  await page.waitForSelector('.resident-life-story');
}
await page.screenshot({ path: `${outDir}/03-life-history.png` });

await page.getByRole('button', { name: 'DEV', exact: true }).click();
await page.getByRole('button', { name: '下一居民', exact: true }).click();
await page.waitForTimeout(100);
await page.screenshot({ path: `${outDir}/04-dev-density.png` });

await browser.close();
