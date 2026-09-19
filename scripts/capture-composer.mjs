import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { reviewFaceCatalog } from './capture-composer-faces.mjs';

const out = 'review-screenshots/composer';
await mkdir(out, { recursive: true });
const checks = [], errors = [];
async function isolate(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) await isolate(child);
    else if (/\.tsx?$/.test(child)) assert(!/from\s+['"][^'"]*(?:resident\/portrait|portrait-style|portrait-art-directions)/.test(await readFile(child, 'utf8')), `Unexpected art/runtime dependency: ${child}`);
  }
}
await isolate('Web/src/portrait-composer-lab');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const base = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const route = base + '/?view=portrait-composer-lab';
const root = page.locator('[data-composer]');
const state = async () => JSON.parse(await root.getAttribute('data-look'));
const source = async () => page.locator('[data-main-portrait]').getAttribute('src');
async function ready() {
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
}
async function choose(key, value) {
  if (['faceFamilyId','hairStyleId','headwearStyleId','outfitStyleId'].includes(key)) await page.locator(`[data-category="${key}"]`).click();
  await page.locator(`[data-choice-key="${key}"][data-choice="${value}"]`).click();
  await page.waitForFunction(({ key, value }) => JSON.parse(document.querySelector('[data-composer]').dataset.look)[key] === value, { key, value });
  await ready();
}
async function proof(mode) {
  if (mode === 'faceFamilyId') await page.locator('[data-category="faceFamilyId"]').click();
  await page.locator(`[data-proof="${mode}"]`).click(); await page.locator(`[data-proof-mode="${mode}"]`).waitFor(); await ready();
}
async function screenshot(name, locator = page) {
  await ready();
  const options = { path: join(out, name + '.png'), animations: 'disabled', caret: 'hide' };
  if (locator === page) await page.screenshot({ ...options, fullPage: true }); else await locator.screenshot(options);
}
async function noOverflow() { assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Page overflow'); }
async function pixels() {
  const measurements = await page.locator('[data-pixel-size]').evaluateAll(images => images.map(image => ({ size: Number(image.dataset.pixelSize), width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height })));
  assert.equal(measurements.length, 3); for (const item of measurements) { assert.equal(item.width, item.size); assert.equal(item.height, item.size); }
}
async function download(kind) {
  const pending = page.waitForEvent('download'); await page.locator(`[data-export="${kind}"]`).click();
  const file = await pending; const stream = await file.createReadStream(); const chunks = []; for await (const chunk of stream) chunks.push(chunk);
  const bytes = Buffer.concat(chunks); await writeFile(join(out, file.suggestedFilename()), bytes); return bytes;
}
try {
  await page.goto(route, { waitUntil: 'networkidle' }); await root.waitFor(); await ready();
  const audit = await page.evaluate(async () => {
    const m = await import('/src/portrait-composer-lab/model.ts');
    const r = await import('/src/portrait-composer-lab/render.ts');
    function ensure(value, message) { if (!value) throw new Error(message); }
    ensure(m.choices.frame.length === 2 && m.choices.faceFamilyId.length === 8, 'Expected 2 adult frames with 8 faces each');
    let count = 0;
    const parser = new DOMParser(), wardrobeLayers = new Map(), uniqueFaces = new Set();
    for (const frame of m.choices.frame) {
      const outlines = new Set();
      for (const face of m.choices.faceFamilyId) {
        const reference = { ...m.defaultLook, frame: frame.id, faceFamilyId: face.id };
        const faceArt = r.renderPlan(reference).find(layer => layer.name === 'Face').svg;
        uniqueFaces.add(faceArt);
        const faceDoc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${faceArt}</svg>`, 'image/svg+xml');
        // 两个耳朵和耳内线之后，第一张面部底色轮廓。不能靠配色冒充不同脸型。
        const outline = faceDoc.querySelectorAll('path')[3];
        ensure(outline, 'Missing full face outline'); outlines.add(outline.getAttribute('d'));
        for (const hair of m.choices.hairStyleId) for (const hat of m.choices.headwearStyleId) for (const outfit of m.choices.outfitStyleId) {
          const look = m.parseLook({ ...reference, hairStyleId: hair.id, headwearStyleId: hat.id, outfitStyleId: outfit.id });
          const layers = r.renderPlan(look), svg = r.renderPortrait(look);
          ensure(layers.find(layer => layer.name === 'Face').svg === faceArt, 'Wardrobe changed face art');
          const wardrobeKey = [frame.id,hair.id,hat.id,outfit.id].join(':');
          const wardrobe = layers.filter(layer => layer.name !== 'Face').map(layer => layer.svg).join('|');
          if (!wardrobeLayers.has(wardrobeKey)) wardrobeLayers.set(wardrobeKey, wardrobe);
          else ensure(wardrobeLayers.get(wardrobeKey) === wardrobe, 'Face change altered shared wardrobe or neck');
          ensure(layers.find(layer => layer.name === 'Outfit').svg.length > 100, 'Missing outfit');
          ensure(m.wearMode(look) !== 'tucked' || layers.find(layer => layer.name === 'HairVolume').svg === '', 'Hair volume protrudes through hat');
          ensure(!/transform=|<mask|<clipPath|<image|<script|<foreignObject/.test(svg), 'Unexpected solver or unsafe SVG');
          ensure(parser.parseFromString(svg, 'image/svg+xml').querySelector('parsererror') === null, 'Invalid SVG XML');
          ensure(svg.includes('viewBox="0 0 256 256"'), 'Canvas changed'); count++;
        }
        for (let seed = 1; seed <= 100; seed++) {
          const next = m.randomLook(reference, true, seed); m.parseLook(next);
          ensure(next.faceFamilyId === reference.faceFamilyId && next.skinPaletteId === reference.skinPaletteId && next.frame === reference.frame, 'Random wardrobe changed identity');
          ensure(JSON.stringify(next) === JSON.stringify(m.randomLook(reference, true, seed)), 'Random seed not deterministic');
          m.parseLook(m.randomLook(reference, false, seed));
        }
      }
      ensure(outlines.size === 8, 'Repeated face outlines');
    }
    ensure(uniqueFaces.size === 16, 'Expected 16 complete independent face assets');
    ensure(count === m.geometryCombinationCount && count === 2880, 'Expected 2880 basic combinations');
    const initial = JSON.stringify(m.defaultLook); m.randomLook(m.defaultLook, false, 90); ensure(JSON.stringify(m.defaultLook) === initial, 'Random generator mutated original');
    for (const invalid of [null, [], {}, { ...m.defaultLook, version: 2 }, { ...m.defaultLook, faceFamilyId: 'unknown-face' }, { ...m.defaultLook, headwearStyleId: '<script>' }, { ...m.defaultLook, frame: 'female.child' }, { ...m.defaultLook, extra: 1 }]) {
      let rejected = false; try { m.parseLook(invalid); } catch { rejected = true; } ensure(rejected, 'Invalid recipe accepted');
    }
    return { basicCombinations: count, identityRandomSeedsPerFace: 100, faces: uniqueFaces.size, frameIds: m.choices.frame.map(item => item.id), faceIds: m.choices.faceFamilyId.map(item => item.id), hairOptionsPerFrame: 6, headwearOptions: 5, outfitOptions: 6 };
  });
  checks.push('2880 legal SVG combinations: wardrobe swaps preserve Face; changing Face preserves every shared hair/headwear/outfit/neck layer; 16 complete faces with distinct outlines');
  await pixels(); await noOverflow(); await screenshot('01-composer-female', page.locator('.pc-workspace'));
  await proof('hairStyleId'); await screenshot('02-same-face-hair', page.locator('.pc-proof'));
  await proof('headwearStyleId'); await screenshot('03-same-face-headwear', page.locator('.pc-proof'));
  await proof('outfitStyleId'); await screenshot('04-same-face-outfits', page.locator('.pc-proof'));
  await choose('hairStyleId', 'high-knot'); await choose('headwearStyleId', 'none');
  const unhat = await source(), identity = await state();
  for (let cycle = 0; cycle < 4; cycle++) for (const hat of ['wrap', 'scholar', 'straw', 'crown']) {
    await choose('headwearStyleId', hat); const current = await state();
    assert.equal(current.hairStyleId, identity.hairStyleId); assert.equal(current.faceFamilyId, identity.faceFamilyId);
    await choose('headwearStyleId', 'none'); assert.equal(await source(), unhat);
  }
  checks.push('16 hat-on/off cycles restore byte-identical art without changing hair or face ID');
  await reviewFaceCatalog({ page, choose, proof, ready, screenshot, noOverflow, state, source });
  checks.push('All 16 faces in equal-wardrobe overviews; 48 native-size samples; 96 face/outfit samples; keyboard selection; old/new recipes; mobile gallery');

  for (const frame of audit.frameIds) {
    await choose('frame', frame); await choose('headwearStyleId', 'none'); await choose('outfitStyleId', 'plain');
    for (const face of audit.faceIds) {
      await choose('faceFamilyId', face); await proof('pairs');
      assert.equal(await page.locator('[data-proof-item]').count(), 30);
      const looks = await page.locator('[data-proof-item]').evaluateAll(items => items.map(item => JSON.parse(item.dataset.proofLook)));
      assert(looks.every(look => look.frame === frame && look.faceFamilyId === face));
      await screenshot(`05-pairs-${frame}-${face}`, page.locator('.pc-proof'));
    }
    await choose('faceFamilyId', 'square'); await proof('outfitStyleId'); await screenshot(`06-outfits-${frame}`, page.locator('.pc-proof'));
  }
  checks.push('480 rendered face/hair/headwear samples; 30 pairings for every one of the 16 faces');
  await choose('faceFamilyId','square'); await choose('headwearStyleId','crown'); await choose('outfitStyleId','royal'); await choose('outfitPaletteId','gold');
  await screenshot('07-composer-male-royal', page.locator('.pc-workspace'));
  await page.locator('[data-theme="night"]').click(); await screenshot('08-night', page.locator('.pc-workspace')); await pixels();
  await proof('crowd'); assert.equal(await page.locator('[data-proof-item]').count(), 24); await screenshot('09-crowd-night',page.locator('.pc-proof'));
  await page.locator('[data-theme="paper"]').click(); await screenshot('10-crowd-paper',page.locator('.pc-proof'));
  await screenshot('11-actual-pixels',page.locator('.pc-checks'));

  const beforeRandom = await state(); await page.locator('[data-shuffle]').click(); await ready();
  const randomized = await state(); assert.equal(randomized.faceFamilyId,beforeRandom.faceFamilyId); assert.equal(randomized.skinPaletteId,beforeRandom.skinPaletteId); assert.notEqual(randomized.hairStyleId,beforeRandom.hairStyleId);
  const saved = await state(); const savedImage = await source(); await page.reload({waitUntil:'networkidle'}); await ready(); assert.deepEqual(await state(),saved); assert.equal(await source(),savedImage);
  const recipe = await download('json'); assert.deepEqual(JSON.parse(recipe.toString()),saved);
  const svg = await download('svg'); assert(svg.toString().startsWith('<svg ')); assert(svg.toString().includes('data-layer="Face"'));
  const png = await download('png'); const metadata = await sharp(png).metadata(); assert.equal(metadata.width,512); assert.equal(metadata.height,512); assert.equal(metadata.hasAlpha,true);
  const alpha = await sharp(png).ensureAlpha().raw().toBuffer(); assert.equal(alpha[3],0, 'PNG background must remain transparent');
  await page.locator('[data-reset]').click(); await ready();
  await page.locator('[data-import]').setInputFiles({name:'recipe.json',mimeType:'application/json',buffer:recipe});
  await page.waitForFunction(expected => document.querySelector('[data-composer]').dataset.look === expected,JSON.stringify(saved)); assert.equal(await source(),savedImage);
  await page.locator('[data-import]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":2}')});
  await page.waitForFunction(() => document.querySelector('[data-feedback]').textContent.includes('版本不支持'));
  assert.deepEqual(await state(),saved);
  await page.locator('[data-share]').click();
  await page.waitForFunction(() => document.querySelector('[data-feedback]').textContent.includes('链接已复制'));
  const link = await page.evaluate(() => navigator.clipboard.readText()); assert.deepEqual(JSON.parse(new URL(link).searchParams.get('look')),saved);
  await page.goto(link,{waitUntil:'networkidle'}); await ready(); assert.deepEqual(await state(),saved);
  await choose('headwearStyleId','none'); const modifiedLinkLook=await state(); await page.reload({waitUntil:'networkidle'}); await ready(); assert.deepEqual(await state(),modifiedLinkLook);
  checks.push('Real downloads, transparent PNG, saved recipes, invalid import protection, shared links and post-share edits survive reload');

  await page.setViewportSize({width:390,height:844}); await choose('frame','female.adult'); await choose('headwearStyleId','crown'); await choose('outfitStyleId','noble');
  await pixels(); await noOverflow(); await screenshot('12-mobile-composer');
  await page.setViewportSize({width:320,height:800}); await pixels(); await noOverflow();
  checks.push('Exact 96/64/48 CSS pixels at DPR 1 on desktop, 390px and 320px; no horizontal overflow');
  assert.deepEqual(errors,[],'Browser errors');
  await writeFile(join(out,'review.json'),JSON.stringify({commit:process.env.GITHUB_SHA??'local',status:'automated-pass',...audit,checks,artisticApproval:'Requires actual screenshot inspection; CI is not art approval',boundary:'Adult experimental composer only; production DNA and 6-frame runtime unchanged'},null,2));
  console.log(checks.join('\n'));
} catch(error) {
  await screenshot('failure').catch(()=>{}); await writeFile(join(out,'failure.txt'),String(error)+'\n'+errors.join('\n')); throw error;
} finally { await browser.close(); }
