import { chromium } from 'playwright';

const baseUrl = process.env.REVIEW_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

try {
  await page.goto(`${baseUrl}/?view=portraits`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.portrait-lab-card');

  const cards = page.locator('.portrait-lab-card');
  if ((await cards.count()) !== 64) throw new Error('Portrait Art V2 quality gate expects exactly 64 review portraits.');

  const badCards = await cards.evaluateAll((items) => items
    .filter((item) => item.getAttribute('data-rig-errors') !== '0' || item.getAttribute('data-rig-warnings') !== '0')
    .map((item) => ({
      name: item.querySelector('b')?.textContent?.trim(),
      errors: item.getAttribute('data-rig-errors'),
      warnings: item.getAttribute('data-rig-warnings'),
      hair: item.getAttribute('data-hair-id'),
      outfit: item.getAttribute('data-outfit-id'),
    })));
  if (badCards.length) throw new Error(`Portrait Art V2 generated rejected/warning combinations: ${JSON.stringify(badCards)}`);

  const portraits = page.locator('.portrait-lab-card .generated-portrait');
  const artContract = await portraits.evaluateAll((items) => items.map((item) => ({
    kit: item.getAttribute('data-art-kit'),
    halo: item.getAttribute('data-halo'),
    background: item.getAttribute('data-background-style'),
    ratio: item.getAttribute('data-master-ratio'),
    safe: item.getAttribute('data-safe-area'),
    faceArtFamily: item.getAttribute('data-face-art-family'),
  })));

  if (artContract.some((item) => item.kit !== 'v2')) throw new Error('Portrait Art V2 renderer contract regressed.');
  if (artContract.some((item) => item.halo !== 'none' || item.background !== 'clean-flat')) throw new Error('Portrait background halo was reintroduced.');
  if (artContract.some((item) => item.ratio !== '4:5' || item.safe !== '1:1')) throw new Error('Portrait master/safe-area contract regressed.');
  if (artContract.some((item) => !item.faceArtFamily)) throw new Error('A portrait is missing its V2 face art family.');
  if ((await page.locator('[data-portrait-halo]').count()) !== 0) throw new Error('A halo element exists in Portrait Art V2.');

  const heading = (await page.locator('.portrait-lab__eyebrow').innerText()).trim();
  if (!heading.includes('PORTRAIT ART KIT V2')) throw new Error(`Portrait lab is not labeled V2: ${heading}`);

  console.log('Portrait Art V2 quality gate passed: 64 portraits, zero errors, zero warnings, clean backgrounds, no halo.');
} finally {
  await browser.close();
}
