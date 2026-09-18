import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1740, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(baseUrl + '/?view=portrait-v8', { waitUntil: 'networkidle' });
await page.waitForSelector('[data-portrait-v8-lab="true"]');

if (await page.locator('[data-portrait-v8-lab="true"]').getAttribute('data-render-contract-version') !== '8.1') {
  throw new Error('Portrait Generator must expose render contract 8.1.');
}

const checks = page.locator('[data-v8-check]');
const states = await checks.evaluateAll((items)=>items.map((item)=>[item.getAttribute('data-v8-check'),item.getAttribute('data-state')]));
if (states.some(([,state])=>state !== 'pass')) {
  throw new Error('Portrait Generator V8.1 invariant failed: '+JSON.stringify(states));
}

const renderers = page.locator('.portrait-v8-renderer');
const versions = await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-generator-version')));
if (versions.some((value)=>value !== '8')) throw new Error('Every V8.1 renderer must use generatorVersion 8.');

const contracts = await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-render-contract')));
if (contracts.some((value)=>value !== '8.1')) throw new Error('Every renderer must use render contract 8.1.');

const maskStates = await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-mask-contract')));
if (maskStates.some((value)=>value !== 'active')) throw new Error('Every V8.1 renderer must activate mask contract.');

const wealthCards = page.locator('[data-v8-section="wealth-invariant"] .v8-card');
const wealthFingerprints = await wealthCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-identity-fingerprint')));
if (new Set(wealthFingerprints).size !== 1) throw new Error('Wealth changes must not alter IdentityDNA.');

const temporalCards = page.locator('[data-v8-section="temporal"] .v8-card');
const temporalFingerprints = await temporalCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-identity-fingerprint')));
const morphologyFingerprints = await temporalCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-morphology-fingerprint')));
if (new Set(temporalFingerprints).size !== 1 || new Set(morphologyFingerprints).size !== 1) {
  throw new Error('Temporal aging must preserve IdentityDNA and IdentityMorphology.');
}

const contractCards = page.locator('[data-v8-section="render-contract"] .v8-card');
if ((await contractCards.count()) !== 2) throw new Error('V8.1 low-bun contract review must show adult and elder.');
const contractHair = await contractCards.locator('.portrait-v8-renderer').evaluateAll((items)=>items.map((item)=>item.getAttribute('data-hair-bundle')));
if (new Set(contractHair).size !== 1 || contractHair[0] !== 'hair.female.adult-low-bun.v1') {
  throw new Error('V8.1 contract review must force the same adult-low-bun bundle across HeadProfiles.');
}
const contractHeads = await contractCards.locator('.portrait-v8-renderer').evaluateAll((items)=>items.map((item)=>item.getAttribute('data-head-profile')));
if (new Set(contractHeads).size !== 2) throw new Error('V8.1 low-bun must resolve on two distinct HeadProfiles.');

const maskedCounts = await contractCards.locator('.portrait-v8-renderer').evaluateAll((items)=>items.map((item)=>Number(item.getAttribute('data-masked-layer-count'))));
const localCounts = await contractCards.locator('.portrait-v8-renderer').evaluateAll((items)=>items.map((item)=>Number(item.getAttribute('data-local-placement-count'))));
if (maskedCounts.some((value)=>value < 3) || localCounts.some((value)=>value < 3)) {
  throw new Error('V8.1 low-bun must actually use masked and local-placed layers.');
}

const bundles = page.locator('[data-bundle-showcase]');
if ((await bundles.count()) !== 4) throw new Error('V8.1 must showcase four formal Hair Bundles.');

const crowd = page.locator('[data-pop-resident]');
if ((await crowd.count()) !== 64) throw new Error('V8.1 population review must render exactly 64 residents.');

await page.screenshot({ path: outDir + '/21-portrait-generator-v8-1-overview.png', fullPage: true });
await page.locator('[data-v8-section="wealth-invariant"]').screenshot({ path: outDir + '/22-v8-1-identity-presentation.png' });
await page.locator('[data-v8-section="temporal"]').screenshot({ path: outDir + '/23-v8-1-temporal-identity.png' });
await page.locator('[data-v8-section="render-contract"]').screenshot({ path: outDir + '/24-v8-1-low-bun-render-contract.png' });
await page.locator('[data-v8-section="bundles"]').screenshot({ path: outDir + '/25-v8-1-asset-bundles-lod.png' });
await page.locator('[data-v8-section="population"]').screenshot({ path: outDir + '/26-v8-1-population-diversity.png' });

await browser.close();
