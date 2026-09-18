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
if(contract!=='8.4') throw new Error('Expected compatibility render contract 8.4, got '+contract);

const frameContract=await page.locator('[data-portrait-lab]').getAttribute('data-frame-contract');
if(frameContract!=='three-band') throw new Error('Expected three-band portrait frame contract.');

const checks=await page.locator('[data-portrait-check]').evaluateAll((items)=>items.map((item)=>[item.getAttribute('data-portrait-check'),item.getAttribute('data-state')]));
if(checks.some(([,state])=>state!=='pass')) throw new Error('Portrait invariant failed: '+JSON.stringify(checks));

const renderers=page.locator('.portrait-renderer');
const contracts=await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-render-contract')));
if(contracts.some((value)=>value!=='8.4')) throw new Error('Every renderer must still use compatibility contract 8.4.');

const allowedFrames=new Set(['female.child','female.adult','female.elder','male.child','male.adult','male.elder']);
const renderedFrames=await renderers.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-frame-id')));
if(renderedFrames.some((value)=>!value||!allowedFrames.has(value))) throw new Error('Renderer emitted invalid portrait frame: '+JSON.stringify(renderedFrames));

const proof=page.locator('[data-female-adult-proof="true"]');
if(await proof.count()!==72) throw new Error('female.adult proof must render 72 Face × Hair × Outfit combinations.');
const proofFrames=await proof.locator('.portrait-renderer').evaluateAll((items)=>items.map((item)=>item.getAttribute('data-frame-id')));
if(proofFrames.some((value)=>value!=='female.adult')) throw new Error('female.adult proof escaped its fixed frame.');

const proofHair=new Set(await proof.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-proof-hair'))));
const proofOutfit=new Set(await proof.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-proof-outfit'))));
const proofFace=new Set(await proof.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-proof-face'))));
if(proofFace.size!==6||proofHair.size!==3||proofOutfit.size!==4) throw new Error('female.adult proof coverage mismatch.');

const wealthCards=page.locator('[data-portrait-section="female-adult-outfits"] [data-female-adult-outfit]');
if(await wealthCards.count()!==4) throw new Error('female.adult must show four outfit assets.');

const temporalCards=page.locator('[data-portrait-section="temporal"] [data-identity-fingerprint]');
if(await temporalCards.count()!==3) throw new Error('Three-band review must show child/adult/elder.');
const temporalIds=await temporalCards.evaluateAll((items)=>items.map((item)=>item.getAttribute('data-identity-fingerprint')));
if(new Set(temporalIds).size!==1) throw new Error('Age band changed identity.');

if(await page.locator('[data-face-family-card]').count()!==10) throw new Error('Portrait review must show ten current FaceFamily assets.');
if(await page.locator('[data-hair-style-card]').count()!==8) throw new Error('Portrait review must show eight active HairStyle assets.');
if(await page.locator('[data-pop-resident]').count()!==24) throw new Error('Crowd review must show 24 seeded residents.');

await page.screenshot({path:outDir+'/42-portrait-overview.png',fullPage:true});
await page.locator('[data-portrait-section="female-adult-proof"]').screenshot({path:outDir+'/43-female-adult-frame-proof.png'});
await page.locator('[data-portrait-section="female-adult-outfits"]').screenshot({path:outDir+'/44-female-adult-outfits.png'});
await page.locator('[data-portrait-section="face-families"]').screenshot({path:outDir+'/45-portrait-face-families.png'});
await page.locator('[data-portrait-section="hair-art"]').screenshot({path:outDir+'/46-portrait-hair-art.png'});
await page.locator('[data-portrait-section="crowd"]').screenshot({path:outDir+'/47-portrait-crowd.png'});

await browser.close();
