import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(baseUrl + '/?view=portrait-styles', { waitUntil: 'networkidle' });
await page.waitForSelector('.portrait-style-row');

const rows = page.locator('.portrait-style-row');
if ((await rows.count()) !== 8) throw new Error('Portrait Style Lab V5 must render exactly 8 Golden Residents.');

const cards = page.locator('.portrait-style-card');
if ((await cards.count()) !== 32) throw new Error('Portrait Style Lab V5 must render 8 residents x 4 independent style packs.');

const styles = ['woodblock', 'mural', 'baimiao', 'silk'];
for (const style of styles) {
  const styleCards = page.locator('.portrait-style-card[data-style="' + style + '"]');
  if ((await styleCards.count()) !== 8) throw new Error('V5 style ' + style + ' must render all 8 Golden Residents.');
}

for (let index = 0; index < 8; index += 1) {
  const row = rows.nth(index);
  if ((await row.locator('.portrait-style-card').count()) !== 4) {
    throw new Error('Each Golden Resident must contain all four independent V5 style packs.');
  }

  const identities = await row.locator('.portrait-style-card__hero .portrait-style-portrait').evaluateAll((items) =>
    items.map((item) => item.getAttribute('data-identity-source'))
  );
  if (new Set(identities).size !== 1) throw new Error('All four V5 art systems must still describe the same resident identity.');

  const artSystems = await row.locator('.portrait-style-card__hero .portrait-style-portrait').evaluateAll((items) =>
    items.map((item) => item.getAttribute('data-art-system'))
  );
  if (new Set(artSystems).size !== 4) throw new Error('V5 requires four genuinely separate geometry / art systems.');
}

const haloStates = await page.locator('.portrait-style-portrait').evaluateAll((items) =>
  items.map((item) => item.getAttribute('data-halo'))
);
if (haloStates.some((value) => value !== 'none')) throw new Error('Portrait Style Lab V5 must keep every background halo-free.');

await page.screenshot({ path: outDir + '/17-portrait-style-lab-v5-four-artists.png', fullPage: true });

for (const style of styles) {
  await page.locator('[data-style-heading="' + style + '"]').click();
  await page.waitForTimeout(60);
  await rows.first().screenshot({ path: outDir + '/18-portrait-style-lab-v5-' + style + '-size-review.png' });
  await page.locator('[data-style-heading="' + style + '"]').click();
}

await browser.close();
