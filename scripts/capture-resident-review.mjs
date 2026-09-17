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

// Clean player view: one selected resident, recent life feed visible, development UI hidden.
await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.dev-reopen');
await page.screenshot({ path: `${outDir}/01-player-resident.png` });

// Reopen development controls, advance the same resident into the next authored node,
// then hide development UI again. The screenshot must retain the previous node as context.
await page.getByRole('button', { name: 'DEV', exact: true }).click();
await page.getByRole('button', { name: '推进节点', exact: true }).click();
await page.waitForTimeout(80);
await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.life-entry.is-featured');
if ((await page.locator('.life-entry--story').count()) < 2) {
  throw new Error('After advancing a story, the resident LifeLog should retain at least two story entries.');
}
await page.screenshot({ path: `${outDir}/02-story-continuation.png` });

// Expanded recent history should mix authored story nodes with short routine records.
const historyButton = page.locator('.resident-panel__footer button');
await historyButton.click();
await page.waitForTimeout(80);
if ((await page.locator('.life-entry--routine').count()) < 1) {
  throw new Error('Expanded resident history should contain routine life records.');
}
await page.screenshot({ path: `${outDir}/03-history-expanded.png` });

// Switch resident and keep development density information visible for review.
await page.getByRole('button', { name: 'DEV', exact: true }).click();
await page.getByRole('button', { name: '下一居民', exact: true }).click();
await page.waitForTimeout(100);
await page.screenshot({ path: `${outDir}/04-dev-density.png` });

await browser.close();
