import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// 使用玩家真正能看到的对照页，不把另造的测试图当成 UI 截图。
export async function reviewFaceCatalog({ page, choose, proof, ready, screenshot, noOverflow, state, source }) {
  const catalog = await page.evaluate(async () => {
    const m = await import('/src/portrait-composer-lab/model.ts');
    return { frames: m.choices.frame.map(item => item.id), faces: m.choices.faceFamilyId.map(item => item.id), outfits: m.choices.outfitStyleId.map(item => item.id), defaultLook: m.defaultLook };
  });
  assert.equal(catalog.faces.length, 8);
  const exportDir = 'review-screenshots/composer/face-exports';
  await mkdir(exportDir, { recursive: true });
  const hashes = [], samples = [];
  async function pixelProof() {
    const measured = await page.locator('[data-face-pixel]').evaluateAll(images => images.map(image => ({ size: +image.dataset.facePixel, width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height })));
    assert.equal(measured.length, 24);
    for (const item of measured) { assert.equal(item.width, item.size); assert.equal(item.height, item.size); }
  }
  for (const frame of catalog.frames) {
    await choose('frame', frame);
    for (const [key, value] of Object.entries(catalog.defaultLook)) if (key !== 'version' && key !== 'frame') await choose(key, value);
    await proof('faceFamilyId');
    assert.equal(await page.locator('[data-choice-key="faceFamilyId"]').count(), 8);
    const before = await state();
    const matrix = await page.locator('[data-proof-item]').evaluateAll(items => items.map(item => JSON.parse(item.dataset.proofLook)));
    assert.deepEqual(matrix.map(item => item.faceFamilyId), catalog.faces);
    for (const item of matrix) for (const key of Object.keys(before)) if (key !== 'faceFamilyId') assert.equal(item[key], before[key], `Face overview changed ${key}`);
    await pixelProof(); await noOverflow();
    await screenshot(`20-faces-${frame}-paper`, page.locator('.pc-proof'));
    await page.locator('[data-theme="night"]').click();
    await screenshot(`21-faces-${frame}-night`, page.locator('.pc-proof'));
    await page.locator('[data-theme="paper"]').click();
    for (const face of catalog.faces) {
      const button = page.locator(`[data-use-face="${face}"]`);
      await button.focus(); await page.keyboard.press('Enter'); await ready();
      const selected = await state();
      assert.equal(selected.faceFamilyId, face);
      for (const key of Object.keys(before)) if (key !== 'faceFamilyId') assert.equal(selected[key], before[key], `Face selection changed ${key}`);
      const src = await source();
      assert.equal(src, await button.locator('..').locator(':scope > img').getAttribute('src'));
      const svg = decodeURIComponent(src.slice(src.indexOf(',') + 1));
      const name = `${frame}-${face}`;
      await writeFile(`${exportDir}/${name}.svg`, svg);
      await writeFile(`${exportDir}/${name}.json`, JSON.stringify(selected, null, 2));
      const png = await sharp(Buffer.from(svg)).resize(256,256).png().toBuffer();
      await writeFile(`${exportDir}/${name}.png`, png);
      const small = await sharp(Buffer.from(svg)).resize(48,48).raw().toBuffer();
      hashes.push(createHash('sha256').update(small).digest('hex'));
      samples.push(name);
    }
    await proof('faces-outfits');
    const combinations = await page.locator('[data-proof-item]').evaluateAll(items => items.map(item => JSON.parse(item.dataset.proofLook)));
    assert.equal(combinations.length, 48);
    const expected = catalog.faces.flatMap(face => catalog.outfits.map(outfit => `${face}:${outfit}`));
    assert.deepEqual(combinations.map(item => `${item.faceFamilyId}:${item.outfitStyleId}`), expected);
    for (const item of combinations) { assert.equal(item.frame, frame); assert.equal(item.hairStyleId, before.hairStyleId); assert.equal(item.headwearStyleId, before.headwearStyleId); assert.equal(item.skinPaletteId, before.skinPaletteId); }
    await screenshot(`22-faces-outfits-${frame}`, page.locator('.pc-proof'));
  }
  assert.equal(new Set(hashes).size, 16, '48px exports contain duplicate full portraits');
  // 旧配方与新增 ID 都通过真正的导入控件，并在刷新后保留。原有字段和版本不变。
  for (const face of ['gentle', 'round', 'long', 'square', 'heart']) {
    const recipe = { ...catalog.defaultLook, faceFamilyId: face, headwearStyleId: 'scholar', outfitStyleId: 'official' };
    await page.locator('[data-import]').setInputFiles({ name: 'face-recipe.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(recipe)) });
    await page.waitForFunction(id => JSON.parse(document.querySelector('[data-composer]').dataset.look).faceFamilyId === id, face);
    assert.deepEqual(await state(), recipe);
    await page.reload({ waitUntil: 'networkidle' }); await ready(); assert.deepEqual(await state(), recipe);
  }
  await choose('headwearStyleId', 'none'); await choose('outfitStyleId', 'plain'); await proof('faceFamilyId');
  await page.setViewportSize({ width: 390, height: 844 }); await pixelProof(); await noOverflow();
  await screenshot('23-mobile-face-catalog', page.locator('.pc-proof'));
  await page.setViewportSize({ width: 320, height: 800 }); await pixelProof(); await noOverflow();
  await page.setViewportSize({ width: 1600, height: 1100 });
  await writeFile('review-screenshots/composer/face-review.json', JSON.stringify({
    commit: process.env.GITHUB_SHA ?? 'local', status: 'automated-pass', samples,
    sharedWardrobeFaceOverviews: 16, actualSizeSamples: 48, faceOutfitSamples: 96,
    distinct48pxRasters: new Set(hashes).size, recipeImports: 5,
    note: 'Raster uniqueness is only a duplicate check, not artistic quality or recognition certification. Actual screenshots require inspection.',
  }, null, 2));
}
