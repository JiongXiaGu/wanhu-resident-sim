import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1740, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(baseUrl + '/?view=portrait-v8', { waitUntil: 'networkidle' });
await page.waitForSelector('[data-portrait-v8-lab="true"]');

const checks = page.locator('[data-v8-check]');
const states = await checks.evaluateAll((items)=>items.map((item)=>[item.getAttribute('data-v8-check'),item.getAttribute('data-state')]));
if (states.some(([,state])=>state !== 'pass')) {
  throw new Error('Portrait Generator V8 invariant failed: '+JSON.stringify(states));
}

const renderers = page.locator('.portrait-v8-renderer');
const versions = await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-generator-version')));
if (versions.some((value)=>value !== '8')) throw new Error('Every V8 renderer must use generatorVersion 8.');

const rendererKinds = await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-renderer')));
if (rendererKinds.some((value)=>value !== 'render-plan')) throw new Error('V8 must render exclusively from RenderPlan.');

const haloStates = await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-halo')));
if (haloStates.some((value)=>value !== 'none')) throw new Error('V8 portraits must remain halo-free.');

const wealthCards = page.locator('[data-v8-section="wealth-invariant"] .v8-card');
const wealthFingerprints = await wealthCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-identity-fingerprint')));
if (new Set(wealthFingerprints).size !== 1) throw new Error('Wealth changes must not alter IdentityDNA.');

const temporalCards = page.locator('[data-v8-section="temporal"] .v8-card');
const temporalFingerprints = await temporalCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-identity-fingerprint')));
if (new Set(temporalFingerprints).size !== 1) throw new Error('Temporal aging must preserve IdentityDNA.');

const temporalHeads = await temporalCards.locator('.portrait-v8-renderer').evaluateAll((items)=>items.map((item)=>item.getAttribute('data-head-profile')));
if (new Set(temporalHeads).size < 4) throw new Error('Temporal V8 sample must traverse four HeadProfiles.');

const bundles = page.locator('[data-bundle-showcase]');
if ((await bundles.count()) !== 4) throw new Error('V8 must showcase four migrated formal Hair Bundles.');
const bundleIds = await bundles.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-bundle-showcase')));
if (new Set(bundleIds).size !== 4) throw new Error('V8 Hair Bundle showcase contains duplicates.');

const crowd = page.locator('[data-pop-resident]');
if ((await crowd.count()) !== 64) throw new Error('V8 population review must render exactly 64 residents.');

await page.screenshot({ path: outDir + '/21-portrait-generator-v8-overview.png', fullPage: true });
await page.locator('[data-v8-section="wealth-invariant"]').screenshot({ path: outDir + '/22-v8-identity-presentation.png' });
await page.locator('[data-v8-section="temporal"]').screenshot({ path: outDir + '/23-v8-temporal-identity.png' });
await page.locator('[data-v8-section="bundles"]').screenshot({ path: outDir + '/24-v8-asset-bundles-lod.png' });
await page.locator('[data-v8-section="population"]').screenshot({ path: outDir + '/25-v8-population-diversity.png' });

await browser.close();
