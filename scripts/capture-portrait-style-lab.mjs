import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1720, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(baseUrl + '/?view=portrait-styles', { waitUntil: 'networkidle' });
await page.waitForSelector('.portrait-style-row');

const rows = page.locator('.portrait-style-row');
if ((await rows.count()) !== 8) throw new Error('Portrait Style Lab must render exactly 8 Golden Residents.');

const cards = page.locator('.portrait-style-card');
if ((await cards.count()) !== 32) throw new Error('Portrait Style Lab must render 8 residents x 4 styles.');

for (const style of ['paper-cut', 'ink-flat', 'woodblock', 'painterly']) {
  const styleCards = page.locator('.portrait-style-card[data-style="' + style + '"]');
  if ((await styleCards.count()) !== 8) throw new Error('Style ' + style + ' must render all 8 Golden Residents.');
}

for (let index = 0; index < 8; index += 1) {
  if ((await rows.nth(index).locator('.portrait-style-card').count()) !== 4) {
    throw new Error('Each Golden Resident row must contain all four art directions.');
  }
}

const haloStates = await page.locator('.portrait-style-portrait').evaluateAll((items) =>
  items.map((item) => item.getAttribute('data-halo'))
);
if (haloStates.some((value) => value !== 'none')) throw new Error('Portrait Style Lab must keep every background halo-free.');

const residentIdentity = await rows.first().locator('.portrait-style-card__hero .portrait-style-portrait').evaluateAll((items) =>
  items.map((item) => [item.getAttribute('data-face-asset'), item.getAttribute('data-hair-asset')].join('|'))
);
if (new Set(residentIdentity).size !== 1) throw new Error('A comparison row must keep the same identity assets across all four styles.');

await page.screenshot({ path: outDir + '/17-portrait-style-lab-v3.png', fullPage: true });

await page.locator('[data-style-heading="woodblock"]').click();
await page.waitForTimeout(80);
await rows.first().screenshot({ path: outDir + '/18-portrait-style-lab-v3-size-review.png' });

await browser.close();
