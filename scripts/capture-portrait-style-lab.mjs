import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1740, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(baseUrl + '/?view=portrait-styles', { waitUntil: 'networkidle' });
await page.waitForSelector('[data-portrait-style-lab="woodblock-v6"]');

const golden = page.locator('[data-golden-id]');
if ((await golden.count()) !== 12) throw new Error('Woodblock V6 must render exactly 12 Golden Residents.');

const allPortraits = page.locator('.portrait-style-portrait');
const haloStates = await allPortraits.evaluateAll((items) => items.map((item) => item.getAttribute('data-halo')));
if (haloStates.some((value) => value !== 'none')) throw new Error('Woodblock V6 must keep all backgrounds halo-free.');

const artSystems = await allPortraits.evaluateAll((items) => items.map((item) => item.getAttribute('data-art-system')));
if (artSystems.some((value) => value !== 'woodblock-v6')) throw new Error('Woodblock V6 page must contain only the woodblock art system.');

const women = golden.locator('.portrait-style-portrait[data-gender="female"]');
if ((await women.count()) < 6) throw new Error('Woodblock V6 Golden set needs at least 6 female residents.');

const children = golden.locator('.portrait-style-portrait[data-life-stage="child"]');
if ((await children.count()) < 2) throw new Error('Woodblock V6 Golden set needs a boy and a girl.');

const elders = golden.locator('.portrait-style-portrait[data-life-stage="elder"]');
if ((await elders.count()) < 3) throw new Error('Woodblock V6 Golden set needs explicit elder coverage.');

const hairCards = page.locator('[data-hair-review]');
if ((await hairCards.count()) !== 6) throw new Error('Woodblock V6 hair review must render 6 female hair baselines.');

const longHair = hairCards.locator('.portrait-style-portrait[data-hair-anchor-mode="temple-ear-shoulder"]');
if ((await longHair.count()) < 3) throw new Error('Woodblock V6 must validate at least 3 temple-ear-shoulder long hair samples.');

const hairRigStates = await hairCards.locator('.portrait-style-portrait').evaluateAll((items) =>
  items.map((item) => item.getAttribute('data-hair-rig-state'))
);
if (hairRigStates.some((value) => value !== 'ok')) throw new Error('All V6 hair review samples must resolve against the portrait rig.');

const wealthCards = page.locator('[data-wealth-review]');
if ((await wealthCards.count()) !== 4) throw new Error('Woodblock V6 must show all four wealth tiers.');

const crowd = page.locator('[data-crowd-id]');
if ((await crowd.count()) !== 32) throw new Error('Woodblock V6 crowd review must render 32 stress samples.');

await page.screenshot({ path: outDir + '/17-woodblock-v6-golden-residents.png', fullPage: true });
await page.locator('[data-review-section="hair"]').screenshot({ path: outDir + '/18-woodblock-v6-hair-stability.png' });
await page.locator('[data-review-section="wealth"]').screenshot({ path: outDir + '/19-woodblock-v6-wealth.png' });
await page.locator('[data-review-section="crowd"]').screenshot({ path: outDir + '/20-woodblock-v6-crowd.png' });

await browser.close();
