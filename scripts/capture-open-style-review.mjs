import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const out = 'review-screenshots/open-styles';
await mkdir(join(out, 'exports'), { recursive: true });
const hashes = {
  'cel-woman21': '714e602c08087cc638be3793e92d87f900e1202e',
  'cel-man32': '96f7eee7101420d78546274bbc2b9fd91e73f9bd',
  'paint-woman21': 'd32f8b19fdbcc6f525c413f12d5fff960780034b',
  'paint-man32': '0cf39ad68a6099857e604b387dfbcedb9c19bd72',
  'sculpt-woman21': 'fdbf96ce7310db12c4b41f94a7ba7109363ea194',
  'sculpt-man32': '98d8ba04e33b2d0b9480ff7bdc1661b425af9eb1',
  'graphic-woman21': '7d9b52e8d1bce7cf195c45bdea2f500ec7827355',
  'graphic-man32': '6e36c0ec46344692c9642b6e94ead08cf71b9ebd',
};
for (const [name, expected] of Object.entries(hashes)) {
  const bytes = await readFile(`Web/public/portrait-open-styles/${name}.avif`);
  const digest = createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
  assert.equal(digest, expected, `Asset bytes differ: ${name}`);
  const metadata = await sharp(bytes).metadata(); assert.equal(metadata.width, 256); assert.equal(metadata.height, 342);
  await sharp(bytes).png().toFile(join(out, 'exports', name + '.png'));
}
assert.equal(new Set(Object.values(hashes)).size, 8);
async function isolation(directory) {
  for (const file of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, file.name);
    if (file.isDirectory()) await isolation(path);
    else if (/\.tsx?$/.test(path)) assert(!/from\s+['"][^'"]*(?:resident\/portrait|portrait-composer|portrait-anime-lab|portrait-modern-anime-lab)/.test(await readFile(path,'utf8')), `Unexpected old renderer import: ${path}`);
  }
}
await isolation('Web/src/portrait-open-styles');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
const base = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const route = base + '/?view=portrait-style-directions-v2';
const state = async () => JSON.parse(await page.locator('[data-open-styles]').getAttribute('data-state'));
async function ready() { await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode())); }); }
async function selected(id) {
  await page.locator(`[data-inspect-style="${id}"]`).click();
  await page.locator(`[data-inspector="${id}"]`).waitFor(); await ready();
}
async function capture(name, locator = page) {
  await ready();
  const settings = { path: join(out, name + '.png'), animations: 'disabled', caret: 'hide' };
  if (locator === page) await page.screenshot({ ...settings, fullPage: true }); else await locator.screenshot(settings);
}
async function pixels() {
  const rows = await page.locator('[data-pixel-size]').evaluateAll(images => images.map(img => ({ size: Number(img.dataset.pixelSize), w: img.getBoundingClientRect().width, h: img.getBoundingClientRect().height, loaded: img.naturalWidth })));
  assert.equal(rows.length, 6);
  for (const row of rows) { assert.equal(row.w, row.size); assert.equal(row.h, row.size); assert.equal(row.loaded, 256); }
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow');
}
try {
  await page.goto(route, { waitUntil: 'networkidle' }); await ready();
  assert.equal(await page.locator('[data-style-card]').count(), 4);
  assert.deepEqual(await page.locator('[data-overview] [data-art]').evaluateAll(images => images.map(img => img.dataset.art)), Object.keys(hashes));
  assert.equal(await page.locator('[data-overview] figcaption').filter({hasText:'21岁女子'}).count(),4);
  assert.equal(await page.locator('[data-overview] figcaption').filter({hasText:'32岁男子'}).count(),4);
  await page.evaluate(() => { for (const key of ['wanhu.portrait-composer.v1','wanhu.portrait-anime.v1','wanhu.modern-anime.v1','unrelated.setting']) localStorage.setItem(key,'unchanged-sentinel'); });
  await pixels(); await capture('01-overview', page.locator('[data-overview]')); await capture('00-page');
  const beforeSources = await page.locator('[data-overview] img').evaluateAll(imgs => imgs.map(img => img.src));
  await page.locator('[data-toggle-names]').click(); await page.locator('[data-toggle-gray]').click();
  assert(await page.locator('[data-overview] img').evaluateAll(imgs => imgs.every(img => getComputedStyle(img).filter === 'grayscale(1)')));
  assert.deepEqual(await page.locator('[data-overview] img').evaluateAll(imgs => imgs.map(img => img.src)), beforeSources);
  assert.equal(await page.locator('[data-reference]').count(),0);
  await capture('02-overview-gray-no-names', page.locator('[data-overview]'));
  await page.locator('[data-toggle-names]').click(); await page.locator('[data-toggle-gray]').click();
  const records = [];
  for (const id of ['cel','paint','sculpt','graphic']) {
    await selected(id); assert.equal((await state()).selected,id);
    await pixels();
    for (const person of ['woman21','man32']) {
      const current = page.locator(`[data-subject-proof="${person}"]`);
      assert.equal(await current.locator(':scope > img').getAttribute('src'),`/portrait-open-styles/${id}-${person}.avif`);
      await capture(`04-${id}-${person}`,current);
      await page.locator(`[data-ui-subject="${person}"]`).focus(); await page.keyboard.press('Enter');
      await ready(); assert.equal(await page.locator('.ops-identity img').getAttribute('src'),`/portrait-open-styles/${id}-${person}.avif`);
      await page.locator('[data-scene-button="day"]').click();
      const color = await page.locator('[data-ui-panel]').evaluate(el => getComputedStyle(el).backgroundColor);
      await capture(`05-${id}-${person}-bright-ui`,page.locator('.ops-world'));
      await page.locator('[data-scene-button="dim"]').click();
      assert.equal(await page.locator('[data-ui-panel]').evaluate(el => getComputedStyle(el).backgroundColor),color,'Changing world light recolored UI surface');
      await capture(`06-${id}-${person}-dim-ui`,page.locator('.ops-world'));
      records.push({style:id,subject:person,sizes:[96,64,48],panelColor:color});
    }
    await page.locator('[data-scene-button="day"]').click();
    await capture(`03-${id}-inspector`,page.locator('[data-inspector]'));
    await page.locator('[data-reference] summary').click();
    const reference = await page.locator('[data-reference] a').getAttribute('href'); assert(reference.startsWith('https://'));
    await capture(`07-${id}-reference`,page.locator('.ops-ui-proof'));
    await page.locator('[data-reference] summary').click();
  }
  await selected('cel'); await page.locator('[data-shortlist]').click();
  await selected('graphic'); await page.locator('[data-shortlist]').click();
  assert.deepEqual((await state()).shortlist,['cel','graphic']);
  const saved=await state(); await page.reload({waitUntil:'networkidle'}); await ready(); assert.deepEqual(await state(),saved);
  const pending=page.waitForEvent('download'); await page.locator('[data-export-choices]').click(); const download=await pending;
  const chunks=[]; for await(const chunk of await download.createReadStream())chunks.push(chunk);
  const content=Buffer.concat(chunks); assert.deepEqual(JSON.parse(content.toString()),saved); await writeFile(join(out,download.suggestedFilename()),content);
  const validation=await page.evaluate(async()=>{
    const {parsePreferences}=await import('/src/portrait-open-styles/catalog.ts');
    return [null,[],{}, {version:1,selected:'bad',shortlist:[]}, {version:1,selected:'cel',shortlist:['cel','cel']}, {version:1,selected:'cel',shortlist:[],extra:true}].map(v=>{try{parsePreferences(v);return false;}catch{return true;}});
  }); assert(validation.every(Boolean));
  await page.locator('[data-clear-choices]').click(); assert.deepEqual(await state(),{version:1,selected:'cel',shortlist:[]});
  assert.deepEqual(await page.evaluate(()=>['wanhu.portrait-composer.v1','wanhu.portrait-anime.v1','wanhu.modern-anime.v1','unrelated.setting'].map(key=>localStorage.getItem(key))),Array(4).fill('unchanged-sentinel'));
  await page.setViewportSize({width:390,height:844}); await selected('sculpt'); await pixels(); await capture('08-mobile-inspector',page.locator('[data-inspector]')); await capture('09-mobile-card',page.locator('[data-style-card="sculpt"]'));
  await page.setViewportSize({width:320,height:800}); await pixels();
  await page.evaluate(()=>localStorage.setItem('wanhu.portrait-open-styles.v1','{broken')); await page.reload({waitUntil:'networkidle'}); await ready(); assert.equal((await state()).selected,'cel'); await pixels();
  assert.deepEqual(errors,[],'Browser errors');
  await writeFile(join(out,'review.json'),JSON.stringify({commit:process.env.GITHUB_SHA??'local',status:'automated-pass',styles:4,independentAssets:8,nativeSamples:24,uiContexts:16,records,assetGitHashes:hashes,viewportWidths:[1600,390,320],legacyStorage:'unchanged',uiReference:{repository:'JiongXiaGu/wanhu-ui-prototype',commit:'81572157516870ea69f4efa153351c060cb2847e',surface:'Smoked Graphite + Aged Brass'},artisticApproval:'Requires actual review of independent faces, style separation, gray diagnostics, age impression and real UI screenshots; byte uniqueness is not an art score.',scope:'Eight generated raster concept studies, not a modular avatar creator, not 3D models, no automatic age recognition.'},null,2));
  console.log('Open styles: 8 verified assets, 24 native-size samples, 16 UI contexts, keyboard selection, isolated preferences and mobile checks passed.');
} catch (error) { await capture('failure').catch(()=>{}); await writeFile(join(out,'failure.txt'),String(error)+'\n'+errors.join('\n')); throw error; }
finally { await browser.close(); }
