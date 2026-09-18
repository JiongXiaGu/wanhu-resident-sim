import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1740, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(baseUrl + '/?view=portrait-v8', { waitUntil: 'networkidle' });
await page.waitForSelector('[data-portrait-v8-lab="true"]');

const contractVersion = await page.locator('[data-portrait-v8-lab="true"]').getAttribute('data-render-contract-version');
if (contractVersion !== '8.2') {
  throw new Error('Portrait Generator must expose render contract 8.2, got '+contractVersion);
}

const checks = page.locator('[data-v8-check]');
const states = await checks.evaluateAll((items)=>items.map((item)=>[item.getAttribute('data-v8-check'),item.getAttribute('data-state')]));
if (states.some(([,state])=>state !== 'pass')) {
  throw new Error('Portrait Generator V8.2 invariant failed: '+JSON.stringify(states));
}

const renderers = page.locator('.portrait-v8-renderer');
const versions = await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-generator-version')));
if (versions.some((value)=>value !== '8')) throw new Error('Every V8.2 renderer must use generatorVersion 8.');

const contracts = await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-render-contract')));
if (contracts.some((value)=>value !== '8.2')) throw new Error('Every renderer must use render contract 8.2.');

const maskStates = await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-mask-contract')));
if (maskStates.some((value)=>value !== 'active')) throw new Error('Every V8.2 renderer must activate mask contract.');

const wealthCards = page.locator('[data-v8-section="wealth-invariant"] .v8-card');
const wealthFingerprints = await wealthCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-identity-fingerprint')));
if (new Set(wealthFingerprints).size !== 1) throw new Error('Wealth changes must not alter IdentityDNA.');

const temporalCards = page.locator('[data-v8-section="temporal"] .v8-card');
const temporalFingerprints = await temporalCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-identity-fingerprint')));
const morphologyFingerprints = await temporalCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-morphology-fingerprint')));
if (new Set(temporalFingerprints).size !== 1 || new Set(morphologyFingerprints).size !== 1) {
  throw new Error('Temporal aging must preserve IdentityDNA and IdentityMorphology.');
}

const auditCards = page.locator('[data-bundle-audit]');
if ((await auditCards.count()) !== 4) throw new Error('V8.2 must audit exactly 4 formal Hair Bundles.');
const auditStates = await auditCards.evaluateAll((items)=>items.map((item)=>[item.getAttribute('data-bundle-audit'),item.getAttribute('data-state')]));
if (auditStates.some(([,state])=>state !== 'pass')) {
  throw new Error('V8.2 Hair Bundle audit failed: '+JSON.stringify(auditStates));
}

const contractCards = page.locator('[data-bundle-contract]');
if ((await contractCards.count()) !== 7) throw new Error('V8.2 bundle contract review must render 7 compatibility samples.');

const expectedBundleCounts = new Map([
  ['hair.female.girl-double-bun.v1',1],
  ['hair.female.young-halfbound-backfall.v1',2],
  ['hair.female.adult-low-bun.v1',2],
  ['hair.female.elder-gray-low-bun.v1',2],
]);

for (const [bundleId,expected] of expectedBundleCounts) {
  const cards = page.locator('[data-bundle-contract="'+bundleId+'"]');
  if ((await cards.count()) !== expected) {
    throw new Error('Unexpected V8.2 contract sample count for '+bundleId);
  }
  const renderersForBundle = cards.locator('.portrait-v8-renderer');
  const maskedCounts = await renderersForBundle.evaluateAll((items)=>items.map((item)=>Number(item.getAttribute('data-masked-layer-count'))));
  const localCounts = await renderersForBundle.evaluateAll((items)=>items.map((item)=>Number(item.getAttribute('data-local-placement-count'))));
  if (maskedCounts.some((value)=>value < 2) || localCounts.some((value)=>value < 2)) {
    throw new Error('V8.2 bundle does not actually use masked/local layers: '+bundleId);
  }
}

const youthHeads = await page.locator('[data-bundle-contract="hair.female.young-halfbound-backfall.v1"] .portrait-v8-renderer')
  .evaluateAll((items)=>items.map((item)=>item.getAttribute('data-head-profile')));
if (new Set(youthHeads).size !== 2) throw new Error('Halfbound bundle must resolve on youth and adult HeadProfiles.');

const lowBunHeads = await page.locator('[data-bundle-contract="hair.female.adult-low-bun.v1"] .portrait-v8-renderer')
  .evaluateAll((items)=>items.map((item)=>item.getAttribute('data-head-profile')));
if (new Set(lowBunHeads).size !== 2) throw new Error('Adult low bun must resolve on adult and elder HeadProfiles.');

const grayBunHeads = await page.locator('[data-bundle-contract="hair.female.elder-gray-low-bun.v1"] .portrait-v8-renderer')
  .evaluateAll((items)=>items.map((item)=>item.getAttribute('data-head-profile')));
if (new Set(grayBunHeads).size !== 2) throw new Error('Gray bun must resolve on adult/middle and elder HeadProfiles.');

const bundles = page.locator('[data-bundle-showcase]');
if ((await bundles.count()) !== 4) throw new Error('V8.2 must showcase four formal Hair Bundles.');

const crowd = page.locator('[data-pop-resident]');
if ((await crowd.count()) !== 64) throw new Error('V8.2 population review must render exactly 64 residents.');

await page.screenshot({ path: outDir + '/27-portrait-generator-v8-2-overview.png', fullPage: true });
await page.locator('[data-v8-section="bundle-contract"]').screenshot({ path: outDir + '/28-v8-2-formal-hair-contract.png' });
const ageDirection = page.locator('[data-age-direction]');
if ((await ageDirection.count()) !== 5) throw new Error('V8.3 age-direction review must render five life-stage staging profiles.');
const stageProfiles = await ageDirection.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-stage-profile')));
if (new Set(stageProfiles).size !== 5) throw new Error('V8.3 age-direction review must resolve five distinct stage profiles.');
await page.locator('[data-v8-section="age-direction"]').screenshot({ path: outDir + '/39-v8-3-age-direction.png' });
await page.locator('[data-v8-section="art-review"]').screenshot({ path: outDir + '/37-v8-3-manual-art-review.png' });
await page.locator('[data-v8-section="asset-audit"]').screenshot({ path: outDir + '/29-v8-2-asset-audit.png' });
await page.locator('[data-v8-section="bundles"]').screenshot({ path: outDir + '/30-v8-2-asset-bundles-lod.png' });
const artCards = page.locator('[data-art-review]');
if ((await artCards.count()) !== 7) throw new Error('V8.3 manual art review must render all 7 compatibility samples.');
for (let index=0; index<await artCards.count(); index+=1) {
  await artCards.nth(index).screenshot({ path: outDir + '/38-v8-3-art-'+String(index+1).padStart(2,'0')+'.png' });
}
await page.locator('[data-bundle-contract] svg > g[fill="none"][stroke-width=".6"]').evaluateAll((items)=>items.forEach((item)=>{ item.style.display='none'; }));
await page.locator('[data-bundle-contract="hair.female.adult-low-bun.v1"]').nth(0).screenshot({ path: outDir + '/33-v8-2-adult-low-bun-adult.png' });
await page.locator('[data-bundle-contract="hair.female.adult-low-bun.v1"]').nth(1).screenshot({ path: outDir + '/34-v8-2-adult-low-bun-elder.png' });
await page.locator('[data-bundle-contract="hair.female.elder-gray-low-bun.v1"]').nth(0).screenshot({ path: outDir + '/35-v8-2-elder-gray-low-bun-middle.png' });
await page.locator('[data-bundle-contract="hair.female.elder-gray-low-bun.v1"]').nth(1).screenshot({ path: outDir + '/36-v8-2-elder-gray-low-bun-elder.png' });
await page.locator('[data-v8-section="temporal"]').screenshot({ path: outDir + '/31-v8-2-temporal-identity.png' });
await page.locator('[data-v8-section="population"]').screenshot({ path: outDir + '/32-v8-2-population-diversity.png' });

await browser.close();
