import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1740, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(baseUrl + '/?view=portrait-styles', { waitUntil: 'networkidle' });
await page.waitForSelector('[data-portrait-style-lab="woodblock-v7"]');

const golden = page.locator('[data-golden-id]');
if ((await golden.count()) !== 12) throw new Error('Woodblock V7 must render exactly 12 Golden Residents.');

const allPortraits = page.locator('.portrait-style-portrait');
const haloStates = await allPortraits.evaluateAll((items) => items.map((item) => item.getAttribute('data-halo')));
if (haloStates.some((value) => value !== 'none')) throw new Error('Woodblock V7 must keep all backgrounds halo-free.');

const artSystems = await allPortraits.evaluateAll((items) => items.map((item) => item.getAttribute('data-art-system')));
if (artSystems.some((value) => value !== 'woodblock-v7')) throw new Error('Woodblock V7 page must contain only the woodblock art system.');

const women = golden.locator('.portrait-style-portrait[data-gender="female"]');
if ((await women.count()) < 6) throw new Error('Woodblock V7 Golden set needs at least 6 female residents.');

const children = golden.locator('.portrait-style-portrait[data-life-stage="child"]');
if ((await children.count()) < 2) throw new Error('Woodblock V7 Golden set needs a boy and a girl.');

const elders = golden.locator('.portrait-style-portrait[data-life-stage="elder"]');
if ((await elders.count()) < 3) throw new Error('Woodblock V7 Golden set needs explicit elder coverage.');

const hairCards = page.locator('[data-hair-review]');
if ((await hairCards.count()) !== 8) throw new Error('Woodblock V7 hair review must render 8 Chinese historical female hair baselines.');

const culturalHair = page.locator('.woodblock-hair-card > .portrait-style-portrait[data-hair-culture="chinese-historic"]');
if ((await culturalHair.count()) !== 8) throw new Error('Every V7 female hair review sample must use the chinese-historic culture family.');

const culturalStates = await culturalHair.evaluateAll((items) => items.map((item) => item.getAttribute('data-hair-cultural-state')));
if (culturalStates.some((value) => value !== 'ok')) throw new Error('Every V7 female hair review sample must pass cultural semantics validation.');

const deprecatedHairIds = ['female-child-side', 'female-youth-long', 'female-youth-long-side', 'female-adult-halfbound', 'female-middle-lowbun', 'female-elder-graybun', 'female-worker-tight'];
const renderedHairIds = await page.locator('.portrait-style-portrait[data-gender="female"]').evaluateAll((items) => items.map((item) => item.getAttribute('data-hair-id')));
if (renderedHairIds.some((id) => deprecatedHairIds.includes(id))) throw new Error('Deprecated generic / double-drop female hair must not render in Woodblock V7.');

const hairRigStates = await hairCards.locator('.portrait-style-portrait').evaluateAll((items) =>
  items.map((item) => item.getAttribute('data-hair-rig-state'))
);
if (hairRigStates.some((value) => value !== 'ok')) throw new Error('All V6 hair review samples must resolve against the portrait rig.');

const wealthCards = page.locator('[data-wealth-review]');
if ((await wealthCards.count()) !== 4) throw new Error('Woodblock V7 must show all four wealth tiers.');

const crowd = page.locator('[data-crowd-id]');
if ((await crowd.count()) !== 32) throw new Error('Woodblock V7 crowd review must render 32 stress samples.');

await page.screenshot({ path: outDir + '/17-woodblock-v7-golden-residents.png', fullPage: true });
await page.locator('[data-review-section="hair"]').screenshot({ path: outDir + '/18-woodblock-v7-female-cultural-hair.png' });
await page.locator('[data-review-section="wealth"]').screenshot({ path: outDir + '/19-woodblock-v7-wealth.png' });
await page.locator('[data-review-section="crowd"]').screenshot({ path: outDir + '/20-woodblock-v7-crowd.png' });

await browser.close();
