import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl=process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir='review-screenshots';
await mkdir(outDir,{recursive:true});

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1740,height:1200},deviceScaleFactor:1});
await page.goto(baseUrl+'/?view=portraits',{waitUntil:'networkidle'});
await page.waitForSelector('[data-portrait-lab="true"]');

const contract=await page.locator('[data-portrait-lab]').getAttribute('data-render-contract-version');
if(contract!=='8.4') throw new Error('Expected V8.4 render contract, got '+contract);

const checks=await page.locator('[data-v8-check]').evaluateAll((items)=>items.map((item)=>[item.getAttribute('data-v8-check'),item.getAttribute('data-state')]));
if(checks.some(([,state])=>state!=='pass')) throw new Error('V8.4 invariant failed: '+JSON.stringify(checks));

const renderers=page.locator('.portrait-renderer');
const contracts=await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-render-contract')));
if(contracts.some((value)=>value!=='8.4')) throw new Error('Every renderer must use contract 8.4.');

const wealthCards=page.locator('[data-v8-section="wealth-invariant"] [data-identity-fingerprint]');
const wealthIds=await wealthCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-identity-fingerprint')));
if(new Set(wealthIds).size!==1) throw new Error('Wealth changed identity.');

const temporalCards=page.locator('[data-v8-section="temporal"] [data-identity-fingerprint]');
const temporalIds=await temporalCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-identity-fingerprint')));
if(new Set(temporalIds).size!==1) throw new Error('Life stage changed identity.');

if(await page.locator('[data-face-family-card]').count()!==10) throw new Error('V8.4 must show ten female/male FaceFamily assets.');
if(await page.locator('[data-hair-style-card]').count()!==8) throw new Error('V8.4 must show eight female/male HairStyle assets.');
if(await page.locator('[data-pop-resident]').count()!==24) throw new Error('V8.4 crowd review must show 24 seeded residents.');

await page.screenshot({path:outDir+'/42-v8-4-simple-portrait-overview.png',fullPage:true});
await page.locator('[data-v8-section="face-families"]').screenshot({path:outDir+'/43-v8-4-face-families.png'});
await page.locator('[data-v8-section="temporal"]').screenshot({path:outDir+'/44-v8-4-life-stage.png'});
await page.locator('[data-v8-section="hair-art"]').screenshot({path:outDir+'/45-v8-4-hair-art.png'});
await page.locator('[data-v8-section="age-direction"]').screenshot({path:outDir+'/46-v8-4-age-direction.png'});
await page.locator('[data-v8-section="crowd"]').screenshot({path:outDir+'/47-v8-4-crowd.png'});

await browser.close();
